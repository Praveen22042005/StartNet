/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-image-domain.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig