-- ─────────────────────────────────────────────────────────────────────────────
-- Kalai's Beauty Care & Academy — admin auth schema
--
-- Run this in the Supabase SQL editor (or via `psql "$DATABASE_URL"`).
-- It creates the `admins` allow-list table that gates the /admin dashboard.
--
-- Auth model:
--   * Users are created in Supabase Auth (Dashboard → Authentication → Users,
--     or via invite). Email/password sign-in must be enabled.
--   * A user can reach /admin ONLY if their auth user id appears in `admins`.
--   * The app verifies membership server-side with the SERVICE ROLE key, so the
--     table stays fully locked under RLS (no anon/auth client access at all).
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security and add NO permissive policies. With RLS on and no
-- policy, the anon and authenticated roles cannot read or write this table.
-- Only the service_role key (used by the server) bypasses RLS.
alter table public.admins enable row level security;

-- ── Bootstrap the first admin ────────────────────────────────────────────────
-- 1. Create the user in Supabase Auth first (Dashboard → Authentication →
--    Users → "Add user", set a password, and confirm the email).
-- 2. Then insert them into the allow-list. Replace the email below:
--
-- insert into public.admins (user_id, email)
-- select id, email from auth.users where email = 'owner@example.com'
-- on conflict (user_id) do nothing;
--
-- To revoke admin access later:
-- delete from public.admins where email = 'owner@example.com';
