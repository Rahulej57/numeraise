'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import { SliderInput } from '@/components/calculators/slider-input';
import { ResultActions } from '@/components/calculators/result-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';
import { CalculatorHeader } from '@/components/calculators/calculator-header';

export default function GSTCalculatorPage() {
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState(10000 / 83);
  const [taxRate, setTaxRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const taxName = 'Sales Tax';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('mode')) setMode(params.get('mode') as any);

    // Only override from URL on initial load, otherwise update defaults based on currency
    if (params.has('amount') && !window.history.state?.initialized) {
      setAmount(Number(params.get('amount')));
    } else {
      setAmount(currency.code === 'INR' ? 10000 : 120);
    }

    if (params.has('rate') && !window.history.state?.initialized) {
      setTaxRate(Number(params.get('rate')));
    } else {
      setTaxRate(8); // Default US Sales Tax
    }

    // Mark as initialized so URL params don't override future currency switches
    window.history.replaceState({ ...window.history.state, initialized: true }, '');
  }, [currency.code]);

  const presets = [4, 6, 8, 10]; // Common US state sales tax rates

  const taxAmount = mode === 'exclusive' ? (amount * taxRate) / 100 : amount - amount * (100 / (100 + taxRate));

  const netAmount = mode === 'exclusive' ? amount + taxAmount : amount - taxAmount;

  const totalAmount = mode === 'exclusive' ? netAmount : amount;
  const originalCost = mode === 'exclusive' ? amount : netAmount;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?amount=${amount}&rate=${taxRate}&mode=${mode}`
      : '';

  const copyPayload = `${taxName} Calculation (${mode === 'exclusive' ? 'Exclusive' : 'Inclusive'}):
Original Cost: ${format(Math.round(originalCost))}
${taxName} Rate: ${taxRate}%
${taxName} Amount: ${format(Math.round(taxAmount))}

Total Price: ${format(Math.round(totalAmount))}

