const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const dynamicSeoPath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Remove import
  content = content.replace(/import\s*{\s*DynamicBacklinks\s*}\s*from\s*['"]@\/components\/calculators\/dynamic-backlinks['"];?\n?/g, '');

  // Remove component usage: <DynamicBacklinks slug="..." relatedCalculators={...} />
  content = content.replace(/[ \t]*<DynamicBacklinks[^>]+>\s*/g, '');
  
  // Remove the special case in dynamic-seo.tsx fallback where it was wrapped in <CalculatorContent>
  // <CalculatorContent>\n<DynamicBacklinks ... />\n</CalculatorContent>
  content = content.replace(/<CalculatorContent>\s*<\/CalculatorContent>/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Reverted in ${filePath}`);
  }
}

// 1. Clean dynamic-seo.tsx
cleanFile(dynamicSeoPath);

// 2. Clean all page.tsx files
const dirs = fs.readdirSync(calculatorsDir);
for (const dir of dirs) {
  const stat = fs.statSync(path.join(calculatorsDir, dir));
  if (stat.isDirectory() && dir !== '[slug]' && dir !== 'category') {
    const pagePath = path.join(calculatorsDir, dir, 'page.tsx');
    cleanFile(pagePath);
  }
}

// 3. Delete dynamic-backlinks.tsx
const dbPath = path.join(__dirname, '../src/components/calculators/dynamic-backlinks.tsx');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted dynamic-backlinks.tsx');
}

console.log('Cleanup complete.');
