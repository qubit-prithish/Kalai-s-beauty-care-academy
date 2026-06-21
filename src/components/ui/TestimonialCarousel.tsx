"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StarIcon } from "./icons";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn, getInitials } from "@/lib/cn";
import { useMounted } from "@/lib/hooks/useMounted";

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: { src: string; alt: string };
};

function Avatar({
  src,
  alt,
  name,
  fallbackInitials,
  className,
}: {
  src?: string;
  alt?: string;
  name: string;
  fallbackInitials: string;
  className?: string;
}) {
  const initials = fallbackInitials || getInitials(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name}
        width={48}
        height={48}
        loading="lazy"
        className={cn("rounded-full object-cover", className)}
        sizes="48px"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-ink-page font-semibold text-[0.875rem] leading-none",
        className
      )}
      aria-label={alt || `${name}'s avatar`}
      role="img"
    >
      {initials}
    </div>
  );
}

function RoleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-gold-500/15 px-3 py-1 text-xs font-medium text-gold-300 ring-1 ring-inset ring-gold-500/30", className)}>
      {children}
    </span>
  );
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex justify-center gap-0.5 text-gold-400", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className="h-4 w-4"
          style={{ opacity: i < rating ? 1 : 0.25 }}
        />
      ))}
    </div>
  );
}

export function TestimonialCarousel({
  items,
  autoPlay = true,
}: {
  items: TestimonialItem[];
  autoPlay?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const mounted = useMounted();
  const [paused, setPaused] = useState(false);

  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!autoPlay || reduce || count <= 1 || !mounted || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [autoPlay, reduce, count, mounted, paused]);

  if (count === 0) return null;
  const item = items[index];
  const initials = getInitials(item.name);

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[18rem] rounded-3xl border border-ink-border bg-ink-surface p-8 sm:p-10">
        {mounted && (
          <motion.figure
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={item.avatar?.src}
                alt={item.avatar?.alt}
                name={item.name}
                fallbackInitials={initials}
                className="mb-4"
              />
              <div className="font-semibold text-gold-200 text-lg sm:text-xl">
                {item.name}
              </div>
              <RoleBadge className="mt-2">{item.role}</RoleBadge>
              <StarRating className="mt-4" rating={item.rating} />
              <blockquote className="mt-6 max-w-xl text-lg leading-relaxed text-cream">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </div>
          </motion.figure>
        )}
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
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-gold-400" : "w-2 bg-ink-border"
                )}
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

export { Avatar, RoleBadge };