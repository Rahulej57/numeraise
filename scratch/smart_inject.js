const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove the old injected string completely
const oldInjectedString = `
          {relatedCalculators && relatedCalculators.length > 0 && (
            <p className="print:hidden">
              <em><strong>Related Tool:</strong> For a complete analysis, we also recommend checking out our <a href={relatedCalculators[0].href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{relatedCalculators[0].title}</a>.</em>
            </p>
          )}`;

content = content.split(oldInjectedString).join('');

// 2. Add the import for DynamicBacklinks at the top if it doesn't exist
if (!content.includes('DynamicBacklinks')) {
  content = content.replace(
    'import { RelatedCalculators } from "@/components/calculators/related-calculators";',
    'import { RelatedCalculators } from "@/components/calculators/related-calculators";\nimport { DynamicBacklinks } from "@/components/calculators/dynamic-backlinks";'
  );
}

// 3. Inject `<DynamicBacklinks slug={slug} relatedCalculators={relatedCalculators} />` after the first </p> of each CalculatorContent
let parts = content.split('<CalculatorContent>');

for (let i = 1; i < parts.length; i++) {
  let part = parts[i];
  
  const pIndex = part.indexOf('</p>');
  
  if (pIndex !== -1) {
    if (!part.includes('<DynamicBacklinks')) {
      const before = part.substring(0, pIndex + 4); 
      const after = part.substring(pIndex + 4);
      parts[i] = before + '\n          <DynamicBacklinks slug={slug} relatedCalculators={relatedCalculators} />' + after;
    }
  }
}

content = parts.join('<CalculatorContent>');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully cleaned up old links and injected DynamicBacklinks.');
