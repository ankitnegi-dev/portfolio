'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TrackSegment() {
  const arrowCount = 8

  return (
    <>
      {/* Dark asphalt ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -0.01, -7]}>
        <planeGeometry args={[14, 30]} />
        <meshStandardMaterial color="#111114" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Red kerb left */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0, -7]}>
        <planeGeometry args={[1, 30]} />
        <meshStandardMaterial color="#cc2200" roughness={0.8} />
      </mesh>

      {/* Red kerb right */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.5, 0, -7]}>
        <planeGeometry args={[1, 30]} />
        <meshStandardMaterial color="#cc2200" roughness={0.8} />
      </mesh>

      {/* Left neon barrier */}
      <mesh position={[-1, 0.3, -7]}>
        <boxGeometry args={[0.15, 0.6, 30]} />
        <meshStandardMaterial
          color="#001a1a"
          emissive="#00ffff"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Right neon barrier */}
      <mesh position={[7, 0.3, -7]}>
        <boxGeometry args={[0.15, 0.6, 30]} />
        <meshStandardMaterial
          color="#1a0010"
          emissive="#ff00aa"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Left arrows */}
      {Array.from({ length: arrowCount }).map((_, i) => (
        <NeonArrow
          key={`left-${i}`}
          position={[-0.6, 0.3, -2 - i * 3]}
          color="#00ffff"
          direction="left"
        />
      ))}

      {/* Right arrows */}
      {Array.from({ length: arrowCount }).map((_, i) => (
        <NeonArrow
          key={`right-${i}`}
          position={[6.6, 0.3, -2 - i * 3]}
          color="#ff00aa"
          direction="right"
        />
      ))}

      <SpeedLines />

      <pointLight position={[3, 3, 0]} color="#ffffff" intensity={8} distance={15} />
      <pointLight position={[3, 2, -10]} color="#00ffff" intensity={15} distance={20} />
      <pointLight position={[3, 2, -20]} color="#ff00aa" intensity={15} distance={20} />
      <ambientLight intensity={0.05} />
    </>
  )
}

function NeonArrow({
  position,
  color,
  direction,
}: {
  position: [number, number, number]
  color: string
  direction: 'left' | 'right'
}) {
  const d = direction === 'left' ? -1 : 1
  const arrowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (arrowRef.current) {
      const mat = arrowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity =
        0.6 + Math.sin(clock.getElapsedTime() * 2 + position[2]) * 0.4
    }
  })

  return (
    <mesh ref={arrowRef} position={position} rotation={[0, d * 0.3, 0]}>
      <boxGeometry args={[0.4, 0.08, 0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  )
}

function SpeedLines() {
  const lines = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        x: 0.5 + i * 1.1,
        color: i % 2 === 0 ? '#ff3300' : '#ffcc00',
        width: 0.06 + (i * 0.01),
      })),
    []
  )

  return (
    <>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, 3.5, -7]}>
          <boxGeometry args={[line.width, 0.02, 28]} />
          <meshStandardMaterial
            color={line.color}
            emissive={line.color}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  )
}
