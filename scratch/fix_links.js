const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const dynamicSeoPath = path.join(__dirname, '../src/components/calculators/dynamic-seo.tsx');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Replace <a href="/calculators/...">...</a> with <Link href="/calculators/...">...</Link>
  // Note: Only replace internal links to /calculators/ to avoid breaking external links
  content = content.replace(/<a\s+href="(\/calculators\/[^"]+)">([\s\S]*?)<\/a>/gi, '<Link href="$1">$2</Link>');

  // 2. Add import Link if needed and if we actually replaced something
  if (content !== originalContent) {
    if (!content.includes('import Link from "next/link"')) {
      // Find the last import statement or just put it at the top after "use client" if it exists
      if (content.includes('"use client";')) {
        content = content.replace('"use client";', '"use client";\nimport Link from "next/link";');
      } else {
        content = 'import Link from "next/link";\n' + content;
      }
    }
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed links in ${filePath}`);
  }
}

// 1. Fix dynamic-seo.tsx
fixFile(dynamicSeoPath);

// 2. Fix all page.tsx files
const dirs = fs.readdirSync(calculatorsDir);
for (const dir of dirs) {
  const stat = fs.statSync(path.join(calculatorsDir, dir));
  if (stat.isDirectory()) {
    const pagePath = path.join(calculatorsDir, dir, 'page.tsx');
    fixFile(pagePath);
  }
}

console.log('Link fixing complete.');
