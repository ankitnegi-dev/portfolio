'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '14px 16px',
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.3em', color: '#00ffff', marginBottom: '8px' }}>
          MESSAGE SENT
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
          I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{ marginTop: '16px', fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
        >
          SEND ANOTHER
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={update('name')}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,204,0,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          style={inputStyle}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,204,0,0.5)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        />
      </div>
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={update('message')}
        rows={4}
        style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,204,0,0.5)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
      />
      {status === 'error' && (
        <p style={{ fontFamily: 'monospace', fontSize: '11px', color: '#ff4444', letterSpacing: '0.1em' }}>
          FAILED TO SEND — TRY EMAIL DIRECTLY
        </p>
      )}
      <button
        onClick={submit}
        disabled={status === 'sending' || !form.name || !form.email || !form.message}
        style={{
          padding: '12px 24px',
          background: status === 'sending' ? 'rgba(255,204,0,0.1)' : 'rgba(255,204,0,0.08)',
          border: '0.5px solid rgba(255,204,0,0.6)',
          borderRadius: '8px',
          color: '#ffcc00',
          fontFamily: 'monospace',
          fontSize: '12px',
          letterSpacing: '0.2em',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: (!form.name || !form.email || !form.message) ? 0.4 : 1,
        }}
        onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,204,0,0.15)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,204,0,0.08)' }}
      >
        {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </div>
  )
}
