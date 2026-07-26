"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const DocIntelPipeline3D = dynamic(
  () =>
    import("@/components/docintel-pipeline-3d").then(
      (m) => m.DocIntelPipeline3D
    ),
  {
    ssr: false,
    loading: () => <PipelinePlaceholder label="loading pipeline…" />,
  }
);

function PipelinePlaceholder({ label }: { label: string }) {
  return (
    <div className="not-prose h-[360px] rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)] my-8">
      {label}
    </div>
  );
}

export function DocIntelPipelineLoader() {
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
      {visible ? (
        <DocIntelPipeline3D />
      ) : (
        <PipelinePlaceholder label="scroll to load pipeline…" />
      )}
    </div>
  );
}