"use client";

import { useCallback, useRef, useState } from "react";
import { Placeholder } from "./Placeholder";

type BeforeAfterSliderProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel: string;
  afterLabel: string;
  alt?: string;
};

/**
 * Accessible before/after comparison. Drag the handle or use the range slider
 * (keyboard accessible). Photos PENDING → elegant placeholders.
 */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  alt = "",
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const onPointer = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] select-none overflow-hidden rounded-3xl border border-ink-border"
        onPointerMove={(e) => {
          if (e.buttons === 1) onPointer(e.clientX);
        }}
        onPointerDown={(e) => onPointer(e.clientX)}
      >
        {/* After (full) */}
        <div className="absolute inset-0">
          <Placeholder src={afterSrc} alt={alt} ratio="aspect-[4/3]" label={afterLabel} />
          <span className="absolute right-3 top-3 rounded-full bg-ink-page/70 px-2.5 py-1 text-xs text-cream">
            {afterLabel}
          </span>
        </div>
        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <div className="h-full" style={{ width: containerRef.current?.clientWidth }}>
            <Placeholder src={beforeSrc} alt={alt} ratio="aspect-[4/3]" label={beforeLabel} />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-ink-page/70 px-2.5 py-1 text-xs text-cream">
            {beforeLabel}
          </span>
        </div>
        {/* Handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-gold-400"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-gold-400 text-ink-page shadow-gold">
            ↔
          </div>
        </div>
      </div>
      <label className="sr-only" htmlFor="ba-range">
        Before and after comparison
      </label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-4 w-full accent-gold-400"
      />
    </div>
  );
}
