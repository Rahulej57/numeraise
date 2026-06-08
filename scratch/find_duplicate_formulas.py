import os

def main():
    base_dir = 'src/app/(main)/calculators'
    
    for item in os.listdir(base_dir):
        path = os.path.join(base_dir, item)
        if os.path.isdir(path):
            page_path = os.path.join(path, 'page.tsx')
            if os.path.exists(page_path):
                content = open(page_path, encoding='utf-8').read()
                
                # Count headers related to formula
                headers = []
                for term in ['Mathematical Formula', 'The Amortization Formula', 'The Formula', 'Standard Formula']:
                    count = content.lower().count(term.lower())
                    if count > 0:
                        headers.append(f"{term} ({count}x)")
                        
                if len(headers) > 1 or any('2x' in h or '3x' in h for h in headers):
                    print(f"{item} page.tsx has multiple formula headers: {headers}")

if __name__ == '__main__':
    main()
