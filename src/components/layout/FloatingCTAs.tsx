"use client";

import { useTranslations } from "next-intl";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/icons";
import { telHref, whatsappHref, waMessage, PHONE_PRIMARY_E164 } from "@/lib/whatsapp";

/** Floating WhatsApp + Call buttons, fixed on every page. */
export function FloatingCTAs() {
  const t = useTranslations("common");
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={telHref(PHONE_PRIMARY_E164)}
        aria-label={t("callNow")}
        className="grid h-12 w-12 place-items-center rounded-full border border-gold-500/40 bg-ink-surface text-gold-200 shadow-soft transition hover:scale-105 hover:border-gold-400"
      >
        <PhoneIcon className="h-5 w-5" />
      </a>
      <a
        href={whatsappHref(waMessage.general())}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("enquireWhatsApp")}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-gold transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
