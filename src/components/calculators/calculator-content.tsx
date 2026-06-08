import React from "react";

interface CalculatorContentProps {
  children: React.ReactNode;
}

export function CalculatorContent({ children }: CalculatorContentProps) {
  return (
    <div className="mt-16 w-full max-w-4xl mx-auto prose prose-neutral dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
      {children}
    </div>
  );
}
