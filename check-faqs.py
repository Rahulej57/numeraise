import re

with open(r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = re.findall(r'if\s*\(\s*slug\s*===\s*"([^"]+)"\s*\)', text)
for slug in slugs:
    # Find the block for this slug
    idx = text.find(f'if (slug === "{slug}")')
    end_idx = text.find('if (slug ===', idx + 10)
    if end_idx == -1:
        end_idx = len(text)
    block = text[idx:end_idx]
    
    # Count questions
    q_count = len(re.findall(r'question:\s*"', block))
    if q_count < 5:
        print(f"Slug: {slug} has {q_count} FAQs")
