import os, re

calculators_dir = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'

paths = []
for root, dirs, files in os.walk(calculators_dir):
    for file in files:
        if file == 'page.tsx':
            paths.append(os.path.join(root, file))

# Add dynamic-seo.tsx
paths.append(r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx')

for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find <RelatedCalculators ... />
    related_match = re.search(r'(\s*(?:\{[^\}]*\})?<RelatedCalculators.*?(?:/>|<\/RelatedCalculators>)\s*)', content, re.DOTALL)
    # Find <FAQAccordion ... />
    faq_match = re.search(r'(\s*<FAQAccordion.*?/>\s*)', content, re.DOTALL)

    if related_match and faq_match:
        related_str = related_match.group(1)
        faq_str = faq_match.group(1)
        
        # If RelatedCalculators is currently BEFORE FAQAccordion
        if content.find(related_str) < content.find(faq_str):
            # We want FAQAccordion to be before RelatedCalculators
            # So we remove them both and insert them in the reverse order at the location of RelatedCalculators
            insert_pos = content.find(related_str)
            new_content = content.replace(faq_str, '').replace(related_str, '')
            new_content = new_content[:insert_pos] + faq_str + related_str + new_content[insert_pos:]
            
            with open(p, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Swapped in {os.path.basename(os.path.dirname(p))}/{os.path.basename(p)}')
