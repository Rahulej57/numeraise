const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/rahul/OneDrive/Desktop/antigravity/finance-platform/src/app/(main)/calculators';

function walk(dirPath) {
  let results = [];
  const list = fs.readdirSync(dirPath);
  list.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'category') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (file === 'page.tsx') results.push(fullPath);
    }
  });
  return results;
}

const files = walk(dir);
let updated = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import { CalculatorHeader }')) {
    const importStatement = 'import { CalculatorHeader } from "@/components/calculators/calculator-header";\n';
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
    } else {
      content = importStatement + content;
    }
  }

  const regex = /<div[^>]*className="[^"]*mb-6[^"]*"[^>]*>[\s\S]*?<h1[^>]*>([^<]+)<\/h1>[\s\S]*?<\/div>/;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, title) => {
      return `<CalculatorHeader title="${title.trim()}" />`;
    });
    fs.writeFileSync(file, content);
    updated++;
  }
});

console.log('Updated ' + updated + ' files');
