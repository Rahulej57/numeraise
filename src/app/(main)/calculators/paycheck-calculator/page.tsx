"use client";

import { useState, useMemo, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { SliderInput } from "@/components/calculators/slider-input";
import { BreakdownChart } from "@/components/charts/breakdown-chart";
import { ResultActions } from "@/components/calculators/result-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion, FAQ } from "@/components/calculators/faq-accordion";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";
import { RelatedArticles } from "@/components/calculators/related-articles";
import { StructuredData } from "@/components/seo/structured-data";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function PaycheckCalculatorPage() {
  const { format, currency } = useCurrency();
  
  const [annualSalary, setAnnualSalary] = useState(75000);
  const [payPeriods, setPayPeriods] = useState(26); // Bi-weekly by default
  
  // Taxes (Effective Rates)
  const [federalTaxRate, setFederalTaxRate] = useState(12.0);
  const [stateTaxRate, setStateTaxRate] = useState(4.5);
  const [ficaTaxRate, setFicaTaxRate] = useState(7.65); // Standard US FICA
  
  // Deductions
  const [preTaxDeductions, setPreTaxDeductions] = useState(5); // % of salary for 401k, health, etc.

  // Dynamic Labels based on currency
  const taxLabels = useMemo(() => {
    switch (currency.code) {
      case 'INR': return { fed: "Income Tax", state: "Professional Tax (Est.)", social: "EPF (Provident Fund)", deductions: "Section 80C/Health", fedDef: 10, stateDef: 0.5, socialDef: 12 };
      case 'GBP': return { fed: "Income Tax", state: "Council Tax (Est.)", social: "National Insurance", deductions: "Pension Contributions", fedDef: 20, stateDef: 0, socialDef: 8 };
      case 'CAD': return { fed: "Federal Tax", state: "Provincial Tax", social: "CPP / EI", deductions: "RRSP Contributions", fedDef: 15, stateDef: 10, socialDef: 6.5 };
      case 'AUD': return { fed: "Income Tax", state: "Medicare Levy", social: "Superannuation", deductions: "Extra Super", fedDef: 25, stateDef: 2, socialDef: 11 };
      default: return { fed: "Effective Federal Tax", state: "State Tax Rate", social: "FICA Tax (SS/Med)", deductions: "Pre-Tax Deductions", fedDef: 12, stateDef: 4.5, socialDef: 7.65 };
    }
  }, [currency.code]);

  // Set defaults when currency changes
  useEffect(() => {
    if (!window.history.state?.initializedPaycheck) {
      switch (currency.code) {
        case 'INR': setAnnualSalary(1200000); break;
        case 'USD': setAnnualSalary(75000); break;
        case 'GBP': setAnnualSalary(40000); break;
        case 'AUD': setAnnualSalary(90000); break;
        case 'CAD': setAnnualSalary(70000); break;
        default: setAnnualSalary(100000);
      }
      window.history.replaceState({ ...window.history.state, initializedPaycheck: true }, '');
    }
    setFederalTaxRate(taxLabels.fedDef);
    setStateTaxRate(taxLabels.stateDef);
    setFicaTaxRate(taxLabels.socialDef);
  }, [currency.code, taxLabels]);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('salary')) setAnnualSalary(Number(params.get('salary')));
  }, []);

  const result = useMemo(() => {
    const grossPerPeriod = annualSalary / payPeriods;
    
    // Pre-tax deductions reduce taxable income for Federal/State
    const preTaxAmountPerPeriod = grossPerPeriod * (preTaxDeductions / 100);
    const taxableIncomePerPeriod = grossPerPeriod - preTaxAmountPerPeriod;
    
    // Taxes
    const federalTaxPerPeriod = taxableIncomePerPeriod * (federalTaxRate / 100);
    const stateTaxPerPeriod = taxableIncomePerPeriod * (stateTaxRate / 100);
    
    // Social / FICA usually calculated on Gross
    const ficaTaxPerPeriod = grossPerPeriod * (ficaTaxRate / 100);
    
    const totalTaxes = federalTaxPerPeriod + stateTaxPerPeriod + ficaTaxPerPeriod;
    const netPayPerPeriod = grossPerPeriod - preTaxAmountPerPeriod - totalTaxes;

    return {
      grossPerPeriod,
      preTaxAmountPerPeriod,
      federalTaxPerPeriod,
      stateTaxPerPeriod,
      ficaTaxPerPeriod,
      totalTaxes,
      netPayPerPeriod
    };
  }, [annualSalary, payPeriods, federalTaxRate, stateTaxRate, ficaTaxRate, preTaxDeductions]);

  const pieData = useMemo(() => [
    { name: "Take Home Pay", value: result.netPayPerPeriod, color: "var(--chart-1)" },
    { name: taxLabels.fed, value: result.federalTaxPerPeriod, color: "var(--chart-2)" },
    { name: taxLabels.state, value: result.stateTaxPerPeriod, color: "var(--chart-3)" },
    { name: taxLabels.social, value: result.ficaTaxPerPeriod, color: "var(--chart-4)" },
    { name: taxLabels.deductions, value: result.preTaxAmountPerPeriod, color: "var(--chart-5)" },
  ].filter(d => d.value > 0), [result, taxLabels]);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?salary=${annualSalary}`
    : '';

  const getPayFrequencyText = () => {
    switch (payPeriods) {
      case 52: return "Weekly";
      case 26: return "Bi-Weekly";
      case 24: return "Semi-Monthly";
      case 12: return "Monthly";
      default: return "Per Paycheck";
    }
  };

  const copyPayload = `Paycheck Estimate (${getPayFrequencyText()}):
