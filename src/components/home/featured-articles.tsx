import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function FeaturedArticles() {
  const articles = [
    {
      title: "SIP vs Fixed Deposit",
      href: "/articles/sip-vs-fd",
      category: "Investing",
    },
    {
      title: "The Power of Compound Interest",
      href: "/articles/compound-interest-guide",
      category: "Wealth",
    }
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-muted/10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Latest Guides
          </h2>
          <Link href="/articles" className="text-primary text-sm hover:underline font-medium">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {articles.map((article, idx) => (
            <Link href={article.href} key={idx} className="group">
              <Card className="h-full hover:border-primary/40 transition-colors shadow-sm">
                <CardHeader className="p-4 md:p-5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                    {article.category}
                  </span>
                  <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors leading-tight">
                    {article.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
