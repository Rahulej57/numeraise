/**
 * Per-calculator search metadata.
 *
 * Replaces the generated boilerplate that produced a near-identical description
 * on 69 of 74 calculators:
 *   "Use our free {X} to estimate, calculate, and analyze details. {desc}
 *    Plan smarter and manage your money better with Numeraise."
 *
 * Rules used here:
 *  - `title` is bare. The root layout appends " | Numeraise" via its title
 *    template, so keep titles at or under ~48 characters to stay inside the
 *    ~60-character SERP window.
 *  - `description` is 140-160 characters, unique, and leads with what the tool
 *    does rather than with brand copy.
 *  - `keywords` carries genuine query variants, not stuffing.
 */
export interface CalculatorSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const CALCULATOR_SEO: Record<string, CalculatorSeo> = {
  // ---------------------------------------------------------------- investments
  'sip-calculator': {
    title: 'SIP Calculator: Mutual Fund Return Estimator',
    description:
      'Calculate SIP returns with year-by-year growth charts and a full contribution schedule. See exactly how much of your corpus is compounding versus deposits.',
    keywords: ['sip calculator', 'mutual fund sip returns', 'systematic investment plan calculator', 'sip return calculator'],
  },
  'sip-vs-lumpsum': {
    title: 'SIP vs Lumpsum Calculator',
    description:
      'Compare a monthly SIP against a one-time lumpsum on identical assumptions. See which strategy produces more wealth over your chosen horizon and why.',
    keywords: ['sip vs lumpsum', 'lumpsum or sip', 'sip vs one time investment', 'rupee cost averaging'],
  },
  'lumpsum-calculator': {
    title: 'Lumpsum Investment Calculator',
    description:
      'Project the future value of a one-time investment with annual compounding. Enter amount, expected return and tenure to see the full growth trajectory.',
    keywords: ['lumpsum calculator', 'one time investment calculator', 'compound interest calculator', 'future value calculator'],
  },
  'cagr-calculator': {
    title: 'CAGR Calculator: Annual Growth Rate',
    description:
      'Calculate the compound annual growth rate between any two values. CAGR smooths volatile year-to-year returns into the single rate that actually compounded.',
    keywords: ['cagr calculator', 'compound annual growth rate', 'annualised return calculator', 'investment growth rate'],
  },
  'swp-calculator': {
    title: 'SWP Calculator: Systematic Withdrawal',
    description:
      'Model a systematic withdrawal plan and find out how long your corpus lasts. See the balance remaining after each withdrawal at your expected return rate.',
    keywords: ['swp calculator', 'systematic withdrawal plan', 'monthly income from mutual fund', 'corpus depletion calculator'],
  },
  'mutual-fund-returns': {
    title: 'Mutual Fund Returns Calculator',
    description:
      'Work out absolute and annualised returns on a mutual fund holding. Compare what you invested against current value with a clear CAGR breakdown.',
    keywords: ['mutual fund returns calculator', 'mutual fund return', 'absolute vs annualised return', 'fund performance calculator'],
  },
  'step-up-sip': {
    title: 'Step-Up SIP Calculator',
    description:
      'See what happens when you raise your SIP by a fixed percentage each year. A 10% annual step-up often adds more to the final corpus than a higher return rate.',
    keywords: ['step up sip calculator', 'top up sip', 'increasing sip calculator', 'annual sip increment'],
  },
  'stock-profit': {
    title: 'Stock Profit & Loss Calculator',
    description:
      'Calculate net profit or loss on an equity trade after brokerage and charges. Enter buy price, sell price and quantity to see your real return percentage.',
    keywords: ['stock profit calculator', 'share profit loss calculator', 'equity return calculator', 'trading profit calculator'],
  },
  'net-worth-calculator': {
    title: 'Net Worth Calculator',
    description:
      'Add up assets, subtract liabilities and get a clear picture of your financial position. The single number that tracks progress better than income does.',
    keywords: ['net worth calculator', 'personal net worth', 'assets minus liabilities', 'wealth calculator'],
  },
  'dividend-yield': {
    title: 'Dividend Yield Calculator',
    description:
      'Calculate dividend yield from share price and annual payout, plus yield on cost for holdings you already own. Useful for comparing income stocks.',
    keywords: ['dividend yield calculator', 'yield on cost', 'dividend income calculator', 'stock dividend return'],
  },

