type TimelineEntry = {
  date: string;
  title: string;
  description: string;
};

const entries: TimelineEntry[] = [
  {
    date: "2024",
    title: "Started at IIITDM Chennai",
    description: "Dual-degree (B.Tech + M.Tech) in Computer Science, 2024-2029.",
  },
  {
    date: "Feb 2026",
    title: "Shipped AI Dungeon Master",
    description: "Streaming AI text adventure with real-world object recognition.",
  },
  {
    date: "Apr 2026",
    title: "Shipped TechDesk AI",
    description: "Multi-agent swarm for social media monitoring with human-in-the-loop review.",
  },
  {
    date: "Jun 2026",
    title: "Shipped DocIntel",
    description: "Agentic RAG platform with citation-grounded answers over PDFs.",
  },
  {
    date: "2026",
    title: "Hackathons",
    description: "FoodBridge (Vashisht Hackathon 3.0) and MediScan AI (Amazon Nova AI Hackathon).",
  },
];

export function Timeline() {
  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={entry.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
            {i < entries.length - 1 && (
              <span className="w-px flex-1 bg-[var(--border)] my-1" />
            )}
          </div>
          <div className={i < entries.length - 1 ? "pb-6" : ""}>
            <p className="font-mono text-xs text-[var(--text-muted)] mb-1">
              {entry.date}
            </p>
            <p className="text-sm font-medium mb-1">{entry.title}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {entry.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}