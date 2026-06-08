import os

targets = [
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\age-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\basic-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\bmi-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\bmr-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\body-fat-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\currency-converter\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\date-time-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\flat-vs-reducing-loan\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\gst-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\home-loan-prepayment\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\income-tax-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\measurement-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\percentage-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\pregnancy-due-date\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\rent-vs-buy\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\retirement-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\salary-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\sip-vs-lumpsum\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\term-insurance-calculator\page.tsx',
r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\tip-calculator\page.tsx'
]

for p in targets:
    slug = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    injection = f'<RelatedCalculators calculators={{getRelatedCalculators("{slug}")}} />\n      '
    
    if '<FAQAccordion' in content and injection not in content:
        content = content.replace('<FAQAccordion', injection + '<FAQAccordion')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {slug}')
