'use client'

import { useEffect, useState } from 'react'

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return progress
}

function Panel({
  visible,
  align = 'left',
  children,
}: {
  visible: boolean
  align?: 'left' | 'right' | 'center'
  children: React.ReactNode
}) {
  const style: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: align === 'left' ? '6vw' : align === 'center' ? '50%' : 'auto',
    right: align === 'right' ? '6vw' : 'auto',
    transform: align === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
    maxWidth: '520px',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.6s ease',
    pointerEvents: visible ? 'auto' : 'none',
    zIndex: 10,
  }
  return <div style={style}>{children}</div>
}

const mkLabel = (color: string): React.CSSProperties => ({
  fontFamily: 'monospace',
  fontSize: '11px',
  letterSpacing: '0.25em',
  color,
  marginBottom: '12px',
  textTransform: 'uppercase' as const,
})

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1.2,
  margin: '0 0 20px',
}

const bodyStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '15px',
  lineHeight: 1.8,
  maxWidth: '420px',
}

const projects = [
  {
    name: 'TechDesk AI',
    desc: 'Autonomous AI social media agent — LangGraph, Kafka, RAG',
    url: 'https://github.com/ankitnegi-dev/Techdesk-ai-social-agent',
    color: '#ff00aa',
  },
  {
    name: 'FoodBridge',
    desc: 'Real-time food redistribution PWA — Supabase, Leaflet, AI safety',
    url: 'https://foodbridgeseven.vercel.app',
    color: '#ff00aa',
  },
  {
    name: 'ParForCharity',
    desc: 'Golf scoring & charity fundraising — Stripe, Next.js, Supabase',
    url: 'https://parforcharity.vercel.app',
    color: '#ff00aa',
  },
  {
    name: 'AI Dungeon Master',
    desc: 'AI text adventure — Groq LLaMA 3.3 70B, FLUX.1, Web Speech API',
    url: 'https://dungeon-master-kappa.vercel.app',
    color: '#ff00aa',
  },
]

const socials = [
  { label: 'GitHub', url: 'https://github.com/ankitnegi-dev' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ankit-negi-2aa98232a' },
  { label: 'Twitter', url: 'https://x.com/ankit_07_negi' },
]

export default function Overlay() {
  const p = useScrollProgress()
  const inRange = (a: number, b: number) => p >= a && p <= b

  return (
    <>
      <style>{'@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.6}}'}</style>

      <Panel visible={inRange(0, 0.15)} align="center">
        <div style={{ textAlign: 'center' }}>
          <p style={mkLabel('#00ffff')}>Full Stack Developer · AI Engineer</p>
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.05, margin: '0 0 20px', textShadow: '0 0 60px rgba(127,119,221,0.7)' }}>Ankit Negi</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            Building production-grade web apps and AI agent systems
          </p>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', animation: 'pulse 2s ease-in-out infinite' }}>SCROLL TO EXPLORE</p>
        </div>
      </Panel>

      <Panel visible={inRange(0.18, 0.38)} align="left">
        <p style={mkLabel('#00ffff')}>01 / About</p>
        <h2 style={headingStyle}>CS undergrad.<br />Full-stack builder.</h2>
        <p style={bodyStyle}>
          Dual Degree student at IIITDM Kancheepuram specialising in Computer Science.
          I build and ship production-grade web applications and AI agent systems —
          from multi-agent LLM orchestration to real-time full-stack platforms.
          Hackathon participant with a track record of delivering end-to-end projects under tight deadlines.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' as const }}>
          {['React', 'Next.js', 'LangGraph', 'Python', 'Supabase', 'Groq AI'].map((s) => (
            <span key={s} style={{ fontFamily: 'monospace', fontSize: '11px', padding: '4px 10px', border: '0.5px solid rgba(0,255,255,0.4)', borderRadius: '4px', color: '#00ffff' }}>{s}</span>
          ))}
        </div>
      </Panel>

      <Panel visible={inRange(0.42, 0.68)} align="right">
        <p style={mkLabel('#ff00aa')}>02 / Projects</p>
        <h2 style={headingStyle}>Selected work</h2>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {projects.map((proj) => (
            <a key={proj.name} href={proj.url} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 16px', border: '0.5px solid rgba(255,0,170,0.3)', borderRadius: '8px', background: 'rgba(255,0,170,0.05)', cursor: 'pointer', color: '#ffffff', fontSize: '14px', textDecoration: 'none', display: 'block' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{proj.name}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{proj.desc}</div>
            </a>
          ))}
        </div>
      </Panel>

      <Panel visible={inRange(0.75, 1.0)} align="center">
        <div style={{ textAlign: 'center' }}>
          <p style={mkLabel('#ffcc00')}>03 / Contact</p>
          <h2 style={headingStyle}>Let&apos;s build<br />something great</h2>
          <a href="mailto:ank12it11@gmail.com" style={{ display: 'inline-block', padding: '14px 32px', border: '0.5px solid rgba(255,204,0,0.6)', borderRadius: '8px', color: '#ffcc00', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.15em', textDecoration: 'none', background: 'rgba(255,204,0,0.05)', marginBottom: '24px' }}>ank12it11@gmail.com</a>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px' }}>
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', letterSpacing: '0.1em' }}>{s.label}</a>
            ))}
          </div>
        </div>
      </Panel>
    </>
  )
}
