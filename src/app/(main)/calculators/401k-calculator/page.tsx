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
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function Four01kCalculatorPage() {
  const { format, currency } = useCurrency();
  
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [annualSalary, setAnnualSalary] = useState(75000);
  const [salaryIncrease, setSalaryIncrease] = useState(3);
  const [employeeContribution, setEmployeeContribution] = useState(10);
  const [employerMatchLimit, setEmployerMatchLimit] = useState(6);
  const [employerMatchPercent, setEmployerMatchPercent] = useState(50);
  const [annualReturn, setAnnualReturn] = useState(7);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('age')) setCurrentAge(Number(params.get('age')));
    if (params.has('retireAge')) setRetirementAge(Number(params.get('retireAge')));
    if (params.has('balance')) setCurrentBalance(Number(params.get('balance')));
    if (params.has('salary')) setAnnualSalary(Number(params.get('salary')));
    if (params.has('contribution')) setEmployeeContribution(Number(params.get('contribution')));
  }, []);

  const result = useMemo(() => {
    let balance = currentBalance;
    let totalEmployee = currentBalance;
    let totalEmployer = 0;
    let totalInterest = 0;
    let currentSalary = annualSalary;

    const years = retirementAge - currentAge;
    
    if (years <= 0) return { finalBalance: currentBalance, totalEmployee, totalEmployer, totalInterest };

    for (let i = 0; i < years; i++) {
      // Contributions are typically made evenly throughout the year, but for simplicity we compound annually
      // or we can calculate the annual contribution and compound it at the end.
      const empContrib = currentSalary * (employeeContribution / 100);
      
      let matchContrib = 0;
      if (employeeContribution <= employerMatchLimit) {
        matchContrib = currentSalary * (employeeContribution / 100) * (employerMatchPercent / 100);
      } else {
        matchContrib = currentSalary * (employerMatchLimit / 100) * (employerMatchPercent / 100);
      }

      const totalContribThisYear = empContrib + matchContrib;
      
      // Interest on starting balance + half interest on new contributions (since they are spread over the year)
      const interestOnStart = balance * (annualReturn / 100);
      const interestOnContribs = totalContribThisYear * (annualReturn / 100) / 2;
      const interestThisYear = interestOnStart + interestOnContribs;

      balance += totalContribThisYear + interestThisYear;
      totalEmployee += empContrib;
      totalEmployer += matchContrib;
      totalInterest += interestThisYear;
      
      currentSalary *= (1 + (salaryIncrease / 100));
    }

    return {
      finalBalance: balance,
      totalEmployee,
      totalEmployer,
      totalInterest
    };
  }, [currentAge, retirementAge, currentBalance, annualSalary, salaryIncrease, employeeContribution, employerMatchLimit, employerMatchPercent, annualReturn]);

  const pieData = useMemo(() => [
    { name: "Your Contributions", value: result.totalEmployee, color: "var(--chart-1)" },
    { name: "Employer Match", value: result.totalEmployer, color: "var(--chart-2)" },
    { name: "Interest Earned", value: result.totalInterest, color: "var(--chart-3)" },
  ], [result]);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?age=${currentAge}&retireAge=${retirementAge}&balance=${currentBalance}&salary=${annualSalary}&contribution=${employeeContribution}`
    : '';

  const copyPayload = `401(k) Retirement Calculation:
Current Balance: ${format(currentBalance)}
Annual Salary: ${format(annualSalary)}
Employee Contribution: ${employeeContribution}%
Employer Match: ${employerMatchPercent}% up to ${employerMatchLimit}%

