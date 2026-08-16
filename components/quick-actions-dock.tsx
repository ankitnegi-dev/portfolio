"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconMessageCircle2,
  IconFileDownload,
  IconBrandGithub,
  IconCommand,
} from "@tabler/icons-react";

type Action = {
  id: string;
  label: string;
  icon: typeof IconCommand;
  onClick: () => void;
};

function openAssistant() {
  window.dispatchEvent(new Event("open-assistant"));
}

function openCommandPalette() {
  window.dispatchEvent(new Event("open-command-palette"));
}

export function QuickActionsDock() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  const actions: Action[] = [
    {
      id: "assistant",
      label: "Ask AI",
      icon: IconMessageCircle2,
      onClick: openAssistant,
    },
    {
      id: "resume",
      label: "Resume",
      icon: IconFileDownload,
      onClick: () => {
        const a = document.createElement("a");
        a.href = "/resume.pdf";
        a.download = "";
        a.click();
      },
    },
    {
      id: "github",
      label: "GitHub",
      icon: IconBrandGithub,
      onClick: () =>
        window.open(
          "https://github.com/ankitnegi-dev",
          "_blank",
          "noopener,noreferrer"
        ),
    },
    {
      id: "palette",
      label: "⌘K",
      icon: IconCommand,
      onClick: openCommandPalette,
    },
  ];

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glass-surface border border-[var(--border)] rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            {hovered === action.id && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-[var(--text-primary)] bg-[var(--surface-2)] border border-[var(--border)] rounded px-2 py-1 pointer-events-none"
              >
                {action.label}
              </motion.div>
            )}
            <motion.button
              onClick={action.onClick}
              onMouseEnter={() => setHovered(action.id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label={action.label}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <action.icon size={18} stroke={1.5} />
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}