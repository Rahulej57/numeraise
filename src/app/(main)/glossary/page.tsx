import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { glossaryData } from '@/data/glossary';
import { GLOSSARY_TERMS } from '@/config/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StructuredData } from '@/components/seo/structured-data';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Financial Glossary: Key Terms Explained Plainly',
  description:
    'Plain-English definitions of the financial terms that matter, with formulas and worked examples. Covers investing, loans, tax and general personal finance.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'Financial Glossary: Key Terms Explained Plainly',
    description: 'Plain-English definitions of financial terms, with formulas and worked examples.',
    url: `${SITE_URL}/glossary`,
    type: 'website',
  },
};

type Category = 'Investing' | 'Loans' | 'Tax' | 'General Finance';

/**
 * The site carries two unmerged glossary datasets: `glossaryData` (short
 * definitions, used for this listing) and `GLOSSARY_TERMS` (full detail pages).
 * They were never joined, so all 15 detail pages had zero inbound internal links
 * and were reachable only via the sitemap.
 *
 * This page now renders the union of both, guaranteeing every detail page gets a
 * link. Term names differ slightly between the sets ("CAGR" vs
 * "CAGR (Compound Annual Growth Rate)"), so matching is done on a normalised key.
 */
function normalise(term: string) {
  return term
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Categories for detail-page terms that have no counterpart in `glossaryData`. */
const CATEGORY_FALLBACK: Record<string, Category> = {
  'bear market': 'Investing',
  'bull market': 'Investing',
  'capital gains': 'Tax',
  'dividend yield': 'Investing',
  ebitda: 'General Finance',
  'fiat money': 'General Finance',
  'liquid asset': 'General Finance',
  xirr: 'Investing',
};

interface Entry {
  term: string;
  definition: string;
  category: Category;
  slug?: string;
}

function buildEntries(): Entry[] {
  const shortByKey = new Map(glossaryData.map((g) => [normalise(g.term), g]));
  const entries: Entry[] = [];
  const consumed = new Set<string>();

  // Every term that has a detail page, always linked.
  for (const t of GLOSSARY_TERMS) {
    const key = normalise(t.term);
    const short = shortByKey.get(key);
    if (short) consumed.add(key);
    entries.push({
      // Prefer the longer listing label when one exists -- it carries the
      // expanded acronym, which is what people actually search for.
      term: short?.term ?? t.term,
      definition: short?.definition ?? t.shortDef,
      category: short?.category ?? CATEGORY_FALLBACK[key] ?? 'General Finance',
      slug: t.slug,
    });
  }

  // Remaining definition-only terms.
  for (const g of glossaryData) {
    const key = normalise(g.term);
    if (consumed.has(key)) continue;
    entries.push({ term: g.term, definition: g.definition, category: g.category });
  }

  return entries.sort((a, b) => a.term.localeCompare(b.term));
}

export default function GlossaryPage() {
  const entries = buildEntries();
  const linkedCount = entries.filter((e) => e.slug).length;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Glossary', url: '/glossary' },
          ],
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'DefinedTermSet',
            '@id': `${SITE_URL}/glossary`,
            name: 'Numeraise Financial Glossary',
            description: 'Plain-English definitions of financial terms, with formulas and worked examples.',
            url: `${SITE_URL}/glossary`,
            hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
              '@type': 'DefinedTerm',
              '@id': `${SITE_URL}/glossary/${t.slug}`,
              name: t.term,
              description: t.shortDef,
              url: `${SITE_URL}/glossary/${t.slug}`,
            })),
          }),
        }}
      />

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Financial Glossary</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Understand the jargon. {entries.length} financial terms explained in plain English — {linkedCount} of them
          with full formulas and worked examples.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {entries.map((item, index) => {
          const card = (
            <Card
              className={`h-full shadow-sm border-border transition-shadow ${
                item.slug ? 'hover:shadow-md group' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className={`text-xl text-primary ${item.slug ? 'group-hover:underline' : ''}`}>
                    {item.term}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0">
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
                {item.slug && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Read the full explanation
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </CardContent>
            </Card>
          );

          return item.slug ? (
            <Link key={index} href={`/glossary/${item.slug}`} className="block">
              {card}
            </Link>
          ) : (
            <div key={index}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
