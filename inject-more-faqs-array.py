import os, re

base = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'

faqs_extra = {
    '401k-calculator': [
        ('What happens if I withdraw my 401(k) early?', 'If you withdraw funds before age 59½, you will generally be hit with a 10% early withdrawal penalty from the IRS, plus ordinary income tax on the amount withdrawn.'),
        ('Is there a maximum I can contribute to my 401(k)?', 'Yes. For 2024, the IRS limit for employee contributions is $23,000. If you are 50 or older, you can make an additional catch-up contribution of $7,500.')
    ],
    'budget-calculator': [
        ('What is the 50/30/20 rule?', 'It is a popular budgeting guideline where 50% of your income goes to Needs (rent, groceries), 30% to Wants (entertainment, dining), and 20% to Savings and Debt repayment.'),
        ('Should I budget based on gross or net income?', 'You should always budget based on your Net Income (take-home pay after taxes and deductions). Budgeting on gross income will leave you short on cash.')
    ],
    'emi-calculator': [
        ('Does EMI change if the RBI changes interest rates?', 'If you have a floating rate loan, your EMI usually stays the same, but the tenure (duration) of your loan increases or decreases based on the new rate.'),
        ('Can I pay more than my EMI every month?', 'Yes, this is called making a part-prepayment. Any extra amount you pay goes directly toward reducing your principal, which drastically reduces your total interest.')
    ],
    'fd-calculator': [
        ('What is the difference between simple and compound FD?', 'Simple FDs pay out interest monthly or quarterly to your savings account. Cumulative (compound) FDs reinvest the interest, giving you a much larger lump sum at maturity.'),
        ('Are Fixed Deposits risk-free?', 'In India, bank FDs are insured up to ₹5 Lakhs by DICGC. While they are essentially risk-free from default, they carry inflation risk if the interest rate is lower than inflation.')
    ],
    'home-loan-calculator': [
        ('Should I choose a fixed or floating interest rate for a home loan?', 'Home loans are long-term commitments (15-20 years). Floating rates are generally cheaper over the long run, as fixed-rate loans carry a higher premium for the security they offer.'),
        ('What is an amortization schedule?', 'It is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off.')
    ],
    'lease-vs-buy': [
        ('Is leasing a car cheaper than buying?', 'Leasing offers lower monthly payments because you are only paying for the vehicle\'s depreciation during the lease term. However, buying is cheaper in the long run because you eventually own a driving asset with no monthly payments.'),
        ('Can I customize a leased car?', 'Generally, no. You must return the car in its original condition. Any permanent modifications or severe wear-and-tear will result in heavy penalty charges at the end of the lease.')
    ],
    'lumpsum-calculator': [
        ('Is it better to invest a lump sum or use SIP?', 'Mathematically, if the market goes up over the long term, investing a lump sum immediately yields higher returns. However, SIPs offer psychological comfort and protect against investing right before a market crash.'),
        ('Can I withdraw my lump sum investment anytime?', 'It depends on the investment vehicle. Equity mutual funds have no lock-in (except ELSS which has 3 years). Fixed deposits usually have penalties for early withdrawal.')
    ],
    'net-worth-calculator': [
        ('Is a primary residence included in net worth?', 'Yes, standard net worth calculations include the market value of your home as an asset, and the outstanding mortgage as a liability. However, "Liquid Net Worth" entirely excludes real estate.'),
        ('What is a good net worth for my age?', 'A popular formula by Thomas Stanley (author of The Millionaire Next Door) is: (Age × Pre-Tax Annual Income) ÷ 10. If your net worth is higher than this number, you are doing well.')
    ],
    'paycheck-calculator': [
        ('Why is my paycheck much lower than my salary?', 'Your gross salary is subjected to federal taxes, state taxes, FICA (Social Security and Medicare), and voluntary deductions like 401(k) contributions and health insurance premiums before it hits your bank account.'),
        ('What is the difference between W-2 and 1099?', 'A W-2 employee has taxes withheld automatically by the employer. A 1099 independent contractor receives the full gross amount and is personally responsible for calculating and paying their own taxes quarterly.')
    ],
    'sip-calculator': [
        ('Can I pause my SIP if I lose my job?', 'Yes, most mutual fund AMCs allow you to pause your SIP mandate for up to 3 or 6 months without any penalties, and your existing corpus will continue to grow.'),
        ('What is the benefit of Rupee Cost Averaging?', 'Because you invest a fixed amount every month, you buy more units when the market is down and fewer when it is high. This automatically lowers your average cost per unit over time.')
    ],
    'us-mortgage-calculator': [
        ('What is Private Mortgage Insurance (PMI)?', 'If your down payment is less than 20% of the home\'s value, lenders require you to pay PMI. It protects the lender (not you) if you default on the loan.'),
        ('What are closing costs?', 'Closing costs are fees paid at the end of a real estate transaction. They include origination fees, appraisal fees, title searches, and taxes, typically ranging from 2% to 5% of the loan amount.')
    ]
}

for slug, faq_list in faqs_extra.items():
    path = os.path.join(base, slug, 'page.tsx')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
            
        # The block is const faqs: FAQ[] = [ ... ];
        # We need to find `  ];` right after `const faqs: FAQ[] = [`
        start_idx = text.find('const faqs:')
        if start_idx != -1:
            end_idx = text.find('];', start_idx)
            if end_idx != -1:
                append_str = ""
                for q, a in faq_list:
                    safe_q = q.replace('"', '\\"')
                    safe_a = a.replace('"', '\\"')
                    append_str += f',\n    {{\n      question: "{safe_q}",\n      answer: "{safe_a}"\n    }}'
                
                # Replace
                new_text = text[:end_idx] + append_str + '\n  ];' + text[end_idx + 2:]
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_text)
                print(f"Injected into {slug}")

print("Done remaining hardcoded!")
