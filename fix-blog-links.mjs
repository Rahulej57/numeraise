import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'public/blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/href="\/investments"/g, 'href="/calculators/category/investments"');
  content = content.replace(/href="\/loans"/g, 'href="/calculators/category/loans"');
  content = content.replace(/href="\/tax"/g, 'href="/calculators/category/taxes"');
  
  // Footer page clean routes
  content = content.replace(/href="\/about-us\.html"/g, 'href="/about"');
  content = content.replace(/href="\/contact\.html"/g, 'href="/contact"');
  content = content.replace(/href="\/privacy\.html"/g, 'href="/privacy"');
  content = content.replace(/href="\/terms\.html"/g, 'href="/terms"');
  content = content.replace(/href="\/disclaimer\.html"/g, 'href="/disclaimer"');
  content = content.replace(/href="\/cookie-policy\.html"/g, 'href="/cookie-policy"');
  content = content.replace(/href="\/accessibility\.html"/g, 'href="/accessibility"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed links in ${file}`);
}
