"use client";

import dynamic from "next/dynamic";

const BootWireframeCanvas = dynamic(
  () =>
    import("@/components/boot-wireframe-canvas").then(
      (m) => m.BootWireframeCanvas
    ),
  { ssr: false, loading: () => null }
);

export function BootWireframeLoader() {
  return <BootWireframeCanvas />;
}