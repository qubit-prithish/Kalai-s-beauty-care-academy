-- ─────────────────────────────────────────────────────────────────────────────
-- 0006_ui_fields.sql — add UI-required fields the initial schema omitted, so the
-- DB stays the single source of truth and the frontend interface is satisfied
-- without any UI changes. All nullable; populated by the mock-based seed.
-- ─────────────────────────────────────────────────────────────────────────────

-- Courses: tagline, outcomes, Tamil duration, featured flag.
alter table public.courses add column if not exists tagline_en  text;
alter table public.courses add column if not exists tagline_ta  text;
alter table public.courses add column if not exists outcomes_en text[] not null default '{}';
alter table public.courses add column if not exists outcomes_ta text[] not null default '{}';
alter table public.courses add column if not exists duration_ta text;
alter table public.courses add column if not exists featured    boolean not null default false;

-- Services: tagline, Tamil duration, featured flag.
alter table public.services add column if not exists tagline_en  text;
alter table public.services add column if not exists tagline_ta  text;
alter table public.services add column if not exists duration_ta text;
alter table public.services add column if not exists featured    boolean not null default false;

-- Testimonials: Tamil role.
alter table public.testimonials add column if not exists role_ta text;

-- Gallery: bilingual category labels + media type + featured.
alter table public.gallery add column if not exists category_label_en text;
alter table public.gallery add column if not exists category_label_ta text;
alter table public.gallery add column if not exists media_type text;   -- image | video | beforeafter
alter table public.gallery add column if not exists featured boolean not null default false;
