'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollProgress } from '@/lib/scrollStore'
import ContactForm from './ContactForm'

function Panel({
  visible,
  align = 'left',
  children,
  accent = 'rgba(0,255,255,0.15)',
}: {
  visible: boolean
  align?: 'left' | 'right' | 'center'
  children: React.ReactNode
  accent?: string
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const mobileStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    left: '12px',
    right: '12px',
    top: 'auto',
    transform: 'none',
    maxWidth: '100%',
    width: 'auto',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.7s ease',
    pointerEvents: visible ? 'auto' : 'none',
    zIndex: 10,
    background: 'rgba(5,5,10,0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '0.5px solid ' + accent,
    padding: '20px',
  }

  const desktopStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: align === 'left' ? '5vw' : align === 'center' ? '50%' : 'auto',
    right: align === 'right' ? '5vw' : 'auto',
    transform: align === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
    maxWidth: '560px',
    width: align === 'center' ? '90vw' : undefined,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.7s ease',
    pointerEvents: visible ? 'auto' : 'none',
    zIndex: 10,
    background: 'rgba(5,5,10,0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '0.5px solid ' + accent,
    padding: '28px 32px',
  }

  return (
    <div style={isMobile ? mobileStyle : desktopStyle}>
      {children}
    </div>
  )
}

const mkLabel = (color: string): React.CSSProperties => ({
  fontFamily: 'monospace',
  fontSize: '11px',
  letterSpacing: '0.3em',
  color,
  marginBottom: '10px',
  textTransform: 'uppercase',
  opacity: 0.9,
})

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.4rem, 4vw, 2.4rem)',
  fontWeight: 700,
  color: '#ffffff',
  lineHeight: 1.2,
  margin: '0 0 12px',
  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
}

const projects = [
  { name: 'TechDesk AI', desc: 'LangGraph, Kafka, RAG pipeline', url: '/projects/techdesk-ai' },
  { name: 'FoodBridge', desc: 'Supabase Realtime, AI food safety', url: '/projects/foodbridge' },
  { name: 'ParForCharity', desc: 'Stripe, Next.js, RBAC', url: '/projects/parforcharity' },
  { name: 'AI Dungeon Master', desc: 'Groq LLaMA 3.3 70B, FLUX.1', url: '/projects/ai-dungeon-master' },
]

