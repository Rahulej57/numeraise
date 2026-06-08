import re

with open(r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = re.findall(r'if\s*\(\s*slug\s*===\s*[\"\']([^\"\']+)[\"\']\s*\)', text)
print('Total slugs in dynamic-seo:', len(slugs))
print(slugs)
