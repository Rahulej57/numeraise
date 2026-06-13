import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Numeraise Blog | Numeraise',
  description:
    'Actionable financial advice, guides on using our tools, and strategies for accelerating your wealth creation.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'The Numeraise Blog | Numeraise',
    description: 'Actionable financial advice, guides on using our tools, and strategies for accelerating your wealth creation.',
    url: 'https://www.numeraise.com/blog',
    type: 'website',
  },
};

export default function ArticlesPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          The Numeraise Blog
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-3xl leading-relaxed">
          Actionable financial advice, guides on using our tools, and strategies for accelerating your wealth creation.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/10">
          <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {posts.map((post) => (
            <div key={post.slug} className="pb-10 border-b border-border/60 last:border-0 last:pb-0">
              <Link href={`/blog/${post.slug}`} className="group block space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                
                <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                  <span>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {post.excerpt && (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                <div className="pt-2">
                  <span className="text-sm md:text-base font-semibold text-blue-600 dark:text-blue-400 group-hover:underline inline-flex items-center gap-1">
                    Read article <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
