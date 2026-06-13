import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSettings, getTestimonials } from "@/lib/content";
import { pick } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCarousel, Avatar, RoleBadge } from "@/components/ui/TestimonialCarousel";
import { StarIcon } from "@/components/ui/icons";
import { getInitials } from "@/lib/cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildMetadata({
    locale: l,
    path: "/testimonials",
    title: t("testimonialsTitle"),
    description: t("testimonialsDescription"),
  });
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("testimonials");
  const [settings, testimonials] = await Promise.all([getSettings(), getTestimonials()]);

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} as="h1" />

        {/* Google-style summary */}
        <Reveal className="mx-auto mt-12 max-w-md">
          <div className="rounded-3xl border border-ink-border bg-ink-surface p-8 text-center">
            <div className="heading-display text-5xl text-gold-gradient">
              {settings.googleRating.toFixed(1)}
            </div>
            <div className="mt-2 flex justify-center gap-1 text-gold-400" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5" />
              ))}
            </div>
            <p className="mt-3 text-sm text-cream-muted">
              {t("summaryRating")} · {settings.googleReviews} {t("summaryReviews")}
            </p>
          </div>
        </Reveal>

        {testimonials.length === 0 ? (
          <p className="mt-16 text-center text-cream-muted">{t("empty")}</p>
        ) : (
          <>
            <div className="mt-14">
              <TestimonialCarousel
                items={testimonials.map((tm) => ({
                  id: tm.id,
                  name: tm.name,
                  role: pick(tm.role, l),
                  quote: pick(tm.quote, l),
                  rating: tm.rating,
                }))}
              />
            </div>

            {/* Full grid */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((tm, i) => (
                <Reveal key={tm.id} delay={(i % 3) * 0.06}>
                  <figure className="flex h-full flex-col rounded-3xl border border-ink-border bg-ink-surface p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar
                        src={tm.avatar?.src}
                        alt={tm.avatar?.alt?.[l] ?? tm.avatar?.alt?.en}
                        name={tm.name}
                        fallbackInitials={getInitials(tm.name)}
                        className="mb-3"
                      />
                      <div className="font-semibold text-gold-200">{tm.name}</div>
                      <RoleBadge className="mt-2">
                        {pick(tm.role, l)}
                      </RoleBadge>
                    </div>
                    <div className="mt-4 flex gap-1 text-gold-400" aria-label={`${tm.rating} / 5`}>
                      {Array.from({ length: tm.rating }).map((_, s) => (
                        <StarIcon key={s} className="h-4 w-4" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream-muted text-center">
                      &ldquo;{pick(tm.quote, l)}&rdquo;
                    </blockquote>
                  </figure>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
