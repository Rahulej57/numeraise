"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SliderInput } from "@/components/calculators/slider-input";
import { HeartHandshake, ShieldAlert } from "lucide-react";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export function RetirementCalculatorClient() {
  const { format, currency } = useCurrency();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000 / 83);
  const [inflation, setInflation] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12); // Pre-retirement

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("retirement-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);
  
  const results = useMemo(() => {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
    
    // Future value of current monthly expenses at retirement age
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflation / 100, yearsToRetire);
    const annualExpenseAtRetirement = futureMonthlyExpenses * 12;
    
    // Assume a conservative 8% return post-retirement
    const postRetirementReturn = 8;
    
    // Inflation-adjusted return (Real Return)
    const realReturn = ((1 + postRetirementReturn / 100) / (1 + inflation / 100)) - 1;
    
    // Present Value of Annuity formula to find required corpus
    // PMT * [ (1 - (1+r)^-n) / r ]
    let requiredCorpus = 0;
    if (realReturn > 0) {
      requiredCorpus = annualExpenseAtRetirement * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);
    } else {
      // If real return is 0 or negative, just multiply
      requiredCorpus = annualExpenseAtRetirement * yearsInRetirement;
    }
    
    // Monthly SIP required to hit this corpus
    const monthlyRate = expectedReturn / 100 / 12;
    const monthsToRetire = yearsToRetire * 12;
    let requiredSip = 0;
    if (monthlyRate > 0 && monthsToRetire > 0) {
      requiredSip = (requiredCorpus * monthlyRate) / (Math.pow(1 + monthlyRate, monthsToRetire) - 1);
    }

    return {
      yearsToRetire,
      yearsInRetirement,
      futureMonthlyExpenses,
      requiredCorpus,
      requiredSip
    };
  }, [currentAge, retirementAge, lifeExpectancy, monthlyExpenses, inflation, expectedReturn]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
      <div className="mb-6 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
        {calculatorIcon && (
          <div className="p-3 bg-background border shadow-sm rounded-xl shrink-0">
            <div className="scale-[1.15] origin-center">{calculatorIcon}</div>
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Retirement Calculator</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Calculate the corpus needed for a comfortable retirement.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 md:p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SliderInput
                  label="Current Age"
                  value={currentAge}
                  min={18}
                  max={70}
                  step={1}
                  onChange={setCurrentAge}
                  suffix="Yr"
                />
                <SliderInput
                  label="Retirement Age"
                  value={retirementAge}
                  min={currentAge + 1}
                  max={80}
                  step={1}
                  onChange={setRetirementAge}
                  suffix="Yr"
                />
              </div>

              <div className="pt-4 border-t border-border mt-6">
                <SliderInput
                  label="Current Monthly Expenses"
                  value={monthlyExpenses * currency.rate}
                  min={(10000 / 83) * currency.rate}
                  max={(500000 / 83) * currency.rate}
                  step={(5000 / 83) * currency.rate}
                  onChange={(val) => setMonthlyExpenses(val / currency.rate)}
                  symbol={currency.symbol}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border mt-6">
                <SliderInput
                  label="Inflation"
                  value={inflation}
                  min={2}
                  max={15}
                  step={0.5}
                  onChange={setInflation}
                  suffix="%"
                />
                <SliderInput
                  label="Expected Return"
                  value={expectedReturn}
                  min={5}
                  max={20}
                  step={0.5}
                  onChange={setExpectedReturn}
                  suffix="%"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-md bg-gradient-to-br from-card to-muted/20 h-full">
            <CardHeader className="p-3 md:p-6 pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <HeartHandshake className="w-5 h-5" />
                Retirement Corpus Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">To sustain {results.yearsInRetirement} years of retirement</p>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                {format(results.requiredCorpus)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Monthly SIP Needed</p>
                  <p className="font-semibold text-sm md:text-base">{format(Math.round(results.requiredSip))}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Future Monthly Exp.</p>
                  <p className="font-semibold text-sm md:text-base text-orange-500">{format(Math.round(results.futureMonthlyExpenses))}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is a Retirement Calculator?</h2>
          <p>A Retirement Calculator helps you reverse-engineer your financial future. It tells you exactly how massive your investment portfolio needs to be on the day you retire, and exactly how much you need to invest every month today to reach that astronomical number. This is the foundational tool for the FIRE (Financial Independence, Retire Early) movement.</p>
          
          <h2>The Devastating Impact of Inflation</h2>
          <p>If your monthly expenses are {format(monthlyExpenses)} today, you cannot plan your retirement assuming you will need {format(monthlyExpenses)} a month in {Math.max(0, retirementAge - currentAge)} years. Assuming your expected {inflation}% inflation rate, that exact same lifestyle will cost almost {format(results.futureMonthlyExpenses)} a month when you retire. Our engine automatically inflates your current expenses to their future value before calculating your target corpus.</p>

          <h3>The 4% Rule (The Safe Withdrawal Rate)</h3>
          <p>How do you know how much total money you need to retire? The global gold standard is the '4% Rule' (or the 25x Rule). The theory states that if you invest your money in a diversified portfolio of stocks and bonds, you can safely withdraw 4% of your total portfolio every year (adjusted for inflation) and your money will never run out.</p>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
            <p>Target Retirement Corpus = Annual Retirement Expenses × 25</p>
          </div>

          <h2>How to Reach Your Goal Faster</h2>
          <ul>
            <li><strong>Start Earlier:</strong> Because of compound interest, every dollar you invest in your 20s is worth roughly ten times more than a dollar invested in your 40s.</li>
            <li><strong>Increase Your Savings Rate:</strong> The percentage of your income you save is the single biggest determining factor in when you can retire. Saving 50% of your income allows you to retire in roughly 15-17 years.</li>
            <li><strong>Lower Your Expected Expenses:</strong> By moving to a cheaper city or country in retirement (Geo-Arbitrage), you drastically lower your required 'Annual Expenses', which slashes your required Target Corpus by millions.</li>
          </ul>
        
          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Corpus Needed = Annual Expenses × (1 + Inflation)^Years / Safe Withdrawal Rate</p>
          </div>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "Is the 4% rule still safe today?",
            answer: "The 4% rule was based on historical US stock market data over 30-year retirement periods. While generally considered safe, conservative modern planners (like the FIRE community) often aim for a 3% or 3.5% withdrawal rate (meaning they multiply their expenses by 30x or 33x instead of 25x)."
          },
          {
            question: "Does this calculator account for Social Security or Pensions?",
            answer: `This specific calculator focuses on the portfolio you need to generate on your own. If you expect a fixed ${format(1500)}/month pension, you can manually subtract ${format(1500)} from your 'Monthly Expenses' input to see how much less portfolio you need to build.`
          },
          {
            question: "What if I plan to work part-time in retirement?",
            answer: "This is known as 'Barista FIRE' or 'Coast FIRE'. Any income you generate in retirement directly reduces the amount of money you need to withdraw from your portfolio, meaning you can retire much sooner with a smaller nest egg."
          },
          {
            question: "What is the 25x Rule?",
            answer: `A popular retirement guideline stating you need 25 times your annual expenses invested to safely retire. If you spend ${format(monthlyExpenses * 12)} a year, you need ${format(monthlyExpenses * 12 * 25)} to retire (based on the 4% withdrawal rule).`
          },
          {
            question: "Does this calculator account for inflation?",
            answer: `Yes! Failing to account for inflation is the biggest mistake in retirement planning. Your current monthly expenses of ${format(monthlyExpenses)} today will easily exceed ${format(results.futureMonthlyExpenses)} in ${Math.max(0, retirementAge - currentAge)} years due to your expected ${inflation}% inflation rate.`
          }
        ]} />
      
        <RelatedCalculators calculators={getRelatedCalculators("retirement-calculator")} />
      </div>
    </div>
  );
}
