import type { Metadata } from 'next';
import { CALCULATOR_SEO } from '@/config/calculator-seo';
import { SITE_URL } from '@/config/site';

const SLUG = 'tds-calculator';
const seo = CALCULATOR_SEO[SLUG];

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: `/calculators/${SLUG}` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/calculators/${SLUG}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
};

export default function TdsCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}