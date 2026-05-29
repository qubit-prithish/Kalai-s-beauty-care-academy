import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

const OG_LOCALE: Record<Locale, string> = {
  en: "en_IN",
  ta: "ta_IN",
};

/**
 * Build a locale-aware path. We use next-intl `localePrefix: "as-needed"`, so
 * the default locale (en) has no prefix and `ta` is prefixed with /ta.
 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}` || `/${locale}`;
}

export function absoluteUrl(locale: Locale, path: string): string {
  const p = localizedPath(locale, path);
  return `${SITE_URL}${p === "/" ? "" : p}` || SITE_URL;
}

/**
 * Canonical + hreflang alternates for a given page path (path WITHOUT locale
 * prefix, e.g. "/courses/basic-beautician").
 */
export function alternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l === "en" ? "en-IN" : "ta-IN"] = absoluteUrl(l, path);
  }
  // x-default points to the default locale.
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return {
    canonical: absoluteUrl(routing.defaultLocale, path),
    languages,
  };
}

type BuildMetaArgs = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Optional OG image path (absolute or site-relative). */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

/** Build complete per-page metadata: title, description, canonical, hreflang,
 *  Open Graph and Twitter cards. */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  imageAlt,
  type = "website",
}: BuildMetaArgs): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/og.png`;

  return {
    title,
    description,
    alternates: alternates(path),
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "Kalai's Beauty Care & Academy",
      locale: OG_LOCALE[locale],
      images: [{ url: ogImage, alt: imageAlt ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
