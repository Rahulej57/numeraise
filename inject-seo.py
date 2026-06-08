import os

seo_data = {
    'mutual-fund-returns': ('Mutual Fund Returns Calculator', 'mutual fund investments and projected growth'),
    'stock-profit': ('Stock Profit Calculator', 'potential profits and losses from stock market investments'),
    'dividend-yield': ('Dividend Yield Calculator', 'annual dividend income relative to stock price'),
    'car-loan-emi': ('Car Loan EMI Calculator', 'monthly vehicle loan installments and interest'),
    'personal-loan-calculator': ('Personal Loan Calculator', 'unsecured loan EMIs and total repayment amount'),
    'education-loan-calculator': ('Education Loan Calculator', 'student loan repayment schedules'),
    'loan-refinance': ('Loan Refinance Calculator', 'potential savings from switching to a lower interest rate'),
    'credit-card-payoff': ('Credit Card Payoff Calculator', 'time and interest required to eliminate credit card debt'),
    'pomis-calculator': ('Post Office Monthly Income Scheme Calculator', 'guaranteed monthly returns from POMIS'),
    'scss-calculator': ('Senior Citizen Savings Scheme Calculator', 'retirement income from SCSS deposits'),
    'ssy-calculator': ('Sukanya Samriddhi Yojana Calculator', 'maturity value for girl child education and marriage'),
    'nsc-calculator': ('National Savings Certificate Calculator', 'fixed-income returns from NSC investments'),
    'hra-exemption': ('HRA Exemption Calculator', 'House Rent Allowance tax deductions'),
    'capital-gains-tax': ('Capital Gains Tax Calculator', 'short-term and long-term taxes on asset sales'),
    'tds-calculator': ('TDS Calculator', 'Tax Deducted at Source on various income streams'),
    'advance-tax': ('Advance Tax Calculator', 'quarterly advance tax liability'),
    'health-insurance-calculator': ('Health Insurance Premium Calculator', 'estimated medical coverage costs'),
    'life-insurance-premium': ('Life Insurance Premium Calculator', 'term life and whole life policy premiums'),
    'human-life-value': ('Human Life Value Calculator', 'optimal insurance coverage based on future earnings'),
    'fire-calculator': ('FIRE Calculator', 'timeline for Financial Independence and Retiring Early'),
    'pension-calculator': ('Pension Calculator', 'post-retirement monthly annuity payouts'),
    'markup-calculator': ('Markup Calculator', 'product pricing strategies based on cost and desired profit'),
    'break-even-calculator': ('Break Even Point Calculator', 'sales volume needed to cover business costs'),
    'roi-calculator': ('Return on Investment Calculator', 'efficiency and profitability of investments'),
    'discount-calculator': ('Discount Calculator', 'final price after applying percentage discounts'),
    'ebitda-calculator': ('EBITDA Calculator', 'operating performance excluding non-operating expenses'),
    'rental-yield': ('Rental Yield Calculator', 'annual return on real estate investments'),
    'stamp-duty': ('Stamp Duty Calculator', 'property registration charges and taxes'),
    'crypto-profit': ('Crypto Profit Calculator', 'cryptocurrency trading gains and losses'),
    'forex-pip': ('Forex Pip Calculator', 'value per pip in foreign exchange trading')
}

template = """
  if (slug === "[SLUG]") {
    return (
      <div className="mt-12">
        <CalculatorContent>
          <h2>What is the [NAME]?</h2>
          <p>The [NAME] is a powerful financial tool designed to help you quickly and accurately calculate your [DESC]. Whether you are planning for the future or analyzing current data, this calculator provides instant insights.</p>
          
          <h2>How it Works</h2>
          <p>Simply enter your inputs into the fields provided. The calculator uses standard financial formulas to instantly compute the results, saving you from complex manual mathematics.</p>

          <h3>Key Benefits</h3>
          <ul>
            <li><strong>Accuracy:</strong> Eliminates human error in complex financial calculations.</li>
            <li><strong>Speed:</strong> Get instant results to make faster financial decisions.</li>
            <li><strong>Clarity:</strong> Visualizes your data so you can understand your financial position better.</li>
          </ul>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "Is this calculator free to use?",
            answer: "Yes, all our financial calculators are completely free to use with no hidden charges."
          },
          {
            question: "How accurate are the results?",
            answer: "The results are highly accurate and based on standard mathematical formulas used in the financial industry."
          },
          {
            question: "Can I trust this data for official purposes?",
            answer: "While highly accurate, this tool is for educational and informational purposes. Always consult a certified financial advisor for official decisions."
          }
        ]} />
        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}
      </div>
    );
  }
"""

blocks = []
for slug, (name, desc) in seo_data.items():
    block = template.replace('[SLUG]', slug).replace('[NAME]', name).replace('[DESC]', desc)
    blocks.append(block)

seo_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(seo_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before the fallback `if (relatedCalculators` block
insertion_point = content.find("if (relatedCalculators && relatedCalculators.length > 0) {")
if insertion_point != -1:
    new_content = content[:insertion_point] + '\n'.join(blocks) + '\n  ' + content[insertion_point:]
    with open(seo_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully injected SEO content for {len(seo_data)} calculators!")
else:
    print("Insertion point not found!")
