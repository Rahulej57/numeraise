import React from "react";
import { FAQ } from "../calculators/faq-accordion";

interface StructuredDataProps {
  type: "Calculator" | "Article" | "FAQ" | "BreadcrumbList" | "WebSite";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema = {};

  if (type === "WebSite") {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": data.name,
      "description": data.description,
      "url": "https://www.numeraise.com"
    };
  }

  if (type === "Calculator") {
    schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": data.name,
      "description": data.description,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  }

  if (type === "FAQ" && data.faqs) {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqs.map((faq: FAQ) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": typeof faq.answer === 'string' ? faq.answer : "Please visit the page to read the full answer." // Fallback if answer is a complex React node
        }
      }))
    };
  }

  if (type === "BreadcrumbList" && data.breadcrumbs) {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.breadcrumbs.map((crumb: {name: string, url: string}, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
