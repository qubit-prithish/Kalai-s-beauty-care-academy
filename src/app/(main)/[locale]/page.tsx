import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  getFeaturedCourses,
  getFeaturedServices,
  getOffers,
  getPopupOffer,
  getSettings,
  getTestimonials,
} from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CourseTile } from "@/components/ui/CourseTile";
import { ServiceTile } from "@/components/ui/ServiceTile";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { OffersBanner } from "@/components/ui/OffersBanner";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/icons";
import { HeroHome } from "@/components/sections/HeroHome";
import { StatsBand } from "@/components/sections/StatsBand";
import { OffersPopup } from "@/components/sections/OffersPopup";
import { MissionPinned } from "@/components/sections/MissionPinned";
import { Parallax } from "@/components/sections/Parallax";

const USP_KEYS = [
  "techniques",
  "accessories",
  "treatments",
  "handsOn",
  "reputation",
  "legacy",
] as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const t = await getTranslations("home");
  const tu = await getTranslations("usps");
  const tc = await getTranslations("common");
  const to = await getTranslations("offers");

  const [settings, courses, services, testimonials, offers, popupOffer] = await Promise.all([
    getSettings(),
    getFeaturedCourses(),
    getFeaturedServices(),
    getTestimonials(),
    getOffers(),
    getPopupOffer(),
  ]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    settings.address.mapEmbedQuery,
  )}&output=embed`;

  return (
    <>
      <HeroHome settings={settings} />

      {/* USP strip */}
      <section className="py-section">
        <div className="container-luxe">
          <SectionHeading title={t("uspTitle")} subtitle={t("uspSubtitle")} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {USP_KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-ink-border bg-ink-surface p-6">
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

      {/* Featured courses */}
      {courses.length > 0 ? (
        <section className="py-section">
          <div className="container-luxe">
            <SectionHeading
              eyebrow={tc("exploreCourses")}
              title={t("coursesTitle")}
              subtitle={t("coursesSubtitle")}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <Reveal key={course.id} delay={i * 0.05}>
                  <CourseTile course={course} locale={l} ctaLabel={tc("learnMore")} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button href="/courses" variant="secondary">
                {tc("viewAll")} →
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Services preview */}
      {services.length > 0 ? (
        <section className="py-section">
          <div className="container-luxe">
            <SectionHeading
              eyebrow={tc("viewServices")}
              title={t("servicesTitle")}
              subtitle={t("servicesSubtitle")}
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.id} delay={i * 0.05}>
                  <ServiceTile
                    service={service}
                    locale={l}
                    ctaLabel={tc("learnMore")}
                    signatureLabel={pick(
                      { en: "Signature", ta: "சிறப்பு" },
                      l,
                    )}
                  />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button href="/services" variant="secondary">
                {tc("viewAll")} →
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Stats */}
      <StatsBand settings={settings} />

      {/* Pinned storytelling moment — mission "10,000 by 2030" */}
      <MissionPinned
        content={{
          eyebrow: t("missionEyebrow"),
          line1: t("missionLine1"),
          line2: t("missionLine2"),
          goalNumber: t("missionGoalNumber"),
          goalLabel: t("missionGoalLabel"),
          steps: [
            { title: t("missionStep1"), text: t("missionStep1Text") },
            { title: t("missionStep2"), text: t("missionStep2Text") },
            { title: t("missionStep3"), text: t("missionStep3Text") },
          ],
        }}
      />

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="py-section">
          <div className="container-luxe">
            <SectionHeading
              title={t("testimonialsTitle")}
              subtitle={t("testimonialsSubtitle")}
            />
            <div className="mt-12">
              <TestimonialCarousel
                items={testimonials.map((tm) => ({
                  id: tm.id,
                  name: tm.name,
                  role: pick(tm.role, l),
                  quote: pick(tm.quote, l),
                  rating: tm.rating,
                }))}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Offers */}
      {offers.length > 0 ? (
        <section className="py-section">
          <div className="container-luxe">
            <SectionHeading
              title={t("offersTitle")}
              subtitle={t("offersSubtitle")}
            />
            <div className="mt-12">
              <OffersBanner
                offers={offers.map((o) => ({
                  id: o.id,
                  title: pick(o.title, l),
                  description: pick(o.description, l),
                  badge: pick(o.badge, l),
                }))}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Map + Instagram */}
      <section className="py-section">
        <div className="container-luxe grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-ink-border">
              <iframe
                title="Google map — Kalai's Beauty Care & Academy"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full border-0"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-3xl border border-ink-border bg-ink-surface p-8">
              <h2 className="heading-display text-2xl text-cream sm:text-3xl">
                {t("mapTitle")}
              </h2>
              <address className="mt-4 not-italic leading-relaxed text-cream-muted">
                {settings.address.line1}, {settings.address.line2}
                <br />
                {settings.address.city} – {settings.address.pincode}
                <br />
                <span className="text-cream-dim">{pick(settings.address.landmark, l)}</span>
              </address>
              <a
                href={settings.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/[0.06] px-4 py-2 text-sm font-medium text-gold-200 hover:border-gold-400"
              >
                <InstagramIcon className="h-4 w-4" />
                {t("instagramCta")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WhatsApp CTA band */}
      <section className="relative overflow-hidden py-section">
        <Parallax amount={80} className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        </Parallax>
        <div className="container-luxe">
          <div className="grid items-center gap-8 rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-10 lg:grid-cols-3 lg:p-14">
            <div className="lg:col-span-2">
              <h2 className="heading-display text-3xl text-cream sm:text-4xl">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 text-cream-muted">{t("ctaSubtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button href={whatsappHref(waMessage.general())} variant="primary">
                <WhatsAppIcon className="h-4 w-4" />
                {tc("enquireWhatsApp")}
              </Button>
              <Button href={`tel:${settings.contact.phonePrimaryE164}`} variant="secondary">
                {tc("callNow")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Offers popup (data-driven; only renders when an eligible offer exists) */}
      {popupOffer ? (
        <OffersPopup
          offer={{
            id: popupOffer.id,
            title: pick(popupOffer.title, l),
            description: pick(popupOffer.description, l),
            badge: pick(popupOffer.badge, l),
            href: whatsappHref(waMessage.general()),
            closeLabel: to("popupClose"),
            ctaLabel: to("popupCta"),
          }}
        />
      ) : null}
    </>
  );
}
