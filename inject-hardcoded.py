import os, re

hardcoded_formulas = {
    '401k-calculator': 'Future Value = P × [ (1 + r/n)^(nt) - 1 ] / (r/n)',
    'age-calculator': 'Age = Current Date - Birth Date',
    'basic-calculator': 'Result = X [+, -, ×, ÷] Y',
    'bmi-calculator': 'BMI = Weight (kg) / [Height (m)]²',
    'bmr-calculator': 'BMR (Mifflin-St Jeor) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + s',
    'body-fat-calculator': 'Body Fat % = 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76',
    'budget-calculator': 'Total Savings = Total Income - Total Expenses',
    'cagr-calculator': 'CAGR = [(Ending Value / Beginning Value)^(1 / Years) - 1] × 100',
    'currency-converter': 'Converted Amount = Original Amount × Exchange Rate',
    'date-time-calculator': 'Difference = End Date - Start Date',
    'emi-calculator': 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
    'fd-calculator': 'Maturity Amount = P × (1 + r/n)^(nt)',
    'flat-vs-reducing-loan': 'Reducing EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
    'home-loan-calculator': 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
    'home-loan-prepayment': 'Interest Saved = (Old EMI × Old Tenure) - (New EMI × New Tenure)',
    'income-tax-calculator': 'Tax = (Taxable Income - Slab Limit) × Slab Rate',
    'lease-vs-buy': 'Net Cost = Total Payments + Opportunity Cost - Residual Value',
    'life-insurance-calculator': 'Required Cover = (Annual Expenses / Safe Yield) + Liabilities - Existing Assets',
    'lumpsum-calculator': 'Future Value = P × (1 + r)^t',
    'net-worth-calculator': 'Net Worth = Total Assets - Total Liabilities',
    'paycheck-calculator': 'Net Pay = Gross Pay - Federal Taxes - State Taxes - Deductions',
    'pregnancy-due-date': 'Estimated Due Date = First day of LMP + 280 Days',
    'rent-vs-buy': 'Cost of Renting vs Cost of Owning (Mortgage + Maintenance - Appreciation)',
    'retirement-calculator': 'Corpus Needed = Annual Expenses × (1 + Inflation)^Years / Safe Withdrawal Rate',
    'salary-calculator': 'Annual Salary = Hourly Wage × Hours per Week × Weeks per Year',
    'sip-calculator': 'Future Value = P × [ (1+r)^n - 1 ] × (1+r) / r',
    'sip-vs-lumpsum': 'Compares FV of SIP vs FV of Lumpsum compounding',
    'term-insurance-calculator': 'Required Cover = Income Replacement + Outstanding Liabilities',
    'tip-calculator': 'Tip Amount = Bill Amount × (Tip Percentage / 100)',
    'us-mortgage-calculator': 'PITI = Principal + Interest + Property Taxes + Homeowners Insurance + PMI'
}

base_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'

for folder, formula in hardcoded_formulas.items():
    page_file = os.path.join(base_path, folder, 'page.tsx')
    if os.path.exists(page_file):
        with open(page_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'The Mathematical Formula' not in content:
            # Find the closing tag of CalculatorContent to inject before it
            if '</CalculatorContent>' in content:
                formula_block = f"""
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>{formula}</p>
        </div>
      </CalculatorContent>"""
                new_content = content.replace('</CalculatorContent>', formula_block, 1)
                with open(page_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Injected into {folder}")
            else:
                print(f"Skipped {folder} (No CalculatorContent)")
    else:
        print(f"File not found for {folder}")
