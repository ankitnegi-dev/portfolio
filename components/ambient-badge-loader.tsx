"use client";

import dynamic from "next/dynamic";
import { useScroll, useReducedMotion } from "framer-motion";

const AmbientBadgeCanvas = dynamic(
  () =>
    import("@/components/ambient-badge-canvas").then(
      (m) => m.AmbientBadgeCanvas
    ),
  { ssr: false, loading: () => null }
);

export function AmbientBadgeLoader() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (shouldReduceMotion) return null;

  return (
    <div className="hidden md:block fixed top-24 right-6 w-28 h-28 pointer-events-none z-30">
      <AmbientBadgeCanvas progress={scrollYProgress} />
    </div>
  );
}