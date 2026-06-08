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

export default function EMICalculatorPage() {
  const { format, currency } = useCurrency();
  const [principal, setPrincipal] = useState(500000 / 83);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(5);

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

  const copyPayload = `EMI Calculation Results:
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
      question: "What is an EMI?",
      answer: "Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full."
    },
    {
      question: "How is EMI calculated mathematically?",
      answer: "EMI is calculated using the formula: P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the Principal loan amount, r is the monthly interest rate, and n is the total number of monthly installments."
    },
    {
      question: "Does EMI change during the loan tenure?",
      answer: "If you have a fixed-rate loan, your EMI remains constant throughout the tenure. However, if you have a floating-rate loan, your EMI or loan tenure will change whenever the bank adjusts its benchmark interest rates."
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer: "Missing an EMI payment will negatively impact your credit score (CIBIL score). Your bank will also charge a late payment penalty and potentially a bounce fee if the auto-debit fails."
    },
    {
      question: "How can I reduce my EMI burden?",
      answer: "You can reduce your EMI by making prepayments (part-payments) towards your principal amount, opting for a longer loan tenure (though this increases total interest paid), or transferring your loan balance to another bank offering a lower interest rate."
    }
  ,
    {
      question: "Does EMI change if the RBI changes interest rates?",
      answer: "If you have a floating rate loan, your EMI usually stays the same, but the tenure (duration) of your loan increases or decreases based on the new rate."
    },
    {
      question: "Can I pay more than my EMI every month?",
      answer: "Yes, this is called making a part-prepayment. Any extra amount you pay goes directly toward reducing your principal, which drastically reduces your total interest."
    }
  ];

  const relatedCalcs = [
    { title: "Home Loan Calculator", description: "Plan your real estate purchases.", href: "/calculators/home-loan-calculator" },
    { title: "SIP Calculator", description: "Calculate wealth generation through mutual funds.", href: "/calculators/sip-calculator" },
    { title: "Lumpsum Calculator", description: "Calculate returns for one-time investments.", href: "/calculators/lumpsum-calculator" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <div className="mb-6 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">EMI Calculator</h1>
        
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Loan Amount"
                value={principal * currency.rate}
                min={(10000 / 83) * currency.rate}
                max={(10000000 / 83) * currency.rate}
                step={(10000 / 83) * currency.rate}
                onChange={(val) => setPrincipal(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Interest Rate (p.a)"
                value={interestRate}
                min={1}
                max={30}
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
              <CardDescription>Your loan repayment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Monthly EMI</p>
                  <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{format(result.emi)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 ">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Principal</p>
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
                csvFilename="emi_amortization_schedule.csv"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is an EMI Calculator?</h2>
        <p>An EMI (Equated Monthly Installment) Calculator is a financial utility tool that helps you calculate the fixed monthly amount you need to pay towards your loan repayment. Whether you are taking a personal loan, car loan, or education loan, understanding your exact monthly outflow is crucial for maintaining a healthy financial budget.</p>
        
        <h2>How Does the EMI Calculator Work?</h2>
        <p>Our EMI calculator takes three primary inputs to generate your amortization schedule:</p>
        <ul>
          <li><strong>Principal Amount (P):</strong> The total amount you wish to borrow from the bank.</li>
          <li><strong>Interest Rate (R):</strong> The annual percentage rate charged by the lender.</li>
          <li><strong>Loan Tenure (N):</strong> The duration over which you will repay the loan, usually expressed in years or months.</li>
        </ul>

        <h3>The Mathematical Formula for EMI</h3>
        <p>The calculation is based on the standard universal formula used by all global banks and financial institutions:</p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup>-1]
        </div>
        <p><em>Note: In this formula, the annual interest rate must be converted to a monthly rate (Annual Rate / 12 / 100), and the tenure must be calculated in total months.</em></p>

        <h3>Example EMI Calculation</h3>
        <p>Let's assume you take a personal loan of {format(500000/83)} for a tenure of 5 years at an interest rate of 10.5% per annum.</p>
        <ul>
          <li><strong>Principal:</strong> {format(500000/83)}</li>
          <li><strong>Monthly Interest Rate:</strong> 10.5% / 12 / 100 = 0.00875</li>
          <li><strong>Total Months:</strong> 5 Years × 12 = 60 Months</li>
        </ul>
        <p>Plugging these into the formula results in an EMI of <strong>{format(10747/83)}</strong>. Over the 5-year period, you will pay a total interest of <strong>{format(144817/83)}</strong>, making your total repayment amount <strong>{format(644817/83)}</strong>.</p>

        <h2>The Anatomy of an EMI</h2>
        <p>Every EMI you pay consists of two distinct components:</p>
        <ol>
          <li><strong>Principal Repayment:</strong> The portion of the EMI that goes towards reducing your actual outstanding loan amount.</li>
          <li><strong>Interest Payment:</strong> The cost charged by the bank for borrowing the money.</li>
        </ol>
        <p>In the initial years of your loan, the interest component makes up the massive majority of your EMI. As the years pass and your principal reduces, the proportion of interest drops and the principal repayment becomes the larger component. You can visualize this clearly by checking the "Amortization Table" tab in our calculator above.</p>

        <h2>Common Mistakes When Taking a Loan</h2>
        <p><strong>Ignoring the total interest payout:</strong> Borrowers often stretch their loan tenure to the maximum limit just to get a lower, more comfortable EMI. While this helps monthly cash flow, it drastically increases the total interest paid to the bank over the life of the loan. Always aim for the shortest tenure you can comfortably afford.</p>
        <p><strong>Not accounting for processing fees:</strong> The EMI is just the repayment. Banks charge processing fees, document charges, and GST on those fees. Always ask for the actual APR (Annual Percentage Rate) to know the true cost of your loan.</p>
      </CalculatorContent>
      
      <FAQAccordion faqs={faqs} />

      

      
      
      

      <RelatedCalculators calculators={relatedCalcs} /><StructuredData 
        type="Calculator" 
        data={{
          name: "EMI Calculator",
          description: "Calculate your Equated Monthly Installment for personal loans and car loans instantly. View detailed amortization schedules."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}

