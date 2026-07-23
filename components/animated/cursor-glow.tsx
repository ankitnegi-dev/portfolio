"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

export function CursorGlow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--glow-x", `${x}px`);
    el.style.setProperty("--glow-y", `${y}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative"
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "0px",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 md:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(500px circle at var(--glow-x) var(--glow-y), var(--accent-soft), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}