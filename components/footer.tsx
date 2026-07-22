const stack = [
  "python",
  "typescript",
  "react",
  "next.js",
  "fastapi",
  "langgraph",
  "kafka",
  "postgres",
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[var(--text-muted)]">
          {stack.map((tech, i) => (
            <span key={tech}>
              {tech}
              {i < stack.length - 1 && (
                <span className="ml-2 text-[var(--border-strong)]">·</span>
              )}
            </span>
          ))}
        </div>
        <p className="font-mono text-[11px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} Ankit Negi
        </p>
      </div>
    </footer>
  );
}