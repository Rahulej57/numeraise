"use client";

import { usePathname } from "next/navigation";

export function SeoSchemas({ title, description }: { title: string, description: string }) {
  const pathname = usePathname();
  
  // Only render on specific calculator pages
  if (!pathname || !pathname.startsWith('/calculators/') || pathname.includes('/category/')) {
    return null;
  }

  const slug = pathname.split('/').pop() || '';
  // Guess category from URL or default to Finance
  const category = "Finance"; 

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${title} Calculator`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": `Free ${title} calculator from Numeraise. Calculate ${description} instantly.`,
    "url": `https://www.numeraise.com${pathname}`
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.numeraise.com/"},
      {"@type": "ListItem", "position": 2, "name": category, "item": "https://www.numeraise.com/calculators"},
      {"@type": "ListItem", "position": 3, "name": title, "item": `https://www.numeraise.com${pathname}`}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
