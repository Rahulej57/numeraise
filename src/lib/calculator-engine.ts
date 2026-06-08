export interface CalculatorInput {
  id: string;
  label: string;
  type: "currency" | "percentage" | "years" | "number";
  min: number;
  max: number;
  step: number;
  default: number;
  currencyOverrides?: Record<string, Partial<Omit<CalculatorInput, 'id' | 'label' | 'type' | 'currencyOverrides'>>>;
}

export interface CalculatorResult {
  primaryValue: number;
  primaryLabel: string;
  primaryType: "currency" | "percentage" | "number";
  secondaryValue?: number;
  secondaryLabel?: string;
  secondaryType?: "currency" | "percentage" | "number";
  tertiaryValue?: number;
  tertiaryLabel?: string;
  tertiaryType?: "currency" | "percentage" | "number";
  chartData?: { name: string; value: number; color: string; type?: "currency" | "percentage" | "number" }[];
}

export interface CalculatorConfig {
  slug: string;
  name: string;
  description: string;
  seoContent?: string;
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, number>) => CalculatorResult;
}

// Fallback logic for generic compound interest
const calculateGenericCI = (p: number, r: number, t: number) => {
  const amount = p * Math.pow(1 + r / 100, t);
  return {
    primaryLabel: "Total Maturity Value",
    primaryValue: amount,
    primaryType: "currency" as const,
    secondaryLabel: "Total Investment",
    secondaryValue: p,
    secondaryType: "currency" as const,
    tertiaryLabel: "Wealth Gained",
    tertiaryValue: amount - p,
    tertiaryType: "currency" as const,
  };
};

// Fallback logic for generic loan (EMI)
const calculateGenericLoan = (p: number, r: number, t: number) => {
  const monthlyRate = r / 12 / 100;
  const months = t * 12;
  const emi = monthlyRate > 0 ? (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : (p / months);
  const totalAmount = emi * months;
  
  return {
    primaryLabel: "Total Amount Payable",
    primaryValue: totalAmount,
    primaryType: "currency" as const,
    secondaryLabel: "Principal Amount",
    secondaryValue: p,
    secondaryType: "currency" as const,
    tertiaryLabel: "Total Interest Expense",
    tertiaryValue: totalAmount - p,
    tertiaryType: "currency" as const,
  };
};

import { investmentCalculators } from "./calculators-investments";
import { loanCalculators } from "./calculators-loans";
import { taxCalculators } from "./calculators-tax";
import { corporateCalculators } from "./calculators-corporate";
import { otherCalculators } from "./calculators-other";

export const calculatorRegistry: Record<string, CalculatorConfig> = {
  ...investmentCalculators,
  ...loanCalculators,
  ...taxCalculators,
  ...corporateCalculators,
  ...otherCalculators,
  "swp-calculator": {
    slug: "swp-calculator",
    name: "SWP Calculator",
    description: "Calculate your monthly income from a Systematic Withdrawal Plan.",
    inputs: [
      { id: "principal", label: "Total Investment", type: "currency", min: 50000, max: 100000000, step: 10000, default: 5000000 },
      { id: "withdrawal", label: "Monthly Withdrawal", type: "currency", min: 1000, max: 500000, step: 1000, default: 30000 },
      { id: "rate", label: "Expected Return (p.a)", type: "percentage", min: 1, max: 30, step: 0.5, default: 10 },
      { id: "years", label: "Time Period", type: "years", min: 1, max: 40, step: 1, default: 10 }
    ],
    calculate: (inputs) => {
      const { principal, withdrawal, rate, years } = inputs;
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      let balance = principal;
      let totalWithdrawn = 0;
      for (let i = 0; i < months; i++) {
        balance = balance * (1 + monthlyRate) - withdrawal;
        totalWithdrawn += withdrawal;
        if (balance < 0) { balance = 0; break; }
      }
      return {
        primaryLabel: "Final Portfolio Balance",
        primaryValue: balance,
        primaryType: "currency",
        secondaryLabel: "Total Withdrawn",
        secondaryValue: totalWithdrawn,
        secondaryType: "currency",
        tertiaryLabel: "Initial Investment",
        tertiaryValue: principal,
        tertiaryType: "currency"
      };
    }
  },
  "ppf-calculator": {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    description: "Calculate your tax-free returns from Public Provident Fund (PPF).",
    inputs: [
      { id: "yearly", label: "Yearly Investment", type: "currency", min: 500, max: 150000, step: 500, default: 150000 },
      { id: "years", label: "Time Period (Min 15)", type: "years", min: 15, max: 50, step: 5, default: 15 },
    ],
    calculate: (inputs) => {
      const rate = 7.1; // Current fixed rate
      const { yearly, years } = inputs;
      let balance = 0;
      for (let i = 0; i < years; i++) {
        balance = (balance + yearly) * (1 + rate / 100);
      }
      return {
        primaryLabel: "Maturity Amount",
        primaryValue: balance,
        primaryType: "currency",
        secondaryLabel: "Total Invested",
        secondaryValue: yearly * years,
        secondaryType: "currency",
        tertiaryLabel: "Total Interest",
        tertiaryValue: balance - (yearly * years),
        tertiaryType: "currency"
      };
    }
  },
  "step-up-sip": {
    slug: "step-up-sip",
    name: "Step-Up SIP Calculator",
    description: "Calculate SIP returns with an annual step-up percentage.",
    inputs: [
      { id: "monthly", label: "Initial Monthly Investment", type: "currency", min: 500, max: 1000000, step: 500, default: 10000, currencyOverrides: { USD: { default: 500, min: 50, max: 20000, step: 50 }, GBP: { default: 400, min: 50, max: 20000, step: 50 } } },
      { id: "stepUp", label: "Annual Step-Up", type: "percentage", min: 1, max: 50, step: 1, default: 10 },
      { id: "rate", label: "Expected Return (p.a)", type: "percentage", min: 1, max: 30, step: 0.5, default: 12, currencyOverrides: { USD: { default: 8, min: 1, max: 20 }, GBP: { default: 7, min: 1, max: 20 } } },
      { id: "years", label: "Time Period", type: "years", min: 1, max: 40, step: 1, default: 15 }
    ],
    calculate: (inputs) => {
      const { monthly, stepUp, rate, years } = inputs;
      const monthlyRate = rate / 12 / 100;
      let balance = 0;
      let currentMonthly = monthly;
      let totalInvested = 0;
      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          balance = (balance + currentMonthly) * (1 + monthlyRate);
          totalInvested += currentMonthly;
        }
        currentMonthly = currentMonthly * (1 + stepUp / 100);
      }
      return {
        primaryLabel: "Total Wealth Created",
        primaryValue: balance,
        primaryType: "currency",
        secondaryLabel: "Total Invested",
        secondaryValue: totalInvested,
        secondaryType: "currency",
        tertiaryLabel: "Est. Returns",
        tertiaryValue: balance - totalInvested,
        tertiaryType: "currency"
      };
    }
  },
  "margin-calculator": {
    slug: "margin-calculator",
    name: "Margin Calculator",
    description: "Calculate your gross profit and margin percentage.",
    inputs: [
      { id: "cost", label: "Cost of Item", type: "currency", min: 1, max: 1000000, step: 1, default: 100 },
      { id: "revenue", label: "Sale Price", type: "currency", min: 1, max: 1000000, step: 1, default: 150 },
    ],
    calculate: (inputs) => {
      const { cost, revenue } = inputs;
      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;
      return {
        primaryLabel: "Gross Margin (%)",
        primaryValue: margin,
        primaryType: "percentage",
        secondaryLabel: "Gross Profit",
        secondaryValue: profit,
        secondaryType: "currency",
        tertiaryLabel: "Markup (%)",
        tertiaryValue: markup,
        tertiaryType: "percentage"
      };
    }
  }
};

