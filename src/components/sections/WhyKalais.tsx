"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { ScissorsIcon, WandIcon, LeafIcon, UsersIcon, StarIcon, AwardIcon } from "@/components/ui/icons";

const USP_CARDS = [
  {
    key: "techniques",
    titleKey: "techniques",
    descKey: "techniquesDesc",
    icon: ScissorsIcon,
  },
  {
    key: "accessories",
    titleKey: "accessories",
    descKey: "accessoriesDesc",
    icon: WandIcon,
  },
  {
    key: "treatments",
    titleKey: "treatments",
    descKey: "treatmentsDesc",
    icon: LeafIcon,
  },
  {
    key: "handsOn",
    titleKey: "handsOn",
    descKey: "handsOnDesc",
    icon: UsersIcon,
  },
  {
    key: "reputation",
    titleKey: "reputation",
    descKey: "reputationDesc",
    icon: StarIcon,
  },
  {
    key: "legacy",
    titleKey: "legacy",
    descKey: "legacyDesc",
    icon: AwardIcon,
  },
] as const;

export function WhyKalais() {
  const tu = useTranslations("usps");

  return (
    <section className="py-section">
      <div className="container-luxe">
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USP_CARDS.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.06}>
              <div className="why-card flex h-full flex-col gap-3 rounded-2xl border border-ink-border bg-ink-surface p-6 transition-colors hover:border-gold-500/30">
                <card.icon className="why-card__icon h-6 w-6 text-gold-500" aria-hidden="true" />
                <h3 className="why-card__title heading-display text-base font-semibold text-cream m-0">{tu(card.titleKey)}</h3>
                <p className="why-card__desc text-sm leading-relaxed text-cream-muted m-0">{tu(card.descKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}