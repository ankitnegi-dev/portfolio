import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/mdx";

// Strips MDX-only syntax (custom component tags like <AgentGraph3D />)
// that wouldn't make sense as plain text to a language model.
function cleanMdxBody(content: string): string {
  return content
    .replace(/<[A-Z][^>]*\/?>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET() {
  const data = projects.map((project) => {
    const caseStudy = getCaseStudy(project.slug);
    return {
      title: project.title,
      tagline: project.tagline,
      date: project.date,
      tech: project.tech,
      links: project.links,
      summary: caseStudy?.frontmatter.summary ?? project.tagline,
      metrics: caseStudy?.frontmatter.metrics ?? [],
      details: caseStudy ? cleanMdxBody(caseStudy.content) : null,
    };
  });

  return NextResponse.json(
    { projects: data },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } }
  );
}