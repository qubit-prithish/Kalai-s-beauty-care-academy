"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense, Component, ErrorInfo } from "react";
import { prefersReducedMotion, shouldUse3D, shouldUseReduced3D, isWebGLAvailable } from "@/lib/motion";

// Error Boundary for WebGL context loss
class WebGLErrorBoundary extends Component<{ fallback: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode; children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Dynamic import, no SSR — the 3D bundle never blocks first paint.
const ParticleScene = dynamic(() => import("./ParticleScene"), {
  ssr: false,
  loading: () => <StaticHeroBackdrop />,
});

/** Enhanced static gold backdrop with animated CSS dots — used as the fallback. */
function StaticHeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-[80vh] bg-radial-glow" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      {/* Animated CSS particle dots for visual continuity */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          const size = 1 + Math.random() * 3;
          const left = `${10 + Math.random() * 80}%`;
          const top = `${10 + Math.random() * 80}%`;
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * 2;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-gold-300/70 to-gold-500/50"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left,
                top,
                animation: `float ${duration}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-10px) scale(1.05); opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[class*="absolute"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Enhanced decision logic for 3D particle field:
 *  - Server / first paint: static backdrop (no layout shift)
 *  - prefers-reduced-motion: static backdrop only
 *  - WebGL unavailable: static backdrop
 *  - Mobile/incapable: static backdrop  
 *  - Otherwise: lazy-load the 3D scene with ErrorBoundary
 */
export function HeroParticles() {
  const [mode, setMode] = useState<"static" | "three">("static");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    
    // Check capabilities
    if (prefersReducedMotion()) {
      setMode("static");
      return;
    }
    
    if (!isWebGLAvailable()) {
      setMode("static");
      return;
    }
    
    // Use 3D for capable devices
    if (shouldUse3D()) {
      setMode("three");
    } else {
      setMode("static");
    }
  }, []);

  if (!mounted) {
    return <StaticHeroBackdrop />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {mode === "three" ? (
        <WebGLErrorBoundary fallback={<StaticHeroBackdrop />}>
          <Suspense fallback={<StaticHeroBackdrop />}>
            <ParticleScene />
          </Suspense>
        </WebGLErrorBoundary>
      ) : (
        <StaticHeroBackdrop />
      )}
    </div>
  );
}
