import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { ReactionSignals } from "@/components/reaction-signals";
import { BlogSection } from "@/components/blog-section";
import { ContactCTA } from "@/components/contact-cta";
import { projects } from "@/lib/projects";

export default function Home() {
  const featured = projects.filter((p) => p.featured);

  return (
    <main className="flex-1">
      <Hero />
      <ProjectGrid projects={featured} title="Selected work" />
      <BlogSection />
      <ContactCTA />
      <ReactionSignals />
    </main>
  );
}