  // ---------------------------------------------------------------------- loans
  'emi-calculator': {
    title: 'EMI Calculator with Amortisation Schedule',
    description:
      'Calculate your loan EMI and see the full amortisation schedule. Shows how much of each payment services interest versus principal, month by month.',
    keywords: ['emi calculator', 'loan emi calculator', 'amortisation schedule', 'monthly installment calculator'],
  },
  'home-loan-calculator': {
    title: 'Home Loan EMI Calculator',
    description:
      'Calculate home loan EMI, total interest payable and the complete repayment schedule. See the true multiple of the borrowed amount you will repay.',
    keywords: ['home loan emi calculator', 'housing loan calculator', 'mortgage emi', 'home loan interest calculator'],
  },
  'car-loan-emi': {
    title: 'Car Loan EMI Calculator',
    description:
      'Work out monthly payments on a vehicle loan including total interest cost. Compare tenures to see what stretching the loan actually costs you.',
    keywords: ['car loan emi calculator', 'auto loan calculator', 'vehicle finance calculator', 'car loan interest'],
  },
  'personal-loan-calculator': {
    title: 'Personal Loan EMI Calculator',
    description:
      'Calculate EMI and total interest on an unsecured personal loan. Because rates run high, the total cost is usually far larger than borrowers expect.',
    keywords: ['personal loan emi calculator', 'unsecured loan calculator', 'personal loan interest', 'loan repayment calculator'],
  },
  'education-loan-calculator': {
    title: 'Education Loan EMI Calculator',
    description:
      'Plan student loan repayment including the moratorium period. See how interest accruing during study inflates the balance before repayment even begins.',
    keywords: ['education loan calculator', 'student loan emi', 'study loan repayment', 'education loan moratorium'],
  },
  'home-loan-prepayment': {
    title: 'Home Loan Prepayment Calculator',
    description:
      'See how much interest a lump sum prepayment saves and how many months it removes from your tenure. Early prepayments are worth several times later ones.',
    keywords: ['home loan prepayment calculator', 'loan part payment', 'prepayment interest saving', 'reduce loan tenure'],
  },
  'loan-refinance': {
    title: 'Loan Refinance & Balance Transfer',
    description:
      'Check whether switching lenders is worth it. Compares interest saved against processing fees and legal costs to find your real break-even month.',
    keywords: ['loan refinance calculator', 'balance transfer calculator', 'home loan transfer savings', 'refinance break even'],
  },
  'credit-card-payoff': {
    title: 'Credit Card Payoff Calculator',
    description:
      'Find out how long clearing a card balance takes and what it costs. At typical card rates, minimum payments can stretch a balance out for over a decade.',
    keywords: ['credit card payoff calculator', 'credit card interest calculator', 'minimum payment trap', 'debt payoff calculator'],
  },
  'flat-vs-reducing-loan': {
    title: 'Flat vs Reducing Balance Interest',
    description:
      'A flat 7% and a reducing-balance 7% are not the same loan. Compare both methods side by side and see the effective rate you are genuinely being charged.',
    keywords: ['flat vs reducing interest', 'flat rate vs reducing balance', 'effective interest rate', 'loan interest comparison'],
  },
  'lease-vs-buy': {
    title: 'Lease vs Buy a Car Calculator',
    description:
      'Compare leasing against buying over the same period, including depreciation, resale value and the opportunity cost of the down payment.',
    keywords: ['lease vs buy calculator', 'car lease or buy', 'vehicle lease comparison', 'car ownership cost'],
  },

