"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/useMounted";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fade/slide-in on enter. Honors prefers-reduced-motion: when reduced, content
 * appears immediately with no transform.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const mounted = useMounted();

  const MotionTag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  // On server and first client pass, we render the "hidden" state with 0 opacity.
  // This is safe for hydration. The "show" animation triggers once in view.
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial={mounted ? "hidden" : false}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </MotionTag>
  );
}
