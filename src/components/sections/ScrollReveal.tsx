"use client";

import React, { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** "up" = fade+rise, "clip" = reveal via clip-path. */
  variant?: "up" | "clip";
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: boolean;
};

/**
 * Framer Motion reveal. Disabled (renders children statically) under
 * prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  variant = "up",
  stagger = false,
}: ScrollRevealProps) {
  const reduce = usePrefersReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger ? 0.1 : 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden:
      variant === "clip"
        ? { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        : { opacity: 0, y: 28 },
    visible:
      variant === "clip"
        ? { opacity: 1, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } }
        : { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } },
  };

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  if (stagger) {
    const staggeredChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return <motion.div variants={itemVariants}>{child}</motion.div>;
      }
      return child;
    });

    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {staggeredChildren}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: itemVariants.hidden,
        visible: itemVariants.visible,
      }}
    >
      {children}
    </motion.div>
  );
}
