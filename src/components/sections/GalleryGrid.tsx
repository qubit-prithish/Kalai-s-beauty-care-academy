"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { cn } from "@/lib/cn";

export type GalleryGridItem = {
  id: string;
  type: "image" | "beforeafter";
  src: string;
  before?: string;
  after?: string;
  caption: string;
  category: string;
};

export type GalleryCategory = { id: string; label: string };

export function GalleryGrid({
  items,
  categories,
  allLabel,
  beforeLabel,
  afterLabel,
}: {
  items: GalleryGridItem[];
  categories: GalleryCategory[];
  allLabel: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [active, setActive] = useState<string>("all");
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((i) => i.category === active)),
    [items, active],
  );

  const filters = [{ id: "all", label: allLabel }, ...categories];

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {filters.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-gold-400 bg-gold-500/15 text-gold-200"
                  : "border-ink-border text-cream-muted hover:border-gold-400/60 hover:text-cream",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-3xl border border-ink-border bg-ink-surface"
          >
            {item.type === "beforeafter" ? (
              <div className="p-4">
                <BeforeAfterSlider
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeLabel={beforeLabel}
                  afterLabel={afterLabel}
                  alt={item.caption}
                />
                <p className="mt-3 text-center text-sm text-cream-muted">{item.caption}</p>
              </div>
            ) : (
              <figure>
                <div className="relative">
                  <Placeholder
                    src={item.src}
                    alt={item.caption}
                    ratio="aspect-[4/3]"
                  />
                </div>
                <figcaption className="p-4 text-sm text-cream-muted">{item.caption}</figcaption>
              </figure>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
