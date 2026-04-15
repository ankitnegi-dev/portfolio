import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Ankit Negi',
}

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#05050a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      textAlign: 'center',
      padding: '24px',
    }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#00ffff', marginBottom: '24px' }}>
        404 / NOT FOUND
      </p>
      <h1 style={{
        fontSize: 'clamp(4rem, 15vw, 10rem)',
        fontWeight: 800,
        color: '#ffffff',
        lineHeight: 1,
        margin: '0 0 16px',
        textShadow: '0 0 80px rgba(127,119,221,0.8)',
        letterSpacing: '-0.04em',
      }}>404</h1>
      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '48px',
        maxWidth: '320px',
        lineHeight: 1.7,
      }}>
        Looks like this page took a wrong turn on the track.
      </p>
      <Link href="/" style={{
        fontFamily: 'monospace',
        fontSize: '12px',
        letterSpacing: '0.2em',
        color: '#00ffff',
        textDecoration: 'none',
        padding: '12px 28px',
        border: '0.5px solid rgba(0,255,255,0.4)',
        borderRadius: '8px',
        background: 'rgba(0,255,255,0.05)',
      }}>
        ← BACK TO PORTFOLIO
      </Link>

      <div style={{ marginTop: '80px', opacity: 0.15 }}>
        <div style={{ width: '200px', height: '1px', background: '#00ffff', margin: '0 auto 8px' }} />
        <div style={{ width: '120px', height: '1px', background: '#ff00aa', margin: '0 auto' }} />
      </div>
    </main>
  )
}
