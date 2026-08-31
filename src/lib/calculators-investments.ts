import { CalculatorConfig } from "./calculator-engine";

export const investmentCalculators: Record<string, CalculatorConfig> = {
  "sip-calculator": {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description: "Calculate the future value of your Systematic Investment Plan (SIP).",
    inputs: [
      { id: "monthly", label: "Monthly Investment", type: "currency", min: 500, max: 10000000, step: 500, default: 25000 },
      { id: "rate", label: "Expected Return Rate (p.a)", type: "percentage", min: 1, max: 30, step: 0.5, default: 12 },
      { id: "years", label: "Time Period", type: "years", min: 1, max: 40, step: 1, default: 10 }
    ],
    calculate: (inputs) => {
      const p = inputs.monthly || 25000;
      const i = (inputs.rate || 12) / 12 / 100;
      const n = (inputs.years || 10) * 12;
      const amount = i > 0 ? p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : p * n;
      const invested = p * n;

      return {
        primaryLabel: "Total Expected Amount",
        primaryValue: Math.round(amount),
        primaryType: "currency",
        secondaryLabel: "Amount Invested",
        secondaryValue: Math.round(invested),
        secondaryType: "currency",
        tertiaryLabel: "Wealth Gained",
        tertiaryValue: Math.round(amount - invested),
        tertiaryType: "currency"
      };
    }
  },
  "lumpsum-calculator": {
    slug: "lumpsum-calculator",
    name: "Lump Sum Calculator",
    description: "Calculate the future value of a one-time lump sum mutual fund or stock investment.",
    inputs: [
      { id: "investment", label: "Total Investment", type: "currency", min: 1000, max: 10000000, step: 1000, default: 100000 },
      { id: "rate", label: "Expected Return Rate (p.a)", type: "percentage", min: 1, max: 30, step: 0.5, default: 12 },
      { id: "years", label: "Time Period (Years)", type: "years", min: 1, max: 40, step: 1, default: 10 }
    ],
    calculate: (inputs) => {
      const p = inputs.investment || 100000;
      const r = (inputs.rate || 12) / 100;
      const t = inputs.years || 10;
      const maturity = p * Math.pow(1 + r, t);
      return {
        primaryLabel: "Total Maturity Value",
        primaryValue: Math.round(maturity),
        primaryType: "currency",
        secondaryLabel: "Amount Invested",
        secondaryValue: Math.round(p),
        secondaryType: "currency",
        tertiaryLabel: "Wealth Gained",
        tertiaryValue: Math.round(maturity - p),
        tertiaryType: "currency"
      };
    }
  },
  "cagr-calculator": {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    description: "Calculate Compound Annual Growth Rate (CAGR) for your investments.",
    inputs: [
      { id: "initial", label: "Initial Investment Value", type: "currency", min: 1000, max: 10000000, step: 1000, default: 100000 },
      { id: "final", label: "Final Investment Value", type: "currency", min: 1000, max: 50000000, step: 1000, default: 250000 },
      { id: "years", label: "Holding Period (Years)", type: "years", min: 1, max: 40, step: 1, default: 5 }
    ],
    calculate: (inputs) => {
      const initial = inputs.initial || 100000;
      const final = inputs.final || 250000;
      const years = inputs.years || 5;
      const cagr = initial > 0 && years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0;
      const absReturn = initial > 0 ? ((final - initial) / initial) * 100 : 0;
      return {
        primaryLabel: "Compound Annual Growth (CAGR)",
        primaryValue: Number(cagr.toFixed(2)),
        primaryType: "percentage",
        secondaryLabel: "Total Profit / Gain",
        secondaryValue: Math.round(final - initial),
        secondaryType: "currency",
        tertiaryLabel: "Absolute Return",
        tertiaryValue: Number(absReturn.toFixed(2)),
        tertiaryType: "percentage"
      };
    }
  },
  "fd-calculator": {
    slug: "fd-calculator",
    name: "FD Calculator",
    description: "Calculate fixed deposit interest and maturity value with compounding.",
    inputs: [
      { id: "deposit", label: "Total Deposit Amount", type: "currency", min: 1000, max: 10000000, step: 1000, default: 100000 },
      { id: "rate", label: "Interest Rate (p.a)", type: "percentage", min: 1, max: 15, step: 0.1, default: 7 },
      { id: "years", label: "Time Period (Years)", type: "years", min: 1, max: 20, step: 1, default: 5 }
    ],
    calculate: (inputs) => {
      const p = inputs.deposit || 100000;
      const r = (inputs.rate || 7) / 100;
      const t = inputs.years || 5;
      // Quarterly compounding (n=4) standard for Fixed Deposits
      const maturity = p * Math.pow(1 + r / 4, 4 * t);
      return {
        primaryLabel: "Maturity Amount",
        primaryValue: Math.round(maturity),
        primaryType: "currency",
        secondaryLabel: "Deposit Amount",
        secondaryValue: Math.round(p),
        secondaryType: "currency",
        tertiaryLabel: "Total Interest Earned",
        tertiaryValue: Math.round(maturity - p),
        tertiaryType: "currency"
      };
    }
  },
  "retirement-calculator": {
    slug: "retirement-calculator",
    name: "Retirement Calculator",
    description: "Calculate how much money you need to retire comfortably.",
    inputs: [
      { id: "currentAge", label: "Current Age", type: "years", min: 18, max: 70, step: 1, default: 30 },
      { id: "retirementAge", label: "Target Retirement Age", type: "years", min: 30, max: 80, step: 1, default: 60 },
      { id: "monthlyExpense", label: "Current Monthly Expenses", type: "currency", min: 5000, max: 1000000, step: 5000, default: 50000 },
      { id: "inflation", label: "Expected Inflation (%)", type: "percentage", min: 1, max: 15, step: 0.5, default: 6 },
      { id: "postReturn", label: "Post-Retirement Return (%)", type: "percentage", min: 1, max: 15, step: 0.5, default: 8 }
    ],
    calculate: (inputs) => {
      const currentAge = inputs.currentAge || 30;
      const retirementAge = inputs.retirementAge || 60;
      const monthlyExp = inputs.monthlyExpense || 50000;
      const inflation = (inputs.inflation || 6) / 100;
      const postReturn = (inputs.postReturn || 8) / 100;
      const yearsToRetire = Math.max(1, retirementAge - currentAge);
      const lifeExpectancy = 85;
      const retirementDuration = Math.max(5, lifeExpectancy - retirementAge);

      const futureAnnualExpense = monthlyExp * 12 * Math.pow(1 + inflation, yearsToRetire);
      const realRate = (1 + postReturn) / (1 + inflation) - 1;
      const corpus = realRate > 0
        ? futureAnnualExpense * ((1 - Math.pow(1 + realRate, -retirementDuration)) / realRate)
        : futureAnnualExpense * retirementDuration;

      return {
        primaryLabel: "Target Retirement Corpus",
        primaryValue: Math.round(corpus),
        primaryType: "currency",
        secondaryLabel: "Future Monthly Expense",
        secondaryValue: Math.round(futureAnnualExpense / 12),
        secondaryType: "currency",
        tertiaryLabel: "Years in Retirement",
        tertiaryValue: retirementDuration,
        tertiaryType: "number"
      };
    }
  },
  "401k-calculator": {
    slug: "401k-calculator",
    name: "401(k) Calculator",
    description: "Calculate your 401(k) retirement balance with employer match and compound growth.",
    inputs: [
      { id: "currentBalance", label: "Current 401(k) Balance", type: "currency", min: 0, max: 2000000, step: 1000, default: 50000 },
      { id: "salary", label: "Annual Salary", type: "currency", min: 10000, max: 1000000, step: 1000, default: 75000 },
      { id: "contribution", label: "Your Contribution (%)", type: "percentage", min: 0, max: 50, step: 1, default: 10 },
      { id: "employerMatch", label: "Employer Match (%)", type: "percentage", min: 0, max: 100, step: 5, default: 50 },
      { id: "matchLimit", label: "Match Limit (% of Salary)", type: "percentage", min: 0, max: 15, step: 1, default: 6 },
      { id: "returnRate", label: "Expected Annual Return (%)", type: "percentage", min: 1, max: 15, step: 0.5, default: 7 },
      { id: "years", label: "Years to Retirement", type: "years", min: 1, max: 50, step: 1, default: 35 }
    ],
    calculate: (inputs) => {
      const currentBalance = inputs.currentBalance || 50000;
      const salary = inputs.salary || 75000;
      const contribution = inputs.contribution || 10;
      const employerMatch = inputs.employerMatch || 50;
      const matchLimit = inputs.matchLimit || 6;
      const returnRate = inputs.returnRate || 7;
      const years = inputs.years || 35;

      const rate = returnRate / 100;
      let balance = currentBalance;
      let totalEmployee = 0;
      let totalEmployer = 0;
      
      const effectiveMatch = Math.min(contribution, matchLimit) * (employerMatch / 100);
      const annualEmployee = salary * (contribution / 100);
      const annualEmployer = salary * (effectiveMatch / 100);

      for (let y = 0; y < years; y++) {
        balance = (balance + annualEmployee + annualEmployer) * (1 + rate);
        totalEmployee += annualEmployee;
        totalEmployer += annualEmployer;
      }

      return {
        primaryLabel: "Projected 401(k) Balance",
        primaryValue: Math.round(balance),
        primaryType: "currency",
        secondaryLabel: "Your Total Contributions",
        secondaryValue: Math.round(totalEmployee),
        secondaryType: "currency",
        tertiaryLabel: "Employer Match Total",
        tertiaryValue: Math.round(totalEmployer),
        tertiaryType: "currency"
      };
    }
  },
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
