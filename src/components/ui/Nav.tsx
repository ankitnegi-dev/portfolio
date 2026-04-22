'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollProgress, instantScrollTo } from '@/lib/scrollStore'

const sections = [
  { label: 'Home',     target: 0,    range: [0, 0.12] as [number, number] },
  { label: 'About',    target: 0.15, range: [0.13, 0.28] as [number, number] },
  { label: 'Projects', target: 0.35, range: [0.29, 0.48] as [number, number] },
  { label: 'Skills',   target: 0.58, range: [0.49, 0.72] as [number, number] },
  { label: 'Contact',  target: 0.85, range: [0.73, 1.0] as [number, number] },
]

export default function Nav() {
  const [p, setP] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const handleNav = (target: number) => {
    instantScrollTo(target)
    setMenuOpen(false)
  }

  const navBg = scrolled || menuOpen ? 'rgba(5,5,10,0.9)' : 'transparent'
  const navBlur = scrolled || menuOpen ? 'blur(12px)' : 'none'
  const navBorder = scrolled ? '0.5px solid rgba(255,255,255,0.06)' : 'none'

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: p * 100 + '%', height: '2px', background: 'linear-gradient(90deg, #534AB7, #00ffff)', zIndex: 30, transition: 'width 0.1s ease' }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, padding: isMobile ? '14px 20px' : '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: navBg, backdropFilter: navBlur, WebkitBackdropFilter: navBlur, borderBottom: navBorder, transition: 'background 0.4s ease' }}>

        <button onClick={() => handleNav(0)} style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>AN</button>

        {isMobile ? (
          <button onClick={() => setMenuOpen((o) => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: '22px', height: '1.5px', background: '#ffffff', opacity: menuOpen && i === 1 ? 0 : 1, transition: 'all 0.3s ease' }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {sections.map((s) => {
              const active = p >= s.range[0] && p <= s.range[1]
              return (
                <button key={s.label} onClick={() => handleNav(s.target)} style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: active ? '#ffffff' : 'rgba(255,255,255,0.35)', background: active ? 'rgba(255,255,255,0.06)' : 'none', border: 'none', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer', transition: 'color 0.3s ease' }}>{s.label}</button>
              )
            })}
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '7px 16px', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '4px', background: 'transparent' }}>RESUME</a>
            <button onClick={() => instantScrollTo(0.85)} style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', color: '#00ffff', textDecoration: 'none', padding: '7px 16px', border: '0.5px solid rgba(0,255,255,0.4)', borderRadius: '4px', background: 'rgba(0,255,255,0.05)', cursor: 'pointer' }}>HIRE ME</button>
          </div>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position: 'fixed', top: '52px', left: 0, right: 0, background: 'rgba(5,5,10,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', zIndex: 19, padding: '12px 20px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          {sections.map((s) => {
            const active = p >= s.range[0] && p <= s.range[1]
            return (
              <button key={s.label} onClick={() => handleNav(s.target)} style={{ display: 'block', width: '100%', textAlign: 'left', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: active ? '#00ffff' : 'rgba(255,255,255,0.5)', background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>{s.label}</button>
            )
          })}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: '8px', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>RESUME</a>
          <button onClick={() => handleNav(0.85)} style={{ display: 'block', width: '100%', textAlign: 'left', marginTop: '8px', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.15em', color: '#00ffff', background: 'none', border: 'none', padding: '10px 0', cursor: 'pointer' }}>HIRE ME →</button>
        </div>
      )}

      {!isMobile && (
        <div style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 20 }}>
          {sections.map((s) => {
            const active = p >= s.range[0] && p <= s.range[1]
            return (
              <button key={s.label} onClick={() => handleNav(s.target)} title={s.label} aria-label={'Navigate to ' + s.label} style={{ width: active ? '8px' : '5px', height: active ? '8px' : '5px', borderRadius: '50%', background: active ? '#00ffff' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease', boxShadow: active ? '0 0 10px #00ffff' : 'none' }} />
            )
          })}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, opacity: activeSection ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', textAlign: 'center' }}>{activeSection?.label}</p>
      </div>
    </>
  )
}
