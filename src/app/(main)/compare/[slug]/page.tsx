import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getComparisonConfig, COMPARISON_SLUGS, COMPARISON_SEO } from '@/lib/comparison-engine';
import { ScenarioClient } from '@/components/compare/scenario-client';
import { StructuredData } from '@/components/seo/structured-data';
import { SITE_URL } from '@/config/site';

/** Pre-render every comparison page instead of rendering them on demand. */
export function generateStaticParams() {
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

/**
 * These pages previously shipped the root layout's title and description with
 * no canonical, so all three were indistinguishable to a crawler.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getComparisonConfig(slug);

  if (!config) {
    return { title: 'Comparison Not Found', robots: { index: false, follow: true } };
  }

  const seo = COMPARISON_SEO[slug];
  const title = seo?.title ?? config.title;
  const description = seo?.description ?? config.description;

  return {
    title,
    description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/compare/${slug}`,
      type: 'website',
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const config = getComparisonConfig(resolvedParams.slug);

  if (!config) {
    notFound();
  }

  const seo = COMPARISON_SEO[resolvedParams.slug];

  return (
    <>
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Compare', url: '/compare' },
            { name: config.title, url: `/compare/${resolvedParams.slug}` },
          ],
        }}
      />
      <StructuredData
        type="Calculator"
        data={{
          name: config.title,
          description: seo?.description ?? config.description,
          url: `${SITE_URL}/compare/${resolvedParams.slug}`,
        }}
      />

      <ScenarioClient slug={resolvedParams.slug} />

      {seo && (
        <div className="container mx-auto px-4 pb-16 max-w-3xl">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h2>{seo.heading}</h2>
            <p>{seo.intro}</p>
            {seo.body?.map((section, i) => (
              <section key={i}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </section>
            ))}
          </article>
        </div>
      )}
    </>
  );
}
