import { calculateEMI, EMIResult } from '@/lib/calculations/loan';

export interface ProgrammaticEMIScenario {
  slug: string;
  principal: number;
  tenureYears: number;
  interestRate: number; // e.g. 8.5% for Home Loans, 9% for Car Loans, 12% for Personal Loans
  loanType: 'home' | 'car' | 'personal';
  title: string;
  metaDescription: string;
  headline: string;
  description: string;
}

export const PROGRAMMATIC_EMI_SCENARIOS: ProgrammaticEMIScenario[] = [
  // Home Loans: 20L, 25L, 30L, 40L, 50L, 75L, 1Cr
  {
    slug: '20-lakh-home-loan-emi-for-15-years',
    principal: 2000000,
    tenureYears: 15,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹20 Lakh Home Loan EMI for 15 Years at 8.5%: Monthly Payment (2026)',
    metaDescription: 'Calculate EMI for ₹20 Lakh home loan for 15 years at 8.5% interest. Monthly EMI: ₹19,695. See total interest, prepayment savings, and amortization.',
    headline: '₹20 Lakh Home Loan EMI for 15 Years',
    description: 'Calculate your exact monthly EMI and interest for a ₹20 Lakh home loan over a 15-year tenure at competitive bank rates.',
  },
  {
    slug: '20-lakh-home-loan-emi-for-20-years',
    principal: 2000000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹20 Lakh Home Loan EMI for 20 Years at 8.5%: Full Schedule (2026)',
    metaDescription: 'What is the EMI for ₹20 Lakh home loan for 20 years at 8.5%? Monthly EMI is ₹17,356. Total interest: ₹21.65 Lakhs. View prepayment hacks.',
    headline: '₹20 Lakh Home Loan EMI for 20 Years',
    description: 'A 20-year ₹20 Lakh housing loan is the baseline entry for first-time apartment buyers across Tier 1 and Tier 2 Indian cities.',
  },
  {
    slug: '25-lakh-home-loan-emi-for-20-years',
    principal: 2500000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹25 Lakh Home Loan EMI for 20 Years: Interest & Amortization (2026)',
    metaDescription: 'Calculate EMI for ₹25 Lakh home loan for 20 years at 8.5%. Monthly EMI: ₹21,696. Discover how 1 extra EMI saves ₹6.8+ Lakhs in interest.',
    headline: '₹25 Lakh Home Loan EMI for 20 Years',
    description: 'Check the breakdown of principal vs interest for a ₹25 Lakh home loan with strategies to pay off your debt years early.',
  },
  {
    slug: '30-lakh-home-loan-emi-for-15-years',
    principal: 3000000,
    tenureYears: 15,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹30 Lakh Home Loan EMI for 15 Years: Total Cost & Prepayment (2026)',
    metaDescription: 'Find out the monthly EMI for ₹30 Lakh home loan for 15 years at 8.5%. Monthly EMI is ₹29,542. Save over ₹8 Lakhs by opting for 15 vs 20 years.',
    headline: '₹30 Lakh Home Loan EMI for 15 Years',
    description: 'Choosing 15 years instead of 20 years for a ₹30 Lakh loan saves you over ₹8.6 Lakhs in pure interest payable to the bank.',
  },
  {
    slug: '30-lakh-home-loan-emi-for-20-years',
    principal: 3000000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹30 Lakh Home Loan EMI for 20 Years at 8.5%: Exact EMI (2026)',
    metaDescription: 'What is the EMI for 30 Lakh home loan for 20 years? Monthly EMI: ₹26,035. Total interest: ₹32.48 Lakhs. See full repayment schedule.',
    headline: '₹30 Lakh Home Loan EMI for 20 Years',
    description: 'One of the most searched home loan questions in India: monthly EMI for ₹30 Lakhs at 8.5% is ₹26,035 with a total repayment of ₹62.48 Lakhs.',
  },
  {
    slug: '30-lakh-home-loan-emi-for-25-years',
    principal: 3000000,
    tenureYears: 25,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹30 Lakh Home Loan EMI for 25 Years: Cost of Longer Tenure (2026)',
    metaDescription: 'Calculate EMI for ₹30 Lakh home loan for 25 years at 8.5%. Monthly EMI: ₹24,157. Understand the hidden interest cost of 25-year loans.',
    headline: '₹30 Lakh Home Loan EMI for 25 Years',
    description: 'While extending to 25 years drops your EMI to ₹24,157, total interest climbs to ₹42.47 Lakhs—more than 140% of the original loan principal.',
  },
  {
    slug: '40-lakh-home-loan-emi-for-20-years',
    principal: 4000000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹40 Lakh Home Loan EMI for 20 Years at 8.5%: Payment Plan (2026)',
    metaDescription: 'Calculate monthly EMI for ₹40 Lakh home loan for 20 years at 8.5%. Monthly EMI: ₹34,713. See amortization and prepayment savings.',
    headline: '₹40 Lakh Home Loan EMI for 20 Years',
    description: 'A ₹40 Lakh home loan requires a monthly commitment of ₹34,713. Learn how prepayment can wipe out 4 years of debt.',
  },
  {
    slug: '50-lakh-home-loan-emi-for-15-years',
    principal: 5000000,
    tenureYears: 15,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹50 Lakh Home Loan EMI for 15 Years: Fast-Track Repayment (2026)',
    metaDescription: 'Monthly EMI for ₹50 Lakh home loan for 15 years is ₹49,237. Total interest: ₹38.62 Lakhs. Compare with 20-year repayment options.',
    headline: '₹50 Lakh Home Loan EMI for 15 Years',
    description: 'A high-velocity repayment plan for high earners: clear a ₹50 Lakh home loan in 15 years and save over ₹14 Lakhs in interest.',
  },
  {
    slug: '50-lakh-home-loan-emi-for-20-years',
    principal: 5000000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹50 Lakh Home Loan EMI for 20 Years at 8.5%: Complete Math (2026)',
    metaDescription: 'What is the EMI for 50 Lakh home loan for 20 years? Monthly EMI: ₹43,391. Total interest payable: ₹54.14 Lakhs. View prepayment hacks.',
    headline: '₹50 Lakh Home Loan EMI for 20 Years',
    description: 'A staple loan amount for metropolitan real estate. Monthly EMI is ₹43,391, but interest exceeds the original loan amount without prepayment.',
  },
  {
    slug: '50-lakh-home-loan-emi-for-25-years',
    principal: 5000000,
    tenureYears: 25,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹50 Lakh Home Loan EMI for 25 Years: Monthly Budgeting (2026)',
    metaDescription: 'EMI for ₹50 Lakh home loan for 25 years at 8.5% is ₹40,261. Total repayment: ₹1.21 Crores. View full amortization table.',
    headline: '₹50 Lakh Home Loan EMI for 25 Years',
    description: 'A 25-year tenure brings the EMI down to ₹40,261 per month, but costs ₹70.78 Lakhs in interest alone.',
  },
  {
    slug: '75-lakh-home-loan-emi-for-20-years',
    principal: 7500000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹75 Lakh Home Loan EMI for 20 Years: Interest & Schedule (2026)',
    metaDescription: 'Calculate EMI on ₹75 Lakh home loan for 20 years at 8.5%. Monthly EMI: ₹65,087. Total payment: ₹1.56 Crores. Explore tax deduction benefits.',
    headline: '₹75 Lakh Home Loan EMI for 20 Years',
    description: 'For premium residential purchases, a ₹75 Lakh loan requires ₹65,087 per month. Maximize Section 24(b) interest tax deductions.',
  },
  {
    slug: '1-crore-home-loan-emi-for-20-years',
    principal: 10000000,
    tenureYears: 20,
    interestRate: 8.5,
    loanType: 'home',
    title: '₹1 Crore Home Loan EMI for 20 Years at 8.5%: Full Analysis (2026)',
    metaDescription: 'What is the EMI on a 1 Crore home loan for 20 years? Monthly EMI: ₹86,782. Total interest: ₹1.08 Crores. See how 1 extra EMI saves ₹24 Lakhs.',
    headline: '₹1 Crore Home Loan EMI for 20 Years',
    description: 'Luxury real estate financing: monthly EMI is ₹86,782. Total repayment across 20 years amounts to ₹2.08 Crores.',
  },

  // Car Loans (9% interest benchmark)
  {
    slug: '5-lakh-car-loan-emi-for-5-years',
    principal: 500000,
    tenureYears: 5,
    interestRate: 9.0,
    loanType: 'car',
    title: '₹5 Lakh Car Loan EMI for 5 Years at 9%: Monthly Payment (2026)',
    metaDescription: 'Calculate monthly EMI for ₹5 Lakh car loan for 5 years at 9% interest. Monthly EMI: ₹10,379. Total interest: ₹1.22 Lakhs. Free amortization table.',
    headline: '₹5 Lakh Car Loan EMI for 5 Years',
    description: 'Affordable auto financing: a ₹5 Lakh car loan has an EMI of ₹10,379 per month with total interest of ₹1,22,753 over 5 years.',
  },
  {
    slug: '10-lakh-car-loan-emi-for-5-years',
    principal: 1000000,
    tenureYears: 5,
    interestRate: 9.0,
    loanType: 'car',
    title: '₹10 Lakh Car Loan EMI for 5 Years at 9%: Monthly Schedule (2026)',
    metaDescription: 'What is the EMI for ₹10 Lakh car loan for 5 years at 9%? Monthly EMI is ₹20,758. Total repayment: ₹12.45 Lakhs. View amortization.',
    headline: '₹10 Lakh Car Loan EMI for 5 Years',
    description: 'Standard mid-size SUV financing: ₹10 Lakh auto loan costs ₹20,758 per month across 60 equal monthly installments.',
  },
  {
    slug: '10-lakh-car-loan-emi-for-7-years',
    principal: 1000000,
    tenureYears: 7,
    interestRate: 9.0,
    loanType: 'car',
    title: '₹10 Lakh Car Loan EMI for 7 Years: 5 vs 7 Year Comparison (2026)',
    metaDescription: 'Monthly EMI for ₹10 Lakh car loan for 7 years at 9% is ₹16,089. Compare 7-year vs 5-year auto loans to see the extra ₹95,000 interest cost.',
    headline: '₹10 Lakh Car Loan EMI for 7 Years',
    description: 'Extending car tenure to 84 months lowers EMI to ₹16,089, but adds nearly ₹1 Lakh in additional interest charges.',
  },

  // Personal Loans (12% interest benchmark)
  {
    slug: '2-lakh-personal-loan-emi-for-3-years',
    principal: 200000,
    tenureYears: 3,
    interestRate: 12.0,
    loanType: 'personal',
    title: '₹2 Lakh Personal Loan EMI for 3 Years at 12%: Monthly Cost (2026)',
    metaDescription: 'Calculate EMI for ₹2 Lakh personal loan for 3 years (36 months) at 12%. Monthly EMI: ₹6,643. Total interest: ₹39,141. Fast calculations.',
    headline: '₹2 Lakh Personal Loan EMI for 3 Years',
    description: 'Emergency or medical credit: a ₹2 Lakh personal loan costs ₹6,643 per month over 36 months.',
  },
  {
    slug: '5-lakh-personal-loan-emi-for-5-years',
    principal: 500000,
    tenureYears: 5,
    interestRate: 12.0,
    loanType: 'personal',
    title: '₹5 Lakh Personal Loan EMI for 5 Years at 12%: Repayment Plan (2026)',
    metaDescription: 'Monthly EMI for ₹5 Lakh personal loan for 5 years at 12% is ₹11,122. Total repayment: ₹6.67 Lakhs. Full 60-month amortization schedule.',
    headline: '₹5 Lakh Personal Loan EMI for 5 Years',
    description: 'Calculate your exact payments for a ₹5 Lakh unsecured personal loan for weddings, renovations, or debt consolidation.',
  },
  {
    slug: '10-lakh-personal-loan-emi-for-5-years',
    principal: 1000000,
    tenureYears: 5,
    interestRate: 12.0,
    loanType: 'personal',
    title: '₹10 Lakh Personal Loan EMI for 5 Years at 12%: Full Schedule (2026)',
    metaDescription: 'What is the EMI for ₹10 Lakh personal loan for 5 years at 12%? Monthly EMI: ₹22,244. Total interest: ₹3.34 Lakhs. Avoid debt traps.',
    headline: '₹10 Lakh Personal Loan EMI for 5 Years',
    description: 'High-value personal loan arithmetic: monthly EMI is ₹22,244, with total interest of ₹3,34,667 over 5 years.',
  },
];

