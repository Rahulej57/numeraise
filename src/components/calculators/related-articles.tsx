import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";

interface RelatedArticle {
  title: string;
  href: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-12 w-full bg-muted/40 p-6 sm:p-8 rounded-2xl border border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Related Financial Guides</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, idx) => (
          <Link href={article.href} key={idx} className="group block">
            <Card className="bg-background border-border/50 hover:border-primary/40 transition-colors">
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
