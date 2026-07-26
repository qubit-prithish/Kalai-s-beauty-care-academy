import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import type { Settings } from "@/lib/content/types";

/**
 * Home hero with full-width duotoned background image.
 */
export async function HeroHome({ settings }: { settings: Settings }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Fade Pink / Oxblood Duotone Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Kalai's Beauty Care Mehendi"
          fill
          priority
          className="object-cover lg:object-[20%_center]"
          style={{
            filter: "grayscale(1) sepia(0.20) contrast(1.05)",
          }}
        />
        {/* Multiply overlay for the wine/oxblood tone - reduced opacity for natural look */}
        <div className="absolute inset-0 bg-[#6B1E32] mix-blend-multiply opacity-20"></div>
        {/* Softened ivory gradient to ensure perfect text readability without hiding the hand */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent lg:bg-gradient-to-l lg:from-ink/95 lg:via-ink/40 lg:to-transparent"></div>
      </div>

      {/* Single-column full-width layout */}
      <div className="container-luxe relative z-[5] flex min-h-[88vh] flex-col justify-center lg:justify-start lg:pt-32 items-center lg:items-end text-center lg:text-right py-24">
        
        {/* Text content - Width constrained on large screens to fit top-right */}
        <div className="hero__content flex flex-col items-center lg:items-end w-full lg:w-[60%]">
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
            <div className="mt-9 flex flex-wrap justify-center lg:justify-end items-center gap-3">
              <div className="flex flex-col items-center lg:items-end">
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
            <div className="mt-10 w-full overflow-x-auto hide-scrollbar trust-badge-row pb-2 md:pb-0 flex justify-center lg:justify-end">
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
      </div>
    </section>
  );
}