Projected Balance at ${retirementAge}: ${format(result.finalBalance)}
Total Interest Earned: ${format(result.totalInterest)}

Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: "What is a 401(k)?",
      answer: "A 401(k) is a retirement savings plan offered by many American employers that has tax advantages to the saver. The employee contributes part of their paycheck to an investment account before taxes are deducted. In many cases, the employer will match part of the contribution."
    },
    {
      question: "What is an Employer Match?",
      answer: "An employer match is free money. For example, if your employer offers a 50% match up to 6% of your salary, it means if you contribute 6% of your paycheck to your 401(k), your employer will put in an extra 3%. You should always try to contribute at least enough to get the full employer match!"
    },
    {
      question: "What is a good rate of return to estimate?",
      answer: "Historically, the stock market (specifically the S&P 500) has returned an average of about 10% per year before inflation. Adjusting for inflation, a safe and common estimate for long-term planning is between 6% and 8%."
    },
    {
      question: "Can I withdraw my 401(k) early?",
      answer: "Generally, if you withdraw money from your 401(k) before age 59½, you will have to pay ordinary income tax on the amount plus a 10% early withdrawal penalty to the IRS."
    }
  ,
    {
      question: "What happens if I withdraw my 401(k) early?",
      answer: "If you withdraw funds before age 59½, you will generally be hit with a 10% early withdrawal penalty from the IRS, plus ordinary income tax on the amount withdrawn."
    },
    {
      question: "Is there a maximum I can contribute to my 401(k)?",
      answer: "Yes. For 2024, the IRS limit for employee contributions is $23,000. If you are 50 or older, you can make an additional catch-up contribution of $7,500."
    }
  ];

  const relatedCalcs = [
    { title: "Retirement Calculator", description: "Calculate your overall retirement corpus.", href: "/calculators/retirement-calculator" },
    { title: "Net Worth Calculator", description: "Calculate your current financial health.", href: "/calculators/net-worth-calculator" },
    { title: "FIRE Calculator", description: "Find out when you can retire early.", href: "/calculators/fire-calculator" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="401(k) Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <SliderInput
                  label="Current Age"
                  value={currentAge}
                  min={18}
                  max={80}
                  step={1}
                  onChange={setCurrentAge}
                  suffix=" Yrs"
                />
                <SliderInput
                  label="Retirement Age"
                  value={retirementAge}
                  min={currentAge + 1}
                  max={85}
                  step={1}
                  onChange={setRetirementAge}
                  suffix=" Yrs"
                />
              </div>
              <SliderInput
                label="Current 401(k) Balance"
                value={currentBalance * currency.rate}
                min={0}
                max={2000000 * currency.rate}
                step={1000 * currency.rate}
                onChange={(val) => setCurrentBalance(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Annual Salary"
                value={annualSalary * currency.rate}
                min={10000 * currency.rate}
                max={1000000 * currency.rate}
                step={1000 * currency.rate}
                onChange={(val) => setAnnualSalary(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Your Contribution"
                value={employeeContribution}
                min={0}
                max={50}
                step={1}
                onChange={setEmployeeContribution}
                suffix="%"
              />
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-4 text-muted-foreground">Employer Details & Market Assumptions</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label="Employer Match %"
                      value={employerMatchPercent}
                      min={0}
                      max={100}
                      step={10}
                      onChange={setEmployerMatchPercent}
                      suffix="%"
                    />
                    <SliderInput
                      label="Match Limit (of Salary)"
                      value={employerMatchLimit}
                      min={0}
                      max={15}
                      step={1}
                      onChange={setEmployerMatchLimit}
                      suffix="%"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label="Expected Return"
                      value={annualReturn}
                      min={1}
                      max={15}
                      step={0.5}
                      onChange={setAnnualReturn}
                      suffix="%"
                    />
                    <SliderInput
                      label="Salary Increase"
                      value={salaryIncrease}
                      min={0}
                      max={10}
                      step={0.5}
                      onChange={setSalaryIncrease}
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
              <CardTitle>Projected 401(k) Balance</CardTitle>
              <CardDescription>At age {retirementAge}</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              
              <div className="text-center mb-6 mt-4">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                  {format(result.finalBalance)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Your Contribs</p>
                  <p className="text-base md:text-xl font-bold text-blue-600 dark:text-blue-400">{format(result.totalEmployee)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Employer Match</p>
                  <p className="text-base md:text-xl font-bold text-emerald-600 dark:text-emerald-400">{format(result.totalEmployer)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Interest</p>
                  <p className="text-base md:text-xl font-bold text-amber-600 dark:text-amber-400">{format(result.totalInterest)}</p>
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
        <h2>What is a 401(k) Calculator?</h2>
        <p>Our 401(k) calculator is designed to help you project exactly how much your retirement savings will grow over time, utilizing the power of compound interest, ongoing salary contributions, and the highly valuable "free money" from your employer's match program.</p>
        
        <h2>How Does a 401(k) Work?</h2>
        <p>A 401(k) is an employer-sponsored retirement account that allows an employee to dedicate a percentage of their pre-tax salary to a retirement account. These funds are invested in options like mutual funds or index funds.</p>

        <h3>1. Your Contributions</h3>
        <p>You choose a percentage of your salary (e.g., 10%) to be automatically deducted from your paycheck and deposited into your 401(k). Because these are pre-tax dollars, it actually lowers your taxable income for the year, saving you money on your income taxes.</p>

        <h3>2. The Employer Match</h3>
        <p>Many employers offer a matching contribution to encourage you to save. A common structure is a "50% match up to 6% of your salary." This means if you contribute 6% of your {currency.symbol}100,000 salary ({currency.symbol}6,000), your employer will put in an additional 3% ({currency.symbol}3,000) absolutely free. <strong>Always contribute at least enough to get the full employer match!</strong></p>

        <h3>3. Compound Interest</h3>
        <p>The true magic of a 401(k) happens over decades. Every year, your investments generate returns (interest, dividends, and market growth). In the following years, you earn returns not just on your original money, but also on the returns you already earned. Over a 30-year career, the interest you earn will drastically outweigh the actual cash you deposited.</p>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Future Value = P × [ (1 + r/n)^(nt) - 1 ] / (r/n)</p>
        </div>
      </CalculatorContent>
      
      <FAQAccordion faqs={faqs} />

      

      
      
      

      <RelatedCalculators calculators={relatedCalcs} /><StructuredData 
        type="Calculator" 
        data={{
          name: "401(k) Calculator",
          description: "Estimate your future 401(k) retirement balance taking into account employer matching, salary increases, and compound interest."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
