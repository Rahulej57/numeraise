import os
base = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'
for d in os.listdir(base):
    path = os.path.join(base, d, 'page.tsx')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        c1 = text.count('The Mathematical Formula')
        c2 = text.count('bg-muted')
        if c1 > 1 or c2 > 1:
            print(f'{d}: Math Formula={c1}, bg-muted={c2}')
