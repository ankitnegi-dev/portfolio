import { Avatar } from "@/components/avatar";

export const metadata = {
  title: "About — Ankit Negi",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-20">
        <div className="flex items-center gap-5 mb-8">
          <Avatar size={200} />
          <div>
            <h1 className="font-display text-3xl font-semibold">About</h1>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              Ankit Negi
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
          <p>
            I&apos;m a Computer Science undergrad at IIITDM Chennai,
            currently in a dual-degree (B.Tech + M.Tech) program running
            2024–2029. Most of what I build sits at the intersection of
            full-stack engineering and AI agent systems — orchestrating
            LLMs to actually do useful, structured work instead of just
            answering questions.
          </p>
          <p>
            On the frontend I work mainly in React and Next.js. On the
            backend, Node.js and FastAPI, with Postgres and pgvector for
            anything that needs retrieval. For AI systems specifically, I
            use LangGraph for multi-agent orchestration, Kafka for event
            streaming between agents, and Redis when I need fast state —
            like the contextual bandit tracker I built for TechDesk AI to
            self-improve its replies over time.
          </p>
          <p>
            Outside of coursework, I&apos;ve built and shipped projects at
            hackathons — FoodBridge at Vashisht Hackathon 3.0 in the
            EcoTech track, and MediScan AI for the Amazon Nova AI
            Hackathon, exploring multimodal AI for healthcare.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)]">
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">
            Currently working with
          </p>
          <p className="font-mono text-xs text-[var(--text-secondary)] leading-relaxed">
            Python · TypeScript · React · Next.js · FastAPI · LangGraph ·
            Kafka · PostgreSQL · Docker · AWS
          </p>
        </div>
      </div>
    </main>
  );
}