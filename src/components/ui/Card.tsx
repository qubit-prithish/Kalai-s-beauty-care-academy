"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Enable subtle 3D tilt + lift on hover. */
  interactive?: boolean;
};

/**
 * Surface card. When `interactive`, adds a gentle hover lift (and a tiny 3D
 * tilt feel). Disabled under prefers-reduced-motion.
 */
export function Card({ children, className, interactive = false }: CardProps) {
  const reduce = useReducedMotion();
  const base =
    "rounded-3xl border border-ink-border bg-ink-surface shadow-soft";

  if (!interactive || reduce) {
    return <div className={cn(base, className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(base, "will-change-transform", className)}
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{ transformPerspective: 800 }}
    >
      {children}
    </motion.div>
  );
}
