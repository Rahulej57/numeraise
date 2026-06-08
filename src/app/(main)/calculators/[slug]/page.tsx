import { notFound } from "next/navigation";
import { getCalculatorConfig } from "@/lib/calculator-engine";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";
import { DynamicCalculatorClient } from "@/components/calculators/dynamic-calculator-client";
import { Metadata } from "next";

// Find name from config or directory
const getCalculatorMetadata = (slug: string) => {
  for (const category of CALCULATOR_DIRECTORY) {
    const calc = category.calculators.find(c => c.href.includes(slug));
    if (calc) return { name: calc.name, desc: calc.desc };
  }
  return { name: slug.replace(/-/g, " "), desc: "Financial Calculator" };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const meta = getCalculatorMetadata(resolvedParams.slug);
  return {
    title: `${meta.name} | Numeraise`,
    description: meta.desc,
    alternates: {
      canonical: `/calculators/${resolvedParams.slug}`
    }
  };
}

import { StructuredData } from "@/components/seo/structured-data";
import { DynamicSEO } from "@/components/calculators/dynamic-seo";

export default async function DynamicCalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const meta = getCalculatorMetadata(resolvedParams.slug);

  let relatedCalcs: { title: string; description: string; href: string }[] = [];
  const category = CALCULATOR_DIRECTORY.find(c => c.calculators.some(calc => calc.href.includes(resolvedParams.slug)));
  if (category) {
    relatedCalcs = category.calculators
      .filter(c => !c.href.includes(resolvedParams.slug))
      .slice(0, 3)
      .map(c => ({ title: c.name, description: c.desc, href: c.href }));
  }

  return (
    <>
      <DynamicCalculatorClient slug={resolvedParams.slug} name={meta.name}>
        <DynamicSEO slug={resolvedParams.slug} relatedCalculators={relatedCalcs} />
        <StructuredData 
          type="Calculator" 
          data={{
            name: meta.name,
            description: meta.desc,
            url: `https://numeraise.com/calculators/${resolvedParams.slug}`
          }} 
        />
      </DynamicCalculatorClient>
    </>
  );
}
