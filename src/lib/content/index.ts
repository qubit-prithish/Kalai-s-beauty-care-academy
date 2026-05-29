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
  return mockTestimonials;
}

export async function getOffers(): Promise<Offer[]> {
  return mockOffers.filter((o) => o.active);
}

export async function getFaqs(): Promise<Faq[]> {
  return mockFaqs;
}

// ── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryItem[]> {
  return mockGallery;
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
