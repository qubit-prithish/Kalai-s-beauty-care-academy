-- ─────────────────────────────────────────────────────────────────────────────
-- 0002_rls.sql — Row Level Security
-- Public (anon) reads published/active content only. Writes are admin-only.
-- Enquiries: public INSERT, admin read/update/delete. Page views: public INSERT.
-- ─────────────────────────────────────────────────────────────────────────────

-- Registry of admin auth users. The create-admin script inserts the user's id.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Only admins can read the admins list; no public access.
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- is_admin(): true when the current auth user is in public.admins.
-- SECURITY DEFINER so the policy check can read admins regardless of its own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Enable RLS everywhere.
alter table public.courses      enable row level security;
alter table public.services     enable row level security;
alter table public.gallery      enable row level security;
alter table public.testimonials enable row level security;
alter table public.offers       enable row level security;
alter table public.blog_posts   enable row level security;
alter table public.faqs         enable row level security;
alter table public.enquiries    enable row level security;
alter table public.settings     enable row level security;
alter table public.page_views   enable row level security;

-- ── Helper: standard admin-write policies (INSERT/UPDATE/DELETE) ───────────────
-- (Written inline per table since policy bodies can't be parameterized.)

-- COURSES: anon reads published; admin full write.
drop policy if exists "courses public read"  on public.courses;
drop policy if exists "courses admin write"  on public.courses;
create policy "courses public read" on public.courses
  for select to anon, authenticated using (published = true or public.is_admin());
create policy "courses admin write" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- SERVICES
drop policy if exists "services public read" on public.services;
drop policy if exists "services admin write" on public.services;
create policy "services public read" on public.services
  for select to anon, authenticated using (published = true or public.is_admin());
create policy "services admin write" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- BLOG POSTS
drop policy if exists "blog public read" on public.blog_posts;
drop policy if exists "blog admin write" on public.blog_posts;
create policy "blog public read" on public.blog_posts
  for select to anon, authenticated using (published = true or public.is_admin());
create policy "blog admin write" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- OFFERS: anon reads active (and within date window if set).
drop policy if exists "offers public read" on public.offers;
drop policy if exists "offers admin write" on public.offers;
create policy "offers public read" on public.offers
  for select to anon, authenticated using (
    public.is_admin()
    or (active = true
        and (starts_at is null or starts_at <= now())
        and (ends_at   is null or ends_at   >= now()))
  );
create policy "offers admin write" on public.offers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- GALLERY: readable by all; admin write.
drop policy if exists "gallery public read" on public.gallery;
drop policy if exists "gallery admin write" on public.gallery;
create policy "gallery public read" on public.gallery
  for select to anon, authenticated using (true);
create policy "gallery admin write" on public.gallery
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- TESTIMONIALS: readable by all; admin write.
drop policy if exists "testimonials public read" on public.testimonials;
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select to anon, authenticated using (true);
create policy "testimonials admin write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- FAQS: anon reads published; admin write.
drop policy if exists "faqs public read" on public.faqs;
drop policy if exists "faqs admin write" on public.faqs;
create policy "faqs public read" on public.faqs
  for select to anon, authenticated using (published = true or public.is_admin());
create policy "faqs admin write" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- SETTINGS: readable by all (NAP/hours/socials are public); admin write.
drop policy if exists "settings public read" on public.settings;
drop policy if exists "settings admin write" on public.settings;
create policy "settings public read" on public.settings
  for select to anon, authenticated using (true);
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ENQUIRIES: public INSERT (form). Admin read/update/delete. No public SELECT.
drop policy if exists "enquiries public insert" on public.enquiries;
drop policy if exists "enquiries admin read"    on public.enquiries;
drop policy if exists "enquiries admin update"  on public.enquiries;
drop policy if exists "enquiries admin delete"  on public.enquiries;
create policy "enquiries public insert" on public.enquiries
  for insert to anon, authenticated with check (true);
create policy "enquiries admin read" on public.enquiries
  for select to authenticated using (public.is_admin());
create policy "enquiries admin update" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "enquiries admin delete" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- PAGE VIEWS: public INSERT (analytics beacon). Admin SELECT only.
drop policy if exists "page_views public insert" on public.page_views;
drop policy if exists "page_views admin read"    on public.page_views;
create policy "page_views public insert" on public.page_views
  for insert to anon, authenticated with check (true);
create policy "page_views admin read" on public.page_views
  for select to authenticated using (public.is_admin());
