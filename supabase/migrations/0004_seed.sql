-- ─────────────────────────────────────────────────────────────────────────────
-- 0004_seed.sql — starter content (matches the frontend mock layer 1:1)
-- Idempotent: upserts on natural keys (slug / settings.key) so re-running is safe.
-- ─────────────────────────────────────────────────────────────────────────────

-- SETTINGS (NAP, hours, socials, brand) ────────────────────────────────────────
insert into public.settings (key, value_json) values
('brand', jsonb_build_object(
  'name_en','Kalai''s Beauty Care & Academy',
  'name_ta','கலையின் அழகு பராமரிப்பு & கல்விக்கூடம்',
  'tagline_en','Where artistry meets opportunity since 2006.',
  'tagline_ta','2006 முதல் கலை வடிவமும் வாய்ப்பும் சந்திக்கும் இடம்.',
  'established',2006,'yearsExperience',20,'studentsTrained','1000+',
  'trainers',3,'maxBatch',10,'googleRating',4.8,'googleReviews',63,
  'instagramFollowers','42K+')),
('contact', jsonb_build_object(
  'phonePrimary','095662 29900','phonePrimaryE164','+919566229900',
  'phoneSecondary','88257 14771','phoneSecondaryE164','+918825714771',
  'whatsapp','919566229900','email','xlntkalai@gmail.com',
  'instagram','https://www.instagram.com/kalais_beauty_academy',
  'facebook','https://www.facebook.com/share/18eCsGAJid/')),
('address', jsonb_build_object(
  'line1','No:77, Ayyapakkam Main Road','line2','TNHB, KK Nagar, Ambattur',
  'city','Chennai','state','Tamil Nadu','pincode','600053',
  'landmark_en','Opposite FUEL Juice & Pasta Bar','landmark_ta','FUEL Juice & Pasta Bar எதிரில்',
  'mapEmbedQuery','Kalai''s Beauty Care Academy, Ayyapakkam Main Road, TNHB, KK Nagar, Ambattur, Chennai 600053',
  'mapLink','https://maps.app.goo.gl/762CCwLhbzDhtozT8')),
('hours', jsonb_build_object(
  'salon_en','10:00 AM – 9:00 PM · All 7 days','salon_ta','காலை 10:00 – இரவு 9:00 · வாரம் 7 நாட்களும்',
  'academy_en','11:00 AM – 5:00 PM · Course hours','academy_ta','காலை 11:00 – மாலை 5:00 · பயிற்சி நேரம்',
  'note_en','Closed on public holidays.','note_ta','பொது விடுமுறை நாட்களில் மூடியிருக்கும்.'))
on conflict (key) do update set value_json = excluded.value_json, updated_at = now();

-- FAQS ─────────────────────────────────────────────────────────────────────────
insert into public.faqs (question_en, question_ta, answer_en, answer_ta, sort_order) values
('Do I need any prior experience to join a course?','ஒரு பாடத்தில் சேர முன் அனுபவம் தேவையா?',
 'No. Most of our students start as absolute beginners. Every course takes you from zero to salon-ready with hands-on practice from day one.',
 'தேவையில்லை. எங்கள் பெரும்பாலான மாணவிகள் முற்றிலும் புதியவர்களாகவே தொடங்குகிறார்கள். ஒவ்வொரு பாடமும் முதல் நாளிலிருந்தே நேரடி பயிற்சியுடன் உங்களை தயார்படுத்தும்.',1),
('What are your timings?','உங்கள் நேரம் என்ன?',
 'The salon is open 10 AM–9 PM all 7 days (closed on public holidays). Course hours are 11 AM–5 PM. Rolling admissions mean you can start any time.',
 'அழகு நிலையம் வாரம் 7 நாட்களும் காலை 10 முதல் இரவு 9 வரை திறந்திருக்கும் (பொது விடுமுறை நாட்களில் மூடியிருக்கும்). பயிற்சி நேரம் காலை 11 முதல் மாலை 5 வரை. எப்போது வேண்டுமானாலும் சேரலாம்.',2),
