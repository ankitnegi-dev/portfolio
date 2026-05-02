import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 30

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1'

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) return null

  const basic = btoa(clientId + ':' + clientSecret)
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + basic,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })
  const data = await res.json()
  return data.access_token as string
}

export async function GET() {
  try {
    const token = await getAccessToken()
    if (!token) {
      return NextResponse.json({ playing: false })
    }

    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: 'Bearer ' + token },
    })

    if (res.status === 204 || res.status === 404) {
      const recent = await fetch(RECENTLY_PLAYED_URL, {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (!recent.ok) return NextResponse.json({ playing: false })
      const data = await recent.json()
      const track = data.items?.[0]?.track
      if (!track) return NextResponse.json({ playing: false })
      return NextResponse.json({
        playing: false,
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(', '),
        albumArt: track.album.images[2]?.url,
        url: track.external_urls.spotify,
      })
    }

    if (!res.ok) return NextResponse.json({ playing: false })

    const data = await res.json()
    if (!data.item) return NextResponse.json({ playing: false })

    return NextResponse.json({
      playing: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
      albumArt: data.item.album.images[2]?.url,
      url: data.item.external_urls.spotify,
      progress: data.progress_ms,
      duration: data.item.duration_ms,
    })
  } catch {
    return NextResponse.json({ playing: false })
  }
}
