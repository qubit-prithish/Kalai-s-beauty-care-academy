import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Course } from "@/lib/content/types";
import { pick } from "@/lib/locale";
import { Card } from "./Card";
import { Placeholder } from "./Placeholder";
import { TrustBadge } from "./TrustBadge";

export function CourseTile({
  course,
  locale,
  ctaLabel,
}: {
  course: Course;
  locale: Locale;
  ctaLabel: string;
}) {
  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link
        href={`/courses/${course.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        <div className="overflow-hidden">
          <Placeholder
            src={course.image.src}
            alt={pick(course.image.alt, locale)}
            ratio="aspect-[4/3]"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TrustBadge tone="gold">{pick(course.duration, locale)}</TrustBadge>
          </div>
          <h3 className="heading-display text-xl text-cream transition-colors group-hover:text-gold-200">
            {pick(course.title, locale)}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-muted">
            {pick(course.tagline, locale)}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-ink-border pt-4">
            <span className="text-sm font-semibold text-gold-200">
              {course.price !== null
                ? `₹${course.price.toLocaleString("en-IN")}`
                : pick(course.priceNote, locale)}
            </span>
            <span className="text-sm text-cream-dim transition-colors group-hover:text-gold-200">
              {ctaLabel} →
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
