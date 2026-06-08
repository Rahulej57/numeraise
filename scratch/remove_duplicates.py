import os
import re

def main():
    files_to_fix = [
        'src/app/(main)/calculators/bmi-calculator/page.tsx',
        'src/app/(main)/calculators/body-fat-calculator/page.tsx',
        'src/app/(main)/calculators/currency-converter/page.tsx',
        'src/app/(main)/calculators/emi-calculator/page.tsx',
        'src/app/(main)/calculators/home-loan-calculator/page.tsx',
        'src/app/(main)/calculators/net-worth-calculator/page.tsx',
        'src/app/(main)/calculators/pregnancy-due-date/page.tsx',
        'src/app/(main)/calculators/salary-calculator/page.tsx',
        'src/app/(main)/calculators/sip-calculator/page.tsx'
    ]

    for filepath in files_to_fix:
        if not os.path.exists(filepath):
            print(f"Skipping {filepath} - does not exist")
            continue
            
        content = open(filepath, encoding='utf-8').read()
        
        # We want to remove:
        # <h3>The Mathematical Formula</h3>
        # <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
        #   <p>...</p>
        # </div>
        # and keep the </CalculatorContent>
        
        pattern = r'\s*<h3>The Mathematical Formula</h3>\s*<div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">\s*<p>.*?</p>\s*</div>(?=\s*</CalculatorContent>)'
        
        new_content, count = re.subn(pattern, '', content, flags=re.DOTALL)
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath} (removed {count} duplicate blocks)")
        else:
            print(f"No match found in {filepath}")

if __name__ == '__main__':
    main()
