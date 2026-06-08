import os

def main():
    # We want to check all .tsx files in src/app and see how many times RelatedCalculators is rendered
    for r, d, fs in os.walk('src/app'):
        for f in fs:
            if f.endswith('.tsx'):
                path = os.path.join(r, f)
                content = open(path, encoding='utf-8').read()
                
                # count occurrences of <RelatedCalculators
                count = content.count('<RelatedCalculators')
                if count > 1:
                    print(f"{path} renders RelatedCalculators {count} times!")

if __name__ == '__main__':
    main()
