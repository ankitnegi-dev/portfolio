import { getBlogPosts } from "@/lib/hashnode";
import { BlogCarousel } from "@/components/blog-carousel";

export async function BlogSection() {
  const posts = await getBlogPosts();

  const itemListJsonLd =
    posts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: post.url,
            name: post.title,
          })),
        }
      : null;

  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-4">
        Blog
      </p>
      <BlogCarousel posts={posts} />
    </section>
  );
}