import { CALCULATOR_DIRECTORY } from '@/config/calculators';
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
  const slug = 'scss-calculator';
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
            url: `https://www.numeraise.com/calculators/${slug}`,
          }}
        />
      </DynamicCalculatorClient>
    </>
  );
}
