import { calculateSIP, SIPResult } from '@/lib/calculations/investment';

export interface ProgrammaticSIPScenario {
  slug: string;
  monthlyAmount: number;
  years: number;
  expectedRate: number; // default 12% for equity mutual funds in India
  targetCorpus?: number;
  title: string;
  metaDescription: string;
  headline: string;
  description: string;
  category: 'amount' | 'target';
}

export const PROGRAMMATIC_SIP_SCENARIOS: ProgrammaticSIPScenario[] = [
  // Budget SIPs
  {
    slug: '500-per-month-for-5-years',
    monthlyAmount: 500,
    years: 5,
    expectedRate: 12,
    title: '₹500 Per Month SIP for 5 Years: Returns & Wealth Growth (2026)',
    metaDescription: 'Calculate returns for ₹500/month SIP over 5 years at 12% p.a. See total invested, wealth gained, 10% step-up impact, and inflation purchasing power.',
    headline: '₹500 Monthly SIP for 5 Years',
    description: 'Starting with just ₹500 per month is the best way for students and beginners to build a disciplined investing habit through mutual funds.',
    category: 'amount',
  },
  {
    slug: '1000-per-month-for-5-years',
    monthlyAmount: 1000,
    years: 5,
    expectedRate: 12,
    title: '₹1,000 Per Month SIP for 5 Years: Returns & Maturity Corpus (2026)',
    metaDescription: 'See how much ₹1,000 monthly SIP yields in 5 years at 12% CAGR. Explore year-by-year compounding and inflation-adjusted value.',
    headline: '₹1,000 Monthly SIP for 5 Years',
    description: 'A ₹1,000 monthly SIP over 5 years lets you build a solid mid-term financial cushion while beating fixed deposit returns.',
    category: 'amount',
  },
  {
    slug: '1000-per-month-for-10-years',
    monthlyAmount: 1000,
    years: 10,
    expectedRate: 12,
    title: '₹1,000 Per Month SIP for 10 Years: Compounding & Returns (2026)',
    metaDescription: 'Calculate maturity value of ₹1,000 monthly SIP for 10 years. Discover the power of 10-year compounding, step-up SIP, and wealth creation.',
    headline: '₹1,000 Monthly SIP for 10 Years',
    description: 'Investing ₹1,000 every month for a decade demonstrates the true magic of compounding where returns surpass your total invested capital.',
    category: 'amount',
  },
  {
    slug: '2000-per-month-for-10-years',
    monthlyAmount: 2000,
    years: 10,
    expectedRate: 12,
    title: '₹2,000 Per Month SIP for 10 Years: Future Value & Growth (2026)',
    metaDescription: 'What is the return on ₹2,000 per month SIP for 10 years at 12%? View full wealth growth, step-up projections, and purchasing power.',
    headline: '₹2,000 Monthly SIP for 10 Years',
    description: 'A ₹2,000 monthly mutual fund SIP over 10 years builds substantial wealth suitable for medium-term life goals or a child education foundation.',
    category: 'amount',
  },
  {
    slug: '3000-per-month-for-10-years',
    monthlyAmount: 3000,
    years: 10,
    expectedRate: 12,
    title: '₹3,000 Per Month SIP for 10 Years: Returns & Wealth Projection (2026)',
    metaDescription: 'Find out the maturity corpus of a ₹3,000 monthly SIP after 10 years. View growth charts, returns breakdown, and step-up advantages.',
    headline: '₹3,000 Monthly SIP for 10 Years',
    description: 'Putting ₹3,000/month into diversified equity funds compounds into a significant capital reserve over 10 years.',
    category: 'amount',
  },

  // ₹5,000 / month Series (Highest Search Volumes in India)
  {
    slug: '5000-per-month-for-5-years',
    monthlyAmount: 5000,
    years: 5,
    expectedRate: 12,
    title: '₹5,000 Per Month SIP for 5 Years: Returns & Maturity Value (2026)',
    metaDescription: 'Calculate maturity amount for ₹5,000 monthly SIP for 5 years at 12% return. View invested amount, capital gains, and inflation impact.',
    headline: '₹5,000 Monthly SIP for 5 Years',
    description: 'A 5-year ₹5,000 SIP is ideal for accumulating a down payment for a car or home loan with higher returns than recurring deposits.',
    category: 'amount',
  },
  {
    slug: '5000-per-month-for-10-years',
    monthlyAmount: 5000,
    years: 10,
    expectedRate: 12,
    title: '₹5,000 Per Month SIP for 10 Years: Wealth Growth & Returns (2026)',
    metaDescription: 'What will be the return on ₹5,000 per month SIP for 10 years? Learn how ₹6 Lakhs investment grows into ₹11.6+ Lakhs with compounding.',
    headline: '₹5,000 Monthly SIP for 10 Years',
    description: 'One of the most popular personal finance milestones in India. A ₹5,000 SIP for 10 years almost doubles your money via compounding.',
    category: 'amount',
  },
  {
    slug: '5000-per-month-for-15-years',
    monthlyAmount: 5000,
    years: 15,
    expectedRate: 12,
    title: '₹5,000 Per Month SIP for 15 Years: Compounding & Corpus (2026)',
    metaDescription: 'Calculate maturity corpus of ₹5,000 monthly SIP for 15 years. See how compounding creates ₹25+ Lakhs from ₹9 Lakhs invested.',
    headline: '₹5,000 Monthly SIP for 15 Years',
    description: 'Over 15 years, a ₹5,000 SIP crosses the compounding inflection point where your gains dwarf your original investment by nearly 2x.',
    category: 'amount',
  },
  {
    slug: '5000-per-month-for-20-years',
    monthlyAmount: 5000,
    years: 20,
    expectedRate: 12,
    title: '₹5,000 Per Month SIP for 20 Years: Turn ₹12L into ₹50L (2026)',
    metaDescription: 'See how ₹5,000 per month SIP for 20 years can build a ₹50 Lakh corpus at 12% CAGR. Explore 10% annual step-up to reach ₹1 Crore.',
    headline: '₹5,000 Monthly SIP for 20 Years',
    description: 'A true long-term wealth generator: investing ₹5,000/month for 20 years accumulates around ₹50 Lakhs, and over ₹95 Lakhs with an annual 10% step-up.',
    category: 'amount',
  },

  // ₹10,000 / month Series
  {
    slug: '10000-per-month-for-5-years',
    monthlyAmount: 10000,
    years: 5,
    expectedRate: 12,
    title: '₹10,000 Per Month SIP for 5 Years: Returns & Wealth Growth (2026)',
    metaDescription: 'Calculate returns on ₹10,000 monthly SIP for 5 years. Total invested ₹6 Lakhs grows to ₹8.25+ Lakhs at 12% CAGR.',
    headline: '₹10,000 Monthly SIP for 5 Years',
    description: 'Ideal for early-career professionals setting aside surplus income to build an emergency buffer or purchase major assets.',
    category: 'amount',
  },
  {
    slug: '10000-per-month-for-10-years',
    monthlyAmount: 10000,
    years: 10,
    expectedRate: 12,
    title: '₹10,000 Per Month SIP for 10 Years: Returns & Schedule (2026)',
    metaDescription: 'Maturity value of ₹10,000 monthly SIP for 10 years at 12% CAGR: ₹23.23 Lakhs on ₹12 Lakhs investment. See year-by-year schedule.',
    headline: '₹10,000 Monthly SIP for 10 Years',
    description: 'A 10-year ₹10,000 SIP yields over ₹23 Lakhs, creating a powerful fund for buying property, wedding expenses, or starting a venture.',
    category: 'amount',
  },
  {
    slug: '10000-per-month-for-15-years',
    monthlyAmount: 10000,
    years: 15,
    expectedRate: 12,
    title: '₹10,000 Per Month SIP for 15 Years: Path to Half a Crore (2026)',
    metaDescription: 'Calculate returns for ₹10,000 monthly SIP for 15 years. See how ₹18 Lakhs investment turns into ₹50.45 Lakhs with mutual fund compounding.',
    headline: '₹10,000 Monthly SIP for 15 Years',
    description: 'Reaching half a crore (₹50 Lakhs) with just ₹10,000 a month is one of the most reliable wealth blueprints for salaried individuals.',
    category: 'amount',
  },
  {
    slug: '10000-per-month-for-20-years',
    monthlyAmount: 10000,
    years: 20,
    expectedRate: 12,
    title: '₹10,000 Per Month SIP for 20 Years: Build ₹1 Crore Corpus (2026)',
    metaDescription: 'Turn ₹10,000 per month into ₹1 Crore in 20 years. View detailed compounding schedule, inflation-adjusted value, and step-up returns.',
    headline: '₹10,000 Monthly SIP for 20 Years',
    description: 'The definitive "Crorepati Blueprint": an investment of ₹24 Lakhs produces over ₹75 Lakhs in profits, bringing total maturity value to ₹1 Crore.',
    category: 'amount',
  },
  {
    slug: '10000-per-month-for-25-years',
    monthlyAmount: 10000,
    years: 25,
    expectedRate: 12,
    title: '₹10,000 Per Month SIP for 25 Years: Retirement Wealth (2026)',
    metaDescription: 'See how ₹10,000 monthly SIP for 25 years generates a staggering ₹1.9 Crore corpus. Complete 25-year compounding schedule and tax insights.',
    headline: '₹10,000 Monthly SIP for 25 Years',
    description: 'A complete career-long SIP: over 25 years, a modest ₹10,000 monthly contribution transforms into nearly ₹2 Crores of retirement security.',
    category: 'amount',
  },

  // Higher Slabs: ₹15,000, ₹20,000, ₹25,000, ₹50,000, ₹1 Lakh
  {
    slug: '15000-per-month-for-10-years',
    monthlyAmount: 15000,
    years: 10,
    expectedRate: 12,
    title: '₹15,000 Per Month SIP for 10 Years: Returns & Amortization (2026)',
    metaDescription: 'Calculate ₹15,000 per month SIP over 10 years. Expected maturity corpus: ₹34.8+ Lakhs on ₹18 Lakhs invested capital.',
    headline: '₹15,000 Monthly SIP for 10 Years',
    description: 'Accelerate wealth creation: investing ₹15,000 per month for a decade yields nearly ₹35 Lakhs, beating all fixed-income alternatives.',
    category: 'amount',
  },
  {
    slug: '20000-per-month-for-10-years',
    monthlyAmount: 20000,
    years: 10,
    expectedRate: 12,
    title: '₹20,000 Per Month SIP for 10 Years: Wealth Growth & Schedule (2026)',
    metaDescription: 'What will be the return on ₹20,000 monthly SIP for 10 years? Learn how ₹24 Lakhs investment grows into ₹46.47 Lakhs.',
    headline: '₹20,000 Monthly SIP for 10 Years',
    description: 'A high-impact investment strategy that accumulates almost ₹46.5 Lakhs in 10 years for aggressive wealth accumulation.',
    category: 'amount',
  },
  {
    slug: '20000-per-month-for-15-years',
    monthlyAmount: 20000,
    years: 15,
    expectedRate: 12,
    title: '₹20,000 Per Month SIP for 15 Years: 1 Crore Milestone (2026)',
    metaDescription: 'Reach ₹1 Crore in 15 years with ₹20,000 monthly SIP. View detailed calculations, wealth multiplier, and 10% annual step-up projections.',
    headline: '₹20,000 Monthly SIP for 15 Years',
    description: 'Investing ₹20,000 every month hits the coveted ₹1 Crore mark in 15 years, with more than ₹65 Lakhs coming purely from compounding interest.',
    category: 'amount',
  },
  {
    slug: '25000-per-month-for-10-years',
    monthlyAmount: 25000,
    years: 10,
    expectedRate: 12,
    title: '₹25,000 Per Month SIP for 10 Years: Returns & Tax Insights (2026)',
    metaDescription: 'Calculate maturity value of ₹25,000 monthly SIP for 10 years. See how ₹30 Lakhs grows to ₹58.09 Lakhs with equity mutual funds.',
    headline: '₹25,000 Monthly SIP for 10 Years',
    description: 'A powerful wealth building plan for dual-income couples or senior IT professionals, amassing ₹58+ Lakhs in a single decade.',
    category: 'amount',
  },
  {
    slug: '50000-per-month-for-10-years',
    monthlyAmount: 50000,
    years: 10,
    expectedRate: 12,
    title: '₹50,000 Per Month SIP for 10 Years: Build ₹1.16 Crores (2026)',
    metaDescription: 'How much returns on ₹50,000 per month SIP for 10 years? Invest ₹60 Lakhs to accumulate ₹1.16+ Crores at 12% CAGR.',
    headline: '₹50,000 Monthly SIP for 10 Years',
    description: 'Achieve financial freedom faster: putting ₹50,000/month into mutual funds crosses the ₹1 Crore threshold within just 10 years.',
    category: 'amount',
  },
  {
    slug: '1-lakh-per-month-for-10-years',
    monthlyAmount: 100000,
    years: 10,
    expectedRate: 12,
    title: '₹1 Lakh Per Month SIP for 10 Years: Build ₹2.32 Crores (2026)',
    metaDescription: 'Calculate maturity corpus of ₹1 Lakh monthly SIP for 10 years. Total investment ₹1.2 Crore yields ₹2.32+ Crores with compounding.',
    headline: '₹1 Lakh Monthly SIP for 10 Years',
    description: 'The HNI wealth blueprint: ₹1 Lakh per month yields over ₹1.12 Crore in pure capital gains over 10 years.',
    category: 'amount',
  },

  // Milestone Goals (e.g. 1 Crore, 50 Lakhs, 2 Crores)
  {
    slug: '1-crore-in-10-years',
    monthlyAmount: 43041, // Exact monthly SIP required for 1 Cr in 10 yrs at 12%
    years: 10,
    expectedRate: 12,
    targetCorpus: 10000000,
    title: 'How Much SIP for 1 Crore in 10 Years? Exact Calculation (2026)',
    metaDescription: 'How much monthly SIP is needed to reach ₹1 Crore in 10 years? You need ₹43,041/month at 12%, or only ₹26,500/month with a 10% annual step-up.',
    headline: 'How to Build ₹1 Crore in 10 Years with SIP',
    description: 'Reaching ₹1 Crore in 10 years requires ₹43,041/month at a standard 12% CAGR. Discover how an annual step-up slashes your required starting SIP down to ₹26,500.',
    category: 'target',
  },
  {
    slug: '1-crore-in-15-years',
    monthlyAmount: 19825, // Exact monthly SIP for 1 Cr in 15 yrs at 12%
    years: 15,
    expectedRate: 12,
    targetCorpus: 10000000,
    title: 'How Much SIP for 1 Crore in 15 Years? Monthly Plan (2026)',
    metaDescription: 'Need ₹1 Crore in 15 years? Invest ₹19,825/month at 12% return. Learn how compounding reduces your monthly burden by more than half.',
    headline: 'How to Build ₹1 Crore in 15 Years with SIP',
    description: 'With a 15-year horizon, your required monthly SIP for ₹1 Crore drops to under ₹20,000/month because time does the heavy lifting.',
    category: 'target',
  },
  {
    slug: '50-lakhs-in-5-years',
    monthlyAmount: 60610, // Exact monthly SIP for 50 Lakhs in 5 yrs at 12%
    years: 5,
    expectedRate: 12,
    targetCorpus: 5000000,
    title: 'How Much SIP to Get 50 Lakhs in 5 Years? Strategy & Math (2026)',
    metaDescription: 'To build ₹50 Lakhs in 5 years, you need a monthly SIP of ₹60,610 at 12% p.a. View asset allocation, tax efficiency, and growth breakdown.',
    headline: 'Building ₹50 Lakhs in 5 Years with SIP',
    description: 'Accumulating ₹50 Lakhs in 5 years requires aggressive monthly investments of ₹60,610 in disciplined equity mutual fund schemes.',
    category: 'target',
  },
  {
    slug: '2-crores-in-15-years',
    monthlyAmount: 39650, // Exact monthly SIP for 2 Cr in 15 yrs at 12%
    years: 15,
    expectedRate: 12,
    targetCorpus: 20000000,
    title: 'How Much SIP for 2 Crores in 15 Years? Financial Blueprint (2026)',
    metaDescription: 'Discover the exact monthly SIP needed to reach ₹2 Crores in 15 years. Invest ₹39,650/month at 12% CAGR to build a multi-crore portfolio.',
    headline: 'How to Accumulate ₹2 Crores in 15 Years',
    description: 'Aiming for early retirement or substantial legacy wealth? A ₹39,650 monthly SIP compounds into ₹2 Crores in 15 years.',
    category: 'target',
  },
];

