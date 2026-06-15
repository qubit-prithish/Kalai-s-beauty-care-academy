"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("common");
  
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-ink-page px-6 text-center">
      <div className="rounded-3xl border border-gold-500/20 bg-ink-raised p-12 shadow-2xl">
        <h1 className="heading-display text-8xl font-bold text-gold-500">404</h1>
        <h2 className="mt-6 text-2xl font-semibold text-cream">
          {t("errorTitle") || "Page Not Found"}
        </h2>
        <p className="mt-4 max-w-md text-cream-muted">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-page transition-colors hover:bg-gold-400"
          >
            {t("returnHome") || "Return Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
