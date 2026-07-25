"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A slowly drifting field of champagne/gold particles. Editorial, not busy.
 * Enhanced for mobile: reduced particle size and slower animation on reduced3D.
 */
export function GoldenParticles({
  count = 900,
  animate = true,
  reduced3D = false,
}: {
  count?: number;
  animate?: boolean;
  reduced3D?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  // Stable random positions in a wide, shallow volume around the hero.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Adjust spread based on device capability
    const xSpread = reduced3D ? 8 : 12;
    const ySpread = reduced3D ? 5 : 7;
    const zSpread = reduced3D ? 4 : 6;
    
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * xSpread; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * ySpread; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * zSpread; // z
    }
    return arr;
  }, [count, reduced3D]);

  useFrame((state, delta) => {
    if (!animate || !ref.current) return;
    // Slower animation on reduced3D devices
    const rotationSpeed = reduced3D ? 0.015 : 0.03;
    const verticalSpeed = reduced3D ? 0.08 : 0.15;
    const verticalAmplitude = reduced3D ? 0.1 : 0.15;
    
    ref.current.rotation.y += delta * rotationSpeed;
    ref.current.rotation.x += delta * (rotationSpeed * 0.3);
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * verticalSpeed) * verticalAmplitude;
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#E33A6B"
          size={reduced3D ? 0.035 : 0.045} // Slightly larger for better visibility
          sizeAttenuation
          depthWrite={false}
          opacity={reduced3D ? 0.9 : 1.0} // High opacity for maximum pop
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
