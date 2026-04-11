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
    transform:
      align === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
    maxWidth: '480px',
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
  maxWidth: '380px',
}

export default function Overlay() {
  const p = useScrollProgress()
  const inRange = (a: number, b: number) => p >= a && p <= b

  return (
    <>
      <style>{'@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.6}}'}</style>

      <Panel visible={inRange(0, 0.15)} align="center">
        <div style={{ textAlign: 'center' }}>
          <p style={mkLabel('#00ffff')}>Full Stack Developer</p>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: '0 0 24px',
              textShadow: '0 0 40px rgba(127,119,221,0.6)',
            }}
          >
            Your Name
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              marginBottom: '32px',
            }}
          >
            Building immersive web experiences
          </p>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.2em',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            SCROLL TO EXPLORE
          </p>
        </div>
      </Panel>

      <Panel visible={inRange(0.2, 0.4)} align="left">
        <p style={mkLabel('#00ffff')}>01 / ABOUT</p>
        <h2 style={headingStyle}>
          I build things
          <br />
          for the web
        </h2>
        <p style={bodyStyle}>
          A developer obsessed with the intersection of design and engineering.
          I specialise in 3D interfaces, real-time graphics, and experiences
          that feel genuinely different.
        </p>
      </Panel>

      <Panel visible={inRange(0.45, 0.68)} align="right">
        <p style={mkLabel('#ff00aa')}>02 / PROJECTS</p>
        <h2 style={headingStyle}>Selected work</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['3D Racing Portfolio', 'UI/UX Case Study', 'WebGL Experiment'].map(
            (name) => (
              <div
                key={name}
                style={{
                  padding: '14px 18px',
                  border: '0.5px solid rgba(255,0,170,0.3)',
                  borderRadius: '8px',
                  background: 'rgba(255,0,170,0.05)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              >
                {name}
              </div>
            )
          )}
        </div>
      </Panel>

      <Panel visible={inRange(0.75, 1.0)} align="center">
        <div style={{ textAlign: 'center' }}>
          <p style={mkLabel('#ffcc00')}>03 / CONTACT</p>
          <h2 style={headingStyle}>
            Let&apos;s build
            <br />
            something
          </h2>
          
            href="mailto:you@example.com"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              border: '0.5px solid rgba(255,204,0,0.6)',
              borderRadius: '8px',
              color: '#ffcc00',
              fontFamily: 'monospace',
              fontSize: '13px',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              background: 'rgba(255,204,0,0.05)',
            }}
          >
            GET IN TOUCH
          </a>
        </div>
      </Panel>
    </>
  )
}
