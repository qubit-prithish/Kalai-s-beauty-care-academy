"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/useMounted";

 * Site-wide smooth scroll via Lenis.
 * Includes defensive protections for route transitions.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const reduce = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const mounted = useMounted();

  useIsomorphicLayoutEffect(() => {
    if (reduce || !mounted) return;

    // Guard against SSR or double-initialization
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      if (lenisRef.current) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      try {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      } catch {
        // Ignore errors during cleanup
      } finally {
        lenisRef.current = null;
      }
    };
  }, [reduce, mounted]);

  // Handle route changes: reset scroll and refresh ScrollTrigger.
  useIsomorphicLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // 1) Immediately reset scroll to top on route change.
    // This prevents ScrollTriggers from firing based on old scroll positions.
    try {
      lenis.scrollTo(0, { immediate: true });
    } catch {
      // Ignore scroll reset errors during navigation
    }
    // No longer need to kill or refresh ScrollTriggers here since we removed GSAP.
    
    return () => {};
  }, [pathname]);

  return null;
}
