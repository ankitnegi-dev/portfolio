const STREAK_STATS_URL =
  "https://streak-stats.demolab.com/?user=ankitnegi-dev&background=12161A&ring=4C8DFF&fire=FF6B4A&currStreakNum=E6E8EB&sideNums=E6E8EB&currStreakLabel=4C8DFF&sideLabels=8B9198&dates=7A818B&hide_border=true";

const ACTIVITY_GRAPH_URL =
  "https://github-readme-activity-graph.vercel.app/graph?username=ankitnegi-dev&bg_color=12161A&color=8B9198&line=4C8DFF&point=FF6B4A&area=true&area_color=4C8DFF&title_color=E6E8EB&hide_border=true";

const CALENDAR_URL = "https://ghchart.rshah.org/4c8dff/ankitnegi-dev";

export function GithubStats() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-4">
        GitHub stats &amp; activity
      </p>

      <div className="space-y-4">
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STREAK_STATS_URL}
            alt="Ankit Negi's GitHub contribution streak stats"
            className="w-full h-auto"
          />
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ACTIVITY_GRAPH_URL}
            alt="Ankit Negi's GitHub activity graph"
            className="w-full h-auto"
          />
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] p-4 overflow-x-auto">
          <p className="font-mono text-[11px] text-[var(--text-muted)] mb-2">
            contribution calendar
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CALENDAR_URL}
            alt="Ankit Negi's GitHub contribution calendar"
            className="h-auto"
          />
        </div>
      </div>
    </section>
  );
}