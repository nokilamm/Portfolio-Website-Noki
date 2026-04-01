import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@paper-design/shaders'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

export default nextConfig
