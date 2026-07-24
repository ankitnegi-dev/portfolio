export type Project = {
  slug: string;
  title: string;
  tagline: string;
  date: string; // "YYYY-MM"
  tech: string[];
  icon: string; // tabler icon name, e.g. "network"
  featured: boolean;
  links: {
    github?: string;
    demo?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "techdesk-ai",
    title: "TechDesk AI",
    tagline: "Multi-agent swarm for social media monitoring",
    date: "2026-04",
    tech: ["Python", "LangGraph", "Kafka", "Redis", "FastAPI"],
    icon: "network",
    featured: true,
    links: {
      github: "https://github.com/ankitnegi-dev/Techdesk-ai-social-agent",
    },
  },
  {
    slug: "docintel",
    title: "DocIntel",
    tagline: "Agentic RAG platform with citation-grounded answers",
    date: "2026-06",
    tech: ["Next.js", "FastAPI", "ChromaDB", "Postgres"],
    icon: "file-search",
    featured: true,
    links: {
      demo: "https://doc-intel-mu.vercel.app/",
      github: "https://github.com/ankitnegi-dev/DocIntel",
    },
  },
  {
    slug: "ai-dungeon-master",
    title: "AI Dungeon Master",
    tagline: "Streaming AI text adventure with real-world object recognition",
    date: "2026-02",
    tech: ["Next.js 16", "TypeScript", "Groq API", "FLUX.1"],
    icon: "sword",
    featured: true,
    links: {
      demo: "https://dungeon-master-kappa.vercel.app/",
      github: "https://github.com/ankitnegi-dev/dungeon-master",
    },
  },
];