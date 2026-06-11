import { MetadataRoute } from 'next';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { getAllPosts } from '@/lib/blog';
import { GLOSSARY_TERMS } from '@/config/glossary';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://numeraise.com';

  // Extract all individual calculators from the directory structure
  const calculators = CALCULATOR_DIRECTORY.flatMap((section) => section.calculators);

  const calculatorUrls = calculators.map((calc) => ({
    url: `${baseUrl}${calc.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = CALCULATOR_DIRECTORY.map((category) => ({
    url: `${baseUrl}/calculators/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPosts = getAllPosts();

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const glossaryUrls = GLOSSARY_TERMS.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/financial-calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...categoryUrls,
    ...calculatorUrls,
    ...blogUrls,
    ...glossaryUrls,
  ];
}
