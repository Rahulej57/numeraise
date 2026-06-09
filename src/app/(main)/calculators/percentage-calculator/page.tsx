"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function PercentageCalculatorPage() {
  const { currency } = useCurrency();
  // Mode 1: What is X% of Y?
  const [m1x, setM1x] = useState("");
  const [m1y, setM1y] = useState("");
  
  // Mode 2: X is what percent of Y?
  const [m2x, setM2x] = useState("");
  const [m2y, setM2y] = useState("");

  // Mode 3: Percentage Change
  const [m3x, setM3x] = useState("");
  const [m3y, setM3y] = useState("");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("percentage-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  return (
    <CalculatorLayout title="Percentage Calculator - Calculate Percentages and Changes" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
        
        {/* Mode 1 */}
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-4 lg:p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">What is X% of Y?</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">What is</span>
              <Input type="number" placeholder="X" value={m1x} onChange={e => setM1x(e.target.value)} className="h-10 text-center" />
              <span className="text-sm font-medium whitespace-nowrap">% of</span>
              <Input type="number" placeholder="Y" value={m1y} onChange={e => setM1y(e.target.value)} className="h-10 text-center" />
              <span className="text-sm font-medium">?</span>
            </div>
            
            <div className="mt-6 pt-4 border-t bg-muted/10 -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Result</div>
              <div className="text-3xl font-bold text-primary h-10 flex items-center justify-center">
                {m1x && m1y ? ((Number(m1x) / 100) * Number(m1y)).toLocaleString('en-US', {maximumFractionDigits: 4}) : "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode 2 */}
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-4 lg:p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">X is what percent of Y?</h3>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="X" value={m2x} onChange={e => setM2x(e.target.value)} className="h-10 text-center" />
              <span className="text-sm font-medium whitespace-nowrap">is what % of</span>
              <Input type="number" placeholder="Y" value={m2y} onChange={e => setM2y(e.target.value)} className="h-10 text-center" />
              <span className="text-sm font-medium">?</span>
            </div>
            
            <div className="mt-6 pt-4 border-t bg-muted/10 -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Result</div>
              <div className="text-3xl font-bold text-primary h-10 flex items-center justify-center">
                {m2x && m2y && Number(m2y) !== 0 ? ((Number(m2x) / Number(m2y)) * 100).toLocaleString('en-US', {maximumFractionDigits: 4}) + "%" : "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode 3 */}
        <Card className="bg-card shadow-sm border border-border">
          <CardContent className="p-4 lg:p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 mb-4">Percentage Change</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label className="w-12">From</Label>
                <Input type="number" placeholder="Value 1" value={m3x} onChange={e => setM3x(e.target.value)} className="h-10" />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-12">To</Label>
                <Input type="number" placeholder="Value 2" value={m3y} onChange={e => setM3y(e.target.value)} className="h-10" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t bg-muted/10 -mx-4 lg:-mx-6 px-4 lg:px-6 pb-2 text-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Result</div>
              <div className="text-3xl font-bold h-10 flex items-center justify-center">
                {(() => {
                  if (!m3x || !m3y || Number(m3x) === 0) return "-";
                  const v1 = Number(m3x);
                  const v2 = Number(m3y);
                  const change = ((v2 - v1) / Math.abs(v1)) * 100;
                  const isInc = change > 0;
                  const isDec = change < 0;
                  return (
                    <span className={isInc ? "text-emerald-500" : isDec ? "text-rose-500" : "text-primary"}>
                      {isInc ? "+" : ""}{change.toLocaleString('en-US', {maximumFractionDigits: 4})}%
                    </span>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <CalculatorContent>
        <h2>What is a Percentage Calculator?</h2>
        <p>A percentage calculator is a daily math utility designed to solve the three most common percentage problems encountered in business, retail, and everyday life. Whether you are trying to calculate a discount, figure out a profit margin, or determine tax rates, this tool handles the math instantly.</p>
        
        <h2>How Does It Work?</h2>
        <p>This tool provides three distinct calculation engines, each solving a different mathematical relationship:</p>

        <h3>1. What is X% of Y?</h3>
        <p>This mode is primarily used for finding discounts or tax amounts. For example, if you want to find out what a 20% discount on a {currency.symbol}150 item is, the answer is {currency.symbol}30.</p>
        
        <h4>The Mathematical Formula</h4>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Result = (X / 100) × Y</p>
          <p className="mt-2 text-xs text-muted-foreground">Example: (20 / 100) × {currency.symbol}150 = {currency.symbol}30</p>
        </div>
        
        <h3>2. X is what percent of Y?</h3>
        <p>This mode calculates proportions. If you scored 45 out of 60 on a test, you want to know what percentage that is.</p>

        <h4>The Mathematical Formula</h4>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Result = (X / Y) × 100</p>
          <p className="mt-2 text-xs text-muted-foreground">Example: (45 / 60) × 100 = 75%</p>
        </div>

        <h3>3. Percentage Change (Increase/Decrease)</h3>
        <p>This mode is crucial for business and finance. It tells you exactly how much a value grew or shrank relative to its starting point. If a stock goes from {currency.symbol}50 to {currency.symbol}60, it represents a 20% Increase.</p>

        <h4>The Mathematical Formula</h4>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Result = ((New Value - Old Value) / Old Value) × 100</p>
          <p className="mt-2 text-xs text-muted-foreground">Example: (({currency.symbol}60 - {currency.symbol}50) / {currency.symbol}50) × 100 = 20%</p>
        </div>

        <h2>Common Uses for Percentage Math</h2>
        <ul>
          <li><strong>Retail Discounts:</strong> Quickly figuring out exactly how much money a "30% Off" sale will actually save you.</li>
          <li><strong>Sales Tax:</strong> Calculating the exact amount of tax you'll owe on a major purchase based on your local tax percentage.</li>
          <li><strong>Business Growth:</strong> Calculating Month-over-Month (MoM) or Year-over-Year (YoY) revenue growth.</li>
        </ul>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Can percentages be greater than 100%?",
          answer: `Absolutely! If a company's revenue doubles from ${currency.symbol}1M to ${currency.symbol}2M, that is a 100% increase. If it triples to ${currency.symbol}3M, that is a 200% increase.`
        },
        {
          question: "Why does a 50% loss require a 100% gain to recover?",
          answer: `This is a common mathematical trap! If a ${currency.symbol}100 stock drops 50%, it's now ${currency.symbol}50. To get back to ${currency.symbol}100, that ${currency.symbol}50 must grow by ${currency.symbol}50. Since ${currency.symbol}50 is 100% of the new base (${currency.symbol}50), it requires a 100% gain just to break even.`
        },
        {
          question: "How do I calculate percentage difference manually?",
          answer: "Subtract the old value from the new value, divide that difference by the old value, and then multiply by 100."
        }
      ,
        {
          question: "What is a basis point (BPS)?",
          answer: "In finance, a basis point is one-hundredth of a percentage point (0.01%). So, if an interest rate drops by 50 basis points, it means it dropped by 0.5%."
        },
        {
          question: "Are percentages reversible?",
          answer: "Yes! X% of Y is exactly equal to Y% of X. For example, 8% of 50 is the exact same as 50% of 8 (which is 4). This trick makes mental math much easier."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("percentage-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Percentage Calculator",
          description: "Calculate standard percentages, proportions, and percentage changes (increases or decreases) instantly."
        }} 
      />
    </CalculatorLayout>
  );
}
