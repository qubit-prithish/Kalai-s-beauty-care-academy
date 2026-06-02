// One config per table drives the shared List + Create/Edit form. No per-entity pages.
export type FieldType = "text" | "textarea" | "number" | "bool" | "date" | "image" | "select";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Storage bucket for image fields. */
  bucket?: string;
  /** Options for select fields. */
  options?: { label: string; value: string }[];
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
      {
        name: "media_type",
        label: "Type",
        type: "select",
        list: true,
        options: [
          { label: "Image", value: "image" },
          { label: "Before/After", value: "beforeafter" },
        ],
      },
      { name: "image_url", label: "Image", type: "image", bucket: "gallery" },
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
  about_page: {
    table: "about_page", label: "About Page (Main)", titleField: "id", orderBy: "id",
    fields: [
      { name: "hero_eyebrow_en", label: "Hero Eyebrow (EN)", type: "text" },
      { name: "hero_eyebrow_ta", label: "Hero Eyebrow (TA)", type: "text" },
      { name: "hero_title_en", label: "Hero Title (EN)", type: "text" },
      { name: "hero_title_ta", label: "Hero Title (TA)", type: "text" },
      { name: "hero_subtitle_en", label: "Hero Subtitle (EN)", type: "textarea" },
      { name: "hero_subtitle_ta", label: "Hero Subtitle (TA)", type: "textarea" },
      
      { name: "story_title_en", label: "Story Title (EN)", type: "text" },
      { name: "story_title_ta", label: "Story Title (TA)", type: "text" },
      { name: "story_en", label: "Story (EN)", type: "textarea" },
      { name: "story_ta", label: "Story (TA)", type: "textarea" },
      
      { name: "mission_title_en", label: "Mission Title (EN)", type: "text" },
      { name: "mission_title_ta", label: "Mission Title (TA)", type: "text" },
      { name: "mission_en", label: "Mission (EN)", type: "textarea" },
      { name: "mission_ta", label: "Mission (TA)", type: "textarea" },
      
      { name: "founder_title_en", label: "Founder Header (EN)", type: "text" },
      { name: "founder_title_ta", label: "Founder Header (TA)", type: "text" },
      { name: "founder_name_en", label: "Founder Name (EN)", type: "text" },
      { name: "founder_name_ta", label: "Founder Name (TA)", type: "text" },
      { name: "founder_role_en", label: "Founder Role (EN)", type: "text" },
      { name: "founder_role_ta", label: "Founder Role (TA)", type: "text" },
      { name: "founder_bio_en", label: "Founder Bio (EN)", type: "textarea" },
      { name: "founder_bio_ta", label: "Founder Bio (TA)", type: "textarea" },
      { name: "founder_image_url", label: "Founder Photo", type: "image", bucket: "about" },
      
      { name: "credentials_title_en", label: "Credentials Title (EN)", type: "text" },
      { name: "credentials_title_ta", label: "Credentials Title (TA)", type: "text" },
      { name: "credentials_desc_en", label: "Credentials Desc (EN)", type: "textarea" },
      { name: "credentials_desc_ta", label: "Credentials Desc (TA)", type: "textarea" },
    ],
  },
  about_why: {
    table: "about_why_choose_us", label: "About: Why Choose Us", titleField: "text_en", orderBy: "sort_order",
    fields: [
      ...bilingual("text", "Reason"),
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  about_facilities: {
    table: "about_facilities", label: "About: Facilities", titleField: "name_en", orderBy: "sort_order",
    fields: [
      ...bilingual("name", "Facility Name"),
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  trainers: {
    table: "about_trainers", label: "About: Trainers", titleField: "name_en", orderBy: "sort_order",
    fields: [
      ...bilingual("name", "Trainer Name").map((f, i) => ({ ...f, list: i === 0 })),
      ...bilingual("role", "Role"),
      ...bilingual("bio", "Short Bio", "textarea"),
      { name: "image_url", label: "Trainer Photo", type: "image", bucket: "about" },
      { name: "sort_order", label: "Sort order", type: "number" },
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
  "courses", "services", "offers", "gallery", "testimonials", "about_page", "about_why", "about_facilities", "trainers", "faqs", "settings",
] as const;
