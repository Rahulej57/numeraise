import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Learning Center | Numeraise',
  description:
    'Deep-dive guides, analysis and expert advice on investing, loans, taxes, and wealth creation. Free financial education by Numeraise.',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: 'Financial Learning Center | Numeraise',
    description: 'Expert guides on SIP, EMI, tax planning, rent vs buy and more.',
    url: 'https://numeraise.com/articles',
    type: 'website',
  },
};

export default function ArticlesPage() {
  const posts = getAllPosts();

  const getCategory = (slug: string) => {
    if (slug.includes('tax')) return 'Taxes';
    if (slug.includes('emi') || slug.includes('loan')) return 'Loans';
    if (slug.includes('sip') || slug.includes('compounding') || slug.includes('wealth')) return 'Investing';
    if (slug.includes('rent-vs-buy')) return 'Housing';
    return 'Financial Guide';
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">Learning Center</h1>
        <p className="text-muted-foreground text-sm">
          Deep-dive guides, analysis, and expert advice to optimize your personal finance decisions.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/articles/${post.slug}`} className="group">
              <Card className="h-full border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all duration-300 shadow-none flex flex-col">
                <CardHeader className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      {getCategory(post.slug)}
                    </div>
                    <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-sm mt-2 line-clamp-3 text-muted-foreground">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30 flex items-center gap-2">
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