const socials = [
  { label: 'GitHub', url: 'https://github.com/ankitnegi-dev' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ankit-negi-2aa98232a' },
  { label: 'Twitter', url: 'https://x.com/ankit_07_negi' },
]

export default function Overlay() {
  const [p, setP] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      setP(scrollProgress.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const inRange = (a: number, b: number) => p >= a && p <= b

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}
        @media(max-width:768px){
          .hero-title{font-size:clamp(2.2rem,12vw,4rem) !important}
          .hero-sub{font-size:14px !important}
        }
      `}</style>

      {/* Hero */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        opacity: inRange(0, 0.12) ? 1 : 0,
        transition: 'opacity 0.7s ease',
        pointerEvents: inRange(0, 0.12) ? 'auto' : 'none',
        zIndex: 10,
        width: '90vw',
        maxWidth: '600px',
        padding: '0 16px',
      }}>
        <p style={mkLabel('#00ffff')}>Full Stack Developer · AI Engineer</p>
        <h1 className="hero-title" style={{
          fontSize: 'clamp(2.8rem, 8vw, 6rem)',
          fontWeight: 800, color: '#ffffff',
          lineHeight: 1.0, margin: '0 0 16px',
          textShadow: '0 0 80px rgba(127,119,221,0.9), 0 4px 40px rgba(0,0,0,1)',
          letterSpacing: '-0.02em',
        }}>Ankit Negi</h1>
        <p className="hero-sub" style={{
          color: 'rgba(255,255,255,0.85)', fontSize: '16px',
          margin: '0 auto 24px', maxWidth: '380px',
          textShadow: '0 2px 20px rgba(0,0,0,1)', fontWeight: 500,
        }}>
          Building production-grade web apps and AI agent systems
        </p>
        <p style={{
          fontFamily: 'monospace', fontSize: '11px',
          color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em',
          animation: 'pulse 2s ease-in-out infinite',
          textShadow: '0 2px 10px rgba(0,0,0,1)',
        }}>SCROLL TO EXPLORE</p>
      </div>

      {/* About */}
      <Panel visible={inRange(0.13, 0.28)} align="left" accent="rgba(0,255,255,0.2)">
        <p style={mkLabel('#00ffff')}>01 / About</p>
        <h2 style={headingStyle}>CS undergrad.<br />Full-stack builder.</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: 1.75, margin: 0 }}>
          Dual Degree student at IIITDM Kancheepuram. I build production-grade
          web apps and AI agent systems — from multi-agent LLM orchestration
          to real-time full-stack platforms.
        </p>
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px', flexWrap: 'wrap' }}>
          {['React', 'Next.js', 'LangGraph', 'Python', 'Supabase', 'Groq AI'].map((s) => (
            <span key={s} style={{
              fontFamily: 'monospace', fontSize: '10px',
              padding: '3px 8px',
              border: '0.5px solid rgba(0,255,255,0.5)',
              borderRadius: '4px', color: '#00ffff',
              background: 'rgba(0,255,255,0.08)',
            }}>{s}</span>
          ))}
        </div>
      </Panel>

      {/* Projects */}
      <Panel visible={inRange(0.29, 0.48)} align="right" accent="rgba(255,0,170,0.2)">
        <p style={mkLabel('#ff00aa')}>02 / Projects</p>
        <h2 style={headingStyle}>Selected work</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {projects.map((proj) => (
            <a key={proj.name} href={proj.url}
              style={{
                padding: '10px 12px',
                border: '0.5px solid rgba(255,0,170,0.25)',
                borderRadius: '8px',
                background: 'rgba(255,0,170,0.08)',
                color: '#ffffff', fontSize: '13px',
                textDecoration: 'none', display: 'block',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,0,170,0.18)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,0,170,0.08)' }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '13px' }}>{proj.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{proj.desc}</div>
            </a>
          ))}
        </div>
      </Panel>


      {/* Skills */}
      <Panel visible={inRange(0.49, 0.72)} align="left" accent="rgba(127,119,221,0.2)">
        <p style={mkLabel('#7F77DD')}>03 / Skills</p>
        <h2 style={headingStyle}>The stack<br />I ship with</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { cat: 'AI & Agents', tags: ['LangGraph', 'Groq API', 'RAG', 'RLHF'], color: '#7F77DD' },
            { cat: 'Frontend', tags: ['React 19', 'Next.js', 'Three.js', 'Tailwind'], color: '#00ffff' },
            { cat: 'Backend', tags: ['FastAPI', 'Node.js', 'Kafka', 'Redis'], color: '#ff00aa' },
            { cat: 'Database', tags: ['PostgreSQL', 'Supabase', 'pgvector'], color: '#ffcc00' },
          ].map(({ cat, tags, color }) => (
            <div key={cat}>
              <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '6px' }}>{cat}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: 'monospace', fontSize: '11px', padding: '3px 8px', border: '0.5px solid ' + color + '55', borderRadius: '4px', color, background: color + '11' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Contact */}
      <Panel visible={inRange(0.73, 1.0)} align="center" accent="rgba(255,204,0,0.2)">
        <p style={mkLabel('#ffcc00')}>03 / Contact</p>
        <h2 style={{ ...headingStyle, marginBottom: '16px' }}>Let&apos;s build<br />something great</h2>
        <ContactForm />
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '14px' }}>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace', fontSize: '11px',
                color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
                letterSpacing: '0.1em', transition: 'color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)' }}
            >{s.label}</a>
          ))}
        </div>
      </Panel>
    </>
  )
}
