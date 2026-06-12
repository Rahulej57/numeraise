const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The string we want to inject.
// Since we have access to relatedCalculators in the scope of each `if (slug === ...)` block,
// we can use it dynamically!
const injectedString = `
          {relatedCalculators && relatedCalculators.length > 0 && (
            <p className="print:hidden">
              <em><strong>Related Tool:</strong> For a complete analysis, we also recommend checking out our <a href={relatedCalculators[0].href} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">{relatedCalculators[0].title}</a>.</em>
            </p>
          )}
`;

// We will split the file by `<CalculatorContent>`
// For each block after the first one, we find the first `</p>` and insert the injectedString right after it.
let parts = content.split('<CalculatorContent>');

for (let i = 1; i < parts.length; i++) {
  let part = parts[i];
  
  // Find the first </p> in this part
  const pIndex = part.indexOf('</p>');
  
  if (pIndex !== -1) {
    // If it already has "Related Tool:", skip it to avoid duplicates if we run it twice
    if (!part.includes('Related Tool:')) {
      const before = part.substring(0, pIndex + 4); // Include </p>
      const after = part.substring(pIndex + 4);
      parts[i] = before + injectedString + after;
    }
  }
}

content = parts.join('<CalculatorContent>');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully injected contextual backlinks to all calculators.');
