import os, re

config_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\config\calculators.tsx'
with open(config_path, 'r', encoding='utf-8') as f:
    config_content = f.read()

hrefs = re.findall(r'href:\s*"/calculators/([^"]+)"', config_content)

hardcoded_dir = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'
hardcoded = [d for d in os.listdir(hardcoded_dir) if os.path.isdir(os.path.join(hardcoded_dir, d)) and d != '[category]' and d != '[slug]']

dynamic = [h for h in hrefs if h not in hardcoded]

seo_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(seo_path, 'r', encoding='utf-8') as f:
    seo_content = f.read()

missing = []
for d in dynamic:
    if f'slug === "{d}"' not in seo_content:
        missing.append(d)

print(f'Total dynamic calculators: {len(dynamic)}')
print('Missing SEO:', missing)
