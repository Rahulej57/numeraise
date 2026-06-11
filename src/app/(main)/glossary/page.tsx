import { glossaryData } from '@/data/glossary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Financial Glossary - Numeraise',
  description:
    'A comprehensive dictionary of financial terms, definitions, and acronyms to help you understand investing, loans, taxes, and personal finance.',
};

export default function GlossaryPage() {
  // Sort alphabetically
  const sortedGlossary = [...glossaryData].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Financial Glossary</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Understand the jargon. A comprehensive dictionary of financial terms to help you make smarter decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sortedGlossary.map((item, index) => (
          <Card key={index} className="shadow-sm border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl text-primary">{item.term}</CardTitle>
                <Badge variant="outline" className="shrink-0">
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
