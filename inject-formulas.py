import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

formulas = {
    'inflation-calculator': '<p>Future Value = Present Value × (1 + Inflation Rate) ^ Years</p>',
    'gratuity-calculator': '<p>Gratuity = (15 × Last Drawn Salary × Tenure in Years) / 26</p>',
    'post-office-mis': '<p>Monthly Income = (Principal Amount × Annual Interest Rate) / 12</p>',
    'rd-calculator': '<p>Maturity Value = Monthly Deposit × [((1 + R/400)^N - 1) / (1 - (1 + R/400)^(-1/3))]</p>',
    'nps-calculator': '<p>Maturity = Σ (Monthly Investment × (1 + r)^n)</p>',
    'epf-calculator': '<p>Maturity = Total Contributions × (1 + EPF Interest Rate)</p>',
    'swp-calculator': '<p>Remaining Balance = Previous Balance × (1 + r) - Withdrawal Amount</p>',
    'ppf-calculator': '<p>Maturity = P × [({(1 + i)^n} - 1) / i]</p>',
    'step-up-sip': '<p>Maturity = Σ (Monthly SIP × (1 + Step-up%)^t × (1 + r)^n)</p>',
    'margin-calculator': '<p>Gross Margin (%) = (Sale Price - Cost) / Sale Price × 100</p>',
    'mutual-fund-returns': '<p>CAGR (%) = [(Current Value / Total Investment) ^ (1 / Years) - 1] × 100</p>',
    'stock-profit': '<p>Total Profit / Loss = (Sell Price - Buy Price) × Quantity</p>',
    'dividend-yield': '<p>Dividend Yield (%) = (Annual Dividend per Share / Current Stock Price) × 100</p>',
    'car-loan-emi': '<p>EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]</p>',
    'personal-loan-calculator': '<p>EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]</p>',
    'education-loan-calculator': '<p>EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]</p>',
    'loan-refinance': '<p>Total Savings = (Old EMI × Remaining Months) - (New EMI × Remaining Months)</p>',
    'credit-card-payoff': '<p>Months to Payoff = -log(1 - (Balance × Monthly Rate) / Payment) / log(1 + Monthly Rate)</p>',
    'pomis-calculator': '<p>Monthly Income = (Investment Amount × Annual Interest Rate) / 12</p>',
    'scss-calculator': '<p>Quarterly Interest = (Investment Amount × Interest Rate) / 4</p>',
    'ssy-calculator': '<p>A = P × (1 + r/n)^(nt)</p>',
    'nsc-calculator': '<p>Maturity Amount = Investment Amount × (1 + Interest Rate / 100)^5</p>',
    'hra-exemption': '<p>Exemption = Min(Actual HRA, Rent Paid - 10% Basic, 50%/40% Basic)</p>',
    'capital-gains-tax': '<p>Capital Gains Tax = (Sale Value - Purchase Value) × Applicable Tax Rate</p>',
    'tds-calculator': '<p>TDS Amount = Total Amount × (TDS Rate / 100)</p>',
    'advance-tax': '<p>Advance Tax Payable = (Estimated Tax Liability) - TDS Deducted</p>',
    'health-insurance-calculator': '<p>Recommended Coverage = Base Cover + Age/City Multipliers</p>',
    'life-insurance-premium': '<p>Premium = Life Cover Amount × Age-Adjusted Base Rate</p>',
    'human-life-value': '<p>HLV = Family Share × [1 - (1 + Inflation-Adjusted Return)^-Years] / Return</p>',
    'fire-calculator': '<p>FIRE Number = Annual Expenses / Safe Withdrawal Rate</p>',
    'pension-calculator': '<p>Monthly Pension = (Retirement Corpus × Annuity Rate) / 12</p>',
    'markup-calculator': '<p>Markup (%) = ((Selling Price - Cost Price) / Cost Price) × 100</p>',
    'break-even-calculator': '<p>Break-Even Units = Fixed Costs / (Selling Price - Variable Cost)</p>',
    'roi-calculator': '<p>ROI (%) = ((Amount Returned - Amount Invested) / Amount Invested) × 100</p>',
    'discount-calculator': '<p>Final Price = Original Price - (Original Price × Discount %)</p>',
    'ebitda-calculator': '<p>EBITDA = Net Income + Taxes + Interest + Depreciation & Amortization</p>',
    'rental-yield': '<p>Gross Rental Yield (%) = (Monthly Rent × 12) / Property Value × 100</p>',
    'stamp-duty': '<p>Total Govt Fees = (Property Value × Stamp Duty %) + (Property Value × Registration %)</p>',
    'crypto-profit': '<p>Total Profit = (Sell Price - Buy Price) × Number of Coins</p>',
    'forex-pip': '<p>Total Profit/Loss = Pip Value × Pip Movement</p>'
}

# The 27 auto-generated calculators do not have the H3 Formula section.
# We need to find: 
# <p>Once entered, the calculator runs these variables through standard financial and mathematical formulas to instantly compute your results, saving you from complex manual mathematics.</p>
# And replace it with that paragraph + the formula section.

# For others that might have it mixed up, we'll try to standardize.

def fix_blocks(text):
    for slug, formula_html in formulas.items():
        # Find the block for this slug
        pattern = r'(if\s*\(\s*slug\s*===\s*[\'"]' + slug + r'[\'"]\s*\)\s*\{\s*return\s*\(\s*<div.*?</div>\s*\);\s*\})'
        match = re.search(pattern, text, flags=re.DOTALL)
        if match:
            block = match.group(1)
            
            # Check if it already has "<h3>The Mathematical Formula</h3>"
            if "<h3>The Mathematical Formula</h3>" not in block:
                # Add it after the "Once entered..." paragraph
                search_para = "<p>Once entered, the calculator runs these variables through standard financial and mathematical formulas to instantly compute your results, saving you from complex manual mathematics.</p>"
                
                if search_para in block:
                    new_formula_section = f"""{search_para}

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            {formula_html}
          </div>"""
                    new_block = block.replace(search_para, new_formula_section)
                    text = text.replace(block, new_block)
                else:
                    # Maybe it's missing entirely or has generic "How it works"
                    search_para2 = "<h2>How it Works</h2>\n          <p>Simply enter your inputs into the fields provided. The calculator uses standard financial formulas to instantly compute the results, saving you from complex manual mathematics.</p>"
                    if search_para2 in block:
                        new_formula_section = f"""{search_para2}

          <h3>The Mathematical Formula</h3>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            {formula_html}
          </div>"""
                        new_block = block.replace(search_para2, new_formula_section)
                        text = text.replace(block, new_block)
    return text

new_text = fix_blocks(text)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Injected explicit formula sections for all calculators!")
