'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollProgress, scrollTo } from '@/lib/scrollStore'

const sections = [
  { label: 'Home',     target: 0,    range: [0, 0.18] as [number, number] },
  { label: 'About',    target: 0.25, range: [0.2, 0.42] as [number, number] },
  { label: 'Projects', target: 0.55, range: [0.45, 0.7] as [number, number] },
  { label: 'Contact',  target: 0.85, range: [0.75, 1.0] as [number, number] },
]

export default function Nav() {
  const [p, setP] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      const val = scrollProgress.current
      setP(val)
      setScrolled(val > 0.02)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const activeSection = sections.find((s) => p >= s.range[0] && p <= s.range[1])

  return (
    <>
      {/* Progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: p * 100 + '%', height: '1.5px',
        background: 'linear-gradient(90deg, #534AB7, #00ffff)',
        zIndex: 30, transition: 'width 0.1s ease',
      }} />

      {/* Top nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(5,5,10,0.65)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.4s ease',
      }}>
        <button
          onClick={() => scrollTo(0)}
          style={{
            fontFamily: 'monospace', fontSize: '13px', fontWeight: 600,
            color: '#ffffff', letterSpacing: '0.05em',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >AN</button>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {sections.map((s) => {
            const active = p >= s.range[0] && p <= s.range[1]
            return (
              <button
                key={s.label}
                onClick={() => scrollTo(s.target)}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  background: active ? 'rgba(255,255,255,0.06)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease, background 0.3s ease',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'
                }}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        <a href="mailto:ank12it11@gmail.com" style={{
          fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em',
          color: '#00ffff', textDecoration: 'none',
          padding: '7px 16px',
          border: '0.5px solid rgba(0,255,255,0.4)',
          borderRadius: '4px',
          background: 'rgba(0,255,255,0.05)',
          transition: 'background 0.2s, border-color 0.2s',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,255,255,0.12)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,255,255,0.8)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,255,255,0.05)'
            ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,255,255,0.4)'
          }}
        >HIRE ME</a>
      </nav>

      {/* Right side dots */}
      <div style={{
        position: 'fixed', right: '24px', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 20,
      }}>
        {sections.map((s) => {
          const active = p >= s.range[0] && p <= s.range[1]
          return (
            <button
              key={s.label}
              onClick={() => scrollTo(s.target)}
              title={s.label}
              style={{
                width: active ? '8px' : '5px',
                height: active ? '8px' : '5px',
                borderRadius: '50%',
                background: active ? '#00ffff' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
                boxShadow: active ? '0 0 10px #00ffff' : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Bottom section label */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: 'translateX(-50%)', zIndex: 20,
        opacity: activeSection ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: 'monospace', fontSize: '10px',
          letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', textAlign: 'center',
        }}>{activeSection?.label}</p>
      </div>
    </>
  )
}
