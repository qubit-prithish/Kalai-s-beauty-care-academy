"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { WhatsAppIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/useMounted";

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
  const reduce = usePrefersReducedMotion();
  const mounted = useMounted();
  const popupRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const storageKey = `kbca_offer_dismissed_${offer.id}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      /* ignore */
    }
    const delay = window.innerWidth < 768 ? 10000 : 3000;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    const main = document.querySelector('main');
    if (main) {
      main.focus();
    } else {
      document.body.focus();
    }
  };

  useEffect(() => {
    if (!open) return;
    const popup = popupRef.current;
    if (!popup) return;

    const focusable = Array.from(
      popup.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (closeBtnRef.current) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    mounted && open ? (
      <motion.div
        className="fixed inset-0 z-[60] grid place-items-center p-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-popup-title"
      >
        <div className="absolute inset-0 bg-ink-page/70 backdrop-blur-sm" onClick={dismiss} />
        <motion.div
          ref={popupRef}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-500/30 bg-ink-surface p-8 shadow-gold"
          initial={reduce ? false : { y: 20, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          <button
            ref={closeBtnRef}
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
    ) : null
  );
}
