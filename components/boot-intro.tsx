"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BootWireframeLoader } from "@/components/boot-wireframe-loader";

const STORAGE_KEY = "boot-intro-seen";

const FADE_OUT_MS = 1.1; // seconds - final exit transition duration

type Phase =
  | "wireframe-in"
  | "line-draw"
  | "name"
  | "line-collapse"
  | "wireframe-out"
  | "done";

// how long to stay in each phase before advancing, in ms
const PHASE_DURATIONS: Record<Exclude<Phase, "done">, number> = {
  "wireframe-in": 900,
  "line-draw": 550,
  name: 1500,
  "line-collapse": 550,
  "wireframe-out": 700,
};

const PHASE_ORDER: Phase[] = [
  "wireframe-in",
  "line-draw",
  "name",
  "line-collapse",
  "wireframe-out",
  "done",
];

export function BootIntro() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>("wireframe-in");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read from sessionStorage on mount
      if (!seen) setShow(true);
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) - just skip the intro
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!show || phase === "done") return;

    const duration = PHASE_DURATIONS[phase];
    const currentIndex = PHASE_ORDER.indexOf(phase);
    const next = PHASE_ORDER[currentIndex + 1];

    const timer = setTimeout(() => setPhase(next), duration);
    return () => clearTimeout(timer);
  }, [show, phase]);

  useEffect(() => {
    if (phase === "done") finish();
  }, [phase]);

  function finish() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  // wireframe is visible during its two phases, hidden (opacity 0) during
  // the line/name phases - kept mounted throughout to avoid remounting
  // the WebGL canvas, which is expensive and was the source of "Context
  // Lost" warnings seen during earlier testing
  const wireframeVisible = phase === "wireframe-in" || phase === "wireframe-out";
  const lineVisible =
    phase === "line-draw" || phase === "name" || phase === "line-collapse";
  const lineOrigin = phase === "line-collapse" ? "right" : "left";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS, ease: "easeInOut" }}
          aria-hidden="true"
          className="fixed inset-0 z-[100] bg-[var(--bg)] flex items-center justify-center px-6"
        >
          <div className="relative w-full max-w-md h-32">
            {/* wireframe - mounted once, opacity-toggled */}
            <motion.div
              animate={{ opacity: wireframeVisible ? 1 : 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-28"
            >
              <BootWireframeLoader />
            </motion.div>

            {/* the line */}
            {lineVisible && (
              <motion.div
                key={lineOrigin}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  transformOrigin: lineOrigin,
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[var(--accent)]"
              />
            )}

            {/* the name */}
            <AnimatePresence>
              {phase === "name" && (
                <motion.p
                  key="name"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold tracking-wide text-[var(--text-primary)]"
                >
                  ANKIT NEGI
                </motion.p>
              )}
            </AnimatePresence>
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