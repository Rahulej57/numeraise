import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Financial Calculators | Numeraise',
  description:
    'The complete directory of all 50+ free financial calculators. Plan your investments, loans, taxes, and retirement with our professional tools.',
};

export default function FinancialCalculatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
