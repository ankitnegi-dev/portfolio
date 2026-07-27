import { Avatar } from "@/components/avatar";
import { Timeline } from "@/components/timeline";
import { SkillsGrid } from "@/components/skills-grid";

export const metadata = {
  title: "About - Ankit Negi",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-20">
        <div className="flex items-center gap-5 mb-8">
          <Avatar size={250} />
          <div>
            <h1 className="font-display text-4xl font-semibold">About</h1>
            <p className="font-mono text-2xs text-[var(--text-muted)] mt-1">
              Ankit Negi
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed mb-12">
          <p>
            I&apos;m a Computer Science undergrad at IIIT Chennai,
            currently in a dual-degree (B.Tech + M.Tech) program running
            2024-2029. Most of what I build sits at the intersection of
            full-stack engineering and AI agent systems - orchestrating
            LLMs to actually do useful, structured work instead of just
            answering questions.
          </p>
          <p>
            On the frontend I work mainly in React and Next.js. On the
            backend, Node.js and FastAPI, with Postgres and pgvector for
            anything that needs retrieval. For AI systems specifically, I
            use LangGraph for multi-agent orchestration, Kafka for event
            streaming between agents, and Redis when I need fast state -
            like the contextual bandit tracker I built for TechDesk AI to
            self-improve its replies over time.
          </p>
        </div>

        <section className="mb-12">
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-5">
            Timeline
          </p>
          <Timeline />
        </section>

        <section>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-5">
            Skills
          </p>
          <SkillsGrid />
        </section>
      </div>
    </main>
  );
}