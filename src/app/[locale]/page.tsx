import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappHref, waMessage } from "@/lib/whatsapp";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-radial-glow" />
      <div className="container-luxe flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <Reveal>
          <p className="eyebrow">{t("heroEyebrow")}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-gold-gradient">{t("heroTitle")}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-muted">
            {t("heroSubtitle")}
          </p>
        </Reveal>

        {/* Font proof: Latin + Tamil rendered explicitly */}
        <Reveal delay={0.3}>
          <div className="mt-10 grid gap-4 rounded-3xl border border-ink-border bg-ink-surface/60 p-6 text-left sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-luxe text-cream-dim">
                Playfair + Inter (Latin)
              </div>
              <p className="heading-display mt-1 text-2xl text-cream">
                Beauty, crafted with care.
              </p>
              <p className="font-sans text-sm text-cream-muted">
                Professional training since 2006.
              </p>
            </div>
            <div lang="ta">
              <div className="text-xs uppercase tracking-luxe text-cream-dim">
                Noto Serif + Sans Tamil
              </div>
              <p className="font-ta-display mt-1 text-2xl text-cream">
                அழகு, அக்கறையுடன்.
              </p>
              <p className="font-ta-sans text-sm text-cream-muted">
                2006 முதல் தொழில்முறை பயிற்சி.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={whatsappHref(waMessage.freeDemo())} variant="primary" size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              {tc("freeDemo")}
            </Button>
            <Button href={whatsappHref(waMessage.general())} variant="secondary" size="lg">
              {tc("enquireWhatsApp")}
            </Button>
          </div>
        </Reveal>

        <p className="mt-10 text-xs text-cream-dim">{t("shellNote")}</p>
      </div>
    </section>
  );
}
