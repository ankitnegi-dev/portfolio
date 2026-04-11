'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const handleComplete = useCallback(() => setLoaded(true), [])

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <LoadingScreen onComplete={handleComplete} />
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
