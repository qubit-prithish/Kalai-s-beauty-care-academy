"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { telHref, whatsappHref, waMessage, PHONE_PRIMARY_E164 } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

export function FloatingCTAs() {
  const t = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 8);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 pb-safe pr-safe">
      <a
        href={telHref(PHONE_PRIMARY_E164)}
        aria-label={t("callNow")}
        className="grid h-12 w-12 place-items-center rounded-full border border-gold-500/40 bg-ink-surface text-gold-200 shadow-soft transition hover:scale-105 hover:border-gold-400"
      >
        <PhoneIcon className="h-5 w-5" />
      </a>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap rounded-full border border-ink-border bg-ink-surface px-3 py-2 text-xs font-semibold text-cream shadow-soft transition-all duration-300",
            scrolled ? "max-w-0 translate-x-2 px-0 opacity-0" : "max-w-32 opacity-100",
          )}
        >
          {t("chatWithUs")}
        </span>
        <a
          href={whatsappHref(waMessage.general())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("enquireWhatsApp")}
          className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-soft transition hover:bg-whatsapp-hover hover:scale-105"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}