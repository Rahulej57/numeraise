const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/calculators.tsx');
const configContent = fs.readFileSync(configPath, 'utf8');

const hrefMatches = [...configContent.matchAll(/href:\s*['"]\/calculators\/([^'"]+)['"]/g)];
const allCalculators = hrefMatches.map(match => match[1]);

const totalCalculators = new Set(allCalculators);

const calculatorsDir = path.join(__dirname, '../src/app/(main)/calculators');
const separatedFolders = fs.readdirSync(calculatorsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== '[slug]' && dirent.name !== 'category')
  .map(dirent => dirent.name);

const separatedSet = new Set(separatedFolders);
const missing = [...totalCalculators].filter(calc => !separatedSet.has(calc));

const layoutTemplate = `import { Metadata } from 'next';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';

export async function generateMetadata(): Promise<Metadata> {
  const slug = 'SLUG_PLACEHOLDER';
  let name = slug.replace(/-/g, ' ');
  let desc = 'Financial Calculator';

  for (const category of CALCULATOR_DIRECTORY) {
    const calc = category.calculators.find((c) => c.href.includes(slug));
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
      canonical: \`/calculators/\${slug}\`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`;

const pageTemplate = `import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { DynamicCalculatorClient } from '@/components/calculators/dynamic-calculator-client';
import { StructuredData } from '@/components/seo/structured-data';
import { DynamicSEO } from '@/components/calculators/dynamic-seo';

// Find name from config or directory
const getCalculatorMetadata = (slug: string) => {
  for (const category of CALCULATOR_DIRECTORY) {
    const calc = category.calculators.find((c) => c.href.includes(slug));
    if (calc) return { name: calc.name, desc: calc.desc };
  }
  return { name: slug.replace(/-/g, ' '), desc: 'Financial Calculator' };
};

export default function CalculatorPage() {
  const slug = 'SLUG_PLACEHOLDER';
  const meta = getCalculatorMetadata(slug);

  let relatedCalcs: { title: string; description: string; href: string; icon?: React.ReactNode }[] = [];
  const category = CALCULATOR_DIRECTORY.find((c) =>
    c.calculators.some((calc) => calc.href.includes(slug)),
  );
  if (category) {
    relatedCalcs = category.calculators
      .filter((c) => !c.href.includes(slug))
      .slice(0, 3)
      .map((c) => ({ title: c.name, description: c.desc, href: c.href, icon: c.icon }));
  }

  return (
    <>
      <DynamicCalculatorClient slug={slug} name={meta.name}>
        <DynamicSEO slug={slug} relatedCalculators={relatedCalcs} />
        <StructuredData
          type="Calculator"
          data={{
            name: meta.name,
            description: meta.desc,
            url: \`https://numeraise.com/calculators/\${slug}\`,
          }}
        />
      </DynamicCalculatorClient>
    </>
  );
}
`;

missing.forEach(slug => {
  const targetDir = path.join(calculatorsDir, slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const layoutContent = layoutTemplate.replace(/SLUG_PLACEHOLDER/g, slug);
  fs.writeFileSync(path.join(targetDir, 'layout.tsx'), layoutContent, 'utf8');

  const pageContent = pageTemplate.replace(/SLUG_PLACEHOLDER/g, slug);
  fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageContent, 'utf8');
  
  console.log(`Successfully generated files for: ${slug}`);
});

console.log(`\nSuccessfully separated all ${missing.length} calculators!`);
