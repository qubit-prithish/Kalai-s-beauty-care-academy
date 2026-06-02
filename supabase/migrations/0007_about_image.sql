-- ─────────────────────────────────────────────────────────────────────────────
-- 0007_about_image.sql — Add about image to settings for CMS integration
-- ─────────────────────────────────────────────────────────────────────────────

-- Add about_image_url to settings JSON schema
-- We'll store it in the 'site' key's JSON value
-- First, ensure we have a 'site' settings key
INSERT INTO public.settings (key, value_json, updated_at)
VALUES (
  'site',
  jsonb_build_object(
    'about_image_url', '',
    'about_image_alt_en', '',
    'about_image_alt_ta', ''
  ),
  now()
)
ON CONFLICT (key) DO UPDATE SET
  value_json = EXCLUDED.value_json,
  updated_at = now();

-- Alternatively, we could create a separate 'about' table, but using settings
-- is simpler and follows the existing pattern. The settings table already has
-- 'key' (text) and 'value_json' (jsonb) columns.

-- Note: The about image will be uploaded to the existing 'uploads' storage bucket
-- which already has RLS policies set up in 0003_storage.sql