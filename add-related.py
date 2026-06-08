import os, re

calculators_dir = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\app\(main)\calculators'

paths = []
for root, dirs, files in os.walk(calculators_dir):
    for file in files:
        if file == 'page.tsx':
            paths.append(os.path.join(root, file))

# We only care about files that DON'T have <RelatedCalculators
targets = []
for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<RelatedCalculators' not in content and 'life-insurance-calculator' not in p and '[slug]' not in p and os.path.basename(os.path.dirname(p)) != 'calculators' and os.path.basename(os.path.dirname(p)) != 'category':
        targets.append(p)

for p in targets:
    slug = os.path.basename(os.path.dirname(p))
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add imports if they don't exist
    if 'RelatedCalculators' not in content:
        # Find the last import
        import_match = list(re.finditer(r'^import .*?;$', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            insert_pos = last_import.end()
            imports = '\nimport { RelatedCalculators } from "@/components/calculators/related-calculators";\nimport { getRelatedCalculators } from "@/config/calculators";'
            content = content[:insert_pos] + imports + content[insert_pos:]
        else:
            imports = 'import { RelatedCalculators } from "@/components/calculators/related-calculators";\nimport { getRelatedCalculators } from "@/config/calculators";\n'
            content = imports + content

    # Inject component
    injection = f'\n      <RelatedCalculators calculators={{getRelatedCalculators("{slug}")}} />\n      '
    
    if '<FAQAccordion' in content:
        content = re.sub(r'(<FAQAccordion.*?/>)', lambda m: injection.lstrip('\n') + m.group(1), content)
    elif '<StructuredData' in content:
        content = re.sub(r'(<StructuredData)', lambda m: injection.lstrip('\n') + m.group(1), content)
    else:
        # Just put it before the last </div> or </> or something
        content = re.sub(r'(</(div|main|)>)\s*$', lambda m: injection.lstrip('\n') + m.group(1), content)

    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(targets)} files!")
