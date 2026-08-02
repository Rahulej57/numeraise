import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQ {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  /**
   * Emit FAQPage JSON-LD alongside the visible accordion. Defaults to true, so
   * every calculator that shows FAQs also describes them to search engines --
   * around 36 pages rendered FAQs with no schema at all before this.
   *
   * Set false only where the surrounding page already renders its own
   * <StructuredData type="FAQ" />. Two FAQPage blocks on one URL is invalid and
   * Google discards both.
   */
  emitSchema?: boolean;
}

/**
 * Answers are typed ReactNode because a few calculators pass JSX. Schema needs
 * plain text matching what the reader sees, so non-string answers are omitted
 * rather than stringified into something that would not match the page.
 */
function plainAnswer(answer: React.ReactNode): string | null {
  if (typeof answer === "string") return answer.replace(/\s+/g, " ").trim() || null;
  if (typeof answer === "number") return String(answer);
  return null;
}

function buildFaqSchema(faqs: FAQ[]) {
  const seen = new Set<string>();
  const mainEntity = faqs
    .map((faq) => {
      const question = typeof faq.question === "string" ? faq.question.trim() : "";
      const answer = plainAnswer(faq.answer);
      if (!question || !answer) return null;

      // Repeated questions appeared on several calculators -- the inflation page
      // asked "What is hyperinflation?" twice. Duplicates invalidate the block.
      const key = question.toLowerCase();
      if (seen.has(key)) return null;
      seen.add(key);

      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      };
    })
    .filter(Boolean);

  if (mainEntity.length === 0) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity };
}

export function FAQAccordion({ faqs, emitSchema = true }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  const schema = emitSchema ? buildFaqSchema(faqs) : null;

  return (
    <div className="print:hidden mt-12 w-full">
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
      <div className="flex items-center justify-center gap-2 mb-8">
        <HelpCircle className="w-6 h-6 text-primary" />
        {/* h2, not h3: this is a top-level page section, and skipping a heading
            level breaks the document outline for screen readers and crawlers. */}
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
      </div>
      <Accordion className="w-full max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-border">
            <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
