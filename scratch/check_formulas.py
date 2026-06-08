import re

def main():
    content = open('src/components/calculators/dynamic-seo.tsx', encoding='utf-8').read()
    
    # Let's find all the conditional blocks: "if (slug === '...')" or similar
    # We can split by 'if (slug === '
    parts = content.split('if (slug === "')
    print(f"Total blocks split: {len(parts) - 1}")
    
    no_formula_header = []
    no_formula_bg_muted = []
    
    for part in parts[1:]:
        slug = part.split('"')[0]
        # Get the code block for this slug (approx. up to the next if (slug === or return default)
        block = part[:6000]
        
        has_h3 = "formula" in block.lower()
        has_bg_muted = "bg-muted" in block and "font-mono" in block
        
        if not has_h3:
            no_formula_header.append(slug)
        elif not has_bg_muted:
            no_formula_bg_muted.append(slug)
            
    print("\nCalculators missing 'formula' keyword in content:")
    for s in no_formula_header:
        print(f" - {s}")
        
    print("\nCalculators containing 'formula' keyword but missing 'bg-muted font-mono' container:")
    for s in no_formula_bg_muted:
        print(f" - {s}")

if __name__ == '__main__':
    main()
