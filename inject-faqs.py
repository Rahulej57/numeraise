import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Define specific FAQs for each slug
faqs = {
    'inflation-calculator': [
        ('Does inflation affect all goods equally?', 'No. While the headline inflation rate represents an average basket of goods, specific sectors like healthcare, education, or housing often experience significantly higher inflation rates.'),
        ('What is a good inflation rate?', 'Most central banks target an inflation rate around 2% to 4%. A moderate amount of inflation encourages spending and investing rather than hoarding cash.'),
        ('How can I beat inflation?', 'To preserve your purchasing power, you must invest your money in assets that yield a return higher than the inflation rate, such as equities, real estate, or inflation-indexed bonds.')
    ],
    'cagr-calculator': [
        ('Why is CAGR better than absolute return?', 'CAGR accounts for the time value of money and the compounding effect. Absolute return just shows total growth, but 50% over 1 year is wildly different from 50% over 10 years. CAGR normalizes this to a yearly rate.'),
        ('Does CAGR assume a constant growth rate?', 'Yes, mathematically it assumes your investment grew at a steady, constant rate every single year, ignoring the actual volatility or yearly dips.'),
        ('Can CAGR be negative?', 'Yes! If your final value is less than your initial value, the CAGR will be negative, representing an annualized loss.')
    ],
    'compound-interest-calculator': [
        ('Is daily compounding significantly better than annual?', 'Yes, especially over long periods. The more frequently interest is added to the principal, the faster it grows. However, the difference between daily and monthly is much smaller than the difference between annual and monthly.'),
        ('How does the rule of 72 relate to compound interest?', 'The Rule of 72 is a quick mental math trick. If you divide 72 by your annual interest rate, you get the approximate number of years it takes for your money to double.'),
        ('Do I pay taxes on compound interest?', 'Usually, yes. Unless your money is in a tax-advantaged account, interest earned is typically considered taxable income in the year it is credited.')
    ],
    'nps-calculator': [
        ('Is NPS mandatory for government employees?', 'Yes, NPS is mandatory for all central government employees joining service on or after January 1, 2004, and most state government employees.'),
        ('Can I withdraw my entire NPS corpus at age 60?', 'No. Under current rules, you can withdraw up to 60% of your corpus as a tax-free lump sum. You MUST use the remaining 40% to purchase an annuity for a regular pension.'),
        ('What are the tax benefits of NPS?', 'You can claim deductions up to ₹1.5 Lakhs under Sec 80C, plus an exclusive additional deduction of up to ₹50,000 under Sec 80CCD(1B).')
    ],
    'ppf-calculator': [
        ('Can I close my PPF account before 15 years?', 'Premature closure is generally only allowed after 5 years, and strictly for specific reasons like life-threatening illness or higher education, subject to a 1% interest penalty.'),
        ('What is the maximum amount I can invest in PPF?', 'Currently, the maximum limit is ₹1,500,000 per financial year. Any amount deposited above this will not earn interest or qualify for tax deductions.'),
        ('Can NRIs open a PPF account?', 'No, Non-Resident Indians (NRIs) cannot open a new PPF account. However, if you opened one while you were a resident, you can continue it until maturity on a non-repatriation basis.')
    ],
    'rd-calculator': [
        ('What happens if I miss an RD installment?', 'Banks usually charge a penalty for missed installments. If you miss consecutive payments (typically 6), the bank may prematurely close the RD account.'),
        ('Is TDS deducted on RD interest?', 'Yes, if the interest earned on your RD (and FDs) exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year, the bank will deduct TDS at 10%.'),
        ('Can I withdraw money from an RD early?', 'Partial withdrawals are generally not allowed. You would have to prematurely close the entire RD account, which usually attracts a penalty of 0.5% to 1% on the interest rate.')
    ],
    'ssy-calculator': [
        ('What happens if I miss an SSY deposit in a year?', 'Your account goes into default. You can revive it by paying a penalty of ₹50 for every year of default along with the minimum deposit of ₹250 for those missed years.'),
        ('Can I open an SSY account for my 12-year-old daughter?', 'No. The account can only be opened for a girl child before she attains the age of 10 years.'),
        ('Can the girl child operate the account herself?', 'Yes, once the girl reaches the age of 18, she can take over the operation of the account.')
    ],
    'step-up-sip-calculator': [
        ('How much should I step up my SIP every year?', 'A good rule of thumb is to step up your SIP in line with your annual salary increment, typically 10% to 15% each year.'),
        ('Can I change the step-up amount later?', 'In most AMC platforms, an active Step-Up SIP mandate cannot be modified. You would need to cancel the existing mandate and start a new one with the revised amount.'),
        ('Is Step-Up SIP significantly better than normal SIP?', 'Yes! Because it forces you to invest more as your income grows, it drastically combats inflation and results in a massively larger corpus over 15-20 years.')
    ],
    'mutual-fund-calculator': [
        ('Are mutual fund returns guaranteed?', 'No, mutual fund returns are subject to market risks and fluctuate based on the performance of the underlying stocks or bonds.'),
        ('What is an Expense Ratio?', 'It is the annual fee charged by the Asset Management Company (AMC) to manage your fund, typically ranging from 0.1% to 2% of your investment value.'),
        ('Should I invest in Direct or Regular mutual funds?', 'Direct mutual funds have a lower expense ratio because they do not pay commissions to agents. Over the long term, Direct funds yield significantly higher returns.')
    ],
    'simple-interest-calculator': [
        ('Who actually uses Simple Interest in the real world?', 'Simple interest is commonly used for short-term personal loans, automobile loans, and certain types of consumer financing or installment plans.'),
        ('Is Simple Interest better than Compound Interest for a loan?', 'Yes, for the borrower. Since you are not paying interest on accumulated interest, the total cost of a simple interest loan is lower than a compound interest loan.'),
        ('Can I use this for my savings account?', 'No, almost all banks use compound interest for savings accounts, usually compounding quarterly or monthly.')
    ],
    'car-loan-emi': [
        ('Is it better to take a shorter or longer loan tenure?', 'A shorter tenure means higher monthly EMIs but significantly less total interest paid. A longer tenure reduces your monthly burden but increases the total cost of the car.'),
        ('What is a zero-depreciation car insurance?', 'Also known as bumper-to-bumper insurance, it ensures you get the full claim amount without deductions for part depreciation in case of an accident. It is highly recommended for new cars.'),
        ('Can I prepay my car loan?', 'Yes, but many banks charge a foreclosure penalty ranging from 2% to 5% of the outstanding principal. Check the terms before signing.')
    ],
    'personal-loan-emi': [
        ('How does my credit score affect a personal loan?', 'Personal loans are unsecured, meaning they lack collateral. Therefore, banks rely heavily on your credit score to determine your interest rate. A higher score means lower rates.'),
        ('Can a personal loan be rejected?', 'Yes, rejections can happen due to a low credit score, unstable income, high existing debt (high FOIR), or applying to multiple banks simultaneously.'),
        ('Is the interest rate fixed or floating?', 'Personal loans generally have fixed interest rates, meaning your EMI will remain the same throughout the entire tenure of the loan.')
    ],
    'education-loan-emi': [
        ('Does the EMI start immediately after taking the loan?', 'No, most education loans have a moratorium period (course duration plus 6-12 months) during which you are not required to pay EMIs, though simple interest accrues.'),
        ('Are there tax benefits on an education loan?', 'Yes, in India, under Section 80E of the IT Act, the entire interest component of your education loan EMI is tax-deductible for up to 8 years.'),
        ('Is collateral required for an education loan?', 'For smaller amounts (usually up to ₹7.5 Lakhs), no collateral is required. For higher amounts, banks typically ask for tangible collateral like property.')
    ],
    'loan-against-property': [
        ('Can I use LAP for business purposes?', 'Yes, a Loan Against Property has no end-use restrictions. You can use it for business expansion, children\'s education, or medical emergencies.'),
        ('What percentage of my property value can I get?', 'Banks typically finance between 50% to 70% of the current market value of your property, known as the Loan-to-Value (LTV) ratio.'),
        ('Is LAP cheaper than a personal loan?', 'Yes, because it is a secured loan backed by collateral, the interest rates for LAP are significantly lower than unsecured personal loans.')
    ],
    'loan-eligibility': [
        ('What is FOIR?', 'Fixed Obligation to Income Ratio (FOIR) calculates what percentage of your monthly income goes toward paying existing debts. Banks prefer a FOIR below 50%.'),
        ('Does my spouse\'s income improve my eligibility?', 'Yes! Adding a working spouse as a co-applicant aggregates your incomes, significantly increasing your total loan eligibility.'),
        ('Why did the bank offer me less than the calculator shows?', 'Calculators use generalized assumptions. Banks look at your specific credit history, employer category, property valuation, and exact debt obligations.')
    ],
    'two-wheeler-loan': [
        ('Do banks finance 100% of the bike cost?', 'Very rarely. Most banks offer 80% to 90% of the on-road price. You have to pay the rest as a down payment.'),
        ('Can a student apply for a two-wheeler loan?', 'Yes, if you have a co-applicant (like a parent) who has a steady income and good credit score.'),
        ('What happens if my bike gets stolen before the loan is paid?', 'You are still liable to pay the loan. However, if you have comprehensive insurance, the insurance payout covers the outstanding loan amount.')
    ],
    'sbi-pension-plan': [
        ('Is the SBI Pension Plan guaranteed?', 'No, most SBI Life pension plans are market-linked ULIPs or deferred annuity products. However, some traditional plans offer guaranteed additions.'),
        ('When do I start receiving the pension?', 'You start receiving the pension (annuity) after the accumulation phase ends, at your chosen vesting age (usually 60).'),
        ('Can I withdraw my money before retirement?', 'Partial withdrawals are generally allowed only for specific critical needs, and surrendering the policy early often involves heavy penalties.')
    ],
    'post-office-mis': [
        ('Is the interest rate fixed for the entire 5 years?', 'Yes, whatever the prevailing interest rate is on the day you open the POMIS account, it is locked in for the entire 5-year tenure.'),
        ('Can I open a joint POMIS account?', 'Yes, up to three adults can open a joint account. The maximum investment limit for a joint account is double the single account limit.'),
        ('What happens if I withdraw early?', 'Premature withdrawal is allowed after 1 year. If withdrawn between 1 to 3 years, a 2% penalty is deducted. Between 3 to 5 years, a 1% penalty is deducted.')
    ],
    'scss-calculator': [
        ('Can I open an SCSS account before age 60?', 'Yes, individuals who have taken Voluntary Retirement Scheme (VRS) or superannuation between age 55-60 can open it, as can retired defense personnel irrespective of age.'),
        ('Is the interest tax-free?', 'No, SCSS interest is fully taxable. However, you can claim a deduction under Sec 80TTB up to ₹50,000 for senior citizens.'),
        ('Does the interest rate change?', 'The interest rate is reviewed by the government quarterly. However, once you invest, the rate is locked for your 5-year tenure.')
    ],
    'gratuity-calculator': [
        ('What if my company refuses to pay gratuity?', 'Gratuity is a statutory right under the Payment of Gratuity Act, 1972. If a company refuses, you can file a complaint with the labor commissioner.'),
        ('Is gratuity taxable?', 'For government employees, it is fully exempt. For private sector employees covered under the Act, it is exempt up to ₹20 Lakhs.'),
        ('Do I get gratuity if I am fired?', 'Yes, unless your termination was due to gross misconduct, theft, or violence, you are entitled to gratuity if you completed 5 years.')
    ],
    'epf-calculator': [
        ('Can I opt out of EPF?', 'If your basic salary at the time of joining your first job is above ₹15,000, you can opt out. If it is below ₹15,000, it is mandatory. Once you join EPF, you cannot opt out later.'),
        ('Is my employer\'s 12% entirely going to EPF?', 'No, 8.33% of the employer\'s contribution goes to the Employee Pension Scheme (EPS), and only 3.67% goes to your EPF corpus.'),
        ('When can I withdraw my EPF?', 'You can withdraw the full amount upon retirement. Partial withdrawals are allowed for housing, marriage, or medical emergencies. You can also withdraw 75% if unemployed for 1 month, and 100% after 2 months.')
    ],
    'hra-calculator': [
        ('Can I claim HRA if I pay rent to my parents?', 'Yes, provided the property is owned by your parents, you actually transfer the rent to them, and they declare it as rental income on their tax returns.'),
        ('Do I need to submit rent receipts?', 'Yes, if your annual rent exceeds ₹1,00,000, you must submit rent receipts and your landlord\'s PAN card to your employer.'),
        ('Can I claim both HRA and a Home Loan tax deduction?', 'Yes! If you own a house in one city but live in a rented house in another city for work, you can claim both HRA and home loan deductions.')
    ],
    'nsc-calculator': [
        ('Do I receive yearly interest payouts?', 'No, NSC interest is compounded annually but paid out only at maturity (after 5 years).'),
        ('How does the tax deduction work for NSC?', 'The initial investment is eligible for Sec 80C. Interestingly, the accrued interest each year is also deemed to be reinvested and qualifies for 80C deduction in subsequent years.'),
        ('Can I use NSC as collateral for a loan?', 'Yes, banks and financial institutions accept NSC certificates as collateral or security for personal or business loans.')
    ],
    'kvp-calculator': [
        ('How long does KVP take to double my money?', 'It depends on the prevailing interest rate set by the government. At a 7.5% rate, it takes exactly 115 months (9 years and 7 months).'),
        ('Is KVP available for NRIs?', 'No, Non-Resident Indians (NRIs) and Hindu Undivided Families (HUFs) are not eligible to invest in Kisan Vikas Patra.'),
        ('Is there a maximum limit for KVP?', 'No, there is no maximum limit for investing in KVP. However, PAN card proof is required for investments above ₹50,000.')
    ],
    'crypto-profit-calculator': [
        ('Do I need to calculate taxes on my crypto profit?', 'Yes, most jurisdictions treat cryptocurrency as property. Profits are subject to Capital Gains Tax (short-term or long-term depending on holding period).'),
        ('Does this calculator account for exchange fees?', 'No, you must manually subtract your exchange trading fees (maker/taker fees) and withdrawal network fees from your final profit.'),
        ('What happens if I sell for a loss?', 'In many countries, you can harvest crypto losses to offset capital gains from other investments, reducing your total tax liability.')
    ],
    'crypto-tax-calculator': [
        ('What is the crypto tax rate in India?', 'As of recent budgets, India imposes a flat 30% tax on all crypto profits, plus a 1% TDS on transactions, with no provision to offset losses against gains.'),
        ('Does transferring crypto between my own wallets trigger a tax?', 'No, moving your own assets from an exchange to a hardware wallet is not a taxable event as you are not selling or exchanging it.'),
        ('Do I have to pay tax if I trade Bitcoin for Ethereum?', 'Yes! Crypto-to-crypto trades are considered taxable events. You are technically selling Bitcoin for fiat, and immediately using it to buy Ethereum.')
    ],
    'impermanent-loss-calculator': [
        ('What exactly is Impermanent Loss?', 'It is the temporary loss of funds experienced by liquidity providers in automated market makers (AMMs) when the price of tokens changes compared to when they were deposited.'),
        ('Why is it called "Impermanent"?', 'Because the loss is only realized if you withdraw your liquidity at that exact altered price. If the prices revert back to their original ratio, the loss vanishes.'),
        ('How can I avoid Impermanent Loss?', 'You can never avoid it entirely in standard AMMs, but you can minimize it by providing liquidity to stablecoin pairs (like USDC/USDT) where the price ratio rarely deviates from 1:1.')
    ],
    'forex-pip-calculator': [
        ('What does PIP stand for?', 'PIP stands for "Percentage in Point" or "Price Interest Point". It is the smallest price move that a given exchange rate makes based on market convention.'),
        ('Are pips the same for all currency pairs?', 'Most major pairs are priced to 4 decimal places, making 1 pip = 0.0001. However, JPY pairs are an exception, priced to 2 decimal places, making 1 pip = 0.01.'),
        ('Does leverage affect pip value?', 'No, leverage affects how much margin you need to open a trade, but the actual dollar value of a pip remains strictly tied to your position size (lots).')
    ],
    'margin-calculator': [
        ('What is a Margin Call?', 'A margin call occurs when your account equity falls below the broker\'s required maintenance margin. You must either deposit more funds or the broker will forcefully close your positions.'),
        ('Is 100x leverage safe?', 'Using 100x leverage is extremely risky. It means a mere 1% move against your position will wipe out your entire account balance (liquidation).'),
        ('How is Forex margin different from Stock margin?', 'Forex margin is typically much higher (up to 500:1) because currencies are less volatile. Stock margin rarely exceeds 4:1 for day trading.')
    ],
    'break-even-calculator': [
        ('Can a break-even point be reduced?', 'Yes! You can reduce your break-even point by lowering fixed costs, reducing variable costs per unit, or increasing the selling price of your product.'),
        ('Does Break-Even guarantee profit?', 'No, the break-even point is exactly where your profit is $0. You must sell *more* than the break-even quantity to actually start making a profit.'),
        ('Why are fixed costs so important?', 'Fixed costs (rent, salaries, insurance) must be paid regardless of whether you sell 1 unit or 10,000 units. A high fixed-cost business requires massive sales volume just to survive.')
    ],
    'roi-calculator': [
        ('What is a good ROI?', 'This depends entirely on the risk profile. A 7% ROI is great for a safe government bond, but terrible for a high-risk tech startup where investors expect 30%+ ROI.'),
        ('Does ROI account for time?', 'Standard ROI does not! A 50% ROI over 1 month is incredible, but a 50% ROI over 20 years is terrible. For time-adjusted returns, use CAGR (Annualized ROI).'),
        ('Should I include taxes and fees in ROI?', 'For a true reflection of your net gain, you absolutely should deduct all trading fees, management costs, and taxes before calculating your ROI.')
    ],
    'profit-margin-calculator': [
        ('What is the difference between Gross and Net Profit Margin?', 'Gross margin only deducts the direct costs of goods sold (COGS). Net margin deducts absolutely all expenses, including operating costs, taxes, and interest.'),
        ('Is Markup the same as Profit Margin?', 'No! Markup is the percentage added to your cost to get the selling price. Margin is the percentage of the selling price that is profit. A 100% markup equals a 50% margin.'),
        ('What is a healthy profit margin?', 'It varies wildly by industry. Grocery stores operate on razor-thin net margins (1-3%), while software companies often enjoy massive net margins (20-40%).')
    ],
    'burn-rate-calculator': [
        ('What is a Runway?', 'Runway is the number of months your startup has before it runs out of cash entirely, assuming income and expenses remain exactly as they are right now.'),
        ('How do I fix a high burn rate?', 'You must either drastically cut overhead expenses (layoffs, cheaper office, lower marketing spend) or significantly increase your incoming revenue.'),
        ('Is a high burn rate always bad?', 'Not necessarily. Many successful tech companies intentionally burn massive amounts of venture capital cash to acquire users and capture market share rapidly before prioritizing profitability.')
    ],
    'startup-equity-calculator': [
        ('What is Dilution?', 'Dilution occurs when a company issues new shares to new investors. Your absolute number of shares stays the same, but your percentage ownership of the overall company decreases.'),
        ('What is an Option Pool?', 'It is a chunk of equity (usually 10-20%) set aside specifically to grant stock options to future employees, advisors, and executives to incentivize them.'),
        ('Should founders split equity equally?', 'Not necessarily. Equity should reflect past contributions, intellectual property brought to the table, and most importantly, the future time and commitment expected from each founder.')
    ],
    'business-valuation': [
        ('Which valuation method is the most accurate?', 'There is no single "accurate" method. DCF is mathematically rigorous but relies heavily on unpredictable future assumptions. Most investors use a combination of methods to find a reasonable range.'),
        ('What is an EBITDA multiple?', 'It is a valuation metric where a business is valued at a multiple (e.g., 5x or 10x) of its EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization).'),
        ('Why do tech startups get such high valuations with no profit?', 'Because investors are valuing them based on massive future revenue growth potential and user acquisition, rather than their current negative cash flow.')
    ]
}

