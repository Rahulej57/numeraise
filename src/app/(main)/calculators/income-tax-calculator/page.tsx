"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultActions } from "@/components/calculators/result-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function IncomeTaxCalculatorPage() {
  const { format, currency } = useCurrency();
  const [salary, setSalary] = useState(100000);
  const [exemptions, setExemptions] = useState(0);
  const [regime, setRegime] = useState<"new" | "old">("new");

  const isIndian = currency.code === 'INR';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('salary')) setSalary(Number(params.get('salary')));
    if (params.has('exemptions')) setExemptions(Number(params.get('exemptions')));
    if (params.has('regime')) setRegime(params.get('regime') as any);
  }, []);

  const calculateTaxDetails = () => {
    let incomeTax = 0;
    let extraTaxes: { label: string, amount: number }[] = [];
    const localSalary = salary * currency.rate;
    const localExemptions = exemptions * currency.rate;
    let standardDeduction = 0;
    
    if (currency.code === 'INR') {
      standardDeduction = 50000;
      if (regime === "new") {
        const taxable = Math.max(0, localSalary - standardDeduction);
        if (taxable > 300000) incomeTax += Math.min(taxable - 300000, 300000) * 0.05;
        if (taxable > 600000) incomeTax += Math.min(taxable - 600000, 300000) * 0.10;
        if (taxable > 900000) incomeTax += Math.min(taxable - 900000, 300000) * 0.15;
        if (taxable > 1200000) incomeTax += Math.min(taxable - 1200000, 300000) * 0.20;
        if (taxable > 1500000) incomeTax += (taxable - 1500000) * 0.30;
        // rebate
        if (taxable <= 700000) incomeTax = 0;
      } else {
        const taxable = Math.max(0, localSalary - localExemptions - standardDeduction);
        if (taxable > 250000) incomeTax += Math.min(taxable - 250000, 250000) * 0.05;
        if (taxable > 500000) incomeTax += Math.min(taxable - 500000, 500000) * 0.20;
        if (taxable > 1000000) incomeTax += (taxable - 1000000) * 0.30;
        // rebate
        if (taxable <= 500000) incomeTax = 0;
      }
      incomeTax = Math.round(incomeTax * 1.04); // 4% Health & Education Cess
      return { totalTax: incomeTax / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: standardDeduction / currency.rate }; 
    }
    
    if (currency.code === 'USD') {
      standardDeduction = 14600;
      const taxable = Math.max(0, localSalary - localExemptions - standardDeduction);
      if (taxable > 0) incomeTax += Math.min(taxable, 11600) * 0.10;
      if (taxable > 11600) incomeTax += Math.min(taxable - 11600, 35550) * 0.12;
      if (taxable > 47150) incomeTax += Math.min(taxable - 47150, 53375) * 0.22;
      if (taxable > 100525) incomeTax += Math.min(taxable - 100525, 91425) * 0.24;
      if (taxable > 191950) incomeTax += Math.min(taxable - 191950, 51775) * 0.32;
      if (taxable > 243725) incomeTax += Math.min(taxable - 243725, 334400) * 0.35;
      if (taxable > 578125) incomeTax += (taxable - 578125) * 0.37;

      let fica = 0;
      if (localSalary > 0) {
        fica += Math.min(localSalary, 168600) * 0.062; // Social Security 6.2%
        fica += Math.min(localSalary, 168600) * 0.062;
        fica += localSalary * 0.0145;
      }
      if (fica > 0) {
        extraTaxes.push({ label: "FICA (Social Security + Medicare)", amount: fica / currency.rate });
      }

      return { totalTax: (incomeTax + fica) / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: standardDeduction / currency.rate };
    }

    if (currency.code === 'GBP') {
      standardDeduction = 12570;
      const taxable = Math.max(0, localSalary - localExemptions - standardDeduction);
      if (taxable > 0) incomeTax += Math.min(taxable, 37700) * 0.20;
      if (taxable > 37700) incomeTax += Math.min(taxable - 37700, 74870) * 0.40;
      if (taxable > 112570) incomeTax += (taxable - 112570) * 0.45;

      let ni = 0;
      if (localSalary > 12570) {
        ni += Math.min(localSalary - 12570, 37700) * 0.08;
        if (localSalary > 50270) ni += (localSalary - 50270) * 0.02;
      }
      if (ni > 0) {
        extraTaxes.push({ label: "National Insurance", amount: ni / currency.rate });
      }

      return { totalTax: (incomeTax + ni) / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: standardDeduction / currency.rate };
    }

    if (currency.code === 'AUD') {
      const taxable = Math.max(0, localSalary - localExemptions);
      if (taxable > 18200) incomeTax += Math.min(taxable - 18200, 26800) * 0.19;
      if (taxable > 45000) incomeTax += Math.min(taxable - 45000, 75000) * 0.325;
      if (taxable > 120000) incomeTax += Math.min(taxable - 120000, 60000) * 0.37;
      if (taxable > 180000) incomeTax += (taxable - 180000) * 0.45;

      let medicare = 0;
      if (taxable > 24276) medicare = taxable * 0.02;
      if (medicare > 0) {
        extraTaxes.push({ label: "Medicare Levy", amount: medicare / currency.rate });
      }

      return { totalTax: (incomeTax + medicare) / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: 0 };
    }

    if (currency.code === 'CAD') {
      standardDeduction = 15705;
      const taxable = Math.max(0, localSalary - localExemptions - standardDeduction);
      if (taxable > 0) incomeTax += Math.min(taxable, 55867) * 0.15;
      if (taxable > 55867) incomeTax += Math.min(taxable - 55867, 55866) * 0.205;
      if (taxable > 111733) incomeTax += Math.min(taxable - 111733, 61472) * 0.26;
      if (taxable > 173205) incomeTax += Math.min(taxable - 173205, 73547) * 0.29;
      if (taxable > 246752) incomeTax += (taxable - 246752) * 0.33;

      let provTax = taxable * 0.10;
      if (provTax > 0) {
        extraTaxes.push({ label: "Provincial Tax (Est. 10%)", amount: provTax / currency.rate });
      }

      return { totalTax: (incomeTax + provTax) / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: standardDeduction / currency.rate };
    }

    if (currency.code === 'SGD') {
      const taxable = Math.max(0, localSalary - localExemptions);
      if (taxable > 20000) incomeTax += Math.min(taxable - 20000, 10000) * 0.02;
      if (taxable > 30000) incomeTax += Math.min(taxable - 30000, 10000) * 0.035;
      if (taxable > 40000) incomeTax += Math.min(taxable - 40000, 40000) * 0.07;
      if (taxable > 80000) incomeTax += Math.min(taxable - 80000, 40000) * 0.115;
      if (taxable > 120000) incomeTax += Math.min(taxable - 120000, 40000) * 0.15;
      if (taxable > 160000) incomeTax += Math.min(taxable - 160000, 40000) * 0.18;
      if (taxable > 200000) incomeTax += Math.min(taxable - 200000, 40000) * 0.19;
      if (taxable > 240000) incomeTax += Math.min(taxable - 240000, 40000) * 0.195;
      if (taxable > 280000) incomeTax += Math.min(taxable - 280000, 40000) * 0.20;
      if (taxable > 320000) incomeTax += Math.min(taxable - 320000, 180000) * 0.22;
      if (taxable > 500000) incomeTax += Math.min(taxable - 500000, 500000) * 0.23;
      if (taxable > 1000000) incomeTax += (taxable - 1000000) * 0.24;
      
      return { totalTax: incomeTax / currency.rate, incomeTax: incomeTax / currency.rate, extraTaxes, standardDeduction: 0 };
    }

    if (currency.code === 'AED') {
      return { totalTax: 0, incomeTax: 0, extraTaxes: [], standardDeduction: 0 }; // 0% Personal Income Tax
    }

    // Generic fallback (EUR, etc) - Simple progressive
    const taxable = Math.max(0, localSalary - localExemptions);
    if (taxable > 15000) incomeTax += Math.min(taxable - 15000, 35000) * 0.20;
    if (taxable > 50000) incomeTax += (taxable - 50000) * 0.40;
    return { totalTax: incomeTax, incomeTax: incomeTax, extraTaxes, standardDeduction: 0 };
  };

  const { totalTax, incomeTax, extraTaxes, standardDeduction } = calculateTaxDetails();
  const effectiveTaxRate = salary > 0 ? ((totalTax / salary) * 100).toFixed(1) : "0.0";
  const inHand = salary - totalTax;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?salary=${salary}&exemptions=${exemptions}&regime=${regime}`
    : '';

  const copyPayload = `Income Tax Calculation:
