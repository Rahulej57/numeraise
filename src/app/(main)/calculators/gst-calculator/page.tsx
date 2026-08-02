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
  const taxName = 'GST';

  const isIndian = currency.code === 'INR';

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
      switch (currency.code) {
        case 'INR':
          setTaxRate(18);
          break;
        case 'AUD':
          setTaxRate(10);
          break;
        case 'SGD':
          setTaxRate(9);
          break;
        case 'CAD':
          setTaxRate(13);
          break;
        case 'NZD':
          setTaxRate(15);
          break;
        default:
          setTaxRate(18);
      }
    }

    // Mark as initialized so URL params don't override future currency switches
    window.history.replaceState({ ...window.history.state, initialized: true }, '');
  }, [currency.code]);

  const getPresets = () => {
    switch (currency.code) {
      case 'INR':
        return [5, 12, 18, 28]; // Indian GST slabs
      case 'AUD':
        return [10]; // Australia GST
      case 'SGD':
        return [9]; // Singapore GST
      case 'CAD':
        return [5, 13, 15]; // Canada GST/HST
      case 'NZD':
        return [15]; // New Zealand GST
      default:
        return [5, 12, 18, 28]; // Default to most complex (India)
    }
  };
  const presets = getPresets();

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
                      inputMode="decimal"
                      aria-label={`Select ${taxName} rate in percent`}
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

              {isIndian && (
                <div className="bg-background rounded-xl border p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Central GST (CGST)</span>
                    <span className="font-medium text-foreground">
                      {format(Math.round(taxAmount / 2))} ({taxRate / 2}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>State GST (SGST)</span>
                    <span className="font-medium text-foreground">
                      {format(Math.round(taxAmount / 2))} ({taxRate / 2}%)
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <ResultActions shareUrl={shareUrl} copyPayload={copyPayload} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is a GST Calculator?</h2>
          <p>
            A GST (Goods and Services Tax) calculator is an essential utility for businesses and consumers in countries
            like India, Australia, Singapore, and Canada. It instantly computes the exact amount of tax applied to a
            purchase, allowing you to seamlessly add GST to a net price for invoicing, or extract the hidden GST from a
            gross receipt for accounting.
          </p>
          <h2>How Does the GST Engine Work?</h2>
          <p>The calculator supports the two primary GST calculation methods required for standard commerce:</p>

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
              legally required tax amount to client invoices, ensuring their{' '}
              <Link href="/calculators/income-tax-calculator" className="text-primary hover:underline font-medium">
                income tax
              </Link>{' '}
              liability is properly accounted for at the end of the financial year.
            </li>
            <li>
              <strong>Accounting:</strong> Bookkeepers use the 'Inclusive' mode to extract the exact tax amount from
              mixed receipts for tax write-offs and returns. This is crucial for maintaining an accurate{' '}
              <Link href="/calculators/net-worth-calculator" className="text-primary hover:underline font-medium">
                net worth
              </Link>
              .
            </li>
            <li>
              <strong>Consumer Budgeting:</strong> Whether you are utilizing a{' '}
              <Link href="/calculators/budget-calculator" className="text-primary hover:underline font-medium">
                budget calculator
              </Link>{' '}
              for daily expenses or using an{' '}
              <Link href="/calculators/emi-calculator" className="text-primary hover:underline font-medium">
                EMI calculator
              </Link>{' '}
              to finance a new car, knowing the exact final price is vital in countries where prices are displayed
              without tax.
            </li>
          </ul>
        </CalculatorContent>
        <FAQAccordion
          faqs={[
            {
              question: "Why can't I just subtract the GST percentage from the final price in Inclusive mode?",
              answer: `This is the most common accounting error! If a ${currency.symbol}100 item gets 18% GST added, it becomes ${currency.symbol}118. If you later subtract 18% from ${currency.symbol}118, you get ${currency.symbol}96.76, not ${currency.symbol}100. To find the original pre-GST cost, you must divide the final price by 1.18.`,
            },
            {
              question: 'Why does the calculator split GST into CGST and SGST for India (INR)?',
              answer:
                'India operates on a dual-GST model. For intra-state sales, the total Goods and Services Tax is split equally between the Central Government (CGST) and the State Government (SGST). For example, an 18% GST slab is split into 9% CGST and 9% SGST. Our calculator handles this split automatically when INR is selected.',
            },
            {
              question: 'Can I claim GST back on business purchases?',
              answer:
                'Yes, registered businesses in most GST jurisdictions can claim an Input Tax Credit (ITC) for the GST paid on eligible business purchases. This offsets the total GST they must remit to the government.',
            },
            {
              question: 'What is the Reverse Charge Mechanism (RCM) in GST?',
              answer:
                'Under standard rules, the supplier collects and pays the GST. Under the Reverse Charge Mechanism, the liability to pay GST shifts to the buyer or receiver of the goods/services.',
            },
          ]}
        />

        <RelatedCalculators calculators={getRelatedCalculators('gst-calculator')} />
        <StructuredData
          type="Calculator"
          data={{
            name: 'GST Calculator',
            description:
              'Calculate Goods and Services Tax (GST) easily. Add exclusive GST to a net price or extract inclusive GST from a gross amount. Supports CGST and SGST splits.',
          }}
        />
      </div>
    </div>
  );
}