Gross Pay: ${format(result.grossPerPeriod)}
- Taxes: ${format(result.totalTaxes)}
- ${taxLabels.deductions}: ${format(result.preTaxAmountPerPeriod)}
----------------------
Take Home Pay: ${format(result.netPayPerPeriod)}

Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: `What is ${taxLabels.social}?`,
      answer: currency.code === 'USD' ? "FICA stands for the Federal Insurance Contributions Act. It is a mandatory payroll tax in the United States that funds Social Security and Medicare. For employees, the rate is exactly 7.65% (6.2% for Social Security and 1.45% for Medicare)." : `This represents mandatory social contributions in your country (like National Insurance in the UK, EPF in India, or CPP in Canada) that fund retirement and healthcare programs.`
    },
    {
      question: "Why is my take-home pay so much lower than my salary?",
      answer: `When you hear you have a '${format(annualSalary)} salary', that is your Gross Income. Before that money ever hits your bank account, your employer legally must withhold income tax, social taxes, and any benefits you signed up for. This usually consumes 20% to 35% of your gross pay.`
    },
    {
      question: "What are Pre-Tax Deductions?",
      answer: `Pre-tax deductions are expenses taken out of your paycheck before income taxes are calculated. The most common examples are ${taxLabels.deductions}. By deducting these first, your 'taxable income' goes down, which actually saves you money on taxes!`
    },
    {
      question: "What is an Effective Tax Rate?",
      answer: "Most countries use a progressive tax system, meaning your income is taxed at different brackets (e.g. 10%, then 20%, then 30%). Your 'Effective Tax Rate' is simply the average percentage of your total income that you actually pay in taxes."
    }
  ];

  const relatedCalcs = getRelatedCalculators("paycheck-calculator");

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="Paycheck Estimator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Gross Annual Salary"
                value={annualSalary * currency.rate}
                min={20000 * currency.rate}
                max={500000 * currency.rate}
                step={1000 * currency.rate}
                onChange={(val) => setAnnualSalary(val / currency.rate)}
                symbol={currency.symbol}
              />
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Pay Frequency</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: "Weekly", value: 52 },
                    { label: "Bi-Weekly", value: 26 },
                    { label: "Semi-Monthly", value: 24 },
                    { label: "Monthly", value: 12 }
                  ].map((freq) => (
                    <button
                      key={freq.value}
                      onClick={() => setPayPeriods(freq.value)}
                      className={`p-2 text-xs font-medium rounded-md border transition-colors ${
                        payPeriods === freq.value 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-4 text-muted-foreground">Taxes & Deductions</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label={taxLabels.fed}
                      value={federalTaxRate}
                      min={0}
                      max={45}
                      step={0.5}
                      onChange={setFederalTaxRate}
                      suffix="%"
                    />
                    <SliderInput
                      label={taxLabels.state}
                      value={stateTaxRate}
                      min={0}
                      max={20}
                      step={0.1}
                      onChange={setStateTaxRate}
                      suffix="%"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label={taxLabels.social}
                      value={ficaTaxRate}
                      min={0}
                      max={15}
                      step={0.05}
                      onChange={setFicaTaxRate}
                      suffix="%"
                    />
                    <SliderInput
                      label={taxLabels.deductions}
                      value={preTaxDeductions}
                      min={0}
                      max={20}
                      step={1}
                      onChange={setPreTaxDeductions}
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Your Take Home Pay</CardTitle>
              <CardDescription>Estimated {getPayFrequencyText()}</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              
              <div className="text-center mb-6 mt-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                  {format(result.netPayPerPeriod)}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">Net Pay {getPayFrequencyText()}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Gross Pay</p>
                  <p className="text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400">{format(result.grossPerPeriod)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <p className="text-xs md:text-sm text-rose-600 dark:text-rose-400 font-medium mb-1">Total Taxes</p>
                  <p className="text-lg md:text-xl font-bold text-rose-600 dark:text-rose-400">{format(result.totalTaxes)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 col-span-2">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">{taxLabels.deductions}</p>
                  <p className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400">{format(result.preTaxAmountPerPeriod)}</p>
                </div>
              </div>
              
              <div className="mt-6 mb-4">
                <BreakdownChart data={pieData} />
              </div>

              <ResultActions shareUrl={shareUrl} copyPayload={copyPayload} />
            </CardContent>
          </Card>
        </div>
      </div>
      <CalculatorContent>
        <h2>What is a Paycheck Estimator?</h2>
        <p>A paycheck estimator is a tool that calculates your true "take-home pay" by subtracting all mandatory taxes and voluntary deductions from your gross salary. It helps employees understand exactly how much money will physically hit their bank account each pay period.</p>
        
        <h2>The Difference Between Gross Pay and Net Pay</h2>
        <p>When you sign an offer letter for a new job, the salary listed is your <strong>Gross Pay</strong>. This is the total amount of money the employer is paying you. However, you never actually see this full amount.</p>
        <p>Your <strong>Net Pay</strong> (or Take-Home Pay) is what is left over after the government and your benefits providers take their share. It is extremely important to build your personal budget based on your Net Pay, not your Gross Pay.</p>

        <h3>Where Does the Money Go?</h3>
        <ul>
          <li><strong>Federal Income Tax:</strong> Money sent directly to the US government to fund federal programs, defense, and infrastructure.</li>
          <li><strong>State Income Tax:</strong> Money sent to your specific state. (Note: 9 states, like Texas and Florida, have 0% state income tax!)</li>
          <li><strong>FICA (Social Security & Medicare):</strong> A flat 7.65% tax on your income that funds retirement and healthcare programs for seniors.</li>
          <li><strong>Pre-Tax Deductions:</strong> Money you voluntarily withhold to pay for things like employer-sponsored Health Insurance premiums or contributions to your 401(k) retirement account.</li>
        </ul>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Net Pay = Gross Pay - Federal Taxes - State Taxes - Deductions</p>
        </div>
      </CalculatorContent>
      
      <FAQAccordion faqs={faqs} />

      

      
      
      

      <RelatedCalculators calculators={relatedCalcs} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Paycheck Estimator",
          description: "Calculate your exact take-home pay by estimating federal taxes, state taxes, FICA, and pre-tax deductions."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
