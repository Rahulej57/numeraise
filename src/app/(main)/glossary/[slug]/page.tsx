import { GLOSSARY_TERMS } from "@/config/glossary";
import { BookOpen, ChevronLeft, Lightbulb, Calculator, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((term) => ({
    slug: term.slug,
  }));
}

export default async function GlossarySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const termData = GLOSSARY_TERMS.find(t => t.slug === resolvedParams.slug);
  
  if (!termData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="mb-6">
        <Link href="/glossary" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Glossary
        </Link>
      </div>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Glossary Term
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {termData.term}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
          {termData.shortDef}
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Detailed Explanation</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p>{termData.detailedDef}</p>
          </div>
        </section>

        {termData.formula && (
          <section className="bg-muted/30 p-6 rounded-xl border">
            <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
              <Calculator className="w-5 h-5" />
              <h3>The Formula</h3>
            </div>
            <pre className="bg-card p-4 rounded-lg font-mono text-sm overflow-x-auto border">
              <code>{termData.formula}</code>
            </pre>
          </section>
        )}

        {termData.example && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Real-World Example</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
              <p>{termData.example}</p>
            </div>
          </section>
        )}

        {termData.keyTakeaways && termData.keyTakeaways.length > 0 && (
          <section className="bg-primary/5 p-6 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-xl">Key Takeaways</h3>
            </div>
            <ul className="space-y-3">
              {termData.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-muted-foreground">{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {termData.relatedTerms && termData.relatedTerms.length > 0 && (
          <section className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Related Terms</h2>
            <div className="flex flex-wrap gap-3">
              {termData.relatedTerms.map(related => (
                <Link 
                  key={related.slug} 
                  href={`/glossary/${related.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {related.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
