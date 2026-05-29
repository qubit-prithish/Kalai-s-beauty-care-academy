import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ta"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // `as-needed` keeps the default (en) URLs clean (/courses) while Tamil is
  // prefixed (/ta/courses). Good for SEO + a clean default experience.
  localePrefix: "as-needed",
});
