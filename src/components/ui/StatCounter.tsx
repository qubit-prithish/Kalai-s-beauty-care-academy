"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMounted } from "@/lib/hooks/useMounted";

type StatCounterProps = {
  /** Final value, e.g. 20, 1000. */
  value: number;
  /** Static display fallback / decoration, e.g. "+", "★", "K+". */
  suffix?: string;
  prefix?: string;
  label: string;
  /** If true, value is shown as-is without count animation (e.g. ratings). */
  decimal?: boolean;
};

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  decimal = false,
}: StatCounterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // Always render the final value on first paint (server + client hydration
  // match). The count-up animation only kicks in after mount when in view and
  // motion is allowed — so it never causes a hydration text mismatch.
  const [display, setDisplay] = useState(value);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    if (reduce || !inView) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [mounted, inView, value, reduce]);

  const shown = decimal ? display.toFixed(1) : Math.round(display).toString();

  return (
    <div ref={ref} className="text-center">
      <motion.div className="heading-display text-3xl text-gold-gradient sm:text-4xl">
        {prefix}
        {shown}
        {suffix}
      </motion.div>
      <div className="mt-1 text-xs uppercase tracking-luxe text-cream-dim">{label}</div>
    </div>
  );
}
