import re

def main():
    filepath = 'src/components/calculators/dynamic-seo.tsx'
    content = open(filepath, encoding='utf-8').read()
    
    # Replace "Calculator Calculator" in headers: "What is the XYZ Calculator Calculator?" -> "What is the XYZ Calculator?"
    # And "The XYZ Calculator Calculator is" -> "The XYZ Calculator is"
    new_content = re.sub(r'What is the ([A-Za-z0-9\(\)\s\-]+) Calculator Calculator\?', r'What is the \1 Calculator?', content)
    new_content = re.sub(r'The ([A-Za-z0-9\(\)\s\-]+) Calculator Calculator is', r'The \1 Calculator is', new_content)
    
    # Also handle lowercase variants or other matches
    new_content = re.sub(r'([Cc]alculator)\s+\1', r'\1', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully updated titles in dynamic-seo.tsx")
    else:
        print("No changes needed in dynamic-seo.tsx")

if __name__ == '__main__':
    main()
