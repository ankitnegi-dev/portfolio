'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll } from '@/lib/scrollStore'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isReturning, setIsReturning] = useState(false)
  const [savedPos, setSavedPos] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')

    const pos = parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
    const returning = pos > 0.01

    setIsReturning(returning)
    setSavedPos(pos)
    setLoaded(returning)
    setMounted(true)

    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (loaded && isReturning && savedPos > 0.01) {
      restoreScroll(savedPos)
    }
  }, [loaded, isReturning, savedPos])

  const handleComplete = useCallback(() => setLoaded(true), [])

  if (!mounted) return (
    <div style={{
      width: '100vw', height: '100vh', background: '#05050a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#00ffff', fontFamily: 'monospace', fontSize: '13px',
      letterSpacing: '0.15em',
    }}>
      LOADING...
    </div>
  )

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!isReturning && <LoadingScreen onComplete={handleComplete} />}
      {loaded && (
        <>
          <Scene />
          <Overlay />
          <Nav />
        </>
      )}
    </main>
  )
}
