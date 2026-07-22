import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/projects";

export function ProjectGrid({
  projects,
  title,
}: {
  projects: Project[];
  title?: string;
}) {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      {title && (
        <h2 className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
