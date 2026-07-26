"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = "#4c8dff";

function WireframeShape({
  pointer,
  reduceMotion,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  reduceMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // constant slow ambient spin - the shape should feel alive on its own,
    // not only when someone moves their cursor over the hero
    if (!reduceMotion) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.04;
    }

    // subtle cursor-tilt layered on top of the ambient spin
    const targetTiltX = reduceMotion ? 0 : pointer.current.y * -0.15;
    const targetTiltZ = reduceMotion ? 0 : pointer.current.x * 0.15;

    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      targetTiltZ,
      3,
      delta
    );
    // note: tiltX is added as an offset via a wrapping approach below isn't needed -
    // simplest is to just damp rotation.x toward (spin + tilt) baseline, but since
    // spin already increments rotation.x continuously, we skip an X tilt to avoid
    // fighting the ambient spin, and rely on Z-tilt + Y-spin for the "alive" feel.
    void targetTiltX;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshBasicMaterial color={ACCENT} wireframe />
    </mesh>
  );
}

function PointerTracker({ target }: { target: React.RefObject<{ x: number; y: number }> }) {
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    function onMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    function onLeave() {
      target.current.x = 0;
      target.current.y = 0;
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, target]);

  return null;
}

export function HeroWireframe3D() {
  const pointer = useRef({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="hidden md:block w-full h-[320px] lg:h-[380px]">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <PointerTracker target={pointer} />
          <WireframeShape pointer={pointer} reduceMotion={reduceMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
}