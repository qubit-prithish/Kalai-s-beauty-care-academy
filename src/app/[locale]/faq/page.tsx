import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getFaqs } from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("faq");
  const tc = await getTranslations("common");
  const faqs = await getFaqs();

  return (
    <section className="py-section">
      <div className="container-luxe max-w-3xl">
        <SectionHeading eyebrow={t("title")} title={t("title")} subtitle={t("subtitle")} as="h1" />

        {faqs.length === 0 ? (
          <p className="mt-16 text-center text-cream-muted">{t("empty")}</p>
        ) : (
          <div className="mt-12">
            <FaqAccordion
              items={faqs.map((f) => ({
                id: f.id,
                question: pick(f.question, l),
                answer: pick(f.answer, l),
              }))}
            />
          </div>
        )}

        <div className="mt-12 rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-8 text-center">
          <h2 className="heading-display text-xl text-cream">{t("ctaTitle")}</h2>
          <p className="mt-2 text-sm text-cream-muted">{t("ctaText")}</p>
          <div className="mt-5 flex justify-center">
            <Button href={whatsappHref(waMessage.general())} variant="primary">
              <WhatsAppIcon className="h-4 w-4" />
              {tc("enquireWhatsApp")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
