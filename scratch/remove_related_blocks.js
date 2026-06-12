const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// The block starts with `{relatedCalculators && relatedCalculators.length > 0 && (`
// and ends with `)}` 14 lines later.
// We can use a regex to match the entire block.
const blockRegex = /\{\s*relatedCalculators\s*&&\s*relatedCalculators\.length\s*>\s*0\s*&&\s*\([\s\S]*?<\/p>\s*\n\s*\)\}/g;

content = content.replace(blockRegex, '');

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Removed all Related Tool blocks from dynamic-seo.tsx!');
