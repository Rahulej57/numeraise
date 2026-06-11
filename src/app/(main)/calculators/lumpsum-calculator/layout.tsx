import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lumpsum Calculator | Calculate Mutual Fund Bulk Investment Returns',
  description:
    'Use our free Lumpsum Calculator to forecast the future value of your one-time bulk investments. Visualize compounding growth over years and decades.',
  keywords: [
    'lumpsum calculator',
    'mutual fund calculator',
    'one time investment',
    'compound interest calculator',
    'investment returns',
    'wealth creation',
  ],
  alternates: {
    canonical: '/calculators/lumpsum-calculator',
  },
};

export default function LumpsumCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
