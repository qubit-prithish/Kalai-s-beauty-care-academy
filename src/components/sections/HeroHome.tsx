import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";
import { HeroParticles } from "@/components/three/HeroParticles";
import { HeroWoman } from "./HeroWoman";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import type { Settings } from "@/lib/content/types";

/**
 * Home hero with the golden-particles 3D accent. The 3D field is dynamically
 * imported (ssr:false) inside <HeroParticles>, with a static gold backdrop as
 * the fallback for first paint, reduced-motion, and low-power/mobile devices.
 */
export async function HeroHome({ settings }: { settings: Settings }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden">
      {/* Golden-particles 3D accent (lazy, mobile/reduced-motion safe) */}
      <HeroParticles />

      {/* Two-column hero layout */}
      <div className="hero__grid container-luxe relative z-[5] grid min-h-[88vh] grid-cols-1 gap-8 lg:grid-cols-[55%_45%] items-center py-24">
        {/* LEFT COLUMN: Text content */}
        <div className="hero__content flex flex-col items-start justify-center text-left min-w-0">
          <Reveal className="max-w-full">
            <TrustBadge tone="gold" icon={<StarIcon className="h-3 w-3" />}>
              {settings.googleRating}★ Google Rated
            </TrustBadge>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow mt-6">{t("heroEyebrow")}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <h1 className="heading-display mt-4 max-w-4xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              <span className="text-gold-gradient">{t("heroTitle")}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-muted">
              {t("heroSubtitle")}
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-start">
                <Button href={whatsappHref(waMessage.freeDemo())} variant="primary" size="lg">
                  <WhatsAppIcon className="h-5 w-5" />
                  {tc("freeDemo")}
                </Button>
              </div>
              <Button href="/courses" variant="secondary" size="lg">
                {tc("exploreCourses")}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4} className="w-full max-w-full min-w-0">
            <div className="mt-10 w-full overflow-x-auto hide-scrollbar trust-badge-row pb-2 md:pb-0">
              <div className="flex w-max items-center gap-2 px-1">
                <TrustBadge tone="gold" className="shrink-0">
                  {t("badgeSince")}
                </TrustBadge>
                <TrustBadge tone="default" className="shrink-0">
                  {t("badgeRatingShort")}
                </TrustBadge>
                <TrustBadge tone="default" className="shrink-0">
                  {t("badgeTrained")}
                </TrustBadge>
                <TrustBadge tone="default" className="shrink-0">
                  {t("badgeCertifiedShort")}
                </TrustBadge>
                <TrustBadge tone="default" className="shrink-0">
                  {t("badgePlacement")}
                </TrustBadge>
              </div>
            </div>
          </Reveal>
        </div>

        {/* RIGHT COLUMN: Woman image */}
        <div className="hero__woman-column relative z-[3] lg:block hidden">
          <HeroWoman />
        </div>
      </div>
    </section>
  );
}
