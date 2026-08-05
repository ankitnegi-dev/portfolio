"use client";

import { useEffect, useState } from "react";

export type BackendStatus = "checking" | "waking" | "online" | "offline";

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
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
        setUpdatedAt(new Date());
      } catch {
        if (!cancelled) {
          clearTimeout(wakeTimer);
          setStatus("offline");
          setUpdatedAt(new Date());
        }
      }
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(wakeTimer);
    };
  }, []);

  return { status, latency, updatedAt };
}