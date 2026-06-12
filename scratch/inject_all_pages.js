const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');

function processDirectory(dirName) {
  if (dirName === '[slug]' || dirName === 'category') return;
  
  const pagePath = path.join(calculatorsDir, dirName, 'page.tsx');
  if (!fs.existsSync(pagePath)) return;
  
  let content = fs.readFileSync(pagePath, 'utf-8');
  
  // If already injected, skip
  if (content.includes('<DynamicBacklinks')) return;
  
  // If no CalculatorContent, skip
  if (!content.includes('<CalculatorContent>')) return;
  
  // 1. Add import
  if (!content.includes('DynamicBacklinks')) {
    // Find a good place to put it (after other @/components imports)
    const importMatch = content.match(/import.*@\/components\/calculators\/[^;]+;/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + '\nimport { DynamicBacklinks } from "@/components/calculators/dynamic-backlinks";');
    } else {
      content = 'import { DynamicBacklinks } from "@/components/calculators/dynamic-backlinks";\n' + content;
    }
  }
  
  // 2. Find relatedCalcs variable name
  let relatedVarName = 'relatedCalcs';
  const relatedMatch = content.match(/const\s+(\w+)\s*=\s*getRelatedCalculators\([^)]+\)/);
  if (relatedMatch) {
    relatedVarName = relatedMatch[1];
  } else {
    // If not found, inject it before the return statement
    const returnIndex = content.lastIndexOf('return (');
    if (returnIndex !== -1) {
      const beforeReturn = content.substring(0, returnIndex);
      const afterReturn = content.substring(returnIndex);
      // Make sure we have getRelatedCalculators imported
      if (!content.includes('getRelatedCalculators')) {
        content = content.replace(/import { CALCULATOR_DIRECTORY } from "@\/config\/calculators";/, 'import { CALCULATOR_DIRECTORY, getRelatedCalculators } from "@/config/calculators";');
      }
      content = beforeReturn + `  const relatedCalcs = getRelatedCalculators("${dirName}");\n  ` + afterReturn;
    }
  }
  
  // 3. Inject the component after the first </p> inside CalculatorContent
  const calcContentIndex = content.indexOf('<CalculatorContent>');
  if (calcContentIndex !== -1) {
    const afterCalcContent = content.substring(calcContentIndex);
    const pIndex = afterCalcContent.indexOf('</p>');
    if (pIndex !== -1) {
      const absolutePIndex = calcContentIndex + pIndex + 4; // length of </p>
      const before = content.substring(0, absolutePIndex);
      const after = content.substring(absolutePIndex);
      content = before + `\n        <DynamicBacklinks slug="${dirName}" relatedCalculators={${relatedVarName}} />` + after;
    }
  }
  
  fs.writeFileSync(pagePath, content, 'utf-8');
  console.log(`Injected DynamicBacklinks into ${dirName}`);
}

const dirs = fs.readdirSync(calculatorsDir);
for (const dir of dirs) {
  const stat = fs.statSync(path.join(calculatorsDir, dir));
  if (stat.isDirectory()) {
    processDirectory(dir);
  }
}

console.log('Finished processing all hardcoded calculator pages.');
