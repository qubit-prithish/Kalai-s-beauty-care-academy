-- ─────────────────────────────────────────────────────────────────────────────
-- 0008_about_cms.sql — Singleton 'about' content table + storage
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create singleton table
create table if not exists public.about (
  id text primary key check (id = 'about'),
  image_url text,
  image_alt_en text,
  image_alt_ta text,
  updated_at timestamptz default now()
);

-- 2. Enable RLS
alter table public.about enable row level security;

-- 3. Seed canonical row
insert into public.about (id) values ('about') on conflict do nothing;

-- 4. Table policies
drop policy if exists "public read about" on public.about;
create policy "public read about" on public.about
  for select to anon, authenticated
  using (true);

drop policy if exists "admin update about" on public.about;
create policy "admin update about" on public.about
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- (No insert/delete needed for singleton)

-- 5. Storage bucket
insert into storage.buckets (id, name, public)
values ('about', 'about', true)
on conflict (id) do update set public = excluded.public;

-- 6. Storage policies
drop policy if exists "public read about media" on storage.objects;
create policy "public read about media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'about');

drop policy if exists "admin insert about media" on storage.objects;
create policy "admin insert about media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'about' and public.is_admin());

drop policy if exists "admin update about media" on storage.objects;
create policy "admin update about media" on storage.objects
  for update to authenticated
  using (bucket_id = 'about' and public.is_admin())
  with check (bucket_id = 'about' and public.is_admin());

drop policy if exists "admin delete about media" on storage.objects;
create policy "admin delete about media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'about' and public.is_admin());
