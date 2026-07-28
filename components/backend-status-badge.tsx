"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "online" | "waking" | "offline";

export function BackendStatusBadge() {
  const [status, setStatus] = useState<Status>("checking");
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    // same "cold start" language your assistant widget already uses -
    // if the real check hasn't resolved by this point, it's genuinely waking up
    const wakeTimer = setTimeout(() => {
      if (!cancelled) setStatus("waking");
    }, 2500);

    async function check() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        clearTimeout(wakeTimer);
        if (data.status === "online") {
          setStatus("online");
          setLatency(data.latencyMs ?? null);
        } else {
          setStatus("offline");
        }
      } catch {
        if (!cancelled) {
          clearTimeout(wakeTimer);
          setStatus("offline");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(wakeTimer);
    };
  }, []);

  const config: Record<Status, { color: string; label: string }> = {
    checking: { color: "var(--text-muted)", label: "checking backend…" },
    waking: { color: "var(--accent-warm)", label: "waking up backend…" },
    online: {
      color: "var(--accent)",
      label: latency !== null ? `backend online · ${latency}ms` : "backend online",
    },
    offline: { color: "var(--accent-warm)", label: "backend offline" },
  };

  const { color, label } = config[status];

  return (
    <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)]">
      <span
        className="w-1.5 h-1.5 rounded-full transition-colors"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}