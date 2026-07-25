"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "boot-intro-seen";

const LINE_DELAY_MS = 500; // time between each line appearing
const HOLD_AFTER_TEXT_MS = 2200; // how long the full screen holds once all lines are shown
const FADE_OUT_MS = 1.1; // seconds — exit transition duration

const lines = [
  "$ initializing ankit.dev",
  "$ loading agent systems...",
  "// welcome",
];

export function BootIntro() {
  const [show, setShow] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read from sessionStorage on mount
      if (!seen) setShow(true);
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — just skip the intro
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!show) return;

    if (visibleLines >= lines.length) {
      const timer = setTimeout(finish, HOLD_AFTER_TEXT_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [show, visibleLines]);

  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS, ease: "easeInOut" }}
          aria-hidden="true"
          className="fixed inset-0 z-[100] bg-[var(--bg)] flex flex-col items-center justify-center px-6"
        >
          <div className="font-mono text-sm text-[var(--text-secondary)] space-y-2">
            {lines.slice(0, visibleLines).map((line, i) => (
              <p
                key={line}
                className={i === lines.length - 1 ? "text-[var(--accent)]" : ""}
              >
                {line}
              </p>
            ))}
            <span
              className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse"
              aria-hidden="true"
            />
          </div>
          <button
            onClick={finish}
            className="absolute bottom-8 right-8 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}