'use client';
import Link from 'next/link';

import { useState, useMemo, useDeferredValue, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { calculateSIP } from '@/lib/calculations/investment';
import { SliderInput } from '@/components/calculators/slider-input';
import { BreakdownChart } from '@/components/charts/breakdown-chart';
import { GrowthChart } from '@/components/charts/growth-chart';
import { DataTable } from '@/components/calculators/data-table';
import { ResultActions } from '@/components/calculators/result-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion, FAQ } from '@/components/calculators/faq-accordion';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';
import { RelatedArticles } from '@/components/calculators/related-articles';
import { StructuredData } from '@/components/seo/structured-data';
import { CalculatorHeader } from '@/components/calculators/calculator-header';

export default function SIPCalculatorPage() {
  const { format, currency } = useCurrency();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000 / 83);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriodYears, setTimePeriodYears] = useState(10);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    if (!window.history.state?.initializedDefaults) {
      if (['USD', 'GBP', 'EUR', 'CAD', 'AUD'].includes(currency.code)) {
        setExpectedReturnRate(8);
      } else if (currency.code === 'INR') {
        setExpectedReturnRate(12);
      }
      window.history.replaceState({ ...window.history.state, initializedDefaults: true }, '');
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('amount')) setMonthlyInvestment(Number(params.get('amount')));
    if (params.has('rate')) setExpectedReturnRate(Number(params.get('rate')));
    if (params.has('years')) setTimePeriodYears(Number(params.get('years')));
  }, []);

  const result = useMemo(
    () => calculateSIP(monthlyInvestment, expectedReturnRate, timePeriodYears),
    [monthlyInvestment, expectedReturnRate, timePeriodYears],
  );

  const pieData = useMemo(
    () => [
      { name: 'Invested Amount', value: result.investedAmount, color: 'var(--chart-1)' },
      { name: 'Est. Returns', value: result.estimatedReturns, color: 'var(--chart-2)' },
    ],
    [result.investedAmount, result.estimatedReturns],
  );

  const areaData = useMemo(
    () =>
      result.yearlyData.map((y) => ({
        name: `Year ${y.year}`,
        Invested: y.invested,
        'Total Value': y.value,
      })),
    [result.yearlyData],
  );

  const deferredPieData = useDeferredValue(pieData);
  const deferredAreaData = useDeferredValue(areaData);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?amount=${monthlyInvestment}&rate=${expectedReturnRate}&years=${timePeriodYears}`
      : '';

  const copyPayload = `SIP Calculation Results:
Monthly Investment: ${format(monthlyInvestment)}
Time Period: ${timePeriodYears} Years
Expected Return: ${expectedReturnRate}%

Total Invested: ${format(result.investedAmount)}
Estimated Returns: ${format(result.estimatedReturns)}
Total Wealth Created: ${format(result.totalValue)}

