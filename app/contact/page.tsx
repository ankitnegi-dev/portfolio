import { Nav } from "@/components/nav";

export const metadata = {
  title: "Contact Ankit Negi",
};

const links = [
  { label: "email", value: "ank12it11@gmail.com", href: "mailto:ank12it11@gmail.com" },
  { label: "github", value: "github.com/ankitnegi-dev", href: "https://github.com/ankitnegi-dev" },
  { label: "linkedin", value: "linkedin.com/in/ankit-negi-2aa98232a", href: "https://linkedin.com/in/ankit-negi-2aa98232a" },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 pt-16 pb-20">
          <h1 className="font-display text-3xl font-semibold mb-3">
            Get in touch
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-10 max-w-md">
            Open to internships, collaborations, and interesting problems.
            Email is the fastest way to reach me.
          </p>

          <div className="space-y-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  {link.label}
                </span>
                <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
