import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
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
    path: "/about",
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  });
}

const USP_KEYS = ["techniques", "accessories", "treatments", "handsOn", "reputation", "legacy"] as const;
const FACILITY_KEYS = ["ac", "wifi", "parking", "wheelchair", "restroom", "refreshments", "women"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("about");
  const tu = await getTranslations("usps");
  const tf = await getTranslations("facilities");
  const tc = await getTranslations("common");
  const settings = await getSettings();

  return (
    <>
      {/* Intro */}
      <section className="py-section">
        <div className="container-luxe">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} as="h1" />
        </div>
      </section>

      {/* Story + mission */}
      <section className="pb-section">
        <div className="container-luxe grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-ink-border bg-ink-surface p-8">
              <h2 className="heading-display text-2xl text-cream">{t("storyTitle")}</h2>
              <p className="mt-4 leading-relaxed text-cream-muted">{t("story")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-8">
              <h2 className="heading-display text-2xl text-gold-200">{t("missionTitle")}</h2>
              <p className="mt-4 leading-relaxed text-cream">{t("mission")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="pb-section">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <Placeholder
              ratio="aspect-[4/5]"
              className="rounded-3xl"
              label={pick({ en: "Founder photo", ta: "நிறுவனர் புகைப்படம்" }, l)}
            />
          </Reveal>
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow">{t("founderTitle")}</p>
              <h2 className="heading-display mt-3 text-3xl text-cream sm:text-4xl">
                {t("founderName")}
              </h2>
              <p className="mt-2 text-gold-200">{t("founderRole")}</p>
              <p className="mt-5 leading-relaxed text-cream-muted">{t("founderBio")}</p>
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-luxe text-gold-300">
                  {t("credentialsTitle")}
                </h3>
                <p className="mt-2 text-sm text-cream-dim">{t("credentialsPending")}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-ink-border bg-ink-surface/40 py-section">
        <div className="container-luxe">
          <SectionHeading eyebrow={t("whyTitle")} title={t("whyTitle")} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USP_KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-ink-border bg-ink-page p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-gradient font-display text-lg font-bold text-ink-page">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-cream-muted">{tu(key)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-section">
        <div className="container-luxe">
          <SectionHeading eyebrow={t("facilitiesTitle")} title={t("facilitiesTitle")} />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {FACILITY_KEYS.map((key) => (
              <TrustBadge key={key} tone="gold" className="px-4 py-2 text-sm">
                {tf(key)}
              </TrustBadge>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-section">
        <div className="container-luxe">
          <SectionHeading eyebrow={t("teamTitle")} title={t("teamTitle")} subtitle={t("teamSubtitle")} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: settings.trainers }).map((_, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="overflow-hidden rounded-3xl border border-ink-border bg-ink-surface">
                  <Placeholder ratio="aspect-square" label={t("trainerPending")} />
                  <div className="p-5 text-center">
                    <div className="heading-display text-lg text-cream">
                      {t("trainerRole")} {i + 1}
                    </div>
                    <div className="text-sm text-cream-dim">{t("trainerPending")}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-section">
        <div className="container-luxe">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-10 text-center">
            <h2 className="heading-display text-2xl text-cream sm:text-3xl">{tc("freeDemo")}</h2>
            <Button href={whatsappHref(waMessage.freeDemo())} variant="primary" size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              {tc("enquireWhatsApp")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
