'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll, instantScrollTo } from '@/lib/scrollStore'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

export default function Home() {
  const [returning, setReturning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [savedPos, setSavedPos] = useState(0)

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')

    const pos = parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
    if (pos > 0.01) {
      setReturning(true)
      setSavedPos(pos)
      setLoaded(true)
    }

    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (loaded && returning && savedPos > 0.01) {
      restoreScroll(savedPos)
    }
  }, [loaded, returning, savedPos])

  const handleComplete = useCallback(() => setLoaded(true), [])

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!returning && <LoadingScreen onComplete={handleComplete} />}
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
