"use client";

import { useBackendStatus, type BackendStatus } from "@/lib/use-backend-status";

export function BackendStatusBadge() {
  const { status, latency } = useBackendStatus();

  const config: Record<BackendStatus, { color: string; label: string }> = {
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