import { NextResponse } from "next/server";
import { projects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/mdx";
import { getBlogPosts } from "@/lib/hashnode";
import { getRedis } from "@/lib/redis";

// Strips MDX-only syntax (custom component tags like <AgentGraph3D />)
// that wouldn't make sense as plain text to a language model.
function cleanMdxBody(content: string): string {
  return content
    .replace(/<[A-Z][^>]*\/?>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getSignalSummary() {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const counts =
      (await redis.hgetall<Record<string, number>>("reactions:counts")) ?? {};
    const total = Object.values(counts).reduce(
      (sum, n) => sum + (Number(n) || 0),
      0
    );
    return { total, counts };
  } catch {
    return null;
  }
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

  const [posts, signals] = await Promise.all([
    getBlogPosts().catch(() => []),
    getSignalSummary(),
  ]);

  const latestPost = posts[0]
    ? {
        title: posts[0].title,
        url: posts[0].url,
        publishedAt: posts[0].publishedAt,
        brief: posts[0].brief,
      }
    : null;

  return NextResponse.json(
    { projects: data, latestPost, signals },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } }
  );
}