"""
Assistant context.

PROJECTS is no longer hand-typed here - it's fetched live from the
Next.js app's /api/context route, which reads directly from
lib/projects.ts and the MDX case studies. That's the single source of
truth for project data; this file never needs manual updates when a
project is added or edited on the frontend.

The same /api/context route also returns Ankit's latest blog post and
live reaction-signal totals, so the assistant can talk about genuinely
current site activity, not just static project facts.

PROFILE / SKILLS / ACHIEVEMENTS stay static here since nothing else in
the codebase duplicates them yet - if that changes, apply the same
fetch-from-frontend pattern to those too.
"""

import os
import time

import httpx

FRONTEND_URL = os.environ.get("FRONTEND_URL", "").rstrip("/")
CACHE_TTL_SECONDS = 600  # 10 minutes

_cache: dict = {"projects_text": None, "extra_text": None, "fetched_at": 0.0}

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


def _format_extra_context(payload: dict) -> str:
    lines = []

    latest_post = payload.get("latestPost")
    if latest_post:
        lines.append("Latest blog post:")
        lines.append(f"  \"{latest_post['title']}\" - {latest_post['url']}")
        if latest_post.get("brief"):
            lines.append(f"  {latest_post['brief']}")
        lines.append("")

    signals = payload.get("signals")
    if signals and signals.get("total"):
        counts = signals.get("counts", {})
        parts = [f"{v} {k}" for k, v in counts.items() if v]
        if parts:
            lines.append(
                f"Live visitor reactions so far: {signals['total']} total "
                f"({', '.join(parts)})."
            )
            lines.append("")

    return "\n".join(lines)


async def fetch_context() -> tuple[str, str]:
    now = time.time()
    if _cache["projects_text"] and (now - _cache["fetched_at"] < CACHE_TTL_SECONDS):
        return _cache["projects_text"], _cache["extra_text"] or ""

    if not FRONTEND_URL:
        return FALLBACK_PROJECTS, ""

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{FRONTEND_URL}/api/context")
            resp.raise_for_status()
            payload = resp.json()
    except Exception:
        return _cache["projects_text"] or FALLBACK_PROJECTS, _cache["extra_text"] or ""

    lines = []
    for i, p in enumerate(payload.get("projects", []), start=1):
        lines.append(f"{i}. {p['title']} ({p['date']}) - {p['tagline']}")
        lines.append(f"   Stack: {', '.join(p['tech'])}")
        if p.get("summary"):
            lines.append(f"   {p['summary']}")
        for m in p.get("metrics", []):
            lines.append(f"   - {m}")
        details = p.get("details")
        if details:
            # capped - the full case study is long (real bug stories, etc.);
            # the summary + metrics above already give a solid answer, this
            # is just extra flavor, not meant to be the whole document
            truncated = details[:400]
            if len(details) > 400:
                truncated += "…"
            lines.append(f"   {truncated}")
        demo = (p.get("links") or {}).get("demo")
        if demo:
            lines.append(f"   Live demo: {demo}")
        github = (p.get("links") or {}).get("github")
        if github:
            lines.append(f"   Source: {github}")
        lines.append("")

    projects_text = "\n".join(lines)
    extra_text = _format_extra_context(payload)

    _cache["projects_text"] = projects_text
    _cache["extra_text"] = extra_text
    _cache["fetched_at"] = now
    return projects_text, extra_text


async def build_system_prompt() -> str:
    projects_text, extra_text = await fetch_context()

    extra_block = f"\n--- CURRENT SITE ACTIVITY ---\n{extra_text}\n" if extra_text else ""

    return f"""You are Ankit Negi's portfolio assistant - you talk about his work the way someone who actually knows him would, not like a corporate FAQ bot. Be direct, a little informal, and genuinely enthusiastic about the technical details when they come up, without overselling anything.

Answer using ONLY the context below. If something isn't covered, say so plainly instead of guessing or padding the answer.

Never use em dashes (—) or en dashes (–) in your responses - use a plain hyphen with spaces instead, like this. Keep punctuation simple.

You may use **double asterisks** to bold a key term or technology name when it genuinely helps scannability - use it sparingly, not on every sentence. Don't use other markdown like headers, italics, or bullet-point dashes - this renders in a simple chat bubble, not a markdown viewer.

Keep answers conversational and tight - 2-4 sentences unless someone clearly wants depth, in which case go deeper. Don't invent metrics, dates, or claims not present in the context. If asked about current site activity (backend status, recent visitor reactions, the latest blog post), use the CURRENT SITE ACTIVITY section below - that's real, live data, not a static fact.

--- PROFILE ---
{PROFILE}

--- PROJECTS ---
{projects_text}
{extra_block}
--- SKILLS ---
{SKILLS}

--- ACHIEVEMENTS ---
{ACHIEVEMENTS}
"""