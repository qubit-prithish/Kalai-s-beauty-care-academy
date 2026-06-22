import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import Image from "next/image";
import type { Settings } from "@/lib/content/types";
import { pick } from "@/lib/locale";
import { telHref } from "@/lib/whatsapp";
import { InstagramIcon, FacebookIcon, MapPinIcon } from "@/components/ui/icons";
import { MapEmbed } from "@/components/ui/MapEmbed";

const FOOTER_LINKS = [
  { href: "/courses", key: "courses" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export async function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: Settings;
}) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const { address, contact, hours } = settings;
  const logo = settings.navbarLogo;

  return (
    <footer className="mt-section border-t border-ink-border bg-ink-surface">
      <div className="border-b border-ink-border bg-ink-surface py-3 px-4 text-center text-xs text-gold-300">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>{t("badgeEstablished")}</span>
          <span>·</span>
          <a
            href="https://g.page/r/kalaisbeautyacademy/review"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-200 underline underline-offset-2 hover:text-gold-100"
          >
            {t("badgeRating")}
          </a>
          <span>·</span>
          <span>{t("badgeStudents")}</span>
          <span>·</span>
          <span>{t("badgeCertified")}</span>
        </div>
      </div>
      <div className="container-luxe grid gap-12 py-16 lg:grid-cols-12">
        {/* Brand + NAP */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={pick(logo.alt, locale)}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <span className="grid h-full w-full place-items-center bg-gold-gradient text-ink-page">
                  <span className="heading-display text-lg font-bold">K</span>
                </span>
              )}
            </span>
            <span className="heading-display text-lg text-cream">
              {pick(settings.brandName, locale)}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-muted">
            {pick(settings.tagline, locale)}
          </p>
          <address className="mt-5 not-italic text-sm leading-relaxed text-cream-muted">
            <span className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span>
                {address.line1}, {address.line2}
                <br />
                {address.city} – {address.pincode}
                <br />
                <span className="text-cream-dim">{pick(address.landmark, locale)}</span>
              </span>
            </span>
          </address>
          <div className="mt-4 space-y-1 text-sm">
            {contact.phonePrimary ? (
              <a href={telHref(contact.phonePrimaryE164)} className="block text-cream-muted hover:text-gold-200">
                {contact.phonePrimary}
              </a>
            ) : null}
            {contact.phoneSecondary ? (
              <a href={telHref(contact.phoneSecondaryE164)} className="block text-cream-muted hover:text-gold-200">
                {contact.phoneSecondary}
              </a>
            ) : null}
            <a href={`mailto:${contact.email}`} className="block break-all text-cream-muted hover:text-gold-200">
              {contact.email}
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-luxe text-gold-300">
            {t("quickLinks")}
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className="text-cream-muted hover:text-gold-200">
                  {tn(l.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/testimonials" prefetch={false} className="text-cream-muted hover:text-gold-200 transition-colors">
                {t("links.testimonials")}
              </Link>
            </li>
            <li>
              <Link href="/offers" prefetch={false} className="text-cream-muted hover:text-gold-200 transition-colors">
                {t("links.offers")}
              </Link>
            </li>
            <li>
              <Link href="/faq" prefetch={false} className="text-cream-muted hover:text-gold-200 transition-colors">
                {t("links.faq")}
              </Link>
            </li>
            <li className="pt-2">
              <Link href="/privacy" prefetch={false} className="text-cream-muted hover:text-gold-200 transition-colors">
                {t("links.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" prefetch={false} className="text-cream-muted hover:text-gold-200 transition-colors">
                {t("links.terms")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Hours + socials */}
        <div className="lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-luxe text-gold-300">
            {t("hours")}
          </h2>
          <dl className="mt-4 space-y-2 text-sm text-cream-muted">
            <div>
              <dt className="font-semibold text-cream">{t("salonHours")}</dt>
              <dd>{pick(hours.salon, locale)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-cream">{t("academyHours")}</dt>
              <dd>{pick(hours.academy, locale)}</dd>
            </div>
            <p className="text-cream-dim">{pick(hours.note, locale)}</p>
          </dl>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-luxe text-gold-300">
            {t("follow")}
          </h2>
          <div className="mt-3 flex flex-col items-start gap-3">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/[0.06] px-3 py-1.5 text-xs font-medium text-gold-200 transition hover:border-gold-400"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              {t("instagramBadge")}
            </a>
            <a
              href={contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/[0.06] px-3 py-1.5 text-xs font-medium text-gold-200 transition hover:border-gold-400"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
              {t("facebookBadge")}
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="lg:col-span-3">
          <h3 className="heading-display mb-4 text-lg text-cream">{t("location")}</h3>
          <MapEmbed
            mapEmbedQuery={address.mapEmbedQuery}
            landmark={pick(address.landmark, locale)}
            directionsLink={address.mapLink}
            directionsLabel={t("viewMap")}
          />
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="container-luxe flex flex-col gap-2 py-6 text-xs text-cream-dim sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {pick(settings.brandName, locale)}. {t("rights")}
          </span>
          <span>{t("tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
