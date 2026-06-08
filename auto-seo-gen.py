import os, re, json

engine_files = [
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculator-engine.ts',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculators-investments.ts',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculators-loans.ts',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculators-tax.ts',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculators-corporate.ts',
    r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\lib\calculators-other.ts',
]

configs = {}
for file in engine_files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            text = f.read()
            blocks = re.findall(r'\"([^\"]+)\":\s*\{\s*slug:(.*?)calculate:\s*\(inputs\)', text, re.DOTALL)
            for slug, block in blocks:
                name_match = re.search(r'name:\s*"([^"]+)"', block)
                desc_match = re.search(r'description:\s*"([^"]+)"', block)
                inputs = re.findall(r'label:\s*"([^"]+)"', block)
                if name_match:
                    configs[slug] = {
                        'name': name_match.group(1),
                        'desc': desc_match.group(1) if desc_match else "",
                        'inputs': inputs
                    }

seo_file = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'
with open(seo_file, 'r', encoding='utf-8') as f:
    seo_text = f.read()

customized = ['ssy-calculator', 'rental-yield', 'break-even-calculator', 'epf-calculator', 'gratuity-calculator', 'inflation-calculator', 'post-office-mis', 'rd-calculator']

count = 0
for slug, cfg in configs.items():
    if slug in customized: continue
    
    pattern = r'(if\s*\(\s*slug\s*===\s*[\'"]' + slug + r'[\'"]\s*\)\s*\{\s*return\s*\(\s*<div.*?</div>\s*\);\s*\})'
    match = re.search(pattern, seo_text, flags=re.DOTALL)
    
    if match:
        old_block = match.group(1)
        if "Whether you are planning for the future or analyzing" not in old_block:
            continue
            
        input_list = ", ".join(cfg['inputs'][:-1]) + (" and " + cfg['inputs'][-1] if len(cfg['inputs']) > 1 else cfg['inputs'][0] if cfg['inputs'] else "")
        
        name = cfg['name']
        desc = cfg['desc'].lower()
        
        # Build string without f-string
        new_block = '  if (slug === "' + slug + '") {\n'
        new_block += '    return (\n'
        new_block += '      <div className="mt-12">\n'
        new_block += '        <CalculatorContent>\n'
        new_block += '          <h2>What is the ' + name + ' Calculator?</h2>\n'
        new_block += '          <p>The ' + name + ' Calculator is a powerful financial tool designed to help you ' + desc + ' Whether you are planning for the future or analyzing current data, this calculator provides instant insights.</p>\n'
        new_block += '          \n'
        new_block += '          <h2>How it Works</h2>\n'
        new_block += '          <p>To use this engine, simply enter your specific variables. The model currently requires you to input: <strong>' + input_list + '</strong>.</p>\n'
        new_block += '          <p>Once entered, the calculator runs these variables through standard financial and mathematical formulas to instantly compute your results, saving you from complex manual mathematics.</p>\n'
        new_block += '\n'
        new_block += '          <h3>Key Benefits</h3>\n'
        new_block += '          <ul>\n'
        new_block += '            <li><strong>Accuracy:</strong> Eliminates human error when calculating ' + desc + '.</li>\n'
        new_block += '            <li><strong>Speed:</strong> Get instant results to make faster financial decisions.</li>\n'
        new_block += '            <li><strong>Clarity:</strong> Visualizes your data so you can understand your financial position better.</li>\n'
        new_block += '          </ul>\n'
        new_block += '        </CalculatorContent>\n'
        new_block += '\n'
        new_block += '        <FAQAccordion faqs={[\n'
        new_block += '          {\n'
        new_block += '            question: "Is this calculator free to use?",\n'
        new_block += '            answer: "Yes, all our financial calculators are completely free to use with no hidden charges."\n'
        new_block += '          },\n'
        new_block += '          {\n'
        new_block += '            question: "How accurate are the results?",\n'
        new_block += '            answer: "The results are highly accurate and based on exact mathematical formulas. However, real-world variables like fluctuating market conditions or changing tax laws may affect long-term projections."\n'
        new_block += '          },\n'
        new_block += '          {\n'
        new_block += '            question: "Can I trust this data for official purposes?",\n'
        new_block += '            answer: "While mathematically accurate, this tool is for educational and informational purposes. Always consult a certified financial advisor or accountant for official decisions."\n'
        new_block += '          }\n'
        new_block += '        ]} />\n'
        new_block += '        {relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}\n'
        new_block += '      </div>\n'
        new_block += '    );\n'
        new_block += '  }'
        
        seo_text = seo_text.replace(old_block, new_block)
        count += 1

with open(seo_file, 'w', encoding='utf-8') as f:
    f.write(seo_text)

print(f"Updated {count} generic SEO blocks with specific input requirements and descriptions.")
