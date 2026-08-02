import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators } from '@/config/calculators';
import { DynamicCalculatorList } from '@/components/calculators/dynamic-calculator-list';
import { SITE_URL } from '@/config/site';
import { CATEGORY_INTROS } from '@/config/category-copy';

// Pre-render all category pages for SEO
export function generateStaticParams() {
  return CALCULATOR_DIRECTORY.map((dir) => ({
    category: dir.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const section = CALCULATOR_DIRECTORY.find((d) => d.slug === category);
  if (!section) return { title: 'Category Not Found', robots: { index: false, follow: true } };

  const copy = CATEGORY_INTROS[section.slug];
  const count = section.calculators.length;

  return {
    title: copy?.title ?? `${section.category} Calculators`,
    description:
      copy?.description ??
      `${count} free ${section.category.toLowerCase()} calculators with transparent formulas and no signup required.`,
    // Previously missing entirely, so every category page was a canonical orphan.
    alternates: { canonical: `/calculators/category/${section.slug}` },
    openGraph: {
      title: copy?.title ?? `${section.category} Calculators`,
      description: copy?.description ?? '',
      url: `${SITE_URL}/calculators/category/${section.slug}`,
      type: 'website',
    },
  };
}

export default async function CategorySlugPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const section = CALCULATOR_DIRECTORY.find((d) => d.slug === category);

  if (!section) {
    notFound();
  }

  const copy = CATEGORY_INTROS[section.slug];

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <div className="p-2 bg-muted rounded-xl">{section.icon}</div>
          {section.category} Calculators
        </h1>
        {copy?.intro && (
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{copy.intro}</p>
        )}
      </div>

      <DynamicCalculatorList calculators={section.calculators} variant="cards" categoryIcon={section.icon} />

      {copy?.body && (
        <div className="mt-16 max-w-3xl prose prose-slate dark:prose-invert">
          <h2>{copy.bodyHeading}</h2>
          {copy.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      <RelatedCalculators calculators={getRelatedCalculators(category)} />

      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Calculators', url: '/calculators' },
            { name: `${section.category} Calculators`, url: `/calculators/category/${section.slug}` },
          ],
        }}
      />
      <StructuredData
        type="Calculator"
        data={{
          name: `${section.category} Calculators`,
          description:
            copy?.description ?? `Collection of free ${section.category.toLowerCase()} calculators.`,
          url: `${SITE_URL}/calculators/category/${section.slug}`,
        }}
      />
    </div>
  );
}