('Can I pay in EMI or instalments?','EMI அல்லது தவணையில் கட்டலாமா?',
 'Yes. We offer flexible EMI and instalment options for almost every course. Message us on WhatsApp and we''ll plan a schedule that fits you.',
 'ஆம். கிட்டத்தட்ட ஒவ்வொரு பாடத்திற்கும் நெகிழ்வான EMI & தவணை வசதி உள்ளது. வாட்ஸ்அப்பில் தொடர்பு கொள்ளுங்கள்.',3),
('Do you give a certificate?','சான்றிதழ் வழங்குகிறீர்களா?',
 'Yes. Every course ends with a government-recognised certificate plus a completion photo. We also help with internships and placement.',
 'ஆம். ஒவ்வொரு பாடமும் அரசு அங்கீகார சான்றிதழ் & முடிவு புகைப்படத்துடன் முடிகிறது. இன்டர்ன்ஷிப் & வேலைவாய்ப்பு உதவியும் வழங்குகிறோம்.',4),
('Do you offer placement support?','வேலைவாய்ப்பு உதவி வழங்குகிறீர்களா?',
 'Yes. Alongside internships during the course, we guide graduates towards salon jobs, freelance work and starting their own business.',
 'ஆம். பாடத்தின் போது இன்டர்ன்ஷிப்புடன், பட்டதாரிகளுக்கு அழகு நிலைய வேலைகள், ஃப்ரீலான்ஸ் மற்றும் சொந்த தொழில் தொடங்க வழிகாட்டுகிறோம்.',5),
('How big are the batches?','பேட்ச்கள் எவ்வளவு பெரியவை?',
 'Batches are capped at 10 students so everyone gets individual, hands-on attention. We have 3 trainers and rolling admissions.',
 'ஒவ்வொரு பேட்சும் 10 மாணவிகள் மட்டுமே — அனைவருக்கும் தனிப்பட்ட, நேரடி கவனம் கிடைக்கும். 3 பயிற்சியாளர்கள் மற்றும் எப்போதும் சேர்க்கை.',6),
('Where are you located?','நீங்கள் எங்கே அமைந்துள்ளீர்கள்?',
 'We are at No:77, Ayyapakkam Main Road, TNHB, KK Nagar, Ambattur, Chennai – 600053, opposite FUEL Juice & Pasta Bar. Parking is available.',
 'No:77, அய்யப்பாக்கம் மெயின் ரோடு, TNHB, KK நகர், அம்பத்தூர், சென்னை – 600053, FUEL Juice & Pasta Bar எதிரில். வாகன நிறுத்துமிடம் உள்ளது.',7),
('Can I just book a salon service without a course?','பாடம் இல்லாமல் சேவை மட்டும் புக் செய்யலாமா?',
 'Of course. We are a working salon as well. Walk in or message on WhatsApp to book any service.',
 'நிச்சயமாக. நாங்கள் இயங்கும் அழகு நிலையமும் கூட. நேரடியாக வரலாம் அல்லது வாட்ஸ்அப்பில் புக் செய்யலாம்.',8)
on conflict do nothing;

-- TESTIMONIALS ─────────────────────────────────────────────────────────────────
insert into public.testimonials (author, role, rating, text_en, text_ta, source, featured, sort_order) values
('Priya R.','Diploma graduate, 2023',5,
 'Kalaiselvi ma''am didn''t just teach makeup, she rebuilt my confidence. I run my own salon in Avadi today.',
 'கலைச்செல்வி மேடம் மேக்கப் மட்டுமல்ல, என் நம்பிக்கையையும் மீண்டும் கட்டினார். இன்று ஆவடியில் சொந்த அழகு நிலையம் நடத்துகிறேன்.','google',true,1),
('Lakshmi S.','Bride, 2024',5,
 'My bridal makeup lasted from the 4 AM muhurtham till the 11 PM reception. The photos still look perfect.',
 'காலை 4 மணி முகூர்த்தம் முதல் இரவு 11 மணி வரவேற்பு வரை மணப்பெண் மேக்கப் தாங்கியது. ஃபோட்டோக்கள் இன்னும் அழகாக உள்ளன.','google',true,2),
