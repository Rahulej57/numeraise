/**
 * Long-form content for calculators, keyed by slug.
 *
 * WHY THIS EXISTS
 * The 39 calculators rendered through DynamicCalculatorClient shipped 85-250
 * words of prose each. Measured on the live site: /calculators/roi-calculator
 * had 253 visible words, /calculators/rd-calculator 301, /calculators/ppf-
 * calculator 410. Competitors ranking for those exact terms publish 1,500-3,000
 * words and carry established backlink profiles. A 250-word page targeting
 * "PPF calculator" will not rank, and frequently will not be indexed at all.
 *
 * HOW TO EXTEND
 * Add an entry keyed by calculator slug. DynamicSEO checks this registry first
 * and falls back to the older inline JSX branches for slugs not yet migrated.
 *
 * Inline links use [[/path|anchor text]] so internal linking stays in the copy
 * rather than in markup.
 *
 * A WARNING WORTH HEEDING
 * Do not bulk-generate the remaining entries in one pass. Publishing ~30
 * near-identical long pages at once is "scaled content abuse" under Google's
 * spam policies and is more likely to suppress the domain than lift it. Write
 * three or four a week, each genuinely different from the last. The queue in
 * SEO-CHECKLIST.md is ordered by value.
 */

export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  bullets?: { label?: string; text: string }[];
  formula?: { expression: string; where: string[] };
  table?: { caption?: string; headers: string[]; rows: string[][] };
  callout?: { tone: 'info' | 'warning'; heading: string; text: string };
}

export interface DeepContent {
  intro: string[];
  sections: ContentSection[];
  faqs: { question: string; answer: string }[];
  /** ISO date. Surfaced on the page as a visible review date. */
  lastReviewed: string;
}

