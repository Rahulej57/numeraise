import React from "react";
import { SeoSchemas } from "@/components/layout/seo-schemas";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-8 max-w-6xl">
      <SeoSchemas title={title} description={description} />
      <div className="mb-4 md:mb-8 text-center md:text-left">
        <h1 className="text-xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2">{title}</h1>
      </div>
      {children}
    </div>
  );
}