('Dhanya M.','Ear lobe treatment client',5,
 'I had a torn ear lobe for 4 years. Kalai ma''am fixed it without surgery. I''m wearing my favourite jhumkas again.',
 '4 ஆண்டுகளாக கிழிந்த காது மடல். கலை மேடம் அறுவை சிகிச்சை இல்லாமல் சரி செய்தார். மீண்டும் ஜும்க்கா அணிகிறேன்.','google',false,3),
('Anitha V.','Basic Beautician graduate',5,
 'Three months of hands-on practice. From day one I was working on real clients. The best decision I made.',
 '3 மாத நேரடி பயிற்சி. முதல் நாளிலிருந்தே உண்மையான வாடிக்கையாளர்களில் வேலை செய்தேன். சிறந்த முடிவு.','google',false,4),
('Fathima K.','Bridal makeup client, 2024',5,
 'Booking on WhatsApp was so easy. The team understood exactly the look I wanted from my reference photo.',
 'வாட்ஸ்அப்பில் புக் செய்வது மிக எளிதாக இருந்தது. என் ரெஃபரன்ஸ் ஃபோட்டோவிலிருந்து நான் விரும்பிய தோற்றத்தை குழு சரியாகப் புரிந்துகொண்டது.','google',false,5)
on conflict do nothing;

-- OFFERS ────────────────────────────────────────────────────────────────────────
insert into public.offers (title_en, title_ta, description_en, description_ta, badge_en, badge_ta, show_popup, active, sort_order) values
('Free demo class','இலவச டெமோ வகுப்பு',
 'Try any course free before you enrol. Limited weekly slots — message us to reserve yours.',
 'சேருவதற்கு முன் எந்த பாடத்தையும் இலவசமாக முயற்சிக்கவும். வாராந்திர ஸ்லாட்கள் வரம்புக்குட்பட்டவை — உங்களுடையதை முன்பதிவு செய்ய எங்களுக்கு செய்தி அனுப்புங்கள்.',
 'FREE DEMO','இலவசம்',true,true,1),
('Easy EMI on all courses','அனைத்து பாடங்களுக்கும் எளிய EMI',
 'Flexible instalments so fees never stop your dream. Ask us on WhatsApp for a plan that fits you.',
 'கட்டணம் உங்கள் கனவைத் தடுக்காதபடி நெகிழ்வான தவணைகள். உங்களுக்கு ஏற்ற திட்டத்திற்கு வாட்ஸ்அப்பில் கேளுங்கள்.',
 'EMI','EMI',false,true,2),
('Free student starter kit','இலவச மாணவி ஆரம்ப கிட்',
 'Enrol in a diploma or advanced course and receive a professional starter kit on us.',
 'டிப்ளமோ அல்லது மேம்பட்ட பாடத்தில் சேர்ந்து தொழில்முறை ஆரம்ப கிட்டை இலவசமாகப் பெறுங்கள்.',
 'FREE KIT','இலவச கிட்',false,true,3)
on conflict do nothing;

-- GALLERY ────────────────────────────────────────────────────────────────────────
insert into public.gallery (title_en, title_ta, category, sort_order) values
('Ear lobe treatment result','காது மடல் சிகிச்சை முடிவு','ear-treatment',1),
('Traditional bridal look','பாரம்பரிய மணப்பெண் தோற்றம்','bridal',2),
('Student practical session','மாணவி நடைமுறை பயிற்சி','students',3),
('Nail art design','நெயில் ஆர்ட் வடிவம்','nails',4),
('Hair styling transformation','ஹேர் ஸ்டைலிங் மாற்றம்','hair',5),
('Inside the academy','கல்விக்கூடத்தின் உள்ளே','academy',6),
('Mehendi design','மருதாணி வடிவம்','mehendi',7),
('Certificate day','சான்றிதழ் வழங்கும் நாள்','events',8)
on conflict do nothing;
