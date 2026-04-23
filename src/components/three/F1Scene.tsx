'use client'

import { useRef, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { scrollProgress } from '@/lib/scrollStore'

const CAR_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3, 0.2, 7),
  new THREE.Vector3(3, 0.2, 3),
  new THREE.Vector3(3, 0.2, -1),
  new THREE.Vector3(3, 0.2, -7),
  new THREE.Vector3(4, 0.2, -15),
  new THREE.Vector3(4, 0.2, -23),
  new THREE.Vector3(3, 0.2, -33),
  new THREE.Vector3(3, 0.2, -43),
  new THREE.Vector3(3, 0.2, -53),
])

export function Track() {
  const { scene } = useGLTF('/models/track.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => {
            if (m instanceof THREE.MeshStandardMaterial) {
              m.roughness = 0.8
              m.metalness = 0.2
            }
          })
        }
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <primitive
      object={scene}
      scale={[0.08, 0.08, 0.08]}
      position={[3, -0.8, -25]}
      rotation={[0, 0, 0]}
    />
  )
}

export function Car() {
  const { scene } = useGLTF('/models/car.glb')
  const groupRef = useRef<THREE.Group>(null)
  const prevT = useRef(0)

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true
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
      <pointLight color="#ff4400" intensity={6} distance={4} position={[0.5, 0.5, -1]} />
      <pointLight color="#ff4400" intensity={6} distance={4} position={[-0.5, 0.5, -1]} />
      <pointLight color="#ffffff" intensity={10} distance={8} position={[0, 0.5, 1]} />
    </group>
  )
}

export function NeonTrackLights() {
  return (
    <>
      <pointLight color="#00ffff" intensity={12} distance={20} position={[3, 3, 0]} />
      <pointLight color="#ff00aa" intensity={12} distance={20} position={[3, 3, -20]} />
      <pointLight color="#7F77DD" intensity={10} distance={20} position={[3, 3, -40]} />
      <ambientLight intensity={0.06} />
    </>
  )
}
