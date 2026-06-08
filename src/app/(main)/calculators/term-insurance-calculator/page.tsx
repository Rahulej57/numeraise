"use client";

import { useState, useDeferredValue } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { SliderInput } from "@/components/calculators/slider-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BreakdownChart } from "@/components/charts/breakdown-chart";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function TermInsuranceCalculatorPage() {
  const { format, currency } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [annualIncome, setAnnualIncome] = useState(1200000 / 83);
  const [existingCover, setExistingCover] = useState(0);

  // Basic Rule of Thumb: Life Cover should be 10-15x of annual income, minus existing cover
  const yearsToRetire = retirementAge - currentAge;
  const recommendedCover = Math.max(0, (annualIncome * 15) - existingCover);
  
  // Approximate annual premium (purely illustrative, assuming standard healthy individual)
  // roughly 1000 INR per 10L of cover for a 30 year old, scaling up with age.
  const baseRatePerLakh = (100 + (currentAge - 20) * 5) / 83; 
  const annualPremium = (recommendedCover / (100000 / 83)) * baseRatePerLakh;

  const pieData = [
    { name: "Existing Cover", value: existingCover, color: "var(--chart-2)" },
    { name: "Required Additional Cover", value: recommendedCover, color: "var(--chart-1)" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Term Insurance Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Current Age"
                value={currentAge}
                min={18}
                max={60}
                step={1}
                onChange={setCurrentAge}
                suffix="Yr"
              />
              <SliderInput
                label="Expected Retirement Age"
                value={retirementAge}
                min={40}
                max={75}
                step={1}
                onChange={setRetirementAge}
                suffix="Yr"
              />
              <SliderInput
                label="Current Annual Income"
                value={annualIncome * currency.rate}
                min={(300000 / 83) * currency.rate}
                max={(50000000 / 83) * currency.rate}
                step={(100000 / 83) * currency.rate}
                onChange={(val) => setAnnualIncome(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Existing Life Cover"
                value={existingCover * currency.rate}
                min={0}
                max={(50000000 / 83) * currency.rate}
                step={(500000 / 83) * currency.rate}
                onChange={(val) => setExistingCover(val / currency.rate)}
                symbol={currency.symbol}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Your Protection Plan</CardTitle>
              <CardDescription>Based on the standard 15x income replacement rule.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 ">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Recommended Life Cover</p>
                  <p className="text-xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{format(Math.round(recommendedCover))}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 flex flex-col justify-center">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Est. Annual Premium</p>
                  <p className="text-lg md:text-2xl font-semibold">{format(Math.round(annualPremium))}</p>
                  <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 mt-1">*Illustrative purposes only</p>
                </div>
              </div>
              <div className="mt-4">
                <BreakdownChart data={pieData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is a Term Insurance Calculator?</h2>
          <p>A Term Insurance Calculator (also used as a general Life Insurance Calculator) helps you determine exactly how much financial cover your family would need if you were to pass away unexpectedly. Unlike confusing endowment or ULIP policies, pure term insurance strictly provides a massive death benefit for a very low premium, making it the bedrock of any solid financial plan.</p>
          
          <h2>How Much Cover Do You Actually Need?</h2>
          <p>The biggest mistake people make is buying arbitrary round numbers without running the math. A good life insurance policy must completely replace your future lost income, pay off all your debts, and fund your children's future education.</p>

          <h3>The 15x Rule of Thumb</h3>
          <p>Financial advisors generally recommend the Human Life Value (HLV) approach or the simpler Income Replacement approach:</p>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
            <p>Recommended Cover = (Current Annual Income × 15) - Existing Cover</p>
          </div>

          <h2>Why Term Insurance is Superior</h2>
          <ul>
          <li><strong>Massive Coverage, Tiny Premium:</strong> A healthy 30-year-old can often buy {format(12000000/83)} of term cover for less than {format(1000/83)} a month.</li>
            <li><strong>Simplicity:</strong> There is no confusing "investment" component. If you die during the term, your family gets the money. If you survive, the policy simply expires.</li>
            <li><strong>Tax Benefits:</strong> In India, the premiums paid are tax-deductible under Section 80C, and the death benefit received by the family is completely tax-free under Section 10(10D).</li>
          </ul>
        
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Required Cover = Income Replacement + Outstanding Liabilities</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
          {
            question: "At what age should I buy Term Insurance?",
            answer: "As early as possible once you have financial dependents or debt. Because insurance premiums are locked in at the age you buy the policy, buying at age 25 will secure a radically cheaper monthly premium for the rest of your life than buying at age 40."
          },
          {
            question: "Do I need life insurance if I am single with no dependents?",
            answer: "Generally, no. If no one relies on your income to survive, you probably don't need life insurance. However, if your parents are co-signers on your student loans, you should buy enough cover to clear that debt."
          },
          {
            question: "Should I buy 'Return of Premium' term insurance?",
            answer: "Almost never. 'Return of Premium' policies charge you double or triple the monthly cost just to refund your premiums at the end. Mathematically, you are much better off buying a cheap pure term plan and investing the difference in a mutual fund."
          }
        ,
        {
          question: "What happens if I stop paying term insurance premiums?",
          answer: "If you fail to pay during the grace period (usually 30 days), your policy lapses and the death benefit coverage stops entirely. You do not get a refund for past premiums."
        },
        {
          question: "Can I have multiple term insurance policies?",
          answer: "Yes, it is perfectly legal and common to have multiple policies from different insurers. You must, however, disclose existing policies when applying for a new one."
        }
      ]} />

        

        
      

        <RelatedCalculators calculators={getRelatedCalculators("term-insurance-calculator")} /><StructuredData 
          type="Calculator" 
          data={{
            name: "Term Life Insurance Calculator",
            description: "Calculate your exact required life insurance cover using the human life value and 15x income replacement rules."
          }} 
        />
      </div>
    </div>
  );
}
