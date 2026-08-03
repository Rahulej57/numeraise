import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mail, PenLine } from 'lucide-react';
import { AUTHORS, AUTHOR_SLUGS, getAuthor, publishableBio, displayByline } from '@/config/authors';
import { getAllPosts } from '@/lib/blog';
import { StructuredData } from '@/components/seo/structured-data';
import { SITE_URL } from '@/config/site';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return AUTHOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: 'Author Not Found', robots: { index: false, follow: true } };

  return {
    title: `${author.name} - Author Profile`,
    // Targets 120-160. The bare name-and-role version measured 93, short enough
    // that Google would discard it and synthesise its own from page text.
    description:
      `${author.name}, ${author.role}. The articles and calculators they publish, ` +
      'and how every figure is checked before it goes live.',
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name} - Author Profile`,
      description: `${author.name}, ${author.role}.`,
      url: `${SITE_URL}/authors/${author.slug}`,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthor(slug);

  if (!author) {
    notFound();
  }

  // Match posts whose byline resolves to this author ("Rahul Sharma, CFA").
  const posts = getAllPosts().filter(
    (p) => p.author.split(',')[0].trim().toLowerCase() === author.name.toLowerCase(),
  );

  // Scaffold paragraphs are stripped rather than published. See publishableBio.
  const bio = publishableBio(author);
  const displayName = displayByline(author);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <StructuredData
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Home', url: '/' },
            { name: 'Authors', url: '/about' },
            { name: author.name, url: `/authors/${author.slug}` },
          ],
        }}
      />
      {/*
        A Person node with a stable @id lets every Article on the site reference
        one author entity instead of repeating a bare name string.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${SITE_URL}/authors/${author.slug}`,
            name: author.name,
            jobTitle: author.role,
            description: bio[0] ?? author.role,
            url: `${SITE_URL}/authors/${author.slug}`,
            ...(author.credentials.length ? { honorificSuffix: author.credentials.join(', ') } : {}),
            ...(author.email ? { email: author.email } : {}),
            ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
            worksFor: { '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <div className="mb-10 pb-10 border-b">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <PenLine className="w-4 h-4" />
          Author
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{displayName}</h1>
        <p className="text-lg text-muted-foreground">{author.role}</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        <h2>Editorial approach</h2>
        <p>
          Every calculator published here shows the formula behind it and lets you change every assumption. Articles
          state their sources and flag where a figure depends on rules that change between budget cycles. Corrections
          are welcome and acted on — see our <Link href="/about">editorial standards</Link>.
        </p>
        <p>
          Nothing published on Numeraise is personal financial advice. Read the{' '}
          <Link href="/disclaimer">full disclaimer</Link>.
        </p>

        {author.email && (
          <p className="flex items-center gap-2 not-prose mt-8">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a href={`mailto:${author.email}`} className="text-primary hover:underline">
              {author.email}
            </a>
          </p>
        )}
      </div>

      {posts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            Articles by {author.name} ({posts.length})
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{post.excerpt}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {post.readTime}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
