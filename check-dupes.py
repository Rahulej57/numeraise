import re
from collections import Counter

config_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\config\calculators.tsx'
with open(config_path, 'r', encoding='utf-8') as f:
    text = f.read()

names = re.findall(r'name:\s*"([^"]+)"', text)
hrefs = re.findall(r'href:\s*"([^"]+)"', text)

print('Duplicate names:', [k for k, v in Counter(names).items() if v > 1])
print('Duplicate hrefs:', [k for k, v in Counter(hrefs).items() if v > 1])
