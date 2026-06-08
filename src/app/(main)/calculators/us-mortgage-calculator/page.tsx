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
import { RelatedArticles } from "@/components/calculators/related-articles";
import { StructuredData } from "@/components/seo/structured-data";
import { calculateEMI } from "@/lib/calculations/loan";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function USMortgageCalculatorPage() {
  const { format, currency } = useCurrency();
  
  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(7.0);
  
  // US Specifics
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(1200);
  const [pmiRate, setPmiRate] = useState(0.5);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('price')) setHomePrice(Number(params.get('price')));
    if (params.has('down')) setDownPaymentPercent(Number(params.get('down')));
    if (params.has('term')) setLoanTerm(Number(params.get('term')));
    if (params.has('rate')) setInterestRate(Number(params.get('rate')));
  }, []);

  const result = useMemo(() => {
    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPaymentAmount;

    // 1. Principal & Interest (P&I)
    const emiResult = calculateEMI(loanAmount, interestRate, loanTerm);
    const monthlyPI = emiResult.emi;

    // 2. Property Taxes
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;

    // 3. Homeowners Insurance
    const monthlyInsurance = annualInsurance / 12;

    // 4. PMI (Private Mortgage Insurance)
    let monthlyPMI = 0;
    if (downPaymentPercent < 20) {
      monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
    }

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;

    return {
      loanAmount,
      downPaymentAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthlyPayment,
      totalInterest: emiResult.totalInterest
    };
  }, [homePrice, downPaymentPercent, loanTerm, interestRate, propertyTaxRate, annualInsurance, pmiRate]);

  const pieData = useMemo(() => [
    { name: "Principal & Interest", value: result.monthlyPI, color: "var(--chart-1)" },
    { name: "Property Tax", value: result.monthlyTax, color: "var(--chart-2)" },
    { name: "Home Insurance", value: result.monthlyInsurance, color: "var(--chart-3)" },
    { name: "PMI", value: result.monthlyPMI, color: "var(--chart-4)" },
  ].filter(d => d.value > 0), [result]);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?price=${homePrice}&down=${downPaymentPercent}&term=${loanTerm}&rate=${interestRate}`
    : '';

  const copyPayload = `US Mortgage Calculation (PITI):
Home Price: ${format(homePrice)}
Down Payment: ${downPaymentPercent}% (${format(result.downPaymentAmount)})
Loan Amount: ${format(result.loanAmount)}

