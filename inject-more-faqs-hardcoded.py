import os, re

base = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'

faqs_extra = {
    '401k-calculator': [
        ('What happens if I withdraw my 401(k) early?', 'If you withdraw funds before age 59½, you will generally be hit with a 10% early withdrawal penalty from the IRS, plus ordinary income tax on the amount withdrawn.'),
        ('Is there a maximum I can contribute to my 401(k)?', 'Yes. For 2024, the IRS limit for employee contributions is $23,000. If you are 50 or older, you can make an additional catch-up contribution of $7,500.')
    ],
    'age-calculator': [
        ('How does leap year affect my age calculation?', 'Leap years are automatically accounted for by the underlying engine. If you were born on Feb 29, the calculator handles the exact number of days accurately.'),
        ('Why do different cultures calculate age differently?', 'In many Western cultures, a child is 0 at birth. In traditional Chinese culture, a child is considered 1 year old at birth and ages up on the Lunar New Year.')
    ],
    'basic-calculator': [
        ('What is the order of operations?', 'Mathematical calculations follow PEMDAS: Parentheses, Exponents, Multiplication and Division (left to right), and Addition and Subtraction (left to right).'),
        ('Why do some calculators give different answers?', 'Simple pocket calculators evaluate from left to right immediately. Scientific calculators evaluate the entire expression using the strict order of operations.')
    ],
    'bmi-calculator': [
        ('Is BMI an accurate measure of health?', 'BMI is a useful screening tool for populations but flawed for individuals. It cannot distinguish between muscle mass and fat, meaning muscular athletes often classify as "overweight" or "obese".'),
        ('Are there different BMI standards for different ethnicities?', 'Yes, the World Health Organization (WHO) has established different cut-off points for Asian populations because they have a higher risk of type 2 diabetes at lower BMI levels.')
    ],
    'bmr-calculator': [
        ('What is the difference between BMR and RMR?', 'Basal Metabolic Rate (BMR) measures calories burned for life-sustaining functions. Resting Metabolic Rate (RMR) also includes calories burned during very light daily activities like eating and shivering.'),
        ('How can I increase my BMR?', 'The most effective way to permanently increase your BMR is by building muscle mass. Muscle tissue is metabolically active and burns more calories at rest than fat tissue.')
    ],
    'body-fat-calculator': [
        ('Is the U.S. Navy method perfectly accurate?', 'No, tape measure methods generally have a 3-4% margin of error. The only perfectly accurate methods are DEXA scans or hydrostatic weighing.'),
        ('Why is essential fat different for men and women?', 'Women naturally carry more essential body fat (around 10-13%) compared to men (2-5%) to support reproductive functions and hormonal balance.')
    ],
    'budget-calculator': [
        ('What is the 50/30/20 rule?', 'It is a popular budgeting guideline where 50% of your income goes to Needs (rent, groceries), 30% to Wants (entertainment, dining), and 20% to Savings and Debt repayment.'),
        ('Should I budget based on gross or net income?', 'You should always budget based on your Net Income (take-home pay after taxes and deductions). Budgeting on gross income will leave you short on cash.')
    ],
    'currency-converter': [
        ('Why do banks charge a different rate than the calculator?', 'Our calculator uses the mid-market rate (the true global rate). Banks add a markup spread (usually 2-5%) to make a profit when exchanging your money.'),
        ('What causes currency exchange rates to fluctuate?', 'Exchange rates are driven by supply and demand, which are influenced by inflation, interest rates, political stability, and a country\'s economic performance.')
    ],
    'date-time-calculator': [
        ('Does the calculator account for daylight saving time?', 'If the dates cross a daylight saving boundary, the exact hour duration will be affected. Standard day counting strictly calculates 24-hour periods.'),
        ('What is a Business Day?', 'Business days generally exclude weekends (Saturday and Sunday) and official public holidays. This is crucial for banking and shipping estimates.')
    ],
    'emi-calculator': [
        ('Does EMI change if the RBI changes interest rates?', 'If you have a floating rate loan, your EMI usually stays the same, but the tenure (duration) of your loan increases or decreases based on the new rate.'),
        ('Can I pay more than my EMI every month?', 'Yes, this is called making a part-prepayment. Any extra amount you pay goes directly toward reducing your principal, which drastically reduces your total interest.')
    ],
    'fd-calculator': [
        ('What is the difference between simple and compound FD?', 'Simple FDs pay out interest monthly or quarterly to your savings account. Cumulative (compound) FDs reinvest the interest, giving you a much larger lump sum at maturity.'),
        ('Are Fixed Deposits risk-free?', 'In India, bank FDs are insured up to ₹5 Lakhs by DICGC. While they are essentially risk-free from default, they carry inflation risk if the interest rate is lower than inflation.')
    ],
    'flat-vs-reducing-loan': [
        ('Why is the flat rate always lower than the reducing rate?', 'Lenders advertise a 7% flat rate because it sounds incredibly cheap. However, because you pay interest on the full original principal for the entire term, a 7% flat rate is mathematically equivalent to a ~13% reducing rate.'),
        ('Are flat rate loans legal?', 'Yes, but regulators require banks to transparently disclose the actual Annual Percentage Rate (APR) so borrowers aren\'t misled by the low flat rate number.')
    ],
    'gst-calculator': [
        ('Can I claim GST back on business purchases?', 'Yes, registered businesses can claim Input Tax Credit (ITC) for the GST paid on their purchases, reducing the total GST they have to pay to the government.'),
        ('What is reverse charge mechanism in GST?', 'Normally, the supplier pays the GST. Under the reverse charge mechanism, the buyer or receiver of the goods/services is directly liable to pay the GST to the government.')
    ],
    'home-loan-calculator': [
        ('Should I choose a fixed or floating interest rate for a home loan?', 'Home loans are long-term commitments (15-20 years). Floating rates are generally cheaper over the long run, as fixed-rate loans carry a higher premium for the security they offer.'),
        ('What is an amortization schedule?', 'It is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off.')
    ],
    'income-tax-calculator': [
        ('What is a standard deduction?', 'It is a flat deduction (currently ₹50,000 for salaried employees in India) that reduces your taxable income, regardless of your actual expenses.'),
        ('Should I choose the Old or New Tax Regime?', 'The New Regime has lower tax rates but does not allow major deductions (like 80C or HRA). If your deductions exceed ₹3.75 Lakhs, the Old Regime is usually better. Otherwise, the New Regime saves more tax.')
    ],
    'lease-vs-buy': [
        ('Is leasing a car cheaper than buying?', 'Leasing offers lower monthly payments because you are only paying for the vehicle\'s depreciation during the lease term. However, buying is cheaper in the long run because you eventually own a driving asset with no monthly payments.'),
        ('Can I customize a leased car?', 'Generally, no. You must return the car in its original condition. Any permanent modifications or severe wear-and-tear will result in heavy penalty charges at the end of the lease.')
    ],
    'lumpsum-calculator': [
        ('Is it better to invest a lump sum or use SIP?', 'Mathematically, if the market goes up over the long term, investing a lump sum immediately yields higher returns. However, SIPs offer psychological comfort and protect against investing right before a market crash.'),
        ('Can I withdraw my lump sum investment anytime?', 'It depends on the investment vehicle. Equity mutual funds have no lock-in (except ELSS which has 3 years). Fixed deposits usually have penalties for early withdrawal.')
    ],
    'measurement-calculator': [
        ('Why are there US and Imperial gallons?', 'Although they share the same name, the US liquid gallon is legally defined as 231 cubic inches (approx 3.785 liters), while the British Imperial gallon is based on the volume of 10 lbs of water (approx 4.546 liters).'),
        ('Is a nautical mile the same as a regular mile?', 'No. A standard (statute) mile is 5,280 feet. A nautical mile is slightly longer at 6,076 feet, historically based on one minute of latitude around the Earth.')
    ],
    'net-worth-calculator': [
        ('Is a primary residence included in net worth?', 'Yes, standard net worth calculations include the market value of your home as an asset, and the outstanding mortgage as a liability. However, "Liquid Net Worth" entirely excludes real estate.'),
        ('What is a good net worth for my age?', 'A popular formula by Thomas Stanley (author of The Millionaire Next Door) is: (Age × Pre-Tax Annual Income) ÷ 10. If your net worth is higher than this number, you are doing well.')
    ],
    'paycheck-calculator': [
        ('Why is my paycheck much lower than my salary?', 'Your gross salary is subjected to federal taxes, state taxes, FICA (Social Security and Medicare), and voluntary deductions like 401(k) contributions and health insurance premiums before it hits your bank account.'),
        ('What is the difference between W-2 and 1099?', 'A W-2 employee has taxes withheld automatically by the employer. A 1099 independent contractor receives the full gross amount and is personally responsible for calculating and paying their own taxes quarterly.')
    ],
    'percentage-calculator': [
        ('What is a basis point (BPS)?', 'In finance, a basis point is one-hundredth of a percentage point (0.01%). So, if an interest rate drops by 50 basis points, it means it dropped by 0.5%.'),
        ('Are percentages reversible?', 'Yes! X% of Y is exactly equal to Y% of X. For example, 8% of 50 is the exact same as 50% of 8 (which is 4). This trick makes mental math much easier.')
    ],
    'pregnancy-due-date': [
        ('Why is a pregnancy calculated as 40 weeks?', 'Medical professionals date pregnancies from the first day of the last menstrual period (LMP), which is usually about two weeks before conception actually occurs.'),
        ('Is the due date highly accurate?', 'No, only about 4% to 5% of babies are born on their exact calculated due date. It is simply an estimate. Delivery anytime between 37 and 42 weeks is considered normal.')
    ],
    'rent-vs-buy': [
        ('What are the hidden costs of homeownership?', 'Beyond the mortgage EMI, homeowners must pay property taxes, home insurance, HOA/society fees, and continuous maintenance and repair costs, which renters do not pay.'),
        ('Why do people say "renting is throwing money away"?', 'It is a misconception. Renting provides housing flexibility and frees up capital that would otherwise be locked in a down payment, allowing you to invest it in the stock market for potentially higher returns.')
    ],
    'retirement-calculator': [
        ('What is the 25x Rule?', 'A popular retirement guideline stating you need 25 times your annual expenses invested to safely retire. If you spend $40,000 a year, you need $1,000,000 to retire (based on the 4% withdrawal rule).'),
        ('Does this calculator account for inflation?', 'Yes! Failing to account for inflation is the biggest mistake in retirement planning. An expenses of $50,000 today will easily exceed $100,000 in 20 years due to inflation.')
    ],
    'salary-calculator': [
        ('Are there 52 weeks in a year?', 'Actually, there are 52.14 weeks in a standard year (365/7). When calculating weekly salary perfectly accurately, you should divide the annual salary by 52.14.'),
        ('Why are bi-weekly and semi-monthly pay periods different?', 'Bi-weekly means you get paid every two weeks (26 paychecks a year). Semi-monthly means you get paid twice a month, usually on the 1st and 15th (24 paychecks a year).')
    ],
    'sip-calculator': [
        ('Can I pause my SIP if I lose my job?', 'Yes, most mutual fund AMCs allow you to pause your SIP mandate for up to 3 or 6 months without any penalties, and your existing corpus will continue to grow.'),
        ('What is the benefit of Rupee Cost Averaging?', 'Because you invest a fixed amount every month, you buy more units when the market is down and fewer when it is high. This automatically lowers your average cost per unit over time.')
    ],
    'sip-vs-lumpsum': [
        ('Does SIP always beat Lumpsum?', 'No. In a consistently rising bull market, Lumpsum wins because your entire money is working for you from day one. SIP only wins during volatile or falling markets.'),
        ('Should I split my bonus into an SIP?', 'If you receive a large bonus and fear a market crash, you can put it in a Liquid Fund and run a Systematic Transfer Plan (STP) into an equity fund over 6-12 months.')
    ],
    'term-insurance-calculator': [
        ('What happens if I stop paying term insurance premiums?', 'If you fail to pay during the grace period (usually 30 days), your policy lapses and the death benefit coverage stops entirely. You do not get a refund for past premiums.'),
        ('Can I have multiple term insurance policies?', 'Yes, it is perfectly legal and common to have multiple policies from different insurers. You must, however, disclose existing policies when applying for a new one.')
    ],
    'tip-calculator': [
        ('Should I tip on the pre-tax or post-tax amount?', 'Proper etiquette dictates calculating the tip on the pre-tax subtotal. Tipping on the post-tax total means you are unnecessarily tipping on government taxes.'),
        ('Is a service charge the same as a tip?', 'No. A mandatory service charge added to your bill goes entirely to the restaurant management, who may or may not distribute it to the staff. A tip goes directly to the server.')
    ],
    'us-mortgage-calculator': [
        ('What is Private Mortgage Insurance (PMI)?', 'If your down payment is less than 20% of the home\'s value, lenders require you to pay PMI. It protects the lender (not you) if you default on the loan.'),
        ('What are closing costs?', 'Closing costs are fees paid at the end of a real estate transaction. They include origination fees, appraisal fees, title searches, and taxes, typically ranging from 2% to 5% of the loan amount.')
    ]
}

# The hardcoded calculators have the FAQAccordion generally near the bottom of their page.tsx
for slug, faq_list in faqs_extra.items():
    path = os.path.join(base, slug, 'page.tsx')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Similar logic: we find the <FAQAccordion faqs={[ ... ]} /> and insert before the `]} />`
        # But here the text might be formatted slightly differently.
        # Let's search for `]} />` which is typically the end of the faqs array.
        # To be safe, we'll find `<FAQAccordion` and then the next `]} />`
        
        start_idx = text.find('<FAQAccordion')
        if start_idx != -1:
            end_idx = text.find(']} />', start_idx)
            if end_idx != -1:
                # generate the append string
                append_str = ""
                for q, a in faq_list:
                    safe_q = q.replace('"', '\\"')
                    safe_a = a.replace('"', '\\"')
                    append_str += f',\n        {{\n          question: "{safe_q}",\n          answer: "{safe_a}"\n        }}'
                
                # inject it
                new_text = text[:end_idx] + append_str + '\n      ]} />' + text[end_idx + 5:]
                
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_text)
                print(f"Injected into {slug}")

print("Done injecting hardcoded FAQs!")
