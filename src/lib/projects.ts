export interface Project {
  slug: string
  name: string
  tagline: string
  date: string
  tags: string[]
  description: string
  problem: string
  solution: string
  features: string[]
  tech: { category: string; items: string[] }[]
  links: { label: string; url: string }[]
  color: string
  accentColor: string
}

export const projects: Project[] = [
  {
    slug: 'techdesk-ai',
    name: 'TechDesk AI',
    tagline: 'Autonomous AI social media monitoring and response agent',
    date: 'April 2026',
    color: '#7F77DD',
    accentColor: 'rgba(127,119,221,0.3)',
    tags: ['AI Agents', 'LangGraph', 'Kafka', 'RAG', 'FastAPI', 'Python'],
    description: 'A fully autonomous AI social media monitoring and response agent covering all 7 layers of a production AI system — perception, understanding, planning, memory, action, safety, and observability.',
    problem: 'Brands receive thousands of social media mentions daily. Manual monitoring is impossible at scale, and generic auto-replies damage brand trust. The challenge was building an autonomous system that understands context, drafts on-brand responses, and knows when to escalate to a human.',
    solution: 'Built a LangGraph multi-agent swarm with 4 specialist agents routing signals by intent. Integrated Llama 3.3 70B via Groq API for LLM reasoning. Added a full HITL (Human-in-the-Loop) review dashboard so humans approve before anything goes live.',
    features: [
      'LangGraph multi-agent swarm: Orchestrator, Engagement, Crisis, and ContentCreator agents',
      'RAG pipeline using fastembed local embeddings + pgvector cosine similarity over PostgreSQL',
      'Real-time Reddit and LinkedIn connectors with Redis-backed deduplication',
      'Apache Kafka event streaming (5 topics, KRaft mode) with append-only audit trail',
      'FastAPI + WebSocket HITL review dashboard for human approval of agent drafts',
      'RLHF preference collection and contextual bandit strategy tracker (epsilon-greedy) in Redis',
    ],
    tech: [
      { category: 'AI & Agents', items: ['LangGraph', 'Llama 3.3 70B', 'Groq API', 'RAG Pipeline', 'RLHF', 'Contextual Bandits'] },
      { category: 'Backend', items: ['Python', 'FastAPI', 'Apache Kafka', 'Redis', 'WebSockets', 'asyncio'] },
      { category: 'Database', items: ['PostgreSQL', 'pgvector', 'fastembed', 'SQLAlchemy'] },
      { category: 'Infrastructure', items: ['Docker', 'Docker Compose', 'KRaft mode', 'GitHub Actions'] },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/ankitnegi-dev/Techdesk-ai-social-agent' },
    ],
  },
  {
    slug: 'foodbridge',
    name: 'FoodBridge',
    tagline: 'Real-time surplus food redistribution platform',
    date: 'March 2026',
    color: '#1D9E75',
    accentColor: 'rgba(29,158,117,0.3)',
    tags: ['React 19', 'Supabase', 'PWA', 'Leaflet.js', 'AI', 'Hackathon'],
    description: 'A full-stack progressive web application for real-time surplus food redistribution, built for the EcoTech track at Vashisht Hackathon 3.0 at IIITDM Kancheepuram.',
    problem: 'Tonnes of surplus food are wasted daily by restaurants and events while people nearby go hungry. Existing solutions lack real-time coordination, AI-powered safety checks, and a gamified incentive system to keep donors engaged.',
    solution: 'Built a live interactive map with color-coded urgency markers updated via Supabase Realtime WebSocket subscriptions. Integrated AI food safety analysis so donor-uploaded photos are assessed for freshness before a receiver can claim a listing.',
    features: [
      'Live Leaflet.js map with color-coded urgency markers via Supabase Realtime WebSockets',
      'AI food safety analysis pipeline using OpenRouter vision model API on donor uploads',
      'PostgreSQL with Row-Level Security covering profiles, listings, claims, and ratings',
      'Gamification system: points, levels, achievement badges, and animated impact dashboards',
      'Installable PWA with service worker + web manifest; Android APK generated for direct install',
      'Nominatim geocoding API for address-to-coordinate conversion at zero API cost',
    ],
    tech: [
      { category: 'Frontend', items: ['React 19', 'Vite', 'Tailwind CSS', 'Leaflet.js', 'PWA', 'Service Worker'] },
      { category: 'Backend', items: ['Express.js', 'Node.js', 'REST API', 'OpenRouter AI'] },
      { category: 'Database', items: ['Supabase', 'PostgreSQL', 'Row-Level Security', 'Realtime WebSockets'] },
      { category: 'DevOps', items: ['Vercel', 'GitHub Actions', 'Android APK'] },
    ],
    links: [
      { label: 'Live Demo', url: 'https://foodbridgeseven.vercel.app' },
    ],
  },
  {
    slug: 'parforcharity',
    name: 'ParForCharity',
    tagline: 'Golf scoring and charity fundraising platform',
    date: 'March 2026',
    color: '#378ADD',
    accentColor: 'rgba(55,138,221,0.3)',
    tags: ['Next.js 14', 'TypeScript', 'Stripe', 'Supabase', 'RBAC', 'Zod'],
    description: 'A subscription-driven full-stack web platform where golfers subscribe, log scores, choose a charity contribution percentage, and automatically enter a monthly prize draw with tiered cash prizes.',
    problem: 'Golf clubs lack a unified platform combining score tracking, charitable giving, and prize draws. Building one requires robust payment infrastructure, fair randomised draws, and strict access control so admins cannot be impersonated.',
    solution: 'Integrated Stripe Checkout and Webhooks for recurring billing. Built a configurable prize draw engine supporting Fisher-Yates random selection and frequency-weighted algorithmic selection. Implemented RBAC using custom Supabase JWT hooks.',
    features: [
      'Stripe Checkout + Webhooks for recurring monthly and yearly subscription billing',
      'Role-based access control via custom Supabase JWT token hook embedding user roles',
      'Configurable prize draw engine: Fisher-Yates random and frequency-weighted selection modes',
      'Automatic jackpot rollover if no five-match winner is found',
      '11-table normalized PostgreSQL schema with RLS policies and 4 ordered SQL migration files',
      'Admin panel for draw snapshot, publish, and winner verification workflows',
    ],
    tech: [
      { category: 'Frontend', items: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'App Router'] },
      { category: 'Backend', items: ['Next.js API Routes', 'Stripe Checkout', 'Stripe Webhooks', 'Zod'] },
      { category: 'Database', items: ['Supabase', 'PostgreSQL', 'Row-Level Security', 'JWT RBAC'] },
      { category: 'DevOps', items: ['Vercel', 'Environment configs', 'GitHub Actions'] },
    ],
    links: [
      { label: 'Live Demo', url: 'https://parforcharity.vercel.app' },
    ],
  },
  {
    slug: 'ai-dungeon-master',
    name: 'AI Dungeon Master',
    tagline: 'AI-powered text adventure game with real-world object recognition',
    date: '2026',
    color: '#D85A30',
    accentColor: 'rgba(216,90,48,0.3)',
    tags: ['Next.js 16', 'Groq API', 'LLaMA 3.3 70B', 'FLUX.1', 'SSE', 'TypeScript'],
    description: 'A full-stack AI text adventure game featuring four distinct game worlds, real-world object recognition via device camera, streaming story narration, and AI-generated scene images per player action.',
    problem: 'Text adventure games are static and repetitive. The challenge was making a game that generates unique narratives in real-time, reacts to physical objects in the real world, and delivers output fast enough to feel like a live experience.',
    solution: 'Used Groq API with LLaMA 3.3 70B for sub-second streaming story narration via Server-Sent Events. Integrated Llama 4 Scout 17B vision model to identify physical objects from the device camera and weave them into the narrative as fantasy items.',
    features: [
      'Four game worlds: Dark Fantasy, Space Opera, Cosmic Horror, and Feudal Japan',
      'Real-time streaming story narration via SSE using LLaMA 3.3 70B on Groq API',
      'Real-world object recognition: device camera identifies objects woven into the narrative',
      'AI scene image generation per player action using HuggingFace FLUX.1-schnell',
      'Voice input via Web Speech API and text-to-speech narration',
      'jsPDF storybook export with AI-generated cover art',
    ],
    tech: [
      { category: 'Frontend', items: ['Next.js 16', 'TypeScript', 'Web Speech API', 'SSE Client'] },
      { category: 'AI', items: ['Groq API', 'LLaMA 3.3 70B', 'Llama 4 Scout 17B', 'FLUX.1-schnell', 'HuggingFace'] },
      { category: 'Backend', items: ['Next.js API Routes', 'Server-Sent Events', 'jsPDF'] },
      { category: 'DevOps', items: ['Vercel', 'Edge Runtime'] },
    ],
    links: [
      { label: 'Live Demo', url: 'https://dungeon-master-kappa.vercel.app' },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
