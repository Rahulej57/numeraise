"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, TrendingUp, Zap, ShieldCheck, ThumbsUp, ThumbsDown, CheckCircle2, ArrowRight } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SmartInsightsProps {
  type: "sip" | "emi" | "lumpsum" | "generic";
  data: {
    // For SIP
    monthlyInvestment?: number;
    expectedReturnRate?: number;
    timePeriodYears?: number;
    totalValue?: number;
    investedAmount?: number;
    estimatedReturns?: number;

    // For EMI
    principal?: number;
    interestRate?: number;
    tenureYears?: number;
    emi?: number;
    totalInterest?: number;
    totalPayment?: number;
  };
}

export function SmartInsights({ type, data }: SmartInsightsProps) {
  const { format, currency } = useCurrency();
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  // Compute 10% Step-Up SIP Impact
  const stepUpInsight = useMemo(() => {
    if (type !== "sip" || !data.monthlyInvestment || !data.expectedReturnRate || !data.timePeriodYears || !data.totalValue) {
      return null;
    }

    const r = data.expectedReturnRate / 100 / 12;
    const years = data.timePeriodYears;
    let stepUpCorpus = 0;
    let currentMonthly = data.monthlyInvestment;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        stepUpCorpus = (stepUpCorpus + currentMonthly) * (1 + r);
      }
      currentMonthly *= 1.10; // 10% annual hike
    }

    const diff = stepUpCorpus - data.totalValue;
    const percentMore = Math.round((diff / data.totalValue) * 100);

    return {
      stepUpCorpus,
      diff,
      percentMore,
    };
  }, [type, data.monthlyInvestment, data.expectedReturnRate, data.timePeriodYears, data.totalValue]);

  // Compute Inflation-Adjusted Purchasing Power (6% inflation baseline)
  const inflationInsight = useMemo(() => {
    if (!data.totalValue || !data.timePeriodYears) return null;
    const inflationRate = currency.code === "INR" ? 0.06 : 0.03;
    const realValue = data.totalValue / Math.pow(1 + inflationRate, data.timePeriodYears);
    return {
      realValue,
      ratePercent: Math.round(inflationRate * 100),
    };
  }, [data.totalValue, data.timePeriodYears, currency.code]);

  // Compute 1-Extra-EMI Prepayment Hack
  const prepaymentInsight = useMemo(() => {
    if (type !== "emi" || !data.principal || !data.interestRate || !data.tenureYears || !data.emi || !data.totalInterest) {
      return null;
    }

    const r = data.interestRate / 100 / 12;
    const tenureMonths = data.tenureYears * 12;
    const acceleratedPayment = data.emi * (13 / 12); // Equivalent to 1 extra EMI spread across 12 months

    let balance = data.principal;
    let totalInt = 0;
    let months = 0;

    while (balance > 0 && months < tenureMonths) {
      months++;
      const interestCharge = balance * r;
      totalInt += interestCharge;
      const principalPaid = Math.min(balance, acceleratedPayment - interestCharge);
      balance -= principalPaid;
      if (balance <= 0) break;
    }

    const monthsSaved = tenureMonths - months;
    const yearsSaved = (monthsSaved / 12).toFixed(1);
    const interestSaved = Math.max(0, data.totalInterest - totalInt);

    return {
      monthsSaved,
      yearsSaved,
      interestSaved,
    };
  }, [type, data.principal, data.interestRate, data.tenureYears, data.emi, data.totalInterest]);

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary/5 via-muted/40 to-muted/20 border border-primary/20 p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base md:text-lg tracking-tight">Smart Financial Insights</h3>
            <p className="text-xs text-muted-foreground">Actionable strategies based on your numbers</p>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
          AI & Math Analysis
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {type === "sip" && stepUpInsight && (
          <div className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>The 10% Step-Up Multiplier</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Increasing your SIP by just 10% every year turns your {format(data.totalValue || 0)} corpus into{" "}
              <strong className="text-foreground">{format(stepUpInsight.stepUpCorpus)}</strong> (+{stepUpInsight.percentMore}% more wealth) without feeling the pinch.
            </p>
            <Link
              href={`/calculators/step-up-sip?amount=${data.monthlyInvestment}&rate=${data.expectedReturnRate}&years=${data.timePeriodYears}`}
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline pt-1"
            >
              Model Step-Up SIP <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {type === "sip" && inflationInsight && (
          <div className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Inflation Reality Check ({inflationInsight.ratePercent}%)</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Due to inflation, your projected {format(data.totalValue || 0)} will have the real purchasing power of{" "}
              <strong className="text-foreground">{format(inflationInsight.realValue)}</strong> in today&apos;s money. Plan your retirement target against this figure.
            </p>
          </div>
        )}

        {type === "emi" && prepaymentInsight && prepaymentInsight.monthsSaved > 0 && (
          <div className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <Zap className="w-4 h-4" />
              <span>The 1-Extra-EMI Prepayment Hack</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Paying just 1 extra EMI per year (13 installments instead of 12) cuts your loan tenure by{" "}
              <strong className="text-foreground">{prepaymentInsight.yearsSaved} Years</strong> and saves{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">{format(prepaymentInsight.interestSaved)}</strong> in interest!
            </p>
            <Link
              href="/calculators/home-loan-prepayment"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline pt-1"
            >
              Calculate Custom Prepayment <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {type === "emi" && data.principal && data.totalPayment && (
          <div className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>True Cost of Borrowing</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              For every {currency.symbol}1 borrowed, you will pay back{" "}
              <strong className="text-foreground">{currency.symbol}{(data.totalPayment / data.principal).toFixed(2)}</strong> to the lender. Total interest represents{" "}
              <strong className="text-foreground">{Math.round(((data.totalInterest || 0) / data.principal) * 100)}%</strong> of your borrowed amount.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Human Feedback Block */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
        <span>Was this calculation helpful?</span>
        <div className="flex items-center gap-2">
          {feedback ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Thank you for your feedback!
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setFeedback("up")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background hover:bg-muted border border-border hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3 h-3 text-emerald-500" /> Yes
              </button>
              <button
                type="button"
                onClick={() => setFeedback("down")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background hover:bg-muted border border-border hover:border-rose-500/50 transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-3 h-3 text-rose-500" /> No
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