  // -------------------------------------------------------------------- savings
  'fd-calculator': {
    title: 'FD Calculator: Fixed Deposit Maturity',
    description:
      'Calculate fixed deposit maturity value at any compounding frequency, plus the post-tax return that determines what you actually keep.',
    keywords: ['fd calculator', 'fixed deposit calculator', 'fd maturity value', 'fd interest calculator'],
  },
  'rd-calculator': {
    title: 'RD Calculator: Recurring Deposit',
    description:
      'Work out recurring deposit maturity value and total interest earned. Each monthly instalment compounds for a different period, which this accounts for.',
    keywords: ['rd calculator', 'recurring deposit calculator', 'rd maturity amount', 'monthly deposit interest'],
  },
  'ppf-calculator': {
    title: 'PPF Calculator: Maturity & Interest',
    description:
      'Calculate PPF maturity over the 15-year lock-in with yearly balance breakdown. Includes the before-the-5th deposit rule that affects your interest.',
    keywords: ['ppf calculator', 'public provident fund calculator', 'ppf maturity amount', 'ppf interest calculator'],
  },
  'epf-calculator': {
    title: 'EPF Calculator: Provident Fund Balance',
    description:
      'Project your EPF corpus at retirement from current balance, salary and expected increments. Includes both employee and employer contribution shares.',
    keywords: ['epf calculator', 'provident fund calculator', 'pf balance projection', 'epf maturity calculator'],
  },
  'pomis-calculator': {
    title: 'Post Office MIS Calculator',
    description:
      'Calculate monthly income from a Post Office Monthly Income Scheme deposit, including the total interest earned across the five-year term.',
    keywords: ['post office mis calculator', 'pomis calculator', 'monthly income scheme', 'post office monthly income'],
  },
  'scss-calculator': {
    title: 'SCSS Calculator: Senior Citizen Savings',
    description:
      'Calculate quarterly payouts and total interest from the Senior Citizen Savings Scheme over its five-year term, with the current deposit ceiling applied.',
    keywords: ['scss calculator', 'senior citizen savings scheme', 'scss interest calculator', 'quarterly payout calculator'],
  },
  'ssy-calculator': {
    title: 'Sukanya Samriddhi (SSY) Calculator',
    description:
      'Calculate SSY maturity value for a girl child, accounting for the 15-year contribution window and 21-year maturity that most calculators get wrong.',
    keywords: ['sukanya samriddhi calculator', 'ssy calculator', 'girl child savings scheme', 'ssy maturity amount'],
  },
  'nsc-calculator': {
    title: 'NSC Calculator: National Savings Certificate',
    description:
      'Calculate National Savings Certificate maturity value with annual compounding, plus the reinvested-interest deduction available in the early years.',
    keywords: ['nsc calculator', 'national savings certificate', 'nsc maturity value', 'nsc interest calculator'],
  },

  // ----------------------------------------------------------------------- tax
  'income-tax-calculator': {
    title: 'Income Tax Calculator: Old vs New Regime',
    description:
      'Compare your tax liability under both regimes with a slab-by-slab breakdown, and find the exact deduction amount at which the old regime starts winning.',
    keywords: ['income tax calculator', 'old vs new tax regime', 'tax slab calculator', 'income tax comparison'],
  },
  'paycheck-calculator': {
    title: 'Paycheck Calculator: Take-Home Pay',
    description:
      'Convert gross salary into actual take-home pay after tax and deductions. Shows the full gap between your CTC and what reaches your bank account.',
    keywords: ['paycheck calculator', 'take home salary calculator', 'net pay calculator', 'in hand salary calculator'],
  },
  'gst-calculator': {
    title: 'GST Calculator: Add or Remove GST',
    description:
      'Calculate GST both ways: add tax to a base price, or extract the tax already included in a total. Supports all standard slabs with CGST and SGST split.',
    keywords: ['gst calculator', 'gst inclusive exclusive', 'reverse gst calculator', 'cgst sgst calculator'],
  },
  'sales-tax-calculator': {
    title: 'Sales Tax Calculator',
    description:
      'Add sales tax to a price, or work backwards from a tax-inclusive total to find the pre-tax amount. Works with any state or local rate you enter.',
    keywords: ['sales tax calculator', 'reverse sales tax', 'tax inclusive price', 'sales tax rate calculator'],
  },
  'vat-calculator': {
    title: 'VAT Calculator: Add or Remove VAT',
    description:
      'Calculate VAT in both directions — add it to a net figure or strip it out of a gross figure — at any rate, with the tax amount shown separately.',
    keywords: ['vat calculator', 'remove vat', 'add vat calculator', 'vat inclusive calculator'],
  },
  'hra-exemption': {
    title: 'HRA Exemption Calculator',
    description:
      'HRA exemption is the lowest of three formulas, not the allowance on your payslip. This calculates all three and shows which one caps your claim.',
    keywords: ['hra exemption calculator', 'house rent allowance', 'hra tax exemption', 'hra calculation formula'],
  },
  'capital-gains-tax': {
    title: 'Capital Gains Tax Calculator',
    description:
      'Calculate short and long-term capital gains tax on equity, property and debt. Holding period changes the rate substantially, so timing matters.',
    keywords: ['capital gains tax calculator', 'stcg ltcg calculator', 'long term capital gains', 'capital gains on property'],
  },
  'tds-calculator': {
    title: 'TDS Calculator',
    description:
      'Estimate tax deducted at source across common payment types and threshold limits, so you know what to expect before it hits your account.',
    keywords: ['tds calculator', 'tax deducted at source', 'tds rate calculator', 'tds threshold limit'],
  },
  'advance-tax': {
    title: 'Advance Tax Calculator & Due Dates',
    description:
      'Work out advance tax instalments and the quarterly due dates. Missing an instalment triggers interest, so this shows what is owed and when.',
    keywords: ['advance tax calculator', 'advance tax due dates', 'quarterly tax instalment', 'advance tax interest'],
  },

