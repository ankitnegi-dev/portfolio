"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import {
  IconNetwork,
  IconFileSearch,
  IconSword,
  IconMapPin,
  IconApps,
  type Icon,
} from "@tabler/icons-react";
import type { Project } from "@/lib/projects";

const iconMap: Record<string, Icon> = {
  network: IconNetwork,
  "file-search": IconFileSearch,
  sword: IconSword,
  "map-pin": IconMapPin,
};
function formatDate(date: string) {
  const [year] = date.split("-");
  return year;
}

export function ProjectCard({
  project,
  href,
}: {
  project: Project;
  href: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const IconComponent = iconMap[project.icon] ?? IconApps;
  const isExternal = href.startsWith("http");

  // raw cursor position within the card, normalized to -0.5..0.5
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // small rotation range - enough to read as "responsive," not a gimmick
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-7, 7]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={
        shouldReduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 800 }
      }
    >
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
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