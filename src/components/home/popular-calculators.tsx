"use client";

import Link from "next/link";
import { TrendingUp, Landmark, Calculator, PiggyBank, ArrowRight, Home, ReceiptText, Car } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";

const INDIA_CALCS = [
  {
    title: "SIP Calculator",
    description: "Calculate mutual fund returns and wealth projection",
    icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    href: "/calculators/sip-calculator",
    badge: "Most Used",
    category: "Investments",
    color: "bg-emerald-500/10",
  },
  {
    title: "EMI Calculator",
    description: "Calculate your monthly home or car loan payments",
    icon: <Landmark className="w-6 h-6 text-blue-500" />,
    href: "/calculators/emi-calculator",
    badge: "Trending",
    category: "Loans",
    color: "bg-blue-500/10",
  },
  {
    title: "FD Calculator",
    description: "Find out your fixed deposit maturity amount",
    icon: <PiggyBank className="w-6 h-6 text-amber-500" />,
    href: "/calculators/fd-calculator",
    category: "Savings",
    color: "bg-amber-500/10",
  },
  {
    title: "Income Tax",
    description: "Calculate your tax liability under new & old regimes",
    icon: <Calculator className="w-6 h-6 text-rose-500" />,
    href: "/calculators/income-tax-calculator",
    badge: "Updated",
    category: "Taxes",
    color: "bg-rose-500/10",
  },
];

const GLOBAL_CALCS = [
  {
    title: "Net Worth",
    description: "Calculate your true financial health (Assets vs Liabilities).",
    icon: <Landmark className="w-6 h-6 text-emerald-500" />,
    href: "/calculators/net-worth-calculator",
    badge: "Most Used",
    category: "Wealth",
    color: "bg-emerald-500/10",
  },
  {
    title: "50/30/20 Budget",
    description: "Split your income into needs, wants, and savings.",
    icon: <Calculator className="w-6 h-6 text-blue-500" />,
    href: "/calculators/budget-calculator",
    badge: "Trending",
    category: "Budgeting",
    color: "bg-blue-500/10",
  },
  {
    title: "CAGR Calculator",
    description: "Calculate your Compound Annual Growth Rate.",
    icon: <TrendingUp className="w-6 h-6 text-amber-500" />,
    href: "/calculators/cagr-calculator",
    category: "Investments",
    color: "bg-amber-500/10",
  },
  {
    title: "Home Loan EMI",
    description: "Calculate amortization and schedule for property loans.",
    icon: <Home className="w-6 h-6 text-rose-500" />,
    href: "/calculators/home-loan-calculator",
    category: "Real Estate",
    color: "bg-rose-500/10",
  },
];

const US_CALCS = [
  {
    title: "401(k) Calculator",
    description: "Project your retirement balance with employer match.",
    icon: <PiggyBank className="w-6 h-6 text-emerald-500" />,
    href: "/calculators/401k-calculator",
    badge: "Top Rated",
    category: "Retirement",
    color: "bg-emerald-500/10",
  },
  {
    title: "US Mortgage",
    description: "Calculate PITI including property taxes and PMI.",
    icon: <Home className="w-6 h-6 text-blue-500" />,
    href: "/calculators/us-mortgage-calculator",
    badge: "Most Used",
    category: "Real Estate",
    color: "bg-blue-500/10",
  },
  {
    title: "Paycheck Estimator",
    description: "Calculate Take-Home pay after Federal, State, & FICA taxes.",
    icon: <ReceiptText className="w-6 h-6 text-amber-500" />,
    href: "/calculators/paycheck-calculator",
    badge: "Trending",
    category: "Taxes",
    color: "bg-amber-500/10",
  },
  {
    title: "Lease vs Buy",
    description: "Compare the true net cost of leasing vs financing a car.",
    icon: <Car className="w-6 h-6 text-rose-500" />,
    href: "/calculators/lease-vs-buy",
    category: "Auto",
    color: "bg-rose-500/10",
  },
];

export function PopularCalculators() {
  const { currency } = useCurrency();
  
  let activeCalculators = GLOBAL_CALCS;
  if (currency.code === "USD") {
    activeCalculators = US_CALCS;
  } else if (currency.code === "INR") {
    activeCalculators = INDIA_CALCS;
  }

  return (
    <section className="w-full py-8 md:py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Popular Tools</h2>
          </div>
          <Link href="/financial-calculators" className="text-primary hover:underline font-medium text-sm flex items-center gap-1 shrink-0">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Horizontal Scrolling / Desktop Grid */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 md:px-0 md:mx-0 gap-4 snap-x snap-mandatory hide-scrollbar">
          {activeCalculators.map((calc, idx) => (
            <Link href={calc.href} key={idx} className="group w-[280px] shrink-0 snap-center md:w-auto">
              <Card className="h-full relative overflow-hidden transition-all duration-300 bg-background border border-border shadow-none hover:border-primary/50">
                {calc.badge && (
                  <Badge className="absolute top-3 right-3 text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-none">
                    {calc.badge}
                  </Badge>
                )}
                <CardHeader className="p-5 pb-5">
                  <div className={`w-12 h-12 rounded-xl ${calc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {calc.icon}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {calc.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
