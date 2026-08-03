import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';
import { CurrencyAwareMarkdown } from '@/components/blog/currency-aware-markdown';
import { SITE_URL, SITE_NAME } from '@/config/site';
import { findAuthorByName, bylineFor } from '@/config/authors';

const BASE_URL = SITE_URL;

/**
 * Trims text to fit the SERP description window, preferring a sentence boundary
 * over a hard cut so the result still reads as a finished sentence.
 */
function truncateForSerp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  // Prefer ending on a full stop, but only if it still fills most of the budget.
  // A lower threshold produced a 91-character description from a 245-character
  // excerpt, which is as bad as being too long -- Google discards short
  // descriptions and writes its own from page text.
  const cut = clean.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (lastStop > max * 0.75) return cut.slice(0, lastStop + 1);

  return `${cut.replace(/\s+\S*$/, '')}...`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Article Not Found' };

  // The root layout appends " | Numeraise" via its title template, so keep the
  // bare title here and only trim if the combined length would be truncated in
  // the SERP (~60 visible chars).
  // Google renders roughly 60 characters of title. Budget for the suffix so the
  // combined string fits, rather than letting it truncate mid-word in the SERP.
  const suffixLength = ` | ${SITE_NAME}`.length;
  let metaTitle = post.title;
  if (metaTitle.length + suffixLength > 60) {
    metaTitle = metaTitle.substring(0, 57 - suffixLength).trim() + '...';
  }

  /*
   * Frontmatter excerpts are written for the article card, not the SERP, and
   * ran 180-245 characters on four posts — Google truncates around 160. Trim on
   * a sentence boundary where possible so the description still reads as a
   * complete thought rather than stopping mid-clause with an ellipsis.
   */
  const metaDescription = truncateForSerp(post.excerpt, 158);

  const authorProfile = findAuthorByName(post.author);
  // Frontmatter bylines posts as "Rahul Sharma, CFA". src/config/authors.ts is
  // the only place a credential counts as verified, so the byline is rebuilt
  // from there and an unverified designation cannot reach a meta tag.
  const byline = bylineFor(post.author);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [
      authorProfile
        ? { name: byline, url: `${SITE_URL}/authors/${authorProfile.slug}` }
        : { name: byline },
    ],
    openGraph: {
      title: metaTitle,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [byline],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: post.excerpt,
      images: ['/og-image.png'],
    },
  };
}

// Pre-render all known slugs for SEO
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function ArticleSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const authorProfile = findAuthorByName(post.author);
  // Rebuilt from src/config/authors.ts, so an unverified credential in the
  // markdown frontmatter cannot reach the visible byline or the JSON-LD.
  const byline = bylineFor(post.author);

  // Article JSON-LD. `author` resolves to the Person node on the author page and
  // `publisher` to the Organization node declared once in the root layout, so
  // the whole site collapses into a single entity graph rather than repeating
  // loose name strings on every article.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: authorProfile
      ? { '@id': `${SITE_URL}/authors/${authorProfile.slug}` }
      : { '@type': 'Person', name: byline },
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
    image: `${BASE_URL}/og-image.png`,
  };

  // Check if markdown content starts with a header matching the title or a generic h1
  // We can strip the first h1/h2 header if it exists in markdown to avoid duplicate h1 tags on page.
  // Many markdown posts have "# Title" as their first line.
  let cleanContent = post.content.trim();
  const titleHeadingRegex = /^(?:#\s+.*|##\s+.*)\n+/i;
  if (titleHeadingRegex.test(cleanContent)) {
    cleanContent = cleanContent.replace(titleHeadingRegex, '');
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to learning center
        </Link>
      </div>

      <div className="mb-8 border-b pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Newspaper className="w-4 h-4" />
          Financial Guide
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center text-muted-foreground gap-y-2 gap-x-6 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {/* A byline that links to a real author profile is a far stronger
                trust signal on a YMYL page than a bare name string. */}
            {authorProfile ? (
              <Link href={`/authors/${authorProfile.slug}`} className="hover:text-primary hover:underline">
                {byline}
              </Link>
            ) : (
              <span>{byline}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <CurrencyAwareMarkdown
        content={cleanContent}
        className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-table:border prose-table:border-border prose-th:bg-muted/50 prose-th:font-medium prose-th:p-3 prose-td:p-3 prose-td:border-t prose-blockquote:not-italic prose-blockquote:bg-muted/50 prose-blockquote:border-none prose-blockquote:rounded-xl prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:text-sm prose-img:rounded-xl"
      />
    </div>
  );
}
