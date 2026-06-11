'use client';
import Link from 'next/link';

import { useState, useEffect, useMemo } from 'react';
import { CalculatorLayout } from '@/components/calculators/calculator-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from '@/config/calculators';

const selectClass =
  'flex h-14 w-full items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-lg font-medium ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find((c) => c.href.includes('currency-converter'));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  useEffect(() => {
    // Using Frankfurter API (Free, no API key, ECB rates)
    fetch('https://api.frankfurter.app/latest')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        // Frankfurter returns rates based on EUR. We add EUR manually so it's in the list.
        setRates({ EUR: 1, ...data.rates });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch exchange rates', err);
        setError(true);
        setLoading(false);
        // Fallback static rates if API is down
        setRates({
          USD: 1.08,
          EUR: 1,
          GBP: 0.85,
          INR: 90.5,
          JPY: 160.2,
          CAD: 1.47,
          AUD: 1.65,
          CHF: 0.98,
          CNY: 7.8,
          SGD: 1.45,
          NZD: 1.78,
        });
      });
  }, []);

  const currencies = useMemo(() => Object.keys(rates).sort(), [rates]);

  const convertedValue = useMemo(() => {
    const a = Number(amount);
    if (isNaN(a) || a < 0 || Object.keys(rates).length === 0) return null;

    if (fromCurrency === toCurrency) return a;

    // Convert fromCurrency to base EUR, then to toCurrency
    const inEur = a / rates[fromCurrency];
    const result = inEur * rates[toCurrency];

    return result;
  }, [amount, fromCurrency, toCurrency, rates]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const relatedCalcs = getRelatedCalculators('currency-converter');
  return (
    <CalculatorLayout
      title="Currency Converter - Live Exchange Rate Calculator"
      description=""
      icon={calculatorIcon ?? undefined}
    >
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              {loading && (
                <div className="text-sm text-muted-foreground animate-pulse mb-4">Fetching live exchange rates...</div>
              )}
              {error && (
                <div className="text-sm text-amber-500 mb-4 bg-amber-500/10 p-2 rounded">
                  Using approximate offline rates. Live API is currently unavailable.
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-16 px-6 text-2xl font-bold"
                />
              </div>

              <div className="space-y-2 relative">
                <Label>From</Label>
                <div className="relative">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className={selectClass}
                    disabled={currencies.length === 0}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <button
                  onClick={swap}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
                  title="Currency Converter - Live Exchange Rate Calculator"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <div className="relative">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className={selectClass}
                    disabled={currencies.length === 0}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full min-h-[300px] flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border p-4 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Converted Amount</CardTitle>
            </CardHeader>
            <CardContent className="p-6 lg:p-8 flex-1 flex flex-col justify-center items-center text-center">
              {convertedValue === null ? (
                <div className="text-muted-foreground text-sm lg:text-base">Enter an amount to convert.</div>
              ) : (
                <>
                  <div className="text-muted-foreground text-lg lg:text-2xl font-medium mb-2">
                    {Number(amount).toLocaleString('en-US')} {fromCurrency} =
                  </div>
                  <div className="text-5xl lg:text-7xl font-extrabold tracking-tight text-primary mb-4 break-all max-w-full">
                    {convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-2xl lg:text-4xl font-bold text-muted-foreground">{toCurrency}</div>

                  {/* Exchange Rate Meta */}
                  <div className="mt-12 text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg border border-border">
                    1 {fromCurrency} ={' '}
                    {(rates[toCurrency] / rates[fromCurrency]).toLocaleString('en-US', { maximumFractionDigits: 6 })}{' '}
                    {toCurrency}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is a Live Currency Converter?</h2>
        <p>
          A currency converter is an essential financial tool that calculates the relative value of one country's
          currency against another in real-time. Because fiat currencies are traded 24/5 on the Foreign Exchange (Forex)
          market, their exact exchange rates fluctuate constantly based on global economic conditions,{' '}
          <Link href="/calculators/inflation-calculator">inflation</Link> rates, and geopolitical events.
        </p>
        <h2>How Does This Converter Work?</h2>
        <p>
          This calculator fetches live, up-to-date exchange rates directly from the European Central Bank via the
          Frankfurter API. When you select a base currency (like USD) and a target currency (like EUR), the engine pulls
          the latest official exchange ratio. It then multiplies your input amount by this ratio to give you an exact,
          real-time conversion.
        </p>

        <h3>The Conversion Mathematical Formula</h3>
        <p>
          The core logic behind currency conversion is simple multiplication, but it relies on an accurate exchange rate
          (ER):
        </p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
          <p>Converted Amount = Original Amount × (Target Rate / Base Rate)</p>
        </div>

        <h2>Common Uses for Currency Conversion</h2>
        <ul>
          <li>
            <strong>International Travel:</strong> Instantly check how much your home currency is worth in your
            destination country so you know exactly what a hotel or meal costs.
          </li>
          <li>
            <strong>E-Commerce & Freelancing:</strong> If you are buying a product priced in GBP with a USD{' '}
            <Link href="/calculators/credit-card-payoff">credit card</Link>, or if you are a freelancer invoicing an
            international client, this tool prevents you from losing money on bad conversions.
          </li>
          <li>
            <strong>Forex Trading & Remittances:</strong> Tracking exactly when it is most favorable to send money back
            to your home country based on daily rate fluctuations.
          </li>
        </ul>
      </CalculatorContent>
      <FAQAccordion
        faqs={[
          {
            question: 'Why does my credit card or bank give me a worse exchange rate?',
            answer:
              "Our calculator shows the 'mid-market' or 'interbank' rate, which is the true official rate. Banks and credit card companies typically add a 1-3% markup (a spread) as a hidden fee when converting your money.",
          },
          {
            question: 'How often are the exchange rates updated?',
            answer:
              'The rates are fetched directly from the European Central Bank, which updates its official reference rates every working day around 16:00 CET.',
          },
          {
            question: 'Can I use this calculator when I am completely offline?',
            answer:
              "Yes! While you won't get live updates, if your internet connection drops, the calculator automatically falls back to a recent set of static rates so you can still do approximate conversions while traveling without Wi-Fi.",
          },
          {
            question: 'Why do banks charge a different rate than the calculator?',
            answer:
              'Our calculator uses the mid-market rate (the true global rate). Banks add a markup spread (usually 2-5%) to make a profit when exchanging your money.',
          },
          {
            question: 'What causes currency exchange rates to fluctuate?',
            answer:
              "Exchange rates are driven by supply and demand, which are influenced by inflation, interest rates, political stability, and a country's economic performance.",
          },
        ]}
      />

      <RelatedCalculators calculators={getRelatedCalculators('currency-converter')} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Live Currency Converter',
          description:
            'Convert USD, EUR, GBP, INR, and dozens of other global currencies instantly using live, up-to-date exchange rates.',
        }}
      />
    </CalculatorLayout>
  );
}
