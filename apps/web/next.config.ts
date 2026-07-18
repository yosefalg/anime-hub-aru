/**
 * AniVerse Web - Next.js Configuration
 * 
 * Enterprise-grade configuration for:
 * - Internationalization (i18n)
 * - Image Optimization (Remote Patterns)
 * - Security Headers (CSP, XSS, etc.)
 * - Performance Optimizations
 * - Development Proxies
 */

import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Initialize next-intl plugin
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Transpile packages that use ESM or need to be compiled
  transpilePackages: [
    '@aniverse/database',
    'lucide-react',
    'framer-motion',
    'video.js',
  ],

  // ============================================================================
  // Image Optimization
  // ============================================================================
  images: {
    remotePatterns: [
      // Cloudflare R2 (Production Storage)
      {
        protocol: 'https',
        hostname: 'cdn.aniverse.com',
        pathname: '/**',
      },
      // Supabase Storage (Alternative Production Storage)
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // MinIO (Local Development Storage)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      // External Media Providers (TMDB, AniList, MAL, etc.)
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.ak.crunchyroll.com',
        pathname: '/**',
      },
    ],
    // Optimize images for faster loading
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ============================================================================
  // Security Headers (Enterprise Grade)
  // ============================================================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.com https://*.google-analytics.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' blob: data: https:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://*.aniverse.com https://*.supabase.co https://*.clerk.com;
              media-src 'self' blob: https:;
              frame-src 'self' https://*.youtube.com https://*.google.com;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },

  // ============================================================================
  // Development Rewrites (Proxy API to avoid CORS)
  // ============================================================================
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
      {
        source: '/graphql',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/graphql`,
      },
    ];
  },

  // ============================================================================
  // Experimental & Performance Optimizations
  // ============================================================================
  experimental: {
    // Optimize package imports for smaller bundle sizes
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'react-hook-form',
      '@tanstack/react-query',
    ],
    // Enable scroll restoration
    scrollRestoration: true,
    // Optimize CSS
    optimizeCss: true,
  },

  // ============================================================================
  // Webpack Configuration
  // ============================================================================
  webpack(config, { isServer }) {
    // Add support for video.js and other specific modules if needed
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // ============================================================================
  // Compression
  // ============================================================================
  compress: true,

  // ============================================================================
  // Powered By Header
  // ============================================================================
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
