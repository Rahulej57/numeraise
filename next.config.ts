import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.5'],
  async redirects() {
    return [
      {
        source: '/blog/:slug.html',
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/articles',
      },
      {
        source: '/blog/:slug',
        destination: '/articles/:slug',
      },
    ];
  },
};

export default nextConfig;
