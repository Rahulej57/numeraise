import React from "react";

interface CalculatorContentProps {
  children: React.ReactNode;
}

export function CalculatorContent({ children }: CalculatorContentProps) {
  return (
    <div className="print:hidden mt-16 w-full max-w-4xl mx-auto prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-table:border prose-table:border-border prose-th:bg-muted/50 prose-th:font-medium prose-th:p-3 prose-td:p-3 prose-blockquote:not-italic prose-blockquote:bg-muted/50 prose-blockquote:border-none prose-blockquote:rounded-xl prose-blockquote:px-5 prose-blockquote:py-4 prose-blockquote:text-sm prose-img:rounded-xl">
      {children}
    </div>
  );
}
