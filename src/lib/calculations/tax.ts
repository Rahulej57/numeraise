export interface TaxResult {
  totalIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveTaxRate: number;
}

export function calculateIncomeTax(
  annualSalary: number,
  deductions: number = 0,
  age: number = 30
): TaxResult {
  const taxableIncome = Math.max(0, annualSalary - deductions);
  let tax = 0;

  // Simplified standard slabs for illustration
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 45000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 90000 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 150000 + (taxableIncome - 1500000) * 0.30;
  }

  // Standard rebate
  if (taxableIncome <= 700000) {
    tax = 0;
  }

  // Health & Education Cess 4%
  tax = tax * 1.04;

  const effectiveTaxRate = annualSalary > 0 ? (tax / annualSalary) * 100 : 0;

  return {
    totalIncome: annualSalary,
    taxableIncome,
    totalTax: Math.round(tax),
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
  };
}
