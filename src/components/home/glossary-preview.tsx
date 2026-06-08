import Link from "next/link";
import { HelpCircle } from "lucide-react";

export function GlossaryPreview() {
  const terms = [
    { term: "SIP", href: "/glossary/sip" },
    { term: "CAGR", href: "/glossary/cagr" },
    { term: "Inflation", href: "/glossary/inflation" },
  ];

  return (
    <section className="w-full py-8 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            Quick Glossary
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {terms.map((t, idx) => (
            <Link 
              key={idx} 
              href={t.href}
              className="px-3 py-1.5 bg-background border border-border rounded-full text-xs font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {t.term}
            </Link>
          ))}
          <Link 
            href="/glossary"
            className="px-3 py-1.5 text-primary text-xs font-medium hover:underline flex items-center"
          >
            View All &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
