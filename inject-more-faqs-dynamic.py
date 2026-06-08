import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'

faqs_extra = {
    'inflation-calculator': [
        ('What is hyperinflation?', 'Hyperinflation is extremely rapid, out-of-control inflation, usually exceeding 50% per month. It essentially renders the national currency worthless, as seen historically in Zimbabwe or Weimar Germany.'),
        ('Does inflation benefit anyone?', 'Yes, inflation can benefit borrowers who have fixed-rate debts, such as a 30-year fixed mortgage, because they pay back the loan with money that is worth less than when they borrowed it.')
    ],
    'cagr-calculator': [
        ('How is CAGR different from IRR?', 'CAGR calculates the return of a single lump-sum investment over time. IRR (Internal Rate of Return) calculates the return when there are multiple cash inflows and outflows at different times.'),
        ('Can CAGR be misleading?', 'Yes, because it smooths out volatility. An investment could drop 50% one year and recover the next, showing a positive CAGR, but an investor might have panicked and sold during the drop.')
    ],
    'compound-interest-calculator': [
        ('What is the difference between APR and APY?', 'APR is the simple interest rate without compounding. APY (Annual Percentage Yield) includes the effect of compounding, showing the true amount you will earn or pay.'),
        ('Can I lose money with compound interest?', 'Yes, if you are the borrower (like with credit card debt), compound interest works against you, rapidly increasing the amount you owe if you only make minimum payments.')
    ],
    'nps-calculator': [
        ('What are the asset classes in NPS?', 'NPS allows investment across four asset classes: Equity (E), Corporate Bonds (C), Government Securities (G), and Alternative Investment Funds (A).'),
        ('Can I open more than one NPS account?', 'No, NPS operates on a unique PRAN (Permanent Retirement Account Number). You can only have one active PRAN in your lifetime.')
    ],
    'ppf-calculator': [
        ('Can I take a loan against my PPF account?', 'Yes, you can take a loan against your PPF balance between the 3rd and 6th financial year of opening the account. The interest rate is typically 1% above the prevailing PPF rate.'),
        ('What happens to PPF if I become an NRI?', 'If your residential status changes to NRI during the 15-year tenure, you can continue the account until maturity on a non-repatriation basis, but you cannot extend it further.')
    ],
    'rd-calculator': [
        ('Is an RD better than a Mutual Fund SIP?', 'RD offers guaranteed, risk-free returns but usually fails to beat inflation. SIPs carry market risk but historically offer significantly higher long-term returns.'),
        ('Can I change the RD installment amount later?', 'No, once an RD is opened with a specific monthly installment, that amount is locked and cannot be changed for the duration of the tenure.')
    ],
    'ssy-calculator': [
        ('Can an SSY account be transferred?', 'Yes, the account can be easily transferred anywhere in India, from one post office to another, or from a post office to an authorized bank branch.'),
        ('What if the girl child marries before age 21?', 'If the girl marries after turning 18 but before the 21-year maturity period, the SSY account can be prematurely closed and the funds withdrawn.')
    ],
    'step-up-sip-calculator': [
        ('Can I cap the maximum Step-Up amount?', 'Yes, most AMCs allow you to set a "Maximum SIP Amount" cap. Once your stepped-up SIP reaches this ceiling, it will continue at that flat rate indefinitely.'),
        ('Is Step-Up SIP good for beginners?', 'Absolutely. Beginners often start with small salaries. A Step-Up SIP allows them to start small but automatically scale their investments as their careers progress.')
    ],
    'mutual-fund-calculator': [
        ('What is an Exit Load?', 'It is a penalty fee (usually around 1%) charged by the AMC if you redeem your mutual fund units before a specified period, typically 1 year for equity funds.'),
        ('What is NAV?', 'Net Asset Value (NAV) represents the per-unit price of the mutual fund. It is calculated by dividing the total value of the fund\'s assets by the total number of outstanding units.')
    ],
    'simple-interest-calculator': [
        ('Why do banks prefer compound interest over simple interest?', 'Banks prefer compound interest for loans because it allows them to earn interest on unpaid interest, maximizing their profits over the tenure of the loan.'),
        ('How do I convert a monthly interest rate to an annual one?', 'For simple interest, you literally just multiply the monthly rate by 12. For example, 1% per month equals exactly 12% per annum.')
    ],
    'car-loan-emi': [
        ('Is my car loan fixed or floating rate?', 'In India, almost all car loans are offered at fixed interest rates, meaning your EMI will remain absolutely constant throughout the entire tenure.'),
        ('What is hypothecation?', 'Hypothecation means the car serves as collateral for the loan. The registration certificate (RC) will bear the bank\'s name until the loan is fully repaid and a No Objection Certificate (NOC) is issued.')
    ],
    'personal-loan-emi': [
        ('What is a balance transfer for personal loans?', 'If you find a bank offering a significantly lower interest rate, you can transfer your outstanding personal loan balance to them, reducing your future EMI burden.'),
        ('Can self-employed individuals get a personal loan?', 'Yes, but the documentation is more rigorous. Banks typically require 2-3 years of audited financials (ITR, P&L, Balance Sheet) to verify stable income.')
    ],
    'education-loan-emi': [
        ('What happens if I cannot get a job after graduation?', 'Most banks offer a grace period (moratorium). If you still cannot find a job, you may need to request an extension or restructuring, though this will accumulate more interest.'),
        ('Can an education loan cover study abroad expenses?', 'Yes! Education loans for studying abroad are very common and usually have much higher limits to cover expensive foreign tuition and living costs.')
    ],
    'loan-against-property': [
        ('Can I rent out the property pledged for LAP?', 'Yes, since you retain ownership and possession of the property, you are completely free to live in it or rent it out while repaying the loan.'),
        ('What happens if I default on a LAP?', 'Because it is a secured loan, persistent defaults give the bank the legal right (under the SARFAESI Act in India) to seize and auction your property to recover their dues.')
    ],
    'loan-eligibility': [
        ('Does a previous loan rejection affect my eligibility?', 'Yes, every loan application triggers a hard inquiry on your credit report. Multiple rejections in a short period will lower your credit score and future eligibility.'),
        ('How does my age affect loan eligibility?', 'Banks typically want the loan fully repaid by your retirement age (usually 60). Therefore, older applicants will only be eligible for shorter loan tenures.')
    ],
    'two-wheeler-loan': [
        ('Do two-wheeler loans have processing fees?', 'Yes, banks usually charge a non-refundable processing fee ranging from 1% to 3% of the loan amount, which is either deducted from the disbursement or paid upfront.'),
        ('Can I sell my bike before paying off the loan?', 'No. You cannot legally transfer the RC to a new buyer until you clear the loan and obtain an NOC (No Objection Certificate) from the bank to remove the hypothecation.')
    ],
    'sbi-pension-plan': [
        ('Are the premiums paid towards the SBI Pension Plan tax-deductible?', 'Yes, premiums paid are eligible for tax deduction under Section 80CCC of the Income Tax Act, within the overall limit of ₹1.5 Lakhs under Section 80C.'),
        ('Can I surrender my SBI Life Pension Plan early?', 'Yes, but surrendering before the end of the lock-in period (typically 5 years for ULIPs) will result in significant surrender charges and the funds will be transferred to a discontinued policy fund.')
    ],
    'post-office-mis': [
        ('Can an NRI invest in POMIS?', 'No, the Post Office Monthly Income Scheme is exclusively available to resident Indians. Non-Resident Indians (NRIs) cannot open new POMIS accounts.'),
        ('Is there a TDS deduction on POMIS interest?', 'No, the Post Office does not deduct TDS on POMIS interest. However, the interest is fully taxable in the hands of the investor, who must declare it while filing their ITR.')
    ],
    'scss-calculator': [
        ('Can I extend my SCSS account after 5 years?', 'Yes, the SCSS account can be extended once for an additional block of 3 years. You must submit the extension request within 1 year of maturity.'),
        ('What happens to the SCSS account in case of the depositor\'s death?', 'The account is closed, and the corpus along with accrued interest is paid to the registered nominee or legal heirs without any premature withdrawal penalties.')
    ],
    'gratuity-calculator': [
        ('What is the minimum tenure required to claim gratuity?', 'You must complete exactly 4 years and 240 days (which legally constitutes 5 years of continuous service) in a single organization to be eligible for gratuity.'),
        ('Is gratuity paid on resignation or only on retirement?', 'Gratuity is payable in both cases. Whether you resign, retire, or are terminated (without gross misconduct), you are entitled to it as long as you meet the 5-year tenure requirement.')
    ],
    'epf-calculator': [
        ('Can I have two EPF accounts?', 'No, your EPF accounts are linked to your Universal Account Number (UAN). When you switch jobs, you should transfer your old EPF balance to your new EPF account under the same UAN.'),
        ('What happens to my EPF if I quit working completely?', 'If you remain unemployed for more than 2 months, you are allowed to withdraw 100% of your EPF corpus to support yourself.')
    ],
    'hra-calculator': [
        ('Can I claim HRA if I share the rent with a roommate?', 'Yes, you can claim HRA for your proportionate share of the rent. However, you must have a rent agreement that clearly states your share, or separate rent receipts.'),
        ('Is HRA part of my Basic Salary?', 'No, HRA (House Rent Allowance) is a completely separate component of your total salary structure, specifically provided to help meet rental accommodation expenses.')
    ],
    'nsc-calculator': [
        ('Can an NRI purchase National Savings Certificates?', 'No, NRIs are not allowed to purchase new NSCs. However, if they bought them while they were resident Indians, they can hold them until maturity.'),
        ('Is NSC transferable?', 'Yes, an NSC can be transferred from one person to another, but only once during its entire 5-year tenure (except in special cases like death of the holder).')
    ],
    'kvp-calculator': [
        ('Does KVP offer any tax benefits?', 'No, unlike NSC or PPF, investments in Kisan Vikas Patra do not qualify for any tax deductions under Section 80C, and the interest earned is fully taxable.'),
        ('Can a KVP certificate be encashed prematurely?', 'Yes, premature encashment is allowed after a lock-in period of 2.5 years (30 months) from the date of issue.')
    ],
    'crypto-profit-calculator': [
        ('What is a Maker and Taker fee?', 'When you place a limit order that adds liquidity to the exchange, you pay a lower "Maker" fee. If you place a market order that immediately executes, you pay a higher "Taker" fee.'),
        ('Are stablecoins immune from crypto taxes?', 'No. While stablecoins (like USDT) are pegged to the dollar, converting Bitcoin into USDT is still considered a taxable crypto-to-crypto sale in most jurisdictions.')
    ],
    'crypto-tax-calculator': [
        ('Can I gift cryptocurrency tax-free?', 'In India, gifting crypto to specific blood relatives is exempt from tax. However, if gifted to non-relatives and the value exceeds ₹50,000, it is taxed as income from other sources.'),
        ('How does the IRS view cryptocurrency in the US?', 'The IRS classifies cryptocurrency as "property," meaning every single time you sell, trade, or buy something with crypto, you trigger a capital gains tax event.')
    ],
    'impermanent-loss-calculator': [
        ('Do trading fees compensate for Impermanent Loss?', 'Often, yes! Liquidity providers earn a percentage of all trading fees generated by the pool. In high-volume pools, the accrued fees can vastly exceed the impermanent loss.'),
        ('Is Impermanent Loss a factor in single-sided staking?', 'No. Impermanent loss only occurs in liquidity pools involving pairs of different assets (like ETH/USDC) where the ratio of the assets shifts based on price movements.')
    ],
    'forex-pip-calculator': [
        ('What is a Standard Lot in Forex?', 'A standard lot is 100,000 units of the base currency. For example, buying 1 standard lot of EUR/USD means you are buying €100,000.'),
        ('How much is 1 pip worth in a Standard Lot?', 'If the quote currency (the second currency in the pair) is USD, a 1 pip move in a standard lot is always worth exactly $10.')
    ],
    'margin-calculator': [
        ('What is Free Margin?', 'Free Margin is the amount of money in your trading account that is NOT currently locked up in active trades. It is the equity available to open new positions or absorb losses.'),
        ('Does high margin increase my profit?', 'No, margin only dictates how much buying power you have. A 100x leverage trade does not make 100x more profit per pip, it just allows you to trade 100x larger lot sizes.')
    ],
    'break-even-calculator': [
        ('What is the Margin of Safety?', 'It is the difference between your actual expected sales and your break-even sales. A high margin of safety means your business can absorb a large drop in sales before making a loss.'),
        ('Can Break-Even Analysis be used for services?', 'Absolutely. For a service business like consulting, fixed costs are software subscriptions and rent, while variable costs might be server costs or sub-contractor fees per project.')
    ],
    'roi-calculator': [
        ('Is ROI the same as Profit Margin?', 'No. Profit Margin measures profitability relative to revenue (Sales). ROI measures profitability relative to the capital you invested to generate those sales.'),
        ('What is Return on Equity (ROE)?', 'ROE is a specific type of ROI used in corporate finance. It measures a company\'s net income divided by the total shareholders\' equity, showing how efficiently the company uses investor funds.')
    ],
    'profit-margin-calculator': [
        ('How can I increase my profit margin without raising prices?', 'You can negotiate better rates with suppliers to lower COGS, automate repetitive tasks to reduce labor costs, or aggressively cut unnecessary administrative overhead.'),
        ('Is Operating Margin different from Net Margin?', 'Yes. Operating Margin deducts the cost of goods sold AND operating expenses (like rent and salaries) but ignores interest and taxes, focusing purely on core business efficiency.')
    ],
    'burn-rate-calculator': [
        ('What is the difference between Gross and Net Burn?', 'Gross burn is the total amount of cash a company spends in a month. Net burn is the cash spent MINUS any incoming revenue. Investors primarily care about Net Burn.'),
        ('When should a startup worry about its runway?', 'Founders should typically start raising their next round of funding when they have 6 to 9 months of runway left, as fundraising can easily take several months to close.')
    ],
    'startup-equity-calculator': [
        ('What is a Vesting Schedule?', 'Vesting ensures founders and employees earn their equity over time, usually a 4-year period. If someone leaves after 1 year, they only walk away with 25% of their total granted equity.'),
        ('What is a 1-year Cliff?', 'A cliff is a probationary period in a vesting schedule. If you have a 1-year cliff and you leave the company at 11 months, you get zero equity. On day 365, your first 25% vests instantly.')
    ],
    'business-valuation': [
        ('What is the difference between Pre-Money and Post-Money valuation?', 'Pre-money is the company\'s value BEFORE an investment round. Post-money is simply the Pre-money valuation PLUS the new cash injected by investors.'),
        ('How does an angel investor value a startup with zero revenue?', 'Early-stage startups are valued based on the founder\'s experience, the size of the target market, the maturity of the MVP (Minimum Viable Product), and comparable recent deals in the same sector.')
    ],
    'mutual-fund-returns': [
        ('What is a Systematic Transfer Plan (STP)?', 'STP allows you to invest a lump sum in a safe Debt fund, and automatically transfer a fixed amount every month into an Equity fund, mitigating the risk of market timing.'),
        ('What is a Systematic Withdrawal Plan (SWP)?', 'SWP is the reverse of a SIP. It allows you to withdraw a fixed amount from your mutual fund corpus every month, which is incredibly popular for generating a regular pension in retirement.')
    ],
    'stock-profit': [
        ('What is the difference between an Intraday and Delivery trade?', 'Intraday (Day Trading) means buying and selling the stock on the exact same day. Delivery means buying the stock and holding it in your Demat account for at least one night.'),
        ('Can dividends cover my stock losses?', 'Sometimes! If a stock drops 5% over a year, but pays a massive 8% dividend yield, your total return is still a positive 3%. Total Return = Capital Appreciation + Dividends.')
    ],
    'dividend-yield': [
        ('What is the Dividend Payout Ratio?', 'It is the percentage of a company\'s net income that is paid out to shareholders as dividends. A ratio of 50% means the company keeps half its profit for growth and distributes the other half.'),
        ('What is the Ex-Dividend Date?', 'It is the cut-off date. To receive an upcoming dividend, you must buy the stock before the ex-dividend date. If you buy on or after this date, the previous owner gets the dividend.')
    ],
    'discount-calculator': [
        ('What is a volume discount?', 'A volume discount is a financial incentive offered to buyers who purchase goods in bulk quantities. "Buy 100 units and get 20% off the unit price."'),
        ('How do retailers calculate the "original" price?', 'Sometimes retailers artificially inflate the "original" price just before a sale, making a 50% discount seem massive, a controversial practice known as anchor pricing.')
    ],
    'ebitda-calculator': [
        ('Can EBITDA be negative?', 'Yes, a negative EBITDA means the company’s core operations are losing cash before even accounting for debt, taxes, or equipment wear and tear.'),
        ('Why do tech companies love highlighting EBITDA?', 'Tech and SaaS companies often have massive upfront R&D and server infrastructure costs. Highlighting EBITDA allows them to show operational profitability while ignoring those massive sunk costs.')
    ],
    'stamp-duty': [
        ('Is stamp duty calculated on market value or agreement value?', 'Stamp duty is calculated on whichever is higher: the registered agreement value or the government-determined Ready Reckoner / Circle Rate of the property.'),
        ('Can I claim tax deduction on stamp duty?', 'Yes, the stamp duty and registration charges paid towards the purchase of a new house can be claimed as a tax deduction under Section 80C of the Income Tax Act.')
    ]
}

# Now we want to insert these two new FAQs into the dynamic-seo.tsx file
# Inside <FAQAccordion faqs={[ ... ]} />
# It is an array of objects. We can just find the closing bracket `]} />` for the specific slug's block,
# and insert the two new ones right before it.

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

parts = text.split('if (slug === "')
new_text = parts[0]
for part in parts[1:]:
    current_slug = part.split('"', 1)[0]
    if current_slug in faqs_extra:
        faq_list = faqs_extra[current_slug]
        # Generate the JS snippet to append
        append_str = ""
        for q, a in faq_list:
            safe_q = q.replace('"', '\\"')
            safe_a = a.replace('"', '\\"')
            append_str += f',\n          {{\n            question: "{safe_q}",\n            answer: "{safe_a}"\n          }}'
        
        # We need to find the `]} />` belonging to the <FAQAccordion inside this part
        # Let's use a regex that matches `} \n        ]} />` or something similar.
        # Actually, the block ends with `} />`. Let's just find `]} />` and replace the first occurrence.
        part = part.replace(']} />', append_str + '\n        ]} />', 1)
        
    new_text += 'if (slug === "' + part

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Injected extra FAQs into dynamic calculators!")
