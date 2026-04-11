'use client'

import dynamic from 'next/dynamic'
import Overlay from '@/components/ui/Overlay'

const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#05050a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ffff', fontFamily: 'monospace', fontSize: '13px' }}>
      LOADING...
    </div>
  ),
})

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Scene />
      <Overlay />
    </main>
  )
}
