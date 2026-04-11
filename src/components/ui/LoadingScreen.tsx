'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    const steps = [10, 25, 45, 60, 78, 90, 100]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i])
        i++
      } else {
        clearInterval(interval)
        setPhase('done')
        setTimeout(onComplete, 600)
      }
    }, 280)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#05050a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      opacity: phase === 'done' ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: phase === 'done' ? 'none' : 'auto',
    }}>
      <div style={{ textAlign: 'center', width: '260px' }}>
        <p style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.4em',
          color: '#00ffff',
          marginBottom: '32px',
          opacity: 0.8,
        }}>INITIALISING SCENE</p>

        <div style={{
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px',
          marginBottom: '12px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: progress + '%',
            background: 'linear-gradient(90deg, #534AB7, #00ffff)',
            transition: 'width 0.25s ease',
            borderRadius: '1px',
          }} />
        </div>

        <p style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.2em',
        }}>{progress}%</p>

        <p style={{
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.15em',
          marginTop: '24px',
        }}>ANKIT NEGI / PORTFOLIO</p>
      </div>
    </div>
  )
}
