import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src/app/(main)/calculators');
const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]' && dirent.name !== 'category')
  .map(dirent => dirent.name);

for (const slug of dirs) {
  const layoutPath = path.join(baseDir, slug, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    const content = `import { Metadata } from "next";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export async function generateMetadata(): Promise<Metadata> {
  const slug = "${slug}";
  let name = slug.replace(/-/g, " ");
  let desc = "Financial Calculator";
  
  for (const category of CALCULATOR_DIRECTORY) {
    const calc = category.calculators.find(c => c.href.includes(slug));
    if (calc) {
      name = calc.name;
      desc = calc.desc;
      break;
    }
  }

  return {
    title: \`\${name} | Numeraise\`,
    description: desc,
    alternates: {
      canonical: \`/calculators/\${slug}\`
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`;
    fs.writeFileSync(layoutPath, content);
    console.log(`Created SEO layout wrapper for ${slug}`);
  } else {
    console.log(`Layout already exists for ${slug}`);
  }
}
