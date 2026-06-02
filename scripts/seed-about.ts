/**
 * Seeds the new About page architecture from existing translations.
 * Run once to ensure the dynamic About page has content matching the previous static version.
 * 
 *   npx tsx scripts/seed-about.ts
 */
import "./env";
import { Client } from "pg";

async function main() {
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await c.connect();

  console.log("Seeding About Page content...");

  // 1. Singleton About Page
  await c.query(`
    update public.about_page set
      hero_eyebrow_en = 'About Kalai''s',
      hero_eyebrow_ta = 'கலையின் கல்விக்கூடம் பற்றி',
      hero_title_en = '20 years. 1000+ students. One mission.',
      hero_title_ta = '20 ஆண்டுகள். 1000+ மாணவிகள். ஒரே நோக்கம்.',
      hero_subtitle_en = 'Empowering women across Tamil Nadu through beauty.',
      hero_subtitle_ta = 'அழகின் வழி தமிழ்நாட்டுப் பெண்களை சக்திமயமாக்குதல்.',
      
      story_title_en = 'Our story',
      story_title_ta = 'எங்கள் கதை',
      story_en = 'Founded in 2006 in Ambattur, Chennai, Kalai''s Beauty Care & Academy has grown from a single studio into one of the most trusted beauty schools in the city. For two decades we have trained over 1000 women — many of whom now run their own salons across Tamil Nadu.',
      story_ta = '2006ம் ஆண்டு அம்பத்தூர், சென்னையில் தொடங்கப்பட்ட கலையின் அழகு பராமரிப்பு & கல்விக்கூடம், ஒரே ஸ்டுடியோவிலிருந்து நகரின் மிகவும் நம்பகமான அழகுக் கல்விக்கூடங்களில் ஒன்றாக வளர்ந்துள்ளது. இரண்டு தசாப்தங்களாக 1000க்கும் மேற்பட்ட பெண்களுக்குப் பயிற்சி அளித்துள்ளோம் — பலர் இன்று தமிழ்நாடு முழுவதும் சொந்த அழகு நிலையங்களை நடத்துகிறார்கள்.',
      
      mission_title_en = 'Our mission',
      mission_title_ta = 'எங்கள் நோக்கம்',
      mission_en = 'To empower 10,000+ women by 2030 to launch their own salons through professional training, hands-on practice and lifelong placement support.',
      mission_ta = '2030க்குள் 10,000க்கும் மேற்பட்ட பெண்களுக்கு தொழில்முறை பயிற்சி, நேரடி பயிற்சி மற்றும் வாழ்நாள் வேலைவாய்ப்பு ஆதரவு வழங்கி அவர்களின் சொந்த அழகு நிலையங்களைத் தொடங்க உதவுவது.',
      
      founder_title_en = 'Meet the founder',
      founder_title_ta = 'நிறுவனரை சந்திக்க',
      founder_name_en = 'Kalaiselvi',
      founder_name_ta = 'கலைச்செல்வி',
      founder_role_en = 'Founder & Lead International Makeup Artist',
      founder_role_ta = 'நிறுவனர் & பிரதான சர்வதேச அலங்கார கலைஞர்',
      founder_bio_en = 'Kalaiselvi has spent two decades shaping Chennai''s beauty landscape. A government-recognised certified educator and International Makeup Artist, she founded the academy with one mission: empower women through skill, confidence and craft.',
      founder_bio_ta = 'கலைச்செல்வி இரண்டு தசாப்தங்களாக சென்னையின் அழகுக் கலைத் துறையை வடிவமைத்து வருகிறார். அரசு அங்கீகாரம் பெற்ற சான்றளிக்கப்பட்ட பயிற்றுவிப்பாளர் மற்றும் சர்வதேச அலங்கார கலைஞரான இவர், ஒரே நோக்கத்துடன் கல்விக்கூடத்தை நிறுவினார் — திறன், நம்பிக்கை மற்றும் கைவினை மூலம் பெண்களுக்கு சக்தி அளிப்பது.',
      
      credentials_title_en = 'Credentials & awards',
      credentials_title_ta = 'சான்றிதழ்கள் & விருதுகள்',
      credentials_desc_en = 'Government-recognised certifications and awards — details coming soon.',
      credentials_desc_ta = 'அரசு அங்கீகார சான்றிதழ்கள் மற்றும் விருதுகள் — விவரங்கள் விரைவில்.'
    where id = 'about'
  `);
  console.log("✓ about_page singleton updated");

  // 2. USPs
  const usps = [
    { en: "Professional & trendy techniques", ta: "தொழில்முறை & சமீபத்திய நுட்பங்கள்" },
    { en: "Advanced accessories & tools", ta: "மேம்பட்ட கருவிகள் & உபகரணங்கள்" },
    { en: "Best skin & hair treatments", ta: "சிறந்த சருமம் & முடி பராமரிப்பு" },
    { en: "Individual hands-on training", ta: "தனிப்பட்ட நேரடி பயிற்சி" },
    { en: "4.8★ Google reputation", ta: "4.8★ கூகுள் மதிப்பீடு" },
    { en: "20-year proven legacy", ta: "20 ஆண்டு பாரம்பரியம்" }
  ];

  await c.query("delete from public.about_why_choose_us");
  for (let i = 0; i < usps.length; i++) {
    await c.query(
      "insert into public.about_why_choose_us (text_en, text_ta, sort_order) values ($1, $2, $3)",
      [usps[i].en, usps[i].ta, i + 1]
    );
  }
  console.log(`✓ about_why_choose_us seeded (${usps.length})`);

  // 3. Facilities
  const facilities = [
    { en: "Air-conditioned", ta: "ஏசி வசதி" },
    { en: "Free Wi-Fi", ta: "இலவச வைஃபை" },
    { en: "Parking", ta: "வாகன நிறுத்துமிடம்" },
    { en: "Wheelchair-friendly", ta: "சக்கர நாற்காலி வசதி" },
    { en: "Restroom", ta: "கழிவறை" },
    { en: "Refreshments", ta: "சிற்றுண்டி" },
    { en: "Women-owned", ta: "பெண்கள் நடத்துவது" }
  ];

  await c.query("delete from public.about_facilities");
  for (let i = 0; i < facilities.length; i++) {
    await c.query(
      "insert into public.about_facilities (name_en, name_ta, sort_order) values ($1, $2, $3)",
      [facilities[i].en, facilities[i].ta, i + 1]
    );
  }
  console.log(`✓ about_facilities seeded (${facilities.length})`);

  // 4. Trainers (Start with 3 placeholders as requested)
  await c.query("delete from public.about_trainers");
  for (let i = 1; i <= 3; i++) {
    await c.query(
      "insert into public.about_trainers (name_en, name_ta, role_en, role_ta, bio_en, bio_ta, sort_order) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        `Senior Trainer ${i}`, `மூத்த பயிற்சியாளர் ${i}`,
        'Expert Educator', 'நிபுணர் கல்வியாளர்',
        'Certified beauty professional with extensive industry experience.', 'பரந்த தொழில் அனுபவம் கொண்ட சான்றளிக்கப்பட்ட அழகு நிபுணர்.',
        i
      ]
    );
  }
  console.log("✓ about_trainers seeded (3 placeholders)");

  await c.end();
  console.log("\n✓ About Page CMS data seeded.");
}

main().catch((e) => { console.error(e); process.exit(1); });
