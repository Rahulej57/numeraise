import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.5'],
  async redirects() {
    return [
      {
        source: '/articles/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/articles',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/calculators/income-tax-old-vs-new-regime',
        destination: '/calculators/income-tax-calculator',
        permanent: true,
      },
      {
        source: '/financial-calculators',
        destination: '/calculators',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
