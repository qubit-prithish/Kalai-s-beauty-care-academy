// ─────────────────────────────────────────────────────────────────────────────
// Content layer — public interface.
//
// UI components import ONLY from here (and ./types). The functions are async so
// the backend track can replace the mock arrays with Supabase queries WITHOUT
// changing any component. Do not import the ./mock files directly from UI.
// ─────────────────────────────────────────────────────────────────────────────

import { courses as mockCourses } from "./mock/courses";
import { services as mockServices } from "./mock/services";
import { testimonials as mockTestimonials } from "./mock/testimonials";
import { offers as mockOffers } from "./mock/offers";
import { faqs as mockFaqs } from "./mock/faqs";
import { blogPosts as mockBlog } from "./mock/blog";
import { gallery as mockGallery } from "./mock/gallery";
import { settings as mockSettings } from "./mock/settings";
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

const sortByOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

// ── Courses ──────────────────────────────────────────────────────────────────
export async function getCourses(): Promise<Course[]> {
  return [...mockCourses].sort(sortByOrder);
}

export async function getFeaturedCourses(): Promise<Course[]> {
  return (await getCourses()).filter((c) => c.featured);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  return mockCourses.find((c) => c.slug === slug) ?? null;
}

export async function getCourseSlugs(): Promise<string[]> {
  return mockCourses.map((c) => c.slug);
}

// ── Services ─────────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  return [...mockServices].sort(sortByOrder);
}

export async function getFeaturedServices(): Promise<Service[]> {
  return (await getServices()).filter((s) => s.featured);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return mockServices.find((s) => s.slug === slug) ?? null;
}

export async function getServiceSlugs(): Promise<string[]> {
  return mockServices.map((s) => s.slug);
}

// ── Testimonials / Offers / FAQs ──────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  // Featured first, then by order.
  return [...mockTestimonials].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order,
  );
}

function offerIsLive(o: Offer, now = Date.now()): boolean {
  if (!o.active) return false;
  if (o.startsAt && now < +new Date(o.startsAt)) return false;
  if (o.endsAt && now > +new Date(o.endsAt)) return false;
  return true;
}

export async function getOffers(): Promise<Offer[]> {
  return [...mockOffers].filter((o) => offerIsLive(o)).sort(sortByOrder);
}

/** The single offer (if any) eligible to surface as the homepage popup. */
export async function getPopupOffer(): Promise<Offer | null> {
  return (
    [...mockOffers]
      .filter((o) => offerIsLive(o) && o.showPopup)
      .sort(sortByOrder)[0] ?? null
  );
}

export async function getFaqs(): Promise<Faq[]> {
  return [...mockFaqs].sort(sortByOrder);
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryItem[]> {
  return [...mockGallery].sort(sortByOrder);
}

/** Distinct categories present in the gallery data (drives the filter UI). */
export async function getGalleryCategories(): Promise<
  { id: string; label: GalleryItem["categoryLabel"] }[]
> {
  const seen = new Map<string, GalleryItem["categoryLabel"]>();
  for (const item of mockGallery) {
    if (!seen.has(item.category)) seen.set(item.category, item.categoryLabel);
  }
  return [...seen.entries()].map(([id, label]) => ({ id, label }));
}

// ── Blog ─────────────────────────────────────────────────────────────────────
export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...mockBlog].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return mockBlog.find((p) => p.slug === slug) ?? null;
}

export async function getBlogSlugs(): Promise<string[]> {
  return mockBlog.map((p) => p.slug);
}

// ── Settings / NAP ────────────────────────────────────────────────────────────
export async function getSettings(): Promise<Settings> {
  return mockSettings;
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