  // ------------------------------------------------------------------ insurance
  'term-insurance-calculator': {
    title: 'Term Insurance Cover Calculator',
    description:
      'Work out how much term life cover your dependants would genuinely need, based on income replacement, outstanding liabilities and existing assets.',
    keywords: ['term insurance calculator', 'life cover calculator', 'how much term insurance', 'term plan cover amount'],
  },
  'health-insurance-calculator': {
    title: 'Health Insurance Cover Calculator',
    description:
      'Estimate the health cover your family needs based on city, age and typical hospitalisation costs, rather than defaulting to the cheapest policy.',
    keywords: ['health insurance calculator', 'medical cover calculator', 'health insurance sum insured', 'family floater cover'],
  },
  'life-insurance-premium': {
    title: 'Life Insurance Premium Calculator',
    description:
      'Estimate premiums for endowment and ULIP policies, and see the implied return once the insurance component is separated from the investment.',
    keywords: ['life insurance premium calculator', 'endowment policy calculator', 'ulip returns', 'insurance premium estimate'],
  },
  'human-life-value': {
    title: 'Human Life Value (HLV) Calculator',
    description:
      'The HLV method sizes life cover from the capital needed to replace your income for the remaining working years, adjusted for inflation.',
    keywords: ['human life value calculator', 'hlv calculator', 'income replacement method', 'life insurance need analysis'],
  },

  // ----------------------------------------------------------------- retirement
  'retirement-calculator': {
    title: 'Retirement Corpus Calculator',
    description:
      'Find the corpus you need to retire, with inflation applied to your current expenses. A 50,000 monthly spend today needs roughly triple that in 20 years.',
    keywords: ['retirement calculator', 'retirement corpus calculator', 'retirement planning calculator', 'how much to retire'],
  },
  'fire-calculator': {
    title: 'FIRE Calculator: Retire Early',
    description:
      'Calculate your financial independence number and the years remaining to reach it. Test it against a conservative withdrawal rate before you rely on it.',
    keywords: ['fire calculator', 'financial independence calculator', 'retire early calculator', '4 percent rule calculator'],
  },
  '401k-calculator': {
    title: '401(k) Calculator with Employer Match',
    description:
      'Project your 401(k) balance at retirement including employer matching and annual contribution limits. The match is the highest-return money available to you.',
    keywords: ['401k calculator', '401k employer match', 'retirement savings calculator', '401k growth projection'],
  },
  'nps-calculator': {
    title: 'NPS Calculator: Pension & Corpus',
    description:
      'Project your National Pension System corpus at 60, including the mandatory annuity portion and the lump sum you are allowed to withdraw.',
    keywords: ['nps calculator', 'national pension system calculator', 'nps corpus calculator', 'nps annuity calculator'],
  },
  'gratuity-calculator': {
    title: 'Gratuity Calculator',
    description:
      'Calculate the gratuity payable on leaving a job after five or more years of service, using last drawn salary and the statutory formula.',
    keywords: ['gratuity calculator', 'gratuity formula', 'gratuity eligibility', 'gratuity amount calculation'],
  },
  'pension-calculator': {
    title: 'Pension Calculator: Monthly Payout',
    description:
      'Convert a retirement corpus into a sustainable monthly pension, or work backwards from the income you want to the corpus required to fund it.',
    keywords: ['pension calculator', 'monthly pension estimator', 'annuity calculator', 'retirement income calculator'],
  },

