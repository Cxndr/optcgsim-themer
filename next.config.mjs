/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Node.js modules for browser compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        buffer: false,
        stream: false,
        util: false,
      };
    }
    return config;
  },
  // Enhanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
      },
    ],
    // Disable image optimization for month (vercel limits hit)
    unoptimized: true,
    // Configure image formats for better compression
    formats: ['image/webp', 'image/avif'],
    // Set reasonable limits
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for longer
    minimumCacheTTL: 31536000, // 1 year
  },

  // Enable experimental features for better caching
  experimental: {
    // Enable partial pre-rendering for better performance
    ppr: false, // Set to true when ready for beta features
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'react-icons'],
    // Server actions are enabled by default in NextJS 15
  },

  // Optimize compilation
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enhanced caching headers for static assets
  async headers() {
    return [
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 1 day
          },
        ],
      },
    ];
  },

  // Enable compression for better performance
  compress: true,

  // Generate ETags for better caching
  generateEtags: true,

  // Optimize PoweredByHeader
  poweredByHeader: false,

  // Enable static optimization
  output: 'standalone',
};

export default nextConfig;

