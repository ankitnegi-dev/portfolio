"use client";

import dynamic from "next/dynamic";

const HeroWireframeCanvas = dynamic(
  () =>
    import("@/components/hero-wireframe-canvas").then(
      (m) => m.HeroWireframe3D
    ),
  { ssr: false, loading: () => <div className="hidden md:block w-full h-[320px] lg:h-[380px]" /> }
);

export function HeroWireframe3D() {
  return <HeroWireframeCanvas />;
}