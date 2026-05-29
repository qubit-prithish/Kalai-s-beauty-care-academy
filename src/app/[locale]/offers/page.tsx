import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getOffers } from "@/lib/content";
import { pick } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Placeholder } from "@/components/ui/Placeholder";
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
    path: "/offers",
    title: t("offersTitle"),
    description: t("offersDescription"),
  });
}

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("offers");
  const tc = await getTranslations("common");
  const offers = await getOffers();

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(l === "ta" ? "ta-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading eyebrow={t("title")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {offers.length === 0 ? (
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
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={(i % 3) * 0.06}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gold-500/25 bg-ink-surface">
                  <Placeholder src={o.image.src} alt={pick(o.image.alt, l)} ratio="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-6">
                    <TrustBadge tone="gold" className="w-fit">{pick(o.badge, l)}</TrustBadge>
                    <h2 className="heading-display mt-3 text-xl text-cream">{pick(o.title, l)}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-muted">
                      {pick(o.description, l)}
                    </p>
                    {o.endsAt ? (
                      <p className="mt-3 text-xs text-cream-dim">
                        {t("validUntil")}: {fmt(o.endsAt)}
                      </p>
                    ) : null}
                    <div className="mt-5">
                      <Button
                        href={whatsappHref(waMessage.general())}
                        variant="primary"
                        className="w-full"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        {t("claimCta")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
