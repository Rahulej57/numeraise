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
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[60vh] flex items-center">
      <div className="w-full rounded-2xl border bg-muted/30 p-8 md:p-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto">
          <MapPin className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{calcName}</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This calculator is specific to <strong>India's financial regulations</strong> (e.g. the Employees' Provident Fund Act, Indian tax law). It is not applicable in <strong>{currency.code}</strong> jurisdictions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrency("INR")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Switch to ₹ INR to use this tool
          </button>
          {related && (
            <Link
              href={related.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border hover:bg-muted transition-colors font-medium"
            >
              Try {related.label} →
            </Link>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          You can switch back to {currency.code} at any time using the currency selector in the navbar.
        </p>
      </div>
    </div>
  );
}
