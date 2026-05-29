import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing, type Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTAs } from "@/components/layout/FloatingCTAs";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { fontVariables } from "../fonts";

const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  return (
    <html lang={l} className={fontVariables} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <SmoothScroll />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-ink-page"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="min-h-[60vh]">
            {children}
          </main>
          <Footer locale={l} settings={settings} />
          <FloatingCTAs />
        </NextIntlClientProvider>
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
