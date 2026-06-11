import { RetirementCalculatorClient } from '@/components/calculators/retirement-calculator-client';

export const metadata = {
  title: 'Retirement Calculator | Plan Your FIRE Corpus',
  description:
    'Calculate exactly how much money you need to retire comfortably, adjusted for inflation, and the monthly SIP required to reach your goal.',
};

export default function RetirementCalculatorPage() {
  return (
    <>
      <RetirementCalculatorClient />
    </>
  );
}
