import Link from "next/link";

export function Hero() {
  return (
    <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
      <p className="font-mono text-sm text-[var(--accent)] mb-4">
        {"// full-stack developer & AI engineer"}
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-5 max-w-2xl">
        I build systems where AI agents actually do the work.
      </h1>
      <p className="text-[var(--text-secondary)] text-base max-w-lg mb-8">
        Multi-agent orchestration, RAG pipelines, and production-grade
        full-stack apps. Currently building at IIITDM Chennai.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          See the work
        </Link>
        <a
          href="https://github.com/ankitnegi-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          github ↗
        </a>
      </div>
    </section>
  );
}
