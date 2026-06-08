"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import React from "react";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  let currentPath = "";
  const breadcrumbItems: { segment: string; href: string; label: string }[] = [];
  
  const segments = pathname.split("/").filter((p) => p);

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip noisy URL segments
    if (["category", "auth"].includes(segment.toLowerCase())) return;

    let label = segment.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    // For the root calculators path, label it nicely
    if (segment === "calculators") {
      label = "All Calculators";
    }

    // If we are looking at a specific calculator inside /calculators/
    if (index === 1 && segments[0] === "calculators" && segment !== "category") {
      // Map aliased slugs back to their master config slug
      const lookupSegment = ["sales-tax-calculator", "vat-calculator"].includes(segment) 
        ? "gst-calculator" 
        : segment;

      // Find the category this calculator belongs to
      const categoryConfig = CALCULATOR_DIRECTORY.find(c => 
        c.calculators.some(calc => calc.href === `/calculators/${lookupSegment}`)
      );
      
      if (categoryConfig) {
        // Inject the Category Breadcrumb BEFORE the calculator
        breadcrumbItems.push({
          segment: categoryConfig.slug,
          href: `/calculators/category/${categoryConfig.slug}`,
          label: categoryConfig.category,
        });
        
        // Grab the official calculator name instead of just capitalizing the slug
        const officialCalc = categoryConfig.calculators.find(calc => calc.href === `/calculators/${segment}`);
        if (officialCalc) label = officialCalc.name;
      }
    }

    breadcrumbItems.push({
      segment,
      href: currentPath,
      label,
    });
  });

  return (
    <div className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap hide-scrollbar">
        <Link href="/" className="flex items-center hover:text-primary transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={item.href}>
              <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
              {isLast ? (
                <span className="font-medium text-foreground truncate">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors truncate">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
