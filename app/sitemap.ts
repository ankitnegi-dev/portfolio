import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/projects";
import { hasCaseStudy } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p) => hasCaseStudy(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...projectPages];
}