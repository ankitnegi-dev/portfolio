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
  {
    date: 'Now',
    title: 'Open to Opportunities',
    desc: 'Seeking internships and part-time roles in AI/ML and full-stack',
    color: '#00ffff',
    icon: '🎯',
  },
]

export default function Timeline() {
  const [p, setP] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      const val = scrollProgress.current
      setP(val)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (p >= 0.13 && p <= 0.28) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [p])

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '5vw',
      transform: 'translateY(-50%)',
      width: '280px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.7s ease',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      <p style={{
        fontFamily: 'monospace',
        fontSize: '11px',
        letterSpacing: '0.25em',
        color: '#00ffff',
        marginBottom: '16px',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>Journey</p>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(180deg, #00ffff22, #ff00aa22, #00ffff22)',
        }} />

        {events.map((event, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '14px',
            marginBottom: '16px',
            animation: visible ? `slideIn 0.4s ease ${i * 0.08}s both` : 'none',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(5,5,10,0.9)',
              border: '0.5px solid ' + event.color + '66',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0,
              boxShadow: '0 0 8px ' + event.color + '33',
            }}>
              {event.icon}
            </div>
            <div style={{ paddingTop: '4px' }}>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: event.color,
                letterSpacing: '0.15em',
                marginBottom: '2px',
                opacity: 0.8,
              }}>{event.date}</p>
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '2px',
                lineHeight: 1.3,
              }}>{event.title}</p>
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.5,
              }}>{event.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
