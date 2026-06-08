import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src/app/(main)/calculators');
const existingSlugs = ['emi-calculator', 'fd-calculator', 'home-loan-calculator', 'lumpsum-calculator', 'sip-calculator'];

for (const slug of existingSlugs) {
  const layoutPath = path.join(baseDir, slug, 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    if (!content.includes('canonical:')) {
      content = content.replace('};', `  alternates: {\n    canonical: "/calculators/${slug}"\n  }\n};`);
      fs.writeFileSync(layoutPath, content);
      console.log(`Patched canonical for ${slug}`);
    } else {
      console.log(`Canonical already exists for ${slug}`);
    }
  }
}
