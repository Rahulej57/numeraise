"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SliderInput } from "@/components/calculators/slider-input";
import { Landmark, ArrowDownCircle } from "lucide-react";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export function HomeLoanPrepaymentClient() {
  const { format, currency } = useCurrency();
  const [outstandingPrincipal, setOutstandingPrincipal] = useState(5000000 / 83);
  const [interestRate, setInterestRate] = useState(8.5);
  const [remainingTenure, setRemainingTenure] = useState(15); // in years
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000 / 83);

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("home-loan-prepayment"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const results = useMemo(() => {
    const P = outstandingPrincipal;
    const r = interestRate / 12 / 100;
    const n = remainingTenure * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, oldInterest: 0, newInterest: 0, savedInterest: 0, savedMonths: 0 };

    // Standard EMI formula
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const oldTotalInterest = (emi * n) - P;

    // After prepayment
    const newPrincipal = P - prepaymentAmount;
    
    if (newPrincipal <= 0) {
      return {
        emi,
        oldInterest: oldTotalInterest,
        newInterest: 0,
        savedInterest: oldTotalInterest,
        savedMonths: n
      };
    }

    // Keep EMI same, calculate new tenure in months
    // n_new = log(EMI / (EMI - P_new * r)) / log(1 + r)
    const newTenureMonths = Math.log(emi / (emi - newPrincipal * r)) / Math.log(1 + r);
    const newTotalInterest = (emi * newTenureMonths) - newPrincipal;

    const savedInterest = oldTotalInterest - newTotalInterest;
    const savedMonths = n - newTenureMonths;

    return {
      emi,
      oldInterest: oldTotalInterest,
      newInterest: newTotalInterest,
      savedInterest,
      savedMonths: Math.floor(savedMonths)
    };
  }, [outstandingPrincipal, interestRate, remainingTenure, prepaymentAmount]);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
      <div className="mb-6 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
        {calculatorIcon && (
          <div className="p-3 bg-background border shadow-sm rounded-xl shrink-0">
            <div className="scale-[1.15] origin-center">{calculatorIcon}</div>
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Home Loan Prepayment</h1>
          <p className="text-sm md:text-lg text-muted-foreground">Calculate interest savings and tenure reduction by making a part-payment.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 md:p-6 space-y-6">
              <SliderInput
                label="Outstanding Loan Amount"
                value={outstandingPrincipal * currency.rate}
                min={(100000 / 83) * currency.rate}
                max={(50000000 / 83) * currency.rate}
                step={(100000 / 83) * currency.rate}
                onChange={(val) => setOutstandingPrincipal(val / currency.rate)}
                symbol={currency.symbol}
              />
              <SliderInput
                label="Interest Rate (p.a)"
                value={interestRate}
                min={1}
                max={20}
                step={0.1}
                onChange={setInterestRate}
                suffix="%"
              />
              <SliderInput
                label="Remaining Tenure"
                value={remainingTenure}
                min={1}
                max={30}
                step={1}
                onChange={setRemainingTenure}
                suffix="Yr"
              />
              <div className="pt-4 border-t border-border mt-6">
                <SliderInput
                  label="Prepayment Amount (Part-Payment)"
                  value={prepaymentAmount * currency.rate}
                  min={(10000 / 83) * currency.rate}
                  max={outstandingPrincipal * currency.rate}
                  step={(10000 / 83) * currency.rate}
                  onChange={(val) => setPrepaymentAmount(val / currency.rate)}
                  symbol={currency.symbol}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-gradient-to-br from-card to-muted/20 h-full">
            <CardHeader className="p-3 md:p-6 pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5" />
                Savings & Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 md:p-6 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">Total Interest Saved</p>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-emerald-600 dark:text-emerald-400">
                {format(Math.round(results.savedInterest))}
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Tenure Reduced By</p>
                  <p className="font-semibold text-sm md:text-base">
                    {Math.floor(results.savedMonths / 12)} Yrs, {results.savedMonths % 12} Mos
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Your Current EMI</p>
                  <p className="font-semibold text-sm md:text-base">{format(Math.round(results.emi))}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-background p-3 rounded-lg border text-center">
                  <p className="text-xs text-muted-foreground mb-1">Old Total Interest</p>
                  <p className="font-semibold">{format(Math.round(results.oldInterest))}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">New Total Interest</p>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">{format(Math.round(results.newInterest))}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
