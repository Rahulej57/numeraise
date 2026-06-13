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
  const { format, ratesLoading, economicRates } = useCurrency();

  return (
    <div className={className}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          a({ node, className, children, ...props }) {
            return (
              <a 
                className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" 
                {...props}
              >
                {children}
              </a>
            );
          },
          code({ node, className, children, ...props }) {
            const childrenStr = String(children);
            
            // Handle CURRENCY tags
            const currMatch = /CURRENCY:(\d+(\.\d+)?)/.exec(childrenStr);
            if (currMatch) {
              const amount = Number(currMatch[1]);
              return (
                <span className="font-medium bg-secondary/80 text-secondary-foreground px-1 py-0.5 rounded-sm">
                  {ratesLoading ? "..." : format(amount)}
                </span>
              );
            }
            
            // Handle RATE tags
            const rateMatch = /RATE:([A-Z_]+)/.exec(childrenStr);
            if (rateMatch) {
              const key = rateMatch[1].toLowerCase() as keyof typeof economicRates;
              const rateVal = economicRates[key];
              if (rateVal !== undefined) {
                return (
                  <span className="font-medium bg-secondary/80 text-secondary-foreground px-1 py-0.5 rounded-sm">
                    {rateVal}%
                  </span>
                );
              }
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
