"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A slowly drifting field of champagne/gold particles. Editorial, not busy.
 * Count is passed in so the wrapper can downgrade on low-power devices.
 */
export function GoldenParticles({
  count = 900,
  animate = true,
}: {
  count?: number;
  animate?: boolean;
}) {
  const ref = useRef<THREE.Points>(null);

  // Stable random positions in a wide, shallow volume around the hero.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6; // z
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!animate || !ref.current) return;
    // Very gentle drift + parallax sway.
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.008;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.15) * 0.15;
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#E6D2A8"
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
