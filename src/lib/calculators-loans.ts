import { CalculatorConfig } from "./calculator-engine";

export const loanCalculators: Record<string, CalculatorConfig> = {
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
