import type { Course, Settings } from "@/lib/content/types";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/locale";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

/** LocalBusiness + EducationalOrganization with NAP, hours, geo, rating. */
export function localBusinessJsonLd(settings: Settings, locale: Locale) {
  const { address, contact } = settings;
  return {
    "@context": "https://schema.org",
    "@type": ["BeautySalon", "EducationalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: pick(settings.brandName, locale),
    description: pick(settings.tagline, locale),
    url: SITE_URL,
    telephone: contact.phonePrimaryE164,
    email: contact.email,
    foundingDate: String(settings.established),
    priceRange: "₹₹",
    image: `${SITE_URL}/og.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.1143,
      longitude: 80.1548,
    },
    hasMap: address.mapLink,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.googleRating,
      reviewCount: settings.googleReviews,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [contact.instagram, contact.facebook],
  };
}

/** Course schema for a course detail page. */
export function courseJsonLd(course: Course, settings: Settings, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: pick(course.title, locale),
    description: pick(course.description, locale),
    url: absoluteUrl(locale, `/courses/${course.slug}`),
    provider: {
      "@type": "Organization",
      name: pick(settings.brandName, locale),
      sameAs: SITE_URL,
    },
    inLanguage: locale === "ta" ? "ta-IN" : "en-IN",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.googleRating,
      reviewCount: settings.googleReviews,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/** BreadcrumbList for nested pages. `items` are [{name, path}] without locale. */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
