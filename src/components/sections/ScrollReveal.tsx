"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** "up" = fade+rise, "clip" = reveal via clip-path. */
  variant?: "up" | "clip";
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: boolean;
};

/**
 * GSAP ScrollTrigger reveal. Disabled (renders children statically) under
 * prefers-reduced-motion. All triggers are cleaned up on unmount.
 */
export function ScrollReveal({
  children,
  className,
  variant = "up",
  stagger = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const children = Array.from(el.children);
      if (stagger && children.length === 0) return;

      const targets = stagger ? children : [el];
      const from =
        variant === "clip"
          ? { opacity: 0, clipPath: "inset(0 0 100% 0)" }
          : { opacity: 0, y: 28 };
      const to =
        variant === "clip"
          ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
          : { opacity: 1, y: 0 };

      gsap.fromTo(targets, from, {
        ...to,
        duration: 0.8,
        ease: "power3.out",
        stagger: stagger ? 0.1 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [variant, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
