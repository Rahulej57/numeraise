import os, re

config_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\config\calculators.tsx'
with open(config_path, 'r', encoding='utf-8') as f:
    config_content = f.read()

hrefs = re.findall(r'href:\s*"/calculators/([^"]+)"', config_content)

hardcoded_dir = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'
hardcoded = [d for d in os.listdir(hardcoded_dir) if os.path.isdir(os.path.join(hardcoded_dir, d)) and d != '[category]' and d != '[slug]']

dynamic = [h for h in hrefs if h not in hardcoded]

engine_path = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculator-engine.ts'
with open(engine_path, 'r', encoding='utf-8') as f:
    engine_content = f.read()

missing_registry = []
for d in dynamic:
    if f'"{d}": {{' not in engine_content and f"'{d}': {{" not in engine_content:
        missing_registry.append(d)

print(f'Missing from registry ({len(missing_registry)}):', missing_registry)
