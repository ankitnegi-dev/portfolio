'use client'

import dynamic from 'next/dynamic'
import { useReducer, useCallback, useEffect } from 'react'
import Overlay from '@/components/ui/Overlay'
import Nav from '@/components/ui/Nav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { restoreScroll } from '@/lib/scrollStore'
import ChatAssistant from '@/components/ui/ChatAssistant'

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false })

interface State {
  mounted: boolean
  isReturning: boolean
  savedPos: number
  loaded: boolean
}

type Action =
  | { type: 'INIT'; returning: boolean; pos: number }
  | { type: 'LOADED' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':
      return {
        mounted: true,
        isReturning: action.returning,
        savedPos: action.pos,
        loaded: action.returning,
      }
    case 'LOADED':
      return { ...state, loaded: true }
    default:
      return state
  }
}

const initial: State = { mounted: false, isReturning: false, savedPos: 0, loaded: false }

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    document.body.classList.add('scene-page')
    document.body.classList.remove('project-page')
    const pos = parseFloat(sessionStorage.getItem('portfolioScroll') || '0')
    dispatch({ type: 'INIT', returning: pos > 0.01, pos })
    return () => document.body.classList.remove('scene-page')
  }, [])

  useEffect(() => {
    if (state.loaded && state.isReturning && state.savedPos > 0.01) {
      restoreScroll(state.savedPos)
    }
  }, [state.loaded, state.isReturning, state.savedPos])

  const handleComplete = useCallback(() => dispatch({ type: 'LOADED' }), [])

  if (!state.mounted) return (
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
      {!state.isReturning && <LoadingScreen onComplete={handleComplete} />}
      {state.loaded && (
        <>
          <Scene />
          <Overlay />
          <Nav />
          <ChatAssistant />
        </>
      )}
    </main>
  )
}
