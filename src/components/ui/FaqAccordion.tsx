"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";

export type FaqItem = { id: string; question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="divide-y divide-ink-border overflow-hidden rounded-3xl border border-ink-border bg-ink-surface">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={`faq-heading-${item.id}`}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-cream">{item.question}</span>
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-200 transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            {mounted && isOpen ? (
              <motion.div
                id={`faq-panel-${item.id}`}
                role="region"
                aria-labelledby={`faq-heading-${item.id}`}
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm leading-relaxed text-cream-muted">
                  {item.answer}
                </p>
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
