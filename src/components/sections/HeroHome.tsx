import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";
import { HeroParticles } from "@/components/three/HeroParticles";
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

      {/* Brand model — anchored to the right, bleeding off the top/right edge.
          Hidden on small screens so the centered title stays the focus; on lg+
          it fills the empty right half and gazes inward toward the CTA. A
          left-to-right gradient keeps the gold title fully readable. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-[5] hidden w-[58%] max-w-3xl lg:block xl:w-1/2"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-model.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
        {/* Fade the image into the black background toward the title side */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-page via-ink-page/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-page to-transparent" />
      </div>

      <div className="container-luxe relative flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
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
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={whatsappHref(waMessage.freeDemo())} variant="primary" size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              {tc("freeDemo")}
            </Button>
            <Button href="/courses" variant="secondary" size="lg">
              {tc("exploreCourses")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
