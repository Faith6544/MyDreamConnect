-- Fix album_photos so it can actually store image URLs.
--
-- PROBLEM: `album_photos.image_url` is `bigint` in the live database, but the
-- admin UI (AdminAlbumPhotos -> ImageUpload) stores a public storage URL
-- string there. Postgres rejects every insert with:
--   22P02  invalid input syntax for type bigint: "https://..."
-- so "Add Photo" has never worked.
--
-- Also, anon/service-role writes returned:
--   42501  permission denied for table album_photos
--
-- Run this in the Supabase SQL editor (or `supabase db push`).

-- 1. Widen the column to text so URLs fit.
ALTER TABLE public.album_photos
  ALTER COLUMN image_url TYPE text USING image_url::text;

-- 2. Make sure the API roles can actually write to it.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.album_photos TO authenticated;
GRANT ALL ON public.album_photos TO service_role;

-- 3. Also ensure the sequence is usable when id is a bigserial.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 4. RLS: allow signed-in users to read, and admins to write.
--    (Adjust to your auth model; this matches the client-side AdminRoute gate.)
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "album_photos public read" ON public.album_photos;
CREATE POLICY "album_photos public read"
  ON public.album_photos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "album_photos admin write" ON public.album_photos;
CREATE POLICY "album_photos admin write"
  ON public.album_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND btrim(p.role, '''') = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND btrim(p.role, '''') = 'admin'
    )
  );
