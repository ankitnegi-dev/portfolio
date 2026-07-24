const groups = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C++", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    label: "Backend",
    items: ["Node.js", "FastAPI", "Express.js", "Kafka"],
  },
  {
    label: "AI / ML",
    items: ["LangGraph", "RAG", "Multi-Agent Systems", "Prompt Engineering"],
  },
  {
    label: "Cloud & DevOps",
    items: ["AWS", "Docker", "Vercel", "Git"],
  },
];

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map((group) => (
        <div
          key={group.label}
          className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4"
        >
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="text-xs rounded-[var(--radius-sm)] border border-[var(--border)] px-2 py-1 text-[var(--text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}