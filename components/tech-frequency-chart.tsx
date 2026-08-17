import { projects } from "@/lib/projects";

function getTechFrequency() {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.tech) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function TechFrequencyChart() {
  const data = getTechFrequency();
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.tech} className="flex items-center gap-3">
          <span className="w-28 shrink-0 font-mono text-xs text-[var(--text-secondary)] truncate">
            {d.tech}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              style={{ width: `${(d.count / max) * 100}%` }}
              className="h-full rounded-full bg-[var(--accent)]"
            />
          </div>
          <span className="w-4 shrink-0 font-mono text-[11px] text-[var(--text-muted)] text-right">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}