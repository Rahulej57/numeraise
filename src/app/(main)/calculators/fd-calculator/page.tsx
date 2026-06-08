"use client";

import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { calculateFD } from "@/lib/calculations/investment";
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

export default function FDCalculatorPage() {
  const { format, currency } = useCurrency();
  const [principal, setPrincipal] = useState(100000 / 83);
  const [interestRate, setInterestRate] = useState(7.5);
  const [timePeriodYears, setTimePeriodYears] = useState(5);

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
    if (params.has('years')) setTimePeriodYears(Number(params.get('years')));
  }, []);

  const result = useMemo(
    () => calculateFD(principal, interestRate, timePeriodYears, 4), // Quarterly compounding
    [principal, interestRate, timePeriodYears]
  );

  const pieData = useMemo(() => [
    { name: "Invested Amount", value: principal, color: "var(--chart-1)" },
    { name: "Est. Returns", value: result.estimatedReturns, color: "var(--chart-2)" },
  ], [principal, result.estimatedReturns]);

  const deferredPieData = useDeferredValue(pieData);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?amount=${principal}&rate=${interestRate}&years=${timePeriodYears}`
    : '';

  const copyPayload = `Fixed Deposit Calculation Results:
Investment Amount: ${format(principal)}
Time Period: ${timePeriodYears} Years
Interest Rate: ${interestRate}%

Total Invested: ${format(result.investedAmount)}
Estimated Returns: ${format(result.estimatedReturns)}
Total Maturity Value: ${format(result.totalValue)}

