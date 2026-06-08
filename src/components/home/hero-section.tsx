"use client";

import { CalculatorSearchModal } from "@/components/layout/calculator-search-modal";

export function HeroSection() {
  return (
    <section className="w-full pt-10 pb-8 md:pt-16 md:pb-12 bg-background border-b border-border">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Find a Calculator
        </h1>

        <div className="w-full max-w-xl mx-auto mb-2">
           <CalculatorSearchModal />
        </div>
      </div>
    </section>
  );
}
