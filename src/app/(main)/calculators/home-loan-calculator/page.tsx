"use client";

import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { calculateEMI } from "@/lib/calculations/loan";
import { SliderInput } from "@/components/calculators/slider-input";
import { BreakdownChart } from "@/components/charts/breakdown-chart";
import { DataTable } from "@/components/calculators/data-table";
import { ResultActions } from "@/components/calculators/result-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion, FAQ } from "@/components/calculators/faq-accordion";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { RelatedArticles } from "@/components/calculators/related-articles";
import { StructuredData } from "@/components/seo/structured-data";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function HomeLoanCalculatorPage() {
  const { format, currency } = useCurrency();
  const [principal, setPrincipal] = useState(5000000 / 83);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // Sync state with URL on mount for shareable links
  useEffect(() => { 
    if (!window.history.state?.initializedDefaults) {
      
        if (['USD', 'GBP', 'EUR', 'CAD', 'AUD'].includes(currency.code)) {
          if (typeof setInterestRate === 'function') setInterestRate(6);
        } else if (currency.code === 'INR') {
          if (typeof setInterestRate === 'function') setInterestRate(9);
        }
      window.history.replaceState({ ...window.history.state, initializedDefaults: true }, '');
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('amount')) setPrincipal(Number(params.get('amount')));
    if (params.has('rate')) setInterestRate(Number(params.get('rate')));
    if (params.has('years')) setTenureYears(Number(params.get('years')));
  }, []);

  const result = useMemo(
    () => calculateEMI(principal, interestRate, tenureYears),
    [principal, interestRate, tenureYears]
  );

  const pieData = useMemo(() => [
    { name: "Principal Amount", value: principal, color: "var(--chart-1)" },
    { name: "Total Interest", value: result.totalInterest, color: "var(--chart-2)" },
  ], [principal, result.totalInterest]);

  const deferredPieData = useDeferredValue(pieData);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?amount=${principal}&rate=${interestRate}&years=${tenureYears}`
    : '';

  const copyPayload = `Home Loan Calculation Results:
Loan Amount: ${format(principal)}
Tenure: ${tenureYears} Years
Interest Rate: ${interestRate}%

Monthly EMI: ${format(result.emi)}
Total Interest: ${format(result.totalInterest)}
Total Payment: ${format(result.totalPayment)}

Calculate your own: ${shareUrl}`;

  const tableColumns = [
    { header: "Month", accessorKey: "month" },
    { header: "Principal", accessorKey: "principal", isNumeric: true },
    { header: "Interest", accessorKey: "interest", isNumeric: true },
    { header: "Balance", accessorKey: "balance", isNumeric: true },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is a Home Loan EMI?",
      answer: "A Home Loan EMI is the monthly payment you make to the bank to repay your housing loan. It consists of both principal repayment and interest charges. In the early years of a 20-year loan, the majority of your EMI goes entirely towards interest."
    },
    {
      question: "How can I reduce my Home Loan interest?",
      answer: "The most effective way to reduce home loan interest is by making regular part-prepayments. Even paying just one extra EMI per year, or increasing your EMI by 5% annually, can shave years off your tenure and save substantially in interest."
    },
    {
      question: "Are there tax benefits on Home Loans?",
      answer: "Yes, in many jurisdictions, you can claim tax deductions on the interest paid or the principal repayment for a primary residence. Please consult your local tax code for specific limits."
    },
    {
      question: "Should I choose a Fixed or Floating rate?",
      answer: "Many home loans are floating rate loans, meaning the interest rate fluctuates based on central bank rates. Fixed-rate loans usually come at a higher premium but offer stability."
    },
    {
      question: "Does the Home Loan Calculator include property tax and insurance?",
      answer: "No, this calculator only computes your principal and interest obligations to the bank. You should budget separately for property taxes, home insurance, and maintenance costs."
    }
  ,
    {
      question: "Should I choose a fixed or floating interest rate for a home loan?",
      answer: "Home loans are long-term commitments (15-20 years). Floating rates are generally cheaper over the long run, as fixed-rate loans carry a higher premium for the security they offer."
    },
    {
      question: "What is an amortization schedule?",
      answer: "It is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off."
    }
  ];

  const relatedCalcs = [
    { title: "EMI Calculator", description: "Calculate car and personal loan EMIs.", href: "/calculators/emi-calculator" },
    { title: "SIP Calculator", description: "Invest the money you save from loan prepayments.", href: "/calculators/sip-calculator" },
    { title: "FD Calculator", description: "Calculate returns on secure deposits.", href: "/calculators/fd-calculator" }
  ];

  const relatedGuides = [
    { title: "The Ultimate Guide to Prepaying Your Home Loan", href: "#" },
    { title: "Home Loan Tax Benefits Explained", href: "#" },
    { title: "Floating vs Fixed Rates: Which is Better?", href: "#" },
    { title: "Hidden Charges in Home Loans You Must Know", href: "#" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Home Loan Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Home Loan Amount"
                value={principal * currency.rate}
                min={(100000 / 83) * currency.rate}
                max={(50000000 / 83) * currency.rate}
                step={(100000 / 83) * currency.rate}
                onChange={(val) => setPrincipal(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Interest Rate (p.a)"
                value={interestRate}
                min={1}
                max={20}
                step={0.1}
                onChange={setInterestRate}
                suffix="%"
              />
              <SliderInput
                label="Loan Tenure"
                value={tenureYears}
                min={1}
                max={30}
                step={1}
                onChange={setTenureYears}
                suffix="Yr"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Your home loan repayment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Monthly EMI</p>
                  <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{format(result.emi)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 ">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Principal Amount</p>
                  <p className="text-base md:text-xl font-semibold">{format(principal)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border-amber-500/20 ">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 mb-1">Total Interest</p>
                  <p className="text-base md:text-xl font-semibold text-amber-600 dark:text-amber-400">{format(result.totalInterest)}</p>
                </div>
              </div>
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="table">Amortization</TabsTrigger>
                </TabsList>
                <TabsContent value="breakdown" className="mt-4">
                  <BreakdownChart data={deferredPieData} />
                </TabsContent>
                <TabsContent value="table" className="mt-4">
                  <DataTable columns={tableColumns} data={result.amortizationSchedule} />
                </TabsContent>
              </Tabs>

              <ResultActions 
                shareUrl={shareUrl}
                copyPayload={copyPayload}
                csvData={result.amortizationSchedule}
                csvFilename="home_loan_amortization_schedule.csv"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is a Home Loan Calculator?</h2>
        <p>A Home Loan Calculator is a specialized financial tool designed specifically for long-tenure, high-value mortgages. It helps prospective homebuyers calculate their Equated Monthly Installment (EMI) and visualize exactly how much interest they will pay over the lifespan of a 15, 20, or 30-year loan.</p>
        <p>Because home loans involve massive amounts of money and very long timeframes, the total interest paid often exceeds the original cost of the house itself. This calculator helps you understand that dynamic before you sign the mortgage agreement.</p>
        
        <h2>How to Use the Home Loan Calculator</h2>
        <p>To generate your home loan amortization schedule, you need three key inputs:</p>
        <ul>
          <li><strong>Loan Amount:</strong> The principal amount sanctioned by the bank (excluding the down payment you pay out of pocket).</li>
          <li><strong>Interest Rate:</strong> The annual floating or fixed rate offered by your lender.</li>
          <li><strong>Loan Tenure:</strong> The total number of years you have to repay the loan (typically 15 to 20 years).</li>
        </ul>

        <h3>The Amortization Formula</h3>
        <p>Like standard EMIs, home loans use the reducing balance method. The formula is:</p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup>-1]
        </div>
        <p><em>Where P = Principal, R = Monthly Interest Rate, and N = Total months.</em></p>

        <h3>Example Home Loan Scenario</h3>
        <p>Consider a realistic scenario for a property:</p>
        <ul>
          <li><strong>Loan Amount:</strong> 500,000</li>
          <li><strong>Interest Rate:</strong> 8.5% p.a.</li>
          <li><strong>Tenure:</strong> 20 Years</li>
        </ul>
        <p>According to the calculation, your monthly EMI will be <strong>4,339</strong>. While the EMI might seem manageable, the total interest paid over 20 years will be a staggering <strong>541,387</strong>. This means you will repay the bank a total of <strong>1,041,387</strong> for a 500,000 loan!</p>

        <h2>The Secret to Saving Significantly: Prepayment</h2>
        <p>The most important realization you can have when looking at a Home Loan Calculator is the power of part-prepayment. Because interest is charged on the outstanding principal every month, making a lump sum payment directly against the principal drastically reduces your future interest burden.</p>
        <p><strong>Pro Tip:</strong> By simply paying just one extra EMI per year (13 EMIs instead of 12), you can reduce a 20-year loan to roughly 16 years, saving you a massive amount in interest. Use our detailed Amortization Data Table above to see exactly how your balance drops month by month.</p>
      </CalculatorContent>
      <FAQAccordion faqs={faqs} />

      

      <RelatedCalculators calculators={relatedCalcs} />
      <RelatedArticles articles={relatedGuides} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Home Loan Calculator",
          description: "Calculate your home loan EMI and total interest payable. See the amortization schedule to plan your real estate purchase."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}

