import re

file_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

parts = text.split('if (slug === "')
for part in parts[1:]:
    slug = part.split('"', 1)[0]
    if 'Is this calculator free to use' in part:
        print(f'{slug} still generic')
