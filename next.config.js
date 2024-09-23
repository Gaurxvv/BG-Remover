/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  images: {
    domains: ['fal.media'],
  },
}

module.exports = nextConfig