'use client'

import { useEffect } from 'react'
import type { Project } from '@/lib/projects'

export default function ProjectClient({ project }: { project: Project }) {
  const color = project.color
  const accent = project.accentColor

  useEffect(() => {
    document.body.classList.add('project-page')
    document.body.classList.remove('scene-page')
    return () => document.body.classList.remove('project-page')
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#05050a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Sticky nav */}
      <nav style={{
        padding: '20px 32px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(5,5,10,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" style={{
          fontFamily: 'monospace', fontSize: '12px',
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)' }}
        >
          ← BACK
        </a>
        <span style={{
          fontFamily: 'monospace', fontSize: '11px',
          color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em',
        }}>
          ANKIT NEGI / PROJECTS
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          {project.links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace', fontSize: '11px', color,
                textDecoration: 'none', padding: '6px 14px',
                border: '0.5px solid ' + color + '66',
                borderRadius: '4px', background: accent,
                letterSpacing: '0.1em',
              }}>
              {link.label} ↗
            </a>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 32px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: 'monospace', fontSize: '11px',
                padding: '3px 10px',
                border: '0.5px solid ' + color + '55',
                borderRadius: '4px', color, background: accent,
              }}>{tag}</span>
            ))}
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.05,
            margin: '0 0 16px', letterSpacing: '-0.02em',
          }}>{project.name}</h1>
          <p style={{
            fontSize: '20px', color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6, maxWidth: '600px', margin: '0 0 16px',
          }}>{project.tagline}</p>
          <p style={{
            fontFamily: 'monospace', fontSize: '11px',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em',
          }}>{project.date}</p>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: '64px' }} />

        {/* Overview */}
        <section style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.25em', color, marginBottom: '16px', textTransform: 'uppercase' }}>Overview</p>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85 }}>{project.description}</p>
        </section>

        {/* Problem / Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '64px' }}>
          <section style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', textTransform: 'uppercase' }}>Problem</p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{project.problem}</p>
          </section>
          <section style={{ background: accent, border: '0.5px solid ' + color + '44', borderRadius: '12px', padding: '28px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.25em', color, marginBottom: '12px', textTransform: 'uppercase' }}>Solution</p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>{project.solution}</p>
          </section>
        </div>

        {/* Key Features */}
        <section style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.25em', color, marginBottom: '24px', textTransform: 'uppercase' }}>Key Features</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {project.features.map((feature, i) => (
              <div key={i} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.02)',
                border: '0.5px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color, minWidth: '24px', marginTop: '2px', opacity: 0.7 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.25em', color, marginBottom: '24px', textTransform: 'uppercase' }}>Tech Stack</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {project.tech.map((group) => (
              <div key={group.category} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '20px',
              }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', textTransform: 'uppercase' }}>{group.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {group.items.map((item) => (
                    <span key={item} style={{
                      fontFamily: 'monospace', fontSize: '12px',
                      padding: '3px 8px', background: accent,
                      border: '0.5px solid ' + color + '44',
                      borderRadius: '4px', color: 'rgba(255,255,255,0.8)',
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {project.links.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block', padding: '14px 32px',
                background: color, color: '#ffffff',
                fontFamily: 'monospace', fontSize: '13px',
                letterSpacing: '0.15em', textDecoration: 'none',
                borderRadius: '8px', fontWeight: 600,
              }}>
              {link.label} ↗
            </a>
          ))}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{
            display: 'inline-block', padding: '14px 32px',
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'monospace', fontSize: '13px',
            letterSpacing: '0.15em', textDecoration: 'none',
            borderRadius: '8px',
          }}>← Back to portfolio</a>
        </div>
      </div>
    </main>
  )
}
