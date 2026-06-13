"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Info } from "lucide-react";
import Link from "next/link";

interface ArticleCurrencyNoticeProps {
  relatedCalculatorHref?: string;
  relatedCalculatorName?: string;
}

export function ArticleCurrencyNotice({ relatedCalculatorHref, relatedCalculatorName }: ArticleCurrencyNoticeProps) {
  const { currency } = useCurrency();

  // Only show when user has selected a non-INR currency
  if (currency.code === "INR") return null;

  return (
    <div className="flex gap-3 items-start p-4 rounded-xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20 mb-8 text-sm">
      <Info className="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <div>
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-0.5">
          Currency notice: Values in this article are in Indian Rupees (₹ INR)
        </p>
        <p className="text-amber-700/80 dark:text-amber-400/70">
          You currently have <strong>{currency.code}</strong> selected. The figures quoted in the article text are illustrative examples in INR.
          {relatedCalculatorHref && relatedCalculatorName ? (
            <>
              {" "}Use our{" "}
              <Link
                href={relatedCalculatorHref}
                className="underline font-medium hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
              >
                {relatedCalculatorName}
              </Link>{" "}
              to run the same calculations with your own numbers — it fully supports {currency.code}.
            </>
          ) : (
            <> Use our <Link href="/calculators" className="underline font-medium hover:text-amber-900 dark:hover:text-amber-200 transition-colors">calculators</Link> to run these scenarios in {currency.code}.</>
          )}
        </p>
      </div>
    </div>
  );
}
