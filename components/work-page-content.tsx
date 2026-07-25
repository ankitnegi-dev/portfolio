"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { FadeIn } from "@/components/animated/fade-in";
import { GithubStats } from "@/components/github-stats";
import type { Project } from "@/lib/projects";

type ProjectWithHref = { project: Project; href: string };

export function WorkPageContent({ items }: { items: ProjectWithHref[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  const techTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(({ project }) => project.tech.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = filter
    ? items.filter(({ project }) => project.tech.includes(filter))
    : items;

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Work</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-1">
          A running log of what I&apos;ve built - mostly AI agent systems
          and full-stack apps.
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          {items.length} projects · {techTags.length} technologies
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`text-xs font-mono rounded-[var(--radius-sm)] border px-3 py-1.5 transition-colors ${
            filter === null
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
          }`}
        >
          all
        </button>
        {techTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(filter === tag ? null : tag)}
            className={`text-xs font-mono rounded-[var(--radius-sm)] border px-3 py-1.5 transition-colors ${
              filter === tag
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(({ project, href }, i) => (
            <FadeIn key={project.slug} delay={i * 0.06}>
              <ProjectCard project={project} href={href} />
            </FadeIn>
          ))}
        </div>
      </section>

      <GithubStats />
    </>
  );
}