# The generic FAQ string that needs to be replaced:
generic_faq_pattern = r'<FAQAccordion\s+faqs=\{\[\s*\{\s*question:\s*"Is this calculator free to use\?",[^\]]*\]\}\s*/>'

for slug, faq_list in faqs.items():
    # Build the replacement string
    new_faqs_code = "<FAQAccordion faqs={[\n"
    for q, a in faq_list:
        # Escape quotes just in case
        safe_q = q.replace('"', '\\"')
        safe_a = a.replace('"', '\\"')
        new_faqs_code += f'          {{\n            question: "{safe_q}",\n            answer: "{safe_a}"\n          }},\n'
    new_faqs_code = new_faqs_code.rstrip(',\n') + "\n        ]} />"
    
    # We need to find the specific block for this slug
    # It looks like: if (slug === "slug-name") { ... <FAQAccordion ... /> ... }
    
    # We'll use a regex to find the block for the specific slug and replace the generic faq within it.
    # Since regexing large blocks can be tricky, let's just do a string replace on the generic pattern ONLY within that block.
    # Actually, we can just split by 'if (slug === "'
    
    parts = text.split('if (slug === "')
    new_parts = [parts[0]]
    for part in parts[1:]:
        if part.startswith(f'{slug}")'):
            # Replace the generic FAQ in this part only
            part = re.sub(generic_faq_pattern, new_faqs_code, part, count=1)
        new_parts.append('if (slug === "' + part)
        
    text = ''.join(new_parts).replace('if (slug === "if (slug === "', 'if (slug === "')
    # That join logic is slightly flawed. 
    # Let's fix the join logic:
    # We split by 'if (slug === "' -> parts[1] is 'inflation-calculator") { ...'
    
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

print("Injected custom FAQs!")
