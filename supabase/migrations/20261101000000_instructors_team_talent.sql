-- Run this whole file once in the Supabase SQL editor.
-- It needs the is_admin() function from the earlier security script.

begin;

-- ---------------------------------------------------------------- team profiles
alter table public.team_members add column if not exists achievements text;
alter table public.team_members add column if not exists links jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------- talent profiles
alter table public.talent add column if not exists bio text;
alter table public.talent add column if not exists portfolio_links jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------- instructor applications
create table if not exists public.instructor_applications (
  id            bigint generated always as identity primary key,
  course_id     bigint not null references public.courses(id) on delete cascade,
  user_id       uuid   not null references auth.users(id) on delete cascade,
  full_name     text   not null,
  email         text   not null,
  phone         text,
  qualifications text,
  experience    text,
  profile_link  text,
  motivation    text,
  document_paths text[] not null default '{}',
  status        text   not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  admin_note    text,
  token         uuid   not null default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  confirmed_at  timestamptz
);

create unique index if not exists instructor_applications_one_open
  on public.instructor_applications (course_id, user_id)
  where status in ('pending', 'approved');

alter table public.instructor_applications enable row level security;

drop policy if exists "apps insert own" on public.instructor_applications;
drop policy if exists "apps read own" on public.instructor_applications;
drop policy if exists "apps admin all" on public.instructor_applications;

-- a logged in person can only apply as themselves, and only as pending
create policy "apps insert own" on public.instructor_applications
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');

create policy "apps read own" on public.instructor_applications
  for select to authenticated
  using (user_id = auth.uid());

create policy "apps admin all" on public.instructor_applications
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- confirmed instructors
create table if not exists public.course_instructors (
  id             bigint generated always as identity primary key,
  course_id      bigint not null references public.courses(id) on delete cascade,
  user_id        uuid   not null references auth.users(id) on delete cascade,
  application_id bigint references public.instructor_applications(id) on delete set null,
  created_at     timestamptz not null default now(),
  unique (course_id, user_id)
);

alter table public.course_instructors enable row level security;

drop policy if exists "ci read own" on public.course_instructors;
drop policy if exists "ci admin all" on public.course_instructors;

create policy "ci read own" on public.course_instructors
  for select to authenticated using (user_id = auth.uid());

create policy "ci admin all" on public.course_instructors
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- is this person a confirmed instructor of the course?
create or replace function public.is_course_instructor(p_course_id bigint)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.course_instructors
    where course_id = p_course_id and user_id = auth.uid()
  );
$$;

-- instructors can read the full lessons of their course, with or without payment
drop policy if exists "lessons instructor read" on public.lessons;
create policy "lessons instructor read" on public.lessons
  for select to authenticated
  using (public.is_course_instructor(course_id));

-- the link in the approval email lands here. only the person who applied can confirm,
-- and only after the admin approved. nobody else can use the link.
create or replace function public.confirm_instructor(p_token uuid)
returns bigint
language plpgsql security definer
set search_path = public
as $$
declare
  app public.instructor_applications;
begin
  select * into app from public.instructor_applications where token = p_token;

  if app.id is null then
    raise exception 'This link is not valid.';
  end if;
  if app.user_id <> auth.uid() then
    raise exception 'Please sign in with the same account you applied with (%).', app.email;
  end if;
  if app.status <> 'approved' then
    raise exception 'This application has not been approved.';
  end if;

  insert into public.course_instructors (course_id, user_id, application_id)
  values (app.course_id, app.user_id, app.id)
  on conflict (course_id, user_id) do nothing;

  update public.instructor_applications
     set confirmed_at = coalesce(confirmed_at, now())
   where id = app.id;

  return app.course_id;
end;
$$;

grant execute on function public.confirm_instructor(uuid) to authenticated;
grant execute on function public.is_course_instructor(bigint) to authenticated;

-- ---------------------------------------------------------------- private bucket for documents
insert into storage.buckets (id, name, public)
values ('instructor-documents', 'instructor-documents', false)
on conflict (id) do nothing;

drop policy if exists "docs upload own folder" on storage.objects;
drop policy if exists "docs read own or admin" on storage.objects;

create policy "docs upload own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'instructor-documents' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "docs read own or admin" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'instructor-documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

commit;
