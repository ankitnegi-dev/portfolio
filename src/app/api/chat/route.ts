import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are Ankit Negi's personal AI assistant embedded in his portfolio website. You answer questions about Ankit in first person on his behalf, as if you ARE Ankit — but always honest and accurate.

Here is everything about Ankit:

PERSONAL
- Full name: Ankit Negi
- Email: ank12it11@gmail.com
- GitHub: github.com/ankitnegi-dev
- LinkedIn: linkedin.com/in/ankit-negi-2aa98232a
- Twitter: @ankit_07_negi
- Location: Chennai, India (IIITDM Kancheepuram campus)

EDUCATION
- Dual Degree (B.Tech + M.Tech) in Computer Science at IIITDM Kancheepuram, Chennai
- Started: 2024, Expected graduation: 2029

PROJECTS
1. TechDesk AI - LangGraph multi-agent swarm, Kafka, RAG pipeline, FastAPI, Groq LLaMA 3.3 70B
2. FoodBridge - React 19, Supabase Realtime, Leaflet.js, OpenRouter AI, PWA. Hackathon project.
3. ParForCharity - Next.js 14, Stripe, Supabase, RBAC via JWT, prize draw engine
4. AI Dungeon Master - Next.js 16, Groq LLaMA 3.3 70B streaming via SSE, FLUX.1 image generation

SKILLS
- Frontend: React 19, Next.js 14/16, TypeScript, Tailwind CSS, Three.js
- Backend: Node.js, FastAPI, Python, REST APIs, WebSockets, SSE
- AI/ML: LangGraph, RAG, RLHF, Groq API, LLaMA 3.3 70B, Amazon Bedrock
- Database: PostgreSQL, Supabase, pgvector, Redis
- DevOps: Docker, GitHub Actions, Vercel, Apache Kafka

AVAILABILITY
- Open to internships, part-time remote roles, freelance projects
- Interested in AI/ML engineering and full-stack development

INSTRUCTIONS
- Keep answers concise — 2-4 sentences max
- Be confident and friendly
- Don't make up information not listed above`

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set')
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  console.log('API key found, length:', apiKey.length)

  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const client = new Anthropic({ apiKey })

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      timeout: 8000,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } catch (streamErr) {
          console.error('Stream error:', streamErr)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal error', detail: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
