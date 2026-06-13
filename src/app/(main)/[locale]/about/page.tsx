import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  getAboutFacilities,
  getAboutPageData,
  getAboutTrainers,
  getAboutWhyItems,
} from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Placeholder } from "@/components/ui/Placeholder";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";
import Link from "next/link";

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const tc = await getTranslations("common");
  
  const [page, usps, facilities, trainers] = await Promise.all([
    getAboutPageData(),
    getAboutWhyItems(),
    getAboutFacilities(),
    getAboutTrainers(),
  ]);

  // Fallback defaults for safety (unlikely with seeded DB)
  const heroEyebrow = page ? pick(page.heroEyebrow, l) : "";
  const heroTitle = page ? pick(page.heroTitle, l) : "";
  const heroSubtitle = page ? pick(page.heroSubtitle, l) : "";

  return (
    <>
      {/* Intro */}
      <section className="py-section">
        <div className="container-luxe">
          <SectionHeading eyebrow={heroEyebrow} title={heroTitle} subtitle={heroSubtitle} as="h1" />
        </div>
      </section>

      {/* Story + mission */}
      <section className="pb-section">
        <div className="container-luxe grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-ink-border bg-ink-surface p-8">
              <h2 className="heading-display text-2xl text-cream">{page ? pick(page.storyTitle, l) : ""}</h2>
              <p className="mt-4 leading-relaxed text-cream-muted">{page ? pick(page.story, l) : ""}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-center rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-8">
              <h2 className="heading-display text-2xl text-gold-200">{page ? pick(page.missionTitle, l) : ""}</h2>
              <p className="mt-4 leading-relaxed text-cream">{page ? pick(page.mission, l) : ""}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="pb-section">
        <div className="container-luxe grid items-center gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            {page?.founderImage?.url ? (
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl">
                <Image
                  src={page.founderImage.url}
                  alt={pick(page.founderImage.alt, l)}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ) : (
              <Placeholder
                ratio="aspect-[4/5]"
                className="rounded-3xl"
                label={pick({ en: "Founder photo", ta: "நிறுவனர் புகைப்படம்" }, l)}
              />
            )}
          </Reveal>
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow">{page ? pick(page.founderTitle, l) : ""}</p>
              <h2 className="heading-display mt-3 text-3xl text-cream sm:text-4xl">
                {page ? pick(page.founderName, l) : ""}
              </h2>
              <p className="mt-2 text-gold-200">{page ? pick(page.founderRole, l) : ""}</p>
              <p className="mt-5 leading-relaxed text-cream-muted">{page ? pick(page.founderBio, l) : ""}</p>
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-luxe text-gold-300">
                  {page ? pick(page.credentialsTitle, l) : ""}
                </h3>
                <p className="mt-2 text-sm text-cream-dim">{page ? pick(page.credentialsDesc, l) : ""}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-ink-border bg-ink-surface/40 py-section">
        <div className="container-luxe">
          {/* We'll use a hardcoded translation key for section title if not in singleton */}
          <SectionHeading title={pick({ en: "Why choose us", ta: "ஏன் எங்களை தேர்வு செய்வது" }, l)} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {usps.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-3xl border border-ink-border bg-ink-page p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-gradient font-display text-lg font-bold text-ink-page">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-cream-muted">{pick(item.text, l)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials reference */}
      <section className="py-section">
        <div className="container-luxe">
          <div className="rounded-3xl border border-gold-500/25 bg-gold-500/[0.06] p-8 md:p-12 text-center">
            <StarIcon className="mx-auto h-10 w-10 text-gold-400" aria-hidden="true" />
            <h2 className="mt-4 heading-display text-2xl text-cream sm:text-3xl">
              {pick({ en: "Trusted by 1000+ women across Tamil Nadu", ta: "தமிழ்நாடு முழுவதும் 1000+ பெண்கள் நம்பிக்கை" }, l)}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-cream-muted">
              {pick({ en: "Read real stories from our students and clients — 4.8★ from 63 verified Google reviews.", ta: "எங்கள் மாணவிகள் மற்றும் வாடிக்கையாளர்களின் உண்மை கதைகளை படிக்கவும் — 63 சரிபார்க்கப்பட்ட கூகுள் விமர்சனങ്ങളിൽ 4.8★.", }, l)}
            </p>
            <div className="mt-6">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold-200 hover:text-gold-100 transition-colors"
              >
                {pick({ en: "View all testimonials →", ta: "அனைத்து சான்றுகளையும் காண்க →" }, l)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-section">
        <div className="container-luxe">
          <SectionHeading title={pick({ en: "Facilities", ta: "வசதிகள்" }, l)} />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {facilities.map((f) => (
              <TrustBadge key={f.id} tone="gold" className="px-4 py-2 text-sm">
                {pick(f.name, l)}
              </TrustBadge>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-section">
        <div className="container-luxe">
          <SectionHeading
            title={pick({ en: "Our trainers", ta: "எங்கள் பயிற்சியாளர்கள்" }, l)}
            subtitle={pick({ en: "A small, dedicated team so every student gets individual attention.", ta: "ஒவ்வொரு மாணவிக்கும் தனிப்பட்ட கவனம் கிடைக்க சிறிய அர்ப்பணிப்பு குழு." }, l)}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <div className="overflow-hidden rounded-3xl border border-ink-border bg-ink-surface">
                  {t.image?.url ? (
                    <div className="relative aspect-square">
                      <Image
                        src={t.image.url}
                        alt={pick(t.image.alt, l)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <Placeholder ratio="aspect-square" label={pick(t.name, l)} />
                  )}
                  <div className="p-5 text-center">
                    <div className="heading-display text-lg text-cream">
                      {pick(t.name, l)}
                    </div>
                    <div className="text-sm text-gold-200">{pick(t.role, l)}</div>
                    {t.bio && (
                      <p className="mt-3 text-sm text-cream-dim line-clamp-3">{pick(t.bio, l)}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            {trainers.length === 0 && (
              <p className="col-span-full py-10 text-center text-cream-muted">
                {pick({ en: "Trainer profiles coming soon", ta: "பயிற்சியாளர் விவரம் விரைவில்" }, l)}
              </p>
            )}
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
