'use client';

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
import { calculateEMI } from '@/lib/calculations/loan';
import { CalculatorHeader } from '@/components/calculators/calculator-header';

export default function LeaseVsBuyCalculatorPage() {
  const { format, currency } = useCurrency();

  // General Car Details
  const [carPrice, setCarPrice] = useState(35000);
  const [salesTax, setSalesTax] = useState(7.0);
  const [downPayment, setDownPayment] = useState(5000);

  // Buy Details
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [loanInterestRate, setLoanInterestRate] = useState(6.5);

  // Lease Details
  const [leaseTerm, setLeaseTerm] = useState(36); // months
  const [leaseInterestRate, setLeaseInterestRate] = useState(7.5); // APR
  const [residualValuePercent, setResidualValuePercent] = useState(55); // % of car price

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('price')) setCarPrice(Number(params.get('price')));
  }, []);

  const result = useMemo(() => {
    // BUYING CALCULATIONS
    const totalCarCost = carPrice * (1 + salesTax / 100);
    const loanAmount = totalCarCost - downPayment;
    const buyEmiResult = calculateEMI(loanAmount, loanInterestRate, loanTerm / 12);
    const buyMonthlyPayment = buyEmiResult.emi;

    // Out of pocket to buy over the length of the *lease term* (for an apples-to-apples comparison)
    const buyOutOfPocketOverLeaseTerm = downPayment + buyMonthlyPayment * leaseTerm;

    // Calculate remaining loan balance at the end of the lease term
    let remainingLoanBalance = loanAmount;
    const monthlyRate = loanInterestRate / 12 / 100;
    for (let i = 0; i < leaseTerm; i++) {
      const interestPaid = remainingLoanBalance * monthlyRate;
      const principalPaid = buyMonthlyPayment - interestPaid;
      remainingLoanBalance -= principalPaid;
    }

    // Estimated value of the car at the end of the lease term
    const carValueAtEnd = carPrice * (residualValuePercent / 100);

    // Equity = Value - Debt
    const equityAtEnd = carValueAtEnd - remainingLoanBalance;

    // True cost to buy = Total paid - Equity you get to keep
    const trueCostToBuy = buyOutOfPocketOverLeaseTerm - equityAtEnd;

    // LEASING CALCULATIONS
    const residualValueAmount = carPrice * (residualValuePercent / 100);
    // Capitalized Cost is the negotiated price minus down payment
    const capCost = carPrice - downPayment;

    // Depreciation Fee
    const depreciationFee = (capCost - residualValueAmount) / leaseTerm;

    // Finance Fee (using APR directly converted to Money Factor format equivalent)
    // Money Factor = APR / 2400. Fee = (Cap Cost + Residual) * Money Factor
    const moneyFactor = leaseInterestRate / 2400;
    const financeFee = (capCost + residualValueAmount) * moneyFactor;

    // Monthly Lease Payment (pre-tax)
    const monthlyLeasePreTax = depreciationFee + financeFee;

    // Monthly Lease Payment (with tax applied to the monthly payment in most states)
    const leaseMonthlyPayment = monthlyLeasePreTax * (1 + salesTax / 100);

    // Total out of pocket to lease
    const trueCostToLease = downPayment + leaseMonthlyPayment * leaseTerm;

    return {
      buyMonthlyPayment,
      buyOutOfPocketOverLeaseTerm,
      equityAtEnd,
      trueCostToBuy,

      leaseMonthlyPayment,
      trueCostToLease,

      carValueAtEnd,
      remainingLoanBalance,
    };
  }, [carPrice, salesTax, downPayment, loanTerm, loanInterestRate, leaseTerm, leaseInterestRate, residualValuePercent]);

  const betterOption = result.trueCostToBuy < result.trueCostToLease ? 'Buying' : 'Leasing';
  const savings = Math.abs(result.trueCostToBuy - result.trueCostToLease);

  const pieData = useMemo(
    () => [
      { name: 'Cost to Buy (Net)', value: result.trueCostToBuy, color: 'var(--chart-1)' },
      { name: 'Cost to Lease', value: result.trueCostToLease, color: 'var(--chart-2)' },
    ],
    [result],
  );

  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?price=${carPrice}` : '';

  const copyPayload = `Lease vs Buy Comparison (${leaseTerm} Months):
