import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/projects");

export type CaseStudyFrontmatter = {
  summary: string;
  metrics?: string[];
};

export function getCaseStudy(slug: string): {
  frontmatter: CaseStudyFrontmatter;
  content: string;
} | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as CaseStudyFrontmatter,
    content,
  };
}

export function hasCaseStudy(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}