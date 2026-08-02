import { Metadata } from 'next';

/**
 * DEAD ROUTE -- next.config.ts permanently redirects /financial-calculators to
 * /calculators, so nothing here is ever served. noindex plus a canonical to the
 * live hub in case that redirect is ever removed.
 */
export const metadata: Metadata = {
  title: 'All Financial Calculators',
  robots: { index: false, follow: true },
  alternates: { canonical: '/calculators' },
};

export default function FinancialCalculatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
