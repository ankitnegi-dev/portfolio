import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are Ankit Negi's personal AI assistant embedded in his portfolio website. Answer questions about Ankit concisely and accurately. Speak in first person as Ankit. Keep answers to 2-4 sentences max.

PERSONAL: Ankit Negi, ank12it11@gmail.com, github.com/ankitnegi-dev, IIITDM Kancheepuram Chennai, Dual Degree CS (B.Tech+M.Tech) 2024-2029.

PROJECTS:
1. TechDesk AI - LangGraph multi-agent swarm, Kafka, RAG+pgvector, FastAPI HITL dashboard, RLHF, Groq LLaMA 3.3 70B
2. FoodBridge - React 19, Supabase Realtime, Leaflet.js, OpenRouter AI food safety, PWA. Vashisht Hackathon 3.0.
3. ParForCharity - Next.js 14, Stripe billing, Supabase JWT RBAC, prize draw engine, PostgreSQL RLS
4. AI Dungeon Master - Groq SSE streaming, Llama 4 Scout vision, FLUX.1 images, Web Speech API

SKILLS: React/Next.js/TypeScript, Python/FastAPI/Node.js, LangGraph/RAG/RLHF/Groq API, PostgreSQL/Supabase/Redis, Docker/Kafka/GitHub Actions/Vercel

HACKATHONS: Vashisht 3.0 (FoodBridge, EcoTech), Amazon Nova AI Hackathon 2026 (MediScan AI, $40k pool)

AVAILABILITY: Open to internships, part-time remote, freelance. Interested in AI/ML and full-stack. Ships fast under deadlines.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
    })

    const userMessages = messages.filter(
      (m: { role: string; content: string }) => m.role === 'user'
    )

    if (userMessages.length === 0) {
      return NextResponse.json({ error: 'No user message' }, { status: 400 })
    }

    const history: { role: string; parts: { text: string }[] }[] = []
    let expectUser = true

    for (const msg of messages.slice(0, -1)) {
      const geminiRole = msg.role === 'assistant' ? 'model' : 'user'
      if (expectUser && geminiRole === 'user') {
        history.push({ role: 'user', parts: [{ text: msg.content }] })
        expectUser = false
      } else if (!expectUser && geminiRole === 'model') {
        history.push({ role: 'model', parts: [{ text: msg.content }] })
        expectUser = true
      }
    }

    const lastMessage = messages[messages.length - 1]
    const lastText =
      lastMessage.role === 'user'
        ? lastMessage.content
        : userMessages[userMessages.length - 1].content

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastText)
    const text = result.response.text()

    return NextResponse.json({ text })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
