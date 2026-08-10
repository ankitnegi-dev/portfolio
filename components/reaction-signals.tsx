"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconX } from "@tabler/icons-react";

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

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredReactionSnapshot(): Label | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && REACTIONS.some((r) => r.label === stored)
    ? (stored as Label)
    : null;
}

function getServerReactionSnapshot(): Label | null {
  return null; // server never has a reaction - matches first client render
}

export function ReactionSignals() {
  const shouldReduceMotion = useReducedMotion();
  const [data, setData] = useState<Aggregate | null>(null);
  const myReaction = useSyncExternalStore(
    subscribeToStorage,
    getStoredReactionSnapshot,
    getServerReactionSnapshot
  );
  const [submitting, setSubmitting] = useState(false);
  const [contactValue, setContactValue] = useState("");
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "sent" | "skipped"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  // derived, not stored - modal visibility always follows directly from
  // reaction + contact status, so there's nothing to keep in sync via an effect
  const modalOpen =
    myReaction === "collab" &&
    (contactStatus === "idle" || contactStatus === "sending");

  useEffect(() => {
    fetch("/api/reactions")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  useEffect(() => {
    if (modalOpen) {
      // let the modal actually paint before focusing
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setContactStatus("skipped");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  async function react(label: Label) {
    if (myReaction || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      const updated = await res.json();
      setData(updated);
      window.localStorage.setItem(STORAGE_KEY, label);
      window.dispatchEvent(new Event("storage"));
    } catch {
      // silently fail - this is ambient, not critical path
    } finally {
      setSubmitting(false);
    }
  }

  async function sendContact() {
    if (!contactValue.trim()) return;
    setContactStatus("sending");
    try {
      await fetch("/api/reactions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contactValue.trim() }),
      });
      setContactStatus("sent");
    } catch {
      setContactStatus("sent"); // fail quietly, don't block the user on retry UX
    }
  }

  function skipContact() {
    setContactStatus("skipped");
  }

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-16">
      {/* dedicated trace band - its own space, nothing else ever renders here */}
      <div className="relative h-20 mb-6">
        {data?.trace.map((point, i) => (
          <motion.span
            key={`${point.ts}-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.02, 1) }}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              backgroundColor: LABEL_COLORS[point.label],
              boxShadow: `0 0 8px 2px ${LABEL_COLORS[point.label]}`,
            }}
          />
        ))}
      </div>

      <div className="text-center">
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
                onClick={() => react(r.label)}
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
            Thanks - your signal joined the field above
          </p>
        )}

        {contactStatus === "sent" && (
          <p className="font-mono text-[11px] text-[var(--accent)] mt-4">
            Got it - I&apos;ll reach out
          </p>
        )}

        <p className="font-mono text-[10px] text-[var(--text-muted)] mt-8 opacity-60">
          Reactions are anonymous · &quot;want to build together&quot; shares a
          rough, city-level location so I know it&apos;s a real visit
        </p>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-sm rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-3">
                <p className="font-display text-base font-semibold">
                  Want me to actually reach out?
                </p>
                <button
                  onClick={skipContact}
                  aria-label="Close"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                >
                  <IconX size={18} stroke={1.5} />
                </button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Leave an email or LinkedIn and I&apos;ll follow up. Totally
                optional - skip if you&apos;d rather stay anonymous.
              </p>
              <input
                ref={inputRef}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendContact();
                }}
                placeholder="you@example.com"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-colors mb-4"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={sendContact}
                  disabled={contactStatus === "sending" || !contactValue.trim()}
                  className="flex-1 rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium py-2.5 disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  {contactStatus === "sending" ? "sending…" : "send"}
                </button>
                <button
                  onClick={skipContact}
                  className="text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-3 transition-colors"
                >
                  skip
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}