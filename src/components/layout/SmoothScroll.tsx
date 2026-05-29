"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide smooth scroll via Lenis, integrated with GSAP ScrollTrigger on a
 * single shared loop (Lenis is driven by gsap.ticker, not its own rAF). This is
 * the canonical integration and avoids scroll/animation conflicts.
 *
 * Fully disabled under prefers-reduced-motion (native scroll remains, and
 * ScrollTrigger tweens elsewhere are also disabled via the same check).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // 1) Update ScrollTrigger whenever Lenis scrolls.
    lenis.on("scroll", ScrollTrigger.update);

    // 2) Drive Lenis from GSAP's ticker (one shared loop).
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
