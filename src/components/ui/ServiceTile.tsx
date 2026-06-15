import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Service } from "@/lib/content/types";
import { pick } from "@/lib/locale";
import { Button } from "./Button";
import { Card } from "./Card";
import { Placeholder } from "./Placeholder";
import { TrustBadge } from "./TrustBadge";
import { StarIcon, WhatsAppIcon } from "./icons";

export function ServiceTile({
  service,
  locale,
  ctaLabel,
  signatureLabel,
}: {
  service: Service;
  locale: Locale;
  ctaLabel: string;
  signatureLabel: string;
}) {
  const currentLocale = useLocale();
  const t = useTranslations("services");
  const title = currentLocale === "ta" ? service.title.ta : service.title.en;
  const message = encodeURIComponent(`I want to book: ${title}`);
  const href = `https://wa.me/919566229900?text=${message}`;

  return (
    <Card interactive className="group flex h-full flex-col overflow-hidden">
      <Link
        href={`/services/${service.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        <div className="relative overflow-hidden">
          <Placeholder
            src={service.image.src}
            alt={pick(service.image.alt, locale)}
            ratio="aspect-[4/3]"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {service.signature ? (
            <span className="absolute left-3 top-3">
              <TrustBadge tone="signature" icon={<StarIcon className="h-3 w-3" />}>
                {signatureLabel}
              </TrustBadge>
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TrustBadge tone="gold">{pick(service.duration, locale)}</TrustBadge>
          </div>
          <h3 className="heading-display text-xl text-cream transition-colors group-hover:text-gold-200">
            {pick(service.title, locale)}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-muted">
            {pick(service.tagline, locale)}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-ink-border pt-4">
            <span className="text-sm font-semibold text-gold-200">
              {service.price !== null
                ? `₹${service.price.toLocaleString("en-IN")}`
                : pick(service.priceNote, locale)}
            </span>
            <span className="text-sm text-cream-dim transition-colors group-hover:text-gold-200">
              {ctaLabel} →
            </span>
          </div>
        </div>
      </Link>
      <div className="border-t border-ink-border px-6 pb-6 pt-4">
        <Button href={href} variant="primary" className="w-full">
          <WhatsAppIcon className="h-4 w-4" />
          {t("bookOnWhatsApp")}
        </Button>
      </div>
    </Card>
  );
}
