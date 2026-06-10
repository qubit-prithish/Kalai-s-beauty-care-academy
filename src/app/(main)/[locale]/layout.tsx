import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { routing, type Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/layout/FloatingCTAs";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageViews } from "@/components/layout/PageViews";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { fontVariables } from "../../fonts";
import "@/styles/globals.css";

import { RouteTransition } from "@/components/layout/RouteTransition";

const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? (locale as Locale) : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "seo" });
  return buildMetadata({
    locale: l,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const l = locale as Locale;
  const settings = await getSettings();
  const t = await getTranslations({ locale: l, namespace: "common" });
  const messages = await getMessages();

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <JsonLd data={localBusinessJsonLd(settings, l)} />
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <PageViews />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-ink-page"
          >
            {t("skipToContent")}
          </a>
          <Header settings={settings} />
          <RouteTransition>
            {children}
          </RouteTransition>
          <Footer locale={l} settings={settings} />
          <FloatingCTAs />
        </NextIntlClientProvider>
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
