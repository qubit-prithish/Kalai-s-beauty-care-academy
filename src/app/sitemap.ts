import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCourseSlugs, getServiceSlugs, getBlogSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/about",
  "/courses",
  "/services",
  "/gallery",
  "/testimonials",
  "/offers",
  "/blog",
  "/faq",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courseSlugs, serviceSlugs, blogSlugs] = await Promise.all([
    getCourseSlugs(),
    getServiceSlugs(),
    getBlogSlugs(),
  ]);

  const paths = [
    ...STATIC_PATHS,
    ...courseSlugs.map((s) => `/courses/${s}`),
    ...serviceSlugs.map((s) => `/services/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
  ];

  const now = new Date();

  return paths.map((path) => {
    // Build hreflang alternates for each URL.
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l === "en" ? "en-IN" : "ta-IN"] = absoluteUrl(l, path);
    }
    
    // Priority mapping for better SEO weighting:
    // / (Home) -> 1.0
    // /courses, /services, /gallery, etc. (Listings) -> 0.8
    // /about, /contact, /faq (Static) -> 0.7
    // /courses/[slug], /services/[slug] (Detail) -> 0.6
    // /blog/[slug] (Individual posts) -> 0.5
    let priority = 0.5;
    if (path === "/") priority = 1.0;
    else if (STATIC_PATHS.includes(path)) {
      priority = ["/courses", "/services", "/gallery", "/offers", "/blog"].includes(path) ? 0.8 : 0.7;
    } else if (path.startsWith("/courses/") || path.startsWith("/services/")) {
      priority = 0.6;
    }

    return {
      url: absoluteUrl(routing.defaultLocale, path),
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority,
      alternates: { languages },
    };
  });
}

export const revalidate = 3600; // Refresh every hour
