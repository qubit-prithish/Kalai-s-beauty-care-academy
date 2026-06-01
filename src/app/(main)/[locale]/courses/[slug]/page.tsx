import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCourseBySlug, getCourses, getSettings } from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { courseJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { CourseTile } from "@/components/ui/CourseTile";
import { WhatsAppIcon } from "@/components/ui/icons";

// Generate a static page for every course slug × locale — fully data-driven.
export async function generateStaticParams() {
  const courses = await getCourses();
  return routing.locales.flatMap((locale) =>
    courses.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: `/courses/${slug}`,
    title: pick(course.title, l),
    description: pick(course.tagline, l),
    imageAlt: pick(course.image.alt, l),
    type: "article",
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const t = await getTranslations("courses.detail");
  const tRoot = await getTranslations("courses");
  const tp = await getTranslations("courses.perks");
  const tc = await getTranslations("common");
  const tb = await getTranslations("breadcrumb");
  const tnav = await getTranslations("nav");

  const settings = await getSettings();
  const all = await getCourses();
  const related = all.filter((c) => c.slug !== slug).slice(0, 3);

  const enrolHref = whatsappHref(waMessage.course(course.title.en));
  const syllabus = course.syllabus[l] ?? course.syllabus.en;
  const outcomes = course.outcomes[l] ?? course.outcomes.en;
  const whoFor = pick(course.whoFor, l);
  const tagline = pick(course.tagline, l);

  return (
    <>
      <JsonLd data={courseJsonLd(course, settings, l)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: tb("home"), path: "/" },
            { name: tnav("courses"), path: "/courses" },
            { name: pick(course.title, l), path: `/courses/${slug}` },
          ],
          l,
        )}
      />
      {/* Hero */}
      <section className="border-b border-ink-border">
        <div className="container-luxe py-12 lg:py-16">
          <Link
            href="/courses"
            prefetch={false}
            className="text-sm text-cream-dim transition hover:text-gold-200"
          >
            ← {t("backToCourses")}
          </Link>
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <Placeholder
                src={course.image.src}
                alt={pick(course.image.alt, l)}
                ratio="aspect-[4/5]"
                className="rounded-3xl"
              />
            </Reveal>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TrustBadge tone="gold">{pick(course.duration, l)}</TrustBadge>
                <TrustBadge>{tp("govCert")}</TrustBadge>
                <TrustBadge>{tp("emi")}</TrustBadge>
                <TrustBadge>{tp("placement")}</TrustBadge>
              </div>
              <h1 className="heading-display mt-4 text-4xl text-cream sm:text-5xl">
                {pick(course.title, l)}
              </h1>
              {tagline && (
                <p className="heading-display mt-3 text-lg text-gold-200">{tagline}</p>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink-border bg-ink-surface p-5">
                  <div className="text-xs uppercase tracking-luxe text-cream-dim">
                    {t("duration")}
                  </div>
                  <div className="heading-display mt-1 text-xl text-cream">
                    {pick(course.duration, l)}
                  </div>
                </div>
                <div className="rounded-2xl border border-ink-border bg-ink-surface p-5">
                  <div className="text-xs uppercase tracking-luxe text-cream-dim">
                    {t("fee")}
                  </div>
                  <div className="heading-display mt-1 text-xl text-gold-200">
                    {course.price !== null
                      ? `₹${course.price.toLocaleString("en-IN")}`
                      : pick(course.priceNote, l)}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={enrolHref} variant="primary" size="lg">
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("enrolCta")}
                </Button>
                <Button href={whatsappHref(waMessage.freeDemo())} variant="secondary" size="lg">
                  {tc("freeDemo")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + syllabus + outcomes */}
      <section className="py-section">
        <div className="container-luxe grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="heading-display text-2xl text-cream">{t("overview")}</h2>
            <p className="mt-4 leading-relaxed text-cream-muted">
              {pick(course.description, l)}
            </p>

            {syllabus.length > 0 && (
              <>
                <h2 className="heading-display mt-10 text-2xl text-cream">{t("syllabus")}</h2>
                <p className="mt-2 text-sm text-cream-dim">{t("syllabusNote")}</p>
                <ul className="mt-5 space-y-3">
                  {syllabus.map((row, i) => (
                    <li key={i} className="flex gap-3 text-cream-muted">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold-500/40 text-xs font-bold text-gold-200">
                        {i + 1}
                      </span>
                      <span>{row}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {whoFor && (
              <>
                <h2 className="heading-display mt-10 text-2xl text-cream">{tRoot("whoForTitle")}</h2>
                <p className="mt-4 leading-relaxed text-cream-muted">{whoFor}</p>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {outcomes.length > 0 && (
                <div className="rounded-3xl border border-ink-border bg-ink-surface p-6">
                  <h3 className="heading-display text-lg text-cream">{tRoot("outcomesTitle")}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {outcomes.map((row, i) => (
                      <li key={i} className="flex gap-2 text-sm text-cream-muted">
                        <span className="text-gold-300">✓</span>
                        <span>{row}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-6">
                <h3 className="heading-display text-lg text-gold-200">{t("perksTitle")}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-cream-muted">
                  <li>✓ {tp("govCert")}</li>
                  <li>✓ {tp("emi")}</li>
                  <li>✓ {tp("placement")}</li>
                  <li>✓ {tp("freeDemo")}</li>
                </ul>
                <div className="mt-6">
                  <Button href={enrolHref} variant="primary" className="w-full">
                    <WhatsAppIcon className="h-4 w-4" />
                    {t("enrolCta")}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-ink-border py-section">
          <div className="container-luxe">
            <h2 className="heading-display text-2xl text-cream sm:text-3xl">{t("related")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseTile key={c.id} course={c} locale={l} ctaLabel={tc("learnMore")} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
