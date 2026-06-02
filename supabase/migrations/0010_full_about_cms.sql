-- ─────────────────────────────────────────────────────────────────────────────
-- 0010_full_about_cms.sql — Comprehensive About page architecture
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Singleton table for page-level content
create table if not exists public.about_page (
  id text primary key check (id = 'about'),
  
  -- Hero
  hero_eyebrow_en text,
  hero_eyebrow_ta text,
  hero_title_en text,
  hero_title_ta text,
  hero_subtitle_en text,
  hero_subtitle_ta text,
  
  -- Story
  story_title_en text,
  story_title_ta text,
  story_en text,
  story_ta text,
  
  -- Mission
  mission_title_en text,
  mission_title_ta text,
  mission_en text,
  mission_ta text,
  
  -- Founder
  founder_title_en text,
  founder_title_ta text,
  founder_name_en text,
  founder_name_ta text,
  founder_role_en text,
  founder_role_ta text,
  founder_bio_en text,
  founder_bio_ta text,
  founder_image_url text,
  
  -- Credentials
  credentials_title_en text,
  credentials_title_ta text,
  credentials_desc_en text,
  credentials_desc_ta text,
  
  updated_at timestamptz default now()
);

-- 2. Collection: Why choose us
create table if not exists public.about_why_choose_us (
  id uuid primary key default gen_random_uuid(),
  text_en text not null,
  text_ta text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- 3. Collection: Facilities
create table if not exists public.about_facilities (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ta text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- 4. Collection: Trainers
create table if not exists public.about_trainers (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ta text not null,
  role_en text,
  role_ta text,
  bio_en text,
  bio_ta text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- 5. Enable RLS
alter table public.about_page enable row level security;
alter table public.about_why_choose_us enable row level security;
alter table public.about_facilities enable row level security;
alter table public.about_trainers enable row level security;

-- 6. Seed canonical row
insert into public.about_page (id) values ('about') on conflict do nothing;

-- 7. Policies
-- Public READ
create policy "public read about_page" on public.about_page for select to anon, authenticated using (true);
create policy "public read about_why" on public.about_why_choose_us for select to anon, authenticated using (true);
create policy "public read about_facilities" on public.about_facilities for select to anon, authenticated using (true);
create policy "public read about_trainers" on public.about_trainers for select to anon, authenticated using (true);

-- Admin WRITE
create policy "admin update about_page" on public.about_page for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all about_why" on public.about_why_choose_us for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all about_facilities" on public.about_facilities for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all about_trainers" on public.about_trainers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 8. Cleanup legacy 'about' table from Task 3
drop table if exists public.about cascade;
