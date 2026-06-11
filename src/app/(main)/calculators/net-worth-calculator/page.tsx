'use client';
import Link from 'next/link';

import { useState, useMemo, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { SliderInput } from '@/components/calculators/slider-input';
import { BreakdownChart } from '@/components/charts/breakdown-chart';
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

export default function NetWorthCalculatorPage() {
  const { format, currency } = useCurrency();

  // Assets
  const [cash, setCash] = useState(10000);
  const [investments, setInvestments] = useState(50000);
  const [retirement, setRetirement] = useState(25000);
  const [realEstate, setRealEstate] = useState(300000);
  const [vehicles, setVehicles] = useState(20000);
  const [otherAssets, setOtherAssets] = useState(5000);

  // Liabilities
  const [mortgage, setMortgage] = useState(200000);
  const [autoLoans, setAutoLoans] = useState(15000);
  const [studentLoans, setStudentLoans] = useState(20000);
  const [creditCards, setCreditCards] = useState(2000);
  const [otherDebt, setOtherDebt] = useState(0);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('cash')) setCash(Number(params.get('cash')));
    if (params.has('investments')) setInvestments(Number(params.get('investments')));
    if (params.has('retirement')) setRetirement(Number(params.get('retirement')));
    if (params.has('realEstate')) setRealEstate(Number(params.get('realEstate')));
    if (params.has('vehicles')) setVehicles(Number(params.get('vehicles')));
    if (params.has('mortgage')) setMortgage(Number(params.get('mortgage')));
    if (params.has('studentLoans')) setStudentLoans(Number(params.get('studentLoans')));
  }, []);

  const totalAssets = cash + investments + retirement + realEstate + vehicles + otherAssets;
  const totalLiabilities = mortgage + autoLoans + studentLoans + creditCards + otherDebt;
  const netWorth = totalAssets - totalLiabilities;

  const assetsPieData = useMemo(
    () =>
      [
        { name: 'Cash & Bank', value: cash, color: 'var(--chart-1)' },
        { name: 'Investments', value: investments, color: 'var(--chart-2)' },
        { name: 'Retirement', value: retirement, color: 'var(--chart-3)' },
        { name: 'Real Estate', value: realEstate, color: 'var(--chart-4)' },
        { name: 'Vehicles & Other', value: vehicles + otherAssets, color: 'var(--chart-5)' },
      ].filter((d) => d.value > 0),
    [cash, investments, retirement, realEstate, vehicles, otherAssets],
  );

  const liabilitiesPieData = useMemo(
    () =>
      [
        { name: 'Mortgage', value: mortgage, color: 'var(--chart-1)' },
        { name: 'Auto Loans', value: autoLoans, color: 'var(--chart-2)' },
        { name: 'Student Loans', value: studentLoans, color: 'var(--chart-3)' },
        { name: 'Credit Cards & Other', value: creditCards + otherDebt, color: 'var(--chart-4)' },
      ].filter((d) => d.value > 0),
    [mortgage, autoLoans, studentLoans, creditCards, otherDebt],
  );

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?cash=${cash}&investments=${investments}&retirement=${retirement}&realEstate=${realEstate}&vehicles=${vehicles}&mortgage=${mortgage}&studentLoans=${studentLoans}`
      : '';

  const copyPayload = `Net Worth Calculation:
