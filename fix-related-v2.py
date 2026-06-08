import os, re
base = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'
for d in os.listdir(base):
    path = os.path.join(base, d, 'page.tsx')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Count total RelatedCalculators
        count = text.count('<RelatedCalculators')
        if count > 1:
            # We find the exact string of the first one to replace it
            # It looks like <RelatedCalculators calculators={...} />
            pattern = r'(<RelatedCalculators\s+calculators=\{[^}]+\}\s*/>)'
            matches = re.findall(pattern, text)
            if len(matches) > 1:
                # Replace only the first occurrence
                text = text.replace(matches[0], '', 1)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(text)
                print(f'Fixed {d}')
            else:
                print(f'Could not match in {d}')
