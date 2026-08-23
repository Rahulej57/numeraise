"use client";

import React from "react";
import { Sparkles, Target, Zap, Globe } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export interface GoalPreset {
  id: string;
  label: string;
  badge?: string;
  values: Record<string, number>;
  description?: string;
  currencyCode?: string; // If specific to USD or INR
}

const GLOBAL_PRESETS_BY_SLUG: Record<string, (sym: string, isINR: boolean) => GoalPreset[]> = {
  // Global & US Retirement
  "401k-calculator": (sym) => [
    {
      id: "401k-1m",
      label: "$1M Retirement Nest Egg",
      badge: "Target Goal",
      values: { salary: 85000, contributionPercent: 10, employerMatch: 5, years: 30, returnRate: 8 },
      description: "Investing 10% salary with 5% employer match over 30 years"
    },
    {
      id: "401k-max",
      label: "Max Out 401(k) ($23,000/yr)",
      badge: "Max Limit",
      values: { salary: 150000, contributionPercent: 15.3, employerMatch: 6, years: 20, returnRate: 8 },
      description: "Maximizing annual contribution limit for aggressive wealth growth"
    },
    {
      id: "401k-starter",
      label: "6% Match Starter Plan",
      values: { salary: 60000, contributionPercent: 6, employerMatch: 6, years: 25, returnRate: 7.5 },
      description: "Capturing 100% of free employer matching funds"
    }
  ],

  "us-mortgage-calculator": () => [
    {
      id: "mort-400k-30yr",
      label: "$400k Home (30-Yr @ 6.5%)",
      badge: "Standard 30Y",
      values: { homePrice: 400000, downPayment: 80000, interestRate: 6.5, loanTerm: 30, propertyTax: 1.2 },
      description: "Standard 30-year fixed with 20% down payment"
    },
    {
      id: "mort-600k-15yr",
      label: "$600k Home (15-Yr @ 5.8%)",
      badge: "Fast Payoff",
      values: { homePrice: 600000, downPayment: 120000, interestRate: 5.8, loanTerm: 15, propertyTax: 1.2 },
      description: "15-year fixed mortgage saves over $150k in total interest"
    },
    {
      id: "mort-starter-fha",
      label: "$300k Starter Home (5% Down)",
      values: { homePrice: 300000, downPayment: 15000, interestRate: 6.8, loanTerm: 30, propertyTax: 1.1 },
      description: "Low down-payment home purchase scenario"
    }
  ],

  "paycheck-calculator": () => [
    {
      id: "pay-75k-biweekly",
      label: "$75,000 / Year (Bi-Weekly)",
      badge: "Bi-Weekly",
      values: { grossSalary: 75000, payFrequency: 26, allowances: 1, stateRate: 5 },
      description: "Standard US full-time salary estimated take-home pay"
    },
    {
      id: "pay-120k-tech",
      label: "$120,000 / Year (Semi-Monthly)",
      badge: "Tech / Pro",
      values: { grossSalary: 120000, payFrequency: 24, allowances: 1, stateRate: 6 },
      description: "Higher tax bracket take-home estimation"
    }
  ],

  "credit-card-payoff": (sym) => [
    {
      id: "debt-5k-12mo",
      label: `${sym}5,000 Payoff in 12 Months`,
      badge: "Aggressive",
      values: { balance: 5000, interestRate: 22, monthlyPayment: 470 },
      description: `Clear ${sym}5k card balance in 1 year at 22% APR`
    },
    {
      id: "debt-10k-avalanche",
      label: `${sym}10,000 Debt Freedom Plan`,
      badge: "Debt Free",
      values: { balance: 10000, interestRate: 19.5, monthlyPayment: 500 },
      description: `Fixed monthly payments eliminate ${sym}10,000 balance in 24 months`
    }
  ],

  "cagr-calculator": () => [
    {
      id: "cagr-sp500",
      label: "S&P 500 Historical (10% CAGR)",
      badge: "Index Benchmark",
      values: { initialValue: 10000, finalValue: 67275, years: 20 },
      description: "US broad equity market compounding benchmark"
    },
    {
      id: "cagr-10x",
      label: "10x Capital in 15 Years",
      badge: "High Growth",
      values: { initialValue: 10000, finalValue: 100000, years: 15 },
      description: "Requires 16.6% CAGR to 10x portfolio value"
    },
    {
      id: "cagr-rule72",
      label: "Double Capital in 7 Years",
      values: { initialValue: 25000, finalValue: 50000, years: 7 },
      description: "Rule of 72 benchmark (10.4% CAGR)"
    }
  ],

  "fire-calculator": (sym, isINR) => [
    {
      id: "fire-standard",
      label: isINR ? "₹2.5 Crore Standard FIRE" : `${sym}2.5M Standard FIRE`,
      badge: "4% Rule",
      values: { currentNetWorth: isINR ? 2000000 / 83 : 100000, annualExpenses: isINR ? 1000000 / 83 : 100000, savingsRate: 40, returnRate: 8 },
      description: "Safe 4% annual withdrawal rule for early retirement"
    },
    {
      id: "fire-lean",
      label: isINR ? "₹1.5 Crore Lean FIRE" : `${sym}1.5M Lean FIRE`,
      values: { currentNetWorth: isINR ? 1000000 / 83 : 50000, annualExpenses: isINR ? 600000 / 83 : 60000, savingsRate: 50, returnRate: 8 },
      description: "Frugal lifestyle early retirement target"
    }
  ],

  "sales-tax-calculator": () => [
    {
      id: "tax-ca",
      label: "California (7.25%)",
      badge: "CA",
      values: { amount: 100, taxRate: 7.25 },
      description: "Statewide base sales tax"
    },
    {
      id: "tax-tx",
      label: "Texas / NYC (8.25% - 8.875%)",
      badge: "TX/NY",
      values: { amount: 100, taxRate: 8.25 },
      description: "Major metro sales tax rate"
    }
  ],

  "vat-calculator": (sym) => [
    {
      id: "vat-uk-std",
      label: "UK Standard VAT (20%)",
      badge: "UK 20%",
      values: { amount: 100, vatRate: 20 },
      description: "Standard UK/EU VAT rate"
    },
    {
      id: "vat-reduced",
      label: "Reduced Rate VAT (5%)",
      badge: "Reduced 5%",
      values: { amount: 100, vatRate: 5 },
      description: "Domestic fuel, energy, and essentials"
    }
  ],

  "rent-vs-buy": (sym) => [
    {
      id: "rvb-metro",
      label: `${sym}2,500 Rent vs ${sym}500k Home`,
      badge: "Metro Market",
      values: { homePrice: 500000, monthlyRent: 2500, horizon: 10, propertyAppreciation: 4, investmentReturn: 8 },
      description: "Compare total wealth after 10 years of renting vs homeownership"
    }
  ],

  "lease-vs-buy": (sym) => [
    {
      id: "lvb-car",
      label: `${sym}45,000 Vehicle (3-Yr Lease vs Finance)`,
      badge: "Auto Decision",
      values: { vehiclePrice: 45000, leaseMonthly: 550, loanRate: 6.5, loanTerm: 5, leaseTerm: 3 },
      description: "Determine lowest net financial cost for a new vehicle"
    }
  ],

  // India-Specific Tools
  "sip-calculator": (sym, isINR) => [
    {
      id: "1cr-15yr",
      label: isINR ? "₹1 Crore in 15 Yrs" : `${sym}1M Wealth Goal`,
      badge: "Most Popular",
      values: { monthly: isINR ? 15000 / 83 : 1500, rate: 14, years: 15 },
      description: isINR ? "Monthly SIP of ₹15,000 at 14% CAGR creates ~₹1.01 Crore corpus" : `Disciplined ${sym}1,500/mo compounding`
    },
    {
      id: "1cr-10yr",
      label: isINR ? "₹1 Crore in 10 Yrs" : `${sym}500k in 10 Yrs`,
      badge: "Fast Track",
      values: { monthly: isINR ? 43000 / 83 : 2500, rate: 13, years: 10 },
      description: "Aggressive wealth creation strategy"
    },
    {
      id: "50l-child",
      label: isINR ? "₹50 Lakhs College Fund" : `${sym}250k Education Fund`,
      values: { monthly: isINR ? 15000 / 83 : 1000, rate: 12, years: 12 },
      description: "Targeting higher education corpus with a 12-year horizon"
    },
    {
      id: "5k-starter",
      label: isINR ? "₹5,000 Starter SIP" : `${sym}250 Starter Plan`,
      values: { monthly: isINR ? 5000 / 83 : 250, rate: 12, years: 15 },
      description: "Start small and let compounding do the heavy lifting"
    }
  ],

  "step-up-sip": (sym, isINR) => [
    {
      id: "stepup-1cr-12yr",
      label: isINR ? "₹1 Crore with 10% Step-Up" : "10% Annual Step-Up Boost",
      badge: "High Growth",
      values: { initialMonthly: isINR ? 15000 / 83 : 1000, stepUpPercent: 10, rate: 13, years: 12 },
      description: "10% annual increment reaches wealth goals years earlier"
    }
  ],

  "lumpsum-calculator": (sym, isINR) => [
    {
      id: "lump-5l-10yr",
      label: isINR ? "₹5 Lakhs in 10 Yrs" : `${sym}50,000 Compounding (10 Yr)`,
      badge: "Growth",
      values: { amount: isINR ? 500000 / 83 : 50000, rate: 13, years: 10 },
      description: "One-time investment compounding trajectory"
    },
    {
      id: "lump-10l-15yr",
      label: isINR ? "₹10 Lakhs in 15 Yrs" : `${sym}100,000 Compounding (15 Yr)`,
      values: { amount: isINR ? 1000000 / 83 : 100000, rate: 12, years: 15 },
      description: "Long-term lump sum compounding"
    }
  ],

  "emi-calculator": (sym, isINR) => [
    {
      id: "home-50l-20yr",
      label: isINR ? "₹50L Home Loan (20 Yr)" : `${sym}350k Home Loan (20 Yr)`,
      badge: "Home Loan",
      values: { amount: isINR ? 5000000 / 83 : 350000, rate: isINR ? 8.5 : 6.5, tenure: 20 },
      description: "Standard 20-year fixed home loan amortisation"
    },
    {
      id: "car-10l-5yr",
      label: isINR ? "₹10L Car Loan (5 Yr)" : `${sym}30k Auto Loan (5 Yr)`,
      badge: "Auto Loan",
      values: { amount: isINR ? 1000000 / 83 : 30000, rate: isINR ? 9.0 : 6.0, tenure: 5 },
      description: "Standard 5-year auto loan EMI"
    }
  ]
};

interface GoalPresetsProps {
  slug: string;
  onApplyPreset: (values: Record<string, number>) => void;
  activePresetId?: string | null;
}

export function GoalPresets({ slug, onApplyPreset, activePresetId }: GoalPresetsProps) {
  const { currency } = useCurrency();
  const isINR = currency.code === "INR";
  const sym = currency.symbol;

  const presetGetter = GLOBAL_PRESETS_BY_SLUG[slug];
  const presets = presetGetter ? presetGetter(sym, isINR) : [];

  if (!presets || presets.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Goal Scenarios</span>
        </div>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Globe className="w-3 h-3 text-primary" />
          <span>Adapts to {currency.code}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.values)}
              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                  : "bg-background/80 hover:bg-background border border-border hover:border-primary/40 text-foreground hover:shadow-xs"
              }`}
              title={preset.description}
            >
              <Target className={`w-3 h-3 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
              <span>{preset.label}</span>
              {preset.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary group-hover:bg-primary/20"
                  }`}
                >
                  {preset.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
