"use client";

import { usePathname } from "next/navigation";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export function CalculatorHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || "";
  
  // Look up the GST alias edge cases
  const lookupSlug = ["sales-tax-calculator", "vat-calculator"].includes(slug) 
    ? "gst-calculator" 
    : slug;

  const category = CALCULATOR_DIRECTORY.find(c => c.calculators.some(calc => calc.href.includes(lookupSlug)));
  
  return (
    <div className="mb-6 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
      {category?.icon && (
        <div className="p-3 bg-background border shadow-sm rounded-xl shrink-0">
          <div className="scale-[1.15] origin-center">
            {category.icon}
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-1">{title}</h1>
        {category?.category && (
          <p className="text-sm font-medium text-muted-foreground">{category.category}</p>
        )}
      </div>
    </div>
  );
}
