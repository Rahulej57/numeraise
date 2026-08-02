import type { Metadata } from 'next';

/**
 * DEAD ROUTE. This page re-exported the term-insurance calculator verbatim, so
 * two URLs served byte-identical content. next.config.ts now permanently
 * redirects /calculators/life-insurance-calculator to
 * /calculators/term-insurance-calculator, which means nothing here is ever
 * served.
 *
 * The canonical and noindex below are belt-and-braces in case that redirect is
 * ever removed. Safe to delete this whole directory along with the redirect once
 * you are confident no external links point at the old path.
 */
export const metadata: Metadata = {
  title: 'Life Insurance Calculator',
  robots: { index: false, follow: true },
  alternates: { canonical: '/calculators/term-insurance-calculator' },
};

export default function LifeInsuranceCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
