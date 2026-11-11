-- ============================================================
-- Add the `display_order` column used by the drag-and-drop
-- reordering in the admin dashboard.
--
-- Tables that already have it: courses, posts, photos.
-- Tables that use `order_index` instead (left untouched):
--   team_members, instructors, testimonials, lessons,
--   categories, post_categories.
--
-- Run once in the Supabase SQL editor.
-- ============================================================
begin;

-- videos, jobs, flyers, talent, opportunities have no order column today,
-- which is why drag-and-drop silently fails on their admin pages.
alter table public.videos        add column if not exists display_order bigint;
alter table public.jobs          add column if not exists display_order bigint;
alter table public.flyers        add column if not exists display_order bigint;
alter table public.talent       add column if not exists display_order bigint;
alter table public.opportunities add column if not exists display_order bigint;

-- Seed the new columns with the order visitors currently see
-- (newest first), so nothing jumps around after the migration.
with ordered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.videos
)
update public.videos v set display_order = o.rn from ordered o where v.id = o.id and v.display_order is null;

with ordered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.jobs
)
update public.jobs j set display_order = o.rn from ordered o where j.id = o.id and j.display_order is null;

with ordered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.flyers
)
update public.flyers f set display_order = o.rn from ordered o where f.id = o.id and f.display_order is null;

with ordered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.talent
)
update public.talent t set display_order = o.rn from ordered o where t.id = o.id and t.display_order is null;

with ordered as (
  select id, row_number() over (order by created_at desc) as rn
  from public.opportunities
)
update public.opportunities op set display_order = o.rn from ordered o where op.id = o.id and op.display_order is null;

commit;
