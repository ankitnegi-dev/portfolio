"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const REACTIONS = [
  { label: "impressive", text: "impressive" },
  { label: "curious", text: "curious" },
  { label: "collab", text: "want to build together" },
  { label: "browsing", text: "just browsing" },
] as const;

type Label = (typeof REACTIONS)[number]["label"];
type TracePoint = { x: number; y: number; label: Label; ts: number };
type Aggregate = {
  counts: Record<string, number>;
  total: number;
  today: number;
  trace: TracePoint[];
};

const LABEL_COLORS: Record<Label, string> = {
  impressive: "#4c8dff",
  curious: "#7f77dd",
  collab: "#ff6b4a",
  browsing: "#8b9198",
};

const STORAGE_KEY = "portfolio_reacted";

function readStoredReaction(): Label | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && REACTIONS.some((r) => r.label === stored)
    ? (stored as Label)
    : null;
}

export function ReactionSignals() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Aggregate | null>(null);
  const [myReaction, setMyReaction] = useState<Label | null>(readStoredReaction);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reactions")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  async function react(label: Label, e: React.MouseEvent<HTMLButtonElement>) {
    if (myReaction || submitting) return;
    setSubmitting(true);

    const container = containerRef.current;
    let x = 50;
    let y = 50;
    if (container) {
      const rect = container.getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
    }

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, x, y }),
      });
      const updated = await res.json();
      setData(updated);
      setMyReaction(label);
      window.localStorage.setItem(STORAGE_KEY, label);
    } catch {
      // silently fail - this is ambient, not critical path
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl mx-auto px-6 py-16 overflow-hidden"
    >
      {/* ambient trace field - accumulated presence of every past visitor */}
      <div className="absolute inset-0 pointer-events-none">
        {data?.trace.map((point, i) => (
          <span
            key={`${point.ts}-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              backgroundColor: LABEL_COLORS[point.label],
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <p className="font-mono text-xs text-[var(--text-muted)] mb-1">
          {data
            ? `${data.total} signals sent · ${data.today} today`
            : "loading signals…"}
        </p>
        <h2 className="font-display text-lg font-semibold mb-6">
          What&apos;s your read on this?
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {REACTIONS.map((r) => {
            const isMine = myReaction === r.label;
            const isDisabled = myReaction !== null;
            return (
              <button
                key={r.label}
                onClick={(e) => react(r.label, e)}
                disabled={isDisabled}
                className={`group flex items-center gap-2 rounded-[var(--radius-sm)] border px-3 py-2 transition-colors ${
                  isMine
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : isDisabled
                    ? "border-[var(--border)] opacity-40 cursor-default"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                <motion.span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: LABEL_COLORS[r.label] }}
                  animate={
                    !shouldReduceMotion && !isDisabled
                      ? { opacity: [0.5, 1, 0.5] }
                      : undefined
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-xs font-mono text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {r.text}
                </span>
              </button>
            );
          })}
        </div>

        {myReaction && (
          <p className="font-mono text-[11px] text-[var(--text-muted)] mt-4">
            thanks - your signal joined the field above
          </p>
        )}
      </div>
    </div>
  );
}