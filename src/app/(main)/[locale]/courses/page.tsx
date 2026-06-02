import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCourses } from "@/lib/content";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseTile } from "@/components/ui/CourseTile";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon } from "@/components/ui/icons";

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
    path: "/courses",
    title: t("coursesTitle"),
    description: t("coursesDescription"),
  });
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("courses");
  const tp = await getTranslations("courses.perks");
  const tc = await getTranslations("common");
  const courses = await getCourses();

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading eyebrow={tc("exploreCourses")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {/* Perks row */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <TrustBadge tone="gold">{tp("govCert")}</TrustBadge>
          <TrustBadge tone="gold">{tp("emi")}</TrustBadge>
          <TrustBadge tone="gold">{tp("placement")}</TrustBadge>
          <TrustBadge tone="gold">{tp("freeDemo")}</TrustBadge>
        </div>

        {courses.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md rounded-3xl border border-ink-border bg-ink-surface p-10 text-center">
            <p className="text-cream-muted">{t("empty")}</p>
            <div className="mt-6">
              <Button href={whatsappHref(waMessage.general())} variant="primary">
                <WhatsAppIcon className="h-4 w-4" />
                {tc("enquireWhatsApp")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Reveal key={course.id} delay={(i % 3) * 0.06}>
                <CourseTile course={course} locale={l} ctaLabel={tc("learnMore")} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
