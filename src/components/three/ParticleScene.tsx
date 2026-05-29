"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GoldenParticles } from "./GoldenParticles";
import { isLowPowerDevice, prefersReducedMotion } from "@/lib/motion";

/**
 * The actual R3F canvas. Loaded only via dynamic import (ssr:false) so it never
 * blocks first paint. Performance guards:
 *  - dpr capped to [1, 1.5]
 *  - frameloop toggles to "never" when offscreen or the tab is hidden
 *  - particle count downgraded on low-power / small devices
 *  - animation frozen (static frame) under prefers-reduced-motion
 */
export default function ParticleScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  const reduced = prefersReducedMotion();
  const lowPower = isLowPowerDevice();
  const count = lowPower ? 280 : 900;
  const animate = !reduced;

  // Pause rendering when the hero is offscreen or the tab is hidden.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let onScreen = true;
    let visible = !document.hidden;
    const update = () => setActive(onScreen && visible);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Under reduced motion we render exactly one frame ("never" after mount is
  // overkill); use "demand"-like behaviour by rendering always only when active
  // and not reduced. When reduced, render a single static frame.
  const frameloop = reduced ? "demand" : active ? "always" : "never";

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <GoldenParticles count={count} animate={animate} />
      </Canvas>
    </div>
  );
}
