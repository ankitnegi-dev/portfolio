"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconTerminal2 } from "@tabler/icons-react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const VISIBLE_MS = 4000;

export function KonamiEasterEgg() {
  const [, setProgress] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      setProgress((prev) => {
        const next = [...prev, key];
        const expectedSoFar = KONAMI_SEQUENCE.slice(0, next.length);

        const stillMatching = next.every((k, i) => k === expectedSoFar[i]);
        if (!stillMatching) {
          // restart the sequence, but check if this keypress is itself
          // a valid start (handles overlapping attempts gracefully)
          return key === KONAMI_SEQUENCE[0] ? [key] : [];
        }

        if (next.length === KONAMI_SEQUENCE.length) {
          setTriggered(true);
          return [];
        }

        return next;
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => setTriggered(false), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [triggered]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-sm w-[calc(100%-3rem)]"
        >
          <div className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--accent)] bg-[var(--surface-1)] px-4 py-3 shadow-2xl">
            <IconTerminal2
              size={20}
              stroke={1.5}
              className="text-[var(--accent)] shrink-0"
            />
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Cheat code accepted.
              </p>
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                You clearly grew up on a controller too. Cmd+K has more if
                you&apos;re still looking.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}