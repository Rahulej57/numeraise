import { RetirementCalculatorClient } from '@/components/calculators/retirement-calculator-client';

// Metadata for this page lives in ./layout.tsx, driven by
// src/config/calculator-seo.ts. A page-level export const metadata here would
// silently override the layout and bypass that config, which is how this page
// ended up with a title longer than the SERP window.

export default function RetirementCalculatorPage() {
  return (
    <>
      <RetirementCalculatorClient />
    </>
  );
}
