import { CagrCalculatorClient } from '@/components/calculators/cagr-calculator-client';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';

export const metadata = {
  title: 'CAGR Calculator | Calculate Compound Annual Growth Rate',
  description:
    'Calculate the Compound Annual Growth Rate (CAGR) of your investments to understand annualized returns over any time period.',
};

export default function CagrCalculatorPage() {
  return (
    <>
      <CagrCalculatorClient />
      <div className="container mx-auto px-4 max-w-6xl">
        <RelatedCalculators calculators={getRelatedCalculators('cagr-calculator')} />
      </div>
      <StructuredData
        type="Calculator"
        data={{
          name: 'CAGR Calculator',
          description: 'Calculate the Compound Annual Growth Rate of investments.',
          url: 'https://Numeraise.com/calculators/cagr-calculator',
        }}
      />
    </>
  );
}
