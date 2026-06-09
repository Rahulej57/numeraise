"use client";

import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { Calculator, ChevronRight, ArrowRight } from "lucide-react";

interface CalculatorLink {
  name: string;
  desc: string;
  href: string;
  icon?: React.ReactNode;
}

interface DynamicCalculatorListProps {
  calculators: CalculatorLink[];
  variant?: "cards" | "list";
  categoryIcon?: React.ReactNode;
}

export function DynamicCalculatorList({ calculators, variant = "list", categoryIcon }: DynamicCalculatorListProps) {
  const { currency } = useCurrency();

  // Filter and transform the calculators based on currency
  const visibleCalculators = calculators
    .map((calc) => {
      const slug = calc.href.split('/').pop() || "";
      
      // Dynamically rename and re-link GST calculator based on currency
      if (slug === "gst-calculator") {
        if (currency.code === "USD") {
          return { ...calc, name: "Sales Tax Calculator", href: "/calculators/sales-tax-calculator" };
        } else if (["EUR", "GBP"].includes(currency.code)) {
          return { ...calc, name: "VAT Calculator", href: "/calculators/vat-calculator" };
        }
      }
      
      return calc;
    });

  if (visibleCalculators.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-xl bg-muted/20">
        No calculators available in this category for your selected region.
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleCalculators.map((calc, idx) => (
          <Link href={calc.href} key={idx} className="group">
            <div className="h-full rounded-xl border border-border bg-muted/40 p-4 md:p-5 hover:bg-muted transition-all duration-300">
              <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {(calc.icon || categoryIcon) && (
                    <div className="p-1.5 bg-background shadow-sm border border-border rounded-lg shrink-0">
                      <div className="scale-[0.80] origin-center">{calc.icon || categoryIcon}</div>
                    </div>
                  )}
                  <span>{calc.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300 mt-1 shrink-0" />
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{calc.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {visibleCalculators.map((calc) => (
        <Link 
          key={calc.href} 
          href={calc.href}
          className="p-4 hover:bg-primary/5 transition-colors group flex items-start gap-4"
        >
          <div className="mt-0.5 shrink-0 p-1.5 bg-background border border-border shadow-sm rounded-lg group-hover:bg-primary/5 transition-colors">
            {(calc.icon || categoryIcon) ? (
              <div className="scale-[0.85] opacity-90 group-hover:opacity-100 transition-opacity">
                {calc.icon || categoryIcon}
              </div>
            ) : (
              <Calculator className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{calc.name}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{calc.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1.5" />
        </Link>
      ))}
    </div>
  );
}
