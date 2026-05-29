"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon } from "@/components/ui/icons";

export type PopupOffer = {
  id: string;
  title: string;
  description: string;
  badge: string;
  href: string;
  closeLabel: string;
  ctaLabel: string;
};

/**
 * Homepage offers popup. Driven by data (only rendered when an eligible offer
 * exists). Dismissal is remembered per-offer in localStorage so it doesn't
 * nag returning visitors. Reduced-motion safe; fully keyboard-closable.
 */
export function OffersPopup({ offer }: { offer: PopupOffer }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const storageKey = `kbca_offer_dismissed_${offer.id}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(storageKey) === "1") return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-popup-title"
        >
          <div className="absolute inset-0 bg-ink-page/70 backdrop-blur-sm" onClick={dismiss} />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-500/30 bg-ink-surface p-8 shadow-gold"
            initial={reduce ? false : { y: 20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? undefined : { y: 20, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label={offer.closeLabel}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-ink-border text-cream-muted transition hover:text-gold-200"
            >
              ✕
            </button>
            <TrustBadge tone="gold">{offer.badge}</TrustBadge>
            <h2 id="offer-popup-title" className="heading-display mt-4 text-2xl text-cream">
              {offer.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-cream-muted">{offer.description}</p>
            <div className="mt-6">
              <Button href={offer.href} variant="primary" className="w-full" >
                <WhatsAppIcon className="h-4 w-4" />
                {offer.ctaLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
