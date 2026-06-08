"use client";

import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/context/CurrencyContext";

const INDIA_COMPARISONS = [
  {
    id: "sip-vs-lumpsum",
    title: "SIP vs Lumpsum",
    description: "Compare periodic investments against a one-time lump sum to see which builds more wealth.",
    href: "/calculators/sip-vs-lumpsum",
    tag: "Investment",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy",
    description: "Determine if it makes more financial sense to buy a house or continue renting and investing the difference.",
    href: "/calculators/rent-vs-buy",
    tag: "Real Estate",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  {
    id: "old-vs-new-tax",
    title: "Old vs New Tax Regime",
    description: "Compare your income tax liability under both regimes to maximize your take-home salary.",
    href: "/calculators/income-tax-calculator",
    tag: "Taxes",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  {
    id: "flat-vs-reducing",
    title: "Flat vs Reducing Rate",
    description: "See how the interest calculation method drastically changes the total amount you pay on a loan.",
    href: "/calculators/flat-vs-reducing-loan",
    tag: "Loans",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
  }
];

const GLOBAL_COMPARISONS = [
  {
    id: "sip-vs-lumpsum",
    title: "SIP vs Lumpsum",
    description: "Compare periodic investments against a one-time lump sum to see which builds more wealth.",
    href: "/calculators/sip-vs-lumpsum",
    tag: "Investment",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy",
    description: "Determine if it makes more financial sense to buy a house or continue renting and investing the difference.",
    href: "/calculators/rent-vs-buy",
    tag: "Real Estate",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  {
    id: "lease-vs-buy",
    title: "Lease vs Buy Auto",
    description: "Compare the true net cost of leasing a vehicle versus financing a purchase.",
    href: "/calculators/lease-vs-buy",
    tag: "Auto",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  {
    id: "budget-50-30-20",
    title: "Needs vs Wants vs Savings",
    description: "Use the 50/30/20 budget framework to optimally divide your after-tax income.",
    href: "/calculators/budget-calculator",
    tag: "Budgeting",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
  }
];

export function ComparisonShowcase() {
  const { currency } = useCurrency();
  const activeComparisons = currency.code === "INR" ? INDIA_COMPARISONS : GLOBAL_COMPARISONS;
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Scale className="w-4 h-4" /> Deep Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Financial Comparisons
            </h2>
            <p className="text-muted-foreground text-lg">
              Don't guess. Run the numbers side-by-side to make the most mathematically optimal financial decisions.
            </p>
          </div>
          <Link 
            href="/calculators" 
            className="group flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all tools 
            <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {activeComparisons.map((item) => (
            <Link key={item.id} href={item.href} className="group">
              <Card className="h-full border border-border bg-card hover:shadow-md transition-all duration-300 hover:border-primary/40 relative overflow-hidden">
                <CardContent className="p-6 flex flex-col h-full">
                  
                  <div className={`w-fit px-2.5 py-1 rounded-md text-xs font-bold border mb-4 ${item.color}`}>
                    {item.tag}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-primary mt-auto">
                    Compare Now
                    <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
