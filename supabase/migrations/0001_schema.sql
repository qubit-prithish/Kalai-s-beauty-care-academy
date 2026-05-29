-- ─────────────────────────────────────────────────────────────────────────────
-- 0001_schema.sql — core tables for Kalai's Beauty Care & Academy
-- uuid PKs, created_at default now(). Columns match the project brief exactly.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- Courses ────────────────────────────────────────────────────────────────────
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name_en     text not null,
  name_ta     text not null,
  duration    text,
  price       numeric,                 -- null => "Fee on enquiry"
  summary_en  text,
  summary_ta  text,
  syllabus_en text[] not null default '{}',
  syllabus_ta text[] not null default '{}',
  who_for_en  text,
  who_for_ta  text,
  image_url   text,
  certificate boolean not null default true,
  placement   boolean not null default true,
  emi         boolean not null default true,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Services ───────────────────────────────────────────────────────────────────
create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name_en        text not null,
  name_ta        text not null,
  price          numeric,              -- null => "Price on enquiry"
  duration       text,
  description_en text,
  description_ta text,
  image_url      text,
  signature      boolean not null default false,
  sort_order     integer not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Gallery ─────────────────────────────────────────────────────────────────────
create table if not exists public.gallery (
  id         uuid primary key default gen_random_uuid(),
  title_en   text,
  title_ta   text,
  category   text,
  image_url  text,
  video_url  text,
  before_url text,
  after_url  text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Testimonials ────────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  author     text not null,
  role       text,
  rating     integer not null default 5 check (rating between 1 and 5),
  text_en    text,
  text_ta    text,
  video_url  text,
  source     text,                     -- e.g. "google"
  featured   boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Offers ──────────────────────────────────────────────────────────────────────
create table if not exists public.offers (
  id             uuid primary key default gen_random_uuid(),
  title_en       text not null,
  title_ta       text not null,
  description_en text,
  description_ta text,
  badge_en       text,
  badge_ta       text,
  image_url      text,
  show_popup     boolean not null default false,
  starts_at      timestamptz,
  ends_at        timestamptz,
  active         boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- Blog posts ──────────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title_en     text not null,
  title_ta     text not null,
  excerpt_en   text,
  excerpt_ta   text,
  body_en      text,                   -- sanitized HTML (Tiptap)
  body_ta      text,                   -- sanitized HTML (Tiptap)
  cover_url    text,
  tags         text[] not null default '{}',
  published    boolean not null default true,
  published_at timestamptz not null default now()
);

-- FAQs (seeded source; settings could also hold these but a table is cleaner) ──
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_ta text not null,
  answer_en   text not null,
  answer_ta   text not null,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Enquiries (form submissions) ─────────────────────────────────────────────────
create table if not exists public.enquiries (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  phone           text not null,
  course_interest text,
  message         text,
  page_source     text,
  status          text not null default 'new',  -- new | contacted | closed
  created_at      timestamptz not null default now()
);

-- Settings (key/value JSON: hours, NAP, socials, banners) ──────────────────────
create table if not exists public.settings (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  value_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Page views (in-house analytics) ──────────────────────────────────────────────
create table if not exists public.page_views (
  id         uuid primary key default gen_random_uuid(),
  path       text not null,
  referrer   text,
  country    text,
  device     text,
  created_at timestamptz not null default now()
);

-- Helpful indexes for published/active reads + ordering.
create index if not exists courses_pub_idx       on public.courses (published, sort_order);
create index if not exists services_pub_idx      on public.services (published, sort_order);
create index if not exists blog_pub_idx           on public.blog_posts (published, published_at desc);
create index if not exists offers_active_idx      on public.offers (active, sort_order);
create index if not exists gallery_order_idx      on public.gallery (sort_order);
create index if not exists testimonials_order_idx on public.testimonials (featured, sort_order);
create index if not exists faqs_order_idx         on public.faqs (published, sort_order);
create index if not exists enquiries_created_idx  on public.enquiries (created_at desc);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
