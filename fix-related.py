import os, re
base = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'
for d in os.listdir(base):
    path = os.path.join(base, d, 'page.tsx')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        pattern = r'(<RelatedCalculators\s+calculators=\{getRelatedCalculators\([^)]+\)\}\s*/>)'
        matches = re.findall(pattern, text)
        if len(matches) > 1:
            # We'll just replace the first match with an empty string
            text = text.replace(matches[0], '', 1)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(text)
            print(f'Fixed {d}')
