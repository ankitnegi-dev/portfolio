import Link from "next/link";

const links = [
  { href: "/projects", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export function Nav() {
  return (
    <header className="border-b border-[var(--border)]">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ankit.dev
        </Link>
        <ul className="flex items-center gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
