import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    path: "/privacy",
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");

  return (
    <section className="py-section">
      <div className="container-luxe max-w-3xl">
        <SectionHeading title={t("title")} subtitle={t("lastUpdated")} as="h1" />

        <div className="mt-12 space-y-12">
          {["collection", "usage", "analytics", "itAct", "deletion"].map((key) => (
            <div key={key}>
              <h2 className="heading-display text-xl text-cream">{t(`sections.${key}.title`)}</h2>
              <p className="mt-4 leading-relaxed text-cream-muted">{t(`sections.${key}.content`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
