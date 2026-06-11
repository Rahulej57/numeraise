'use client';
import Link from 'next/link';

import { useState, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { CalculatorLayout } from '@/components/calculators/calculator-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Home, Key, Scale } from 'lucide-react';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from '@/config/calculators';

export default function RentVsBuyPage() {
  const { format, currency } = useCurrency();
  const [propertyValue, setPropertyValue] = useState('400000');
  const [downPayment, setDownPayment] = useState('80000');
  const [loanRate, setLoanRate] = useState('8.5');
  const [tenure, setTenure] = useState('30');
  const [propertyAppreciation, setPropertyAppreciation] = useState('3.0');

  const [currentRent, setCurrentRent] = useState('2000');
  const [rentIncrease, setRentIncrease] = useState('5');
  const [investmentReturn, setInvestmentReturn] = useState('12');

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find((c) => c.href.includes('rent-vs-buy'));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const results = useMemo(() => {
    const propVal = Number(propertyValue);
    const dp = Number(downPayment);
    const lRate = Number(loanRate) / 100;
    const years = Number(tenure);
    const propAppr = Number(propertyAppreciation) / 100;

    const rent = Number(currentRent);
    const rentInc = Number(rentIncrease) / 100;
    const invReturn = Number(investmentReturn) / 100;

    if (isNaN(propVal) || isNaN(dp) || isNaN(years) || isNaN(rent)) return null;

    // BUYING CALCULATIONS
    const loanAmount = propVal - dp;
    const monthlyRate = lRate / 12;
    const months = years * 12;

    const emi =
      loanAmount > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
        : 0;

    const totalEmiPaid = emi * months;
    const totalCostToBuy = dp + totalEmiPaid;

    // Final property value after appreciation
    const finalPropertyValue = propVal * Math.pow(1 + propAppr, years);

    // Net Worth (Buy) = Asset Value - Total Outflow
    // We assume the house is fully paid off, so asset is yours.
    // Technically, Net Profit = Final Value - Total Cost
    const buyNetWealth = finalPropertyValue - totalCostToBuy;

    // RENTING CALCULATIONS
    // Down payment is invested immediately
    let investmentPortfolio = dp;
    const monthlyInvRate = invReturn / 12;

    let currentMonthlyRent = rent;
    let totalRentPaid = 0;

    for (let m = 1; m <= months; m++) {
      // Invest the difference if EMI is higher than rent
      const differenceToInvest = emi - currentMonthlyRent;

      // Grow existing portfolio
      investmentPortfolio = investmentPortfolio * (1 + monthlyInvRate);

      // Add monthly difference (even if negative, meaning rent is more expensive than EMI)
      investmentPortfolio += differenceToInvest;

      totalRentPaid += currentMonthlyRent;

      // Increase rent annually
      if (m % 12 === 0) {
        currentMonthlyRent = currentMonthlyRent * (1 + rentInc);
      }
    }

    // Net Worth (Rent) = Investment Portfolio - Total Rent Paid
    // Wait, the \"difference\" already accounts for out-of-pocket costs exactly equal to buying.
    // If you buy, you spend DP + (EMI * months).
    // If you rent, you spend DP (invested) + (EMI * months) (split between rent and investments).
    // Therefore, the final Investment Portfolio IS the final Net Wealth for Renting.
    const rentNetWealth = investmentPortfolio;

    const diff = buyNetWealth - rentNetWealth;

    const f = (val: number) => format(val);

    return {
      emi: f(emi),
      finalPropertyValue: f(finalPropertyValue),
      totalCostToBuy: f(totalCostToBuy),
      buyNetWealth: f(buyNetWealth),

      totalRentPaid: f(totalRentPaid),
      rentNetWealth: f(rentNetWealth),

      winner: diff > 0 ? 'Buying' : diff < 0 ? 'Renting' : 'Equal',
      winnerValue: diff > 0 ? f(diff) : f(Math.abs(diff)),
    };
  }, [
    propertyValue,
    downPayment,
    loanRate,
    tenure,
    propertyAppreciation,
    currentRent,
    rentIncrease,
    investmentReturn,
    format,
    currency.rate,
  ]);

  const relatedCalcs = getRelatedCalculators('rent-vs-buy');
  return (
    <CalculatorLayout
      title="Rent vs Buy Calculator"
      description="Make the biggest financial decision of your life with mathematical certainty."
      icon={calculatorIcon ?? undefined}
    >
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-base">Buying Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Home Price ({currency.symbol})</Label>
                  <Input
                    type="number"
                    value={(Number(propertyValue) * currency.rate).toFixed(0)}
                    onChange={(e) => setPropertyValue((Number(e.target.value) / currency.rate).toString())}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Down Payment ({currency.symbol})</Label>
                  <Input
                    type="number"
                    value={(Number(downPayment) * currency.rate).toFixed(0)}
                    onChange={(e) => setDownPayment((Number(e.target.value) / currency.rate).toString())}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Loan Term (years)</Label>
                  <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Prop Appr. (%)</Label>
                  <Input
                    type="number"
                    value={propertyAppreciation}
                    onChange={(e) => setPropertyAppreciation(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border-border">
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-base">Renting Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Rent ({currency.symbol})</Label>
                  <Input
                    type="number"
                    value={(Number(currentRent) * currency.rate).toFixed(0)}
                    onChange={(e) => setCurrentRent((Number(e.target.value) / currency.rate).toString())}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rent Increase Rate (%)</Label>
                  <Input type="number" value={rentIncrease} onChange={(e) => setRentIncrease(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Investment Return Rate (%)</Label>
                  <Input type="number" value={investmentReturn} onChange={(e) => setInvestmentReturn(e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We assume you invest the Down Payment immediately, and invest the difference between your{' '}
                <Link href="/calculators/emi-calculator">EMI</Link> and Rent every single month.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-7">
          {results ? (
            <div className="space-y-6">
              <Card className="bg-card text-card-foreground border border-border shadow-md">
                <CardContent className="p-6 md:p-8 flex items-center gap-4">
                  <div className="p-4 bg-muted rounded-full shrink-0">
                    <Scale className="w-8 h-8 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">
                      {results.winner} wins by {results.winnerValue}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Over {tenure} years, {results.winner.toLowerCase()} generates {results.winnerValue} more wealth
                      compared to the alternative.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* Buy Card */}
                <Card
                  className={`border-2 ${results.winner === 'Buying' ? 'border-emerald-500 shadow-emerald-500/10' : 'border-border'} relative overflow-hidden`}
                >
                  {results.winner === 'Buying' && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>}
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="w-5 h-5 text-muted-foreground" /> Buying
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Net Wealth Built</div>
                      <div className="text-3xl font-extrabold text-foreground">{results.buyNetWealth}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Monthly EMI:</span>
                        <span className="font-semibold">{results.emi}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Outflow:</span>
                        <span className="font-semibold">{results.totalCostToBuy}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Final Prop Value:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {results.finalPropertyValue}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rent Card */}
                <Card
                  className={`border-2 ${results.winner === 'Renting' ? 'border-emerald-500 shadow-emerald-500/10' : 'border-border'} relative overflow-hidden`}
                >
                  {results.winner === 'Renting' && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>}
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="w-5 h-5 text-muted-foreground" /> Renting
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Net Wealth Built</div>
                      <div className="text-3xl font-extrabold text-foreground">{results.rentNetWealth}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Rent Paid:</span>
                        <span className="font-semibold text-rose-500">{results.totalRentPaid}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Outflow Match:</span>
                        <span className="font-semibold">{results.totalCostToBuy}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Final Inv Value:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {results.rentNetWealth}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-muted-foreground border-dashed bg-muted/20">
              Enter valid values to see the comparison.
            </Card>
          )}
        </div>
      </div>

      <CalculatorContent>
        <h2>The Great Debate: Rent vs. Buy</h2>
        <p>
          The "Rent vs. Buy" Calculator mathematically resolves the most fiercely debated topic in personal finance.
          Conventional wisdom states that "renting is throwing money away" and "buying a house is always the best
          investment." However, mathematically, this is often completely false. Buying a home involves massive
          unrecoverable costs (interest, property taxes, maintenance), while renting allows you to invest your down
          payment into the high-performing stock market.
        </p>
        <h2>How the Calculator Compares Both Paths</h2>
        <p>
          Our engine projects your total <Link href="/calculators/net-worth-calculator">net worth</Link> at the end of
          the loan tenure using two parallel universes:
        </p>

        <h3>Universe 1: You Buy the House</h3>
        <p>
          You drain your savings for a down payment. You pay a heavy monthly EMI to the bank. Over 30 years, you pay
          double the house's value in interest alone. However, the physical property appreciates in value. Your final
          Net Wealth is the appreciated value of the fully paid-off house minus everything you spent on EMIs and the
          down payment.
        </p>

        <h3>Universe 2: You Rent & Invest</h3>
        <p>
          Instead of locking your savings in a down payment, you invest it in an index fund generating 10-12% annually.
          Because your monthly rent is usually much cheaper than a{' '}
          <Link href="/calculators/home-loan-calculator">mortgage</Link> EMI, you take the monthly difference and
          aggressively invest that into the stock market too. Your final Net Wealth is the massive compounded value of
          your stock portfolio minus all the rent you paid over 30 years.
        </p>

        <h2>The Golden Rule: The 5% Rule</h2>
        <p>
          If you don't want to run a complex calculation, use the 5% Rule. Take the value of the home you want to buy
          and multiply it by 5%. Divide that by 12. If you can rent a similar home for less than that monthly amount,
          renting is mathematically superior to buying.
        </p>

        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Cost of Renting vs Cost of Owning (Mortgage + Maintenance - Appreciation)</p>
        </div>
      </CalculatorContent>
      <FAQAccordion
        faqs={[
          {
            question: "Isn't renting just paying someone else's mortgage?",
            answer:
              "Yes, but buying a house with a mortgage is just renting money from the bank. When you rent an apartment, you pay the landlord for shelter. When you buy a house with a loan, you pay the bank massive amounts of interest for capital. Neither is 'free'.",
          },
          {
            question: 'Why does renting usually win over a 30-year period?',
            answer:
              "Because of compound interest. Real estate historically appreciates at 3-5% per year above inflation. The stock market historically returns 10-12%. While the homeowner builds equity slowly, the renter's stock portfolio compounds exponentially, often resulting in millions of dollars more in liquid wealth.",
          },
          {
            question: 'So I should never buy a house?',
            answer:
              "Not necessarily. Buying a house provides immense psychological security, forced savings for undisciplined people, and stability for a family. Just don't view your primary residence as your best financial investment. View it as a lifestyle choice that you are willing to pay a premium for.",
          },
          {
            question: 'What are the hidden costs of homeownership?',
            answer:
              'Beyond the mortgage EMI, homeowners must pay property taxes, home insurance, HOA/society fees, and continuous maintenance and repair costs, which renters do not pay.',
          },
          {
            question: 'Why do people say "renting is throwing money away"?',
            answer:
              'It is a misconception. Renting provides housing flexibility and frees up capital that would otherwise be locked in a down payment, allowing you to invest it in the stock market for potentially higher returns.',
          },
        ]}
      />

      <RelatedCalculators calculators={getRelatedCalculators('rent-vs-buy')} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Rent vs Buy Calculator',
          description:
            'Mathematically compare the net wealth of buying a home versus renting and investing the difference.',
        }}
      />
    </CalculatorLayout>
  );
}
