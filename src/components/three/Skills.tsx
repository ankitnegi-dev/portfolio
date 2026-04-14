'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface SkillPill {
  label: string
  position: [number, number, number]
  color: string
  emissive: string
  delay: number
}

const skillGroups = [
  {
    category: 'Frontend',
    color: '#00ffff',
    emissive: '#004444',
    z: -24,
    skills: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'R3F'],
  },
  {
    category: 'Backend',
    color: '#ff00aa',
    emissive: '#440022',
    z: -30,
    skills: ['Node.js', 'FastAPI', 'Python', 'REST API', 'WebSockets', 'SSE'],
  },
  {
    category: 'AI & Agents',
    color: '#7F77DD',
    emissive: '#1a1860',
    z: -36,
    skills: ['LangGraph', 'Groq API', 'LLaMA 3.3 70B', 'RAG Pipeline', 'RLHF', 'Prompt Eng.'],
  },
  {
    category: 'Database',
    color: '#ffcc00',
    emissive: '#443300',
    z: -42,
    skills: ['PostgreSQL', 'Supabase', 'pgvector', 'Redis', 'SQLAlchemy', 'RLS'],
  },
  {
    category: 'DevOps',
    color: '#00ff88',
    emissive: '#004422',
    z: -48,
    skills: ['Docker', 'GitHub Actions', 'Vercel', 'Apache Kafka', 'Linux', 'CI/CD'],
  },
]

function SkillPillMesh({
  label,
  position,
  color,
  emissive,
  delay,
}: SkillPill) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime()
      groupRef.current.position.y =
        position[1] + Math.sin(t * 0.8 + delay) * 0.08
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity =
        0.4 + Math.sin(clock.getElapsedTime() * 1.2 + delay) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <RoundedBox args={[label.length * 0.09 + 0.3, 0.24, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          ref={matRef}
          color="#050510"
          emissive={emissive}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.085}
        color={color}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  )
}

function CategoryLabel({
  label,
  position,
  color,
}: {
  label: string
  position: [number, number, number]
  color: string
}) {
  return (
    <Text
      position={position}
      fontSize={0.14}
      color={color}
      anchorX="center"
      anchorY="middle"
      font={undefined}
      fillOpacity={0.6}
    >
      {label.toUpperCase()}
    </Text>
  )
}

export function Skills3D() {
  const pills = useMemo<SkillPill[]>(() => {
    const result: SkillPill[] = []
    skillGroups.forEach((group) => {
      group.skills.forEach((skill, i) => {
        
        const col3 = i % 3
        const row3 = Math.floor(i / 3)
        const side = i % 2 === 0 ? -1 : 1
        const xSpread = col3 === 0 ? -4 : col3 === 1 ? 0 : 4
        const yOffset = row3 * 0.7
        result.push({
          label: skill,
          position: [3 + xSpread + side * 0.5, 1.8 - yOffset, group.z + (i % 3) * 1.5],
          color: group.color,
          emissive: group.emissive,
          delay: i * 0.4 + group.z * 0.1,
        })
      })
    })
    return result
  }, [])

  return (
    <group>
      {skillGroups.map((group) => (
        <CategoryLabel
          key={group.category}
          label={group.category}
          position={[3, 1.7, group.z]}
          color={group.color}
        />
      ))}
      {pills.map((pill, i) => (
        <SkillPillMesh key={i} {...pill} />
      ))}

      {/* Ambient glow lights per category */}
      {skillGroups.map((group) => (
        <pointLight
          key={group.category}
          position={[3, 1.5, group.z]}
          color={group.color}
          intensity={3}
          distance={6}
        />
      ))}
    </group>
  )
}
