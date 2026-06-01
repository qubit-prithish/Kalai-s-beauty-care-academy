// One config per table drives the shared List + Create/Edit form. No per-entity pages.
export type FieldType = "text" | "textarea" | "number" | "bool" | "date" | "image";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Storage bucket for image fields. */
  bucket?: string;
  /** Show in the list table. */
  list?: boolean;
  /** Handle as a newline-separated list (string array in DB). */
  is_array?: boolean;
};
export type EntityConfig = {
  table: string;
  label: string;
  /** Column shown as the row title in lists. */
  titleField: string;
  orderBy: string;
  fields: Field[];
};

const bilingual = (base: string, label: string, type: FieldType = "text"): Field[] => [
  { name: `${base}_en`, label: `${label} (EN)`, type },
  { name: `${base}_ta`, label: `${label} (TA)`, type },
];

export const ENTITIES: Record<string, EntityConfig> = {
  courses: {
    table: "courses", label: "Courses", titleField: "name_en", orderBy: "sort_order",
    fields: [
      { name: "slug", label: "Slug", type: "text", list: true },
      ...bilingual("name", "Name").map((f, i) => ({ ...f, list: i === 0 })),
      { name: "duration", label: "Duration (EN)", type: "text" },
      { name: "duration_ta", label: "Duration (TA)", type: "text" },
      { name: "price", label: "Price (blank = on enquiry)", type: "number", list: true },
      ...bilingual("tagline", "Tagline"),
      ...bilingual("summary", "Summary", "textarea"),
      ...bilingual("who_for", "Who is this for", "textarea"),
      ...bilingual("outcomes", "What you'll learn (one per line)", "textarea").map(f => ({ ...f, is_array: true })),
      ...bilingual("syllabus", "Syllabus (one per line)", "textarea").map(f => ({ ...f, is_array: true })),
      { name: "image_url", label: "Image", type: "image", bucket: "courses" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "bool", list: true },
      { name: "published", label: "Published", type: "bool", list: true },
    ],
  },
  services: {
    table: "services", label: "Services", titleField: "name_en", orderBy: "sort_order",
    fields: [
      { name: "slug", label: "Slug", type: "text", list: true },
      ...bilingual("name", "Name").map((f, i) => ({ ...f, list: i === 0 })),
      { name: "duration", label: "Duration (EN)", type: "text" },
      { name: "duration_ta", label: "Duration (TA)", type: "text" },
      { name: "price", label: "Price (blank = on enquiry)", type: "number" },
      ...bilingual("tagline", "Tagline"),
      ...bilingual("description", "Description", "textarea"),
      { name: "image_url", label: "Image", type: "image", bucket: "services" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "signature", label: "Signature", type: "bool", list: true },
      { name: "featured", label: "Featured", type: "bool", list: true },
      { name: "published", label: "Published", type: "bool", list: true },
    ],
  },
  offers: {
    table: "offers", label: "Offers", titleField: "title_en", orderBy: "sort_order",
    fields: [
      ...bilingual("title", "Title").map((f, i) => ({ ...f, list: i === 0 })),
      ...bilingual("description", "Description", "textarea"),
      ...bilingual("badge", "Badge"),
      { name: "image_url", label: "Image", type: "image", bucket: "banners" },
      { name: "show_popup", label: "Show as popup", type: "bool", list: true },
      { name: "starts_at", label: "Starts at", type: "date" },
      { name: "ends_at", label: "Ends at", type: "date" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "active", label: "Active", type: "bool", list: true },
    ],
  },
  gallery: {
    table: "gallery", label: "Gallery", titleField: "title_en", orderBy: "sort_order",
    fields: [
      ...bilingual("title", "Title").map((f, i) => ({ ...f, list: i === 0 })),
      { name: "category", label: "Category id", type: "text", list: true },
      ...bilingual("category_label", "Category label"),
      { name: "media_type", label: "Type (image|video|beforeafter)", type: "text", list: true },
      { name: "image_url", label: "Image", type: "image", bucket: "gallery" },
      { name: "video_url", label: "Video URL", type: "text" },
      { name: "before_url", label: "Before image", type: "image", bucket: "gallery" },
      { name: "after_url", label: "After image", type: "image", bucket: "gallery" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "bool" },
    ],
  },
  testimonials: {
    table: "testimonials", label: "Testimonials", titleField: "author", orderBy: "sort_order",
    fields: [
      { name: "author", label: "Author", type: "text", list: true },
      { name: "role", label: "Role (EN)", type: "text" },
      { name: "role_ta", label: "Role (TA)", type: "text" },
      { name: "rating", label: "Rating (1-5)", type: "number", list: true },
      { name: "text_en", label: "Quote (EN)", type: "textarea" },
      { name: "text_ta", label: "Quote (TA)", type: "textarea" },
      { name: "video_url", label: "Video URL", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "featured", label: "Featured", type: "bool", list: true },
    ],
  },
  blog_posts: {
    table: "blog_posts", label: "Blog", titleField: "title_en", orderBy: "published_at",
    fields: [
      { name: "slug", label: "Slug", type: "text", list: true },
      ...bilingual("title", "Title").map((f, i) => ({ ...f, list: i === 0 })),
      ...bilingual("excerpt", "Excerpt", "textarea"),
      { name: "body_en", label: "Body EN (HTML)", type: "textarea" },
      { name: "body_ta", label: "Body TA (HTML)", type: "textarea" },
      { name: "cover_url", label: "Cover", type: "image", bucket: "blog" },
      { name: "published_at", label: "Published at", type: "date" },
      { name: "published", label: "Published", type: "bool", list: true },
    ],
  },
  settings: {
    table: "settings", label: "Settings", titleField: "key", orderBy: "key",
    fields: [
      { name: "key", label: "Key", type: "text", list: true },
      { name: "value_json", label: "Value (JSON)", type: "textarea", list: false },
    ],
  },
  faqs: {
    table: "faqs", label: "FAQs", titleField: "question_en", orderBy: "sort_order",
    fields: [
      ...bilingual("question", "Question").map((f, i) => ({ ...f, list: i === 0 })),
      ...bilingual("answer", "Answer", "textarea"),
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "bool", list: true },
    ],
  },
};

export const ENTITY_ORDER = [
  "courses", "services", "offers", "gallery", "testimonials", "blog_posts", "faqs", "settings",
] as const;
