"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieBanner");

  useEffect(() => {
    if (localStorage.getItem("cookie-consent") === null) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value);
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink-surface border-t border-ink-border px-6 py-4 flex items-center justify-between">
      <p className="text-cream-muted text-sm">{t("message")}</p>
      <div>
        <button
          type="button"
          onClick={() => handleConsent("accepted")}
          className="bg-gold-500 text-ink-page text-sm px-4 py-2 rounded-full font-semibold"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => handleConsent("declined")}
          className="border border-ink-border text-cream-muted text-sm px-4 py-2 rounded-full ml-3"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
