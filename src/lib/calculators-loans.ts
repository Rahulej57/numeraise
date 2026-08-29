import { CalculatorConfig } from "./calculator-engine";

export const loanCalculators: Record<string, CalculatorConfig> = {
  "us-mortgage-calculator": {
    slug: "us-mortgage-calculator",
    name: "US Mortgage Calculator",
    description: "Calculate your monthly PITI mortgage payment including taxes, insurance, and PMI.",
    inputs: [
      { id: "homePrice", label: "Home Purchase Price", type: "currency", min: 50000, max: 5000000, step: 5000, default: 400000 },
      { id: "downPayment", label: "Down Payment (%)", type: "percentage", min: 0, max: 100, step: 1, default: 20 },
      { id: "rate", label: "Mortgage Interest Rate (%)", type: "percentage", min: 1, max: 15, step: 0.1, default: 7 },
      { id: "years", label: "Loan Term (Years)", type: "years", min: 5, max: 40, step: 5, default: 30 },
      { id: "propertyTax", label: "Property Tax Rate (%)", type: "percentage", min: 0, max: 5, step: 0.1, default: 1.2 },
      { id: "insurance", label: "Annual Home Insurance", type: "currency", min: 0, max: 10000, step: 100, default: 1200 }
    ],
    calculate: (inputs) => {
      const homePrice = inputs.homePrice || 400000;
      const downPayment = inputs.downPayment !== undefined ? inputs.downPayment : 20;
      const rate = inputs.rate || 7;
      const years = inputs.years || 30;
      const propertyTax = inputs.propertyTax !== undefined ? inputs.propertyTax : 1.2;
      const insurance = inputs.insurance !== undefined ? inputs.insurance : 1200;

      const loanAmount = homePrice * (1 - downPayment / 100);
      const monthlyRate = rate / 12 / 100;
      const months = years * 12;
      const monthlyPI = monthlyRate > 0 ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1) : loanAmount / months;
      const monthlyTax = (homePrice * (propertyTax / 100)) / 12;
      const monthlyIns = insurance / 12;
      const monthlyPMI = downPayment < 20 ? (loanAmount * 0.005) / 12 : 0;
      const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI;

      return {
        primaryLabel: "Total Monthly Payment (PITI)",
        primaryValue: Math.round(totalMonthly),
        primaryType: "currency",
        secondaryLabel: "Principal & Interest (P&I)",
        secondaryValue: Math.round(monthlyPI),
        secondaryType: "currency",
        tertiaryLabel: "Taxes, Insurance & PMI",
        tertiaryValue: Math.round(monthlyTax + monthlyIns + monthlyPMI),
        tertiaryType: "currency"
      };
    }
  },
  "car-loan-emi": {
    slug: "car-loan-emi", name: "Car Loan EMI", description: "Calculate your monthly EMI for a car loan.",
    inputs: [
      { id: "principal", label: "Loan Amount", type: "currency", min: 100000, max: 5000000, step: 10000, default: 800000 },
      { id: "rate", label: "Interest Rate", type: "percentage", min: 5, max: 20, step: 0.1, default: 8.5 },
      { id: "years", label: "Tenure (Years)", type: "years", min: 1, max: 7, step: 1, default: 5 }
    ],
    calculate: (inputs) => {
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = r > 0 ? (inputs.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : inputs.principal / n;
      const totalAmount = emi * n;
      return {
        primaryLabel: "Monthly EMI", primaryValue: emi, primaryType: "currency",
        secondaryLabel: "Total Interest", secondaryValue: totalAmount - inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Total Payment", tertiaryValue: totalAmount, tertiaryType: "currency"
      };
    }
  },
  "personal-loan-calculator": {
    slug: "personal-loan-calculator", name: "Personal Loan EMI", description: "Calculate EMI and interest for a personal loan.",
    inputs: [
      { id: "principal", label: "Loan Amount", type: "currency", min: 10000, max: 2000000, step: 10000, default: 500000 },
      { id: "rate", label: "Interest Rate", type: "percentage", min: 8, max: 24, step: 0.1, default: 12 },
      { id: "years", label: "Tenure (Years)", type: "years", min: 1, max: 5, step: 1, default: 3 }
    ],
    calculate: (inputs) => {
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = r > 0 ? (inputs.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : inputs.principal / n;
      return {
        primaryLabel: "Monthly EMI", primaryValue: emi, primaryType: "currency",
        secondaryLabel: "Total Interest", secondaryValue: (emi * n) - inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Total Payment", tertiaryValue: emi * n, tertiaryType: "currency"
      };
    }
  },
  "education-loan-calculator": {
    slug: "education-loan-calculator", name: "Education Loan", description: "Calculate EMI for your higher education loan.",
    inputs: [
      { id: "principal", label: "Loan Amount", type: "currency", min: 100000, max: 10000000, step: 100000, default: 2000000 },
      { id: "rate", label: "Interest Rate", type: "percentage", min: 6, max: 15, step: 0.1, default: 9.5 },
      { id: "years", label: "Tenure (Years)", type: "years", min: 1, max: 15, step: 1, default: 10 }
    ],
    calculate: (inputs) => {
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = r > 0 ? (inputs.principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : inputs.principal / n;
      return {
        primaryLabel: "Monthly EMI", primaryValue: emi, primaryType: "currency",
        secondaryLabel: "Total Interest", secondaryValue: (emi * n) - inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Total Payment", tertiaryValue: emi * n, tertiaryType: "currency"
      };
    }
  },
  "loan-refinance": {
    slug: "loan-refinance", name: "Loan Refinance", description: "Compare your current loan with a new refinanced loan.",
    inputs: [
      { id: "balance", label: "Current Loan Balance", type: "currency", min: 100000, max: 10000000, step: 10000, default: 5000000 },
      { id: "oldRate", label: "Current Interest Rate", type: "percentage", min: 5, max: 20, step: 0.1, default: 9.0 },
      { id: "newRate", label: "New Interest Rate", type: "percentage", min: 4, max: 15, step: 0.1, default: 8.0 },
      { id: "years", label: "Remaining Years", type: "years", min: 1, max: 30, step: 1, default: 15 }
    ],
    calculate: (inputs) => {
      const n = inputs.years * 12;
      const oldR = inputs.oldRate / 12 / 100;
      const oldEmi = oldR > 0 ? (inputs.balance * oldR * Math.pow(1 + oldR, n)) / (Math.pow(1 + oldR, n) - 1) : inputs.balance / n;
      const newR = inputs.newRate / 12 / 100;
      const newEmi = newR > 0 ? (inputs.balance * newR * Math.pow(1 + newR, n)) / (Math.pow(1 + newR, n) - 1) : inputs.balance / n;
      
      const oldTotal = oldEmi * n;
      const newTotal = newEmi * n;
      
      return {
        primaryLabel: "Total Savings", primaryValue: oldTotal - newTotal, primaryType: "currency",
        secondaryLabel: "New EMI", secondaryValue: newEmi, secondaryType: "currency",
        tertiaryLabel: "Monthly Savings", tertiaryValue: oldEmi - newEmi, tertiaryType: "currency"
      };
    }
  },
  "credit-card-payoff": {
    slug: "credit-card-payoff", name: "Credit Card Payoff", description: "Calculate how long it takes to pay off credit card debt.",
    inputs: [
      { id: "balance", label: "Card Balance", type: "currency", min: 1000, max: 1000000, step: 1000, default: 50000 },
      { id: "rate", label: "Interest Rate (APR)", type: "percentage", min: 10, max: 45, step: 1, default: 36 },
      { id: "payment", label: "Monthly Payment", type: "currency", min: 100, max: 50000, step: 100, default: 5000 }
    ],
    calculate: (inputs) => {
      const r = inputs.rate / 12 / 100;
      let months = 0;
      let balance = inputs.balance;
      let totalInterest = 0;
      
      if (inputs.payment <= balance * r) {
        return {
          primaryLabel: "Warning: Payment too low", primaryValue: 0, primaryType: "number",
          secondaryLabel: "Months to Payoff", secondaryValue: Infinity, secondaryType: "number",
          tertiaryLabel: "Total Interest", tertiaryValue: Infinity, tertiaryType: "currency"
        };
      }
      
      while (balance > 0 && months < 1200) {
        const interest = balance * r;
        totalInterest += interest;
        balance = balance + interest - inputs.payment;
        months++;
      }
      
      return {
        primaryLabel: "Months to Payoff", primaryValue: months, primaryType: "number",
        secondaryLabel: "Total Interest Paid", secondaryValue: totalInterest, secondaryType: "currency",
        tertiaryLabel: "Total Paid", tertiaryValue: inputs.balance + totalInterest, tertiaryType: "currency"
      };
    }
  }
};
