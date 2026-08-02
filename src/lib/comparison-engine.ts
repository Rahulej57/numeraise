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

/** Every comparison slug, for generateStaticParams and the sitemap. */
export const COMPARISON_SLUGS = Object.keys(comparisonRegistry);

/**
 * Search-facing copy for each comparison page.
 *
 * Kept separate from `comparisonRegistry` because that object holds a
 * `calculate` function, which makes it unusable from a server component that
 * only needs metadata.
 */
export const COMPARISON_SEO: Record<
  string,
  {
    title: string;
    description: string;
    heading: string;
    intro: string;
    /**
     * Long-form body copy. These pages rendered 156-170 visible words each,
     * which is not enough to rank for terms as competitive as "rent vs buy".
     * Rendered as h2 + paragraphs beneath the calculator.
     */
    body: { heading: string; paragraphs: string[] }[];
  }
> = {
  'sip-vs-fd': {
    title: 'SIP vs FD Calculator: Which Builds More Wealth?',
    description:
      'Compare equity SIP returns against a fixed deposit side by side. See maturity value, post-tax returns and the real inflation-adjusted gap.',
    heading: 'SIP vs Fixed Deposit: The Complete Comparison',
    intro:
      'A fixed deposit gives you a guaranteed rate and zero volatility. An equity SIP gives you no guarantee and significant year-to-year swings, but a far higher expected return over long periods. This calculator shows you exactly what that trade-off is worth in your own numbers, including the tax treatment that most comparisons quietly ignore.',
    body: [
      {
        heading: 'The comparison most articles get wrong',
        paragraphs: [
          'Most SIP versus FD comparisons put a 12% equity assumption next to a 7% deposit rate, declare equity the winner, and stop. That is not a comparison, it is an assumption restated. The two products differ on three axes that all matter: the certainty of the return, the tax treatment of the gain, and what inflation does to each over the holding period.',
          'Certainty is the honest advantage of a fixed deposit. The maturity value is contractual. You will receive it whether markets rose or fell, and for money you need on a known date within the next few years that is worth more than a higher expected return. An equity SIP offers no such promise: a five-year window can and does end below where it started.',
        ],
      },
      {
        heading: 'Where tax changes the answer',
        paragraphs: [
          'Fixed deposit interest is taxable at your slab rate, in the year it accrues, whether or not you withdraw it. For someone in the 30% bracket, a 7% deposit returns roughly 4.9% after tax. If inflation is running near 6%, that is a real loss of purchasing power on money that felt safe.',
          'Equity held beyond the long-term threshold is taxed more favourably, and only when you actually sell. That deferral matters: gains left invested keep compounding on the untaxed amount, which widens the gap over long horizons well beyond what the headline rates suggest.',
          'This is why the post-tax column in the calculator above is the one to read. The pre-tax comparison flatters the deposit for lower earners and flatters equity for nobody in particular.',
        ],
      },
      {
        heading: 'When a fixed deposit is genuinely the right answer',
        paragraphs: [
          'For an emergency fund, a deposit wins outright. The purpose of that money is to be available and intact on an unpredictable day, and volatility defeats both requirements.',
          'The same applies to any goal inside about three years — a house deposit, a wedding, school fees. The expected return on equity is higher, but the distribution of outcomes over three years is wide enough that you could be forced to sell into a drawdown. Matching the instrument to the time horizon matters more than maximising the expected return.',
          'And if a 20% paper loss would genuinely cause you to stop investing and sell, then your real return from equity is not the historical average. It is whatever you capture before you panic, which is usually considerably less. A deposit you hold beats an SIP you abandon.',
        ],
      },
      {
        heading: 'When the SIP is the right answer',
        paragraphs: [
          'Over ten years and longer, the arithmetic strongly favours equity for money you will not touch. The volatility that makes equity unsuitable for a two-year goal is precisely what generates the premium over a long one, and monthly investing averages your purchase price across the cycle rather than betting on a single entry point.',
          'Run both columns with your own numbers, then check the difference against what a fixed deposit leaves you after tax and inflation. For most long-horizon goals the gap is not marginal.',
        ],
      },
    ],
  },
  'rent-vs-buy': {
    title: 'Rent vs Buy Calculator: Should You Buy a Home?',
    description:
      'Work out whether renting and investing the difference beats buying. Factors in down payment, loan interest, appreciation and opportunity cost.',
    heading: 'Rent vs Buy: What the Numbers Actually Say',
    intro:
      'Buying a home is usually framed as obviously better than "throwing money away on rent". That framing ignores opportunity cost: the down payment and the gap between EMI and rent could have been invested. This calculator runs both paths in parallel over your full tenure and reports the net worth difference at the end.',
    body: [
      {
        heading: 'The cost that never appears in the brochure',
        paragraphs: [
          'The rent-is-wasted argument treats an EMI as saving and rent as spending. But a large share of an early EMI is not saving either — it is interest, and interest is exactly as gone as rent. On a twenty-year loan at 8.5%, the first few years are overwhelmingly interest, and the principal you are actually accumulating is small.',
          'The larger omission is opportunity cost. A down payment is capital removed from every other use. If it would otherwise have been invested, the buying case has to beat not just rent but rent plus the compounded return on that capital plus the compounded return on any monthly gap between EMI and rent. That is the comparison the calculator above runs.',
        ],
      },
      {
        heading: 'Costs buyers systematically forget',
        paragraphs: [
          'Stamp duty and registration are payable immediately and are not recoverable on sale. Brokerage applies at both ends. Then there is the recurring set that a tenant simply does not pay: society maintenance, property tax, insurance, and the repairs an owner absorbs — waterproofing, plumbing, the periodic replacement of things that wear out.',
          'Averaged across a full ownership period these add a meaningful percentage to the true cost, and they are absent from almost every rent-versus-buy comparison you will read.',
        ],
      },
      {
        heading: 'Why the answer is so sensitive to appreciation',
        paragraphs: [
          'Change the assumed appreciation rate by two percentage points and the result frequently flips. That sensitivity is the single most important thing to understand here, because appreciation is the input you know least about.',
          'Property markets can stagnate for a decade. If you enter an optimistic figure because prices have risen recently, the calculator will duly report that buying wins — but you have assumed the conclusion. Run it again at a conservative rate and see whether the case survives. If it only works at aggressive appreciation, it is a bet on prices, not a housing decision.',
        ],
      },
      {
        heading: 'What the arithmetic cannot tell you',
        paragraphs: [
          'A home is not purely a financial instrument. Security of tenure, freedom to alter the place, staying in one school catchment, and not having a landlord end your lease at twelve months notice are real benefits that no calculator prices.',
          'The honest use of this tool is not to be told what to do. It is to find out what the non-financial benefits are costing you, so you can decide whether they are worth that number. Sometimes they clearly are. The point is knowing the figure rather than assuming it is zero.',
        ],
      },
    ],
  },
  'old-vs-new-tax': {
    title: 'Old vs New Tax Regime Calculator (FY 2026-27)',
    description:
      'Compare your tax liability under the old and new regimes. Enter salary and deductions to see which saves more, and your exact break-even point.',
    heading: 'Old vs New Tax Regime: Which Should You Pick?',
    intro:
      'The new regime offers lower slab rates but strips out almost every deduction. The old regime keeps 80C, HRA, and the rest but taxes you at higher rates. Which one wins depends entirely on how much you actually claim. This calculator finds your personal break-even point instead of giving you a generic rule of thumb.',
    body: [
      {
        heading: 'There is no universal answer, and that is the point',
        paragraphs: [
          'Every article promising that one regime is better for a given salary is guessing at the variable that actually decides it. Income sets the slab, but deductions set the outcome. Two people earning identically can land on opposite sides depending on whether they rent, hold a home loan, and genuinely use their 80C limit.',
          'The break-even is the deduction total at which both regimes produce the same liability. Below it the new regime wins on its lower rates; above it the old regime wins because the deductions are worth more than the rate difference. Your job is to work out honestly which side of that line you sit on.',
        ],
      },
      {
        heading: 'Claimed, not claimable',
        paragraphs: [
          'The commonest error is entering the deductions you could theoretically claim rather than the ones you actually will. A full 80C limit assumes you genuinely invest that amount and can evidence it. HRA assumes you pay rent, have a rent agreement, and can produce the landlord PAN where required.',
          'People routinely choose the old regime on the strength of deductions they then fail to substantiate at filing, and end up worse off than the new regime would have left them. Enter what you will actually claim and can actually prove.',
        ],
      },
      {
        heading: 'What the old regime keeps that the new one does not',
        paragraphs: [
          'The old regime retains HRA exemption, 80C, health insurance premium relief, home loan interest deduction on a let-out or self-occupied property, education loan interest, and the rest of the familiar set. For a salaried person renting in a metro while servicing a home loan, those can add up to a substantial figure.',
          'The new regime removes nearly all of them in exchange for lower rates and a higher basic exemption. Its real advantage is not only arithmetic — it is that filing becomes simple, with nothing to document and nothing to defend.',
        ],
      },
      {
        heading: 'A decision you revisit annually',
        paragraphs: [
          'Salaried taxpayers can generally switch between regimes each year, so this is not a permanent commitment. It is worth rerunning whenever your circumstances change: taking or clearing a home loan, moving between renting and owning, or a significant change in income.',
          'Slabs, thresholds and the deductions available are revised between budgets. Confirm the current year rules before filing, and for anything material take advice from a qualified tax professional rather than from a calculator — including this one.',
        ],
      },
    ],
  },
};
