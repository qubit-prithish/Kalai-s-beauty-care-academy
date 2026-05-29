-- ─────────────────────────────────────────────────────────────────────────────
-- 0003_storage.sql — Storage buckets + policies
-- Buckets: gallery, courses, services, blog, banners.
-- Public READ; admin-only WRITE (insert/update/delete).
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values
  ('gallery',  'gallery',  true),
  ('courses',  'courses',  true),
  ('services', 'services', true),
  ('blog',     'blog',     true),
  ('banners',  'banners',  true)
on conflict (id) do update set public = excluded.public;

-- Public read for all five buckets (objects are world-readable).
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('gallery','courses','services','blog','banners'));

-- Admin-only writes (insert/update/delete) across the media buckets.
drop policy if exists "admin insert media" on storage.objects;
create policy "admin insert media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('gallery','courses','services','blog','banners')
    and public.is_admin()
  );

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('gallery','courses','services','blog','banners')
    and public.is_admin()
  )
  with check (
    bucket_id in ('gallery','courses','services','blog','banners')
    and public.is_admin()
  );

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('gallery','courses','services','blog','banners')
    and public.is_admin()
  );
