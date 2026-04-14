'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll } from '@/lib/scrollStore'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

export default function Home() {
  const [isReturning] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return parseFloat(sessionStorage.getItem('portfolioScroll') || '0') > 0.01
  })

  const [savedPos] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
  })

  const [loaded, setLoaded] = useState(isReturning)
  const handleComplete = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')
    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (loaded && isReturning && savedPos > 0.01) {
      restoreScroll(savedPos)
    }
  }, [loaded, isReturning, savedPos])

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
