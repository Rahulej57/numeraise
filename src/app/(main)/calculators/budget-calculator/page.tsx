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

export default function BudgetCalculatorPage() {
  const { format, currency } = useCurrency();
  const [monthlyIncome, setMonthlyIncome] = useState(5000);

  // Sync state with URL on mount for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('income')) setMonthlyIncome(Number(params.get('income')));
  }, []);

  const needs = monthlyIncome * 0.5;
  const wants = monthlyIncome * 0.3;
  const savings = monthlyIncome * 0.2;

  const pieData = useMemo(() => [
    { name: "Needs (50%)", value: needs, color: "var(--chart-1)" },
    { name: "Wants (30%)", value: wants, color: "var(--chart-2)" },
    { name: "Savings (20%)", value: savings, color: "var(--chart-3)" },
  ], [needs, wants, savings]);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?income=${monthlyIncome}`
    : '';

  const copyPayload = `50/30/20 Budget Calculation:
Monthly After-Tax Income: ${format(monthlyIncome)}

Needs (50%): ${format(needs)}
Wants (30%): ${format(wants)}
Savings & Debt (20%): ${format(savings)}

Calculate your own: ${shareUrl}`;

  const faqs: FAQ[] = [
    {
      question: "What is the 50/30/20 budget rule?",
      answer: "The 50/30/20 rule is a simple budgeting method that helps you manage your money effectively. It divides your after-tax income into three categories: 50% for Needs, 30% for Wants, and 20% for Savings and Debt Repayment."
    },
    {
      question: "What counts as a 'Need' (50%)?",
      answer: "Needs are essential expenses you absolutely must pay to survive. This includes rent or mortgage payments, groceries, utilities (water, electricity), basic transportation, and minimum debt payments."
    },
    {
      question: "What counts as a 'Want' (30%)?",
      answer: "Wants are non-essential expenses that enhance your lifestyle but aren't strictly necessary for survival. This includes dining out, entertainment, vacations, designer clothing, hobbies, and subscriptions."
    },
    {
      question: "What counts as 'Savings' (20%)?",
      answer: "The 20% savings category includes contributions to retirement accounts (like EPF, 401(k), IRA), building an emergency fund, investing in the stock market, and making extra debt payments beyond the minimum."
    },
    {
      question: "Should I use my gross or net income for this rule?",
      answer: "You should always use your net (after-tax) income. This is the actual amount of money that hits your bank account every month after taxes and automatic deductions."
    }
  ,
    {
      question: "What is the 50/30/20 rule?",
      answer: "It is a popular budgeting guideline where 50% of your income goes to Needs (rent, groceries), 30% to Wants (entertainment, dining), and 20% to Savings and Debt repayment."
    },
    {
      question: "Should I budget based on gross or net income?",
      answer: "You should always budget based on your Net Income (take-home pay after taxes and deductions). Budgeting on gross income will leave you short on cash."
    }
  ];

  const relatedCalcs = [
    { title: "Net Worth Calculator", description: "Calculate your true financial health.", href: "/calculators/net-worth-calculator" },
    { title: "Emergency Fund Calculator", description: "Plan your safety net.", href: "/calculators/emergency-fund-calculator" },
    { title: "SIP Calculator", description: "Plan your monthly investments.", href: "/calculators/sip-calculator" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title="50/30/20 Budget Calculator" />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Monthly After-Tax Income"
                value={monthlyIncome * currency.rate}
                min={0}
                max={50000 * currency.rate}
                step={500 * currency.rate}
                onChange={(val) => setMonthlyIncome(val / currency.rate)}
                symbol={currency.symbol}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none h-full">
            <CardHeader className="pb-2">
              <CardTitle>Your Ideal Budget</CardTitle>
              <CardDescription>Based on the 50/30/20 rule</CardDescription>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 mt-4">
                <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Needs (50%)</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{format(needs)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs md:text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Wants (30%)</p>
                  <p className="text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">{format(wants)}</p>
                </div>
                <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Savings (20%)</p>
                  <p className="text-lg md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{format(savings)}</p>
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
        <h2>What is the 50/30/20 Budgeting Rule?</h2>
        <p>The 50/30/20 rule is a highly popular, easy-to-follow budgeting strategy popularized by Senator Elizabeth Warren. It helps individuals manage their money efficiently without the stress of tracking every single penny. The rule allocates your after-tax income into three distinct buckets:</p>
        
        <ul>
          <li><strong>50% for Needs:</strong> Essential living expenses.</li>
          <li><strong>30% for Wants:</strong> Discretionary spending and lifestyle choices.</li>
          <li><strong>20% for Savings & Debt:</strong> Investing for the future and paying down debt faster.</li>
        </ul>

        <h3>1. Needs (50%)</h3>
        <p>Your needs are the absolute essentials required for living and working. If you lost your job today, these are the expenses you would still have to pay. This category should consume no more than 50% of your net income.</p>
        <p><em>Examples:</em> Rent/Mortgage, groceries (not dining out), utilities (electricity, water, gas), basic health insurance, minimum debt payments, and basic transportation.</p>

        <h3>2. Wants (30%)</h3>
        <p>Wants are the fun things in life. They are expenses that enhance your lifestyle but are not strictly necessary for survival. Giving yourself permission to spend 30% of your income guilt-free prevents budgeting burnout.</p>
        <p><em>Examples:</em> Dining out, vacations, entertainment, Netflix subscriptions, designer clothing, hobbies, and gym memberships.</p>

        <h3>3. Savings & Debt Repayment (20%)</h3>
        <p>This bucket is dedicated to securing your financial future. At least 20% of your after-tax income should be directed towards building wealth or aggressively reducing high-interest debt.</p>
        <p><em>Examples:</em> Building a 6-month emergency fund, investing in stocks or mutual funds, contributing to retirement accounts, and making extra principal payments on your loans.</p>

        <h2>Why the 50/30/20 Rule Works</h2>
        <p>Most budgets fail because they are overly restrictive and complicated. The 50/30/20 rule is successful because it is flexible. It forces you to prioritize savings (20%) and cap your fixed living costs (50%), while still giving you a generous allowance (30%) to enjoy your life today.</p>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Total Savings = Total Income - Total Expenses</p>
        </div>
      </CalculatorContent>
      
      <FAQAccordion faqs={faqs} />

      

      
      
      

      <RelatedCalculators calculators={relatedCalcs} /><StructuredData 
        type="Calculator" 
        data={{
          name: "50/30/20 Budget Calculator",
          description: "Use the 50/30/20 rule to divide your after-tax income into needs, wants, and savings. A simple, effective budgeting tool."
        }} 
      />
      <StructuredData type="FAQ" data={{ faqs }} />
    </div>
  );
}
