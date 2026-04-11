import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ankit Negi — Full Stack Developer & AI Engineer',
  description: 'Portfolio of Ankit Negi, CS undergraduate at IIITDM Kancheepuram. Building production-grade web apps and AI agent systems.',
  keywords: ['Ankit Negi', 'Full Stack Developer', 'AI Engineer', 'React', 'Next.js', 'LangGraph'],
  authors: [{ name: 'Ankit Negi', url: 'https://github.com/ankitnegi-dev' }],
  openGraph: {
    title: 'Ankit Negi — Full Stack Developer & AI Engineer',
    description: 'Building production-grade web apps and AI agent systems.',
    url: 'https://portfolio-nu-amber-sg31cyo8d3.vercel.app',
    siteName: 'Ankit Negi Portfolio',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#05050a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
