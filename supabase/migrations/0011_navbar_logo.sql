-- ─────────────────────────────────────────────────────────────────────────────
-- 0011_navbar_logo.sql — Add navbar logo to about_page singleton
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add columns to public.about_page
alter table public.about_page
add column if not exists navbar_logo_url text,
add column if not exists navbar_logo_alt_en text,
add column if not exists navbar_logo_alt_ta text;

-- (No new policies needed as public read and admin update are already set on about_page)

-- Note: The logo will be uploaded to the existing 'about' storage bucket
-- which already has RLS policies set up in 0008_about_cms.sql
