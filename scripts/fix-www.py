import os

directories = [
    'src/app',
    'src/components/seo',
]

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace exactly https://numeraise.com with https://www.numeraise.com
    # And https://Numeraise.com with https://www.numeraise.com
    new_content = content.replace('https://numeraise.com', 'https://www.numeraise.com')
    new_content = new_content.replace('https://Numeraise.com', 'https://www.numeraise.com')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, file)
                replace_in_file(filepath)

print("Done updating URLs to www!")
