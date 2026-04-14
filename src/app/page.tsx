'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll } from '@/lib/scrollStore'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

interface PageState {
  returning: boolean
  loaded: boolean
  savedPos: number
}

export default function Home() {
  const [state, setState] = useState<PageState>({
    returning: false,
    loaded: false,
    savedPos: 0,
  })

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')

    const pos = parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
    if (pos > 0.01) {
      setState({ returning: true, loaded: true, savedPos: pos })
    }

    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (state.loaded && state.returning && state.savedPos > 0.01) {
      restoreScroll(state.savedPos)
    }
  }, [state.loaded, state.returning, state.savedPos])

  const handleComplete = useCallback(() => {
    setState((prev) => ({ ...prev, loaded: true }))
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!state.returning && <LoadingScreen onComplete={handleComplete} />}
      {state.loaded && (
        <>
          <Scene />
          <Overlay />
          <Nav />
        </>
      )}
    </main>
  )
}
