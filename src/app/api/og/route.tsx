import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px',
        background: '#05050a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Speed lines fanning from bottom-center */}
        {[
          { rotate: -50, color: '#ff3300' },
          { rotate: -35, color: '#ffcc00' },
          { rotate: -20, color: '#ff3300' },
          { rotate: -5,  color: '#ffcc00' },
          { rotate: 5,   color: '#ff3300' },
          { rotate: 20,  color: '#ffcc00' },
          { rotate: 35,  color: '#ff3300' },
          { rotate: 50,  color: '#ffcc00' },
        ].map((line, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: '180px', left: '600px',
            width: '3px', height: '500px',
            background: line.color,
            transformOrigin: 'bottom center',
            transform: 'rotate(' + line.rotate + 'deg)',
            opacity: 0.75,
          }} />
        ))}

        {/* Cyan left barrier */}
        <div style={{
          position: 'absolute', bottom: '120px', left: '-60px',
          width: '500px', height: '14px',
          background: '#00ffff',
          transform: 'rotate(-10deg)',
          boxShadow: '0 0 30px #00ffff',
        }} />

        {/* Magenta right barrier */}
        <div style={{
          position: 'absolute', bottom: '120px', right: '-60px',
          width: '500px', height: '14px',
          background: '#ff00aa',
          transform: 'rotate(10deg)',
          boxShadow: '0 0 30px #ff00aa',
        }} />

        {/* Dark overlay so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5,5,10,0.6)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', padding: '0 80px',
        }}>
          <p style={{
            fontSize: '18px', letterSpacing: '0.4em',
            color: '#00ffff', margin: '0 0 24px',
            fontFamily: 'monospace',
          }}>FULL STACK DEVELOPER · AI ENGINEER</p>

          <p style={{
            fontSize: '100px', fontWeight: 800,
            color: '#ffffff', margin: '0 0 20px',
            letterSpacing: '-0.03em', lineHeight: 1,
            textShadow: '0 0 80px rgba(127,119,221,0.9)',
            fontFamily: 'sans-serif',
          }}>Ankit Negi</p>

          <p style={{
            fontSize: '24px', color: 'rgba(255,255,255,0.6)',
            margin: '0 0 40px', fontFamily: 'sans-serif',
          }}>Building production-grade web apps and AI agent systems</p>

          <div style={{ display: 'flex', gap: '12px' }}>
            {['React', 'Next.js', 'LangGraph', 'Python', 'Supabase'].map((tag) => (
              <div key={tag} style={{
                padding: '8px 18px',
                border: '1px solid rgba(0,255,255,0.5)',
                borderRadius: '6px',
                color: '#00ffff',
                fontSize: '15px',
                letterSpacing: '0.05em',
                background: 'rgba(0,255,255,0.08)',
                fontFamily: 'monospace',
              }}>{tag}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
