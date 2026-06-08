import os, re

paths = [
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\401k-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\budget-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\emi-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\fd-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\home-loan-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\lease-vs-buy\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\lumpsum-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\net-worth-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\paycheck-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\sip-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\us-mortgage-calculator\page.tsx',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators\[slug]\page.tsx'
]

for p in paths:
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reorder tags: move FAQAccordion to the bottom, right before <StructuredData
    # Original order is usually FAQAccordion -> RelatedCalculators -> RelatedArticles
    # We want: RelatedCalculators -> RelatedArticles -> FAQAccordion
    content = re.sub(
        r'(<FAQAccordion.*?/>)\s*(<RelatedCalculators.*?/>)\s*(<RelatedArticles.*?/>)?',
        lambda m: m.group(2) + '\n      ' + (m.group(3) + '\n      ' if m.group(3) else '') + m.group(1),
        content,
        flags=re.DOTALL
    )

    # Clean up empty RelatedArticles tags that might have been left if there are no related guides
    content = re.sub(r'<RelatedArticles articles=\{\[\]\}\s*/>', '', content)

    # Fix emi-calculator titles
    if 'emi-calculator' in p:
        content = content.replace('title: "EMI Calculator - Calculate Loan EMI | Numeraise", description: "Plan your real estate purchases."', 'title: "Home Loan Calculator", description: "Plan your real estate purchases."')
        content = content.replace('title: "EMI Calculator - Calculate Loan EMI | Numeraise", description: "Calculate wealth generation through mutual funds."', 'title: "SIP Calculator", description: "Calculate wealth generation through mutual funds."')
        content = content.replace('title: "EMI Calculator - Calculate Loan EMI | Numeraise", description: "Calculate returns for one-time investments."', 'title: "Lumpsum Calculator", description: "Calculate returns for one-time investments."')
        content = re.sub(r'const relatedGuides = \[.*?\];\s*', '', content, flags=re.DOTALL)
        content = content.replace('<RelatedArticles articles={relatedGuides} />', '')

    # Fix sip-calculator titles
    if 'sip-calculator' in p:
        content = content.replace('title: "SIP Calculator - Calculate Monthly SIP Returns | Numeraise", description: "Calculate returns for one-time investments."', 'title: "Lumpsum Calculator", description: "Calculate returns for one-time investments."')
        content = content.replace('title: "SIP Calculator - Calculate Monthly SIP Returns | Numeraise", description: "Calculate secure Fixed Deposit returns."', 'title: "FD Calculator", description: "Calculate secure Fixed Deposit returns."')
        content = content.replace('title: "SIP Calculator - Calculate Monthly SIP Returns | Numeraise", description: "Plan your real estate purchases."', 'title: "Home Loan Calculator", description: "Plan your real estate purchases."')
        content = re.sub(r'const relatedGuides = \[.*?\];\s*', '', content, flags=re.DOTALL)
        content = content.replace('<RelatedArticles articles={relatedGuides} />', '')

    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done fixing layout and titles!")
