import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  output: 'standalone',
  images: {
    remotePatterns: [],
  },
}

export default withPayload(nextConfig)
