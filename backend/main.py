import json
import os

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from context import build_system_prompt

# Configuration
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
# Using openai/gpt-oss-20b for high speed and low latency; can also use openai/gpt-oss-120b or qwen/qwen3.6-27b
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")

app = FastAPI(title="Portfolio Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str


def _clean(text: str) -> str:
    return text.replace("—", " - ").replace("–", " - ")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/models")
async def list_models():
    """Utility endpoint to verify what models are available on your key."""
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500, detail="GROQ_API_KEY is not configured."
        )
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            "https://api.groq.com/openai/v1/models",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
        )
        return resp.json()


async def _build_messages(req: ChatRequest) -> list[dict]:
    system_prompt = await build_system_prompt()
    messages = [{"role": "system", "content": system_prompt}]
    for turn in req.history[-6:]:  # Keep recent context window small
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": req.message})
    return messages


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured on the server.",
        )

    messages = await _build_messages(req)

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 400,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                GROQ_URL,
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=502, detail=f"Upstream model error: {e.response.text}"
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Upstream request failed: {e}")

    reply = data["choices"][0]["message"]["content"]
    reply = _clean(reply)
    reply = " ".join(reply.split())
    return ChatResponse(reply=reply)


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured on the server.",
        )

    messages = await _build_messages(req)

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 400,
        "stream": True,
    }

    async def event_generator():
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream(
                    "POST",
                    GROQ_URL,
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json=payload,
                ) as resp:
                    if resp.status_code != 200:
                        body = await resp.aread()
                        error_msg = body.decode(errors="ignore")
                        yield f"data: {json.dumps({'error': error_msg})}\n\n"
                        yield "data: [DONE]\n\n"
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        chunk = line[len("data: "):].strip()
                        if chunk == "[DONE]":
                            break
                        try:
                            data = json.loads(chunk)
                        except json.JSONDecodeError:
                            continue
                        choices = data.get("choices") or [{}]
                        content = choices[0].get("delta", {}).get("content")
                        if content:
                            yield f"data: {json.dumps({'content': _clean(content)})}\n\n"
        except httpx.RequestError as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")