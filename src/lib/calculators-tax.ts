import { CalculatorConfig } from "./calculator-engine";

export const taxCalculators: Record<string, CalculatorConfig> = {
  "gst-calculator": {
    slug: "gst-calculator",
    name: "GST Calculator",
    description: "Calculate Goods and Services Tax (GST) inclusive and exclusive amounts.",
    inputs: [
      { id: "amount", label: "Amount / Price", type: "currency", min: 100, max: 10000000, step: 100, default: 10000 },
      { id: "gstRate", label: "GST Rate (%)", type: "percentage", min: 0, max: 40, step: 0.5, default: 18 }
    ],
    calculate: (inputs) => {
      const amount = inputs.amount || 10000;
      const rate = (inputs.gstRate || 18) / 100;
      const gstAmount = amount * rate;
      const totalAmount = amount + gstAmount;
      return {
        primaryLabel: "Total Amount (with GST)",
        primaryValue: Math.round(totalAmount),
        primaryType: "currency",
        secondaryLabel: "Net Amount (without GST)",
        secondaryValue: Math.round(amount),
        secondaryType: "currency",
        tertiaryLabel: "GST Tax Amount",
        tertiaryValue: Math.round(gstAmount),
        tertiaryType: "currency"
      };
    }
  },
  "sales-tax-calculator": {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    description: "Calculate sales tax and total purchase price.",
    inputs: [
      { id: "price", label: "Pre-Tax Price", type: "currency", min: 1, max: 1000000, step: 1, default: 100 },
      { id: "rate", label: "Sales Tax Rate (%)", type: "percentage", min: 0, max: 30, step: 0.25, default: 8.25 }
    ],
    calculate: (inputs) => {
      const p = inputs.price || 100;
      const r = (inputs.rate || 8.25) / 100;
      const tax = p * r;
      const total = p + tax;
      return {
        primaryLabel: "Total Purchase Price",
        primaryValue: Number(total.toFixed(2)),
        primaryType: "currency",
        secondaryLabel: "Pre-Tax Price",
        secondaryValue: Number(p.toFixed(2)),
        secondaryType: "currency",
        tertiaryLabel: "Sales Tax Amount",
        tertiaryValue: Number(tax.toFixed(2)),
        tertiaryType: "currency"
      };
    }
  },
  "vat-calculator": {
    slug: "vat-calculator",
    name: "VAT Calculator",
    description: "Calculate Value Added Tax (VAT) amounts and gross price.",
    inputs: [
      { id: "price", label: "Net Price", type: "currency", min: 1, max: 1000000, step: 1, default: 1000 },
      { id: "rate", label: "VAT Rate (%)", type: "percentage", min: 0, max: 40, step: 0.5, default: 20 }
    ],
    calculate: (inputs) => {
      const p = inputs.price || 1000;
      const r = (inputs.rate || 20) / 100;
      const vat = p * r;
      const gross = p + vat;
      return {
        primaryLabel: "Gross Price (incl. VAT)",
        primaryValue: Number(gross.toFixed(2)),
        primaryType: "currency",
        secondaryLabel: "Net Price",
        secondaryValue: Number(p.toFixed(2)),
        secondaryType: "currency",
        tertiaryLabel: "VAT Amount",
        tertiaryValue: Number(vat.toFixed(2)),
        tertiaryType: "currency"
      };
    }
  },
  "salary-calculator": {
    slug: "salary-calculator",
    name: "Salary Calculator",
    description: "Calculate gross to net take-home salary and deductions.",
    inputs: [
      { id: "gross", label: "Annual Gross Salary", type: "currency", min: 50000, max: 50000000, step: 10000, default: 1200000 },
      { id: "deductions", label: "Monthly Deductions / EPF / Insurance", type: "currency", min: 0, max: 100000, step: 500, default: 10000 },
      { id: "taxPercent", label: "Estimated Effective Tax Rate (%)", type: "percentage", min: 0, max: 45, step: 0.5, default: 10 }
    ],
    calculate: (inputs) => {
      const gross = inputs.gross || 1200000;
      const monthlyDeductions = inputs.deductions || 10000;
      const taxRate = (inputs.taxPercent || 10) / 100;
      
      const annualTax = gross * taxRate;
      const annualDeductions = monthlyDeductions * 12;
      const netAnnual = Math.max(0, gross - annualTax - annualDeductions);
      const netMonthly = Math.round(netAnnual / 12);

      return {
        primaryLabel: "Monthly In-Hand Salary",
        primaryValue: netMonthly,
        primaryType: "currency",
        secondaryLabel: "Annual Take-Home",
        secondaryValue: Math.round(netAnnual),
        secondaryType: "currency",
        tertiaryLabel: "Annual Tax & Deductions",
        tertiaryValue: Math.round(annualTax + annualDeductions),
        tertiaryType: "currency"
      };
    }
  },
  "hra-exemption": {
    slug: "hra-exemption", name: "HRA Exemption Calculator", description: "Calculate your House Rent Allowance exemption.",
    inputs: [
      { id: "basic", label: "Basic Salary (Annual)", type: "currency", min: 100000, max: 5000000, step: 10000, default: 600000 },
      { id: "hra", label: "HRA Received (Annual)", type: "currency", min: 10000, max: 2000000, step: 10000, default: 240000 },
      { id: "rent", label: "Actual Rent Paid (Annual)", type: "currency", min: 10000, max: 2000000, step: 10000, default: 300000 },
      // The metro list expanded on 1 Apr 2026 (Income-tax Rules 2026, Rule 279)
      // from four cities to eight. Naming them in the label matters: someone in
      // Bengaluru or Pune would otherwise answer "No" out of habit and
      // under-claim by ten percentage points.
      { id: "metro", label: "Metro city? Delhi/Mumbai/Kolkata/Chennai/Bengaluru/Hyderabad/Pune/Ahmedabad (1=Yes, 0=No)", type: "number", min: 0, max: 1, step: 1, default: 1 }
    ],
    calculate: (inputs) => {
      const condition1 = inputs.hra;
      const condition2 = inputs.rent - (0.1 * inputs.basic);
      const condition3 = inputs.metro === 1 ? 0.5 * inputs.basic : 0.4 * inputs.basic;
      
      let exemption = Math.min(condition1, condition2, condition3);
      if (exemption < 0) exemption = 0;
      
      return {
        primaryLabel: "Exempted HRA", primaryValue: exemption, primaryType: "currency",
        secondaryLabel: "Taxable HRA", secondaryValue: inputs.hra - exemption, secondaryType: "currency",
        tertiaryLabel: "Total HRA Received", tertiaryValue: inputs.hra, tertiaryType: "currency"
      };
    }
  },
  "capital-gains-tax": {
    slug: "capital-gains-tax", name: "Capital Gains Tax", description: "Estimate tax on sale of assets.",
    inputs: [
      { id: "sale", label: "Sale Value", type: "currency", min: 10000, max: 50000000, step: 10000, default: 10000000 },
      { id: "purchase", label: "Purchase Value", type: "currency", min: 10000, max: 50000000, step: 10000, default: 5000000 },
      { id: "ltcg", label: "Is Long Term? (1=Yes, 0=No)", type: "number", min: 0, max: 1, step: 1, default: 1 }
    ],
    calculate: (inputs) => {
      const gain = inputs.sale - inputs.purchase;
      const taxRate = inputs.ltcg === 1 ? 0.125 : 0.20; // Example modern rates
      const taxAmount = gain > 0 ? gain * taxRate : 0;
      
      return {
        primaryLabel: "Estimated Tax", primaryValue: taxAmount, primaryType: "currency",
        secondaryLabel: "Net Gain", secondaryValue: gain > 0 ? gain - taxAmount : gain, secondaryType: "currency",
        tertiaryLabel: "Total Gross Gain", tertiaryValue: gain, tertiaryType: "currency"
      };
    }
  },
  "tds-calculator": {
    slug: "tds-calculator", name: "TDS Calculator", description: "Calculate Tax Deducted at Source.",
    inputs: [
      { id: "amount", label: "Total Amount", type: "currency", min: 1000, max: 10000000, step: 1000, default: 50000 },
      { id: "rate", label: "TDS Rate (%)", type: "percentage", min: 0, max: 30, step: 0.1, default: 10 }
    ],
    calculate: (inputs) => {
      const tds = inputs.amount * (inputs.rate / 100);
      return {
        primaryLabel: "TDS Amount", primaryValue: tds, primaryType: "currency",
        secondaryLabel: "Amount In Hand", secondaryValue: inputs.amount - tds, secondaryType: "currency",
        tertiaryLabel: "Gross Amount", tertiaryValue: inputs.amount, tertiaryType: "currency"
      };
    }
  },
  "advance-tax": {
    slug: "advance-tax", name: "Advance Tax", description: "Calculate advance tax liability.",
    inputs: [
      { id: "income", label: "Estimated Annual Income", type: "currency", min: 500000, max: 50000000, step: 50000, default: 1500000 },
      { id: "tds", label: "TDS Already Deducted", type: "currency", min: 0, max: 1000000, step: 5000, default: 50000 }
    ],
    calculate: (inputs) => {
      // Simplified bracket for example
      const tax = inputs.income * 0.2 - inputs.tds; 
      const advanceTax = tax > 10000 ? tax : 0;
      return {
        primaryLabel: "Advance Tax Payable", primaryValue: advanceTax, primaryType: "currency",
        secondaryLabel: "Total Est. Tax", secondaryValue: tax + inputs.tds, secondaryType: "currency",
        tertiaryLabel: "TDS Deducted", tertiaryValue: inputs.tds, tertiaryType: "currency"
      };
    }
  },
  "stamp-duty": {
    slug: "stamp-duty", name: "Stamp Duty Calculator", description: "Estimate stamp duty on property.",
    inputs: [
      { id: "value", label: "Property Value", type: "currency", min: 500000, max: 100000000, step: 100000, default: 5000000 },
      { id: "rate", label: "Stamp Duty Rate (%)", type: "percentage", min: 1, max: 15, step: 0.1, default: 5 },
      { id: "reg", label: "Registration Rate (%)", type: "percentage", min: 0, max: 5, step: 0.1, default: 1 }
    ],
    calculate: (inputs) => {
      const stampDuty = inputs.value * (inputs.rate / 100);
      const regFee = inputs.value * (inputs.reg / 100);
      return {
        primaryLabel: "Total Govt Fees", primaryValue: stampDuty + regFee, primaryType: "currency",
        secondaryLabel: "Stamp Duty", secondaryValue: stampDuty, secondaryType: "currency",
        tertiaryLabel: "Registration Fee", tertiaryValue: regFee, tertiaryType: "currency"
      };
    }
  }
};
