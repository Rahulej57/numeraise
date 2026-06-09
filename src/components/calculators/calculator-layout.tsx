import React from "react";
import { SeoSchemas } from "@/components/layout/seo-schemas";

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
      <div className="mb-4 md:mb-8 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
        {icon && (
          <div className="p-3 bg-background border shadow-sm rounded-xl shrink-0">
            <div className="scale-[1.15] origin-center">{icon}</div>
          </div>
        )}
        <div>
          <h1 className="text-xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2">{title}</h1>
        </div>
      </div>
      {children}
    </div>
  );
}
