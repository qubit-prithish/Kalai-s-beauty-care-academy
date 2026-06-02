-- ─────────────────────────────────────────────────────────────────────────────
-- 0009_remove_video.sql — Remove video support from gallery
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Migrate existing data
update public.gallery
set media_type = 'image'
where media_type = 'video';

update public.gallery
set video_url = null;

-- 2. Add constraint to media_type
alter table public.gallery
drop constraint if exists gallery_media_type_check;

alter table public.gallery
add constraint gallery_media_type_check
check (media_type in ('image', 'beforeafter'));

-- (Optional) Drop video_url column if you want to be really aggressive,
-- but the task only says "remove video support", and keeping the column
-- as nullable is safer for structural stability unless specifically asked.
-- Let's keep it but it's now ignored by the app.
