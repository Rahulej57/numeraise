/**
 * Hand-written copy for each calculator category hub.
 *
 * Category pages previously rendered a bare heading and a grid of links with no
 * prose at all, which reads to a search engine as a thin doorway page. Each hub
 * now carries a unique title, description and 150-250 words of body copy so it
 * can rank for its own head term instead of only passing link equity.
 */
export interface CategoryCopy {
  title: string;
  description: string;
  intro: string;
  bodyHeading: string;
  body: string[];
}

export const CATEGORY_INTROS: Record<string, CategoryCopy> = {
  investments: {
    title: 'Investment Calculators: SIP, Lumpsum & CAGR',
    description:
      'Free investment calculators for SIP, lumpsum, CAGR, SWP and mutual fund returns. Every formula is shown, results update instantly, and nothing is stored.',
    intro:
      'Ten calculators for projecting what your money becomes. Model a monthly SIP, a one-time lumpsum, a systematic withdrawal, or the compound growth rate you actually earned.',
    bodyHeading: 'How to use these investment calculators together',
    body: [
      'Most people start with the SIP calculator because a monthly investment is the easiest habit to build. Enter what you can genuinely spare each month, an expected return you would defend to a sceptic, and the number of years you will leave it alone. The output separates the money you contributed from the money compounding produced — and over long horizons the second number becomes the larger one.',
      'If you have a windfall rather than a monthly surplus, run the lumpsum calculator alongside it. Comparing the two makes the trade-off concrete: a lumpsum has more time in the market, while a SIP averages your purchase price across market cycles. Neither dominates in every scenario, which is exactly why seeing both sets of numbers matters more than a rule of thumb.',
      'Once you already hold investments, the CAGR calculator tells you the truth about them. A fund that returned 40% one year and lost 20% the next did not average 10% — it compounded to roughly 5.8%. Annualising your real returns is usually more sobering, and more useful, than the headline figures in a fund factsheet.',
      'Every calculator here shows the underlying formula and runs entirely in your browser. Nothing you type is transmitted or stored.',
    ],
  },
  loans: {
    title: 'Loan & EMI Calculators: Home, Car & Personal',
    description:
      'Calculate EMI, total interest and full amortisation schedules for home, car, personal and education loans. Compare prepayment and refinancing scenarios instantly.',
    intro:
      'Ten calculators covering every stage of borrowing — working out an affordable EMI, seeing the true interest cost, and testing whether prepaying or refinancing is worth it.',
    bodyHeading: 'The number lenders show you is not the number that matters',
    body: [
      'A lender quotes the EMI because it is the smallest, friendliest figure available. The number that determines whether a loan is a good idea is total interest paid over the full tenure. On a 20-year home loan at 8.5%, you typically repay well over 1.9× the amount borrowed. Stretching the tenure to reduce the monthly EMI is not free — it is the single most expensive thing most borrowers do without noticing.',
      'The amortisation schedule is where this becomes visible. In the early years the overwhelming majority of each payment services interest, not principal. That is why a prepayment made in year three is worth several times the same rupee or dollar paid in year fifteen. Run the prepayment calculator before you decide what to do with a bonus.',
      'If you are already servicing a loan, the refinance calculator answers a narrower but valuable question: does the interest saved from a lower rate exceed the processing fee, legal cost and paperwork of switching? Sometimes it clearly does. Often the break-even sits further out than the marketing suggests.',
      'For anyone comparing offers, the flat vs reducing balance calculator is essential. A "flat 7%" and a "reducing 7%" are not the same loan, and the gap is far wider than most borrowers expect.',
    ],
  },
  savings: {
    title: 'Savings Calculators: FD, RD, PPF & EPF',
    description:
      'Calculate maturity value and interest for fixed deposits, recurring deposits, PPF, EPF, NSC, SCSS and Sukanya Samriddhi with current scheme rules.',
    intro:
      'Eight calculators for guaranteed-return instruments — fixed and recurring deposits plus the government-backed small savings schemes.',
    bodyHeading: 'Guaranteed returns still need to clear inflation',
    body: [
      'The appeal of a fixed deposit or a small savings scheme is that the return is contractual. You know the maturity value on day one. That certainty is genuinely valuable for money you will need within a few years, for an emergency fund, or for anyone who cannot tolerate a drawdown.',
      'The complication is that the headline rate is a nominal rate. If a deposit pays 7% while inflation runs at 6%, your purchasing power grows by roughly 1% a year, not 7%. Then tax applies to the full 7%. For a taxpayer in a higher bracket, an ordinary fixed deposit can post a negative real return while appearing to earn money.',
      'This is why tax treatment deserves as much attention as the interest rate. PPF is exempt at contribution, accumulation and withdrawal — its effective post-tax return substantially exceeds a fixed deposit paying the same nominal rate. EPF and Sukanya Samriddhi carry similar advantages within their own eligibility rules.',
      'Use these calculators to compare instruments on maturity value, then check the tax rules for each before committing. The scheme with the highest advertised rate is frequently not the one that leaves you with the most money.',
    ],
  },
  taxes: {
    title: 'Tax Calculators: Income Tax, GST & HRA',
    description:
      'Calculate income tax under old and new regimes, GST, VAT, sales tax, HRA exemption, capital gains and TDS. Slab-by-slab breakdowns, not just a final figure.',
    intro:
      'Nine calculators for working out what you actually owe — income tax across both regimes, indirect taxes, and the exemptions most people under-claim.',
    bodyHeading: 'Where most people lose money on tax',
    body: [
      'The old versus new regime decision is the largest single tax choice available to most salaried people, and it cannot be answered with a general rule. The new regime offers lower slab rates but removes nearly every deduction. The old regime keeps 80C, HRA, home loan interest and the rest, at higher rates. Which one wins depends entirely on how much you genuinely claim — not how much you could theoretically claim.',
      'HRA exemption is the most commonly miscalculated item. It is not simply the allowance shown on your payslip. It is the lowest of three values: actual HRA received, rent paid minus 10% of salary, and a percentage of salary that varies by city. Most people assume the first figure applies and over-report their exemption.',
      'Capital gains is where holding periods matter more than amounts. The same profit taxed as short-term versus long-term can differ by a wide margin, and the qualifying period differs by asset class. Selling a few weeks before a threshold is a costly and entirely avoidable mistake.',
      'These calculators show the slab-by-slab computation rather than only a final number, so you can see exactly which portion of income is taxed at which rate. For a filing decision with real money at stake, confirm the current year rules with a qualified tax professional — slabs and thresholds change between budgets.',
    ],
  },
  insurance: {
    title: 'Insurance Calculators: Term Cover & HLV',
    description:
      'Work out how much life cover you actually need using the human life value and income replacement methods, plus health insurance and premium estimators.',
    intro:
      'Calculators for sizing life and health cover — replacing guesswork with a defensible number based on your income, dependants and liabilities.',
    bodyHeading: 'Cover is either enough or it is decoration',
    body: [
      'Underinsurance is the most common and most consequential mistake in personal finance. A policy sized at two or three times annual income feels responsible and is close to useless: it covers a funeral and perhaps a year of expenses, then leaves dependants exactly where they would have been.',
      'The human life value method starts from the right question — how much capital would need to be invested to replace this income for the remaining working years, after inflation. For most earners with dependants the answer lands somewhere between ten and twenty times annual income, plus outstanding liabilities, minus existing assets.',
      'Term insurance is the instrument for this because it is pure cover with no investment component, which makes large sums affordable. Endowment and money-back policies bundle insurance with investment and deliver both poorly — the cover is small and the returns typically trail simple alternatives.',
      'On health cover, the number that matters is not the premium but whether the sum insured survives a single serious hospitalisation in a private hospital in your city. Costs have risen faster than most people have revised their policies.',
      'These tools produce a starting figure. Your actual requirement depends on circumstances a calculator cannot see, so treat the output as the beginning of a conversation with a licensed advisor rather than the end of one.',
    ],
  },
  retirement: {
    title: 'Retirement Calculators: NPS, FIRE & Pension',
    description:
      'Calculate the retirement corpus you need, model NPS and pension outcomes, and find your financial independence number with inflation factored in.',
    intro:
      'Calculators for the longest-horizon problem in personal finance — how much you need, how long it lasts, and when you could stop working.',
    bodyHeading: 'The two variables that decide everything',
    body: [
      'Retirement planning has more inputs than any other calculation here, but two dominate the outcome: how early you start, and what inflation does to your expenses along the way.',
      'Starting early matters more than contributing heavily. Someone investing a modest amount from age 25 routinely ends with a larger corpus than someone investing far more from age 40, because the first person has fifteen extra years of compounding on every contribution. Those early years feel insignificant while you are living them and turn out to be the most valuable ones.',
      'Inflation is what makes retirement numbers counterintuitive. A monthly expense of 50,000 today becomes roughly 160,000 in 20 years at 6% inflation. Any calculation that ignores this — and many rules of thumb do — will understate the required corpus by a factor that is not recoverable once you notice.',
      'The FIRE calculator approaches the same problem from the withdrawal side, asking what corpus supports your spending indefinitely. The commonly cited 4% rule derives from a specific US historical dataset and is a reasonable starting point rather than a law of nature. Test your plan against a more conservative withdrawal rate before you rely on it.',
    ],
  },
  business: {
    title: 'Business Calculators: Break-Even & Margin',
    description:
      'Calculate break-even volume, EBITDA, gross margin, markup and ROI for your business. Clear formulas for pricing and profitability decisions.',
    intro:
      'Calculators for the numbers that decide whether a business is viable — break-even volume, operating profitability, and the margin versus markup distinction that trips up most pricing.',
    bodyHeading: 'Margin and markup are not the same number',
    body: [
      'This single confusion destroys more small-business pricing than any other error. A 50% markup is a 33% margin. A 100% markup is a 50% margin. If you set prices believing you are earning a 50% margin when you are actually earning 33%, every unit sold carries less profit than your projections assume — and the gap widens with volume.',
      'Break-even analysis answers the prior question: how many units must you sell before fixed costs are covered and additional sales become profit. The instructive part is usually how sensitive the answer is to price. A 10% price increase often reduces the break-even volume far more than a 10% cost reduction, which is why pricing power matters more than efficiency for most early-stage businesses.',
      'EBITDA strips out financing and accounting decisions to show operating performance, which makes it useful for comparing businesses with different capital structures. It is not a cash flow measure, and treating it as one is a well-documented way to run out of money while reporting a profit.',
      'Use these calculators to pressure-test assumptions before committing to a price list or a growth plan.',
    ],
  },
  'real-estate': {
    title: 'Property Calculators: Rent vs Buy & Yield',
    description:
      'Compare renting against buying, calculate rental yield and stamp duty, and see the full cost of property ownership including opportunity cost.',
    intro:
      'Calculators for the largest transaction most people ever make — including the opportunity cost that property comparisons routinely omit.',
    bodyHeading: 'The cost that never appears in the brochure',
    body: [
      'Buying is usually framed as obviously superior to "throwing money away on rent". That framing omits the largest cost in the comparison: the opportunity cost of the down payment, plus the gap between the EMI and the equivalent rent, both of which could have been invested elsewhere.',
      'A complete comparison also has to include the costs that do not appear in the sale price — stamp duty and registration, brokerage, maintenance, property tax, and the repairs an owner absorbs and a tenant does not. Across a full ownership period these routinely add a substantial fraction to the headline number.',
      'Rental yield is the metric to check before treating property as an investment rather than a home. Gross yield is annual rent divided by property value; net yield subtracts maintenance, tax and vacancy. In many major cities net rental yields sit well below what low-risk fixed income pays, which means the investment case rests almost entirely on price appreciation — a considerably less certain proposition than rent.',
      'None of this argues against buying. A home you intend to live in for decades is as much a lifestyle decision as a financial one. It argues for making that decision with the full arithmetic visible.',
    ],
  },
  crypto: {
    title: 'Crypto & Forex Calculators: Profit & Pips',
    description:
      'Calculate crypto profit and loss, forex pip value and live currency conversions. Position sizing and P&L maths without the noise.',
    intro:
      'Calculators for digital assets and currency markets — position sizing, pip value and realised profit and loss.',
    bodyHeading: 'Position sizing is the only part you control',
    body: [
      'You cannot control what a market does next. You can control how much of your capital is exposed to it. That makes position sizing the single most important calculation in speculative trading, and the one most frequently skipped.',
      'Pip value in forex depends on lot size, the pair being traded and your account currency. Getting it wrong means your actual risk per trade diverges from your intended risk — sometimes by a multiple. Calculate it before entering, not after a loss.',
      'For crypto profit and loss, the figure that matters is post-fee and post-tax. Trading fees on each leg plus withdrawal charges quietly consume a meaningful share of a small gain, and in most jurisdictions crypto disposals are taxable events whether or not you converted back to a traditional currency.',
      'A note worth stating plainly: these are volatile, largely unregulated markets in which losses can exceed expectations quickly. These calculators help you understand the arithmetic of a position. They are not a signal, a recommendation, or a prediction, and nothing here constitutes investment advice.',
    ],
  },
  health: {
    title: 'Health Calculators: BMI, BMR & Body Fat',
    description:
      'Calculate BMI, BMR, daily calorie needs, body fat percentage and pregnancy due date using standard clinical formulas.',
    intro:
      'Health and fitness calculators using standard clinical formulas — body composition, metabolic rate and pregnancy dating.',
    bodyHeading: 'What these numbers can and cannot tell you',
    body: [
      'BMI is a population-level screening tool, not an individual diagnosis. It uses only height and weight, so it cannot distinguish muscle from fat. A well-trained athlete frequently registers as overweight or obese by BMI while carrying very low body fat. Treat it as one rough input among several, not a verdict.',
      'BMR estimates the energy your body uses at complete rest. Multiplying it by an activity factor gives approximate daily calorie needs. The formulas here (Mifflin-St Jeor and Harris-Benedict) are the standard clinical equations, but individual metabolic rates vary meaningfully around the estimate, so use the output as a starting point and adjust based on what actually happens over several weeks.',
      'Pregnancy due date calculation uses Naegele\'s rule, counting 280 days from the first day of the last menstrual period. It assumes a regular 28-day cycle, and only a small minority of births occur precisely on the estimated date — most arrive within a two-week window either side. An ultrasound dating scan is considerably more accurate.',
      'These tools are for general information only. They are not a medical device and do not replace advice from a qualified healthcare professional, particularly for any decision involving pregnancy, a medical condition, or a significant change in diet or exercise.',
    ],
  },
  utility: {
    title: 'Everyday Calculators: Percentage, Tip & Age',
    description:
      'Fast everyday calculators for percentages, discounts, tips, age, date differences and unit conversion. No signup, works on mobile.',
    intro:
      'Quick calculators for everyday arithmetic — percentages, discounts, tips, dates and unit conversions.',
    bodyHeading: 'Small calculations, frequently done wrong',
    body: [
      'Percentage change is the most commonly reversed calculation in everyday use. A price that rises 20% and then falls 20% does not return to where it started — it ends about 4% lower, because the second percentage applies to a larger base. The same asymmetry explains why a 50% investment loss requires a 100% gain to recover.',
      'Stacked discounts work the same way. "30% off, then an extra 20% off" is not 50% off. It is 44% off, because the second reduction applies to the already-discounted price. Retailers rely on the intuition being wrong in their favour.',
      'Date arithmetic is less obvious than it looks once leap years and varying month lengths are involved. The age and date calculators here handle both correctly rather than approximating a year as 365 days.',
      'Each of these runs instantly in your browser with no signup and works on mobile, which is usually where you need them.',
    ],
  },
};
