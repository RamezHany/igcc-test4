const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['raw.githubusercontent.com', 'github.com' , 'res.cloudinary.com'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/RamezHany/IGCCe-tr/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/partners',
        destination: 'https://raw.githubusercontent.com/RamezHany/IGCCe-tr/main/partners.json',
      },
    ]
  },
  // Optimize static generation
  staticPageGenerationTimeout: 120, // Increase timeout to 120 seconds
  // Configure Incremental Static Regeneration (ISR) defaults
  experimental: {
    // Enable optimized ISR caching
    isrMemoryCacheSize: 50, // Cache up to 50 ISR pages in memory
  },
  // Optimize production build
  swcMinify: true, // Use SWC for minification (faster than Terser)
  compiler: {
    // Optimize React code
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

module.exports = nextConfig
