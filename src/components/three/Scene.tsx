'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useScroll, ScrollControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { TrackSegment } from './Track'

const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3, 1.2, 8),
  new THREE.Vector3(3, 1.0, 4),
  new THREE.Vector3(3, 0.9, 0),
  new THREE.Vector3(3, 0.8, -6),
  new THREE.Vector3(4, 0.8, -14),
  new THREE.Vector3(5, 1.0, -20),
])

function CameraRig() {
  const scroll = useScroll()
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())

  useFrame(() => {
    const t = scroll.offset
    CAMERA_PATH.getPoint(Math.min(t, 0.99), targetPos.current)
    CAMERA_PATH.getPoint(Math.min(t + 0.05, 0.99), targetLook.current)

    camera.position.lerp(targetPos.current, 0.08)
    camera.lookAt(targetLook.current)
  })

  return null
}

function LoadingScreen() {
  return (
    <Html center>
      <div style={{
        color: '#00ffff',
        fontFamily: 'monospace',
        fontSize: '13px',
        letterSpacing: '0.15em',
        opacity: 0.8,
      }}>
        LOADING...
      </div>
    </Html>
  )
}

function SceneContents() {
  return (
    <>
      <TrackSegment />
      <CameraRig />
      <Environment preset="night" />
      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
        />
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
      <ScrollControls pages={4} damping={0.3}>
        <Suspense fallback={<LoadingScreen />}>
          <SceneContents />
        </Suspense>
      </ScrollControls>
    </Canvas>
  )
}
