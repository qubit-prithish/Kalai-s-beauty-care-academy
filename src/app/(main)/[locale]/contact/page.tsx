import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage, telHref } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, MapPinIcon } from "@/components/ui/icons";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

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
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("contact");
  const tc = await getTranslations("common");
  const settings = await getSettings();
  const { address, contact, hours } = settings;

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    address.mapEmbedQuery,
  )}&output=embed`;

  return (
    <section className="py-section">
      <div className="container-luxe">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} as="h1" />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Left: NAP + hours + contact */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-ink-border bg-ink-surface p-8">
              <h2 className="heading-display text-xl text-cream">{t("addressTitle")}</h2>
              <address className="mt-3 flex items-start gap-2 not-italic leading-relaxed text-cream-muted">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span>
                  {address.line1}, {address.line2}
                  <br />
                  {address.city} – {address.pincode}
                  <br />
                  <span className="text-cream-dim">{pick(address.landmark, l)}</span>
                </span>
              </address>

              <h2 className="heading-display mt-7 text-xl text-cream">{t("hoursTitle")}</h2>
              <dl className="mt-3 space-y-2 text-sm text-cream-muted">
                <div className="flex justify-between gap-4">
                  <dt className="text-cream-dim">{pick({ en: "Salon", ta: "அழகு நிலையம்" }, l)}</dt>
                  <dd className="text-right">{pick(hours.salon, l)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-cream-dim">{pick({ en: "Academy", ta: "கல்விக்கூடம்" }, l)}</dt>
                  <dd className="text-right">{pick(hours.academy, l)}</dd>
                </div>
                <p className="text-cream-dim">{pick(hours.note, l)}</p>
              </dl>

              <h2 className="heading-display mt-7 text-xl text-cream">{t("getInTouch")}</h2>
              <div className="mt-3 space-y-1.5 text-sm">
                <a href={telHref(contact.phonePrimaryE164)} className="block text-cream-muted hover:text-gold-200">
                  {contact.phonePrimary}
                </a>
                <a href={telHref(contact.phoneSecondaryE164)} className="block text-cream-muted hover:text-gold-200">
                  {contact.phoneSecondary}
                </a>
                <a href={`mailto:${contact.email}`} className="block break-all text-cream-muted hover:text-gold-200">
                  {contact.email}
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={whatsappHref(waMessage.contact())} variant="primary">
                  <WhatsAppIcon className="h-4 w-4" />
                  {tc("enquireWhatsApp")}
                </Button>
                <Button href={telHref(contact.phonePrimaryE164)} variant="secondary">
                  {tc("callNow")}
                </Button>
              </div>
            </div>
          </div>

          {/* Right: map + enquiry form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="overflow-hidden rounded-3xl border border-ink-border">
              <iframe
                title="Google map — Kalai's Beauty Care & Academy"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
              <div className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm text-cream-dim">{pick(address.landmark, l)}</span>
                <a
                  href={address.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-200 hover:underline"
                >
                  {t("directions")} →
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-ink-border bg-ink-surface p-8">
              <h2 className="heading-display text-xl text-cream">{t("formTitle")}</h2>
              <p className="mt-1.5 text-sm text-cream-dim">{t("formNote")}</p>
              <div className="mt-6">
                <EnquiryForm
                  labels={{
                    name: t("name"),
                    phone: t("phone"),
                    topic: t("topic"),
                    topicGeneral: t("topicGeneral"),
                    topicCourse: t("topicCourse"),
                    topicService: t("topicService"),
                    message: t("message"),
                    submit: t("submit"),
                    sending: t("sending"),
                    successTitle: t("successTitle"),
                    successText: t("successText"),
                    errName: t("errName"),
                    errPhone: t("errPhone"),
                    errMessage: t("errMessage"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
