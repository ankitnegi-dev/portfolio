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
    I&apos;m a Computer Science undergrad at IIIT Chennai, currently in a
    dual-degree (B.Tech + M.Tech) program running 2024-2029. Most of what
    I build sits at the intersection of full-stack engineering and AI
    agent systems - orchestrating LLMs to actually do useful, structured
    work instead of just answering questions.
  </p>
  <p>
    What pulls me toward this space specifically is the systems problem
    underneath it - getting agents to hand off work reliably, keep useful
    state, and recover when a step fails, rather than treating an LLM
    call as a black box you just hope works. TechDesk AI&apos;s
    contextual bandit tracker is the clearest example: instead of a fixed
    prompt, it&apos;s a system that measures its own replies and gets
    better at the job over time. That&apos;s the kind of problem I find
    genuinely interesting - not just calling a model, but building the
    infrastructure around it that makes it dependable.
  </p>
  <p>
    Right now I&apos;m open to interesting collaborations and freelance
    work - if you&apos;re building something in this space and want to
    talk shop or work together, reach out.
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