import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // output: 'standalone', // disabled - incompatible with `next start`
  images: {
    remotePatterns: [],
  },
}

export default withPayload(nextConfig)
