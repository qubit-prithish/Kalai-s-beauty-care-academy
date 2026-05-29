import type { Localized } from "@/lib/content/types";
import type { Locale } from "@/i18n/routing";

/** Pick the string for the active locale from a Localized object. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value.en;
}
