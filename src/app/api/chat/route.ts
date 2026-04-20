import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are Ankit Negi's personal AI assistant. Answer questions about Ankit concisely in first person. Keep answers to 2-4 sentences.

PERSONAL: Ankit Negi, ank12it11@gmail.com, github.com/ankitnegi-dev, IIITDM Kancheepuram Chennai, Dual Degree CS B.Tech+M.Tech 2024-2029.

PROJECTS:
1. TechDesk AI - LangGraph multi-agent swarm (4 agents), Apache Kafka, RAG+pgvector, FastAPI HITL dashboard, RLHF contextual bandits, Groq LLaMA 3.3 70B. GitHub: github.com/ankitnegi-dev/Techdesk-ai-social-agent
2. FoodBridge - React 19, Supabase Realtime WebSockets, Leaflet.js map, OpenRouter AI food safety analysis, PWA+Android APK. Vashisht Hackathon 3.0. Live: foodbridgeseven.vercel.app
3. ParForCharity - Next.js 14, Stripe billing+webhooks, Supabase JWT RBAC, prize draw engine, 11-table PostgreSQL RLS. Live: parforcharity.vercel.app
4. AI Dungeon Master - Groq LLaMA 3.3 70B SSE streaming, Llama 4 Scout vision, FLUX.1 image gen, Web Speech API. Live: dungeon-master-kappa.vercel.app

SKILLS:
- Frontend: React 19, Next.js 14/16, TypeScript, Tailwind CSS, Three.js, R3F, PWA
- Backend: Node.js, FastAPI, Python, REST APIs, WebSockets, SSE, Webhooks
- AI/ML: LangGraph, RAG, RLHF, Groq API, LLaMA 3.3 70B, Llama 4 Scout, Amazon Bedrock, OpenRouter, FLUX.1
- Database: PostgreSQL, Supabase, pgvector, Redis, SQLAlchemy
- DevOps: Docker, GitHub Actions, Vercel, Apache Kafka, Linux

HACKATHONS: Vashisht Hackathon 3.0 (FoodBridge, EcoTech track), Amazon Nova AI Hackathon 2026 (MediScan AI, USD 40k prize pool)

AVAILABILITY: Open to internships, part-time remote, freelance. Interested in AI/ML and full-stack. Ships fast under deadlines.

INSTRUCTIONS: Be confident, friendly, first person. Don't invent info not listed above. For salary say open to discussion.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const client = new Groq({ apiKey })

    const groqMessages = messages
      .filter((m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...groqMessages,
      ],
    })

    const text = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ text })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
