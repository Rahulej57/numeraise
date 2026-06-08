import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

custom_seo = {
    "ssy-calculator": """  if (slug === "ssy-calculator") {
    return (
      <div className="mt-12">
        <CalculatorContent>
          <h2>What is the Sukanya Samriddhi Yojana (SSY) Calculator?</h2>
          <p>The SSY Calculator is designed to compute the exact maturity value of investments made under the government-backed Sukanya Samriddhi Yojana scheme for the girl child.</p>
          
          <h2>How it Works</h2>
          <p>Under the SSY scheme, you only deposit money for the <strong>first 15 years</strong>, even though the account matures at 21 years.</p>
          <p>This calculator automatically applies the <strong>current SSY interest rate of ~8.0% p.a.</strong> (compounded annually) and simulates your yearly investments over the 15-year payment term, followed by 6 years of pure compounding.</p>

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>A = P × (1 + r/n)^(nt)</p>
            <p className="mt-2 text-xs text-muted-foreground">The calculator applies this formula for every yearly deposit iteratively across the 21-year period.</p>
          </div>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "Can I invest in SSY after 15 years?",
            answer: "No. The scheme only allows deposits for the first 15 years from the date of account opening. For the remaining 6 years until maturity, your balance continues to earn interest without requiring further deposits."
          },
          {
            question: "Is the SSY interest taxable?",
            answer: "No, SSY falls under the EEE (Exempt-Exempt-Exempt) category. The principal, interest earned, and maturity amount are all completely tax-free."
          },
          {
            question: "What is the maximum amount I can invest?",
            answer: "The maximum allowed deposit is ₹1.5 Lakhs per financial year. Deposits above this do not earn interest."
          }
        ]} />
        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}
      </div>
    );
  }""",
    
    "rental-yield": """  if (slug === "rental-yield") {
    return (
      <div className="mt-12">
        <CalculatorContent>
          <h2>What is the Rental Yield Calculator?</h2>
          <p>The Rental Yield Calculator measures the return on investment (ROI) a property generates purely from rental income. It is the most critical metric for real estate investors.</p>
          
          <h2>How it Works</h2>
          <p>The calculator takes your property value and monthly rent, annualizes the rent, and divides it by the property's total cost to give you a clear percentage yield.</p>

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Gross Rental Yield = (Monthly Rent × 12) / Property Value × 100</p>
          </div>
          
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>Compare Assets:</strong> Compare a 3% yielding apartment with a 7% yielding fixed deposit.</li>
            <li><strong>Pricing Accuracy:</strong> Helps landlords ensure they aren't undercharging for rent based on the capital value of their asset.</li>
          </ul>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "What is a 'good' rental yield?",
            answer: "In major metros in India, residential rental yields typically range from 2% to 4%. Commercial properties often yield between 6% and 9%."
          },
          {
            question: "Is gross yield different from net yield?",
            answer: "Yes! Gross yield (calculated here) ignores expenses. Net yield subtracts property taxes, maintenance, insurance, and vacancy periods from the annual rent before dividing by the property value."
          }
        ]} />
        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}
      </div>
    );
  }""",
  
  "break-even-calculator": """  if (slug === "break-even-calculator") {
    return (
      <div className="mt-12">
        <CalculatorContent>
          <h2>What is the Break-Even Calculator?</h2>
          <p>The Break-Even Point (BEP) calculator tells business owners exactly how many units they must sell to cover all their costs. Before this point, the business is losing money; after this point, every sale is profit.</p>
          
          <h2>How it Works</h2>
          <p>The calculator divides your fixed costs (like rent and salaries) by your Contribution Margin (which is the selling price minus the variable cost to produce one unit).</p>

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)</p>
          </div>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "What are fixed vs variable costs?",
            answer: "Fixed costs (rent, software, salaries) don't change whether you sell 1 unit or 1000. Variable costs (raw materials, shipping) increase directly with every unit you sell."
          },
          {
            question: "What is Contribution Margin?",
            answer: "It is the Selling Price minus the Variable Cost. It represents how much 'contribution' each sale makes towards paying off your fixed costs."
          }
        ]} />
        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}
      </div>
    );
  }""",
  
  "epf-calculator": """  if (slug === "epf-calculator") {
    return (
      <div className="mt-12">
        <CalculatorContent>
          <h2>What is the EPF Calculator?</h2>
          <p>The Employees' Provident Fund (EPF) calculator forecasts your retirement corpus by projecting the combined monthly contributions of both you and your employer over your working years.</p>
          
          <h2>How it Works</h2>
          <p>This engine automatically applies a standard 12% employee contribution, a 3.67% employer contribution (as the remaining 8.33% goes to EPS), and an assumed current EPF interest rate of ~8.15% p.a. to compound your wealth over decades.</p>

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Maturity = Total Contributions × (1 + EPF Interest Rate)</p>
            <p className="mt-2 text-xs text-muted-foreground">The interest is calculated monthly but credited annually.</p>
          </div>
        </CalculatorContent>

        <FAQAccordion faqs={[
          {
            question: "Why is the employer contribution only 3.67%?",
            answer: "While employers match your 12%, 8.33% of their share is diverted to the Employees' Pension Scheme (EPS) up to a wage ceiling, meaning only 3.67% is added to your EPF corpus."
          },
          {
            question: "Is EPF maturity completely tax-free?",
            answer: "Yes, provided you withdraw it after 5 continuous years of service. It falls under the EEE (Exempt-Exempt-Exempt) category."
          }
        ]} />
        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}
      </div>
    );
  }"""
}

# Find and replace generic blocks
def replace_block(slug, custom_content, full_text):
    pattern = r'(if\s*\(\s*slug\s*===\s*[\'"]' + slug + r'[\'"]\s*\)\s*\{\s*return\s*\(\s*<div.*?</div>\s*\);\s*\})'
    match = re.search(pattern, full_text, flags=re.DOTALL)
    if match:
        return full_text.replace(match.group(1), custom_content)
    return full_text

new_content = content
for slug, custom_text in custom_seo.items():
    new_content = replace_block(slug, custom_text, new_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Replaced blocks for {list(custom_seo.keys())}")