Gross Salary: ${format(salary)}
Deductions: ${format(exemptions)}

Total Tax: ${format(totalTax)}
Effective Tax Rate: ${effectiveTaxRate}%
In-Hand Salary: ${format(inHand)}

Calculate your own: ${shareUrl}`;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Income Tax Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              {isIndian && (
                <Tabs value={regime} onValueChange={(v) => setRegime(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="new">New Regime</TabsTrigger>
                    <TabsTrigger value="old">Old Regime</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <SliderInput
                label="Gross Annual Salary"
                value={salary * currency.rate}
                min={0}
                max={(50000000 / 83) * currency.rate}
                step={(100000 / 83) * currency.rate}
                onChange={(val) => setSalary(val / currency.rate)}
                symbol={currency.symbol}
              />
              
              <div className={`transition-opacity ${isIndian && regime === "new" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <SliderInput
                  label={isIndian ? "Total Deductions (80C, HRA, etc.)" : "Total Tax Deductions"}
                  value={isIndian && regime === "new" ? 0 : (exemptions * currency.rate)}
                  min={0}
                  max={(1500000 / 83) * currency.rate}
                  step={(10000 / 83) * currency.rate}
                  onChange={(val) => setExemptions(val / currency.rate)}
                  symbol={currency.symbol}
                />
                {isIndian && regime === "new" && <p className="text-xs text-muted-foreground mt-2">Deductions are not applicable in the New Tax Regime (except standard deduction of 50k).</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Tax Summary {isIndian ? `(${regime === "new" ? "New" : "Old"} Regime)` : ""}</CardTitle>
              <CardDescription>Your estimated tax liability for the financial year.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border-emerald-500/20 ">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 mb-1">Gross Salary</p>
                  <p className="text-base md:text-xl font-semibold">{format(salary)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border-blue-500/20 bg-destructive/10 -destructive/20 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-destructive font-medium mb-1">Total Tax</p>
                  <p className="text-xl md:text-2xl font-bold text-destructive">{format(totalTax)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border-amber-500/20 ">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">In-Hand</p>
                  <p className="text-base md:text-xl font-bold text-amber-600 dark:text-amber-400">{format(inHand)}</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-lg border">
                <h3 className="font-medium mb-2">Tax Breakdown</h3>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Gross Income</span>
                  <span className="font-medium">{format(salary)}</span>
                </div>
                {standardDeduction > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Standard Deduction / Allowance</span>
                    <span className="font-medium">- {format(standardDeduction)}</span>
                  </div>
                )}
                {(!isIndian || regime === "old") && exemptions > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Other Deductions</span>
                    <span className="font-medium">- {format(exemptions)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span className="font-medium">
                    {format(Math.max(0, salary - standardDeduction - ((isIndian && regime === "new") ? 0 : exemptions)))}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Base Income Tax</span>
                  <span className="font-medium text-destructive">{format(incomeTax)}</span>
                </div>
                {extraTaxes.map((tax, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{tax.label}</span>
                    <span className="font-medium text-destructive">{format(tax.amount)}</span>
                  </div>
                ))}
                {currency.code === 'EUR' && (
                  <p className="text-xs text-muted-foreground mt-2 py-2">
                    * Note: This is a generalized progressive estimate for Europe. Tax rates vary significantly across member states (e.g. DE, FR, NL).
                  </p>
                )}
                <div className="flex justify-between py-2 mt-2 font-bold text-lg">
                  <span>Effective Tax Rate</span>
                  <span className="text-destructive">{effectiveTaxRate}%</span>
                </div>
              </div>
              
              <ResultActions 
                shareUrl={shareUrl}
                copyPayload={copyPayload}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is an Income Tax Calculator?</h2>
          <p>An Income Tax Calculator is a specialized financial tool designed to estimate your total annual tax liability based on your gross salary, location, and applicable deductions. Because tax laws utilize complex progressive bracket systems rather than a single flat percentage, calculating exactly how much of your paycheck you actually get to keep can be extremely difficult to do manually.</p>
          
          <h2>How Does the Tax Calculator Work?</h2>
          <p>Our calculator dynamically adapts to your selected currency and its corresponding geographical region. Whether you are using USD (IRS rules), GBP (HMRC rules), CAD (CRA rules), or INR, the engine automatically loads the exact progressive tax brackets and standard deductions for that specific tax authority.</p>

          <h3>Understanding Progressive Tax Brackets</h3>
          <p>The biggest misconception about taxes is that entering a higher tax bracket means all of your income is taxed at that higher rate. This is false. In a progressive system, your income is sliced into "chunks" (brackets), and only the money that falls within a specific chunk is taxed at that higher rate.</p>
          <ul>
            <li><strong>Bracket 1 (e.g., $0 - $10,000):</strong> Might be taxed at 0%.</li>
            <li><strong>Bracket 2 (e.g., $10,001 - $40,000):</strong> Might be taxed at 10%.</li>
            <li><strong>Result:</strong> If you make $15,000, you only pay 10% on the $5,000 that fell into the second bracket. The first $10k is tax-free.</li>
          </ul>

          <h2>Major Benefits of Calculating Your Taxes Early</h2>
          <ul>
            <li><strong>Salary Negotiations:</strong> Knowing your true "In-Hand" salary helps you accurately negotiate job offers. A $10,000 raise might only translate to $6,500 in your pocket after jumping tax brackets.</li>
            <li><strong>Tax Optimization:</strong> By playing with the "Deductions" slider, you can see exactly how much money you will save by maxing out your 401(k), IRA, or Section 80C investments.</li>
            <li><strong>Budgeting:</strong> Allows you to accurately forecast your exact monthly take-home pay for creating household budgets.</li>
          </ul>
        
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Tax = (Taxable Income - Slab Limit) × Slab Rate</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
          {
            question: "What is an Effective Tax Rate vs. a Marginal Tax Rate?",
            answer: "Your 'Marginal' tax rate is the highest bracket your last dollar falls into (e.g., 24%). Your 'Effective' tax rate is the actual percentage of your total income you paid in taxes (e.g., 14.5%) after accounting for standard deductions and lower brackets. Our calculator provides your Effective Tax Rate."
          },
          {
            question: "Why did you include a '0%' tax region for AED?",
            answer: "Because the United Arab Emirates (UAE) currently levies a 0% personal income tax on salaries. If you select AED, your gross salary is exactly equal to your net in-hand salary."
          },
          {
            question: "Does this calculator account for State/Provincial taxes?",
            answer: "No. Because state and local taxes (such as California State Tax or specific Canadian Provincial taxes) vary wildly depending on your exact zip code, this calculator provides an estimate strictly based on primary Federal/National tax brackets."
          }
        ,
        {
          question: "What is a standard deduction?",
          answer: "It is a flat deduction (currently ₹50,000 for salaried employees in India) that reduces your taxable income, regardless of your actual expenses."
        },
        {
          question: "Should I choose the Old or New Tax Regime?",
          answer: "The New Regime has lower tax rates but does not allow major deductions (like 80C or HRA). If your deductions exceed ₹3.75 Lakhs, the Old Regime is usually better. Otherwise, the New Regime saves more tax."
        }
      ]} />

        

        
      

        <RelatedCalculators calculators={getRelatedCalculators("income-tax-calculator")} /><StructuredData 
          type="Calculator" 
          data={{
            name: "Global Income Tax Calculator",
            description: "Calculate your estimated progressive income tax, effective tax rate, and in-hand take-home salary across multiple currencies."
          }} 
        />
      </div>
    </div>
  );
}

