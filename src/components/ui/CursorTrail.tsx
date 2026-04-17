'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const COLORS = ['#00ffff', '#ff00aa', '#7F77DD', '#ffcc00', '#00ff88']

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 3) {
        const count = Math.min(Math.floor(dist / 4), 6)
        for (let i = 0; i < count; i++) {
          const color = COLORS[Math.floor(Math.random() * COLORS.length)]
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            life: 1,
            maxLife: 0.6 + Math.random() * 0.4,
            size: 1.5 + Math.random() * 2.5,
            color,
          })
        }
        lastPos.current = { x: e.clientX, y: e.clientY }
      }
    }

    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter((p) => p.life > 0)

      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        p.life -= 0.025 / p.maxLife

        const alpha = Math.max(0, p.life)
        const size = p.size * alpha

        ctx.save()
        ctx.globalAlpha = alpha * 0.8
        ctx.fillStyle = p.color
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  )
}
