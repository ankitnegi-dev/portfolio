# Backend (FastAPI RAG service)

This will hold the separate FastAPI service for the AI assistant (`/chat` endpoint),
deployed independently on Render. Built in Phase 5.

Planned structure:
```
backend/
├── main.py          # FastAPI app, /chat route
├── rag.py           # embeddings + retrieval over resume/project content
├── requirements.txt
└── .env.example
```
