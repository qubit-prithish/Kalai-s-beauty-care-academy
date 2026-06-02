"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide smooth scroll via Lenis, integrated with GSAP ScrollTrigger on a
 * single shared loop (Lenis is driven by gsap.ticker, not its own rAF).
 * 
 * Includes defensive protections for route transitions and proper cleanup
 * using gsap.context to prevent client-side crashes and stale triggers.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;

    // Guard against SSR or double-initialization
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Use gsap.context for canonical cleanup of all GSAP-related listeners
    const ctx = gsap.context(() => {
      // 1) Update ScrollTrigger whenever Lenis scrolls.
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      // 2) Drive Lenis from GSAP's ticker (one shared loop).
      const tick = (time: number) => {
        // Defensive check: if lenis was destroyed, don't raf
        if (lenisRef.current) {
          lenis.raf(time * 1000);
        }
      };
      
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Store tick on the context for manual removal if needed, 
      // though we handle it in the main cleanup below.
      return () => {
        gsap.ticker.remove(tick);
      };
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // Handle route changes: reset scroll and refresh ScrollTrigger.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // 1) Immediately reset scroll to top on route change.
    // This prevents ScrollTriggers from firing based on old scroll positions.
    lenis.scrollTo(0, { immediate: true });

    // 2) Refresh ScrollTrigger once the new page content has likely settled.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
