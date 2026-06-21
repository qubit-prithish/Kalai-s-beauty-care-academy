"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { GoldenParticles } from "./GoldenParticles";
import { prefersReducedMotion, shouldUseReduced3D } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/useMounted";

/**
 * The actual R3F canvas. Loaded only via dynamic import (ssr:false) so it never
 * blocks first paint. Enhanced mobile support:
 *  - dpr capped to [1, 1] on mobile for better performance
 *  - particle count reduced to ≤ 40% on capable mobile devices
 *  - WebGL context loss handling with graceful fallback
 *  - animation frozen under prefers-reduced-motion
 */
export default function ParticleScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const [active, setActive] = useState(true);
  const mounted = useMounted();
  const [webglLost, setWebglLost] = useState(false);

  const reduced = prefersReducedMotion();
  const reduced3D = shouldUseReduced3D();
  
  // Particle count: desktop 900, capable mobile ≤ 40% (360), incapable mobile uses CSS fallback
  const count = reduced3D ? Math.floor(900 * 0.4) : 900;
  const animate = !reduced;
  const dpr: [number, number] = reduced3D ? [1, 1] : [1, 1.5]; // Lower DPR on mobile

  // Handle WebGL context loss
  useEffect(() => {
    if (!mounted || !glRef.current) return;
    
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost, switching to CSS fallback");
      setWebglLost(true);
    };
    
    const handleContextRestored = () => {
      console.log("WebGL context restored");
      setWebglLost(false);
    };
    
    const canvas = glRef.current.domElement;
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [mounted]);

  // Pause rendering when the hero is offscreen or the tab is hidden.
  useEffect(() => {
    if (!mounted) return;
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
      
      // Proper WebGL cleanup on unmount
      if (glRef.current) {
        try {
          const gl = glRef.current.getContext();
          glRef.current.dispose();
          
          if (gl && !gl.isContextLost()) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        } catch (e) {
          // Silently handle cleanup errors
        } finally {
          glRef.current = null;
        }
      }
    };
  }, [mounted]);

  // If WebGL context is lost, don't render canvas
  if (webglLost) {
    return null;
  }

  const frameloop = reduced ? "demand" : active ? "always" : "never";

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        key={`particle-canvas-${mounted}-${reduced3D ? 'mobile' : 'desktop'}`}
        frameloop={frameloop}
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ 
          antialias: !reduced3D, // Disable antialiasing on mobile for performance
          powerPreference: reduced3D ? "default" : "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: reduced3D ? false : true, // Be more lenient on mobile
        }}
        onCreated={({ gl }) => {
          glRef.current = gl;
          
          // Performance tuning for mobile
          if (reduced3D) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // Cap pixel ratio on mobile
          }
        }}
        style={{ pointerEvents: "none" }}
      >
        <GoldenParticles count={count} animate={animate} reduced3D={reduced3D} />
      </Canvas>
    </div>
  );
}
