import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <p className="font-mono text-sm text-[var(--accent)] mb-3">
          {"// 404"}
        </p>
        <h1 className="font-display text-2xl font-semibold mb-3">
          Nothing here.
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-6">
          That page doesn&apos;t exist, or the project you&apos;re looking
          for hasn&apos;t shipped a case study yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}