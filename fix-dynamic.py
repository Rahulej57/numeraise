import re

p = r'c:\Users\rahul\OneDrive\Desktop\antigravity\finance-platform\src\components\calculators\dynamic-seo.tsx'

with open(p, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the export definition
content = content.replace(
    'export function DynamicSEO({ slug }: { slug: string }) {',
    'import { RelatedCalculators } from "@/components/calculators/related-calculators";\n\nexport function DynamicSEO({ slug, relatedCalculators }: { slug: string, relatedCalculators?: {title: string, description: string, href: string}[] }) {'
)

# Insert the RelatedCalculators before FAQAccordion
content = re.sub(
    r'(<FAQAccordion.*?/>)',
    r'{relatedCalculators && relatedCalculators.length > 0 && <RelatedCalculators calculators={relatedCalculators} />}\n        \1',
    content
)

with open(p, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done fixing dynamic-seo!")
