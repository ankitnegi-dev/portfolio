import { WorkPageContent } from "@/components/work-page-content";
import { projects } from "@/lib/projects";
import { hasCaseStudy } from "@/lib/mdx";

export const metadata = {
  title: "Work - Ankit Negi",
};

function resolveHref(project: (typeof projects)[number]): string {
  if (hasCaseStudy(project.slug)) return `/projects/${project.slug}`;
  return project.links.demo || project.links.github || `/projects/${project.slug}`;
}

export default function ProjectsPage() {
  const items = projects.map((project) => ({
    project,
    href: resolveHref(project),
  }));

  return (
    <main className="flex-1">
      <WorkPageContent items={items} />
    </main>
  );
}