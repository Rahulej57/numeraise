const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

const lines = content.split('\n');
let currentSlug = null;

for (let i = 0; i < lines.length; i++) {
  // Check if we are entering a slug block
  const slugMatch = lines[i].match(/if\s*\(\s*slug\s*===\s*['"]([^'"]+)['"]\s*\)/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  // If we are inside a slug block, find and replace self-links
  if (currentSlug) {
    const linkRegex = new RegExp(`<Link\\s+href=["']/calculators/${currentSlug}["'][^>]*>(.*?)</Link>`, 'gi');
    lines[i] = lines[i].replace(linkRegex, '$1');
  }
}

fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
console.log('Self-links removed successfully from dynamic-seo.tsx!');
