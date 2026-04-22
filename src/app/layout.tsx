import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const baseUrl = 'https://portfolio-nu-amber-sg31cyo8d3.vercel.app'

export const metadata: Metadata = {
  title: 'Ankit Negi — Full Stack Developer & AI Engineer',
  description: 'Portfolio of Ankit Negi, CS undergraduate at IIITDM Kancheepuram. Building production-grade web apps and AI agent systems.',
  keywords: ['Ankit Negi', 'Full Stack Developer', 'AI Engineer', 'React', 'Next.js', 'LangGraph', 'Python'],
  authors: [{ name: 'Ankit Negi', url: 'https://github.com/ankitnegi-dev' }],
  verification: {
    google: 'COp5XC_Hkz2J4PfLpgP6Fk-i_ath25I2yxWHsbbIvc8',
  },
  openGraph: {
    title: 'Ankit Negi — Full Stack Developer & AI Engineer',
    description: 'Building production-grade web apps and AI agent systems.',
    url: baseUrl,
    siteName: 'Ankit Negi Portfolio',
    type: 'website',
    images: [{
      url: baseUrl + '/api/og',
      width: 1200,
      height: 630,
      alt: 'Ankit Negi Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankit Negi — Full Stack Developer & AI Engineer',
    description: 'Building production-grade web apps and AI agent systems.',
    images: [baseUrl + '/api/og'],
    creator: '@ankit_07_negi',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05050a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
