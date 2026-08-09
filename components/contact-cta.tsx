import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export function ContactCTA() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold mb-1">
            Have a project in mind?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Open to internships, freelance work, and interesting collaborations.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-[var(--bg)] text-sm font-medium px-5 py-2.5 hover:opacity-90 transition-opacity shrink-0"
        >
          Contact me
          <IconArrowRight size={16} stroke={1.5} />
        </Link>
      </div>
    </section>
  );
}