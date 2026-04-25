'use client'

import { useEffect, useState } from 'react'

interface Track {
  playing: boolean
  title?: string
  artist?: string
  albumArt?: string
  url?: string
  progress?: number
  duration?: number
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<Track | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetch_ = () => {
      fetch('/api/spotify')
        .then(r => r.json())
        .then(data => {
          if (data.title) {
            setTrack(data)
            setVisible(true)
          }
        })
        .catch(() => {})
    }
    fetch_()
    const interval = setInterval(fetch_, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!track?.title) return null

  const progress = track.progress && track.duration
    ? (track.progress / track.duration) * 100
    : 0

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '24px',
      zIndex: 20,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'auto',
    }}>
      
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(5,5,10,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(29,185,84,0.3)',
          borderRadius: '12px',
          padding: '8px 12px',
          maxWidth: '220px',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(29,185,84,0.7)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(29,185,84,0.3)'}
        >
          {track.albumArt && (
            <img
              src={track.albumArt}
              alt={track.title}
              width={36}
              height={36}
              style={{ borderRadius: '4px', flexShrink: 0 }}
            />
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <p style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#1DB954',
                letterSpacing: '0.1em',
              }}>
                {track.playing ? 'NOW PLAYING' : 'LAST PLAYED'}
              </p>
            </div>
            <p style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '1px',
            }}>{track.title}</p>
            <p style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.4)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{track.artist}</p>
            {track.playing && track.duration && (
              <div style={{
                marginTop: '4px',
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '1px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: progress + '%',
                  background: '#1DB954',
                  borderRadius: '1px',
                }} />
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}
