'use client'

import { useEffect, useState, useRef } from 'react'
import { scrollProgress } from '@/lib/scrollStore'

interface Stats {
  repos: number
  stars: number
  commits: number
  hackathons: number
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, active])
  return count
}

function StatCard({
  value,
  label,
  suffix = '',
  color,
  active,
}: {
  value: number
  label: string
  suffix?: string
  color: string
  active: boolean
}) {
  const count = useCountUp(value, 1200, active)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '0.5px solid ' + color + '33',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: '6px',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function GitHubStats() {
  const [p, setP] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const rafRef = useRef<number>(0)
  const fetched = useRef(false)

  useEffect(() => {
    const tick = () => {
      setP(scrollProgress.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    fetch('https://api.github.com/users/ankitnegi-dev')
      .then((r) => r.json())
      .then((data) => {
        setStats({
          repos: data.public_repos ?? 10,
          stars: 0,
          commits: 200,
          hackathons: 2,
        })
      })
      .catch(() => {
        setStats({ repos: 10, stars: 12, commits: 200, hackathons: 2 })
      })
  }, [])

  const visible = p >= 0.13 && p <= 0.28

  if (!stats) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '5vw',
      maxWidth: '440px',
      width: '90vw',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
      pointerEvents: 'none',
      zIndex: 10,
      display: 'flex',
      gap: '8px',
    }}>
      <StatCard value={stats.repos} label="Repos" color="#00ffff" active={visible} />
      <StatCard value={200} label="Commits" suffix="+" color="#7F77DD" active={visible} />
      <StatCard value={2} label="Hackathons" color="#ff00aa" active={visible} />
      <StatCard value={4} label="Projects" color="#ffcc00" active={visible} />
    </div>
  )
}
