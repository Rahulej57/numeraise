import React from "react";
import { SeoSchemas } from "@/components/layout/seo-schemas";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function CalculatorLayout({ title, description, icon, children }: CalculatorLayoutProps) {
  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-8 max-w-6xl">
      <SeoSchemas title={title} description={description} />
      <div className="mb-4 md:mb-8 text-center md:text-left">
        <CalculatorHeader title={title} />
      </div>
      {children}
    </div>
  );
}