Calculate your own: ${shareUrl}`;

  const relatedCalcs = getRelatedCalculators('gst-calculator');
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title={`${taxName} Calculator`} />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        {/* INPUTS */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exclusive">Add {taxName}</TabsTrigger>
                  <TabsTrigger value="inclusive">Remove {taxName}</TabsTrigger>
                </TabsList>
              </Tabs>

              <SliderInput
                label={mode === 'exclusive' ? 'Original Cost' : `Total Price (inc. ${taxName})`}
                value={Math.round(amount * currency.rate)}
                min={Math.round((100 / 83) * currency.rate)}
                max={Math.round((100000 / 83) * currency.rate)}
                step={Math.round((100 / 83) * currency.rate) || 1}
                onChange={(val) => setAmount(val / currency.rate)}
                symbol={currency.symbol}
              />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Select {taxName} Rate</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                      className="w-16 h-8 text-right bg-background border rounded-md px-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setTaxRate(rate)}
                      className={`py-2 rounded-lg border text-sm font-semibold transition-all ${
                        taxRate === rate
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20 ring-offset-2 ring-offset-background'
                          : 'bg-background text-foreground hover:bg-muted'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none">
            <CardContent className="p-5 md:p-8">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Final Price</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  {format(Math.round(totalAmount))}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-background p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-muted-foreground mb-1">Original Cost</span>
                  <span className="text-lg font-bold">{format(Math.round(originalCost))}</span>
                </div>
                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                    Total {taxName} ({taxRate}%)
                  </span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {format(Math.round(taxAmount))}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <ResultActions shareUrl={shareUrl} copyPayload={copyPayload} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is a Sales Tax Calculator?</h2>
          <p>
            A Sales Tax calculator is an essential utility for consumers and businesses in regions like the United
            States, where prices on the shelf are typically displayed *without* tax. It instantly computes the exact
            amount of retail sales tax that will be added at checkout, allowing you to seamlessly calculate your final
            net price.
          </p>
          <h2>How Does the Sales Tax Engine Work?</h2>
          <p>The calculator supports the two primary calculation methods required for US commerce:</p>

          <h3>1. Exclusive (Add Tax)</h3>
          <p>Use this when you know the base price of an item and need to know the final price at checkout.</p>

          <h4>The Mathematical Formula</h4>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Tax Amount = Original Cost × (Tax Rate / 100)</p>
          </div>

          <h3>2. Inclusive (Remove Tax)</h3>
          <p>
            Use this when you see a final shelf price (like {currency.symbol}100) and need to reverse-engineer exactly
            how much of that {currency.symbol}100 is actually going to the government. The extraction formula is
            mathematically different.
          </p>

          <h4>The Mathematical Formula</h4>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Tax Amount = Total Price - (Total Price × (100 / (100 + Tax Rate)))</p>
          </div>

          <h2>Common Uses for Tax Calculation</h2>
          <ul>
            <li>
              <strong>Invoicing:</strong> Freelancers and business owners use the 'Exclusive' mode to accurately add the
              legally required state tax amount to client invoices, which helps when calculating total{' '}
              <Link href="/calculators/income-tax-calculator" className="text-primary hover:underline font-medium">
                income tax
              </Link>{' '}
              liability.
            </li>
            <li>
              <strong>Accounting:</strong> Bookkeepers use the 'Inclusive' mode to extract the exact tax amount from
              mixed receipts for tax write-offs. This tracking is important for anyone closely monitoring their{' '}
              <Link href="/calculators/net-worth-calculator" className="text-primary hover:underline font-medium">
                net worth
              </Link>
              .
            </li>
            <li>
              <strong>Consumer Budgeting:</strong> If you are relying on a{' '}
              <Link href="/calculators/budget-calculator" className="text-primary hover:underline font-medium">
                budget calculator
              </Link>{' '}
              for household expenses or an{' '}
              <Link href="/calculators/emi-calculator" className="text-primary hover:underline font-medium">
                EMI calculator
              </Link>{' '}
              for a large purchase like a car, knowing the exact final checkout price is essential in the US since shelf
              prices exclude tax.
            </li>
          </ul>
        </CalculatorContent>
        <FAQAccordion
          faqs={[
            {
              question: "Why can't I just subtract the Sales Tax percentage from the final price in Inclusive mode?",
              answer: `This is a very common mathematical error! If a ${currency.symbol}100 item gets 8% Sales Tax added, it becomes ${currency.symbol}108. If you later subtract 8% from ${currency.symbol}108, you get ${currency.symbol}99.36, not ${currency.symbol}100. To find the original pre-tax cost, you must divide the final price by 1.08.`,
            },
            {
              question: 'How does US Sales Tax differ from VAT or GST?',
              answer:
                'Sales Tax in the US is a single-stage tax, meaning it is only collected once at the final point of retail sale to the end consumer. GST and VAT, on the other other hand, are value-added taxes collected at every single stage of the supply chain.',
            },
            {
              question: 'Why do prices in the US not include tax?',
              answer:
                'Unlike Europe or Australia, the United States does not have a federal or national sales tax. Instead, sales tax is levied at the state, county, and even city level. Because these local rates vary wildly from zip code to zip code, it is nearly impossible for national retailers to print uniform "tax-inclusive" price tags.',
            },
            {
              question: 'Are grocery items subject to Sales Tax?',
              answer:
                'It depends entirely on the state. Many states exempt unprepared groceries and prescription medications from sales tax entirely, while others tax them at a heavily reduced rate.',
            },
          ]}
        />

        <RelatedCalculators calculators={getRelatedCalculators('sales-tax-calculator')} />
        <StructuredData
          type="Calculator"
          data={{
            name: 'Sales Tax Calculator',
            description:
              'Calculate US retail sales tax instantly. Easily add state and local tax to a shelf price or extract sales tax from a final receipt.',
          }}
        />
      </div>
    </div>
  );
}
