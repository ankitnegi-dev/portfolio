import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'gsap',
      'framer-motion',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
