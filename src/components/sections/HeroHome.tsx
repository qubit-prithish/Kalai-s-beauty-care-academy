import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import type { Settings } from "@/lib/content/types";

/**
 * Home hero. Contains a placeholder slot for the F3 golden-particles 3D accent
 * (data-hero-3d-slot). The 3D itself is lazy-loaded into this slot in F3; for
 * now it renders an elegant static gradient so the hero is complete + fast.
 */
export async function HeroHome({ settings }: { settings: Settings }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  return (
    <section className="relative overflow-hidden">
      {/* 3D accent slot (static fallback until F3) */}
      <div
        data-hero-3d-slot
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 top-0 h-[80vh] bg-radial-glow" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="container-luxe flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
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
