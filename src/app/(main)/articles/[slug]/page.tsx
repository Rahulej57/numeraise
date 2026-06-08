import { notFound } from "next/navigation";
import Link from "next/link";
import { Newspaper, Calendar, User, Clock, ChevronLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";
import { CurrencyAwareMarkdown } from "@/components/articles/currency-aware-markdown";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://numeraise.com";



// Fix 4: Dynamic metadata per article
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Article Not Found | Numeraise" };

  return {
    title: `${post.title} | Numeraise`,
    description: post.excerpt,
    alternates: { canonical: `/articles/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/articles/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-image.png"],
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

  // Fix 5: Article JSON-LD schema for Google Discover & rich results
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      "@type": "Organization",
      name: "Numeraise",
      url: BASE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/articles/${post.slug}` },
    image: `${BASE_URL}/og-image.png`,
  };


  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[70vh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mb-6">
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to learning center
        </Link>
      </div>

      <div className="mb-8 border-b pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Newspaper className="w-4 h-4" />
          Financial Guide
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center text-muted-foreground gap-y-2 gap-x-6 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      <CurrencyAwareMarkdown
        content={post.content}
        className="prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-xl"
      />
    </div>
  );
}
