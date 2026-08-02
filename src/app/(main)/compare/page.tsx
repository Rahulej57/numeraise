import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { COMPARISON_SLUGS, COMPARISON_SEO, getComparisonConfig } from '@/lib/comparison-engine';
import { StructuredData } from '@/components/seo/structured-data';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Compare Financial Options Side by Side',
  description:
    'Head-to-head financial comparisons: SIP vs fixed deposit, rent vs buy, and old vs new tax regime. See both scenarios calculated in parallel with a clear verdict.',
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Compare Financial Options Side by Side',
    description:
      'SIP vs FD, rent vs buy, old vs new tax regime — both scenarios calculated in parallel with a clear verdict.',
    url: `${SITE_URL}/compare`,
    type: 'website',
  },
};

export default function CompareHubPage() {
  const comparisons = COMPARISON_SLUGS.map((slug) => ({
    slug,
    config: getComparisonConfig(slug),
    seo: COMPARISON_SEO[slug],
  })).filter((c) => c.config);

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Compare', url: '/compare' },
          ],
        }}
      />

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <div className="p-2 bg-muted rounded-xl">
            <Scale className="w-7 h-7 text-primary" />
          </div>
          Side-by-Side Comparisons
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          Some financial decisions are not a single calculation but a choice between two paths. These tools run both
          scenarios in parallel on the same inputs and show you the gap at the end, rather than leaving you to compare
          two separate results by hand.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {comparisons.map(({ slug, config, seo }) => (
          <Link key={slug} href={`/compare/${slug}`} className="group block">
            <Card className="h-full transition-shadow hover:shadow-md border-border">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center justify-between gap-2">
                  {config!.title}
                  <ArrowRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  {config!.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{seo?.intro}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 max-w-3xl prose prose-slate dark:prose-invert">
        <h2>Why comparisons beat single calculators</h2>
        <p>
          A calculator answers &ldquo;what does this produce?&rdquo;. A comparison answers &ldquo;which of these should I
          choose?&rdquo; — and that second question is usually the one you actually have. Running two options separately
          makes it easy to compare them on the wrong basis: pre-tax against post-tax, or a figure that includes
          opportunity cost against one that quietly does not.
        </p>
        <p>
          Each comparison here applies the same inputs, the same time horizon and the same tax treatment to both sides,
          so the difference you see is the real difference rather than an artefact of inconsistent assumptions.
        </p>
      </div>
    </div>
  );
}
