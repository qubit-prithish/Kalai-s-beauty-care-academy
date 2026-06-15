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
    <main className="min-h-screen flex items-center justify-center bg-cream-100">
      <div>
        <h1 className="text-rose-500">{t("errorTitle")}</h1>
        <p className="text-warm-600 text-sm">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="bg-gold-500 text-ink-page px-6 py-2 rounded-full font-semibold"
        >
          {t("tryAgain")}
        </button>
        <Link href="/" className="text-gold-200 underline ml-4">
          {t("returnHome")}
        </Link>
      </div>
    </main>
  );
}
