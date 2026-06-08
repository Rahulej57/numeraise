import re

faqs_to_add = {
    'epf-calculator': [
        ('Can I withdraw my EPF before retirement?', 'Yes, partial withdrawals are allowed for specific reasons like medical emergencies, house purchase, or marriage, subject to certain conditions.')
    ],
    'swp-calculator': [
        ('What happens if my SWP amount is higher than the returns?', 'If your withdrawal exceeds the returns generated, it will start depleting your principal amount, reducing the longevity of your corpus.'),
        ('Is SWP tax-efficient?', 'Yes, SWP is highly tax-efficient compared to fixed deposits, as only the capital gains portion of your withdrawal is taxed, not the entire amount.')
    ],
    'step-up-sip': [
        ('Why should I step-up my SIP?', 'Stepping up your SIP aligns your investments with your increasing income over time, helping you combat inflation and reach financial goals much faster.'),
        ('Is there a maximum limit for step-up SIP?', 'No, mutual fund AMCs do not impose a maximum limit on step-up amounts, though you should ensure you have sufficient bank balance to avoid ECS bounce charges.')
    ],
    'personal-loan-calculator': [
        ('Can I prepay my personal loan?', 'Yes, most banks allow prepayment after a lock-in period (usually 6-12 months). However, they may charge a foreclosure fee of 2-5% on the outstanding principal.'),
        ('Does a personal loan affect my credit score?', 'Yes, taking a personal loan initially causes a small dip due to the hard inquiry, but making timely EMI payments will significantly boost your CIBIL score over time.')
    ],
    'education-loan-calculator': [
        ('Is a guarantor required for an education loan?', 'For loans up to ₹4 Lakhs, usually no guarantor is required. For higher amounts, a parent or guardian must be a co-borrower, and collateral may be required for loans above ₹7.5 Lakhs.'),
        ('When does the EMI start for an education loan?', 'The repayment usually starts after a moratorium period, which is typically the course duration plus 6 months to 1 year, allowing the student time to secure a job.')
    ],
    'loan-refinance': [
        ('Should I always refinance if rates are lower?', 'Not always. You must calculate if the savings in interest are greater than the processing fees, legal charges, and other hidden costs of switching lenders.'),
        ('Can I reduce my tenure when refinancing?', 'Yes, refinancing is an excellent opportunity to reduce your loan tenure by maintaining your old EMI amount at the new lower interest rate.')
    ],
    'credit-card-payoff': [
        ('What is the minimum amount due?', 'It is the smallest amount you must pay by the due date to avoid late fees. However, paying only the minimum amount will trap you in a high-interest debt cycle for years.'),
        ('Should I take a personal loan to clear credit card debt?', 'Generally, yes. Credit cards charge massive interest (36-42% annually), whereas personal loans are much cheaper (10-15%). This strategy is called debt consolidation.')
    ],
    'pomis-calculator': [
        ('Can an NRI invest in POMIS?', 'No, the Post Office Monthly Income Scheme is exclusively available to resident Indians. Non-Resident Indians (NRIs) cannot open new POMIS accounts.'),
        ('Is there a TDS deduction on POMIS interest?', 'No, the Post Office does not deduct TDS on POMIS interest. However, the interest is fully taxable in the hands of the investor, who must declare it while filing their ITR.')
    ],
    'hra-exemption': [
        ('Can I claim HRA if I live with my parents?', 'Yes, you can claim HRA by paying rent to your parents. Your parents must declare this rental income in their income tax returns, and it is advisable to maintain rent receipts and bank transfer proofs.'),
        ('What happens if I forget to submit rent receipts to my employer?', 'Your employer will deduct TDS assuming no HRA exemption. However, you can still claim the exemption yourself while filing your Income Tax Return (ITR) to get a refund.')
    ],
    'capital-gains-tax': [
        ('What is indexation benefit?', 'Indexation adjusts the purchase price of your asset for inflation over the holding period, significantly reducing your taxable long-term capital gains on real estate or debt funds.'),
        ('How can I save tax on long-term capital gains?', 'You can save LTCG tax on real estate by reinvesting the gains into another residential property under Section 54, or by investing in specified bonds under Section 54EC.')
    ],
    'tds-calculator': [
        ('What is Form 15G and 15H?', 'These are self-declaration forms submitted to banks to prevent TDS deduction on interest income if your total income is below the taxable limit. Form 15H is for senior citizens, while 15G is for others.'),
        ('How do I claim a TDS refund?', 'If the TDS deducted exceeds your actual tax liability for the year, you can claim a refund by filing your Income Tax Return (ITR). The refund will be credited directly to your bank account.')
    ],
    'advance-tax': [
        ('Who is liable to pay advance tax?', 'Any taxpayer whose estimated tax liability for the financial year, after deducting TDS, exceeds ₹10,000 is required to pay advance tax in installments.'),
        ('What is the penalty for not paying advance tax?', 'If you fail to pay advance tax or pay less than the required percentage by the due dates, you will be liable to pay penal interest at 1% per month under Section 234B and 234C of the Income Tax Act.')
    ],
    'health-insurance-calculator': [
        ('What is a waiting period in health insurance?', 'It is the time you must wait after buying the policy before you can claim coverage for certain pre-existing diseases or specific treatments, typically ranging from 1 to 4 years.'),
        ('What is a cashless claim?', 'A cashless claim allows you to get medical treatment at a network hospital without paying out of pocket. The insurance company settles the bill directly with the hospital.')
    ],
    'life-insurance-premium': [
        ('Are life insurance premiums tax-deductible?', 'Yes, premiums paid towards life insurance policies are eligible for tax deduction under Section 80C of the Income Tax Act, up to a maximum limit of ₹1.5 Lakhs per year.'),
        ('What happens if I stop paying my premiums?', 'If you stop paying premiums during the grace period, your policy may lapse. Depending on the policy type and how long it was active, you might lose the life cover and any accumulated cash value.')
    ],
    'human-life-value': [
        ('Why is Human Life Value important?', 'HLV is critical for determining the exact amount of life insurance coverage you need to ensure your family can maintain their lifestyle and achieve future goals if you were to pass away unexpectedly.'),
        ('Should I include my existing insurance in HLV?', 'The HLV calculation tells you the total coverage needed. You should subtract your existing life insurance coverage from your HLV to find the "insurance gap" that you need to purchase.')
    ],
    'fire-calculator': [
        ('What is the 4% rule?', 'The 4% rule is a widely used retirement guideline suggesting that you can safely withdraw 4% of your initial retirement portfolio every year (adjusted for inflation) without running out of money for 30 years.'),
        ('How does inflation affect my FIRE number?', 'Inflation significantly increases your FIRE number. Because the cost of living goes up every year, your target corpus must be large enough to sustain increasing withdrawal amounts while still growing.')
    ],
    'pension-calculator': [
        ('Is my pension income taxable?', 'Yes, uncommuted (regular) pension is fully taxable as salary income. However, commuted (lump sum) pension may be partially or fully exempt depending on whether you are a government or private sector employee.'),
        ('What is the difference between NPS and EPF for pension?', 'EPF provides a fixed, guaranteed interest rate and is primarily for private-sector employees. NPS is a market-linked voluntary contribution scheme that offers potentially higher returns and exclusive tax benefits under Section 80CCD(1B).')
    ],
    'markup-calculator': [
        ('Is markup the same as profit margin?', 'No. Markup is the percentage added to the cost price to determine the selling price. Profit margin is the percentage of the selling price that is profit. A 50% markup results in a 33.3% profit margin.'),
        ('How do I calculate markup percentage?', 'The formula is: Markup Percentage = ((Selling Price - Cost Price) / Cost Price) * 100.')
    ],
    'break-even-calculator': [
        ('What is the difference between fixed and variable costs?', 'Fixed costs (like rent or salaries) remain the same regardless of how many units you sell. Variable costs (like raw materials) increase directly with every additional unit produced.')
    ],
    'rental-yield': [
        ('What is a good rental yield in India?', 'In India, residential rental yields typically range from 2% to 3.5%, while commercial properties often yield between 6% to 9% annually.'),
        ('Does rental yield account for property appreciation?', 'No, rental yield strictly measures the cash flow generated from rent relative to the property value. Property appreciation is a separate factor that contributes to your overall Return on Investment (ROI).'),
        ('Should I invest in property just for the rental yield?', 'Usually, no. In most cases, the mortgage interest rate is much higher than the rental yield. Property investment is typically driven by the expectation of long-term capital appreciation combined with rental income.')
    ],
    'crypto-profit': [
        ('How are crypto profits taxed in India?', 'In India, profits from cryptocurrency transactions are taxed at a flat rate of 30%, plus applicable surcharge and cess, irrespective of your income tax slab. Additionally, a 1% TDS is applicable on the transfer of crypto assets.'),
        ('Can I set off crypto losses against other gains?', 'No, the Indian tax laws specifically prohibit setting off crypto losses against any other income, including gains from other cryptocurrencies.')
    ],
    'forex-pip': [
        ('What is a Pip?', 'A "Percentage in Point" (Pip) is the smallest price move that a given exchange rate can make based on market convention. For most currency pairs, it is the fourth decimal place (0.0001).'),
        ('How much is a Pip worth?', 'The value of a pip depends on the currency pair being traded, the size of your trade (lot size), and the exchange rate. Our calculator instantly determines this exact value in your base currency.')
    ]
}

with open(r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

for slug, faqs in faqs_to_add.items():
    # Find the block
    idx = text.find(f'if (slug === "{slug}")')
    if idx == -1:
        print(f"Could not find slug: {slug}")
        continue
    
    # We want to insert the new FAQs into the FAQAccordion component.
    # The block looks like:
    # <FAQAccordion faqs={[
    #   { question: "...", answer: "..." },
    #   { question: "...", answer: "..." }
    # ]} />
    
    faq_idx = text.find('<FAQAccordion faqs={[', idx)
    if faq_idx == -1:
        print(f"Could not find FAQAccordion for slug: {slug}")
        continue
        
    end_faq_idx = text.find(']} />', faq_idx)
    if end_faq_idx == -1:
        end_faq_idx = text.find(']}', faq_idx) # try without />
    
    # create the string to inject
    inject_str = ""
    for q, a in faqs:
        safe_q = q.replace('"', '\\"')
        safe_a = a.replace('"', '\\"')
        inject_str += f',\n          {{\n            question: "{safe_q}",\n            answer: "{safe_a}"\n          }}'
        
    # Inject it right before `]} />`
    text = text[:end_faq_idx] + inject_str + text[end_faq_idx:]

with open(r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Injected all missing FAQs!")
