import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { IconArrowLeft, IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { projects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx-components";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} - Ankit Negi` };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <IconArrowLeft size={14} stroke={1.5} />
          all work
        </Link>

        <p className="font-mono text-xs text-[var(--text-muted)] mb-2">
          {project.date.split("-")[0]}
        </p>
        <h1 className="font-display text-3xl font-semibold mb-3">
          {project.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-5 max-w-lg">
          {caseStudy.frontmatter.summary}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[var(--text-muted)] mb-6">
          {project.tech.map((t, i) => (
            <span key={t}>
              {t}
              {i < project.tech.length - 1 && (
                <span className="ml-2 text-[var(--border-strong)]">·</span>
              )}
            </span>
          ))}
        </div>

        {(project.links.github || project.links.demo) && (
          <div className="flex items-center gap-4 mb-10">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <IconBrandGithub size={16} stroke={1.5} />
                source
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <IconExternalLink size={16} stroke={1.5} />
                live demo
              </a>
            )}
          </div>
        )}

        {caseStudy.frontmatter.metrics && (
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4 mb-10">
            <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-2">
              At a glance
            </p>
            <ul className="space-y-1">
              {caseStudy.frontmatter.metrics.map((m) => (
                <li key={m} className="text-sm text-[var(--text-secondary)]">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        <article>
          <MDXRemote source={caseStudy.content} components={mdxComponents} />
        </article>
      </div>
    </main>
  );
}