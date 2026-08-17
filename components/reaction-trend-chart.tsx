"use client";

type DayCount = { date: string; count: number };

function formatDayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2);
}

export function ReactionTrendChart({ trend }: { trend: DayCount[] }) {
  if (trend.length === 0) return null;

  const max = Math.max(...trend.map((d) => d.count), 1);

  return (
    <div className="mt-6 max-w-xs mx-auto">
      <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide mb-3 text-center">
        signals this week
      </p>
      <div className="flex items-end justify-between gap-2 h-16">
        {trend.map((d) => {
          const heightPct = Math.max((d.count / max) * 100, d.count > 0 ? 8 : 3);
          return (
            <div
              key={d.date}
              className="group relative flex-1 flex flex-col items-center justify-end h-full"
            >
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-[var(--text-primary)] bg-[var(--surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none">
                {d.count}
              </div>
              <div
                style={{ height: `${heightPct}%` }}
                className="w-full rounded-sm bg-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity min-h-[3px]"
              />
              <span className="font-mono text-[9px] text-[var(--text-muted)] mt-1.5">
                {formatDayLabel(d.date)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}