  // ------------------------------------------------------------------- business
  'inflation-calculator': {
    title: 'Inflation Calculator: Future Value',
    description:
      'See what a sum of money will be worth after inflation, or what a past amount is worth today. The quiet cost that erodes every un-invested balance.',
    keywords: ['inflation calculator', 'future value of money', 'purchasing power calculator', 'inflation adjusted value'],
  },
  'margin-calculator': {
    title: 'Profit Margin Calculator',
    description:
      'Calculate gross and net profit margin from cost and revenue. Margin is not markup — a 50% markup is only a 33% margin, and the gap compounds with volume.',
    keywords: ['profit margin calculator', 'gross margin calculator', 'net margin', 'margin vs markup'],
  },
  'markup-calculator': {
    title: 'Markup Calculator',
    description:
      'Set a selling price from cost and target markup, with the resulting margin shown alongside so you can see both numbers before committing to a price list.',
    keywords: ['markup calculator', 'cost plus pricing', 'markup vs margin', 'selling price calculator'],
  },
  'break-even-calculator': {
    title: 'Break-Even Point Calculator',
    description:
      'Find the sales volume at which fixed costs are covered and profit begins. Test how much more a price rise moves break-even than a cost cut does.',
    keywords: ['break even calculator', 'break even point', 'break even analysis', 'fixed cost coverage'],
  },
  'roi-calculator': {
    title: 'ROI Calculator: Return on Investment',
    description:
      'Calculate return on investment as both a total percentage and an annualised rate, so projects of different durations can be compared fairly.',
    keywords: ['roi calculator', 'return on investment calculator', 'annualised roi', 'project return calculator'],
  },
  'discount-calculator': {
    title: 'Discount Calculator: Sale Price',
    description:
      'Calculate the final price after one or more discounts. Stacked discounts do not add — 30% then 20% off is 44% off, not 50%, because of the shrinking base.',
    keywords: ['discount calculator', 'sale price calculator', 'stacked discount', 'percentage off calculator'],
  },
  'ebitda-calculator': {
    title: 'EBITDA Calculator & Margin',
    description:
      'Calculate EBITDA and EBITDA margin from your income statement to compare operating performance across businesses with different capital structures.',
    keywords: ['ebitda calculator', 'ebitda margin', 'operating profit calculator', 'ebitda formula'],
  },

  // ---------------------------------------------------------------- real estate
  'rent-vs-buy': {
    title: 'Rent vs Buy Calculator',
    description:
      'Compare renting and investing the difference against buying, including down payment opportunity cost, stamp duty, maintenance and property appreciation.',
    keywords: ['rent vs buy calculator', 'should i buy a house', 'renting vs buying comparison', 'home buying decision'],
  },
  'us-mortgage-calculator': {
    title: 'Mortgage Calculator with PITI & PMI',
    description:
      'Calculate a US mortgage payment including principal, interest, taxes, insurance and PMI, with the full amortisation schedule over the loan term.',
    keywords: ['mortgage calculator', 'piti calculator', 'pmi calculator', 'us home loan calculator'],
  },
  'rental-yield': {
    title: 'Rental Yield Calculator',
    description:
      'Calculate gross and net rental yield on a property after maintenance, tax and vacancy. Net yield is often well below low-risk fixed income returns.',
    keywords: ['rental yield calculator', 'gross vs net yield', 'property rental return', 'buy to let yield'],
  },
  'stamp-duty': {
    title: 'Stamp Duty Calculator',
    description:
      'Estimate stamp duty and registration charges on a property purchase — the substantial upfront cost that rarely appears in the advertised price.',
    keywords: ['stamp duty calculator', 'property registration charges', 'stamp duty rates', 'property purchase cost'],
  },

  // --------------------------------------------------------------- crypto/forex
  'crypto-profit': {
    title: 'Crypto Profit Calculator',
    description:
      'Calculate profit or loss on a cryptocurrency trade after exchange fees. Shows the post-fee figure, which is what a taxable disposal is actually measured on.',
    keywords: ['crypto profit calculator', 'bitcoin profit calculator', 'crypto gains calculator', 'crypto trading fees'],
  },
  'forex-pip': {
    title: 'Forex Pip Value Calculator',
    description:
      'Calculate pip value for any currency pair, lot size and account currency, so your risk per trade matches what you actually intended to risk.',
    keywords: ['pip value calculator', 'forex pip calculator', 'lot size calculator', 'forex position sizing'],
  },

