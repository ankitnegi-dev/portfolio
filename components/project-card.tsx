"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  IconNetwork,
  IconFileSearch,
  IconSword,
  IconApps,
  type Icon,
} from "@tabler/icons-react";
import type { Project } from "@/lib/projects";

const iconMap: Record<string, Icon> = {
  network: IconNetwork,
  "file-search": IconFileSearch,
  sword: IconSword,
};

function formatDate(date: string) {
  const [year] = date.split("-");
  return year;
}

export function ProjectCard({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion();
  const IconComponent = iconMap[project.icon] ?? IconApps;

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-5 transition-colors hover:border-[var(--accent)]"
      >
        <div className="flex items-start justify-between mb-3">
          <IconComponent
            size={20}
            stroke={1.5}
            className="text-[var(--accent)]"
          />
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {formatDate(project.date)}
          </span>
        </div>
        <h3 className="text-sm font-medium mb-1">{project.title}</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          {project.tagline}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[var(--text-muted)]">
          {project.tech.map((t, i) => (
            <span key={t}>
              {t}
              {i < project.tech.length - 1 && (
                <span className="ml-2 text-[var(--border-strong)]">·</span>
              )}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}