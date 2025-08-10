/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Ensure proper server file generation
  experimental: {
    outputFileTracingRoot: undefined,
  },
  
  // Ignore ESLint errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
  
  // Enable compression
  compress: true,
  
  // SWC minification is enabled by default in Next.js 15
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;