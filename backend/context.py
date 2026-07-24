"""
Static context the assistant grounds its answers in.

This is the simple "prompt + context" version referenced in the roadmap —
no embeddings or vector DB yet. If the site grows enough content that this
becomes unwieldy, upgrade to real retrieval (pgvector, like DocIntel) instead
of enlarging this file indefinitely.
"""

PROFILE = """
Ankit Negi — Full-Stack Developer & AI Engineer.
Dual-degree (B.Tech + M.Tech) Computer Science student at IIITDM Chennai, 2024-2029.
Specializes in full-stack web apps (React, Next.js, Node.js) and AI agent systems
(multi-agent orchestration, RAG pipelines, event streaming).
Contact: ank12it11@gmail.com, github.com/ankitnegi-dev,
linkedin.com/in/ankit-negi-2aa98232a
"""

PROJECTS = """
1. TechDesk AI (April 2026) — Industry-grade AI social agent.
   Stack: Python, LangGraph, Kafka, Redis, FastAPI.
   A multi-agent swarm (LangGraph + Llama 3.3 70B) that monitors social media,
   drafts replies, and routes them through a human-in-the-loop FastAPI +
   WebSocket dashboard before anything is posted. Uses Apache Kafka for
   event streaming with a full audit trail, a RAG pipeline over Postgres +
   pgvector for context, and a Redis-backed contextual bandit tracker with
   RLHF preference collection so replies improve over time.

2. DocIntel (June 2026) — Document Intelligence & Agentic RAG Platform.
   Stack: Next.js, FastAPI, ChromaDB, Postgres.
   Parses scanned/digital PDFs (OCR + table extraction), classifies documents
   via LLM, and answers questions with inline page-level citations. Uses
   hybrid retrieval — vector search (ChromaDB/Chroma Cloud) + BM25 keyword
   search combined via Reciprocal Rank Fusion — plus cross-encoder
   re-ranking. Containerized with Docker/docker-compose, deployed across
   Render, Vercel, and Chroma Cloud with streaming SSE chat responses.
   Live demo: https://doc-intel-mu.vercel.app/

3. AI Dungeon Master (February 2026) — full-stack AI text adventure.
   Stack: Next.js 16, TypeScript, Groq API, FLUX.1.
   Low-latency streaming narration via Groq running Llama 3.3 70B over
   Server-Sent Events. Uses Llama 4 Scout 17B for real-world object
   recognition through the camera, weaving recognized objects into the
   story. Generates a scene image per action via FLUX.1-schnell, supports
   voice input via the Web Speech API, and exports the full playthrough as
   a storybook PDF via jsPDF.
   Live demo: https://dungeon-master-kappa.vercel.app/
"""

SKILLS = """
Programming: Python, JavaScript, TypeScript, C++, C, SQL, HTML, CSS
Frontend: React 18/19, Next.js 14/16, Tailwind CSS, Three.js, PWA
Backend & APIs: Node.js, Express.js, FastAPI, REST, Webhooks, Apache Kafka
Databases: PostgreSQL, pgvector, Vector Search
AI/ML: LangGraph, Multi-Agent Systems, RAG, LLMs (Groq, Llama, OpenRouter),
Prompt Engineering
Cloud & DevOps: AWS, Docker, Vercel, Git, Linux
"""

ACHIEVEMENTS = """
- Vashisht Hackathon 3.0 (2026): Built FoodBridge in the EcoTech sustainability track.
- Amazon Nova AI Hackathon (2026): Built MediScan AI, multimodal AI for healthcare.
- HackerRank: SQL (Intermediate) and SQL (Basic) certifications.
"""


def build_system_prompt() -> str:
    return f"""You are a concise assistant embedded on Ankit Negi's portfolio site.
You answer visitor questions about Ankit's background, skills, and projects
using ONLY the context below. If something isn't covered by the context,
say you don't have that information rather than guessing.

Keep answers short (2-4 sentences unless asked for detail), friendly, and
factual. Don't invent metrics, dates, or claims not present in the context.

--- PROFILE ---
{PROFILE}

--- PROJECTS ---
{PROJECTS}

--- SKILLS ---
{SKILLS}

--- ACHIEVEMENTS ---
{ACHIEVEMENTS}
"""