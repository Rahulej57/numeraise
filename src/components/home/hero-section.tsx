"use client";

import { CalculatorSearchModal } from "@/components/layout/calculator-search-modal";

export function HeroSection() {
  return (
    <section className="w-full pt-10 pb-8 md:pt-16 md:pb-12 bg-background border-b border-border">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          Free Financial Calculators for Wealth, Loans & Tax
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6">
          70+ transparent financial modeling tools with instant compounding tables, step-up simulations, and prepayment schedules. 100% private, no signup required.
        </p>

        <div className="w-full max-w-xl mx-auto mb-2">
           <CalculatorSearchModal />
        </div>
      </div>
    </section>
  );
}
