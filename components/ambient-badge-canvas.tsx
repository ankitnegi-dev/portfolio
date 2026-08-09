"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

const ACCENT = "#4c8dff";

function ScrollBridge({
  progress,
  target,
}: {
  progress: MotionValue<number>;
  target: React.RefObject<number>;
}) {
  useEffect(() => {
    const unsubscribe = progress.on("change", (v) => {
      target.current = v;
    });
    return () => unsubscribe();
  }, [progress, target]);

  return null;
}

function Shape({ progressRef }: { progressRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.05;

    if (materialRef.current) {
      const p = progressRef.current;
      // invisible until 8% scrolled, ramps up to a max of 0.35 opacity by
      // 20% scrolled, then holds flat - no further change for the rest
      // of the page
      const opacity = THREE.MathUtils.clamp((p - 0.08) / 0.12, 0, 1) * 0.35;
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        color={ACCENT}
        wireframe
        transparent
        opacity={0}
      />
    </mesh>
  );
}

export function AmbientBadgeCanvas({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const progressRef = useRef(0);

  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }}>
      <ScrollBridge progress={progress} target={progressRef} />
      <Shape progressRef={progressRef} />
    </Canvas>
  );
}