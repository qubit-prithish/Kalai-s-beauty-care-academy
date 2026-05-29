"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowPowerDevice, prefersReducedMotion } from "@/lib/motion";

// Dynamic import, no SSR — the 3D bundle never blocks first paint.
const ParticleScene = dynamic(() => import("./ParticleScene"), {
  ssr: false,
  loading: () => <StaticHeroBackdrop />,
});

/** Elegant static gold backdrop — used as the Suspense fallback AND as the
 * permanent fallback on reduced-motion. Pure CSS, no JS cost. */
function StaticHeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-[80vh] bg-radial-glow" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      {/* faint static "particle" dots for visual continuity with the 3D field */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20% 30%, rgba(230,210,168,0.7) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 70% 20%, rgba(200,162,74,0.6) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 50% 60%, rgba(230,210,168,0.5) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 85% 70%, rgba(200,162,74,0.5) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 35% 80%, rgba(230,210,168,0.4) 50%, transparent 51%)",
        }}
      />
    </div>
  );
}

/**
 * Decides between the live 3D particle field and the static backdrop:
 *  - Server / first paint: static backdrop (no layout shift).
 *  - prefers-reduced-motion: static backdrop only (never mounts the canvas).
 *  - Low-power / small device: static backdrop (mobile fallback) — the canvas
 *    is heavy on mobile, so we keep the elegant CSS version there.
 *  - Otherwise: lazy-load the 3D scene.
 */
export function HeroParticles() {
  const [mode, setMode] = useState<"static" | "three">("static");

  useEffect(() => {
    if (prefersReducedMotion() || isLowPowerDevice()) {
      setMode("static");
      return;
    }
    setMode("three");
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {mode === "three" ? <ParticleScene /> : <StaticHeroBackdrop />}
    </div>
  );
}
