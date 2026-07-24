# Portfolio Assistant - FastAPI backend

A small RAG-style backend for the "ask about Ankit" chat widget on the
portfolio site. Currently a simple prompt + static-context implementation
(see `context.py`) - no vector DB yet, per the Phase 5 plan. Upgrade to real
retrieval later if the content outgrows a single context file.

## Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

Test it:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What has Ankit built with LangGraph?"}'
```

## Deploy (Render)

1. Push this repo (or just the `backend/` folder as its own repo) to GitHub.
2. On Render: New → Web Service → connect the repo.
3. Root directory: `backend` (if backend lives inside the main portfolio repo).
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `GROQ_API_KEY`, `FRONTEND_URL` (your Vercel URL).
7. Once deployed, set `RAG_API_URL` in the Next.js project's environment
   variables (on Vercel) to this Render service's URL.

## Note on cold starts

Render's free tier spins down after inactivity - the first request after
idle can take several seconds. The chat widget on the frontend already
accounts for this with a "waking up…" state.