"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, TrendingDown } from "lucide-react";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";

export default function FlatVsReducingLoanPage() {
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState((500000 / 83).toString());
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");

  const results = useMemo(() => {
    const p = Number(amount);
    const r = Number(rate);
    const y = Number(years);

    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || r <= 0 || y <= 0) return null;

    const months = y * 12;

    // Flat Rate Logic
    const flatTotalInterest = p * (r / 100) * y;
    const flatTotalAmount = p + flatTotalInterest;
    const flatEmi = flatTotalAmount / months;

    // Reducing Balance Logic
    const monthlyRate = r / 100 / 12;
    const reducingEmi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const reducingTotalAmount = reducingEmi * months;
    const reducingTotalInterest = reducingTotalAmount - p;

    // Differences
    const interestDiff = flatTotalInterest - reducingTotalInterest;
    const emiDiff = flatEmi - reducingEmi;

    const f = (val: number) => format(val);

    return {
      flatEmi: f(flatEmi),
      flatTotalInterest: f(flatTotalInterest),
      flatTotalAmount: f(flatTotalAmount),
      reducingEmi: f(reducingEmi),
      reducingTotalInterest: f(reducingTotalInterest),
      reducingTotalAmount: f(reducingTotalAmount),
      interestDiff: f(interestDiff),
      emiDiff: f(emiDiff)
    };
  }, [amount, rate, years, format, currency.rate]);

  return (
    <CalculatorLayout title="Flat vs Reducing Rate Loan" description="Understand the massive difference between Flat Rate and Reducing Balance interest calculations.">
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto">
        
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-medium">{currency.symbol}</div>
                  <Input 
                    id="amount"
                    type="number" 
                    value={(Number(amount) * currency.rate).toFixed(0)}
                    onChange={(e) => setAmount((Number(e.target.value) / currency.rate).toString())}
                    className="h-12 pl-8 font-medium text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Quoted Interest Rate (%)</Label>
                <div className="relative">
                  <Input 
                    id="rate"
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="h-12 pr-8"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">%</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Loan Tenure (Years)</Label>
                <Input 
                  id="years"
                  type="number" 
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="h-12"
                />
              </div>

            </CardContent>
          </Card>

          <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold mb-1">The Flat Rate Trap</p>
              <p className="opacity-90 leading-relaxed">Dealers often quote a "Flat Rate" to make the interest look low. A 10% Flat Rate is actually equivalent to nearly a ~18% Reducing Balance rate because you are charged interest on the full initial principal for the entire tenure, even after you've paid most of it off.</p>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-7">
          {results ? (
            <div className="space-y-6">
              
              <Card className="bg-rose-500 text-white border-none shadow-md overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <TrendingDown className="w-48 h-48" />
                </div>
                <CardContent className="p-6 md:p-8 flex items-center gap-4 relative z-10">
                  <div className="p-4 bg-white/20 rounded-full shrink-0">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Flat Rate costs {results.interestDiff} more
                    </h3>
                    <p className="text-white/80 text-sm">
                      For exactly the same quoted rate, a Flat Rate loan will force you to pay {results.interestDiff} in extra interest and increase your EMI by {results.emiDiff} every month.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                
                {/* Reducing Balance Card */}
                <Card className="border-2 border-emerald-500 shadow-emerald-500/10 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg">Reducing Balance</CardTitle>
                    <p className="text-sm text-muted-foreground">Standard bank calculation.</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Monthly EMI</div>
                      <div className="text-3xl font-extrabold text-foreground">{results.reducingEmi}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">Total Interest:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{results.reducingTotalInterest}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Payment:</span>
                        <span className="font-bold">{results.reducingTotalAmount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flat Rate Card */}
                <Card className="border-2 border-rose-500 shadow-rose-500/10 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-rose-500"></div>
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg text-rose-600 dark:text-rose-400">Flat Rate</CardTitle>
                    <p className="text-sm text-muted-foreground">Usually offered by car/bike dealers.</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Monthly EMI</div>
                      <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{results.flatEmi}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-muted-foreground">Total Interest:</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">{results.flatTotalInterest}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Payment:</span>
                        <span className="font-bold">{results.flatTotalAmount}</span>
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
        <h2>What is a Flat vs Reducing Rate Loan?</h2>
        <p>A Flat vs Reducing Rate Loan Calculator is an eye-opening financial tool that exposes the true cost of borrowing. When you take out a personal loan, car loan, or two-wheeler loan, lenders will often quote a "Flat Rate" (e.g., 10%) because it sounds cheap. However, a Flat Rate is fundamentally different—and much more expensive—than the standard "Reducing Balance" rate used for home loans.</p>
        
        <h2>How Do the Calculations Differ?</h2>

        <h3>1. The Flat Rate Trap</h3>
        <p>In a Flat Rate loan, the interest is calculated on the <strong>entire original principal</strong> for the entire duration of the loan. Even after you have paid back 90% of the loan over 4 years, you are still being charged interest on the original full amount in year 5.</p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
          <p>Flat Interest = Original Principal × Flat Rate × Total Years</p>
        </div>

        <h3>2. The Reducing Balance (Effective Rate)</h3>
        <p>In a Reducing Balance loan (also known as Diminishing Balance), interest is calculated <strong>only on the outstanding principal</strong>. As you pay your EMI each month, your principal decreases, and so does the interest portion of your next EMI. This is the standard, fair way to calculate interest.</p>

        <h2>Why Dealerships Use Flat Rates</h2>
        <ul>
          <li><strong>Psychological Trick:</strong> A 10% Flat Rate sounds identical to a 10% Reducing Rate, but financially, a 10% Flat Rate is actually equivalent to an ~18% Reducing Rate.</li>
          <li><strong>Higher Commissions:</strong> Dealerships and unorganized lenders use flat rates to extract much higher total interest payouts from unsuspecting buyers while marketing "low interest rates."</li>
          <li><strong>Prepayment Penalties:</strong> Because flat rate interest is front-loaded, prepaying a flat rate loan often yields very little savings compared to prepaying a reducing balance loan.</li>
        </ul>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Reducing EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "How do I convert a Flat Rate to a Reducing Rate?",
          answer: "As a general rule of thumb, multiply the Flat Rate by 1.8x to 1.9x to find the approximate equivalent Reducing Balance rate. For example, an 8% Flat Rate is roughly equal to a 14.5% Reducing Rate."
        },
        {
          question: "Are Flat Rate loans illegal?",
          answer: "No, they are legal and very common in the auto financing and consumer durables (electronics) financing industries. However, regulators often require lenders to also disclose the 'Annual Percentage Rate' (APR) in the fine print."
        },
        {
          question: "Should I ever choose a Flat Rate loan?",
          answer: "Financially, you should always choose a Reducing Balance loan over a Flat Rate loan if the quoted numerical rates are the same. Only accept a Flat Rate loan if the equivalent Reducing Rate (roughly 1.8x the flat rate) is still cheaper than your alternative options."
        }
      ,
        {
          question: "Why is the flat rate always lower than the reducing rate?",
          answer: "Lenders advertise a 7% flat rate because it sounds incredibly cheap. However, because you pay interest on the full original principal for the entire term, a 7% flat rate is mathematically equivalent to a ~13% reducing rate."
        },
        {
          question: "Are flat rate loans legal?",
          answer: "Yes, but regulators require banks to transparently disclose the actual Annual Percentage Rate (APR) so borrowers aren't misled by the low flat rate number."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("flat-vs-reducing-loan")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Flat vs Reducing Loan Calculator",
          description: "Compare Flat Interest Rates against Reducing Balance Rates to expose the true cost of your car or personal loan."
        }} 
      />
    </CalculatorLayout>
  );
}
