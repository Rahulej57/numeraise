import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';
import { DynamicCalculatorList } from '@/components/calculators/dynamic-calculator-list';

// Pre-render all category pages for SEO
export function generateStaticParams() {
  return CALCULATOR_DIRECTORY.map((dir) => ({
    category: dir.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const section = CALCULATOR_DIRECTORY.find((d) => d.slug === resolvedParams.category);
  if (!section) return { title: 'Category Not Found' };

  return {
    title: `${section.category} Calculators | Numeraise`,
    description: `Browse our collection of free ${section.category.toLowerCase()} calculators to plan your finances better.`,
  };
}

export default async function CategorySlugPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const section = CALCULATOR_DIRECTORY.find((d) => d.slug === resolvedParams.category);

  if (!section) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <div className="p-2 bg-muted rounded-xl">{section.icon}</div>
          {section.category} Calculators
        </h1>
      </div>

      <DynamicCalculatorList calculators={section.calculators} variant="cards" categoryIcon={section.icon} />

      <RelatedCalculators calculators={getRelatedCalculators(resolvedParams.category)} />
      <StructuredData
        type="Calculator"
        data={{
          name: `${section.category} Calculators`,
          description: `Collection of ${section.category.toLowerCase()} calculators.`,
          url: `https://Numeraise.com/calculators/category/${section.slug}`,
        }}
      />
    </div>
  );
}
