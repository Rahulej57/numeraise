import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'

faqs = {
    'mutual-fund-returns': [
        ('What is an Absolute Return?', 'Absolute return simply measures the point-to-point growth of your investment without considering the time it took. It is useful for short-term trades under 1 year.'),
        ('Why is XIRR used for Mutual Funds?', 'Because SIPs involve multiple cash flows at different times. XIRR is the only accurate way to calculate the annualized return of irregular investments and withdrawals.'),
        ('Do I pay tax on mutual fund returns?', 'Yes, equity funds are subject to 10% Long-Term Capital Gains (LTCG) tax over ₹1 Lakh, and 15% Short-Term Capital Gains (STCG) tax.')
    ],
    'stock-profit': [
        ('Does this calculator include brokerage fees?', 'No, you should manually deduct your specific brokerage, STT, and exchange transaction charges to find your true net profit.'),
        ('What is the difference between Realized and Unrealized profit?', 'Unrealized profit is the paper gain on stocks you still hold. Realized profit is the actual cash gain you locked in by selling the shares.'),
        ('How do I minimize tax on stock profits?', 'Holding your stocks for more than 1 year qualifies them for Long-Term Capital Gains, which has a significantly lower tax rate than short-term trading.')
    ],
    'dividend-yield': [
        ('Is a high dividend yield always good?', 'Not necessarily. A very high yield could be a "dividend trap," where the stock price has plummeted due to underlying business issues, artificially inflating the yield percentage.'),
        ('Do companies have to pay dividends?', 'No, companies are under no legal obligation to pay dividends. Many fast-growing tech companies prefer to reinvest their cash back into the business.'),
        ('Are dividends taxable?', 'Yes, in most jurisdictions, dividends are taxed as ordinary income. In India, dividends are taxed according to your individual income tax slab.')
    ],
    'personal-loan-calculator': [
        ('Can I prepay my personal loan?', 'Most banks allow prepayment, but usually charge a foreclosure penalty ranging from 2% to 5% of the outstanding principal amount.'),
        ('Does a personal loan require collateral?', 'No, personal loans are unsecured. This is why their interest rates are significantly higher than home or car loans.'),
        ('How is the EMI calculated?', 'EMI is calculated using the reducing balance method. Initially, a large portion of your EMI goes towards interest, and a smaller portion goes towards principal reduction.')
    ],
    'education-loan-calculator': [
        ('What is a moratorium period?', 'It is a grace period, typically the duration of your course plus 6 months, during which you are not required to make EMI payments. However, simple interest usually accrues during this time.'),
        ('Are education loans tax-deductible?', 'Yes! Under Section 80E of the Income Tax Act in India, the entire interest portion of your EMI is fully tax-deductible for up to 8 years.'),
        ('Can I get a loan for living expenses?', 'Yes, comprehensive education loans often cover tuition fees, hostel fees, books, travel, and even a laptop.')
    ],
    'loan-refinance': [
        ('What are the hidden costs of refinancing?', 'When you refinance, you usually have to pay loan processing fees to the new bank, legal valuation charges, and sometimes a foreclosure penalty to your old bank.'),
        ('When is the best time to refinance?', 'The ideal time is when market interest rates have dropped by at least 0.5% to 1% compared to your current rate, and you are still in the early years of your loan tenure.'),
        ('Does refinancing hurt my credit score?', 'It causes a temporary, minor dip because the new lender performs a hard inquiry on your credit report. However, successfully managing the new loan will quickly restore it.')
    ],
    'credit-card-payoff': [
        ('Why is paying just the minimum balance dangerous?', 'The minimum balance usually only covers the monthly interest and a tiny fraction of the principal. Paying only the minimum can keep you in debt for decades.'),
        ('What is the snowball method?', 'It is a debt repayment strategy where you pay off your smallest credit card balances first for psychological momentum, while paying minimums on the rest.'),
        ('What is the avalanche method?', 'It is a mathematically optimal strategy where you aggressively pay off the credit card with the highest interest rate first, saving you the most money overall.')
    ],
    'pomis-calculator': [
        ('Can I open a joint POMIS account?', 'Yes, up to three adults can open a joint account. The maximum limit for a single account is ₹9 Lakhs, and for a joint account, it is ₹15 Lakhs.'),
        ('Is the monthly interest tax-free?', 'No, the monthly interest earned from the Post Office Monthly Income Scheme is fully taxable according to your income tax slab.'),
        ('Does POMIS offer Section 80C deductions?', 'Unlike PPF or NSC, the principal amount deposited in POMIS does NOT qualify for tax deductions under Section 80C.')
    ],
    'hra-exemption': [
        ('What if my rent is less than ₹1,00,000 a year?', 'If your annual rent is below ₹1 Lakh, you do not need to provide your landlord\'s PAN card to your employer to claim HRA.'),
        ('Can I claim HRA if I live in my own house?', 'No, HRA exemption is strictly for employees who actually pay rent for their accommodation. If you own the house you live in, the entire HRA allowance is taxable.'),
        ('Is HRA fully exempt from tax?', 'No, the exemption is limited to the lowest of three specific calculations: actual HRA received, 50% (or 40%) of Basic Salary, or Rent Paid minus 10% of Basic Salary.')
    ],
    'capital-gains-tax': [
        ('What is the difference between Long-Term and Short-Term?', 'For equity, holding over 1 year is Long-Term (LTCG). For real estate, it is 2 years. Short-Term gains are generally taxed at higher rates.'),
        ('Is there a tax exemption limit for equity LTCG?', 'Yes, in India, Long-Term Capital Gains on listed equities and equity mutual funds are tax-free up to ₹1 Lakh per financial year.'),
        ('Can I offset capital losses?', 'Yes, short-term capital losses can be set off against both short-term and long-term gains. However, long-term capital losses can ONLY be set off against long-term gains.')
    ],
    'tds-calculator': [
        ('Can I claim back deducted TDS?', 'Yes! If your total annual tax liability is lower than the total TDS deducted, you can claim a refund by filing your Income Tax Return (ITR).'),
        ('How do I avoid TDS on fixed deposits?', 'If your total income is below the taxable limit, you can submit Form 15G (or Form 15H for senior citizens) to your bank to prevent them from deducting TDS.'),
        ('Is TDS the same as final tax?', 'No, TDS is just an advance tax collected at the source of income. You must still calculate your final tax liability and pay any remaining balance (or claim a refund).')
    ],
    'advance-tax': [
        ('Who is required to pay Advance Tax?', 'If your total estimated tax liability for the year (after subtracting TDS) is ₹10,000 or more, you are legally required to pay advance tax in installments.'),
        ('What happens if I miss an Advance Tax deadline?', 'You will be liable to pay penal interest under Sections 234B and 234C of the Income Tax Act, which is 1% per month on the defaulted amount.'),
        ('Do senior citizens have to pay Advance Tax?', 'Resident senior citizens (age 60 or above) who do NOT have any income from a business or profession are exempt from paying advance tax.')
    ],
    'health-insurance-calculator': [
        ('Does a higher premium mean a better policy?', 'Not always. A high premium might be due to your age or pre-existing conditions, rather than better coverage. Always compare the inclusions and exclusions.'),
        ('What is a waiting period?', 'It is the time you must wait before the insurance covers specific illnesses or pre-existing conditions, typically ranging from 2 to 4 years.'),
        ('Are health insurance premiums tax-deductible?', 'Yes, under Section 80D, you can claim deductions up to ₹25,000 for yourself/family, and an additional ₹50,000 if you pay premiums for senior citizen parents.')
    ],
    'life-insurance-premium': [
        ('Why are term insurance premiums so low?', 'Term insurance provides pure death benefit coverage with no maturity return. Since the insurer only pays out if the insured dies, the risk is lower, resulting in cheap premiums.'),
        ('What is Return of Premium (ROP)?', 'ROP policies promise to return all the premiums you paid if you survive the policy term. However, the initial premiums for ROP are significantly higher than standard term plans.'),
        ('Does smoking increase my premium?', 'Yes! Smokers are statistically at a much higher risk of critical illness and death, so insurers typically charge them 30% to 50% more than non-smokers.')
    ],
    'human-life-value': [
        ('What is the purpose of Human Life Value?', 'HLV calculates the present value of all your future income, helping you determine exactly how much life insurance your family would need to replace your earnings if you pass away.'),
        ('Should my insurance cover my debts as well?', 'Absolutely. Your total insurance cover should equal your HLV plus all outstanding loans (home loan, car loan) minus any existing investments and savings.'),
        ('Does HLV change over time?', 'Yes! As you get older, your remaining working years decrease, which lowers your HLV. However, if your salary increases rapidly, your HLV might go up.')
    ],
    'fire-calculator': [
        ('What is the 4% Rule?', 'The 4% rule suggests that if you withdraw 4% of your retirement portfolio in your first year of retirement, and adjust for inflation thereafter, your money should last at least 30 years.'),
        ('Is the 4% Rule safe for Early Retirement?', 'Many financial experts argue that for early retirement (which may last 40-50 years), a more conservative withdrawal rate of 3% or 3.5% is much safer.'),
        ('What is Coast FIRE?', 'Coast FIRE means you have front-loaded your investments so much that even if you never contribute another dollar, compound interest will grow it to your target number by traditional retirement age.')
    ],
    'pension-calculator': [
        ('Is my pension fully taxable?', 'It depends. Uncommuted pension (regular monthly payouts) is fully taxable as salary. Commuted pension (lump sum withdrawal) may be partially or fully exempt under Section 10(10A).'),
        ('What is inflation risk in retirement?', 'Inflation quietly destroys purchasing power. A fixed ₹50,000 pension might easily cover your expenses today, but in 15 years, it will buy roughly half of what it does now.'),
        ('Should I buy an annuity with my retirement corpus?', 'Annuities provide absolute peace of mind with guaranteed monthly payouts until death. However, they generally offer lower returns compared to managing a balanced portfolio yourself.')
    ],
    'markup-calculator': [
        ('Is Markup the same as Profit Margin?', 'No! Markup is based on Cost, while Margin is based on Revenue. A 100% markup on a $50 item gives a selling price of $100. The profit is $50, which is a 50% profit margin.'),
        ('Why do retailers use markup instead of margin?', 'Retailers find it mathematically easier to apply a standard markup multiplier (like 1.5x or 2x) to the wholesale cost of hundreds of items rather than calculating complex margins.'),
        ('Can a markup be over 100%?', 'Yes! Cosmetics, luxury goods, and restaurant beverages routinely have markups of 200%, 300%, or even higher.')
    ],
    'discount-calculator': [
        ('Can multiple discounts be added together?', 'No! If a store offers "50% off plus an extra 20% off", it is NOT a 70% discount. The 20% applies to the new discounted price. The true discount is actually 60%.'),
        ('Why do retailers price things at $99 instead of $100?', 'It is a psychological pricing strategy. The human brain processes numbers from left to right, so $99 feels significantly cheaper than $100, even though the difference is minimal.'),
        ('What is a cash discount?', 'In B2B transactions, sellers often offer a 1% or 2% cash discount if the invoice is paid immediately rather than in 30 days, to improve cash flow.')
    ],
    'ebitda-calculator': [
        ('What does EBITDA actually measure?', 'EBITDA measures a company\'s core operational profitability by stripping away the effects of financing (interest), accounting rules (depreciation/amortization), and government rates (taxes).'),
        ('Can EBITDA be misleading?', 'Yes. Warren Buffett notoriously dislikes EBITDA because it ignores Depreciation. Capital-intensive businesses MUST spend money replacing equipment, making EBITDA look far better than actual cash flow.'),
        ('Why is EBITDA used in valuation?', 'It allows buyers to compare the profitability of two companies in the same industry, ignoring differences in how they are financed or what tax jurisdiction they are in.')
    ],
    'stamp-duty': [
        ('What is Stamp Duty?', 'Stamp duty is a mandatory tax levied by the state government on legal documents, primarily to validate the registration of property transactions.'),
        ('Who is responsible for paying Stamp Duty?', 'Usually, the buyer is responsible for paying the stamp duty and registration charges. It is not included in the property\'s basic selling price.'),
        ('Are there discounts for women property buyers?', 'Yes, to empower women ownership, many Indian states offer a 1% to 2% concession on stamp duty if the property is registered in a woman\'s name.')
    ],
    'crypto-profit': [
        ('Are crypto exchange fees significant?', 'Yes, while they seem small (0.1% to 1%), active traders who execute hundreds of trades a week can lose a massive chunk of their overall profit to exchange taker fees.'),
        ('Do I pay tax on unrealized crypto gains?', 'No. You only incur a taxable event when you sell the crypto for fiat, trade it for another crypto, or use it to purchase goods and services.'),
        ('What is Slippage?', 'Slippage is the difference between the expected price of a trade and the price at which the trade is actually executed, often occurring in low-liquidity coins during high volatility.')
    ],
    'forex-pip': [
        ('What is the difference between a Pip and a Pipette?', 'A pip is the standard 4th decimal place move (0.0001). A pipette is a fractional pip, which is the 5th decimal place (0.00001).'),
        ('Why does my pip value fluctuate?', 'If your account currency is USD, but you are trading a pair where USD is the base currency (like USD/CHF), the value of a pip fluctuates based on the current exchange rate.'),
        ('Do pips apply to commodities like Gold?', 'Gold and Silver are typically measured in "ticks" or "points", not pips. A 1-cent move in XAU/USD is usually considered a point or tick.')
    ]
}

generic_faq_pattern = r'<FAQAccordion\s+faqs=\{\[\s*\{\s*question:\s*"Is this calculator free to use\?",[^\]]*\]\}\s*/>'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

parts = text.split('if (slug === "')
new_text = parts[0]
for part in parts[1:]:
    current_slug = part.split('"', 1)[0]
    if current_slug in faqs:
        faq_list = faqs[current_slug]
        new_faqs_code = "<FAQAccordion faqs={[\n"
        for q, a in faq_list:
            safe_q = q.replace('"', '\\"')
            safe_a = a.replace('"', '\\"')
            new_faqs_code += f'          {{\n            question: "{safe_q}",\n            answer: "{safe_a}"\n          }},\n'
        new_faqs_code = new_faqs_code.rstrip(',\n') + "\n        ]} />"
        
        part = re.sub(generic_faq_pattern, new_faqs_code.replace('\\', '\\\\'), part, count=1)
    new_text += 'if (slug === "' + part

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Injected remaining custom FAQs!")
