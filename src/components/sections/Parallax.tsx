"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

/**
 * Light background parallax. Moves its content by `amount` px across the
 * scroll of its nearest positioned ancestor. Disabled under reduced motion.
 */
export function Parallax({
  children,
  amount = 60,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const trigger = el.parentElement ?? el;
      gsap.fromTo(
        el,
        { yPercent: -amount / 10 },
        {
          yPercent: amount / 10,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
