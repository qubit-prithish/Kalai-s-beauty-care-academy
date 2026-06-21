"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/useMounted";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Enable subtle pointer-following 3D tilt + lift on hover. */
  interactive?: boolean;
};

const MAX_TILT = 6; // degrees — subtle, editorial

/**
 * Surface card. When `interactive`, the card tilts gently toward the pointer
 * and lifts on hover, cohesive with the site's scroll motion.
 */
export function Card({ children, className, interactive = false }: CardProps) {
  const reduce = usePrefersReducedMotion();
  const mounted = useMounted();

  const base = "rounded-3xl border border-ink-border bg-ink-surface shadow-soft";

  // Hooks must be called at the top level, but their values only matter when
  // mounted and not reduced.
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const transform = useMotionTemplate`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;

  if (!interactive) {
    return <div className={cn(base, className)}>{children}</div>;
  }

  const enabled = mounted && !reduce;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * MAX_TILT * 2);
    rx.set(-py * MAX_TILT * 2);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      className={cn(base, "will-change-transform", className)}
      style={enabled ? { transform } : undefined}
      onPointerMove={enabled ? onMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
      whileHover={enabled ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
