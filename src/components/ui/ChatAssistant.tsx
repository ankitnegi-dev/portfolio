'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  'What is your strongest project?',
  'Are you open to internships?',
  'What AI frameworks do you know?',
  'Tell me about your hackathons',
]

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Ankit's AI assistant. Ask me anything about his skills, projects, or experience." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setPulse(false)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async (text: string) => {
    const userMsg = text.trim()
    if (!userMsg || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (data.text) {
        setMessages([...newMessages, { role: 'assistant', content: data.text }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Try again or email ank12it11@gmail.com directly.' }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Try again or email ank12it11@gmail.com directly.' }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: '84px', right: '24px',
          width: '340px', maxHeight: '500px',
          background: 'rgba(5,5,10,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(0,255,255,0.3)',
          borderRadius: '16px', zIndex: 50,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: loading ? '#ffcc00' : '#00ffff', boxShadow: '0 0 8px ' + (loading ? '#ffcc00' : '#00ffff'), transition: 'all 0.3s' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#00ffff', letterSpacing: '0.2em' }}>
                {loading ? 'THINKING...' : 'ASK ANKIT AI'}
              </span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '16px', lineHeight: 1, padding: '2px 6px' }}>x</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'none' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 13px',
                  borderRadius: msg.role === 'user' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                  background: msg.role === 'user' ? 'rgba(0,255,255,0.08)' : 'rgba(127,119,221,0.1)',
                  border: msg.role === 'user' ? '0.5px solid rgba(0,255,255,0.25)' : '0.5px solid rgba(127,119,221,0.25)',
                }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '2px 12px 12px 12px', background: 'rgba(127,119,221,0.1)', border: '0.5px solid rgba(127,119,221,0.25)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: '#7F77DD',
                      animation: 'bounce 1.2s ease-in-out infinite',
                      animationDelay: i * 0.2 + 's',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {SUGGESTED.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' }}
                  >{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px 16px', borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={loading ? 'AI is thinking...' : 'Ask anything...'}
              disabled={loading}
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#ffffff', fontFamily: 'monospace', fontSize: '12px', outline: 'none' }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}
              style={{ background: loading || !input.trim() ? 'rgba(0,255,255,0.03)' : 'rgba(0,255,255,0.1)', border: '0.5px solid rgba(0,255,255,0.3)', borderRadius: '8px', padding: '9px 14px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', color: '#00ffff', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.1em', opacity: loading || !input.trim() ? 0.4 : 1 }}
            >SEND</button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: open ? 'rgba(0,255,255,0.15)' : 'rgba(5,5,10,0.9)',
          border: '0.5px solid rgba(0,255,255,' + (open ? '0.6)' : '0.4)'),
          cursor: 'pointer', zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          animation: pulse ? 'ping 2s ease-out infinite' : 'none',
        }}
        title="Ask Ankit AI"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <style>{`
        @keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(0,255,255,0.4); } 70% { box-shadow: 0 0 0 12px rgba(0,255,255,0); } 100% { box-shadow: 0 0 0 0 rgba(0,255,255,0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
