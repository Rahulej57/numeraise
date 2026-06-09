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
import { getRelatedCalculators } from "@/config/calculators";
import { RelatedArticles } from "@/components/calculators/related-articles";
import { StructuredData } from "@/components/seo/structured-data";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function LumpsumCalculatorPage() {
  const { format, currency } = useCurrency();
  const [principal, setPrincipal] = useState(100000 / 83);
  const [interestRate, setInterestRate] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);

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

  // Lumpsum is basically compound interest (annual compounding typically used for mutual funds)
  const result = useMemo(
    () => calculateFD(principal, interestRate, timePeriodYears, 1), 
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

  const copyPayload = `Lumpsum Calculation Results:
Investment Amount: ${format(principal)}
Time Period: ${timePeriodYears} Years
Expected Return: ${interestRate}%

Total Invested: ${format(result.investedAmount)}
Estimated Returns: ${format(result.estimatedReturns)}
Total Wealth Created: ${format(result.totalValue)}

Calculate your own: ${shareUrl}`;

  const tableColumns = [
    { header: "Year", accessorKey: "year" },
    { header: "Invested", accessorKey: "invested", isNumeric: true },
    { header: "Returns", accessorKey: "interest", isNumeric: true },
    { header: "Balance", accessorKey: "balance", isNumeric: true },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is a Lumpsum Investment?",
      answer: "A lumpsum investment is a single, one-time bulk investment made into a mutual fund, stock, or other financial instrument, as opposed to investing smaller amounts periodically (which is called an SIP)."
    },
    {
      question: "Is Lumpsum better than SIP?",
      answer: "Lumpsum investments historically generate higher absolute returns over the very long term because the entire principal is subjected to compounding from Day 1. However, SIPs offer better risk mitigation by averaging out the cost of purchase during market volatility."
    },
    {
      question: "When is the best time to make a Lumpsum investment?",
      answer: "The ideal time to deploy lumpsum cash is during market corrections or crashes. Buying when the market is down allows you to acquire more units for the same amount of money, significantly boosting future returns."
    },
    {
      question: "Can I do both Lumpsum and SIP?",
      answer: "Absolutely! Many successful investors run regular monthly SIPs and use lumpsum investments to deploy annual bonuses or windfall gains into the same mutual fund folios during market dips."
    },
    {
      question: "How is Lumpsum calculated?",
      answer: "Lumpsum returns are calculated using the standard Compound Interest formula: A = P(1 + r/n)^(nt), where P is principal, r is the annual interest rate, and t is the time period in years."
    }
  ,
    {
      question: "Is it better to invest a lump sum or use SIP?",
      answer: "Mathematically, if the market goes up over the long term, investing a lump sum immediately yields higher returns. However, SIPs offer psychological comfort and protect against investing right before a market crash."
    },
    {
      question: "Can I withdraw my lump sum investment anytime?",
      answer: "It depends on the investment vehicle. Equity mutual funds have no lock-in (except ELSS which has 3 years). Fixed deposits usually have penalties for early withdrawal."
    }
  ];

  const relatedCalcs = getRelatedCalculators("lumpsum-calculator");

  const relatedGuides = [
    { title: "SIP vs Lumpsum: Which Strategy Wins?", href: "#" },
    { title: "How to Invest a Windfall (Bonus or Inheritance)", href: "#" },
    { title: "Understanding Compounding Frequency", href: "#" },
    { title: "Top 10 Mutual Funds for Lumpsum Investment", href: "#" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Lumpsum Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Total Investment"
                value={principal * currency.rate}
                min={(5000 / 83) * currency.rate}
                max={(10000000 / 83) * currency.rate}
                step={(5000 / 83) * currency.rate}
                onChange={(val) => setPrincipal(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Expected Return Rate (p.a)"
                value={interestRate}
                min={1}
                max={30}
                step={0.5}
                onChange={setInterestRate}
                suffix="%"
              />
              <SliderInput
                label="Time Period"
                value={timePeriodYears}
                min={1}
                max={40}
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
              <CardDescription>Your wealth creation breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 ">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 mb-1">Invested Amount</p>
                  <p className="text-base md:text-xl font-semibold">{format(result.investedAmount)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 ">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Est. Returns</p>
                  <p className="text-base md:text-xl font-semibold text-blue-600 dark:text-blue-400 dark:text-blue-600 dark:text-blue-400">{format(result.estimatedReturns)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border-amber-500/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Total Value</p>
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
                csvFilename="lumpsum_calculation_results.csv"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is a Lumpsum Calculator?</h2>
        <p>A Lumpsum Calculator is an essential financial tool designed to estimate the future value of a one-time, bulk investment made today. Whether you have received an annual bonus, an inheritance, or proceeds from selling real estate, deploying a large sum of cash requires careful planning. This calculator helps you visualize how that single investment will grow over years or decades through the power of compounding.</p>
        
        <h2>How to Use the Lumpsum Calculator</h2>
        <p>To forecast your wealth creation, simply adjust the three sliders:</p>
        <ul>
          <li><strong>Total Investment:</strong> The one-time amount you are ready to invest today.</li>
          <li><strong>Expected Return Rate:</strong> Your realistic expectation of annual growth (e.g., 10-12% for equity mutual funds, 6-7% for debt funds).</li>
          <li><strong>Time Period:</strong> The number of years you plan to leave the money invested without touching it.</li>
        </ul>

        <h3>The Mathematical Formula for Lumpsum Returns</h3>
        <p>Lumpsum growth relies entirely on the universal formula for Compound Interest. The calculation engine uses:</p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          A = P × (1 + r/n)<sup>nt</sup>
        </div>
        <ul>
          <li><strong>A:</strong> Total Future Value (Principal + Returns)</li>
          <li><strong>P:</strong> Principal Investment Amount</li>
          <li><strong>r:</strong> Annual Interest Rate (in decimal form)</li>
          <li><strong>n:</strong> Number of times interest is compounded per year (Usually 1 for mutual funds)</li>
          <li><strong>t:</strong> Total time period in years</li>
        </ul>

        <h3>Practical Example Scenario</h3>
        <p>Imagine you receive a performance bonus of {currency.symbol}50,000 and decide to invest it in an index mutual fund instead of buying a car. You expect a conservative 12% annual return over a 15-year holding period.</p>
        <ul>
          <li><strong>Investment (P):</strong> {currency.symbol}50,000</li>
          <li><strong>Expected Return (r):</strong> 12.00%</li>
          <li><strong>Time Period (t):</strong> 15 Years</li>
        </ul>
        <p>Without adding any additional capital, the power of compounding will turn your initial {currency.symbol}50,000 into <strong>{currency.symbol}273,678</strong>. Your money generated over {currency.symbol}223,678 in pure profit simply by staying invested over time!</p>

        <h2>SIP vs Lumpsum: The Eternal Debate</h2>
        <p>A common question is whether to invest a large amount immediately (Lumpsum) or stagger it over several months (SIP). Mathematically, if the market is on a long-term upward trajectory, Lumpsum will almost always beat SIP because your entire capital starts earning returns from Day 1.</p>
        <p>However, Lumpsum carries higher <strong>timing risk</strong>. If you invest your entire capital the day before a 20% market crash, your portfolio immediately drops by 20%, and it may take years to recover. If you are extremely risk-averse, staggering a large windfall into 6-12 monthly SIPs (often via an STP - Systematic Transfer Plan) can provide psychological comfort during volatile markets.</p>

        <h2>Common Mistakes to Avoid</h2>
        <p><strong>Panic Selling:</strong> Because lumpsum portfolios expose a large amount of capital to market volatility at once, it is common for new investors to panic when their portfolio shows a temporary 10-15% loss. Do not check your lumpsum portfolio daily. Invest and forget.</p>
        <p><strong>Unrealistic Expectations:</strong> Do not expect a 25% CAGR simply because the market performed well last year. Always run your lumpsum calculations with conservative estimates (10-12% for equity, 6-7% for debt) to avoid disappointment when funding your financial goals.</p>
      </CalculatorContent>
      <FAQAccordion faqs={faqs} />

      

      <RelatedCalculators calculators={relatedCalcs} />
      <RelatedArticles articles={relatedGuides} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Lumpsum Calculator",
          description: "Calculate the future value and estimated returns of a one-time bulk investment using the power of compounding."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}

