"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { MapPin } from "lucide-react";
import Link from "next/link";

// Slugs that are exclusive to Indian financial regulations
export const INDIA_ONLY_SLUGS = new Set([
  "epf-calculator",
  "ppf-calculator",
  "nps-calculator",
  "gratuity-calculator",
  "pomis-calculator",
  "scss-calculator",
  "ssy-calculator",
  "nsc-calculator",
  "tds-calculator",
  "advance-tax",
  "hra-exemption"
]);

const RELATED_GLOBAL: Record<string, { label: string; href: string }> = {
  "epf-calculator":    { label: "Retirement Calculator", href: "/calculators/retirement-calculator" },
  "ppf-calculator":    { label: "Compound Interest Calculator", href: "/calculators/lumpsum-calculator" },
  "nps-calculator":    { label: "Retirement Corpus Calculator", href: "/calculators/retirement-calculator" },
  "gratuity-calculator": { label: "Salary Calculator", href: "/calculators/salary-calculator" },
  "pomis-calculator":  { label: "SWP Calculator", href: "/calculators/swp-calculator" },
};

interface IndiaOnlyGateProps {
  slug: string;
  children: React.ReactNode;
}

export function IndiaOnlyGate({ slug, children }: IndiaOnlyGateProps) {
  const { currency, setCurrency } = useCurrency();

  // Not an India-only calculator — render normally
  if (!INDIA_ONLY_SLUGS.has(slug)) return <>{children}</>;

  // User has INR selected — render normally
  if (currency.code === "INR") return <>{children}</>;

  const related = RELATED_GLOBAL[slug];
  const calcName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <div className="container mx-auto px-4 max-w-6xl mt-4 mb-2">
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex items-start sm:items-center gap-3 text-sm">
          <MapPin className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <p>
              <strong>Regional Notice:</strong> This calculator uses <strong>India's financial regulations</strong>, but you are viewing it in <strong>{currency.code}</strong>.{' '}
              <button 
                onClick={() => setCurrency("INR")} 
                className="underline font-semibold hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                Switch to ₹ INR
              </button> for the most accurate local experience.
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
