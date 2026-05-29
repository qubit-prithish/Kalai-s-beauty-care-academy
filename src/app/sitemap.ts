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
    return {
      url: absoluteUrl(routing.defaultLocale, path),
      lastModified: now,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.includes("/") && path.length > 1 ? 0.7 : 0.8,
      alternates: { languages },
    };
  });
}

export const dynamic = "force-static";
