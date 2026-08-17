"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CursorGlow } from "@/components/animated/cursor-glow";
import { HeroWireframe3D } from "@/components/hero-wireframe-loader";
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <CursorGlow>
      <motion.section
        id="hero"
        variants={shouldReduceMotion ? undefined : container}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        className="max-w-4xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-[1fr_auto] items-center gap-6"
      >
        <div>
          <motion.p
            variants={item}
            className="font-mono text-sm text-[var(--accent)] mb-4"
          >
            {"// full-stack developer & AI engineer"}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-5 max-w-2xl"
          >
            I build systems where AI agents actually do the work.
          </motion.h1>
          <motion.p
            variants={item}
            className="text-[var(--text-secondary)] text-base max-w-lg mb-8"
          >
            Multi-agent orchestration, RAG pipelines, and production-grade
            full-stack apps. Currently building at IIIT Chennai.
          </motion.p>
          <motion.div variants={item} className="flex items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
            >
              See the work
            </Link>
            <a
              href="https://github.com/ankitnegi-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              GitHub ↗
            </a>
          </motion.div>
        </div>

        <HeroWireframe3D />
      </motion.section>
    </CursorGlow>
  );
}