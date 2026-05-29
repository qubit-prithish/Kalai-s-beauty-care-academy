"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { StarIcon } from "./icons";

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export function TestimonialCarousel({
  items,
  autoPlay = true,
}: {
  items: TestimonialItem[];
  autoPlay?: boolean;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!autoPlay || reduce || count <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [autoPlay, reduce, count]);

  if (count === 0) return null;
  const item = items[index];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative min-h-[15rem] rounded-3xl border border-ink-border bg-ink-surface p-8 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.figure
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-center gap-1 text-gold-400" aria-label={`${item.rating} out of 5`}>
              {Array.from({ length: item.rating }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <blockquote className="mt-5 text-center text-lg leading-relaxed text-cream">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-center">
              <div className="font-semibold text-gold-200">{item.name}</div>
              <div className="text-sm text-cream-dim">{item.role}</div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-cream-muted transition hover:border-gold-400 hover:text-gold-200"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-gold-400" : "w-2 bg-ink-border"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-cream-muted transition hover:border-gold-400 hover:text-gold-200"
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
