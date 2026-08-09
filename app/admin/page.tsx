import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getRedis } from "@/lib/redis";
import {
  IconMessageCircle,
  IconEye,
  IconUsers,
  IconWalk,
} from "@tabler/icons-react";


const LABELS = ["impressive", "curious", "collab", "browsing"] as const;
type Label = (typeof LABELS)[number];
type TracePoint = { x: number; y: number; label: Label; ts: number };
type ContactSubmission = { contact: string; ts: number };

const LABEL_ICONS: Record<Label, typeof IconEye> = {
  impressive: IconEye,
  curious: IconMessageCircle,
  collab: IconUsers,
  browsing: IconWalk,
};

const LABEL_COLORS: Record<Label, string> = {
  impressive: "#4c8dff",
  curious: "#7f77dd",
  collab: "#ff6b4a",
  browsing: "#8b9198",
};

async function getDashboardData() {
  const redis = getRedis();
  if (!redis) return null;

  const counts: Record<Label, number> =
    (await redis.hgetall<Record<Label, number>>("reactions:counts")) ??
    ({} as Record<Label, number>);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (await redis.get<number>(`reactions:day:${today}`)) ?? 0;

  const trace = await redis.lrange<TracePoint>("reactions:trace", 0, 49);
  const contacts = await redis.lrange<ContactSubmission>(
    "reactions:contacts",
    0,
    49
  );

  const total = LABELS.reduce((sum, l) => sum + (Number(counts[l]) || 0), 0);

  return {
    counts: Object.fromEntries(
      LABELS.map((l) => [l, Number(counts[l]) || 0])
    ) as Record<Label, number>,
    total,
    today: Number(todayCount) || 0,
    trace,
    contacts,
  };
}

function formatTimestamp(ts: number) {
  return new Date(ts).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const data = await getDashboardData();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            {"// Admin Dashboard"}
          </p>
          <h1 className="font-display text-xl font-semibold">
            Welcome, {session?.user?.name || session?.user?.email || "there"}
          </h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      {!data ? (
        <p className="text-sm text-[var(--text-secondary)]">
          Reaction storage isn&apos;t configured.
        </p>
      ) : (
        <div className="space-y-10">
          {/* summary cards */}
          <div>
            <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Overview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LABELS.map((label) => {
                const Icon = LABEL_ICONS[label];
                return (
                  <div
                    key={label}
                    className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-1)] p-4"
                  >
                    <Icon
                      size={18}
                      stroke={1.5}
                      style={{ color: LABEL_COLORS[label] }}
                      className="mb-2"
                    />
                    <p className="text-lg font-semibold">{data.counts[label]}</p>
                    <p className="text-xs text-[var(--text-secondary)] capitalize">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-3">
              {data.total} Total Signals · {data.today} Today
            </p>
          </div>

          {/* recent activity */}
          <div>
            <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Recent activity
            </p>
            {data.trace.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No reactions yet.
              </p>
            ) : (
              <div className="border border-[var(--border)] rounded-[var(--radius)] divide-y divide-[var(--border)]">
                {data.trace.map((point, i) => {
                  const Icon = LABEL_ICONS[point.label];
                  return (
                    <div
                      key={`${point.ts}-${i}`}
                      className="flex items-center gap-3 px-4 py-2.5"
                    >
                      <Icon
                        size={16}
                        stroke={1.5}
                        style={{ color: LABEL_COLORS[point.label] }}
                        className="shrink-0"
                      />
                      <span className="text-sm capitalize flex-1">
                        {point.label}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--text-muted)]">
                        {formatTimestamp(point.ts)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* contact submissions */}
          <div>
            <p className="font-mono text-[clamp(0.75rem,0.7rem+0.4vw,0.9rem)] text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Contact submissions
            </p>
            {data.contacts.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">
                No one has left contact info yet.
              </p>
            ) : (
              <div className="border border-[var(--border)] rounded-[var(--radius)] divide-y divide-[var(--border)]">
                {data.contacts.map((c, i) => (
                  <div
                    key={`${c.ts}-${i}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <span className="text-sm text-[var(--accent)]">
                      {c.contact}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
                      {formatTimestamp(c.ts)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="font-mono text-xs text-[var(--text-secondary)]">
            Notifications for these still land in Discord in real time - this
            list is the persistent history.
          </p>
        </div>
      )}
    </div>
  );
}