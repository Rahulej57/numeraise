import { CalculatorInput } from "./calculator-engine";

export interface ComparisonResultMetric {
  label: string;
  value: number;
  type: "currency" | "percentage" | "number";
}

export interface ComparisonVerdict {
  winner: "A" | "B" | "Tie";
  summary: string;
  difference?: number;
}

export interface ComparisonConfig {
  slug: string;
  title: string;
  description: string;
  scenarioA: {
    name: string;
    inputs: CalculatorInput[];
  };
  scenarioB: {
    name: string;
    inputs: CalculatorInput[];
  };
  calculate: (inputsA: Record<string, number>, inputsB: Record<string, number>) => {
    metricsA: ComparisonResultMetric[];
    metricsB: ComparisonResultMetric[];
    verdict: ComparisonVerdict;
  };
}

export const comparisonRegistry: Record<string, ComparisonConfig> = {
  "sip-vs-fd": {
    slug: "sip-vs-fd",
    title: "SIP vs Fixed Deposit",
    description: "Compare the wealth creation potential of an Equity SIP against a traditional Recurring Fixed Deposit.",
    scenarioA: {
      name: "Equity SIP",
      inputs: [
        { id: "monthly", label: "Monthly Investment", type: "currency", min: 500, max: 1000000, step: 500, default: 10000 },
        { id: "rate", label: "Expected Return (p.a)", type: "percentage", min: 5, max: 30, step: 0.5, default: 12 },
        { id: "years", label: "Time Period", type: "years", min: 1, max: 40, step: 1, default: 10 },
      ]
    },
    scenarioB: {
      name: "Fixed Deposit (RD)",
      inputs: [
        { id: "monthly", label: "Monthly Investment", type: "currency", min: 500, max: 1000000, step: 500, default: 10000 },
        { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 3, max: 15, step: 0.5, default: 7 },
        { id: "taxRate", label: "Your Tax Bracket", type: "percentage", min: 0, max: 30, step: 5, default: 30 },
      ]
    },
    calculate: (inputsA, inputsB) => {
      // Scenario A: Equity SIP Compounding
      const monthlyA = inputsA.monthly;
      const rateA = inputsA.rate / 12 / 100;
      const monthsA = inputsA.years * 12;
      let balanceA = 0;
      for (let i = 0; i < monthsA; i++) {
        balanceA = (balanceA + monthlyA) * (1 + rateA);
      }
      // Simplified LTCG tax on Equity (12.5% on gains over 1.25L)
      const gainsA = balanceA - (monthlyA * monthsA);
      const taxA = gainsA > 125000 ? (gainsA - 125000) * 0.125 : 0;
      const netA = balanceA - taxA;

      // Scenario B: RD Compounding (Interest taxed annually, simplified to post-tax return)
      const monthlyB = inputsB.monthly;
      const postTaxRateB = inputsB.rate * (1 - inputsB.taxRate / 100) / 12 / 100;
      const monthsB = inputsA.years * 12; // Force same duration
      let balanceB = 0;
      for (let i = 0; i < monthsB; i++) {
        balanceB = (balanceB + monthlyB) * (1 + postTaxRateB);
      }

      const diff = netA - balanceB;
      const winner = diff > 0 ? "A" : diff < 0 ? "B" : "Tie";
      const summary = winner === "A" 
        ? `Equity SIP creates significantly more wealth over ${inputsA.years} years, generating ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')} more than a traditional FD after accounting for taxes.`
        : `Fixed Deposit yields higher net returns in this scenario, generating ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')} more than the Equity SIP.`;

      return {
        metricsA: [
          { label: "Net Maturity Value", value: netA, type: "currency" },
          { label: "Total Invested", value: monthlyA * monthsA, type: "currency" },
          { label: "Estimated Taxes", value: taxA, type: "currency" },
        ],
        metricsB: [
          { label: "Net Maturity Value", value: balanceB, type: "currency" },
          { label: "Total Invested", value: monthlyB * monthsB, type: "currency" },
          { label: "Tax Rate Applied", value: inputsB.taxRate, type: "percentage" },
        ],
        verdict: { winner, summary, difference: Math.abs(diff) }
      };
    }
  },
  "rent-vs-buy": {
    slug: "rent-vs-buy",
    title: "Rent vs Buy",
    description: "Compare the financial impact of buying a house with a home loan vs renting and investing the difference.",
    scenarioA: {
      name: "Buy a House",
      inputs: [
        { id: "propertyValue", label: "Property Value", type: "currency", min: 1000000, max: 100000000, step: 100000, default: 10000000, currencyOverrides: { USD: { default: 400000, min: 50000, max: 5000000, step: 10000 }, GBP: { default: 350000, min: 50000, max: 5000000, step: 10000 } } },
        { id: "downPayment", label: "Down Payment", type: "currency", min: 0, max: 50000000, step: 100000, default: 2000000, currencyOverrides: { USD: { default: 80000, min: 0, max: 1000000, step: 5000 }, GBP: { default: 70000, min: 0, max: 1000000, step: 5000 } } },
        { id: "loanRate", label: "Home Loan Rate", type: "percentage", min: 5, max: 15, step: 0.1, default: 8.5, currencyOverrides: { USD: { default: 6.5, min: 2, max: 12 }, GBP: { default: 5.5, min: 2, max: 12 } } },
        { id: "years", label: "Loan Tenure", type: "years", min: 5, max: 30, step: 1, default: 20 },
        { id: "appreciation", label: "Property Appreciation (p.a)", type: "percentage", min: 1, max: 15, step: 0.5, default: 5, currencyOverrides: { USD: { default: 3.5 }, GBP: { default: 3.0 } } },
      ]
    },
    scenarioB: {
      name: "Rent & Invest",
      inputs: [
        { id: "monthlyRent", label: "Monthly Rent", type: "currency", min: 5000, max: 500000, step: 1000, default: 30000, currencyOverrides: { USD: { default: 2000, min: 500, max: 20000, step: 100 }, GBP: { default: 1500, min: 500, max: 20000, step: 100 } } },
        { id: "rentIncrease", label: "Annual Rent Increase", type: "percentage", min: 1, max: 15, step: 0.5, default: 5, currencyOverrides: { USD: { default: 3 }, GBP: { default: 3 } } },
        { id: "investmentReturn", label: "Investment Return (p.a)", type: "percentage", min: 5, max: 20, step: 0.5, default: 12, currencyOverrides: { USD: { default: 8 }, GBP: { default: 7 } } },
      ]
    },
    calculate: (inputsA, inputsB) => {
      // Scenario A: Buy
      const loanAmount = inputsA.propertyValue - inputsA.downPayment;
      const monthlyRate = inputsA.loanRate / 12 / 100;
      const months = inputsA.years * 12;
      const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      
      const futurePropertyValue = inputsA.propertyValue * Math.pow(1 + inputsA.appreciation / 100, inputsA.years);
      // Net worth = Property Value (No loan left)
      const netWorthBuy = futurePropertyValue;

      // Scenario B: Rent & Invest
      // Invest the down payment immediately
      let portfolio = inputsA.downPayment;
      let debt = 0;
      let currentRent = inputsB.monthlyRent;
      let totalRentPaid = 0;
      const monthlyInvestReturn = inputsB.investmentReturn / 12 / 100;
      const monthlyBorrowRate = inputsA.loanRate / 12 / 100;
      
      for (let y = 0; y < inputsA.years; y++) {
        for (let m = 0; m < 12; m++) {
          // Compound existing balances first
          portfolio = portfolio * (1 + monthlyInvestReturn);
          debt = debt * (1 + monthlyBorrowRate);
          
          const surplus = emi - currentRent;
          
          if (surplus >= 0) {
            if (debt > 0) {
              if (surplus >= debt) {
                const remaining = surplus - debt;
                debt = 0;
                portfolio += remaining;
              } else {
                debt -= surplus;
              }
            } else {
              portfolio += surplus;
            }
          } else {
            const withdraw = Math.abs(surplus);
            if (portfolio >= withdraw) {
              portfolio -= withdraw;
            } else {
              const remainingWithdraw = withdraw - portfolio;
              portfolio = 0;
              debt += remainingWithdraw;
            }
          }
          
          totalRentPaid += currentRent;
        }
        currentRent *= (1 + inputsB.rentIncrease / 100);
      }
      
      const netWorthRent = portfolio - debt;
      const diff = netWorthBuy - netWorthRent;
      const winner = diff > 0 ? "A" : diff < 0 ? "B" : "Tie";
      const summary = winner === "A"
        ? `Buying is the clear winner! Over ${inputsA.years} years, property appreciation outpaces renting and investing, resulting in a ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')} higher net worth.`
        : `Renting and Investing is mathematically superior here. Over ${inputsA.years} years, your investment portfolio outperforms property appreciation by ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')}.`;

      return {
        metricsA: [
          { label: "Net Worth (House Value)", value: netWorthBuy, type: "currency" },
          { label: "Monthly EMI", value: emi, type: "currency" },
          { label: "Total Interest Paid", value: (emi * months) - loanAmount, type: "currency" },
        ],
        metricsB: [
          { label: "Net Worth (Portfolio)", value: netWorthRent, type: "currency" },
          { label: "Starting Rent", value: inputsB.monthlyRent, type: "currency" },
          { label: "Rent Paid Over Tenure", value: totalRentPaid, type: "currency" },
        ],
        verdict: { winner, summary, difference: Math.abs(diff) }
      };
    }
  },
  "old-vs-new-tax": {
    slug: "old-vs-new-tax",
    title: "Old vs New Tax Regime",
    description: "Compare your income tax liability under the Old Regime (with deductions) vs the New Regime (lower rates, no deductions).",
    scenarioA: {
      name: "Old Tax Regime",
      inputs: [
        { id: "salary", label: "Annual Salary", type: "currency", min: 300000, max: 50000000, step: 50000, default: 1500000 },
        { id: "sec80c", label: "80C Deductions (PPF, ELSS)", type: "currency", min: 0, max: 150000, step: 10000, default: 150000 },
        { id: "nps", label: "80CCD(1B) NPS", type: "currency", min: 0, max: 50000, step: 10000, default: 50000 },
        { id: "hra", label: "HRA Exemption", type: "currency", min: 0, max: 1000000, step: 10000, default: 200000 },
        { id: "health", label: "80D Health Insurance", type: "currency", min: 0, max: 100000, step: 5000, default: 25000 },
      ]
    },
    scenarioB: {
      name: "New Tax Regime",
      inputs: [
        // New regime ignores all deductions except standard deduction, so we just mirror salary
      ]
    },
    calculate: (inputsA) => {
      const salary = inputsA.salary;
      const stdDed = 50000;
      
      // Old Regime
      const oldDeductions = stdDed + inputsA.sec80c + inputsA.nps + inputsA.hra + inputsA.health;
      const taxableOld = Math.max(0, salary - oldDeductions);
      let taxOld = 0;
      if (taxableOld > 1000000) taxOld = 112500 + (taxableOld - 1000000) * 0.3;
      else if (taxableOld > 500000) taxOld = 12500 + (taxableOld - 500000) * 0.2;
      else if (taxableOld > 250000) taxOld = (taxableOld - 250000) * 0.05;
      if (taxableOld <= 500000) taxOld = 0; // Rebate 87A

      // New Regime (FY 2024-25 logic)
      const taxableNew = Math.max(0, salary - 75000); // 75k Std Ded in Budget 2024
      let taxNew = 0;
      if (taxableNew > 1500000) taxNew = 150000 + (taxableNew - 1500000) * 0.3;
      else if (taxableNew > 1200000) taxNew = 90000 + (taxableNew - 1200000) * 0.2;
      else if (taxableNew > 1000000) taxNew = 60000 + (taxableNew - 1000000) * 0.15;
      else if (taxableNew > 700000) taxNew = 30000 + (taxableNew - 700000) * 0.1;
      else if (taxableNew > 300000) taxNew = (taxableNew - 300000) * 0.05;
      if (taxableNew <= 700000) taxNew = 0; // Rebate 87A

      const diff = taxOld - taxNew;
      const winner = diff > 0 ? "B" : diff < 0 ? "A" : "Tie";
      const summary = winner === "B"
        ? `The New Regime is better for you! You will save ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')} in taxes because your deductions are not high enough to offset the lower slab rates.`
        : `Stick to the Old Regime! Your deductions (80C, HRA, etc.) successfully shield your income, saving you ₹${Math.abs(Math.round(diff)).toLocaleString('en-IN')} in taxes.`;

      return {
        metricsA: [
          { label: "Total Tax Liability", value: taxOld, type: "currency" },
          { label: "Net Take Home", value: salary - taxOld, type: "currency" },
          { label: "Total Deductions", value: oldDeductions, type: "currency" },
        ],
        metricsB: [
          { label: "Total Tax Liability", value: taxNew, type: "currency" },
          { label: "Net Take Home", value: salary - taxNew, type: "currency" },
          { label: "Standard Deduction", value: 75000, type: "currency" },
        ],
        verdict: { winner, summary, difference: Math.abs(diff) }
      };
    }
  }
};

export const getComparisonConfig = (slug: string): ComparisonConfig | undefined => {
  return comparisonRegistry[slug];
};
