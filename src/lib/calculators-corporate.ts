import { CalculatorConfig } from "./calculator-engine";

export const corporateCalculators: Record<string, CalculatorConfig> = {
  "markup-calculator": {
    slug: "markup-calculator", name: "Markup Calculator", description: "Calculate markup percentage from cost and profit.",
    inputs: [
      { id: "cost", label: "Cost Price", type: "currency", min: 1, max: 100000, step: 1, default: 100 },
      { id: "sell", label: "Selling Price", type: "currency", min: 1, max: 100000, step: 1, default: 150 }
    ],
    calculate: (inputs) => {
      const profit = inputs.sell - inputs.cost;
      const markup = inputs.cost > 0 ? (profit / inputs.cost) * 100 : 0;
      const margin = inputs.sell > 0 ? (profit / inputs.sell) * 100 : 0;
      return {
        primaryLabel: "Markup (%)", primaryValue: markup, primaryType: "percentage",
        secondaryLabel: "Gross Profit", secondaryValue: profit, secondaryType: "currency",
        tertiaryLabel: "Profit Margin (%)", tertiaryValue: margin, tertiaryType: "percentage"
      };
    }
  },
  "break-even-calculator": {
    slug: "break-even-calculator", name: "Break-Even Calculator", description: "Find out the units needed to break even.",
    inputs: [
      { id: "fixed", label: "Fixed Costs", type: "currency", min: 100, max: 10000000, step: 100, default: 50000 },
      { id: "variable", label: "Variable Cost per Unit", type: "currency", min: 1, max: 10000, step: 1, default: 20 },
      { id: "price", label: "Selling Price per Unit", type: "currency", min: 1, max: 10000, step: 1, default: 50 }
    ],
    calculate: (inputs) => {
      const marginPerUnit = inputs.price - inputs.variable;
      const breakEvenUnits = marginPerUnit > 0 ? inputs.fixed / marginPerUnit : 0;
      return {
        primaryLabel: "Break-Even Units", primaryValue: breakEvenUnits, primaryType: "number",
        secondaryLabel: "Break-Even Revenue", secondaryValue: breakEvenUnits * inputs.price, secondaryType: "currency",
        tertiaryLabel: "Contribution Margin", tertiaryValue: marginPerUnit, tertiaryType: "currency"
      };
    }
  },
  "roi-calculator": {
    slug: "roi-calculator", name: "ROI Calculator", description: "Calculate Return on Investment.",
    inputs: [
      { id: "investment", label: "Amount Invested", type: "currency", min: 100, max: 10000000, step: 100, default: 10000 },
      { id: "return", label: "Amount Returned", type: "currency", min: 100, max: 20000000, step: 100, default: 12500 }
    ],
    calculate: (inputs) => {
      const profit = inputs.return - inputs.investment;
      const roi = (profit / inputs.investment) * 100;
      return {
        primaryLabel: "ROI (%)", primaryValue: roi, primaryType: "percentage",
        secondaryLabel: "Net Profit", secondaryValue: profit, secondaryType: "currency",
        tertiaryLabel: "Total Return", tertiaryValue: inputs.return, tertiaryType: "currency"
      };
    }
  },
  "discount-calculator": {
    slug: "discount-calculator", name: "Discount Calculator", description: "Calculate final price after a percentage discount.",
    inputs: [
      { id: "price", label: "Original Price", type: "currency", min: 1, max: 100000, step: 1, default: 1000 },
      { id: "discount", label: "Discount (%)", type: "percentage", min: 0, max: 100, step: 1, default: 20 }
    ],
    calculate: (inputs) => {
      const amountSaved = inputs.price * (inputs.discount / 100);
      return {
        primaryLabel: "Final Price", primaryValue: inputs.price - amountSaved, primaryType: "currency",
        secondaryLabel: "Amount Saved", secondaryValue: amountSaved, secondaryType: "currency",
        tertiaryLabel: "Original Price", tertiaryValue: inputs.price, tertiaryType: "currency"
      };
    }
  },
  "ebitda-calculator": {
    slug: "ebitda-calculator", name: "EBITDA Calculator", description: "Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization.",
    inputs: [
      { id: "net", label: "Net Income", type: "currency", min: 0, max: 100000000, step: 1000, default: 500000 },
      { id: "taxes", label: "Taxes", type: "currency", min: 0, max: 10000000, step: 100, default: 50000 },
      { id: "interest", label: "Interest Expense", type: "currency", min: 0, max: 10000000, step: 100, default: 20000 },
      { id: "da", label: "Depreciation & Amort.", type: "currency", min: 0, max: 10000000, step: 100, default: 30000 }
    ],
    calculate: (inputs) => {
      const ebitda = inputs.net + inputs.taxes + inputs.interest + inputs.da;
      return {
        primaryLabel: "EBITDA", primaryValue: ebitda, primaryType: "currency",
        secondaryLabel: "EBIT (Operating Profit)", secondaryValue: inputs.net + inputs.taxes + inputs.interest, secondaryType: "currency",
        tertiaryLabel: "Net Margin", tertiaryValue: inputs.net, tertiaryType: "currency"
      };
    }
  },
  "rental-yield": {
    slug: "rental-yield", name: "Rental Yield Calculator", description: "Calculate gross rental yield on a property.",
    inputs: [
      { id: "price", label: "Property Value", type: "currency", min: 500000, max: 100000000, step: 100000, default: 5000000 },
      { id: "rent", label: "Monthly Rent", type: "currency", min: 1000, max: 1000000, step: 1000, default: 20000 }
    ],
    calculate: (inputs) => {
      const annualRent = inputs.rent * 12;
      const yieldPct = (annualRent / inputs.price) * 100;
      return {
        primaryLabel: "Gross Rental Yield (%)", primaryValue: yieldPct, primaryType: "percentage",
        secondaryLabel: "Annual Rent", secondaryValue: annualRent, secondaryType: "currency",
        tertiaryLabel: "Property Value", tertiaryValue: inputs.price, tertiaryType: "currency"
      };
    }
  }
};