  // -------------------------------------------------------------------- health
  'bmi-calculator': {
    title: 'BMI Calculator: Body Mass Index',
    description:
      'Calculate body mass index from height and weight, with the standard categories. BMI is a population screening tool and cannot distinguish muscle from fat.',
    keywords: ['bmi calculator', 'body mass index', 'bmi chart', 'healthy weight calculator'],
  },
  'bmr-calculator': {
    title: 'BMR & TDEE Calculator',
    description:
      'Calculate basal metabolic rate and total daily energy expenditure using the Mifflin-St Jeor equation, with calorie targets for each activity level.',
    keywords: ['bmr calculator', 'tdee calculator', 'daily calorie needs', 'mifflin st jeor equation'],
  },
  'body-fat-calculator': {
    title: 'Body Fat Percentage Calculator',
    description:
      'Estimate body fat percentage using the US Navy circumference method, with healthy ranges by age and sex. More informative than BMI alone.',
    keywords: ['body fat calculator', 'body fat percentage', 'navy body fat formula', 'lean body mass calculator'],
  },
  'pregnancy-due-date': {
    title: 'Pregnancy Due Date Calculator',
    description:
      "Estimate your due date using Naegele's rule from your last period, with trimester dates. Most births land within two weeks either side of the estimate.",
    keywords: ['pregnancy due date calculator', 'due date estimator', 'conception date calculator', 'gestational age calculator'],
  },

  // ------------------------------------------------------------------- utility
  'percentage-calculator': {
    title: 'Percentage Calculator',
    description:
      'Calculate percentages, percentage change and reverse percentages. A 20% rise followed by a 20% fall does not return you to where you started.',
    keywords: ['percentage calculator', 'percentage change calculator', 'percent increase decrease', 'reverse percentage'],
  },
  'age-calculator': {
    title: 'Age Calculator: Years, Months, Days',
    description:
      'Calculate exact age in years, months and days between any two dates, handling leap years and varying month lengths correctly rather than approximating.',
    keywords: ['age calculator', 'date of birth calculator', 'exact age calculator', 'how old am i'],
  },
  'date-time-calculator': {
    title: 'Date Duration Calculator',
    description:
      'Calculate the exact duration between two dates, or add and subtract days, weeks and months from a date, with leap years handled properly.',
    keywords: ['date calculator', 'days between dates', 'date duration calculator', 'add days to date'],
  },
  'basic-calculator': {
    title: 'Online Calculator: Free & Fast',
    description:
      'A clean online calculator for everyday arithmetic with full keyboard support. No signup, no ads blocking the buttons, works offline once loaded.',
    keywords: ['online calculator', 'free calculator', 'simple calculator', 'basic calculator online'],
  },
  'measurement-calculator': {
    title: 'Unit Converter: Length, Weight, Volume',
    description:
      'Convert between metric and imperial units for length, weight, area, volume and temperature, with precise conversion factors rather than rounded ones.',
    keywords: ['unit converter', 'measurement converter', 'metric to imperial', 'length weight converter'],
  },
  'tip-calculator': {
    title: 'Tip Calculator & Bill Splitter',
    description:
      'Calculate a tip at any percentage and split the bill evenly across a group, with per-person totals rounded sensibly for cash payment.',
    keywords: ['tip calculator', 'bill splitter', 'gratuity calculator', 'split the bill calculator'],
  },
  'salary-calculator': {
    title: 'Salary Converter: Hourly to Annual',
    description:
      'Convert between hourly, daily, weekly, monthly and annual pay. Useful for comparing a contract rate against a salaried offer on the same basis.',
    keywords: ['salary calculator', 'hourly to annual salary', 'wage converter', 'annual salary calculator'],
  },
  'budget-calculator': {
    title: '50/30/20 Budget Calculator',
    description:
      'Split take-home pay across needs, wants and savings using the 50/30/20 rule, with a breakdown of what each bucket allows in real money.',
    keywords: ['50 30 20 budget calculator', 'budget calculator', 'monthly budget planner', 'income allocation calculator'],
  },
  'currency-converter': {
    title: 'Currency Converter: Live Rates',
    description:
      'Convert between major world currencies at current exchange rates. Supports USD, EUR, GBP, INR, JPY and more, with clean output and no signup required.',
    keywords: ['currency converter', 'exchange rate calculator', 'usd to inr', 'live currency rates'],
  },
};

/** Fallback for any slug not yet given hand-written copy. */
export function getCalculatorSeo(slug: string, name: string, desc: string): CalculatorSeo {
  return (
    CALCULATOR_SEO[slug] ?? {
      title: name,
      description: `${desc} Free ${name.toLowerCase()} with transparent formulas, instant results and no signup required.`.slice(
        0,
        160,
      ),
      keywords: [name.toLowerCase()],
    }
  );
}