Calculate your own: ${shareUrl}`;

  const tableColumns = [
    { header: 'Year', accessorKey: 'year' },
    { header: 'Invested', accessorKey: 'invested', isNumeric: true },
    { header: 'Returns', accessorKey: 'interest', isNumeric: true },
    { header: 'Balance', accessorKey: 'balance', isNumeric: true },
  ];

  const faqs: FAQ[] = [
    {
      question: 'How is SIP calculated?',
      answer:
        'SIP is calculated using the future value of an annuity formula. The formula takes your monthly investment, the expected annual return rate (divided by 12 for monthly), and the total number of months you plan to invest.',
    },
    {
      question: 'Can I stop my SIP anytime?',
      answer:
        'Yes, you can pause or stop your SIP at any time. There are no penalties for stopping an SIP, unlike traditional insurance endowment policies.',
    },
    {
      question: 'Is SIP better than Lumpsum?',
      answer:
        'SIP allows for Cost Averaging, meaning you buy more units when markets are down and fewer when they are high. This averages out your cost over time and reduces market timing risk compared to Lumpsum.',
    },
    {
      question: 'What happens if I miss an SIP installment?',
      answer:
        'If you miss an installment due to insufficient bank balance, the mutual fund company does not penalize you. However, your bank might charge a bounce fee for the failed auto-debit.',
    },
    {
      question: 'Can SIP returns be guaranteed?',
      answer:
        'No, mutual fund SIP returns are linked to the market (equity or debt) and are subject to market risks. They are not guaranteed like a Bank Fixed Deposit (FD).',
    },
    {
      question: 'Can I pause my SIP if I lose my job?',
      answer:
        'Yes, most mutual fund AMCs allow you to pause your SIP mandate for up to 3 or 6 months without any penalties, and your existing corpus will continue to grow.',
    },
    {
      question: 'What is the benefit of Rupee Cost Averaging?',
      answer:
        'Because you invest a fixed amount every month, you buy more units when the market is down and fewer when it is high. This automatically lowers your average cost per unit over time.',
    },
  ];

  const relatedCalcs = getRelatedCalculators('sip-calculator');

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="SIP Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Monthly Investment"
                value={monthlyInvestment * currency.rate}
                min={(500 / 83) * currency.rate}
                max={(1000000 / 83) * currency.rate}
                step={(500 / 83) * currency.rate}
                onChange={(val) => setMonthlyInvestment(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Expected Return Rate (p.a)"
                value={expectedReturnRate}
                min={1}
                max={30}
                step={0.5}
                onChange={setExpectedReturnRate}
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
              <CardDescription>Your projected wealth creation</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 ">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 mb-1">Invested Amount</p>
                  <p className="text-base md:text-xl font-semibold">{format(result.investedAmount)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 ">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Est. Returns</p>
                  <p className="text-base md:text-xl font-semibold text-blue-600 dark:text-blue-400 dark:text-blue-600 dark:text-blue-400">
                    {format(result.estimatedReturns)}
                  </p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border-amber-500/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Total Value</p>
                  <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {format(result.totalValue)}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="growth" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="table">Data</TabsTrigger>
                </TabsList>
                <TabsContent value="growth" className="mt-4">
                  <GrowthChart
                    data={deferredAreaData}
                    xAxisKey="name"
                    areas={[
                      { key: 'Total Value', color: 'hsl(var(--primary))', name: 'Total Value' },
                      { key: 'Invested', color: 'hsl(var(--chart-3))', name: 'Amount Invested' },
                    ]}
                  />
                </TabsContent>
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
                csvFilename="sip_calculation_results.csv"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Massive Content Section for SEO */}
      <CalculatorContent>
        <h2>What is a Systematic Investment Plan (SIP)?</h2>
        <p>
          A Systematic Investment Plan (SIP) is a highly disciplined financial strategy that allows you to invest a
          fixed amount of money at regular intervals—typically monthly—into{' '}
          <Link href="/calculators/mutual-fund-returns">mutual funds</Link> or stocks. Instead of attempting to time the
          market with a massive one-time <Link href="/calculators/lumpsum-calculator">lumpsum</Link> investment, SIP
          allows you to participate in wealth creation steadily over time.
        </p>
        <p>
          By investing a fixed amount regularly regardless of market conditions, you naturally buy more units when the
          market is down and fewer units when the market is up. This phenomenon is known as{' '}
          <strong>Cost Averaging</strong>.
        </p>

        <h2>How Does the SIP Calculator Work?</h2>
        <p>
          The Numeraise SIP Calculator estimates the future value of your monthly investments by leveraging the
          mathematical power of compounding. It plots your wealth creation journey over years or decades, visually
          showing you the difference between your principal investment and your estimated capital gains.
        </p>

        <h3>The SIP Mathematical Formula</h3>
        <p>
          The core engine behind this calculator relies on the Future Value of an Annuity formula. It is expressed as:
        </p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          FV = P × [((1 + r)<sup>n</sup> - 1) / r] × (1 + r)
        </div>
        <ul>
          <li>
            <strong>FV</strong>: Future Value of your investment (Total Wealth)
          </li>
          <li>
            <strong>P</strong>: Periodic investment amount (Monthly SIP)
          </li>
          <li>
            <strong>r</strong>: Monthly rate of return (Annual Return Rate / 12 / 100)
          </li>
          <li>
            <strong>n</strong>: Total number of contributions (Years × 12)
          </li>
        </ul>

        <h3>Practical Example Calculation</h3>
        <p>
          Let's assume you want to start a monthly SIP of {format(monthlyInvestment)} for {timePeriodYears} years, and
          you expect a realistic equity return of {expectedReturnRate}% per annum.
        </p>
        <ul>
          <li>
            <strong>Monthly Investment (P):</strong> {format(monthlyInvestment)}
          </li>
          <li>
            <strong>Annual Return:</strong> {expectedReturnRate}%
          </li>
          <li>
            <strong>Tenure (n):</strong> {timePeriodYears} Years ({timePeriodYears * 12} months)
          </li>
        </ul>
        <p>
          If you plug these variables into our calculator, the engine will reveal that your total invested amount over{' '}
          {timePeriodYears} years will be <strong>{format(result.investedAmount)}</strong>. However, because of
          compounding, the estimated returns generated will be <strong>{format(result.estimatedReturns)}</strong>,
          bringing your final Future Value to an impressive <strong>{format(result.totalValue)}</strong>.
        </p>

        <h2>Major Benefits of SIP Investing</h2>
        <ol>
          <li>
            <strong>Disciplined Saving:</strong> Auto-debits force you to save before you spend, building a robust
            financial habit.
          </li>
          <li>
            <strong>Cost Averaging:</strong> You completely eliminate the stress of "timing the market" because you buy
            at all market levels automatically.
          </li>
          <li>
            <strong>The Eighth Wonder (Compounding):</strong> The longer you stay invested, the more your returns start
            generating their own returns.
          </li>
          <li>
            <strong>Flexibility:</strong> You can start with a very small amount, pause the SIP anytime, or withdraw
            funds (subject to exit loads and lock-in periods).
          </li>
        </ol>

        <h2>Common Mistakes to Avoid</h2>
        <p>
          Many novice investors make critical errors that destroy their wealth creation potential. The most common
          mistake is <strong>stopping the SIP during a market crash</strong>. Market crashes are actually when your SIP
          acquires the most units at massive discounts. Stopping during a crash defeats the entire purpose of Cost
          Averaging.
        </p>
        <p>
          Another frequent mistake is choosing an unrealistic expected return rate in the calculator. While equity
          markets have historically delivered 10-12% over the long term, expecting 20%+ consistently is a recipe for
          missed goals. Always plan conservatively.
        </p>

        <h2>Why the Last Ten Years Matter More Than the First Ten</h2>
        <p>
          The most counterintuitive property of a long SIP is that the corpus is built overwhelmingly at the end. Run a
          20-year projection and split it in half: the first decade typically contributes a small minority of the final
          value, and the second decade the large majority. Nothing changes about your contribution — the difference is
          that by year fifteen, the returns are themselves generating returns on a base that took fifteen years to
          accumulate.
        </p>
        <p>
          This has a practical consequence that catches people out. A SIP stopped at year twelve does not give you
          60% of the twenty-year outcome. It gives you far less, because you surrendered precisely the years doing the
          heaviest lifting. If you are going to start, the single most valuable decision is committing to a horizon you
          can genuinely hold through a downturn — a smaller amount you will not interrupt beats a larger one you
          abandon in year three.
        </p>

        <h2>Choosing a Realistic Return Rate</h2>
        <p>
          The expected return field is the input with the most influence over your result and the least grounding in
          fact. It is a projection, not a promise, and small changes compound into very different answers. Over 20
          years, the gap between assuming 12% and assuming 15% is not 25% more money — it is roughly 70% more, purely
          from an assumption you made in a text box.
        </p>
        <p>
          A defensible approach is to model three scenarios rather than one. Run a pessimistic case, a central case,
          and an optimistic case, then plan against the pessimistic one. If your goal is still reachable when equity
          underperforms, you have a plan. If it only works at the optimistic figure, you do not have a plan — you have
          a hope with a spreadsheet attached.
        </p>
        <p>
          Remember also that the return you enter should be a nominal figure, and inflation will erode it. A corpus
          that looks substantial in twenty years buys considerably less than the same number does today. Run the result
          through our <Link href="/calculators/inflation-calculator">inflation calculator</Link> to see the figure in
          today&apos;s purchasing power before deciding it is sufficient.
        </p>

        <h2>SIP Compared With the Alternatives</h2>
        <p>
          A SIP is not automatically the right instrument, and the honest comparison depends on your time horizon. For
          money you need within about three years, the volatility that generates the equity premium over long periods
          is simply risk — a five-year window can and does end below where it started, and being forced to sell into a
          drawdown converts a paper loss into a real one.
        </p>
        <p>
          Against a <Link href="/calculators/fd-calculator">fixed deposit</Link>, the SIP wins clearly over long
          horizons and loses clearly over short ones, with tax treatment widening the gap further: deposit interest is
          taxed annually at your slab rate, while equity gains are taxed only on sale and at more favourable long-term
          rates. Our <Link href="/compare/sip-vs-fd">SIP vs FD comparison</Link> runs both on identical assumptions.
        </p>
        <p>
          Against a <Link href="/calculators/lumpsum-calculator">lumpsum</Link>, neither dominates. A lumpsum has more
          time in the market, which mathematically favours it when markets rise steadily. A SIP averages your entry
          price across the cycle, which favours it when markets are volatile or falling early. For most people the
          question is academic — you invest monthly because that is how income arrives, not because you chose an entry
          strategy.
        </p>

        <h2>Step-Up SIP: The Easiest Improvement Available</h2>
        <p>
          A standard SIP holds your contribution flat for decades while your salary rises. A step-up SIP raises the
          instalment by a fixed percentage each year, typically matching your increment. It is the single change most
          likely to close a gap between your projection and your goal, and it costs nothing in the present because the
          increase comes from income you do not yet have.
        </p>
        <p>
          The effect is larger than it sounds. Raising a SIP by 10% annually frequently outperforms a flat SIP by a
          wide margin over twenty years, because each increase compounds for the entire remaining horizon. Model it
          with the <Link href="/calculators/step-up-sip">step-up SIP calculator</Link> before assuming a flat
          contribution is enough — for most salaried investors it is not.
        </p>

        <h2>What This Calculator Does Not Account For</h2>
        <p>
          Being explicit about the limits matters more than adding decimal places. This calculator assumes a constant
          rate of return, which no market delivers; real returns arrive unevenly, and the order in which good and bad
          years fall changes your outcome even when the average is identical.
        </p>
        <p>
          It also excludes the expense ratio charged by the fund, exit loads on early redemption, and capital gains tax
          on withdrawal — all of which reduce what you actually receive. Treat the output as an upper bound on a smooth
          path rather than a forecast, and size your plan with room to be wrong.
        </p>
      </CalculatorContent>

      <FAQAccordion faqs={faqs} />

      <RelatedCalculators calculators={relatedCalcs} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'SIP Calculator',
          description:
            'Calculate the future value of your Systematic Investment Plan with detailed charts and amortization tables.',
        }}
      />
    </div>
  );
}
