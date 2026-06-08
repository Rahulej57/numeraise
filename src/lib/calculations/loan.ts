export interface EMIResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EMIResult {
  const r = annualInterestRate / 100 / 12;
  const n = tenureYears * 12;

  let emi = 0;
  if (r === 0) {
    emi = principal / n;
  } else {
    emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  let balance = principal;
  const amortizationSchedule = [];

  for (let month = 1; month <= n; month++) {
    const interestForMonth = balance * r;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;

    // To prevent negative balance due to floating point inaccuracies
    if (balance < 0) balance = 0;

    amortizationSchedule.push({
      month,
      principal: Math.round(principalForMonth),
      interest: Math.round(interestForMonth),
      balance: Math.round(balance),
    });
  }

  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    amortizationSchedule,
  };
}
