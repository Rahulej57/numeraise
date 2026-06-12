import Link from 'next/link';
import { HomeLoanPrepaymentClient } from '@/components/calculators/home-loan-prepayment-client';
import { StructuredData } from '@/components/seo/structured-data';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';

export const metadata = {
  title: 'Home Loan Prepayment Calculator | EMI Savings & Tenure Reduction',
  description:
    'Calculate how much interest and time you can save by making a part-payment on your home loan while keeping your EMI constant.',
};

export default function HomeLoanPrepaymentPage() {
  const relatedCalcs = getRelatedCalculators('home-loan-prepayment');
  return (
    <>
      <HomeLoanPrepaymentClient />

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl mt-12">
        <CalculatorContent>
          <h2>What is a Home Loan Prepayment Calculator?</h2>
          <p>
            A <Link href="/calculators/home-loan-calculator">Home Loan</Link> Prepayment Calculator is a powerful
            mortgage tool that shows you exactly how much money and time you can save by paying off a chunk of your loan
            early. When you make a lump-sum "part-payment" towards your home loan, 100% of that money goes directly
            toward reducing your principal balance, which drastically cuts down your future interest burden.
          </p>
          <h2>How Prepayment Magic Works</h2>
          <p>
            Because home loans use a <Link href="/calculators/flat-vs-reducing-loan">reducing balance</Link> method,
            your monthly <Link href="/calculators/emi-calculator">EMI</Link> is split between Interest and Principal. In
            the early years of a 20-year loan, almost 80% of your EMI goes entirely toward interest! By making a
            prepayment, you force the principal down immediately, which means every future EMI pays off significantly
            more principal than before.
          </p>

          <h3>Two Prepayment Strategies</h3>
          <ul>
            <li>
              <strong>Reduce Tenure (Recommended):</strong> You keep your monthly EMI exactly the same, but the loan
              gets paid off years earlier. This maximizes your interest savings.
            </li>
            <li>
              <strong>Reduce EMI:</strong> You keep the original 20-year tenure, but your required monthly payment
              drops. This is useful if you are facing cash-flow issues, but it saves you much less interest.
            </li>
          </ul>

          <h2>Why You Should Prepay</h2>
          <ul>
            <li>
              <strong>
                Massive <Link href="/calculators/roi-calculator">ROI</Link>:
              </strong>{' '}
              If your home loan interest rate is 9%, making a prepayment gives you a guaranteed, risk-free 9% return on
              your money (tax-adjusted).
            </li>
            <li>
              <strong>Debt Freedom:</strong> Prepaying just 5% of your loan balance once a year can shave 5 to 7 years
              off a 20-year mortgage.
            </li>
          </ul>

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Interest Saved = (Old EMI × Old Tenure) - (New EMI × New Tenure)</p>
          </div>
        </CalculatorContent>
        <FAQAccordion
          faqs={[
            {
              question: 'Are there penalties for prepaying a home loan?',
              answer:
                'In India, the RBI has mandated that banks cannot charge any prepayment or foreclosure penalties on floating-rate home loans for individuals. However, if you have a fixed-rate loan, banks may still charge a penalty (usually 1-2%).',
            },
            {
              question: 'When is the best time to make a prepayment?',
              answer:
                'The earlier, the better. Prepaying in the first 5 years of a 20-year loan yields exponentially more interest savings than prepaying in the last 5 years, because interest is heavily front-loaded.',
            },
            {
              question: 'Should I invest my money or prepay my home loan?',
              answer:
                'This is a classic debate. Mathematically, if you can invest the money in a mutual fund that consistently returns 12% after taxes, you should invest rather than prepaying an 8.5% home loan. However, prepaying offers guaranteed, risk-free returns and psychological peace of mind.',
            },
          ]}
        />

        <RelatedCalculators calculators={getRelatedCalculators('home-loan-prepayment')} />
      </div>

      <StructuredData
        type="Calculator"
        data={{
          name: 'Home Loan Prepayment Calculator',
          description: 'Calculate interest savings from loan prepayments.',
          url: 'https://www.numeraise.com/calculators/home-loan-prepayment',
        }}
      />
    </>
  );
}
