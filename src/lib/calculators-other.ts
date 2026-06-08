import { CalculatorConfig } from "./calculator-engine";

export const otherCalculators: Record<string, CalculatorConfig> = {
  "health-insurance-calculator": {
    slug: "health-insurance-calculator", name: "Health Insurance Needs", description: "Estimate your optimal health insurance coverage.",
    inputs: [
      { id: "members", label: "Family Members to Cover", type: "number", min: 1, max: 10, step: 1, default: 4 },
      { id: "age", label: "Age of Oldest Member", type: "years", min: 18, max: 80, step: 1, default: 45 },
      { id: "city", label: "City Type (1=Metro, 2=Tier-2, 3=Tier-3)", type: "number", min: 1, max: 3, step: 1, default: 1 }
    ],
    calculate: (inputs) => {
      let base = inputs.members * 200000;
      if (inputs.age > 45) base += 300000;
      if (inputs.age > 60) base += 500000;
      if (inputs.city === 1) base += 500000;
      else if (inputs.city === 2) base += 200000;
      
      return {
        primaryLabel: "Recommended Coverage", primaryValue: base, primaryType: "currency",
        secondaryLabel: "Est. Annual Premium", secondaryValue: (base * 0.015), secondaryType: "currency"
      };
    }
  },
  "life-insurance-premium": {
    slug: "life-insurance-premium", name: "Life Insurance Premium", description: "Estimate term life insurance premium.",
    inputs: [
      { id: "coverage", label: "Life Cover Amount", type: "currency", min: 5000000, max: 100000000, step: 1000000, default: 10000000 },
      { id: "age", label: "Current Age", type: "years", min: 18, max: 65, step: 1, default: 30 },
      { id: "smoker", label: "Smoker? (1=Yes, 0=No)", type: "number", min: 0, max: 1, step: 1, default: 0 }
    ],
    calculate: (inputs) => {
      let baseRate = 0.0008; // Base rate per unit
      if (inputs.age > 30) baseRate += (inputs.age - 30) * 0.00005;
      if (inputs.smoker === 1) baseRate *= 1.5;
      
      const annualPremium = inputs.coverage * baseRate;
      return {
        primaryLabel: "Est. Annual Premium", primaryValue: annualPremium, primaryType: "currency",
        secondaryLabel: "Monthly Premium", secondaryValue: annualPremium / 12, secondaryType: "currency",
        tertiaryLabel: "Total Cover", tertiaryValue: inputs.coverage, tertiaryType: "currency"
      };
    }
  },
  "human-life-value": {
    slug: "human-life-value", name: "Human Life Value", description: "Calculate your economic value to your dependents.",
    inputs: [
      { id: "income", label: "Annual Income", type: "currency", min: 200000, max: 50000000, step: 100000, default: 1200000 },
      { id: "expenses", label: "Personal Expenses (%)", type: "percentage", min: 10, max: 80, step: 1, default: 30 },
      { id: "years", label: "Years to Retirement", type: "years", min: 1, max: 50, step: 1, default: 30 }
    ],
    calculate: (inputs) => {
      const familyShare = inputs.income * (1 - (inputs.expenses / 100));
      const inflationAdjReturn = 0.03; // Real return assumption
      const hlv = familyShare * ((1 - Math.pow(1 + inflationAdjReturn, -inputs.years)) / inflationAdjReturn);
      return {
        primaryLabel: "Human Life Value", primaryValue: hlv, primaryType: "currency",
        secondaryLabel: "Family Share per Year", secondaryValue: familyShare, secondaryType: "currency",
        tertiaryLabel: "Working Years Left", tertiaryValue: inputs.years, tertiaryType: "number"
      };
    }
  },
  "fire-calculator": {
    slug: "fire-calculator", name: "FIRE Calculator", description: "Calculate your Financial Independence, Retire Early number.",
    inputs: [
      { id: "expenses", label: "Annual Expenses", type: "currency", min: 100000, max: 5000000, step: 50000, default: 600000 },
      { id: "swr", label: "Safe Withdrawal Rate", type: "percentage", min: 2, max: 6, step: 0.1, default: 4 }
    ],
    calculate: (inputs) => {
      const fireNumber = inputs.expenses / (inputs.swr / 100);
      return {
        primaryLabel: "FIRE Number", primaryValue: fireNumber, primaryType: "currency",
        secondaryLabel: "Annual Income Generated", secondaryValue: inputs.expenses, secondaryType: "currency",
        tertiaryLabel: "Withdrawal Rate", tertiaryValue: inputs.swr, tertiaryType: "percentage"
      };
    }
  },
  "nps-calculator": {
    slug: "nps-calculator", name: "NPS Calculator", description: "Calculate National Pension System returns.",
    inputs: [
      { id: "monthly", label: "Monthly Investment", type: "currency", min: 500, max: 150000, step: 500, default: 5000 },
      { id: "age", label: "Current Age", type: "years", min: 18, max: 60, step: 1, default: 30 },
      { id: "rate", label: "Expected Return (p.a)", type: "percentage", min: 6, max: 15, step: 0.1, default: 10 }
    ],
    calculate: (inputs) => {
      const years = 60 - inputs.age;
      const months = years * 12;
      const r = inputs.rate / 12 / 100;
      let maturity = 0;
      for (let i = 0; i < months; i++) {
        maturity = (maturity + inputs.monthly) * (1 + r);
      }
      return {
        primaryLabel: "Corpus at Age 60", primaryValue: maturity, primaryType: "currency",
        secondaryLabel: "Total Invested", secondaryValue: inputs.monthly * months, secondaryType: "currency",
        tertiaryLabel: "Max Tax-Free Commutation", tertiaryValue: maturity * 0.6, tertiaryType: "currency"
      };
    }
  },
  "gratuity-calculator": {
    slug: "gratuity-calculator", name: "Gratuity Calculator", description: "Calculate gratuity payable by employer.",
    inputs: [
      { id: "basic", label: "Basic Salary + DA", type: "currency", min: 5000, max: 2000000, step: 1000, default: 50000 },
      { id: "years", label: "Years of Service", type: "years", min: 5, max: 40, step: 1, default: 5 }
    ],
    calculate: (inputs) => {
      const gratuity = (15 * inputs.basic * inputs.years) / 26;
      return {
        primaryLabel: "Estimated Gratuity", primaryValue: gratuity, primaryType: "currency",
        secondaryLabel: "Years Worked", secondaryValue: inputs.years, secondaryType: "number",
        tertiaryLabel: "Basic Salary Used", tertiaryValue: inputs.basic, tertiaryType: "currency"
      };
    }
  },
  "pension-calculator": {
    slug: "pension-calculator", name: "Pension Calculator", description: "Calculate monthly pension from a corpus.",
    inputs: [
      { id: "corpus", label: "Retirement Corpus", type: "currency", min: 100000, max: 100000000, step: 100000, default: 10000000 },
      { id: "rate", label: "Annuity Rate (%)", type: "percentage", min: 3, max: 12, step: 0.1, default: 6 }
    ],
    calculate: (inputs) => {
      const annualPension = inputs.corpus * (inputs.rate / 100);
      return {
        primaryLabel: "Monthly Pension", primaryValue: annualPension / 12, primaryType: "currency",
        secondaryLabel: "Annual Pension", secondaryValue: annualPension, secondaryType: "currency",
        tertiaryLabel: "Corpus Used", tertiaryValue: inputs.corpus, tertiaryType: "currency"
      };
    }
  },
  "inflation-calculator": {
    slug: "inflation-calculator", name: "Inflation Calculator", description: "Calculate the future cost of items.",
    inputs: [
      { id: "current", label: "Current Cost", type: "currency", min: 100, max: 10000000, step: 100, default: 50000 },
      { id: "rate", label: "Inflation Rate (%)", type: "percentage", min: 1, max: 20, step: 0.1, default: 6 },
      { id: "years", label: "Years into Future", type: "years", min: 1, max: 50, step: 1, default: 10 }
    ],
    calculate: (inputs) => {
      const futureCost = inputs.current * Math.pow(1 + (inputs.rate / 100), inputs.years);
      return {
        primaryLabel: "Future Cost", primaryValue: futureCost, primaryType: "currency",
        secondaryLabel: "Loss in Purchasing Power", secondaryValue: futureCost - inputs.current, secondaryType: "currency",
        tertiaryLabel: "Current Value", tertiaryValue: inputs.current, tertiaryType: "currency"
      };
    }
  }
};