Monthly Payment Breakdown:
P&I: ${format(result.monthlyPI)}
Taxes: ${format(result.monthlyTax)}
Insurance: ${format(result.monthlyInsurance)}
PMI: ${format(result.monthlyPMI)}
----------------------
Total Monthly Payment: ${format(result.totalMonthlyPayment)}

Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: "What does PITI stand for?",
      answer: "PITI stands for Principal, Interest, Taxes, and Insurance. It represents your true total monthly mortgage payment. Many basic calculators only show Principal and Interest, which tricks buyers into thinking they can afford a more expensive house than they actually can."
    },
    {
      question: "What is PMI (Private Mortgage Insurance)?",
      answer: "If you buy a house with a down payment of less than 20%, lenders consider you a higher-risk borrower. To protect themselves if you default on the loan, they force you to pay a monthly fee called PMI. This insurance protects the lender, not you. Once you have paid off enough of your loan to reach 20% equity, you can request to have PMI removed."
    },
    {
      question: "Are property taxes the same everywhere?",
      answer: "No. Property tax rates are set by local county and city governments to fund things like public schools, police, and roads. Some states like Texas and New Jersey have very high property taxes (over 2%), while others like Hawaii and Alabama have very low rates (under 0.5%)."
    },
    {
      question: "Should I choose a 15-year or 30-year mortgage?",
      answer: "A 30-year mortgage gives you the lowest possible monthly payment, making the home more affordable month-to-month. A 15-year mortgage has a much higher monthly payment, but you will get a lower interest rate and pay drastically less total interest over the life of the loan."
    }
  ,
    {
      question: "What is Private Mortgage Insurance (PMI)?",
      answer: "If your down payment is less than 20% of the home's value, lenders require you to pay PMI. It protects the lender (not you) if you default on the loan."
    },
    {
      question: "What are closing costs?",
      answer: "Closing costs are fees paid at the end of a real estate transaction. They include origination fees, appraisal fees, title searches, and taxes, typically ranging from 2% to 5% of the loan amount."
    }
  ];

  const relatedCalcs = [
    { title: "EMI Calculator", description: "Standard loan repayment calculator.", href: "/calculators/emi-calculator" },
    { title: "Rent vs Buy", description: "Compare the financial impact of renting vs buying.", href: "/calculators/rent-vs-buy" },
    { title: "Net Worth Calculator", description: "See how a home impacts your total net worth.", href: "/calculators/net-worth-calculator" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="US Mortgage Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Home Price"
                value={homePrice * currency.rate}
                min={50000 * currency.rate}
                max={5000000 * currency.rate}
                step={5000 * currency.rate}
                onChange={(val) => setHomePrice(val / currency.rate)}
                symbol={currency.symbol}
              />
              <div className="grid grid-cols-2 gap-4">
                <SliderInput
                  label="Down Payment %"
                  value={downPaymentPercent}
                  min={0}
                  max={100}
                  step={1}
                  onChange={setDownPaymentPercent}
                  suffix="%"
                />
                <SliderInput
                  label="Interest Rate"
                  value={interestRate}
                  min={1}
                  max={15}
                  step={0.1}
                  onChange={setInterestRate}
                  suffix="%"
                />
              </div>
              <SliderInput
                label="Loan Term"
                value={loanTerm}
                min={5}
                max={40}
                step={5}
                onChange={setLoanTerm}
                suffix=" Yrs"
              />
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-4 text-muted-foreground">Taxes & Insurance</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label="Property Tax Rate"
                      value={propertyTaxRate}
                      min={0}
                      max={5}
                      step={0.1}
                      onChange={setPropertyTaxRate}
                      suffix="%"
                    />
                    <SliderInput
                      label="Annual Insurance"
                      value={annualInsurance * currency.rate}
                      min={0}
                      max={10000 * currency.rate}
                      step={100 * currency.rate}
                      onChange={(val) => setAnnualInsurance(val / currency.rate)}
                      symbol={currency.symbol}
                    />
                  </div>
                  {downPaymentPercent < 20 && (
                    <SliderInput
                      label="PMI Rate (per year)"
                      value={pmiRate}
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      onChange={setPmiRate}
                      suffix="%"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Estimated Monthly Payment</CardTitle>
              <CardDescription>PITI Breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              
              <div className="text-center mb-6 mt-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                  {format(result.totalMonthlyPayment)}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">Total Monthly PITI</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Principal & Interest</p>
                  <p className="text-base md:text-xl font-bold text-blue-600 dark:text-blue-400">{format(result.monthlyPI)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Property Tax</p>
                  <p className="text-base md:text-xl font-bold text-emerald-600 dark:text-emerald-400">{format(result.monthlyTax)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Home Insurance</p>
                  <p className="text-base md:text-xl font-bold text-amber-600 dark:text-amber-400">{format(result.monthlyInsurance)}</p>
                </div>
                {result.monthlyPMI > 0 && (
                  <div className="p-3 md:p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <p className="text-xs md:text-sm text-rose-600 dark:text-rose-400 font-medium mb-1">PMI</p>
                    <p className="text-base md:text-xl font-bold text-rose-600 dark:text-rose-400">{format(result.monthlyPMI)}</p>
                  </div>
                )}
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
        <h2>The Danger of Standard Mortgage Calculators</h2>
        <p>Most real estate websites provide a basic mortgage calculator that only shows you the <strong>Principal and Interest (P&I)</strong>. This creates a massive problem for first-time homebuyers because it drastically underestimates the true cost of owning a home.</p>
        
        <p>Our US Mortgage Calculator calculates your true <strong>PITI</strong> (Principal, Interest, Taxes, and Insurance) to ensure you don't end up "house poor."</p>

        <h3>1. Principal and Interest (The Loan)</h3>
        <p>This is the actual repayment of the money you borrowed from the bank, plus the bank's fee (the interest rate). A 30-year fixed-rate mortgage is the standard in the US, meaning this portion of your payment will never change for 30 years.</p>

        <h3>2. Property Taxes (The Hidden Cost)</h3>
        <p>You have to pay taxes to your local government every single year based on the assessed value of your home. The average US property tax rate is around 1.1%, but it varies wildly. If you buy a {currency.symbol}500,000 home in New Jersey (2.4% tax rate), you will owe {currency.symbol}1,000 every single month just in property taxes!</p>

        <h3>3. Homeowners Insurance (Protection)</h3>
        <p>If you have a mortgage, your lender will legally require you to have homeowners insurance to protect the house from fire, theft, and natural disasters. Like taxes, your lender will usually collect this money every month and pay the insurance company on your behalf through an escrow account.</p>

        <h3>4. Private Mortgage Insurance (The Penalty)</h3>
        <p>If you cannot afford a 20% down payment, lenders consider you a risky borrower. To protect themselves, they force you to pay Private Mortgage Insurance (PMI) every month. PMI provides absolutely zero benefit to you; it only pays the lender if you get foreclosed on. Once you have built up 20% equity in your home, you can petition your lender to cancel the PMI.</p>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>PITI = Principal + Interest + Property Taxes + Homeowners Insurance + PMI</p>
        </div>
      </CalculatorContent>
      
      <FAQAccordion faqs={faqs} />

      

      
      
      

      <RelatedCalculators calculators={relatedCalcs} /><StructuredData 
        type="Calculator" 
        data={{
          name: "US Mortgage Calculator with PMI",
          description: "Calculate your true monthly PITI mortgage payment including property taxes, homeowners insurance, and Private Mortgage Insurance (PMI)."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