export function getProgrammaticEMIBySlug(slug: string): ProgrammaticEMIScenario | undefined {
  return PROGRAMMATIC_EMI_SCENARIOS.find((s) => s.slug === slug);
}

export function computeEMIDetails(scenario: ProgrammaticEMIScenario) {
  const result = calculateEMI(scenario.principal, scenario.interestRate, scenario.tenureYears);

  // Compute 1-Extra-EMI Prepayment Hack
  const r = scenario.interestRate / 100 / 12;
  const tenureMonths = scenario.tenureYears * 12;
  const acceleratedPayment = result.emi * (13 / 12);

  let balance = scenario.principal;
  let totalInt = 0;
  let months = 0;

  while (balance > 0 && months < tenureMonths) {
    months++;
    const interestCharge = balance * r;
    totalInt += interestCharge;
    const principalPaid = Math.min(balance, acceleratedPayment - interestCharge);
    balance -= principalPaid;
    if (balance <= 0) break;
  }

  const monthsSaved = tenureMonths - months;
  const yearsSaved = (monthsSaved / 12).toFixed(1);
  const interestSaved = Math.max(0, result.totalInterest - totalInt);

  // Group amortization by year for readability
  const yearlySummary: { year: number; principal: number; interest: number; balance: number }[] = [];
  for (let y = 1; y <= scenario.tenureYears; y++) {
    const startIdx = (y - 1) * 12;
    const endIdx = Math.min(y * 12, result.amortizationSchedule.length);
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    let endingBalance = 0;

    for (let m = startIdx; m < endIdx; m++) {
      yearlyPrincipal += result.amortizationSchedule[m].principal;
      yearlyInterest += result.amortizationSchedule[m].interest;
      endingBalance = result.amortizationSchedule[m].balance;
    }

    yearlySummary.push({
      year: y,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      balance: endingBalance,
    });
  }

  return {
    ...result,
    yearsSaved,
    monthsSaved,
    interestSaved: Math.round(interestSaved),
    yearlySummary,
  };
}
