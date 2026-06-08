export interface GlossaryTerm {
  term: string;
  slug: string;
  shortDef: string;
  detailedDef: string;
  formula?: string;
  example?: string;
  keyTakeaways: string[];
  relatedTerms?: { name: string; slug: string }[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { 
    term: "Amortization", 
    slug: "amortization", 
    shortDef: "The process of spreading out a loan into a series of fixed payments over time.",
    detailedDef: "Amortization is an accounting technique used to periodically lower the book value of a loan or an intangible asset over a set period. In the context of a loan (like a mortgage or auto loan), amortization refers to the process of paying off the debt through regular principal and interest payments over time. In the early years of the loan, a larger portion of your payment goes toward interest, while in the later years, the majority of the payment pays down the principal.",
    formula: "A = P [ r(1 + r)^n ] / [ (1 + r)^n - 1 ]\nWhere: A = Periodic Payment, P = Principal amount, r = Periodic interest rate, n = Total number of payments",
    example: "If you take out a $300,000, 30-year fixed-rate mortgage at 5% interest, your monthly payment will be exactly $1,610.46. In month 1, $1,250 goes to interest and only $360.46 goes to principal. By month 360, almost the entire $1,610.46 goes directly to the principal.",
    keyTakeaways: [
      "Amortization schedules show exactly how much of your payment goes to interest vs. principal.",
      "Early loan payments are primarily interest, while later payments are primarily principal.",
      "Making extra principal payments early in the loan drastically reduces the total interest paid."
    ],
    relatedTerms: [
      { name: "EMI", slug: "emi" },
      { name: "Principal", slug: "principal" }
    ]
  },
  { 
    term: "Asset Allocation", 
    slug: "asset-allocation", 
    shortDef: "An investment strategy that aims to balance risk and reward by apportioning a portfolio's assets.",
    detailedDef: "Asset allocation is the strategy of dividing your investment portfolio across various asset classes, such as stocks, bonds, cash, and real estate. The goal is to balance risk and reward according to your personal financial goals, risk tolerance, and investment time horizon. Because different asset classes have different risk profiles and correlation (they don't all move up or down at the same time), a well-allocated portfolio protects investors from catastrophic losses during market downturns.",
    example: "A conservative 60-year-old approaching retirement might use a '60/40' asset allocation: 60% in stable, income-producing bonds and 40% in growth-oriented stocks. Conversely, a 25-year-old might use an '80/20' allocation heavily weighted in stocks for long-term growth.",
    keyTakeaways: [
      "Asset allocation is widely considered the most important determinant of long-term portfolio performance.",
      "Your ideal allocation shifts as you age, generally becoming more conservative.",
      "Asset allocation does not guarantee a profit or protect against loss, but it significantly smooths out volatility."
    ],
    relatedTerms: [
      { name: "Diversification", slug: "diversification" },
      { name: "Mutual Fund", slug: "mutual-fund" }
    ]
  },
  { 
    term: "Bear Market", 
    slug: "bear-market", 
    shortDef: "A prolonged period in which investment prices fall, accompanied by widespread pessimism.",
    detailedDef: "A bear market occurs when a broad market index (like the S&P 500) falls by 20% or more from its most recent recent high. Bear markets are typically associated with economic recessions, rising unemployment, and declining corporate profits. They are characterized by intense investor fear and pessimism, leading to panic selling. While painful in the short term, bear markets are a normal part of the economic cycle and historically present the best buying opportunities for long-term investors.",
    example: "During the 2008 Financial Crisis, the S&P 500 dropped by over 50% from its peak. Investors who panicked and sold their stocks suffered massive permanent losses, while those who held on or continued to buy eventually recovered all their money as the market rebounded into a historic bull run.",
    keyTakeaways: [
      "A bear market is strictly defined as a 20%+ drop from recent highs.",
      "They are driven by fear, economic slowdowns, or bursting asset bubbles.",
      "Historically, every single bear market has eventually been erased by a subsequent bull market."
    ],
    relatedTerms: [
      { name: "Bull Market", slug: "bull-market" },
      { name: "Inflation", slug: "inflation" }
    ]
  },
  { 
    term: "Bull Market", 
    slug: "bull-market", 
    shortDef: "A financial market in which prices are rising or are expected to rise.",
    detailedDef: "A bull market is a prolonged period in financial markets where asset prices (such as stocks, real estate, or crypto) continuously rise. While there is no strict metric like there is for a bear market, a bull market is generally recognized when an index rises 20% from its previous low. Bull markets are characterized by extreme investor optimism, strong economic growth, high employment rates, and high corporate profits.",
    example: "The longest bull market in US history lasted from March 2009 (the bottom of the Great Recession) until February 2020 (the start of the COVID-19 pandemic). During this 11-year period, the S&P 500 grew by over 400%.",
    keyTakeaways: [
      "Bull markets are fueled by optimism, strong economies, and high consumer confidence.",
      "They typically last much longer than bear markets.",
      "It is notoriously difficult to predict when a bull market will end, leading many to warn against 'timing the market'."
    ],
    relatedTerms: [
      { name: "Bear Market", slug: "bear-market" },
      { name: "Capital Gains", slug: "capital-gains" }
    ]
  },
  { 
    term: "CAGR", 
    slug: "cagr", 
    shortDef: "Compound Annual Growth Rate is the mean annual growth rate of an investment over a specified period.",
    detailedDef: "The Compound Annual Growth Rate (CAGR) is one of the most accurate ways to calculate and determine returns for anything that can rise or fall in value over time. Unlike an average return, CAGR takes into account the compounding effect of an investment. It answers the question: 'If my investment grew at exactly the same steady rate every single year, what would that rate be?'",
    formula: "CAGR = [ (Ending Value / Beginning Value) ^ (1 / Number of Years) ] - 1",
    example: "If you invest $10,000 and it grows to $15,000 in Year 1, then drops to $12,000 in Year 2, your simple average return might look positive, but your true CAGR over the 2 years is exactly 9.54%.",
    keyTakeaways: [
      "CAGR smooths out the volatility of year-to-year returns.",
      "It is the standard metric used to compare the historical performance of different assets or mutual funds.",
      "CAGR assumes that all dividends and interest are reinvested."
    ],
    relatedTerms: [
      { name: "XIRR", slug: "xirr" },
      { name: "Asset Allocation", slug: "asset-allocation" }
    ]
  },
  { 
    term: "Capital Gains", 
    slug: "capital-gains", 
    shortDef: "An increase in a capital asset's value, realizing a profit when the asset is sold.",
    detailedDef: "A capital gain refers to the profit derived from the sale of a capital asset, such as stocks, bonds, or real estate. It is the difference between the higher selling price and the lower purchase price. Capital gains are not realized—and therefore not taxed—until the asset is actually sold. Most countries tax capital gains differently depending on how long the asset was held before selling (Short-Term vs. Long-Term).",
    example: "If you buy 100 shares of Apple at $150 per share ($15,000 total) and sell them three years later at $200 per share ($20,000 total), you have realized a Long-Term Capital Gain of $5,000.",
    keyTakeaways: [
      "You don't owe capital gains tax until you actually sell the asset (realization).",
      "Long-Term Capital Gains (holding an asset for over 1 year) are typically taxed at much lower rates than Short-Term Capital Gains.",
      "Capital losses can often be used to offset capital gains, reducing your tax burden."
    ],
    relatedTerms: [
      { name: "Net Worth", slug: "net-worth" }
    ]
  },
  { 
    term: "Diversification", 
    slug: "diversification", 
    shortDef: "A risk management strategy that mixes a wide variety of investments within a portfolio.",
    detailedDef: "Diversification is the practice of spreading your investments around so that your exposure to any one type of asset is limited. This practice is designed to help reduce the volatility of your portfolio over time. The rationale behind this technique is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and pose a lower risk than any individual investment found within the portfolio.",
    example: "Instead of investing all your money in a single tech stock like Tesla, you diversify by buying a Broad Market Index Fund that holds 500 different companies across tech, healthcare, energy, and retail. If tech stocks crash, your healthcare and energy stocks might go up, balancing your portfolio.",
    keyTakeaways: [
      "Diversification is often called 'the only free lunch in investing'.",
      "It minimizes the risk of catastrophic loss from a single company going bankrupt.",
      "True diversification requires investing in assets that are not highly correlated."
    ],
    relatedTerms: [
      { name: "Asset Allocation", slug: "asset-allocation" },
      { name: "Mutual Fund", slug: "mutual-fund" }
    ]
  },
  { 
    term: "Dividend Yield", 
    slug: "dividend-yield", 
    shortDef: "A financial ratio that shows how much a company pays out in dividends each year relative to its stock price.",
    detailedDef: "The dividend yield is a financial ratio expressed as a percentage that shows how much a company pays out in dividends each year relative to its stock price. Yields are a measure of cash flow generated by an investment. For income-seeking investors (like retirees), dividend yield is often more important than capital appreciation.",
    formula: "Dividend Yield = (Annual Dividends Per Share / Price Per Share) × 100",
    example: "If Company XYZ's stock is trading at $100 per share and they pay an annual dividend of $4.00 per share, the dividend yield is 4%. If the stock price drops to $80 but the dividend stays at $4.00, the yield increases to 5%.",
    keyTakeaways: [
      "A high dividend yield can be attractive, but it can also be a warning sign if the company's stock price has recently crashed.",
      "Dividend payments are usually made quarterly in cash.",
      "Yields fluctuate inversely with the stock price."
    ],
    relatedTerms: [
      { name: "Capital Gains", slug: "capital-gains" }
    ]
  },
  { 
    term: "EBITDA", 
    slug: "ebitda", 
    shortDef: "Earnings Before Interest, Taxes, Depreciation, and Amortization.",
    detailedDef: "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It is a widely used metric for measuring a company's core operational profitability. By stripping out non-operating expenses (like interest on debt and taxes) and non-cash accounting expenses (like depreciation of factory equipment), EBITDA gives investors a clear view of how much cash the core business is actually generating from its day-to-day operations.",
    formula: "EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization",
    example: "A heavily indebted manufacturing company might show a negative Net Income on its tax returns because of massive interest payments and depreciation of its machinery. However, its EBITDA might be highly positive, showing that its core product is actually selling very profitably.",
    keyTakeaways: [
      "EBITDA allows analysts to compare companies with entirely different debt structures and tax situations.",
      "It is the standard metric used in corporate valuation and Mergers & Acquisitions.",
      "Critics argue it can be misleading because it ignores the very real costs of debt and replacing aging equipment."
    ],
    relatedTerms: [
      { name: "Amortization", slug: "amortization" }
    ]
  },
  { 
    term: "Fiat Money", 
    slug: "fiat-money", 
    shortDef: "Government-issued currency that is not backed by a physical commodity.",
    detailedDef: "Fiat money is a government-issued currency that is not backed by a physical commodity, such as gold or silver, but rather by the government that issued it. The value of fiat money is derived entirely from the relationship between supply and demand, and the stability of the issuing government. Most modern paper currencies, including the US Dollar, the Euro, and the Indian Rupee, are fiat currencies.",
    example: "Before 1971, the US Dollar was backed by physical gold (The Gold Standard). You could technically exchange a dollar for a specific amount of gold. Today, the dollar is fiat money—it has value simply because the US government declares it as legal tender and people trust it.",
    keyTakeaways: [
      "Fiat money has no intrinsic utility or value—it is valuable because of collective trust.",
      "Central banks have the power to print unlimited amounts of fiat money, which can lead to hyperinflation if mismanaged.",
      "Fiat replaced the Gold Standard to give governments more control over the economy during crises."
    ],
    relatedTerms: [
      { name: "Inflation", slug: "inflation" }
    ]
  },
  { 
    term: "Inflation", 
    slug: "inflation", 
    shortDef: "The rate at which the general level of prices for goods and services is rising.",
    detailedDef: "Inflation is the gradual loss of purchasing power over time, measured as a percentage rate at which the general level of prices for goods and services is rising. When inflation occurs, each unit of currency buys fewer goods and services. A small amount of inflation (around 2-3% per year) is generally considered a sign of a healthy, growing economy, but hyperinflation can destroy a nation's wealth.",
    example: "If the inflation rate is 5% per year, a basket of groceries that costs $100 today will cost $105 next year. If your salary doesn't also increase by 5%, you have effectively taken a pay cut in real purchasing power.",
    keyTakeaways: [
      "Inflation is the silent killer of wealth if your money is kept in cash under a mattress.",
      "To truly grow wealth, your investments must generate a return that is higher than the inflation rate.",
      "Central banks raise interest rates to cool down high inflation."
    ],
    relatedTerms: [
      { name: "Fiat Money", slug: "fiat-money" },
      { name: "CAGR", slug: "cagr" }
    ]
  },
  { 
    term: "Liquid Asset", 
    slug: "liquid-asset", 
    shortDef: "An asset that can readily be converted into cash in a short amount of time with little to no loss in value.",
    detailedDef: "Liquidity refers to how easily and quickly an asset can be converted to physical cash without affecting its market price. A liquid asset is one that you can sell immediately for fair market value. Cash is the most liquid asset. High liquidity is crucial for emergency funds, as you need immediate access to capital during a crisis without taking a massive loss.",
    example: "A checking account or a widely traded stock like Microsoft are highly liquid assets—you can convert them to cash in seconds. A house or a rare painting are highly illiquid assets—it could take months to find a buyer, and if you need to sell quickly, you might have to accept a much lower price.",
    keyTakeaways: [
      "Cash is the ultimate liquid asset.",
      "Emergency funds should always be kept in highly liquid assets (like a savings account).",
      "Illiquid assets often demand a 'liquidity premium' (higher expected returns) to compensate investors for locking up their money."
    ],
    relatedTerms: [
      { name: "Net Worth", slug: "net-worth" },
      { name: "Asset Allocation", slug: "asset-allocation" }
    ]
  },
  { 
    term: "Mutual Fund", 
    slug: "mutual-fund", 
    shortDef: "An investment vehicle made up of a pool of money collected from many investors.",
    detailedDef: "A mutual fund is a type of financial vehicle made up of a pool of money collected from thousands of investors to invest in securities like stocks, bonds, money market instruments, and other assets. Mutual funds are operated by professional money managers, who allocate the fund's assets and attempt to produce capital gains or income for the fund's investors. They offer everyday people an easy way to achieve instant diversification without needing to buy hundreds of individual stocks themselves.",
    example: "Instead of trying to pick the 10 best tech companies yourself, you buy a single share of a 'Technology Mutual Fund'. The fund manager takes your money, combines it with millions of other investors, and buys all the top tech companies. You instantly own a tiny fraction of all of them.",
    keyTakeaways: [
      "Mutual funds provide instant, cheap diversification for retail investors.",
      "Actively managed mutual funds charge fees (Expense Ratios) to pay the professional managers.",
      "Passive Index Funds are a type of mutual fund that simply tracks the market automatically with very low fees."
    ],
    relatedTerms: [
      { name: "Diversification", slug: "diversification" },
      { name: "Asset Allocation", slug: "asset-allocation" }
    ]
  },
  { 
    term: "Net Worth", 
    slug: "net-worth", 
    shortDef: "The value of all your assets minus all your liabilities.",
    detailedDef: "Net worth is the most accurate single metric to determine a person's true financial health. It is calculated simply by taking the value of everything you own (your assets) and subtracting everything you owe (your liabilities/debts). A high income does not necessarily mean a high net worth if that person spends all their money or is drowning in debt.",
    formula: "Net Worth = Total Assets - Total Liabilities",
    example: "If you own a $400,000 house, have $50,000 in investments, and $10,000 in a checking account, your Total Assets are $460,000. If you owe $300,000 on your mortgage and $20,000 on a student loan, your Total Liabilities are $320,000. Your Net Worth is $140,000.",
    keyTakeaways: [
      "Net Worth is a snapshot of your wealth at a specific moment in time.",
      "It is entirely possible (and common) for young graduates with student loans to have a negative net worth.",
      "Tracking your net worth over time is the best way to measure financial progress."
    ],
    relatedTerms: [
      { name: "Liquid Asset", slug: "liquid-asset" },
      { name: "Capital Gains", slug: "capital-gains" }
    ]
  },
  { 
    term: "XIRR", 
    slug: "xirr", 
    shortDef: "Extended Internal Rate of Return; a metric to calculate return on investments with multiple cash flows.",
    detailedDef: "Extended Internal Rate of Return (XIRR) is a powerful mathematical function used to calculate the annualized yield of an investment where cash is put in and taken out at irregular intervals. While CAGR is great for a single lump-sum investment, it fails completely if you are making monthly SIPs or randomly withdrawing money. XIRR solves this by assigning a specific date to every single cash flow, giving you the true, exact annualized return of a messy, real-world portfolio.",
    example: "You invest $1,000 in January, pull out $200 in March, invest $5,000 in September, and check your balance in December. Because the money was invested for completely different lengths of time, only XIRR can accurately tell you what your annualized percentage return was.",
    keyTakeaways: [
      "XIRR is the most accurate metric for tracking the returns of a Systematic Investment Plan (SIP).",
      "It accounts for the 'Time Value of Money'—money invested earlier impacts the return more than money invested recently.",
      "It is a built-in function in Excel and Google Sheets heavily relied upon by financial planners."
    ],
    relatedTerms: [
      { name: "CAGR", slug: "cagr" },
      { name: "Mutual Fund", slug: "mutual-fund" }
    ]
  }
];
