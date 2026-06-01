import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getServices } from "@/lib/content";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceTile } from "@/components/ui/ServiceTile";
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
    path: "/services",
    title: t("servicesTitle"),
    description: t("servicesDescription"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  const services = await getServices();

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading eyebrow={tc("viewServices")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {services.length === 0 ? (
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
            {services.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 0.06}>
                <ServiceTile
                  service={service}
                  locale={l}
                  ctaLabel={tc("learnMore")}
                  signatureLabel={t("signature")}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
