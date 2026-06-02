"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

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
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (reduce || !mounted) return;

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
      // 3) Final safety: kill any global triggers on unmount
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reduce, mounted]);

  // Handle route changes: reset scroll and refresh ScrollTrigger.
  useIsomorphicLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // 1) Immediately reset scroll to top on route change.
    // This prevents ScrollTriggers from firing based on old scroll positions.
    lenis.scrollTo(0, { immediate: true });
    
    // Kill all current triggers to prevent "removeChild" on old DOM nodes
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // 2) Refresh ScrollTrigger once the new page content has likely settled.
    // Use a longer delay and a safety check to avoid "removeChild" errors
    // if the component unmounts before the timer fires.
    const timer = setTimeout(() => {
      if (lenisRef.current) {
        ScrollTrigger.refresh();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      // Ensure all pending ScrollTriggers are killed on this pathname change 
      // if they aren't caught by their local context revert.
    };
  }, [pathname]);

  return null;
}
