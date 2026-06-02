"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/** SSR-safe useLayoutEffect hook. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
 * Enhanced mobile/device capability detection for 3D particle support.
 * Returns true if device is mobile or tablet (for reduced particle count).
 */
export function shouldUseReduced3D(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Width < 1024 is typically mobile/tablet
    return window.innerWidth < 1024;
  } catch {
    return false;
  }
}

/**
 * Check WebGL availability and context support.
 * Returns true if WebGL is available and context can be created.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Detect low-end devices using specific requirements:
 * - hardwareConcurrency <= 4
 * - innerWidth < 768
 * - WebGL unavailable
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const webglAvailable = isWebGLAvailable();
    if (!webglAvailable) return true;

    const lowCores = navigator.hardwareConcurrency <= 4;
    const smallScreen = window.innerWidth < 768;
    
    // Low-end if small screen AND low cores, OR no WebGL
    return (lowCores && smallScreen);
  } catch {
    return true; // Assume low-end on error for safety
  }
}

/**
 * Determines if 3D should be shown or CSS fallback used.
 * Requirements:
 * - NOT prefers-reduced-motion
 * - WebGL available
 * - NOT a low-end device
 */
export function shouldUse3D(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (!isWebGLAvailable()) return false;
  if (isLowEndDevice()) return false;
  
  return true;
}