Car Price: ${format(carPrice)}

BUYING:
Monthly Payment: ${format(result.buyMonthlyPayment)}
Net Cost over ${leaseTerm} mo: ${format(result.trueCostToBuy)}

LEASING:
Monthly Payment: ${format(result.leaseMonthlyPayment)}
Net Cost over ${leaseTerm} mo: ${format(result.trueCostToLease)}

${betterOption} saves you ${format(savings)} over ${leaseTerm} months!
Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: 'Why do we compare the costs over the Lease Term?',
      answer:
        "To make an 'apples-to-apples' comparison, we must evaluate both options over the same time horizon. If you lease for 3 years, we calculate how much it costs to lease for 3 years, versus how much it would cost to buy the car, drive it for 3 years, and then sell it.",
    },
    {
      question: 'What is a Residual Value?',
      answer:
        'Residual value is the estimated value of the car at the end of the lease. If you buy a $30,000 car and the leasing company sets a 50% residual value for a 3-year lease, they are estimating the car will be worth $15,000 in 3 years. You only pay for the $15,000 of depreciation during your lease.',
    },
    {
      question: 'Is leasing always a bad financial decision?',
      answer:
        'Not always. While buying a slightly used car and driving it for 10 years is universally the cheapest option, if you are someone who buys a brand new car every 3 years anyway, leasing is often cheaper than buying and trading in because you avoid taking the massive initial depreciation hit yourself.',
    },
    {
      question: 'What is a Money Factor?',
      answer:
        "A Money Factor (often seen as something like 0.00250) is simply the dealership's way of expressing an interest rate on a lease. To convert a Money Factor to a standard Annual Percentage Rate (APR), simply multiply it by 2400. (e.g. 0.00250 * 2400 = 6% APR).",
    },
    {
      question: 'Is leasing a car cheaper than buying?',
      answer:
        "Leasing offers lower monthly payments because you are only paying for the vehicle's depreciation during the lease term. However, buying is cheaper in the long run because you eventually own a driving asset with no monthly payments.",
    },
    {
      question: 'Can I customize a leased car?',
      answer:
        'Generally, no. You must return the car in its original condition. Any permanent modifications or severe wear-and-tear will result in heavy penalty charges at the end of the lease.',
    },
  ];

  const relatedCalcs = getRelatedCalculators('lease-vs-buy');

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Lease vs. Buy Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Car Price (Negotiated)"
                value={carPrice * currency.rate}
                min={10000 * currency.rate}
                max={150000 * currency.rate}
                step={1000 * currency.rate}
                onChange={(val) => setCarPrice(val / currency.rate)}
                symbol={currency.symbol}
              />
              <div className="grid grid-cols-2 gap-4">
                <SliderInput
                  label="Sales Tax"
                  value={salesTax}
                  min={0}
                  max={15}
                  step={0.5}
                  onChange={setSalesTax}
                  suffix="%"
                />
                <SliderInput
                  label="Down Payment / Due at Signing"
                  value={downPayment * currency.rate}
                  min={0}
                  max={carPrice * currency.rate}
                  step={500 * currency.rate}
                  onChange={(val) => setDownPayment(val / currency.rate)}
                  symbol={currency.symbol}
                />
              </div>

              <Tabs defaultValue="buy" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buying Details</TabsTrigger>
                  <TabsTrigger value="lease">Leasing Details</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="mt-4 space-y-6">
                  <SliderInput
                    label="Auto Loan Term"
                    value={loanTerm}
                    min={24}
                    max={84}
                    step={12}
                    onChange={setLoanTerm}
                    suffix=" Mo"
                  />
                  <SliderInput
                    label="Auto Loan Interest Rate"
                    value={loanInterestRate}
                    min={1}
                    max={20}
                    step={0.1}
                    onChange={setLoanInterestRate}
                    suffix="%"
                  />
                </TabsContent>
                <TabsContent value="lease" className="mt-4 space-y-6">
                  <SliderInput
                    label="Lease Term"
                    value={leaseTerm}
                    min={24}
                    max={48}
                    step={12}
                    onChange={setLeaseTerm}
                    suffix=" Mo"
                  />
                  <SliderInput
                    label="Lease Interest Rate (APR)"
                    value={leaseInterestRate}
                    min={1}
                    max={15}
                    step={0.1}
                    onChange={setLeaseInterestRate}
                    suffix="%"
                  />
                  <SliderInput
                    label="Residual Value (After Lease)"
                    value={residualValuePercent}
                    min={30}
                    max={80}
                    step={1}
                    onChange={setResidualValuePercent}
                    suffix="%"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Financial Comparison</CardTitle>
              <CardDescription>Over a {leaseTerm}-month period</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="text-center mb-6 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Winner</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                  {betterOption} is Better
                </h2>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  Saves you {format(savings)} over {leaseTerm} months
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                    Buy Monthly Pmt
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {format(result.buyMonthlyPayment)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">True Cost: {format(result.trueCostToBuy)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                    Lease Monthly Pmt
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {format(result.leaseMonthlyPayment)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">True Cost: {format(result.trueCostToLease)}</p>
                </div>
              </div>

              {result.equityAtEnd > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg border text-sm text-muted-foreground mb-6 text-center">
                  When buying, you gain <strong>{format(result.equityAtEnd)}</strong> in vehicle equity after{' '}
                  {leaseTerm} months, which significantly offsets the higher monthly payments.
                </div>
              )}

              <div className="mt-6 mb-4">
                <BreakdownChart data={pieData} />
              </div>

              <ResultActions shareUrl={shareUrl} copyPayload={copyPayload} />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>Should I Lease or Buy a Car?</h2>
        <p>
          The decision to lease or buy a car is one of the most debated topics in personal finance. Dealerships often
          push leases because the monthly payment is lower, making it easier to sell you a more expensive car. However,
          a lower monthly payment does not always mean it is cheaper.
        </p>
        <h2>How the Calculation Works</h2>
        <p>
          To accurately compare leasing and buying, we have to look at the same time horizon (the length of the lease).
          Here is how the math breaks down:
        </p>

        <h3>1. The True Cost of Buying</h3>
        <p>
          When you buy a car, your monthly payments are higher because you are paying for the <em>entire</em> value of
          the car. However, after 3 years, you own a highly valuable asset. To find your "true cost," we calculate all
          the payments you made over 3 years, and then subtract the equity you built up in the car (its resale value
          minus your remaining loan balance).
        </p>

        <h3>2. The True Cost of Leasing</h3>
        <p>
          When you lease a car, you are only paying for the depreciation that occurs during those 3 years, plus a
          finance fee. Your monthly payments are lower, but at the end of the 3 years, you must return the car. You have
          zero equity. Your "true cost" is simply every dollar you spent during the lease.
        </p>

        <h2>When Leasing Makes Sense</h2>
        <p>
          Financially, buying a reliable car and driving it for 10 years is always the cheapest option. However, leasing
          can make sense if:
        </p>
        <ul>
          <li>You own a business and can write off the lease payments as a business expense.</li>
          <li>
            You insist on driving a brand new car every 3 years anyway. If you buy a new car and trade it in every 3
            years, you are absorbing the worst part of the depreciation curve yourself, making it often more expensive
            than a subsidized lease.
          </li>
          <li>You want the absolute lowest monthly payment to preserve monthly cash flow.</li>
        </ul>

        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Net Cost = Total Payments + Opportunity Cost - Residual Value</p>
        </div>
      </CalculatorContent>

      <FAQAccordion faqs={faqs} />

      <RelatedCalculators calculators={relatedCalcs} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Lease vs Buy Calculator',
          description:
            'Compare the true financial cost of financing a car versus leasing it over the same time period.',
        }}
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
