"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";

const ACCENT = "#4c8dff";

function Shape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x += delta * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={ACCENT} wireframe />
    </mesh>
  );
}

export function BootWireframeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <Shape />
    </Canvas>
  );
}