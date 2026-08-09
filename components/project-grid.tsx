import { ProjectCard } from "@/components/project-card";
import { FadeIn } from "@/components/animated/fade-in";
import { hasCaseStudy } from "@/lib/mdx";
import type { Project } from "@/lib/projects";

function resolveHref(project: Project): string {
  if (hasCaseStudy(project.slug)) return `/projects/${project.slug}`;
  return project.links.demo || project.links.github || `/projects/${project.slug}`;
}

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
        <h2 className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.06}>
            <ProjectCard project={project} href={resolveHref(project)} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}