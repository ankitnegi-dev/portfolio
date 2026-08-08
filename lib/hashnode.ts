import { XMLParser } from "fast-xml-parser";

export type BlogPost = {
  id: string;
  title: string;
  brief: string;
  slug: string;
  url: string;
  coverImage: string | null;
  publishedAt: string;
  readTimeInMinutes: number;
};

const RSS_URL = "https://ankitnegi-dev.hashnode.dev/rss.xml";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function slugFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    return pathname.replace(/^\/+/, "");
  } catch {
    return url;
  }
}

type RssItem = {
  title?: string;
  link?: string;
  description?: string;
  "content:encoded"?: string;
  pubDate?: string;
  guid?: string | { "#text"?: string };
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xml);

    const rawItems = parsed?.rss?.channel?.item;
    const items: RssItem[] = rawItems
      ? Array.isArray(rawItems)
        ? rawItems
        : [rawItems]
      : [];

    return items.map((item, i) => {
      const url = item.link ?? "";
      const rawContent = item["content:encoded"] ?? item.description ?? "";
      const plainText = stripHtml(rawContent);
      const brief =
        plainText.length > 220
          ? `${plainText.slice(0, 220).trim()}…`
          : plainText;

      const id =
        (typeof item.guid === "string" ? item.guid : item.guid?.["#text"]) ??
        url ??
        String(i);

      return {
        id,
        title: item.title ?? "Untitled",
        brief,
        slug: slugFromUrl(url),
        url,
        coverImage: null,
        publishedAt: item.pubDate ?? new Date().toISOString(),
        readTimeInMinutes: estimateReadTime(plainText),
      };
    });
  } catch {
    return [];
  }
}