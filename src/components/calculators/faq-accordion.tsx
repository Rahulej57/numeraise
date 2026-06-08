import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQ {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-center gap-2 mb-8">
        <HelpCircle className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>
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
