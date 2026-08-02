"use client";

import { usePathname } from "next/navigation";
import { SITE_URL } from "@/config/site";

export function SeoSchemas({ title, description }: { title: string; description: string }) {
  const pathname = usePathname();

  // Only render on individual calculator pages.
  if (!pathname || !pathname.startsWith("/calculators/") || pathname.includes("/category/")) {
    return null;
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "FinanceApplication",
    applicationSubCategory: "Calculator",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    description,
    url: `${SITE_URL}${pathname}`,
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Calculators", item: `${SITE_URL}/calculators` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}${pathname}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