// Fallback logic for generic tax
const calculateGenericTax = (income: number, rate: number) => {
  const taxAmount = (income * rate) / 100;
  const netIncome = income - taxAmount;
  
  return {
    primaryLabel: "Total Tax Payable",
    primaryValue: taxAmount,
    primaryType: "currency" as const,
    secondaryLabel: "Gross Income",
    secondaryValue: income,
    secondaryType: "currency" as const,
    tertiaryLabel: "Net Income After Tax",
    tertiaryValue: netIncome,
    tertiaryType: "currency" as const,
  };
};

// If a calculator is requested that isn't fully stubbed above, we generate a generic default config on the fly.
export const getCalculatorConfig = (slug: string, name: string = "Calculator"): CalculatorConfig => {
  if (calculatorRegistry[slug]) {
    return calculatorRegistry[slug];
  }
  
  const isLoan = slug.includes("loan") || slug.includes("payoff") || slug.includes("debt") || slug.includes("emi") || slug.includes("mortgage");
  const isTax = slug.includes("tax") || slug.includes("gst") || slug.includes("tds");
  
  // Generic Fallback Config
  return {
    slug,
    name: name,
    description: isTax ? "Estimate your tax liability and net income." : isLoan ? "Estimate your loan payments and total interest." : "Estimate your financial outcomes based on custom variables.",
    inputs: isTax ? [
      { id: "income", label: "Gross Amount / Income", type: "currency", min: 1000, max: 10000000, step: 1000, default: 1000000 },
      { id: "rate", label: "Tax Rate", type: "percentage", min: 0, max: 50, step: 1, default: 18 }
    ] : [
      { id: "principal", label: "Initial Amount", type: "currency", min: 1000, max: 10000000, step: 1000, default: 100000 },
      { id: "rate", label: "Interest Rate", type: "percentage", min: 1, max: 30, step: 0.5, default: 10 },
      { id: "years", label: "Time Period", type: "years", min: 1, max: 40, step: 1, default: 5 }
    ],
    calculate: (inputs) => isTax 
      ? calculateGenericTax(inputs.income || 1000000, inputs.rate || 18)
      : isLoan 
        ? calculateGenericLoan(inputs.principal || 100000, inputs.rate || 10, inputs.years || 5)
        : calculateGenericCI(inputs.principal || 100000, inputs.rate || 10, inputs.years || 5)
  };
};
