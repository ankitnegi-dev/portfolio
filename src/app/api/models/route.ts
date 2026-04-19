import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No key' })

  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey
  )
  const data = await res.json()
  const names = data.models?.map((m: { name: string }) => m.name) ?? []
  return NextResponse.json({ models: names })
}
