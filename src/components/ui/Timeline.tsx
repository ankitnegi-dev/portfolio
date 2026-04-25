'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollProgress } from '@/lib/scrollStore'

const events = [
  {
    date: 'Aug 2024',
    title: 'Joined IIITDM Kancheepuram',
    desc: 'Started Dual Degree (B.Tech + M.Tech) in Computer Science',
    color: '#00ffff',
    icon: '🎓',
  },
  {
    date: 'Early 2026',
    title: 'First Production Projects',
    desc: 'Built ParForCharity (Stripe + Supabase) and FoodBridge PWA',
    color: '#7F77DD',
    icon: '🚀',
  },
  {
    date: 'March 2026',
    title: 'Vashisht Hackathon 3.0',
    desc: 'Built FoodBridge for EcoTech track at IIITDM Kancheepuram',
    color: '#00ff88',
    icon: '🏆',
  },
  {
    date: 'March 2026',
    title: 'Amazon Nova AI Hackathon',
    desc: 'Submitted MediScan AI — national hackathon with USD 40k prize pool',
    color: '#ffcc00',
    icon: '🤖',
  },
  {
    date: 'April 2026',
    title: 'TechDesk AI',
    desc: 'Built production-grade autonomous AI social media agent system',
    color: '#ff00aa',
    icon: '⚡',
  },
]

export default function Timeline() {
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

  const visible = p >= 0.13 && p <= 0.28

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '5vw',
      transform: 'translateY(-50%)',
      width: '260px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.7s ease',
      pointerEvents: 'none',
      zIndex: 10,
      background: 'rgba(5,5,10,0.82)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '0.5px solid rgba(0,255,255,0.15)',
      borderRadius: '16px',
      padding: '18px 16px',
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.3em',
        color: '#00ffff',
        marginBottom: '14px',
        textTransform: 'uppercase',
      }}>Journey</p>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '8px',
          bottom: '8px',
          width: '1px',
          background: 'linear-gradient(180deg, rgba(0,255,255,0.3), rgba(255,0,170,0.3), rgba(0,255,255,0.1))',
        }} />

        {events.map((event, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '12px',
            marginBottom: i === events.length - 1 ? 0 : '14px',
            animation: visible ? `slideIn 0.4s ease ${i * 0.08}s both` : 'none',
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(10,10,20,0.95)',
              border: '0.5px solid ' + event.color + '80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              flexShrink: 0,
              boxShadow: '0 0 10px ' + event.color + '40',
            }}>
              {event.icon}
            </div>
            <div style={{ paddingTop: '3px' }}>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: event.color,
                letterSpacing: '0.12em',
                marginBottom: '2px',
                fontWeight: 600,
              }}>{event.date}</p>
              <p style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '2px',
                lineHeight: 1.3,
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}>{event.title}</p>
              <p style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.5,
                textShadow: '0 1px 6px rgba(0,0,0,0.9)',
              }}>{event.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
