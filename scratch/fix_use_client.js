const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // We are looking for:
  // import Link from "next/link";
  // 'use client';
  // OR
  // import Link from "next/link";
  // "use client";
  
  if (content.startsWith('import Link from "next/link";\n\'use client\';')) {
    content = content.replace('import Link from "next/link";\n\'use client\';', '\'use client\';\nimport Link from "next/link";');
  } else if (content.startsWith('import Link from "next/link";\n"use client";')) {
    content = content.replace('import Link from "next/link";\n"use client";', '"use client";\nimport Link from "next/link";');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed use client in ${filePath}`);
  }
}

// 1. Fix all page.tsx files
const dirs = fs.readdirSync(calculatorsDir);
for (const dir of dirs) {
  const stat = fs.statSync(path.join(calculatorsDir, dir));
  if (stat.isDirectory()) {
    const pagePath = path.join(calculatorsDir, dir, 'page.tsx');
    fixFile(pagePath);
  }
}

console.log('Use client fix complete.');
