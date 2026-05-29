import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getServiceBySlug, getServices } from "@/lib/content";
import { pick } from "@/lib/locale";
import { whatsappHref, waMessage, telHref } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { ServiceTile } from "@/components/ui/ServiceTile";
import { WhatsAppIcon, StarIcon } from "@/components/ui/icons";

export async function generateStaticParams() {
  const services = await getServices();
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const l = locale as Locale;
  return { title: pick(service.title, l), description: pick(service.tagline, l) };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const tc = await getTranslations("common");

  const all = await getServices();
  const related = all.filter((s) => s.slug !== slug).slice(0, 3);
  const bookHref = whatsappHref(waMessage.service(service.title.en));

  return (
    <>
      <section className="border-b border-ink-border">
        <div className="container-luxe py-12 lg:py-16">
          <Link href="/services" prefetch={false} className="text-sm text-cream-dim transition hover:text-gold-200">
            ← {t("backToServices")}
          </Link>
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <Placeholder
                src={service.image.src}
                alt={pick(service.image.alt, l)}
                ratio="aspect-[4/5]"
                className="rounded-3xl"
              />
            </Reveal>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {service.signature ? (
                  <TrustBadge tone="signature" icon={<StarIcon className="h-3 w-3" />}>
                    {t("signature")}
                  </TrustBadge>
                ) : null}
                <TrustBadge tone="gold">{pick(service.duration, l)}</TrustBadge>
              </div>
              <h1 className="heading-display mt-4 text-4xl text-cream sm:text-5xl">
                {pick(service.title, l)}
              </h1>
              <p className="mt-3 text-lg text-gold-200">{pick(service.tagline, l)}</p>
              <p className="mt-6 leading-relaxed text-cream-muted">
                {pick(service.description, l)}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink-border bg-ink-surface p-5">
                  <div className="text-xs uppercase tracking-luxe text-cream-dim">{t("duration")}</div>
                  <div className="heading-display mt-1 text-xl text-cream">{pick(service.duration, l)}</div>
                </div>
                <div className="rounded-2xl border border-ink-border bg-ink-surface p-5">
                  <div className="text-xs uppercase tracking-luxe text-cream-dim">{t("price")}</div>
                  <div className="heading-display mt-1 text-xl text-gold-200">
                    {service.price !== null
                      ? `₹${service.price.toLocaleString("en-IN")}`
                      : pick(service.priceNote, l)}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href={bookHref} variant="primary" size="lg">
                  <WhatsAppIcon className="h-5 w-5" />
                  {t("bookCta")}
                </Button>
                <Button href={telHref()} variant="secondary" size="lg">
                  {tc("callNow")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="py-section">
          <div className="container-luxe">
            <h2 className="heading-display text-2xl text-cream sm:text-3xl">{t("related")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceTile
                  key={s.id}
                  service={s}
                  locale={l}
                  ctaLabel={tc("learnMore")}
                  signatureLabel={t("signature")}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
