/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // INTERNAL_API_URL is used server-side only (Docker container name).
    // In development this defaults to localhost:3001.
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001'
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
