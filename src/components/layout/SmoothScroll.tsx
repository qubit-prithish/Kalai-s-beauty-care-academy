"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide smooth scroll via Lenis, integrated with GSAP ScrollTrigger on a
 * single shared loop (Lenis is driven by gsap.ticker, not its own rAF). This is
 * the canonical integration and avoids scroll/animation conflicts.
 *
 * Fully disabled under prefers-reduced-motion (native scroll remains, and
 * ScrollTrigger tweens elsewhere are also disabled via the same check).
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 1) Update ScrollTrigger whenever Lenis scrolls.
    lenis.on("scroll", ScrollTrigger.update);

    // 2) Drive Lenis from GSAP's ticker (one shared loop).
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // Handle route changes: refresh ScrollTrigger and reset Lenis.
  useEffect(() => {
    if (!lenisRef.current) return;

    // Tiny delay to allow the new page content to settle.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

