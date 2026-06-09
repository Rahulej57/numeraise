"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SliderInput } from "@/components/calculators/slider-input";
import { TrendingUp, ArrowRight } from "lucide-react";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export function CagrCalculatorClient() {
  const { format, currency } = useCurrency();
  const [initialValue, setInitialValue] = useState(100000 / 83);
  const [finalValue, setFinalValue] = useState(250000 / 83);
  const [years, setYears] = useState(5);

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("cagr-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const results = useMemo(() => {
    const iv = initialValue;
    const fv = finalValue;
    const y = years;
    
    // CAGR Formula: (FV / IV)^(1/t) - 1
    const cagr = iv > 0 && y > 0 ? Math.pow(fv / iv, 1 / y) - 1 : 0;
    const cagrPercentage = cagr * 100;
    
    const absoluteReturn = fv - iv;
    const absoluteReturnPercentage = iv > 0 ? (absoluteReturn / iv) * 100 : 0;

    return {
      cagr: cagrPercentage.toFixed(2),
      absoluteReturn,
      absoluteReturnPercentage: absoluteReturnPercentage.toFixed(2),
    };
  }, [initialValue, finalValue, years]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
      <div className="mb-6 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
        {calculatorIcon && (
          <div className="p-3 bg-background border shadow-sm rounded-xl shrink-0">
            <div className="scale-[1.15] origin-center">{calculatorIcon}</div>
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">CAGR Calculator</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Calculate the Compound Annual Growth Rate of your investments.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 md:p-6 space-y-6">
              
              <SliderInput
                label="Initial Investment Value"
                value={initialValue * currency.rate}
                min={(1000 / 83) * currency.rate}
                max={(10000000 / 83) * currency.rate}
                step={(1000 / 83) * currency.rate}
                onChange={(val) => setInitialValue(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Final Investment Value"
                value={finalValue * currency.rate}
                min={(1000 / 83) * currency.rate}
                max={(50000000 / 83) * currency.rate}
                step={(1000 / 83) * currency.rate}
                onChange={(val) => setFinalValue(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Duration"
                value={years}
                min={1}
                max={40}
                step={1}
                onChange={setYears}
                suffix="Yr"
              />
              
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-md bg-gradient-to-br from-card to-muted/20 h-full">
            <CardHeader className="p-3 md:p-6 pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                CAGR Result
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">Compound Annual Growth Rate</p>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                {results.cagr}%
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Absolute Return</p>
                  <p className={`font-semibold text-sm md:text-base ${results.absoluteReturn >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {results.absoluteReturn > 0 ? '+' : ''}{format(results.absoluteReturn)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Absolute Return %</p>
                  <p className={`font-semibold text-sm md:text-base ${Number(results.absoluteReturnPercentage) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {Number(results.absoluteReturnPercentage) > 0 ? '+' : ''}{results.absoluteReturnPercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is CAGR (Compound Annual Growth Rate)?</h2>
          <p>Compound Annual Growth Rate (CAGR) is a crucial financial metric used to measure the smoothed, annualized return of an investment over a specified period of time. Unlike absolute return, which simply measures the total percentage gained or lost, CAGR factors in the effect of compounding, giving you a mathematically accurate picture of how much your investment grew <em>each year</em> on average.</p>
          
          <h2>How Does the CAGR Calculator Work?</h2>
          <p>This calculator requires three simple inputs: your initial investment amount, the final current value of the investment, and the number of years you held it. The mathematical engine then applies the standard CAGR formula to extract the exact annualized growth rate, effectively stripping away market volatility to show a smooth growth curve.</p>

          <h3>The CAGR Mathematical Formula</h3>
          <p>The core engine behind this calculator relies on the standard compound growth equation. It is expressed as:</p>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
            <p>CAGR = [(Final Value / Initial Value) ^ (1 / Number of Years)] - 1</p>
          </div>

          <h2>Major Benefits of Using CAGR</h2>
          <ul>
            <li><strong>Apples-to-Apples Comparison:</strong> CAGR allows you to compare the historical performance of two entirely different assets (like Real Estate vs. Stocks) over the exact same time period.</li>
            <li><strong>Smoothing Volatility:</strong> An asset might jump 30% one year and crash 10% the next. CAGR smooths out this wild ride to show you the true, steady underlying growth rate.</li>
            <li><strong>Future Forecasting:</strong> If a mutual fund has a 10-year historical CAGR of 8%, you can confidently plug that 8% into a future value calculator to estimate your retirement.</li>
          </ul>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "What is a 'good' CAGR?",
            answer: "It depends entirely on the asset class and your risk tolerance. Historically, the S&P 500 has delivered a CAGR of about 7-10% (after inflation). Anything consistently above 10-12% over a long period is generally considered exceptional."
          },
          {
            question: "Does CAGR account for regular monthly deposits?",
            answer: "No! CAGR strictly measures the growth of a single, lump-sum investment over time. If you are making regular monthly contributions, you should use our SIP Calculator instead."
          },
          {
            question: "What is the difference between CAGR and Absolute Return?",
            answer: "Absolute Return just tells you total profit (e.g., 'I made 50%'). It ignores time. Making 50% over 1 year is amazing; making 50% over 20 years is terrible. CAGR factors in the time it took to achieve that return."
          }
        ]} />
      </div>
    </div>
  );
}
