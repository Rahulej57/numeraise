"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCurrency } from "@/context/CurrencyContext";

interface CurrencyAwareMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content and intercepts dynamic currency tags.
 * Usage in markdown: `CURRENCY:10000` will render as the formatted currency.
 */
export function CurrencyAwareMarkdown({ content, className }: CurrencyAwareMarkdownProps) {
  const { format, ratesLoading } = useCurrency();

  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /CURRENCY:(\d+(\.\d+)?)/.exec(String(children));
            if (match) {
              const amount = Number(match[1]);
              return (
                <span className="font-semibold text-primary px-1 bg-primary/5 rounded">
                  {ratesLoading ? "..." : format(amount)}
                </span>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
