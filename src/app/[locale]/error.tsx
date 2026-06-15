"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("common");
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-ink-page px-6 text-center">
      <div className="rounded-3xl border border-gold-500/20 bg-ink-raised p-12 shadow-2xl">
        <h1 className="heading-display text-4xl font-bold text-gold-500">
          {t("errorTitle") || "Something went wrong!"}
        </h1>
        <p className="mt-4 max-w-md text-sm text-cream-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-gold-500 px-6 py-3 font-semibold text-ink-page transition-colors hover:bg-gold-400"
          >
            {t("tryAgain") || "Try Again"}
          </button>
          <Link
            href="/"
            className="rounded-full border border-gold-500/50 px-6 py-3 font-semibold text-gold-200 transition-colors hover:bg-gold-500/10"
          >
            {t("returnHome") || "Return Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
