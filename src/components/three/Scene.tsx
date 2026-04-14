'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useScroll, ScrollControls } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { TrackSegment } from './Track'
import { Skills3D } from './Skills'
import { scrollProgress, scrollEl } from '@/lib/scrollStore'

const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3, 1.2, 8),
  new THREE.Vector3(3, 1.0, 4),
  new THREE.Vector3(3, 0.9, 0),
  new THREE.Vector3(3, 0.8, -6),
  new THREE.Vector3(4, 0.8, -14),
  new THREE.Vector3(4, 0.9, -22),
  new THREE.Vector3(3, 1.0, -32),
  new THREE.Vector3(3, 1.0, -42),
  new THREE.Vector3(3, 1.0, -52),
])

function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  const lastT = useRef(0)

  useFrame(() => {
    const t = scroll.offset
    const delta = Math.abs(t - lastT.current)
    lastT.current = t
    scrollProgress.current = t
    sessionStorage.setItem('portfolioScroll', String(t))
    CAMERA_PATH.getPoint(Math.min(t, 0.99), targetPos.current)
    CAMERA_PATH.getPoint(Math.min(t + 0.05, 0.99), targetLook.current)
    // If jump > 0.1 (nav click or back button), teleport instantly
    const lerpFactor = delta > 0.05 ? 1 : 0.08
    camera.position.lerp(targetPos.current, lerpFactor)
    camera.lookAt(targetLook.current)
  })

  return null
}


function ScrollCapture() {
  useEffect(() => {
    const attempt = (tries: number) => {
      const containers = Array.from(document.querySelectorAll('div'))
      const scrollable = containers.find(
        (div) =>
          div.scrollHeight > div.clientHeight + 50 &&
          div !== document.body &&
          div.clientHeight > 100
      )
      if (scrollable) {
        scrollEl.current = scrollable as HTMLDivElement
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 100)
      }
    }
    attempt(20)
  }, [])
  return null
}

function SceneContents() {
  return (
    <>
      <ScrollCapture />
      <TrackSegment />
      <Skills3D />
      <CameraRig />
      <Environment preset="night" />
      <EffectComposer>
        <Bloom intensity={1.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0008, 0.0008)} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [3, 1.2, 8], fov: 75 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
      style={{ background: '#05050a' }}
    >
      <ScrollControls pages={5} damping={0.001}>
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </ScrollControls>
    </Canvas>
  )
}
