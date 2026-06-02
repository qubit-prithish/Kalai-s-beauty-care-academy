"use client";

import { useEffect, useState } from "react";

/** SSR-safe prefers-reduced-motion hook (for Lenis / GSAP / R3F, outside Framer).
 * Returns false during SSR and initial hydration to match server output.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** One-shot check (non-reactive) for use inside effects. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Heuristic for low-power / small devices so we can downgrade the 3D scene.
 * Combines viewport width, device memory, and CPU cores where available.
 */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const fewCores =
      typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return smallScreen || (coarse && (lowMemory || fewCores));
  } catch {
    return false;
  }
}
