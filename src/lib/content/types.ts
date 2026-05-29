// ─────────────────────────────────────────────────────────────────────────────
// Typed content layer — interfaces.
// UI components depend ONLY on these types + the getters in ./index.
// The backend track will swap the data source to Supabase without touching UI.
// ─────────────────────────────────────────────────────────────────────────────

/** A string that exists in both supported locales. */
export type Localized = {
  en: string;
  ta: string;
};

/** Optional localized string (PENDING content may be empty). */
export type LocalizedList = {
  en: string[];
  ta: string[];
};

/** Image reference. `src` empty => render an elegant placeholder. */
export type ImageRef = {
  src: string;
  alt: Localized;
};

export interface Course {
  id: string;
  slug: string;
  title: Localized;
  /** Short one-liner used on tiles. */
  tagline: Localized;
  /** ~100-word SEO description (EN + TA). */
  description: Localized;
  duration: Localized;
  /** null => PENDING => show "Fee on enquiry" + WhatsApp CTA. */
  price: number | null;
  priceNote: Localized;
  syllabus: LocalizedList;
  outcomes: LocalizedList;
  image: ImageRef;
  featured: boolean;
  order: number;
}

export interface Service {
  id: string;
  slug: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  duration: Localized;
  price: number | null;
  priceNote: Localized;
  image: ImageRef;
  /** Signature / most-reviewed service flag. */
  signature: boolean;
  featured: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  caption: Localized;
  category: "work" | "team" | "interior" | "exterior" | "event";
}

export interface Testimonial {
  id: string;
  name: string;
  role: Localized;
  quote: Localized;
  rating: number;
  avatar: ImageRef | null;
}

export interface Offer {
  id: string;
  title: Localized;
  description: Localized;
  /** e.g. "EMI", "FREE DEMO" — shown as a small badge. */
  badge: Localized;
  active: boolean;
  expiresAt: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  cover: ImageRef;
  publishedAt: string;
  tags: string[];
}

export interface Faq {
  id: string;
  question: Localized;
  answer: Localized;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  /** What the enquiry is about (course/service slug or "general"). */
  topic: string;
  createdAt: string;
}

export interface NapHours {
  /** Mon–Sun salon hours, human-readable. */
  salon: Localized;
  /** Course/academy hours. */
  academy: Localized;
  note: Localized;
}

export interface Settings {
  brandName: Localized;
  tagline: Localized;
  established: number;
  yearsExperience: number;
  studentsTrained: string;
  trainers: number;
  maxBatch: number;
  googleRating: number;
  googleReviews: number;
  instagramFollowers: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    landmark: Localized;
    mapEmbedQuery: string;
    mapLink: string;
  };
  contact: {
    phonePrimary: string;
    phonePrimaryE164: string;
    phoneSecondary: string;
    phoneSecondaryE164: string;
    whatsapp: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  hours: NapHours;
}