Calculate your own: ${shareUrl}`;

  const tableColumns = [
    { header: "Year", accessorKey: "year" },
    { header: "Invested", accessorKey: "invested", isNumeric: true },
    { header: "Interest Earned", accessorKey: "interest", isNumeric: true },
    { header: "Total Value", accessorKey: "balance", isNumeric: true },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is a Fixed Deposit (FD)?",
      answer: "A Fixed Deposit (FD) is a secure financial instrument offered by banks and non-banking financial companies (NBFCs). It provides investors a higher rate of interest than a regular savings account, until a given maturity date."
    },
    {
      question: "Is FD safe to invest?",
      answer: "Yes, FDs are considered one of the safest investment options. In India, deposits up to ₹5 Lakhs per bank are insured by the DICGC (a subsidiary of RBI)."
    },
    {
      question: "How is FD interest calculated?",
      answer: "Most banks in India calculate FD interest using quarterly compounding. This means the interest generated in the first 3 months is added to your principal, and you earn interest on that combined amount for the next quarter."
    },
    {
      question: "Can I break my FD before maturity?",
      answer: "Yes, you can prematurely withdraw your FD. However, banks usually charge a penalty of 0.5% to 1% on the applicable interest rate for the period the deposit was actually held."
    },
    {
      question: "Is FD interest taxable?",
      answer: "Yes, interest earned on FDs is fully taxable according to your income tax slab. Banks will deduct TDS (Tax Deducted at Source) at 10% if your interest income exceeds ₹40,000 in a financial year (₹50,000 for senior citizens)."
    }
  ,
    {
      question: "What is the difference between simple and compound FD?",
      answer: "Simple FDs pay out interest monthly or quarterly to your savings account. Cumulative (compound) FDs reinvest the interest, giving you a much larger lump sum at maturity."
    },
    {
      question: "Are Fixed Deposits risk-free?",
      answer: "In India, bank FDs are insured up to ₹5 Lakhs by DICGC. While they are essentially risk-free from default, they carry inflation risk if the interest rate is lower than inflation."
    }
  ];

  const relatedCalcs = [
    { title: "Lumpsum Calculator", description: "Compare FD returns vs Mutual Funds.", href: "/calculators/lumpsum-calculator" },
    { title: "SIP Calculator", description: "Calculate monthly systematic investments.", href: "/calculators/sip-calculator" },
    { title: "Income Tax Calculator", description: "Calculate your tax liability on FD interest.", href: "/calculators/income-tax-calculator" }
  ];

  const relatedGuides = [
    { title: "FD vs Debt Mutual Funds: Which is Better?", href: "#" },
    { title: "How to Avoid TDS on Fixed Deposits (Form 15G/15H)", href: "#" },
    { title: "Best FD Interest Rates for Senior Citizens", href: "#" },
    { title: "Understanding Quarterly Compounding", href: "#" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Fixed Deposit Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Total Investment"
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
                max={15}
                step={0.1}
                onChange={setInterestRate}
                suffix="%"
              />
              <SliderInput
                label="Time Period"
                value={timePeriodYears}
                min={1}
                max={25}
                step={1}
                onChange={setTimePeriodYears}
                suffix="Yr"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Your FD maturity breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 ">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 mb-1">Total Investment</p>
                  <p className="text-base md:text-xl font-semibold">{format(result.investedAmount)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 ">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Total Interest</p>
                  <p className="text-base md:text-xl font-semibold text-blue-600 dark:text-blue-400 dark:text-blue-600 dark:text-blue-400">{format(result.estimatedReturns)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border-amber-500/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Maturity Value</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{format(result.totalValue)}</p>
                </div>
              </div>
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="table">Data Table</TabsTrigger>
                </TabsList>
                <TabsContent value="breakdown" className="mt-4">
                  <BreakdownChart data={deferredPieData} />
                </TabsContent>
                <TabsContent value="table" className="mt-4">
                  <DataTable columns={tableColumns} data={result.yearlyData} />
                </TabsContent>
              </Tabs>

              <ResultActions 
                shareUrl={shareUrl}
                copyPayload={copyPayload}
                csvData={result.yearlyData}
                csvFilename="fd_calculation_results.csv"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is a Fixed Deposit (FD) Calculator?</h2>
        <p>A Fixed Deposit (FD) Calculator is an automated financial tool that helps you compute the exact maturity value and interest earned on your secure bank deposits. By inputting your deposit amount, the bank's offered interest rate, and your desired holding period, the calculator eliminates the need for complex manual compounding calculations.</p>
        
        <h2>How Does the FD Calculator Work?</h2>
        <p>In India, the vast majority of banks (such as SBI, HDFC, ICICI) compound fixed deposit interest <strong>quarterly</strong>. This means every three months, the interest you have earned is added back into your principal, increasing the base on which the next quarter's interest is calculated.</p>

        <h3>The Mathematical Formula for FD</h3>
        <p>Because of this quarterly compounding, the FD calculator uses the standard Compound Interest formula, adjusted for quarterly intervals:</p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          A = P × (1 + r/n)<sup>n×t</sup>
        </div>
        <ul>
          <li><strong>A:</strong> Maturity Amount (Principal + Total Interest)</li>
          <li><strong>P:</strong> Principal Deposit Amount</li>
          <li><strong>r:</strong> Annual Interest Rate (expressed in decimals, e.g., 7% = 0.07)</li>
          <li><strong>n:</strong> Compounding Frequency per year (n = 4 for Quarterly)</li>
          <li><strong>t:</strong> Total Tenure in Years</li>
        </ul>

        <h3>Practical Example Scenario</h3>
        <p>Let's say you want to park your emergency fund of {format(200000/83)} in a secure FD for 3 years, and your bank is offering an interest rate of 7.00% p.a.</p>
        <ul>
          <li><strong>Deposit (P):</strong> {format(200000/83)}</li>
          <li><strong>Interest Rate (r):</strong> 7.00% (0.07)</li>
          <li><strong>Tenure (t):</strong> 3 Years</li>
          <li><strong>Compounding (n):</strong> 4 (Quarterly)</li>
        </ul>
        <p>By using the calculator, we determine that your total interest earned will be <strong>{format(46288/83)}</strong>. Therefore, your total maturity value after 3 years will be <strong>{format(246288/83)}</strong>.</p>

        <h2>Benefits of Fixed Deposits</h2>
        <p><strong>Capital Protection:</strong> FDs are completely insulated from stock market volatility. If you invest {format(100000/83)}, your principal is 100% safe, making it the perfect instrument for emergency funds and short-term goals.</p>
        <p><strong>Guaranteed Returns:</strong> Unlike mutual funds where returns fluctuate, you lock in the interest rate the moment you open the FD. You know exactly what your maturity amount will be on day one.</p>

        <h2>Common Mistakes to Avoid</h2>
        <p><strong>Ignoring Inflation and Taxes:</strong> FD returns are fully taxable based on your income bracket. If inflation is 6% and your post-tax FD return is 5%, you are actually losing purchasing power. Never put long-term wealth creation money purely into FDs.</p>
        <p><strong>Premature Withdrawal Penalties:</strong> If you break an FD before maturity, banks will typically reduce your applicable interest rate by 1%. If you are unsure when you need the money, it is better to open a sweep-in FD or a liquid mutual fund instead.</p>
      </CalculatorContent>
      <FAQAccordion faqs={faqs} />

      

      <RelatedCalculators calculators={relatedCalcs} />
      <RelatedArticles articles={relatedGuides} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Fixed Deposit (FD) Calculator",
          description: "Calculate your Fixed Deposit maturity value and interest earned with quarterly compounding accuracy."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}

