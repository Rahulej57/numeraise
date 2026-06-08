export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyData: { year: number; invested: number; value: number }[];
}

export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRate: number, // Annual rate in percentage (e.g., 12 for 12%)
  timePeriodYears: number
): SIPResult {
  const i = expectedReturnRate / 100 / 12;
  const n = timePeriodYears * 12;
  const p = monthlyInvestment;

  const totalValue = i === 0 ? p * n : p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const investedAmount = p * n;
  const estimatedReturns = totalValue - investedAmount;

  const yearlyData = [];
  for (let year = 1; year <= timePeriodYears; year++) {
    const currentN = year * 12;
    const currentTotalValue = i === 0 ? p * currentN : p * ((Math.pow(1 + i, currentN) - 1) / i) * (1 + i);
    yearlyData.push({
      year,
      invested: p * currentN,
      value: Math.round(currentTotalValue),
    });
  }

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearlyData,
  };
}

export interface FDResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyData: { year: number; invested: number; interest: number; balance: number }[];
}

export function calculateFD(
  principalAmount: number,
  interestRate: number, // Annual percentage
  timePeriodYears: number,
  compoundingFrequency: number = 4 // Default quarterly compounding
): FDResult {
  const r = interestRate / 100;
  const n = compoundingFrequency;
  const t = timePeriodYears;

  const totalValue = principalAmount * Math.pow(1 + r / n, n * t);
  const estimatedReturns = totalValue - principalAmount;

  const yearlyData = [];
  for (let year = 1; year <= timePeriodYears; year++) {
    const currentTotalValue = principalAmount * Math.pow(1 + r / n, n * year);
    yearlyData.push({
      year,
      invested: principalAmount,
      interest: Math.round(currentTotalValue - principalAmount),
      balance: Math.round(currentTotalValue),
    });
  }

  return {
    investedAmount: Math.round(principalAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearlyData,
  };
}
