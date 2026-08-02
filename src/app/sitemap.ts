import { MetadataRoute } from 'next';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { getAllPosts } from '@/lib/blog';
import { GLOSSARY_TERMS } from '@/config/glossary';
import { COMPARISON_SLUGS } from '@/lib/comparison-engine';
import { SITE_URL, CONTENT_REVISION_DATE } from '@/config/site';

/**
 * `lastmod` deliberately uses a stable constant rather than `new Date()`.
 *
 * Build-time dates restamped every URL as "just modified" on each deploy, so
 * search engines learned to ignore this site's lastmod entirely. A fixed date
 * that only moves when content actually changes restores the signal.
 */
const REVISED = CONTENT_REVISION_DATE;

export default function sitemap(): MetadataRoute.Sitemap {
  // De-duplicate by href. Two directory entries pointing at the same page emit a
  // duplicate <loc>, which is a sitemap validation warning.
  const calculatorHrefs = Array.from(
    new Set(CALCULATOR_DIRECTORY.flatMap((section) => section.calculators).map((c) => c.href)),
  );

  const calculatorUrls = calculatorHrefs.map((href) => ({
    url: `${SITE_URL}${href}`,
    lastModified: REVISED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const categoryUrls = CALCULATOR_DIRECTORY.map((category) => ({
    url: `${SITE_URL}/calculators/category/${category.slug}`,
    lastModified: REVISED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog posts carry a real per-post date from their frontmatter.
  const blogUrls = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  const glossaryUrls = GLOSSARY_TERMS.map((term) => ({
    url: `${SITE_URL}/glossary/${term.slug}`,
    lastModified: REVISED,
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));

  // Previously absent from the sitemap entirely despite returning 200.
  const compareUrls = COMPARISON_SLUGS.map((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified: REVISED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticUrls = [
    { path: '/about', priority: 0.5 },
    { path: '/contact', priority: 0.4 },
    { path: '/authors/rahul-sharma', priority: 0.5 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
    { path: '/disclaimer', priority: 0.3 },
    { path: '/cookie-policy', priority: 0.3 },
    { path: '/accessibility', priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: REVISED,
    changeFrequency: 'yearly' as const,
    priority,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: REVISED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/calculators`,
      lastModified: REVISED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: REVISED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/glossary`,
      lastModified: REVISED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: REVISED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...categoryUrls,
    ...calculatorUrls,
    ...compareUrls,
    ...blogUrls,
    ...glossaryUrls,
    ...staticUrls,
  ];
}
