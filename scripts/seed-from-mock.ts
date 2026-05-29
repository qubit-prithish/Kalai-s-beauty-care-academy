/**
 * Syncs the hosted DB to the frontend mock layer 1:1 (upsert on slug / natural
 * key), populating ALL columns including the UI fields added in 0006. Run once
 * after migrations so courses/services/etc. match the mock byte-for-byte. The
 * mock modules remain as typed fixtures for tests; the DB is the live source.
 *
 *   npm run db:seed
 */
import "./env";
import { Client } from "pg";
import { courses } from "../src/lib/content/mock/courses";
import { services } from "../src/lib/content/mock/services";
import { testimonials } from "../src/lib/content/mock/testimonials";
import { offers } from "../src/lib/content/mock/offers";
import { gallery } from "../src/lib/content/mock/gallery";

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();

  for (const co of courses) {
    await c.query(
      `insert into public.courses
        (slug,name_en,name_ta,duration,duration_ta,price,summary_en,summary_ta,
         tagline_en,tagline_ta,syllabus_en,syllabus_ta,outcomes_en,outcomes_ta,
         image_url,featured,sort_order,published)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,true)
       on conflict (slug) do update set
         name_en=excluded.name_en,name_ta=excluded.name_ta,duration=excluded.duration,
         duration_ta=excluded.duration_ta,price=excluded.price,summary_en=excluded.summary_en,
         summary_ta=excluded.summary_ta,tagline_en=excluded.tagline_en,tagline_ta=excluded.tagline_ta,
         syllabus_en=excluded.syllabus_en,syllabus_ta=excluded.syllabus_ta,
         outcomes_en=excluded.outcomes_en,outcomes_ta=excluded.outcomes_ta,
         image_url=excluded.image_url,featured=excluded.featured,sort_order=excluded.sort_order`,
      [co.slug, co.title.en, co.title.ta, co.duration.en, co.duration.ta, co.price,
       co.description.en, co.description.ta, co.tagline.en, co.tagline.ta,
       co.syllabus.en, co.syllabus.ta, co.outcomes.en, co.outcomes.ta,
       co.image.src || null, co.featured, co.order],
    );
  }
  console.log(`✓ courses synced (${courses.length})`);

  for (const s of services) {
    await c.query(
      `insert into public.services
        (slug,name_en,name_ta,price,duration,duration_ta,description_en,description_ta,
         tagline_en,tagline_ta,image_url,signature,featured,sort_order,published)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true)
       on conflict (slug) do update set
         name_en=excluded.name_en,name_ta=excluded.name_ta,price=excluded.price,
         duration=excluded.duration,duration_ta=excluded.duration_ta,
         description_en=excluded.description_en,description_ta=excluded.description_ta,
         tagline_en=excluded.tagline_en,tagline_ta=excluded.tagline_ta,
         image_url=excluded.image_url,signature=excluded.signature,
         featured=excluded.featured,sort_order=excluded.sort_order`,
      [s.slug, s.title.en, s.title.ta, s.price, s.duration.en, s.duration.ta,
       s.description.en, s.description.ta, s.tagline.en, s.tagline.ta,
       s.image.src || null, s.signature, s.featured, s.order],
    );
  }
  console.log(`✓ services synced (${services.length})`);

  // Testimonials: match by author (no slug). Wipe + reinsert to keep ordering/role_ta exact.
  await c.query("delete from public.testimonials");
  for (const t of testimonials) {
    await c.query(
      `insert into public.testimonials
        (author,role,role_ta,rating,text_en,text_ta,video_url,source,featured,sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,'google',$8,$9)`,
      [t.name, t.role.en, t.role.ta, t.rating, t.quote.en, t.quote.ta, t.videoUrl ?? null, t.featured, t.order],
    );
  }
  console.log(`✓ testimonials synced (${testimonials.length})`);

  // Offers: refresh badge + popup + ordering by title_en match.
  for (const o of offers) {
    await c.query(
      `update public.offers set
        description_en=$2,description_ta=$3,badge_en=$4,badge_ta=$5,
        show_popup=$6,active=$7,sort_order=$8
       where title_en=$1`,
      [o.title.en, o.description.en, o.description.ta, o.badge.en, o.badge.ta, o.showPopup, o.active, o.order],
    );
  }
  console.log(`✓ offers synced (${offers.length})`);

  // Gallery: wipe + reinsert with category labels, media type, before/after.
  await c.query("delete from public.gallery");
  for (const g of gallery) {
    await c.query(
      `insert into public.gallery
        (title_en,title_ta,category,category_label_en,category_label_ta,media_type,
         image_url,video_url,before_url,after_url,featured,sort_order)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [g.caption.en, g.caption.ta, g.category, g.categoryLabel.en, g.categoryLabel.ta,
       g.type, g.src || null, g.type === "video" ? (g.src || null) : null,
       g.before || null, g.after || null, g.featured ?? false, g.order],
    );
  }
  console.log(`✓ gallery synced (${gallery.length})`);

  await c.end();
  console.log("\n✓ DB synced to mock layer.");
}

main().catch((e) => { console.error(e); process.exit(1); });