Total Assets: ${format(totalAssets)}
Total Liabilities: ${format(totalLiabilities)}
----------------------
Net Worth: ${format(netWorth)}

Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: 'What is Net Worth?',
      answer:
        'Net worth is the value of all the non-financial and financial assets owned by an individual minus the value of all their outstanding liabilities (debts). It is the most accurate measure of your true financial health.',
    },
    {
      question: 'How is Net Worth calculated?',
      answer: `Net Worth = Total Assets (what you own) - Total Liabilities (what you owe). For example, if you own a house worth ${currency.symbol}500,000 but have a ${currency.symbol}300,000 mortgage on it, your net worth from that house is ${currency.symbol}200,000.`,
    },
    {
      question: 'Is my income part of my Net Worth?',
      answer: `No. Income is what you earn, while net worth is what you keep. A person earning ${currency.symbol}500,000 a year who spends ${currency.symbol}500,000 a year has a net worth of zero. Income only increases your net worth if you save or invest it.`,
    },
    {
      question: 'Can Net Worth be negative?',
      answer:
        "Yes, absolutely. A negative net worth happens when your total debt exceeds your total assets. This is very common for recent college graduates who have high student loan debt but haven't had time to build up assets yet.",
    },
    {
      question: 'Is a primary residence included in net worth?',
      answer:
        'Yes, standard net worth calculations include the market value of your home as an asset, and the outstanding mortgage as a liability. However, "Liquid Net Worth" entirely excludes real estate.',
    },
    {
      question: 'What is a good net worth for my age?',
      answer:
        'A popular formula by Thomas Stanley (author of The Millionaire Next Door) is: (Age × Pre-Tax Annual Income) ÷ 10. If your net worth is higher than this number, you are doing well.',
    },
  ];

  const relatedCalcs = getRelatedCalculators('net-worth-calculator');

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Net Worth Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assets">Your Assets (+)</TabsTrigger>
              <TabsTrigger value="liabilities">Your Liabilities (-)</TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="mt-4">
              <Card className="border-none shadow-none bg-muted/20">
                <CardContent className="p-5 md:p-6 space-y-6">
                  <SliderInput
                    label="Cash & Bank Accounts"
                    value={cash * currency.rate}
                    min={0}
                    max={1000000 * currency.rate}
                    step={1000 * currency.rate}
                    onChange={(val) => setCash(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Investments (Stocks, Mutual Funds)"
                    value={investments * currency.rate}
                    min={0}
                    max={5000000 * currency.rate}
                    step={5000 * currency.rate}
                    onChange={(val) => setInvestments(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Retirement Accounts"
                    value={retirement * currency.rate}
                    min={0}
                    max={5000000 * currency.rate}
                    step={5000 * currency.rate}
                    onChange={(val) => setRetirement(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Real Estate (Market Value)"
                    value={realEstate * currency.rate}
                    min={0}
                    max={10000000 * currency.rate}
                    step={10000 * currency.rate}
                    onChange={(val) => setRealEstate(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Vehicles"
                    value={vehicles * currency.rate}
                    min={0}
                    max={500000 * currency.rate}
                    step={1000 * currency.rate}
                    onChange={(val) => setVehicles(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="liabilities" className="mt-4">
              <Card className="border-none shadow-none bg-rose-500/5">
                <CardContent className="p-5 md:p-6 space-y-6">
                  <SliderInput
                    label="Mortgage Outstanding"
                    value={mortgage * currency.rate}
                    min={0}
                    max={10000000 * currency.rate}
                    step={10000 * currency.rate}
                    onChange={(val) => setMortgage(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Auto Loans"
                    value={autoLoans * currency.rate}
                    min={0}
                    max={500000 * currency.rate}
                    step={1000 * currency.rate}
                    onChange={(val) => setAutoLoans(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Student Loans"
                    value={studentLoans * currency.rate}
                    min={0}
                    max={1000000 * currency.rate}
                    step={1000 * currency.rate}
                    onChange={(val) => setStudentLoans(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                  <SliderInput
                    label="Credit Card Debt"
                    value={creditCards * currency.rate}
                    min={0}
                    max={100000 * currency.rate}
                    step={500 * currency.rate}
                    onChange={(val) => setCreditCards(val / currency.rate)}
                    symbol={currency.symbol}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Your financial health overview</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="text-center mb-6 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Net Worth</p>
                <h2
                  className={`text-4xl md:text-5xl font-extrabold tracking-tight ${netWorth < 0 ? 'text-rose-500' : 'text-primary'}`}
                >
                  {format(netWorth)}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 mb-1">Total Assets</p>
                  <p className="text-base md:text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {format(totalAssets)}
                  </p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs md:text-sm text-rose-600 dark:text-rose-400 mb-1">Total Liabilities</p>
                  <p className="text-base md:text-xl font-semibold text-rose-600 dark:text-rose-400">
                    {format(totalLiabilities)}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="assetsBreakdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="assetsBreakdown">Assets</TabsTrigger>
                  <TabsTrigger value="liabilitiesBreakdown">Liabilities</TabsTrigger>
                </TabsList>
                <TabsContent value="assetsBreakdown" className="mt-4">
                  <BreakdownChart data={assetsPieData} />
                </TabsContent>
                <TabsContent value="liabilitiesBreakdown" className="mt-4">
                  <BreakdownChart data={liabilitiesPieData} />
                </TabsContent>
              </Tabs>

              <ResultActions shareUrl={shareUrl} copyPayload={copyPayload} />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is a Net Worth Calculator?</h2>
        <p>
          A Net Worth Calculator is the ultimate diagnostic tool for your personal finances. Unlike tracking your income
          or your monthly budget, your net worth provides a holistic, big-picture snapshot of your true financial health
          by balancing everything you own against everything you owe.
        </p>
        <h2>How to Calculate Your Net Worth</h2>
        <p>The mathematical formula for net worth is brilliantly simple:</p>
        <div className="p-4 bg-muted/50 rounded-lg border font-mono text-center text-lg my-6">
          Net Worth = Total Assets - Total Liabilities
        </div>

        <h3>1. Total Assets (What You Own)</h3>
        <p>
          Assets are anything that has a positive cash value that could theoretically be sold for cash. This includes:
        </p>
        <ul>
          <li>
            <strong>Liquid Assets:</strong> Cash in your wallet, checking accounts, and savings accounts.
          </li>
          <li>
            <strong>Investments:</strong> Brokerage accounts,{' '}
            <Link href="/calculators/mutual-fund-returns">mutual funds</Link>, stocks, bonds, and crypto.
          </li>
          <li>
            <strong>
              <Link href="/calculators/retirement-calculator">Retirement</Link> Accounts:
            </strong>{' '}
            401(k)s, IRAs, <Link href="/calculators/epf-calculator">EPF</Link>,{' '}
            <Link href="/calculators/ppf-calculator">PPF</Link>, and pensions.
          </li>
          <li>
            <strong>Real Estate:</strong> The current market value (not what you paid for it) of your primary residence
            and any rental properties.
          </li>
          <li>
            <strong>Personal Property:</strong> The resale value of your cars, jewelry, and high-value collectibles.
          </li>
        </ul>

        <h3>2. Total Liabilities (What You Owe)</h3>
        <p>
          Liabilities are your debts—money that you are legally obligated to pay back to someone else. This includes:
        </p>
        <ul>
          <li>
            <strong>Mortgages:</strong> The remaining principal balance on your home loan.
          </li>
          <li>
            <strong>Installment Loans:</strong> Outstanding balances on auto loans and student loans.
          </li>
          <li>
            <strong>Revolving Debt:</strong> Balances carried on credit cards or personal lines of credit.
          </li>
        </ul>

        <h2>Why Your Net Worth is More Important Than Your Income</h2>
        <p>
          Society often judges financial success by income (e.g., earning a "six-figure salary"). However, income is
          only half the equation. If you earn {currency.symbol}200,000 a year but spend {currency.symbol}200,000 a year
          on luxury cars, expensive rent, and vacations, you are generating massive cash flow, but your net worth
          remains zero.
        </p>
        <p>
          Conversely, someone earning {currency.symbol}60,000 a year who diligently saves, invests in index funds, and
          pays off their mortgage early can slowly build a net worth in the millions. Net worth is the true scorecard of
          wealth accumulation.
        </p>
      </CalculatorContent>

      <FAQAccordion faqs={faqs} />

      <RelatedCalculators calculators={relatedCalcs} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Net Worth Calculator',
          description:
            'Calculate your true financial net worth by balancing your total assets against your total liabilities and debts.',
        }}
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
