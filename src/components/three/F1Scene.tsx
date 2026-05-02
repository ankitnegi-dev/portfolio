'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { scrollProgress } from '@/lib/scrollStore'

const CAR_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.2, 7),
  new THREE.Vector3(0, 0.2, 3),
  new THREE.Vector3(0, 0.2, -1),
  new THREE.Vector3(0, 0.2, -7),
  new THREE.Vector3(0, 0.2, -15),
  new THREE.Vector3(0, 0.2, -23),
  new THREE.Vector3(0, 0.2, -33),
  new THREE.Vector3(0, 0.2, -43),
  new THREE.Vector3(0, 0.2, -53),
])

function TrackInstance({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/models/track.glb')
  const cloned = scene.clone()

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#1a1a1f',
          roughness: 0.9,
          metalness: 0.1,
        })
        mesh.receiveShadow = true
      }
    })
  }, [cloned])

  return (
    <primitive
      object={cloned}
      scale={[0.12, 0.06, 0.2]}
      position={position}
      rotation={[0, Math.PI, 0]}
    />
  )
}

export function Track() {
  const segments: [number, number, number][] = [
    [0, -0.5, 5],
    [0, -0.5, -10],
    [0, -0.5, -25],
    [0, -0.5, -40],
    [0, -0.5, -55],
  ]

  return (
    <>
      {segments.map((pos, i) => (
        <TrackInstance key={i} position={pos} />
      ))}
    </>
  )
}

export function Car() {
  const { scene } = useGLTF('/models/car.glb')
  const groupRef = useRef<THREE.Group>(null)
  const prevT = useRef(0)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.envMapIntensity = 0.5
        }
      }
    })
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    const t = scrollProgress.current
    const carT = Math.min(t * 0.95, 0.94)

    const pos = new THREE.Vector3()
    const look = new THREE.Vector3()
    CAR_PATH.getPoint(carT, pos)
    CAR_PATH.getPoint(Math.min(carT + 0.04, 0.99), look)

    groupRef.current.position.lerp(pos, 0.1)

    const dir = look.clone().sub(pos).normalize()
    if (dir.length() > 0.001) {
      const targetAngle = Math.atan2(dir.x, dir.z)
      groupRef.current.rotation.y +=
        (targetAngle - groupRef.current.rotation.y) * 0.1
    }

    const speed = Math.abs(t - prevT.current) * 60
    prevT.current = t
    groupRef.current.position.y +=
      Math.sin(Date.now() * 0.008) * 0.01 * Math.min(speed + 0.2, 1)
  })

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
      <pointLight color="#ff6600" intensity={0.4} distance={2} position={[0.5, 0.3, -0.8]} />
      <pointLight color="#ff6600" intensity={0.4} distance={2} position={[-0.5, 0.3, -0.8]} />
      <pointLight color="#ffffff" intensity={1} distance={4} position={[0, 0.4, 0.8]} />
    </group>
  )
}

export function NeonTrackLights() {
  return (
    <>
      <pointLight color="#00ffff" intensity={10} distance={18} position={[0, 3, 0]} />
      <pointLight color="#ff00aa" intensity={10} distance={18} position={[0, 3, -18]} />
      <pointLight color="#7F77DD" intensity={8} distance={18} position={[0, 3, -36]} />
      <pointLight color="#00ffff" intensity={8} distance={18} position={[0, 3, -52]} />
      <ambientLight intensity={0.06} />
    </>
  )
}
