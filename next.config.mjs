/** @type {import('next').NextConfig} */
// Force Cache Bust
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
