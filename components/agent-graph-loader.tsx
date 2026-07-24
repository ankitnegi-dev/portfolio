"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AgentGraph3D = dynamic(
  () => import("@/components/agent-graph-3d").then((m) => m.AgentGraph3D),
  {
    ssr: false,
    loading: () => <GraphPlaceholder label="loading graph…" />,
  }
);

function GraphPlaceholder({ label }: { label: string }) {
  return (
    <div className="not-prose h-[380px] rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)] my-8">
      {label}
    </div>
  );
}

export function AgentGraphLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? <AgentGraph3D /> : <GraphPlaceholder label="scroll to load graph…" />}
    </div>
  );
}