'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect, useRef } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll } from '@/lib/scrollStore'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

function getSavedPos(): number {
  if (typeof window === 'undefined') return 0
  return parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
}

export default function Home() {
  const savedPos = useRef(0)
  const returning = useRef(false)
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')

    const pos = getSavedPos()
    savedPos.current = pos
    returning.current = pos > 0.01

    setReady(true)
    if (returning.current) {
      setLoaded(true)
    }

    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (loaded && returning.current && savedPos.current > 0.01) {
      restoreScroll(savedPos.current)
    }
  }, [loaded])

  const handleComplete = useCallback(() => setLoaded(true), [])

  if (!ready) return null

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!returning.current && <LoadingScreen onComplete={handleComplete} />}
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
