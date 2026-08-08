import { getBlogPosts } from "@/lib/hashnode";
import { BlogCarousel } from "@/components/blog-carousel";

export async function BlogSection() {
  const posts = await getBlogPosts();

  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-4">
        Blog
      </p>
      <BlogCarousel posts={posts} />
    </section>
  );
}