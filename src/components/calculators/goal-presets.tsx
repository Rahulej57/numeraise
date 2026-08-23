"use client";

import React from "react";
import { Sparkles, Target, Zap } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export interface GoalPreset {
  id: string;
  label: string;
  badge?: string;
  values: Record<string, number>;
  description?: string;
}

const PRESETS_BY_SLUG: Record<string, GoalPreset[]> = {
  "sip-calculator": [
    {
      id: "1cr-15yr",
      label: "₹1 Crore in 15 Yrs",
      badge: "Most Popular",
      values: { monthly: 15000 / 83, rate: 14, years: 15 },
      description: "Monthly SIP of ₹15,000 at 14% CAGR creates ~₹1.01 Crore corpus"
    },
    {
      id: "1cr-10yr",
      label: "₹1 Crore in 10 Yrs",
      badge: "Fast Track",
      values: { monthly: 43000 / 83, rate: 13, years: 10 },
      description: "Aggressive wealth creation: ₹43k/mo at 13% for 10 years"
    },
    {
      id: "50l-child",
      label: "₹50 Lakhs College Fund",
      values: { monthly: 15000 / 83, rate: 12, years: 12 },
      description: "Targeting higher education corpus with a 12-year horizon"
    },
    {
      id: "5k-starter",
      label: "₹5,000 Starter SIP",
      values: { monthly: 5000 / 83, rate: 12, years: 15 },
      description: "Turn ₹5k/mo into ~₹25 Lakhs over 15 years"
    },
    {
      id: "10k-fire",
      label: "₹10,000 Wealth Builder",
      values: { monthly: 10000 / 83, rate: 13, years: 20 },
      description: "Accumulate ~₹1.15 Crore over a 20-year career"
    }
  ],
  "step-up-sip": [
    {
      id: "stepup-1cr-12yr",
      label: "₹1 Crore with 10% Step-Up",
      badge: "High Growth",
      values: { initialMonthly: 15000 / 83, stepUpPercent: 10, rate: 13, years: 12 },
      description: "10% annual salary hike boost reaches ₹1 Cr 3 years earlier"
    },
    {
      id: "stepup-5k-power",
      label: "₹5k Start + 10% Hike",
      values: { initialMonthly: 5000 / 83, stepUpPercent: 10, rate: 12, years: 15 },
      description: "Starting small and stepping up with increments"
    }
  ],
  "lumpsum-calculator": [
    {
      id: "lump-5l-10yr",
      label: "₹5 Lakhs in 10 Yrs",
      badge: "Growth",
      values: { amount: 500000 / 83, rate: 13, years: 10 },
      description: "₹5L grows to ~₹17 Lakhs at 13% CAGR"
    },
    {
      id: "lump-10l-15yr",
      label: "₹10 Lakhs in 15 Yrs",
      values: { amount: 1000000 / 83, rate: 12, years: 15 },
      description: "₹10L one-time investment grows into ~₹55 Lakhs"
    },
    {
      id: "lump-1l-double",
      label: "₹1 Lakh 10x Goal",
      values: { amount: 100000 / 83, rate: 15, years: 16 },
      description: "Power of 15% equity returns over 16 years"
    }
  ],
  "emi-calculator": [
    {
      id: "home-50l-20yr",
      label: "₹50L Home Loan (20 Yr)",
      badge: "Home Loan",
      values: { amount: 5000000 / 83, rate: 8.5, tenure: 20 },
      description: "EMI ~₹43,391/mo at current bank interest rates"
    },
    {
      id: "home-30l-15yr",
      label: "₹30L Home Loan (15 Yr)",
      values: { amount: 3000000 / 83, rate: 8.5, tenure: 15 },
      description: "Shorter tenure saves massive interest over time"
    },
    {
      id: "car-10l-5yr",
      label: "₹10L Car Loan (5 Yr)",
      badge: "Car Loan",
      values: { amount: 1000000 / 83, rate: 9.0, tenure: 5 },
      description: "Standard 5-year auto loan EMI ~₹20,758/mo"
    },
    {
      id: "personal-5l-3yr",
      label: "₹5L Personal Loan (3 Yr)",
      values: { amount: 500000 / 83, rate: 11.5, tenure: 3 },
      description: "Short-term personal loan planning"
    }
  ]
};

interface GoalPresetsProps {
  slug: string;
  onApplyPreset: (values: Record<string, number>) => void;
  activePresetId?: string | null;
}

export function GoalPresets({ slug, onApplyPreset, activePresetId }: GoalPresetsProps) {
  const presets = PRESETS_BY_SLUG[slug];
  const { currency } = useCurrency();

  if (!presets || presets.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Goal Scenarios</span>
        </div>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> 1-Click calculation
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
