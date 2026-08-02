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
      // life-insurance-calculator/page.tsx re-exported the term-insurance
      // component verbatim, so two URLs served byte-identical content. One
      // canonical page per piece of content.
      {
        source: '/calculators/life-insurance-calculator',
        destination: '/calculators/term-insurance-calculator',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
