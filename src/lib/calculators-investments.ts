import { CalculatorConfig } from "./calculator-engine";

export const investmentCalculators: Record<string, CalculatorConfig> = {
  "mutual-fund-returns": {
    slug: "mutual-fund-returns", name: "Mutual Fund Returns", description: "Calculate absolute and annualized returns on mutual funds.",
    inputs: [
      { id: "investment", label: "Total Investment", type: "currency", min: 500, max: 10000000, step: 500, default: 100000 },
      { id: "currentValue", label: "Current Value", type: "currency", min: 500, max: 20000000, step: 500, default: 150000 },
      { id: "years", label: "Holding Period", type: "years", min: 1, max: 40, step: 1, default: 3 }
    ],
    calculate: (inputs) => {
      const profit = inputs.currentValue - inputs.investment;
      return {
        primaryLabel: "CAGR (%)", primaryValue: (Math.pow((inputs.currentValue / inputs.investment), (1 / inputs.years)) - 1) * 100, primaryType: "percentage",
        secondaryLabel: "Wealth Gained", secondaryValue: profit, secondaryType: "currency",
        tertiaryLabel: "Absolute Return (%)", tertiaryValue: (profit / inputs.investment) * 100, tertiaryType: "percentage"
      };
    }
  },
  "stock-profit": {
    slug: "stock-profit", name: "Stock Profit", description: "Calculate your net profit or loss from stock trading.",
    inputs: [
      { id: "buyPrice", label: "Buy Price", type: "currency", min: 1, max: 100000, step: 1, default: 1000 },
      { id: "sellPrice", label: "Sell Price", type: "currency", min: 1, max: 100000, step: 1, default: 1200 },
      { id: "quantity", label: "Quantity", type: "number", min: 1, max: 10000, step: 1, default: 100 }
    ],
    calculate: (inputs) => {
      const investment = inputs.buyPrice * inputs.quantity;
      const value = inputs.sellPrice * inputs.quantity;
      return {
        primaryLabel: "Total Profit / Loss", primaryValue: value - investment, primaryType: "currency",
        secondaryLabel: "Total Investment", secondaryValue: investment, secondaryType: "currency",
        tertiaryLabel: "Return (%)", tertiaryValue: ((value - investment) / investment) * 100, tertiaryType: "percentage"
      };
    }
  },
  "dividend-yield": {
    slug: "dividend-yield", name: "Dividend Yield", description: "Calculate the dividend yield of a stock.",
    inputs: [
      { id: "dividend", label: "Annual Dividend per Share", type: "currency", min: 1, max: 1000, step: 1, default: 20 },
      { id: "price", label: "Current Stock Price", type: "currency", min: 10, max: 10000, step: 10, default: 500 }
    ],
    calculate: (inputs) => {
      return {
        primaryLabel: "Dividend Yield (%)", primaryValue: (inputs.dividend / inputs.price) * 100, primaryType: "percentage",
        secondaryLabel: "Annual Income (100 shares)", secondaryValue: inputs.dividend * 100, secondaryType: "currency",
        tertiaryLabel: "Cost for 100 shares", tertiaryValue: inputs.price * 100, tertiaryType: "currency"
      };
    }
  },
  "rd-calculator": {
    slug: "rd-calculator", name: "RD Calculator", description: "Calculate returns on Recurring Deposits.",
    inputs: [
      { id: "monthly", label: "Monthly Deposit", type: "currency", min: 500, max: 100000, step: 500, default: 5000 },
      { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 4, max: 12, step: 0.1, default: 6.5 },
      { id: "years", label: "Time Period", type: "years", min: 1, max: 10, step: 1, default: 5 }
    ],
    calculate: (inputs) => {
      const n = 4; // Quarterly compounding
      const r = inputs.rate / 100;
      const months = inputs.years * 12;
      let maturity = 0;
      for (let i = 0; i < months; i++) {
        maturity += inputs.monthly * Math.pow(1 + r/n, n * ((months - i) / 12));
      }
      const invested = inputs.monthly * months;
      return {
        primaryLabel: "Maturity Amount", primaryValue: maturity, primaryType: "currency",
        secondaryLabel: "Total Investment", secondaryValue: invested, secondaryType: "currency",
        tertiaryLabel: "Interest Earned", tertiaryValue: maturity - invested, tertiaryType: "currency"
      };
    }
  },
  "epf-calculator": {
    slug: "epf-calculator", name: "EPF Calculator", description: "Calculate Employees' Provident Fund maturity amount.",
    inputs: [
      { id: "basic", label: "Basic Salary + DA", type: "currency", min: 5000, max: 500000, step: 1000, default: 50000 },
      { id: "employee", label: "Employee Contribution (%)", type: "percentage", min: 12, max: 100, step: 1, default: 12 },
      { id: "employer", label: "Employer Contribution (%)", type: "percentage", min: 3.67, max: 12, step: 0.01, default: 3.67 },
      { id: "years", label: "Years to Retirement", type: "years", min: 1, max: 40, step: 1, default: 20 }
    ],
    calculate: (inputs) => {
      const monthlyContribution = inputs.basic * ((inputs.employee + inputs.employer) / 100);
      const rate = 8.15 / 100; // EPF interest rate roughly
      let balance = 0;
      let totalInvested = 0;
      for(let y=0; y<inputs.years; y++) {
        balance += monthlyContribution * 12;
        balance *= (1 + rate);
        totalInvested += monthlyContribution * 12;
      }
      return {
        primaryLabel: "Total EPF Balance", primaryValue: balance, primaryType: "currency",
        secondaryLabel: "Total Contributions", secondaryValue: totalInvested, secondaryType: "currency",
        tertiaryLabel: "Interest Earned", tertiaryValue: balance - totalInvested, tertiaryType: "currency"
      };
    }
  },
  "pomis-calculator": {
    slug: "pomis-calculator", name: "POMIS Calculator", description: "Calculate monthly income from Post Office Monthly Income Scheme.",
    inputs: [
      { id: "principal", label: "Investment Amount", type: "currency", min: 1000, max: 900000, step: 1000, default: 900000 },
      { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 5, max: 10, step: 0.1, default: 7.4 }
    ],
    calculate: (inputs) => {
      const monthly = (inputs.principal * (inputs.rate / 100)) / 12;
      return {
        primaryLabel: "Monthly Income", primaryValue: monthly, primaryType: "currency",
        secondaryLabel: "Total Investment", secondaryValue: inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Total Interest (5 Yrs)", tertiaryValue: monthly * 60, tertiaryType: "currency"
      };
    }
  },
  "scss-calculator": {
    slug: "scss-calculator", name: "SCSS Calculator", description: "Calculate returns from Senior Citizen Savings Scheme.",
    inputs: [
      { id: "principal", label: "Investment Amount", type: "currency", min: 1000, max: 3000000, step: 1000, default: 1500000 },
      { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 7, max: 10, step: 0.1, default: 8.2 }
    ],
    calculate: (inputs) => {
      const quarterly = (inputs.principal * (inputs.rate / 100)) / 4;
      return {
        primaryLabel: "Quarterly Interest", primaryValue: quarterly, primaryType: "currency",
        secondaryLabel: "Total Investment", secondaryValue: inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Total Interest (5 Yrs)", tertiaryValue: quarterly * 20, tertiaryType: "currency"
      };
    }
  },
  "ssy-calculator": {
    slug: "ssy-calculator", name: "SSY Calculator", description: "Calculate Sukanya Samriddhi Yojana maturity.",
    inputs: [
      { id: "yearly", label: "Yearly Investment", type: "currency", min: 250, max: 150000, step: 250, default: 100000 },
      { id: "age", label: "Girl's Current Age", type: "years", min: 0, max: 10, step: 1, default: 1 }
    ],
    calculate: (inputs) => {
      const rate = 8.0 / 100;
      let balance = 0;
      let invested = 0;
      for(let y=1; y<=21; y++) {
        if(y <= 15) { balance += inputs.yearly; invested += inputs.yearly; }
        balance *= (1 + rate);
      }
      return {
        primaryLabel: `Maturity Amount (at age ${inputs.age + 21})`, primaryValue: balance, primaryType: "currency",
        secondaryLabel: "Total Invested", secondaryValue: invested, secondaryType: "currency",
        tertiaryLabel: "Interest Earned", tertiaryValue: balance - invested, tertiaryType: "currency"
      };
    }
  },
  "nsc-calculator": {
    slug: "nsc-calculator", name: "NSC Calculator", description: "Calculate National Savings Certificate returns.",
    inputs: [
      { id: "principal", label: "Investment Amount", type: "currency", min: 1000, max: 10000000, step: 1000, default: 100000 },
      { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 6, max: 9, step: 0.1, default: 7.7 }
    ],
    calculate: (inputs) => {
      const maturity = inputs.principal * Math.pow(1 + (inputs.rate / 100), 5); // 5 year lock-in
      return {
        primaryLabel: "Maturity Amount", primaryValue: maturity, primaryType: "currency",
        secondaryLabel: "Total Investment", secondaryValue: inputs.principal, secondaryType: "currency",
        tertiaryLabel: "Interest Earned", tertiaryValue: maturity - inputs.principal, tertiaryType: "currency"
      };
    }
  },
  "crypto-profit": {
    slug: "crypto-profit", name: "Crypto Profit", description: "Calculate cryptocurrency trading profits.",
    inputs: [
      { id: "buy", label: "Buy Price", type: "currency", min: 1, max: 100000, step: 1, default: 30000 },
      { id: "sell", label: "Sell Price", type: "currency", min: 1, max: 100000, step: 1, default: 45000 },
      { id: "coins", label: "Number of Coins", type: "number", min: 0.01, max: 1000, step: 0.01, default: 2 }
    ],
    calculate: (inputs) => {
      const profit = (inputs.sell - inputs.buy) * inputs.coins;
      const investment = inputs.buy * inputs.coins;
      return {
        primaryLabel: "Total Profit", primaryValue: profit, primaryType: "currency",
        secondaryLabel: "Return (%)", secondaryValue: (profit / investment) * 100, secondaryType: "percentage",
        tertiaryLabel: "Total Value", tertiaryValue: investment + profit, tertiaryType: "currency"
      };
    }
  },
  "forex-pip": {
    slug: "forex-pip", name: "Forex Pip Value", description: "Calculate the value of a pip in Forex trading.",
    inputs: [
      { id: "lots", label: "Trade Size (Standard Lots)", type: "number", min: 0.01, max: 100, step: 0.01, default: 1 },
      { id: "pip", label: "Pip Movement", type: "number", min: 1, max: 1000, step: 1, default: 50 }
    ],
    calculate: (inputs) => {
      const pipValue = inputs.lots * 10; // Assuming USD quote currency where 1 standard lot (100k) has $10 pip value
      return {
        primaryLabel: "Total Profit/Loss", primaryValue: pipValue * inputs.pip, primaryType: "currency",
        secondaryLabel: "Value per Pip", secondaryValue: pipValue, secondaryType: "currency",
        tertiaryLabel: "Trade Size (Units)", tertiaryValue: inputs.lots * 100000, tertiaryType: "number"
      };
    }
  }
};