export const CALCULATOR_DEEP_CONTENT: Record<string, DeepContent> = {
  // ==========================================================================
  'epf-calculator': {
    lastReviewed: '2026-08-02',
    intro: [
      'The Employees’ Provident Fund is the largest retirement asset most salaried employees will ever hold, and also the one they understand least. Money leaves your payslip every month, an equal amount is added by your employer, and the balance compounds tax-free for decades. Most people only look at the number when they change jobs.',
      'This calculator projects what that balance becomes by the time you retire, based on your current corpus, salary, expected increments and the prevailing interest rate.',
    ],
    sections: [
      {
        heading: 'How EPF contributions actually split',
        paragraphs: [
          'The headline is that you and your employer each contribute 12% of basic salary plus dearness allowance. That is true of the amount leaving each side, but not of where it lands, and the difference matters a great deal for your final balance.',
          'Your entire 12% goes into the provident fund. Your employer’s 12% is split: 8.33% is diverted to the Employees’ Pension Scheme and the remaining 3.67% joins your EPF balance. Crucially, the EPS portion is capped at a wage ceiling of ₹15,000 a month, which works out to a maximum of ₹1,250 going to EPS regardless of what you earn.',
          'That cap is why the split behaves differently above and below the ceiling, and it is the detail most explanations skip. If your basic pay is at or under ₹15,000, roughly 15.67% of it compounds in your EPF. Above the ceiling, EPS still takes only ₹1,250 and the entire remainder of the employer contribution is redirected into your EPF — so the share compounding in your name is considerably larger.',
        ],
        table: {
          caption:
            'A ₹50,000 basic salary. EPS is capped at ₹1,250, so the surplus goes to EPF rather than the pension scheme.',
          headers: ['Source', 'Amount', 'Destination'],
          rows: [
            ['Employee 12%', '₹6,000', 'EPF account'],
            ['Employer, EPS share', '₹1,250', 'Employees’ Pension Scheme (capped at the ₹15,000 wage ceiling)'],
            ['Employer, balance', '₹4,750', 'EPF account (the excess above the EPS cap)'],
            ['Total into EPF', '₹10,750', '21.5% of basic — not the 15.67% the headline split implies'],
          ],
        },
      },
      {
        heading: 'The compounding formula',
        paragraphs: [
          'EPF interest is declared annually but calculated on the running monthly balance, so a contribution made in April earns for twelve months while one made in March earns for one. Over a full career that timing difference is worth a substantial amount.',
        ],
        formula: {
          expression: 'FV = Σ [ Cₙ × (1 + r)^((12 − n) / 12) ]  +  P × (1 + r)^t',
          where: [
            'Cₙ = contribution in month n of the year',
            'r = declared annual interest rate',
            'P = opening balance carried forward',
            't = years remaining until withdrawal',
          ],
        },
      },
      {
        heading: 'Why the balance grows faster than people expect',
        paragraphs: [
          'Two forces compound at once. The interest compounds, as it does in any long-term instrument. But the contribution itself also grows, because it is a percentage of a salary that rises with every increment and promotion.',
          'That second effect is what makes EPF projections counterintuitive. A 10% annual salary increment means your contribution in year twenty is roughly six times your contribution in year one, and each of those larger contributions still has years left to compound. The last decade of a career typically adds more to the corpus than the first two decades combined.',
        ],
        bullets: [
          {
            label: 'Tax status',
            text: 'EPF is exempt-exempt-exempt: contributions are deductible, interest accrues tax-free, and withdrawal after five continuous years of service is tax-free. Very few instruments offer all three.',
          },
          {
            label: 'Interest rate',
            text: 'The rate is declared each year by the EPFO and has historically sat above what comparable [[/calculators/fd-calculator|fixed deposits]] pay, with the added advantage of the tax exemption.',
          },
          {
            label: 'Voluntary contribution',
            text: 'You can contribute more than the statutory 12% through VPF, which earns the same rate. Above a threshold the interest on employee contributions becomes taxable, so check the current limit before increasing.',
          },
        ],
      },
      {
        heading: 'The mistake that costs the most',
        paragraphs: [
          'Withdrawing the EPF balance when changing jobs is the single most expensive habit in Indian personal finance, and it is extremely common. The amount looks modest early in a career, which is exactly what makes it easy to spend.',
          'A balance withdrawn at age 28 rather than transferred loses roughly three decades of tax-free compounding. At typical EPF rates that balance would have multiplied several times over by retirement. Withdrawal before five continuous years of service also makes the amount taxable, so you lose the exemption as well as the growth.',
        ],
        callout: {
          tone: 'warning',
          heading: 'Transfer, do not withdraw',
          text: 'When you change employers, transfer the balance using your UAN rather than closing the account. The transfer preserves both the compounding and your continuous-service record, which is what keeps the withdrawal tax-free later.',
        },
      },
      {
        heading: 'EPF as part of a wider retirement plan',
        paragraphs: [
          'EPF is a strong foundation but rarely sufficient on its own, because the contribution is tied to basic salary rather than to what you will actually need in retirement. Run the [[/calculators/retirement-calculator|retirement corpus calculator]] with your real expenses and inflation applied, then treat the EPF projection as one component of that target.',
          'For most people the gap between the two numbers is filled with a combination of [[/calculators/nps-calculator|NPS]] and equity [[/calculators/sip-calculator|SIPs]]. Seeing the shortfall explicitly, decades in advance, is what makes it solvable.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the current EPF interest rate?',
        answer:
          'The rate is declared annually by the EPFO and has recently ranged between roughly 8.1% and 8.25%. Because it changes each year, this calculator lets you enter the rate you want to project with rather than hardcoding one that will go stale.',
      },
      {
        question: 'Is EPF interest taxable?',
        answer:
          'Interest on the statutory contribution is tax-free. Interest on employee contributions above an annual threshold is taxable in the year it accrues. Withdrawals after five continuous years of service are entirely tax-free.',
      },
      {
        question: 'Can I withdraw EPF before retirement?',
        answer:
          'Partial withdrawal is permitted for specific purposes such as a house purchase, medical treatment, higher education or marriage, each with its own eligibility rules and limits. Full withdrawal is generally allowed only on retirement or after a period of unemployment.',
      },
      {
        question: 'What is the difference between EPF and EPS?',
        answer:
          'EPF is a lump-sum corpus that accumulates in your name and is fully withdrawable. EPS is a pension scheme funded by 8.33% of the employer contribution, which pays a monthly pension after age 58 rather than a lump sum, subject to a minimum of ten years of service.',
      },
      {
        question: 'What happens to my EPF if I change jobs?',
        answer:
          'Transfer the balance to your new employer using your Universal Account Number. The UAN stays constant across employers. Transferring preserves both compounding and continuous-service status, which keeps future withdrawal tax-free.',
      },
      {
        question: 'Should I contribute extra through VPF?',
        answer:
          'VPF earns the same rate as EPF with the same tax treatment, which makes it attractive relative to a fixed deposit for a conservative allocation. It is locked in until retirement though, so it suits money you genuinely will not need before then.',
      },
    ],
  },

  // ==========================================================================
  'break-even-calculator': {
    lastReviewed: '2026-08-02',
    intro: [
      'Break-even analysis answers the first question any business has to answer: how much do we need to sell before we stop losing money? Below that volume every month consumes cash. Above it, each additional sale contributes profit.',
      'This calculator finds that volume from your fixed costs, variable cost per unit and selling price, and shows how sensitive the answer is to each of those three inputs.',
    ],
    sections: [
      {
        heading: 'The formula, and why contribution margin is the real variable',
        paragraphs: [
          'Break-even volume is fixed costs divided by contribution margin per unit. Contribution margin is what remains from each sale after the variable cost of producing it, and it is the number that actually determines the answer.',
        ],
        formula: {
          expression: 'Break-even units = Fixed costs ÷ (Price per unit − Variable cost per unit)',
          where: [
            'Fixed costs = rent, salaries, software, insurance — anything you pay regardless of volume',
            'Variable cost = materials, packaging, payment fees, shipping — anything that scales with each unit',
            'The denominator is contribution margin per unit',
          ],
        },
      },
      {
        heading: 'A worked example',
        paragraphs: [
          'Suppose fixed costs run 200,000 a month. You sell at 500 a unit, and each unit costs 300 to make and deliver. Contribution margin is 200 per unit, so break-even is 200,000 ÷ 200 = 1,000 units a month.',
          'Now raise the price by 10%, to 550. Contribution margin becomes 250, and break-even falls to 800 units — a 20% reduction in the volume you need. Instead, cut variable cost by 10%, to 270. Contribution margin becomes 230 and break-even falls to 870 units, a 13% reduction.',
          'The same percentage change produced substantially different results. This asymmetry is the most useful thing break-even analysis teaches, and it holds in almost every business: price moves the break-even point harder than cost does, because a price increase flows entirely into contribution margin while a cost reduction only removes part of it.',
        ],
        table: {
          caption: 'Identical 10% changes, applied to different levers.',
          headers: ['Scenario', 'Contribution margin', 'Break-even units', 'Change'],
          rows: [
            ['Baseline', '200', '1,000', '—'],
            ['Price +10%', '250', '800', '−20%'],
            ['Variable cost −10%', '230', '870', '−13%'],
            ['Fixed cost −10%', '200', '900', '−10%'],
          ],
        },
      },
      {
        heading: 'Break-even on revenue rather than units',
        paragraphs: [
          'Businesses selling many different products cannot express break-even in units. The equivalent is the contribution margin ratio: contribution margin divided by price, expressed as a percentage of revenue.',
        ],
        formula: {
          expression: 'Break-even revenue = Fixed costs ÷ Contribution margin ratio',
          where: [
            'Contribution margin ratio = (Price − Variable cost) ÷ Price',
            'In the example above: 200 ÷ 500 = 40%',
            'Break-even revenue = 200,000 ÷ 0.40 = 500,000 per month',
          ],
        },
      },
      {
        heading: 'What break-even analysis does not tell you',
        bullets: [
          {
            label: 'It assumes price stays constant',
            text: 'Selling twice the volume often requires discounting, which lowers contribution margin exactly when you are relying on it. Model the discounted price rather than the list price.',
          },
          {
            label: 'It assumes costs stay linear',
            text: 'Fixed costs are only fixed within a range. Doubling output may require another shift, another machine or a bigger unit, which steps fixed costs up abruptly.',
          },
          {
            label: 'It ignores timing',
            text: 'Breaking even on paper while customers pay in 90 days is not the same as breaking even in cash. Many profitable businesses fail on working capital.',
          },
          {
            label: 'It says nothing about demand',
            text: 'The calculator tells you the volume required. Whether the market will actually buy that volume at your price is the harder question, and no formula answers it.',
          },
        ],
        callout: {
          tone: 'info',
          heading: 'Pair this with margin analysis',
          text: 'Break-even tells you the volume you need. The [[/calculators/margin-calculator|profit margin calculator]] tells you what each sale contributes once you are past it, and the [[/calculators/markup-calculator|markup calculator]] helps you set the price in the first place. The three answer different halves of the same question.',
        },
      },
      {
        heading: 'The margin of safety',
        paragraphs: [
          'Once you know break-even, the more useful derived figure is your margin of safety: how far current sales sit above the break-even point, as a percentage. A business selling 1,300 units against a break-even of 1,000 has a 23% margin of safety, meaning sales could fall by roughly a quarter before it starts losing money.',
          'That number is a far better indicator of resilience than profit alone, because it tells you how much shock the business can absorb before the arithmetic turns against it.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the break-even point in simple terms?',
        answer:
          'It is the sales volume at which total revenue exactly equals total costs, so profit is zero. Below it you are making a loss; above it, each additional sale contributes profit equal to its contribution margin.',
      },
      {
        question: 'What is contribution margin?',
        answer:
          'The amount left from each sale after the variable cost of producing that unit. It is what contributes towards covering fixed costs, and once fixed costs are covered, it becomes profit.',
      },
      {
        question: 'Should fixed costs include my own salary?',
        answer:
          'Yes, if you intend to pay yourself. Excluding founder salary produces a flattering break-even number that hides a real cost. A business that only breaks even because nobody is being paid has not broken even.',
      },
      {
        question: 'How do I calculate break-even for a service business?',
        answer:
          'Use billable hours as the unit. Variable cost is the direct cost of delivering an hour, and price is your hourly rate. Fixed costs are everything you pay whether or not you bill.',
      },
      {
        question: 'Why does raising prices reduce break-even more than cutting costs?',
        answer:
          'A price increase flows entirely into contribution margin, while a variable cost reduction only removes part of the cost of a unit. In the example above, a 10% price rise cut break-even by 20% while a 10% cost cut moved it 13%.',
      },
      {
        question: 'What is a good margin of safety?',
        answer:
          'There is no universal figure, but sales sitting well above break-even means the business can absorb a downturn without going into loss. A thin margin of safety indicates that a small drop in demand pushes you underwater.',
      },
    ],
  },

  // ==========================================================================
  'rental-yield': {
    lastReviewed: '2026-08-02',
    intro: [
      'Rental yield is the annual rent a property produces, expressed as a percentage of what the property is worth. It is the single number that separates property as an investment from property as a place to live.',
      'This calculator produces both gross and net yield, because the gap between the two is where most property investment cases quietly fall apart.',
    ],
    sections: [
      {
        heading: 'Gross yield and net yield',
        paragraphs: [
          'Gross yield is the figure quoted in listings and brochures. It is annual rent divided by property value, and it ignores every cost of ownership. It is useful only for rough comparison between properties, never for deciding whether to buy one.',
          'Net yield subtracts the costs you actually pay: maintenance, property tax, insurance, society charges, letting fees, repairs and the rent lost while the property sits empty between tenants. It is a materially smaller number and it is the one that matters.',
        ],
        formula: {
          expression: 'Gross yield = (Annual rent ÷ Property value) × 100',
          where: [
            'Net yield = ((Annual rent − Annual costs) ÷ Total purchase cost) × 100',
            'Total purchase cost includes stamp duty, registration and brokerage — not just the sale price',
            'Annual costs include a realistic vacancy allowance, not a best case of zero',
          ],
        },
      },
      {
        heading: 'A worked example',
        paragraphs: [
          'A property costs 10,000,000 and rents for 25,000 a month. Gross yield looks like 300,000 ÷ 10,000,000 = 3.0%.',
          'Now add reality. Stamp duty and registration added 600,000 at purchase, so your actual capital committed is 10,600,000. Society maintenance and property tax run 40,000 a year, repairs average 25,000, and the flat sits empty roughly one month in twelve, costing another 25,000 in rent.',
          'Net income becomes 300,000 − 90,000 = 210,000, against 10,600,000 committed. Net yield is 1.98% — barely two-thirds of the gross figure, and well below what a low-risk fixed deposit pays with none of the illiquidity or tenant risk.',
        ],
        table: {
          caption: 'The same property, before and after the costs of ownership.',
          headers: ['Measure', 'Calculation', 'Result'],
          rows: [
            ['Gross yield', '300,000 ÷ 10,000,000', '3.00%'],
            ['Net income', '300,000 − 90,000 costs', '210,000'],
            ['Capital committed', '10,000,000 + 600,000 duty', '10,600,000'],
            ['Net yield', '210,000 ÷ 10,600,000', '1.98%'],
          ],
        },
      },
      {
        heading: 'What a low net yield actually means',
        paragraphs: [
          'A net yield of around 2% does not automatically make a property a bad investment. It does mean that the investment case rests almost entirely on capital appreciation rather than on income, and that is a considerably less certain proposition.',
          'If prices rise steadily, the total return can be excellent, particularly with leverage amplifying it. If prices stagnate for several years — which property markets do, sometimes for a decade — you are holding an illiquid asset yielding less than a savings account while paying maintenance on it.',
          'The honest comparison is not rental yield against zero. It is rental yield plus expected appreciation, against what the same capital would have earned in a diversified portfolio, adjusted for the fact that one of those options can be sold in a day and the other cannot.',
        ],
        callout: {
          tone: 'warning',
          heading: 'Leverage cuts both ways',
          text: 'A mortgage magnifies both outcomes. Borrowing at 8.5% to hold an asset yielding 2% net means the rent does not cover the interest, and you are funding the shortfall monthly in the expectation that appreciation makes up the difference. Model that gap explicitly with the [[/calculators/rent-vs-buy|rent vs buy calculator]] before committing.',
        },
      },
      {
        heading: 'Costs people forget to include',
        bullets: [
          { label: 'Vacancy', text: 'Even a well-located property is empty between tenants. One month a year is a realistic default; assuming zero is not.' },
          { label: 'Letting and management fees', text: 'Typically one month of rent per tenancy for finding a tenant, plus a percentage of rent if managed.' },
          { label: 'Major repairs', text: 'Roofs, plumbing and waterproofing do not fail annually, but averaged across years they are a real cost that must be provisioned.' },
          { label: 'Tax on rental income', text: 'Rent is taxable income. A yield calculated pre-tax overstates what actually reaches you, particularly in higher brackets.' },
          { label: 'Transaction costs on exit', text: 'Brokerage and capital gains tax on sale. Compute the latter with the [[/calculators/capital-gains-tax|capital gains tax calculator]].' },
        ],
      },
      {
        heading: 'Using yield to compare properties',
        paragraphs: [
          'Yield is most useful as a relative measure. Two properties in the same city with similar appreciation prospects but yields of 2% and 3.5% are meaningfully different investments, and the difference compounds over a holding period.',
          'As a general pattern, smaller units and less central locations tend to produce higher rental yields but weaker capital appreciation, while premium central property does the reverse. Which you want depends on whether you are buying for income now or for capital later — and being explicit about that before you buy prevents a good deal of disappointment afterwards.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a good rental yield?',
        answer:
          'It varies widely by city and country. The meaningful test is not an absolute number but whether net yield plus realistic expected appreciation beats what the same capital would earn elsewhere, adjusted for liquidity and risk.',
      },
      {
        question: 'Why is my net yield so much lower than gross?',
        answer:
          'Because gross yield ignores maintenance, property tax, insurance, letting fees, repairs, vacancy and the purchase costs of stamp duty and brokerage. Together these routinely consume a third or more of gross rental income.',
      },
      {
        question: 'Should I use purchase price or current market value?',
        answer:
          'Both, for different purposes. Yield on purchase price tells you how the original investment is performing. Yield on current value tells you what you are earning on capital you could release by selling, which is the more relevant figure for deciding whether to hold.',
      },
      {
        question: 'Does rental yield include capital appreciation?',
        answer:
          'No. Yield measures income only. Total return is yield plus appreciation, and for most residential property in high-priced cities, appreciation is by far the larger of the two — which is exactly why it deserves scrutiny rather than assumption.',
      },
      {
        question: 'How much should I budget for vacancy?',
        answer:
          'One month per year, roughly 8%, is a reasonable default in a normal market. In areas with high tenant turnover or seasonal demand, budget more. Assuming continuous occupancy is the most common error in amateur yield calculations.',
      },
      {
        question: 'Is rental income taxed?',
        answer:
          'Yes, rental income is taxable, though deductions are typically available for property tax, a standard maintenance allowance and home loan interest. Rules vary by jurisdiction, so confirm the current position with a tax professional.',
      },
    ],
  },

  // ==========================================================================
  'pomis-calculator': {
    lastReviewed: '2026-08-02',
    intro: [
      'The Post Office Monthly Income Scheme pays you a fixed amount every month for five years, backed by the Government of India. For retirees who need predictable income rather than growth, it is one of the few products where the monthly figure is contractual rather than hopeful.',
      'This calculator shows your monthly payout, total interest across the term, and what the deposit is actually worth once tax is applied.',
    ],
    sections: [
      {
        heading: 'How the monthly income is calculated',
        paragraphs: [
          'POMIS is deliberately simple. There is no compounding — interest is calculated on your deposit and paid out monthly, and the principal is returned in full at maturity. What you deposit is what you get back.',
        ],
        formula: {
          expression: 'Monthly income = (Deposit × Annual rate) ÷ 12',
          where: [
            'At a 7.4% rate, a ₹9,00,000 deposit pays ₹66,600 a year',
            'That is ₹5,550 every month, for 60 months',
            'Total interest across the term = ₹3,33,000',
            'Principal of ₹9,00,000 is returned at maturity, undiminished',
          ],
        },
        callout: {
          tone: 'info',
          heading: 'Rates are set quarterly',
          text: 'The Ministry of Finance revises small savings rates every quarter. The rate you get is fixed for your full five-year term at the rate prevailing when you open the account — later revisions do not affect an existing deposit. Enter the current rate rather than relying on a figure quoted in an old article.',
        },
      },
      {
        heading: 'Deposit limits and who can open one',
        bullets: [
          { label: 'Single account', text: 'Maximum ₹9 lakh. Raised from ₹4.5 lakh in April 2023.' },
          { label: 'Joint account', text: 'Maximum ₹15 lakh, with up to three adults. Raised from ₹9 lakh in the same revision.' },
          { label: 'Minimum', text: '₹1,000, and in multiples of ₹1,000 thereafter.' },
          { label: 'Eligibility', text: 'Any resident individual. A minor above ten can operate an account, and a guardian can open one on behalf of a younger minor. NRIs are not eligible.' },
          { label: 'Multiple accounts', text: 'Permitted, but your combined holding across all POMIS accounts cannot exceed the individual ceiling.' },
        ],
        paragraphs: [
          'A married couple can therefore hold ₹15 lakh jointly, or ₹9 lakh each in single accounts — ₹18 lakh across the household. At 7.4% that is roughly ₹11,100 a month between them.',
        ],
      },
      {
        heading: 'The tax treatment nobody mentions upfront',
        paragraphs: [
          'POMIS interest is fully taxable as income from other sources, at your slab rate. There is no 80C deduction on the deposit and no exemption on the interest.',
          'What catches people out is that the post office does not deduct TDS on POMIS interest. Receiving the money gross feels like receiving it tax-free, and the liability quietly accumulates until filing. If POMIS is a meaningful part of your income, set aside the tax as it arrives rather than discovering it in one lump at year end.',
        ],
        table: {
          caption: 'Effective post-tax return on a ₹9,00,000 deposit at 7.4%, by slab.',
          headers: ['Tax slab', 'Annual interest', 'Tax', 'Post-tax return'],
          rows: [
            ['Nil', '₹66,600', '₹0', '7.40%'],
            ['5%', '₹66,600', '₹3,330', '7.03%'],
            ['20%', '₹66,600', '₹13,320', '5.92%'],
            ['30%', '₹66,600', '₹19,980', '5.18%'],
          ],
        },
        callout: {
          tone: 'warning',
          heading: 'Check the post-tax number against inflation',
          text: 'At a 30% slab, a 7.4% headline becomes about 5.2% after tax. If inflation runs near 6%, that is a small negative real return — your monthly income is steady but its purchasing power shrinks each year. Run it through the [[/calculators/inflation-calculator|inflation calculator]] before committing a large sum.',
        },
      },
      {
        heading: 'Premature closure',
        bullets: [
          { label: 'Before one year', text: 'Not permitted. The money is locked.' },
          { label: 'Between one and three years', text: 'Permitted with a 2% deduction from the principal.' },
          { label: 'Between three and five years', text: 'Permitted with a 1% deduction from the principal.' },
        ],
        paragraphs: [
          'The penalty applies to the deposit, not to the interest already received, so you keep every monthly payout made up to that point. That makes POMIS more forgiving than instruments that claw back interest — but it is still a five-year commitment and should be funded from money you genuinely will not need.',
        ],
      },
      {
        heading: 'POMIS against the alternatives',
        paragraphs: [
          'POMIS competes with a narrow set of products, and the right comparison depends on whether you qualify for the alternatives.',
        ],
        bullets: [
          {
            label: 'SCSS',
            text: 'If you are 60 or over, the [[/calculators/scss-calculator|Senior Citizen Savings Scheme]] typically pays a higher rate, allows a much larger deposit, and carries an 80C deduction. For an eligible senior it usually wins outright — POMIS is the fallback once the SCSS ceiling is used.',
          },
          {
            label: 'Bank monthly-income FD',
            text: 'A [[/calculators/fd-calculator|fixed deposit]] with monthly payout does the same job. Rates move with the market rather than being set quarterly, and deposit insurance covers ₹5 lakh per bank — against a sovereign guarantee on the full POMIS amount.',
          },
          {
            label: 'Debt mutual funds with SWP',
            text: 'A [[/calculators/swp-calculator|systematic withdrawal plan]] offers more flexibility and potentially better tax treatment, but the payout is not guaranteed and the capital can fall. Different risk profile entirely.',
          },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the current POMIS interest rate?',
        answer:
          'The rate is set quarterly by the Ministry of Finance and has recently been 7.4% per annum, paid monthly. Your rate is locked for the full five-year term at whatever prevailed when you opened the account. Confirm the current quarter figure at a post office before depositing.',
      },
      {
        question: 'What is the maximum I can deposit in POMIS?',
        answer:
          '₹9 lakh in a single account and ₹15 lakh in a joint account, following the April 2023 revision from ₹4.5 lakh and ₹9 lakh respectively. The limit applies across all POMIS accounts you hold, not per account.',
      },
      {
        question: 'Is POMIS interest tax-free?',
        answer:
          'No. It is fully taxable at your slab rate as income from other sources, with no 80C benefit on the deposit. The post office does not deduct TDS, so the liability is yours to declare and pay at filing.',
      },
      {
        question: 'What happens if I need the money before five years?',
        answer:
          'Withdrawal is barred in the first year. Between one and three years a 2% penalty applies to the principal; between three and five years it is 1%. Monthly interest already received is not clawed back.',
      },
      {
        question: 'Is POMIS safe?',
        answer:
          'It carries a sovereign guarantee from the Government of India on the entire deposit, which makes it lower credit risk than a bank fixed deposit, where insurance covers ₹5 lakh per bank. The real risk is not default but inflation eroding a fixed post-tax return.',
      },
      {
        question: 'Can I reinvest the monthly payout?',
        answer:
          'Yes, and it is worth considering if you do not need the income immediately. Routing the monthly amount into a recurring deposit or a [[/calculators/sip-calculator|SIP]] restores the compounding that POMIS deliberately leaves out. Left in a savings account, the payout earns considerably less.',
      },
      {
        question: 'Can NRIs open a POMIS account?',
        answer:
          'No. POMIS is available to resident individuals only. An account holder who becomes an NRI during the term must inform the post office, and the account is generally closed.',
      },
    ],
  },

  // ==========================================================================
  'scss-calculator': {
    lastReviewed: '2026-08-02',
    intro: [
      'The Senior Citizen Savings Scheme is the highest-paying government-guaranteed instrument available to anyone over 60 in India. It pays quarterly, carries an 80C deduction, and allows a substantially larger deposit than most small savings schemes.',
      'This calculator works out your quarterly payout, total interest across the five-year term, and what the deposit is worth after tax.',
    ],
    sections: [
      {
        heading: 'How SCSS pays out',
        paragraphs: [
          'Like POMIS, SCSS pays simple interest rather than compounding it. The difference is frequency — payouts arrive quarterly on fixed dates rather than monthly — and the rate, which has consistently sat above other small savings options.',
        ],
        formula: {
          expression: 'Quarterly payout = (Deposit × Annual rate) ÷ 4',
          where: [
            'At 8.2%, a ₹30,00,000 deposit earns ₹2,46,000 a year',
            'Paid as ₹61,500 every quarter',
            'Total interest across five years = ₹12,30,000',
            'Principal returned in full at maturity',
          ],
        },
      },
      {
        heading: 'Who qualifies',
        bullets: [
          { label: 'Age 60 and above', text: 'The standard route. No other condition applies.' },
          { label: 'Age 55 to 60', text: 'Available to those who retired on superannuation or under a voluntary retirement scheme, provided the account is opened within one month of receiving retirement benefits.' },
          { label: 'Age 50 and above', text: 'Available to retired defence personnel, subject to the same one-month condition.' },
          { label: 'Not eligible', text: 'NRIs and Hindu Undivided Families cannot open an SCSS account.' },
        ],
        callout: {
          tone: 'warning',
          heading: 'The one-month window is strict',
          text: 'If you are retiring before 60 and intend to use SCSS, the account must be opened within a month of receiving your retirement benefits. Miss that window and you wait until you turn 60. It is a genuinely easy deadline to lose track of during the administrative fog of retiring.',
        },
      },
      {
        heading: 'Limits, term and tax',
        bullets: [
          { label: 'Maximum deposit', text: '₹30 lakh, raised from ₹15 lakh in April 2023. The limit is per individual across all SCSS accounts, so a couple who both qualify can hold ₹60 lakh between them.' },
          { label: 'Minimum', text: '₹1,000, in multiples of ₹1,000.' },
          { label: 'Term', text: 'Five years, extendable once by a further three. The extension takes the rate prevailing at the date of extension, not your original rate.' },
          { label: '80C deduction', text: 'The deposit qualifies under section 80C, within the overall ₹1.5 lakh ceiling. POMIS offers no such benefit — a meaningful edge in the first year.' },
          { label: 'TDS', text: 'Deducted where annual interest exceeds the threshold. Form 15H can be submitted if your total income is below the taxable limit.' },
        ],
        paragraphs: [
          'Interest is fully taxable at slab rate. A separate deduction is available under section 80TTB for interest income of senior citizens, which can shelter a portion of it — worth checking the current limit against your total interest across all deposits.',
        ],
      },
      {
        heading: 'A worked comparison against POMIS',
        paragraphs: [
          'For someone who qualifies for both, the arithmetic is rarely close. Take ₹9,00,000 — the POMIS single-account ceiling — placed in each.',
        ],
        table: {
          caption: 'Same ₹9,00,000 deposit, five-year term. Rates as recently prevailing.',
          headers: ['', 'SCSS at 8.2%', 'POMIS at 7.4%'],
          rows: [
            ['Payout frequency', 'Quarterly', 'Monthly'],
            ['Annual interest', '₹73,800', '₹66,600'],
            ['Total over 5 years', '₹3,69,000', '₹3,33,000'],
            ['80C deduction', 'Yes', 'No'],
            ['Maximum deposit', '₹30 lakh', '₹9 lakh'],
            ['Age requirement', '60+ (or 55+ on VRS)', 'None'],
          ],
        },
        callout: {
          tone: 'info',
          heading: 'The sensible order for an eligible senior',
          text: 'Fill the SCSS ceiling first — higher rate, 80C benefit, larger capacity. Use [[/calculators/pomis-calculator|POMIS]] for whatever remains, since it needs no age qualification and pays monthly rather than quarterly. Beyond both, compare against a [[/calculators/fd-calculator|bank fixed deposit]] on post-tax return rather than headline rate.',
        },
      },
      {
        heading: 'Premature closure',
        bullets: [
          { label: 'Within one year', text: 'Permitted, but all interest already paid is recovered from the principal.' },
          { label: 'One to two years', text: '1.5% of the deposit is deducted.' },
          { label: 'After two years', text: '1% of the deposit is deducted.' },
        ],
        paragraphs: [
          'The first-year clawback is harsher than POMIS, where earlier payouts are kept. On death of the account holder no penalty applies, and the account earns the savings account rate from the date of death until closure.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the current SCSS interest rate?',
        answer:
          'Set quarterly by the Ministry of Finance and recently 8.2% per annum, paid quarterly. The rate is locked for your full five-year term at whatever prevailed when the account was opened. Verify the current quarter before depositing.',
      },
      {
        question: 'What is the maximum SCSS deposit?',
        answer:
          '₹30 lakh per individual, raised from ₹15 lakh in April 2023. The ceiling applies across all your SCSS accounts combined. A qualifying couple can hold ₹60 lakh between two individual accounts.',
      },
      {
        question: 'Can I open SCSS before I turn 60?',
        answer:
          'Yes, if you retired on superannuation or under VRS you can open one from 55, and retired defence personnel from 50 — but only within one month of receiving retirement benefits. Miss that window and you must wait until 60.',
      },
      {
        question: 'Does SCSS qualify for 80C?',
        answer:
          'Yes, the deposit is deductible under section 80C within the overall ₹1.5 lakh limit. This is a clear advantage over POMIS, which carries no deduction.',
      },
      {
        question: 'Is TDS deducted on SCSS interest?',
        answer:
          'Yes, where annual interest exceeds the prescribed threshold. If your total income falls below the taxable limit you can submit Form 15H to avoid deduction. Section 80TTB may also shelter part of the interest.',
      },
      {
        question: 'Can I extend SCSS beyond five years?',
        answer:
          'Yes, once, by three years, with the application made within a year of maturity. The extension carries the rate prevailing on the maturity date rather than your original rate, so it may be higher or lower.',
      },
      {
        question: 'SCSS or POMIS — which should I choose?',
        answer:
          'If you are eligible for SCSS it usually wins: higher rate, 80C deduction, and a much larger ceiling. Use POMIS for amounts beyond the SCSS limit, or if you need monthly rather than quarterly income, or if you do not yet meet the age requirement.',
      },
    ],
  },

  // ==========================================================================
  'hra-exemption': {
    lastReviewed: '2026-08-02',
    intro: [
      'House Rent Allowance exemption is the most commonly miscalculated deduction on an Indian tax return. Most people assume the exemption equals the HRA figure on their payslip. It almost never does.',
      'The exempt amount is the lowest of three separate calculations, and this calculator runs all three so you can see which one is capping your claim.',
    ],
    sections: [
      {
        heading: 'The three-way test',
        paragraphs: [
          'Section 10(13A) exempts the least of the following three amounts. Whichever is smallest is your exemption — the other two are irrelevant to the final number, however large they are.',
        ],
        formula: {
          expression: 'Exemption = MIN( HRA received, Rent paid − 10% of salary, 50% or 40% of salary )',
          where: [
            'Salary here means Basic + Dearness Allowance (+ commission on turnover, if part of your terms)',
            '50% applies in the eight cities classified as metro — see below, this list changed in 2026',
            '40% applies everywhere else',
            'It is your place of residence that matters, not where your employer is registered',
          ],
        },
        callout: {
          tone: 'warning',
          heading: 'The metro list changed on 1 April 2026 — check which year you are filing for',
          text: 'The Income-tax Rules, 2026 (Rule 279) added Bengaluru, Hyderabad, Pune and Ahmedabad to the original four of Delhi, Mumbai, Kolkata and Chennai, taking the 50% list to eight cities. This applies to income from FY 2026-27 onwards. For a return covering FY 2025-26, the old four-metro rule still governs, so those four newer cities remain at 40% for that year. Getting the year wrong in either direction changes your exemption.',
        },
      },
      {
        heading: 'Which cities qualify for 50%',
        table: {
          caption:
            'Metro classification for HRA. The four cities added in 2026 apply from FY 2026-27; earlier years use the original four.',
          headers: ['City', 'Rate from FY 2026-27', 'Rate for FY 2025-26 and earlier'],
          rows: [
            ['Delhi, Mumbai, Kolkata, Chennai', '50%', '50%'],
            ['Bengaluru, Hyderabad, Pune, Ahmedabad', '50%', '40%'],
            ['Everywhere else (Gurugram, Noida, Jaipur, Kochi…)', '40%', '40%'],
          ],
        },
        paragraphs: [
          'This was the first change to the HRA metro list in decades, and a good deal of advice online still states the old four-city rule as though it were current. If you live in one of the four added cities, an out-of-date article will have you claiming 40% when you are entitled to 50%.',
          'Note that "metro" here is a definition specific to this section of the tax rules. It is not the census definition, and it does not follow how large or expensive a city has become — Gurugram and Noida remain at 40% despite rents that rival any of the eight.',
        ],
      },
      {
        heading: 'A worked example',
        paragraphs: [
          'Take a basic salary of ₹6,00,000 a year, HRA of ₹3,00,000, and rent paid of ₹2,40,000 (₹20,000 a month) in Jaipur — a non-metro city, so the third test uses 40%.',
        ],
        table: {
          caption: 'The three calculations. The smallest is the exemption.',
          headers: ['Test', 'Calculation', 'Amount'],
          rows: [
            ['1. Actual HRA received', '—', '₹3,00,000'],
            ['2. Rent − 10% of salary', '₹2,40,000 − ₹60,000', '₹1,80,000'],
            ['3. 40% of salary (non-metro)', '40% × ₹6,00,000', '₹2,40,000'],
            ['Exemption', 'Lowest of the three', '₹1,80,000'],
          ],
        },
        bullets: [
          {
            label: 'The taxable remainder',
            text: 'HRA received of ₹3,00,000 minus the ₹1,80,000 exemption leaves ₹1,20,000 added to taxable income. Anyone assuming the full ₹3,00,000 was exempt has understated their income by ₹1,20,000.',
          },
          {
            label: 'Why test 2 usually binds',
            text: 'For most salaried people the rent-minus-10% test is the smallest of the three, because the 10% deduction bites and rent rarely exceeds half of basic salary. If your rent is low relative to your salary, this test can even go to zero. Worth noting in the example above: the answer would be the same in a 50% metro, because test 2 is already the lowest — the metro rate only changes your exemption when test 3 is the binding one.',
          },
        ],
      },
      {
        heading: 'Conditions that trip people up',
        bullets: [
          { label: 'Old regime only', text: 'HRA exemption is not available under the new tax regime. If you are claiming significant HRA, factor it into the [[/calculators/income-tax-calculator|old versus new regime comparison]] before choosing — for many renters it is the single item that keeps the old regime ahead.' },
          { label: 'You must actually pay rent', text: 'The exemption requires rent genuinely paid for accommodation you occupy. You cannot claim it while living in a property you own.' },
          { label: 'Landlord PAN', text: 'Required where annual rent exceeds ₹1,00,000. Without it, the employer is expected to deny the exemption at source.' },
          { label: 'Paying rent to family', text: 'Permitted, and legitimate where rent is genuinely paid and the recipient declares it as income. Paying a spouse is the arrangement most likely to be challenged. Keep bank transfers and a written agreement, not cash.' },
          { label: 'No HRA in your salary', text: 'If your package has no HRA component you cannot claim under 10(13A), but section 80GG may allow a smaller deduction for rent paid, subject to its own limits.' },
        ],
      },
      {
        heading: 'What to keep on file',
        paragraphs: [
          'HRA is a routinely scrutinised claim, and the documentation burden falls on you rather than your employer. Retain rent receipts or bank transfer records for every month claimed, a rent agreement naming you as tenant, and the landlord PAN where rent exceeds ₹1 lakh a year.',
          'Rent paid in cash with hand-written receipts and no corresponding bank debit is the pattern most likely to be disallowed on examination. Paying by transfer costs nothing and makes the claim defensible.',
        ],
        callout: {
          tone: 'info',
          heading: 'Rules change between budgets',
          text: 'Thresholds, metro classification and regime rules are revised periodically. This calculator reflects the long-standing structure of section 10(13A), but confirm current-year specifics before filing, and consult a qualified tax professional where the amounts are material.',
        },
      },
    ],
    faqs: [
      {
        question: 'How is HRA exemption calculated?',
        answer:
          'It is the least of three amounts: actual HRA received; rent paid minus 10% of salary; and 50% of salary for metro cities or 40% for non-metro. Salary means basic plus dearness allowance. The smallest of the three is your exemption.',
      },
      {
        question: 'Which cities count as metro for HRA?',
        answer:
          'From FY 2026-27 there are eight: Delhi, Mumbai, Kolkata, Chennai, plus Bengaluru, Hyderabad, Pune and Ahmedabad, which the Income-tax Rules 2026 added with effect from 1 April 2026. For FY 2025-26 and earlier only the original four qualify, so those four newer cities are at 40% for those years. Everywhere else, including Gurugram and Noida, is 40%.',
      },
      {
        question: 'I live in Bengaluru — can I claim 50% now?',
        answer:
          'For income from FY 2026-27 onwards, yes. Bengaluru, Hyderabad, Pune and Ahmedabad were added to the metro list with effect from 1 April 2026. If you are filing a return covering FY 2025-26, the old rule still applies and the limit for that year is 40%. Much of the advice online has not been updated and still states the old four-city list.',
      },
      {
        question: 'Can I claim HRA under the new tax regime?',
        answer:
          'No. HRA exemption is available only under the old regime. For renters with a substantial HRA component, this is frequently the deciding factor when choosing between regimes.',
      },
      {
        question: 'Do I need my landlord’s PAN?',
        answer:
          'Yes, where annual rent exceeds ₹1,00,000. Employers are expected to deny the exemption at source without it. If the landlord refuses, a declaration with their name and address is sometimes accepted, but the claim is weaker.',
      },
      {
        question: 'Can I pay rent to my parents and claim HRA?',
        answer:
          'Yes, provided rent is genuinely paid and your parents declare it as rental income on their own return. Transfer the money by bank rather than cash and keep a rent agreement. Paying a spouse is the arrangement most likely to be challenged.',
      },
      {
        question: 'What if my salary has no HRA component?',
        answer:
          'Section 10(13A) does not apply, but section 80GG may permit a deduction for rent paid, subject to its own conditions and a lower ceiling. It is available only if neither you nor your spouse owns residential property at your place of work.',
      },
      {
        question: 'Can I claim both HRA and a home loan deduction?',
        answer:
          'Yes, in genuine circumstances — for example if you own a property in one city and rent in another for work, or your owned property is legitimately let out. Claiming both while living in your own home is not permitted.',
      },
    ],
  },
};

export function getDeepContent(slug: string): DeepContent | undefined {
  return CALCULATOR_DEEP_CONTENT[slug];
}
