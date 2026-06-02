// Row → typed-interface mappers. Keep the shapes IDENTICAL to the mock layer so
// no UI component changes are required.
import type {
  Course,
  GalleryItem,
  Offer,
  Service,
  Testimonial,
  AboutPageData,
  AboutWhyItem,
  AboutFacility,
  AboutTrainer,
} from "./types";

const loc = (en: unknown, ta: unknown) => ({
  en: (en as string) ?? "",
  ta: (ta as string) ?? ((en as string) ?? ""),
});
const list = (en: unknown, ta: unknown) => ({
  en: (en as string[]) ?? [],
  ta: (ta as string[]) ?? ((en as string[]) ?? []),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapAboutPage(r: any): AboutPageData {
  return {
    navbarLogo: r.navbar_logo_url
      ? {
          url: r.navbar_logo_url,
          alt: loc(r.navbar_logo_alt_en, r.navbar_logo_alt_ta),
        }
      : null,
    heroEyebrow: loc(r.hero_eyebrow_en, r.hero_eyebrow_ta),
    heroTitle: loc(r.hero_title_en, r.hero_title_ta),
    heroSubtitle: loc(r.hero_subtitle_en, r.hero_subtitle_ta),
    storyTitle: loc(r.story_title_en, r.story_title_ta),
    story: loc(r.story_en, r.story_ta),
    missionTitle: loc(r.mission_title_en, r.mission_title_ta),
    mission: loc(r.mission_en, r.mission_ta),
    founderTitle: loc(r.founder_title_en, r.founder_title_ta),
    founderName: loc(r.founder_name_en, r.founder_name_ta),
    founderRole: loc(r.founder_role_en, r.founder_role_ta),
    founderBio: loc(r.founder_bio_en, r.founder_bio_ta),
    founderImage: r.founder_image_url
      ? {
          url: r.founder_image_url,
          alt: loc(r.founder_name_en, r.founder_name_ta),
        }
      : null,
    credentialsTitle: loc(r.credentials_title_en, r.credentials_title_ta),
    credentialsDesc: loc(r.credentials_desc_en, r.credentials_desc_ta),
  };
}

export function mapAboutWhy(r: any): AboutWhyItem {
  return {
    id: r.id,
    text: loc(r.text_en, r.text_ta),
    order: r.sort_order ?? 0,
  };
}

export function mapAboutFacility(r: any): AboutFacility {
  return {
    id: r.id,
    name: loc(r.name_en, r.name_ta),
    order: r.sort_order ?? 0,
  };
}

export function mapAboutTrainer(r: any): AboutTrainer {
  return {
    id: r.id,
    name: loc(r.name_en, r.name_ta),
    role: loc(r.role_en, r.role_ta),
    bio: loc(r.bio_en, r.bio_ta),
    image: r.image_url
      ? {
          url: r.image_url,
          alt: loc(r.name_en, r.name_ta),
        }
      : null,
    order: r.sort_order ?? 0,
  };
}

export function mapCourse(r: any): Course {
  return {
    id: r.id,
    slug: r.slug,
    title: loc(r.name_en, r.name_ta),
    tagline: loc(r.tagline_en, r.tagline_ta),
    description: loc(r.summary_en, r.summary_ta),
    duration: loc(r.duration, r.duration_ta),
    price: r.price === null || r.price === undefined ? null : Number(r.price),
    priceNote: { en: "Fee on enquiry", ta: "கட்டணம் கேள்விக்கு" },
    syllabus: list(r.syllabus_en, r.syllabus_ta),
    whoFor: loc(r.who_for_en, r.who_for_ta),
    outcomes: list(r.outcomes_en, r.outcomes_ta),
    image: { src: r.image_url ?? "", alt: loc(r.name_en, r.name_ta) },
    featured: !!r.featured,
    order: r.sort_order ?? 0,
  };
}

export function mapService(r: any): Service {
  return {
    id: r.id,
    slug: r.slug,
    title: loc(r.name_en, r.name_ta),
    tagline: loc(r.tagline_en, r.tagline_ta),
    description: loc(r.description_en, r.description_ta),
    duration: loc(r.duration, r.duration_ta),
    price: r.price === null || r.price === undefined ? null : Number(r.price),
    priceNote: { en: "Price on enquiry", ta: "விலை கேள்விக்கு" },
    image: { src: r.image_url ?? "", alt: loc(r.name_en, r.name_ta) },
    signature: !!r.signature,
    featured: !!r.featured,
    order: r.sort_order ?? 0,
  };
}

export function mapGallery(r: any): GalleryItem {
  let type = (r.media_type as GalleryItem["type"]) ?? "image";
  if (type !== "image" && type !== "beforeafter") type = "image";

  return {
    id: r.id,
    type,
    src: r.image_url ?? "",
    before: r.before_url ?? undefined,
    after: r.after_url ?? undefined,
    caption: loc(r.title_en, r.title_ta),
    category: r.category ?? "general",
    categoryLabel: loc(r.category_label_en ?? r.category, r.category_label_ta),
    featured: !!r.featured,
    order: r.sort_order ?? 0,
  };
}

export function mapTestimonial(r: any): Testimonial {
  return {
    id: r.id,
    name: r.author,
    role: loc(r.role, r.role_ta),
    quote: loc(r.text_en, r.text_ta),
    rating: r.rating ?? 5,
    avatar: null,
    videoUrl: r.video_url ?? null,
    featured: !!r.featured,
    order: r.sort_order ?? 0,
  };
}

export function mapOffer(r: any): Offer {
  return {
    id: r.id,
    title: loc(r.title_en, r.title_ta),
    description: loc(r.description_en, r.description_ta),
    badge: loc(r.badge_en, r.badge_ta),
    image: { src: r.image_url ?? "", alt: loc(r.title_en, r.title_ta) },
    active: !!r.active,
    showPopup: !!r.show_popup,
    startsAt: r.starts_at ?? null,
    endsAt: r.ends_at ?? null,
    order: r.sort_order ?? 0,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
