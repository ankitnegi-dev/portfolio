"""
Assistant context.

PROJECTS is no longer hand-typed here - it's fetched live from the
Next.js app's /api/context route, which reads directly from
lib/projects.ts and the MDX case studies. That's the single source of
truth for project data; this file never needs manual updates when a
project is added or edited on the frontend.

PROFILE / SKILLS / ACHIEVEMENTS stay static here since nothing else in
the codebase duplicates them yet - if that changes, apply the same
fetch-from-frontend pattern to those too.
"""

import os
import time

import httpx

FRONTEND_URL = os.environ.get("FRONTEND_URL", "").rstrip("/")
CACHE_TTL_SECONDS = 600  # 10 minutes

_cache: dict = {"text": None, "fetched_at": 0.0}

# Only used if the live endpoint is unreachable (frontend down, network
# issue, FRONTEND_URL unset). Intentionally minimal - this is a safety
# net, not something you need to keep in sync.
FALLBACK_PROJECTS = """
(Live project data is temporarily unavailable. Ankit has built several
AI agent systems and full-stack web apps - direct the visitor to
ankit-negi.is-a.dev/projects for the current list.)
"""

PROFILE = """
Ankit Negi - Full-Stack Developer & AI Engineer.
Dual-degree (B.Tech + M.Tech) Computer Science student at IIITDM Chennai, 2024-2029.
Specializes in full-stack web apps (React, Next.js, Node.js) and AI agent systems
(multi-agent orchestration, RAG pipelines, event streaming).
Contact: ank12it11@gmail.com, github.com/ankitnegi-dev,
linkedin.com/in/ankit-negi-2aa98232a
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


async def fetch_projects_context() -> str:
    now = time.time()
    if _cache["text"] and (now - _cache["fetched_at"] < CACHE_TTL_SECONDS):
        return _cache["text"]

    if not FRONTEND_URL:
        return FALLBACK_PROJECTS

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{FRONTEND_URL}/api/context")
            resp.raise_for_status()
            payload = resp.json()
    except Exception:
        # Serve the last good copy if we have one, otherwise the fallback.
        return _cache["text"] or FALLBACK_PROJECTS

    lines = []
    for i, p in enumerate(payload.get("projects", []), start=1):
        lines.append(f"{i}. {p['title']} ({p['date']}) - {p['tagline']}")
        lines.append(f"   Stack: {', '.join(p['tech'])}")
        if p.get("summary"):
            lines.append(f"   {p['summary']}")
        for m in p.get("metrics", []):
            lines.append(f"   - {m}")
        if p.get("details"):
            lines.append(f"   {p['details']}")
        demo = (p.get("links") or {}).get("demo")
        if demo:
            lines.append(f"   Live demo: {demo}")
        github = (p.get("links") or {}).get("github")
        if github:
            lines.append(f"   Source: {github}")
        lines.append("")

    text = "\n".join(lines)
    _cache["text"] = text
    _cache["fetched_at"] = now
    return text


async def build_system_prompt() -> str:
    projects_text = await fetch_projects_context()
    return f"""You are a concise assistant embedded on Ankit Negi's portfolio site.
You answer visitor questions about Ankit's background, skills, and projects
using ONLY the context below. If something isn't covered by the context,
say you don't have that information rather than guessing.

Keep answers short (2-4 sentences unless asked for detail), friendly, and
factual. Don't invent metrics, dates, or claims not present in the context.

--- PROFILE ---
{PROFILE}

--- PROJECTS ---
{projects_text}

--- SKILLS ---
{SKILLS}

--- ACHIEVEMENTS ---
{ACHIEVEMENTS}
"""