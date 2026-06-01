// ─────────────────────────────────────────────────────────────────────────────
// Content layer — public interface (Supabase-backed).
//
// UI components import ONLY from here (and ./types). Same function signatures
// and return types as the original mock layer, so NO component changes were
// needed. Data now comes from the hosted Supabase project via PostgREST (anon
// key, RLS-respecting). The ./mock modules remain only as typed test fixtures.
// ─────────────────────────────────────────────────────────────────────────────

import { restSelect, restSingle } from "@/lib/supabase/public";
import {
  mapBlogPost,
  mapCourse,
  mapGallery,
  mapOffer,
  mapService,
  mapTestimonial,
} from "./map";
import type {
  BlogPost,
  Course,
  Faq,
  GalleryItem,
  Offer,
  Service,
  Settings,
  Testimonial,
} from "./types";

const REVALIDATE = 300; // 5 min — admin edits appear without redeploy.

// ── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(): Promise<Course[]> {
  const rows = await restSelect("courses", {
    query: "select=*&published=eq.true&order=sort_order.asc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapCourse);
}

export async function getFeaturedCourses(): Promise<Course[]> {
  return (await getCourses()).filter((c) => c.featured);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const row = await restSingle("courses", {
    query: `select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    revalidate: REVALIDATE,
  });
  return row ? mapCourse(row) : null;
}

export async function getCourseSlugs(): Promise<string[]> {
  const rows = await restSelect<{ slug: string }>("courses", {
    query: "select=slug&published=eq.true",
    revalidate: REVALIDATE,
  });
  return rows.map((r) => r.slug);
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const rows = await restSelect("services", {
    query: "select=*&published=eq.true&order=sort_order.asc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapService);
}

export async function getFeaturedServices(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.featured);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const row = await restSingle("services", {
    query: `select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    revalidate: REVALIDATE,
  });
  return row ? mapService(row) : null;
}

export async function getServiceSlugs(): Promise<string[]> {
  const rows = await restSelect<{ slug: string }>("services", {
    query: "select=slug&published=eq.true",
    revalidate: REVALIDATE,
  });
  return rows.map((r) => r.slug);
}

// ── Testimonials ─────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await restSelect("testimonials", {
    query: "select=*&order=featured.desc,sort_order.asc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapTestimonial);
}

// ── Offers ───────────────────────────────────────────────────────────────────
export async function getOffers(): Promise<Offer[]> {
  // RLS already filters to active + within date window; order client-side.
  const rows = await restSelect("offers", {
    query: "select=*&order=sort_order.asc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapOffer);
}

/** The single offer (if any) eligible to surface as the homepage popup. */
export async function getPopupOffer(): Promise<Offer | null> {
  const offers = await getOffers();
  return offers.find((o) => o.showPopup) ?? null;
}

// ── FAQs ─────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<Faq[]> {
  const rows = await restSelect("faqs", {
    query: "select=*&published=eq.true&order=sort_order.asc",
    revalidate: REVALIDATE,
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return rows.map((r: any) => ({
    id: r.id,
    question: { en: r.question_en, ta: r.question_ta },
    answer: { en: r.answer_en, ta: r.answer_ta },
    order: r.sort_order ?? 0,
    published: !!r.published,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryItem[]> {
  const rows = await restSelect("gallery", {
    query: "select=*&order=sort_order.asc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapGallery);
}

/** Distinct categories present in the gallery data (drives the filter UI). */
export async function getGalleryCategories(): Promise<
  { id: string; label: GalleryItem["categoryLabel"] }[]
> {
  const items = await getGallery();
  const seen = new Map<string, GalleryItem["categoryLabel"]>();
  for (const item of items) {
    if (!seen.has(item.category)) seen.set(item.category, item.categoryLabel);
  }
  return [...seen.entries()].map(([id, label]) => ({ id, label }));
}

// ── Blog ─────────────────────────────────────────────────────────────────────
export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await restSelect("blog_posts", {
    query: "select=*&published=eq.true&order=published_at.desc",
    revalidate: REVALIDATE,
  });
  return rows.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await restSingle("blog_posts", {
    query: `select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    revalidate: REVALIDATE,
  });
  return row ? mapBlogPost(row) : null;
}

export async function getBlogSlugs(): Promise<string[]> {
  const rows = await restSelect<{ slug: string }>("blog_posts", {
    query: "select=slug&published=eq.true",
    revalidate: REVALIDATE,
  });
  return rows.map((r) => r.slug);
}

// ── Settings / NAP ────────────────────────────────────────────────────────────
export async function getSettings(): Promise<Settings> {
  const rows = await restSelect<{ key: string; value_json: Record<string, unknown> }>(
    "settings",
    { query: "select=key,value_json", revalidate: REVALIDATE },
  );
  const map = new Map(rows.map((r) => [r.key, r.value_json]));
  const brand = (map.get("brand") ?? {}) as Record<string, unknown>;
  const contact = (map.get("contact") ?? {}) as Record<string, unknown>;
  const address = (map.get("address") ?? {}) as Record<string, unknown>;
  const hours = (map.get("hours") ?? {}) as Record<string, unknown>;
  const s = (v: unknown, d = "") => (v as string) ?? d;
  const n = (v: unknown, d = 0) => (typeof v === "number" ? v : d);

  return {
    brandName: { en: s(brand.name_en), ta: s(brand.name_ta) },
    tagline: { en: s(brand.tagline_en), ta: s(brand.tagline_ta) },
    established: n(brand.established, 2006),
    yearsExperience: n(brand.yearsExperience, 20),
    studentsTrained: s(brand.studentsTrained, "1000+"),
    trainers: n(brand.trainers, 3),
    maxBatch: n(brand.maxBatch, 10),
    googleRating: n(brand.googleRating, 4.8),
    googleReviews: n(brand.googleReviews, 63),
    instagramFollowers: s(brand.instagramFollowers, "42K+"),
    address: {
      line1: s(address.line1),
      line2: s(address.line2),
      city: s(address.city),
      state: s(address.state),
      pincode: s(address.pincode),
      landmark: { en: s(address.landmark_en), ta: s(address.landmark_ta) },
      mapEmbedQuery: s(address.mapEmbedQuery),
      mapLink: s(address.mapLink),
    },
    contact: {
      phonePrimary: s(contact.phonePrimary),
      phonePrimaryE164: s(contact.phonePrimaryE164),
      phoneSecondary: s(contact.phoneSecondary),
      phoneSecondaryE164: s(contact.phoneSecondaryE164),
      whatsapp: s(contact.whatsapp, "919566229900"),
      email: s(contact.email),
      instagram: s(contact.instagram),
      facebook: s(contact.facebook),
    },
    hours: {
      salon: { en: s(hours.salon_en), ta: s(hours.salon_ta) },
      academy: { en: s(hours.academy_en), ta: s(hours.academy_ta) },
      note: { en: s(hours.note_en), ta: s(hours.note_ta) },
    },
  };
}

export type {
  BlogPost,
  Course,
  Faq,
  GalleryItem,
  Localized,
  Offer,
  Service,
  Settings,
  Testimonial,
} from "./types";
