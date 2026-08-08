"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconChevronLeft,
  IconChevronRight,
  IconArrowUpRight,
} from "@tabler/icons-react";
import type { BlogPost } from "@/lib/hashnode";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCarousel({ posts }: { posts: BlogPost[] }) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  if (posts.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        No posts published yet - check back soon.
      </p>
    );
  }

  const post = posts[index];

  function prev() {
    setIndex((i) => (i - 1 + posts.length) % posts.length);
  }
  function next() {
    setIndex((i) => (i + 1) % posts.length);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-4">
        {posts.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous post"
            className="shrink-0 w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
          >
            <IconChevronLeft size={18} stroke={1.5} />
          </button>
        )}

        <div className="flex-1 max-w-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group block rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-6 hover:border-[var(--accent)] transition-colors"
            >
              <p className="font-mono text-[11px] text-[var(--text-muted)] mb-2">
                {formatDate(post.publishedAt)} · {post.readTimeInMinutes} min
                read
              </p>
              <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-1.5">
                {post.title}
                <IconArrowUpRight
                  size={16}
                  stroke={1.5}
                  className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                {post.brief}
              </p>
            </motion.a>
          </AnimatePresence>
        </div>

        {posts.length > 1 && (
          <button
            onClick={next}
            aria-label="Next post"
            className="shrink-0 w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
          >
            <IconChevronRight size={18} stroke={1.5} />
          </button>
        )}
      </div>

      {posts.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {posts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to post ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index
                  ? "bg-[var(--accent)]"
                  : "bg-[var(--border-strong)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}