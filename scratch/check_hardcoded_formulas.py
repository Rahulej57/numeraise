import os

def main():
    base_dir = 'src/app/(main)/calculators'
    no_formula = []
    has_formula_no_bg_muted = []
    
    for item in os.listdir(base_dir):
        path = os.path.join(base_dir, item)
        if os.path.isdir(path):
            page_path = os.path.join(path, 'page.tsx')
            if os.path.exists(page_path):
                content = open(page_path, encoding='utf-8').read()
                
                # Check for "formula" (case insensitive)
                has_formula = "formula" in content.lower()
                has_bg_muted = "bg-muted" in content and "font-mono" in content
                
                # Let's also check if it renders DynamicSEO or does it have custom paragraph texts
                if not has_formula:
                    no_formula.append(item)
                elif not has_bg_muted:
                    # Some might import DynamicSEO which has formulas, let's check if they import DynamicSEO
                    if "DynamicSEO" not in content:
                        has_formula_no_bg_muted.append(item)

    print("Hardcoded calculators with no 'formula' keyword:")
    for item in no_formula:
        print(f" - {item}")
        
    print("\nHardcoded calculators with 'formula' keyword but no 'bg-muted font-mono' container (and no DynamicSEO):")
    for item in has_formula_no_bg_muted:
        print(f" - {item}")

if __name__ == '__main__':
    main()
