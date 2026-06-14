import { getTranslations } from "next-intl/server";
import { Button, WhatsAppMicrocopy } from "@/components/ui/Button";
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

      {/* Woman image + glow (client component with CSS module) */}
      <HeroWoman />

      {/* Hero text content — z-index 5, left side */}
      <div className="hero__content container-luxe relative z-[5] flex min-h-[88vh] flex-col items-start justify-center py-24 text-left w-full max-w-[45%] px-gutter">
        <Reveal>
          <TrustBadge tone="gold" icon={<StarIcon className="h-3 w-3" />}>
            {settings.googleRating}★ · {settings.googleReviews} Google reviews
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
              <WhatsAppMicrocopy />
            </div>
            <Button href="/courses" variant="secondary" size="lg">
              {tc("exploreCourses")}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 w-full max-w-full overflow-x-auto scrollbar-none">
            <div className="flex w-max items-center gap-2 px-1">
              <TrustBadge tone="gold" className="shrink-0">
                Since 2006
              </TrustBadge>
              <TrustBadge tone="default" className="shrink-0">
                {"4.8\u2605 Google"}
              </TrustBadge>
              <TrustBadge tone="default" className="shrink-0">
                1000+ Trained
              </TrustBadge>
              <TrustBadge tone="default" className="shrink-0">
                Govt-Certified
              </TrustBadge>
              <TrustBadge tone="default" className="shrink-0">
                Placement Support
              </TrustBadge>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
