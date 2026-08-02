import { CagrCalculatorClient } from '@/components/calculators/cagr-calculator-client';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';
import { SITE_URL } from '@/config/site';

// Metadata for this page lives in ./layout.tsx, driven by
// src/config/calculator-seo.ts. A page-level export const metadata here would
// silently override the layout and bypass that config, which is how this page
// ended up with a title longer than the SERP window.

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
          url: `${SITE_URL}/calculators/cagr-calculator`,
        }}
      />
    </>
  );
}
