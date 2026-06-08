"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CurrencyAwareMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content as-is.
 * Blog articles are educational content with illustrative examples written
 * in their original currency — the author's context should be preserved.
 * Currency conversion for the user's own numbers happens in the calculator tools.
 */
export function CurrencyAwareMarkdown({ content, className }: CurrencyAwareMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
