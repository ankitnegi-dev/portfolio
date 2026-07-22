import { ProjectGrid } from "@/components/project-grid";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Work - Ankit Negi",
};

export default function ProjectsPage() {
  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">Work</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          A running log of what I&apos;ve built - mostly AI agent systems
          and full-stack apps.
        </p>
      </div>
      <ProjectGrid projects={projects} />
    </main>
  );
}