export function getProgrammaticSIPBySlug(slug: string): ProgrammaticSIPScenario | undefined {
  return PROGRAMMATIC_SIP_SCENARIOS.find((s) => s.slug === slug);
}

export function computeSIPDetails(scenario: ProgrammaticSIPScenario) {
  const result = calculateSIP(scenario.monthlyAmount, scenario.expectedRate, scenario.years);

  // 10% Step-Up SIP calculation
  const r = scenario.expectedRate / 100 / 12;
  let stepUpCorpus = 0;
  let currentMonthly = scenario.monthlyAmount;
  let totalInvestedStepUp = 0;

  for (let y = 1; y <= scenario.years; y++) {
    for (let m = 1; m <= 12; m++) {
      stepUpCorpus = (stepUpCorpus + currentMonthly) * (1 + r);
      totalInvestedStepUp += currentMonthly;
    }
    currentMonthly *= 1.10;
  }

  // Inflation-Adjusted Purchasing Power (6% inflation baseline)
  const inflationRate = 0.06;
  const realPurchasingPower = result.totalValue / Math.pow(1 + inflationRate, scenario.years);

  return {
    ...result,
    stepUpCorpus: Math.round(stepUpCorpus),
    totalInvestedStepUp: Math.round(totalInvestedStepUp),
    stepUpGainDiff: Math.round(stepUpCorpus - result.totalValue),
    realPurchasingPower: Math.round(realPurchasingPower),
  };
}
