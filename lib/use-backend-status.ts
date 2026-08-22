"use client";

import { useEffect, useState } from "react";

export type BackendStatus = "checking" | "waking" | "online" | "offline";

const RECHECK_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes - keeps Render warm during active sessions

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    let wakeTimer: ReturnType<typeof setTimeout> | undefined;

    async function check(isFirstCheck: boolean) {
      if (isFirstCheck) {
        wakeTimer = setTimeout(() => {
          if (!cancelled) setStatus("waking");
        }, 2500);
      }

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

    check(true);

    // periodic re-check while this component stays mounted - acts as a
    // natural keepalive ping for the backend during active browsing,
    // independent of the scheduled GitHub Actions ping that covers
    // completely idle stretches with no visitors at all
    const interval = setInterval(() => check(false), RECHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(wakeTimer);
      clearInterval(interval);
    };
  }, []);

  return { status, latency, updatedAt };
}