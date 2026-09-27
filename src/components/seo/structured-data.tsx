import React from "react";
import { FAQ } from "../calculators/faq-accordion";
import { SITE_URL, SITE_NAME } from "@/config/site";

type SchemaType = "Calculator" | "Article" | "FAQ" | "BreadcrumbList" | "WebSite";

interface StructuredDataProps {
  type: SchemaType;
  data: Record<string, any>;
}

/**
 * Strips HTML and collapses whitespace so JSON-LD answer text stays plain.
 * Google rejects FAQPage entries whose text does not match the visible answer.
 */
function toPlainText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let schema: Record<string, any> = {};

  if (type === "WebSite") {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: data.name,
      description: data.description,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (type === "Calculator") {
    schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: data.name,
      description: data.description,
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Calculator",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      browserRequirements: "Requires JavaScript",
      ...(data.url ? { url: data.url } : {}),
      provider: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };
  }

  if (type === "Article") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.headline,
      description: data.description,
      ...(data.url ? { mainEntityOfPage: { "@type": "WebPage", "@id": data.url } } : {}),
      ...(data.image ? { image: data.image } : {}),
      ...(data.datePublished ? { datePublished: data.datePublished } : {}),
      dateModified: data.dateModified || data.datePublished,
      author: data.author
        ? { "@type": "Person", name: data.author, url: `${SITE_URL}/authors/rahul-sharma` }
        : { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (type === "FAQ" && Array.isArray(data.faqs)) {
    // De-duplicate by question. Repeated questions in a FAQPage block are an
    // invalid-markup signal and previously appeared on some calculators.
    const seen = new Set<string>();
    const questions = (data.faqs as FAQ[])
      .filter((faq) => {
        const key = toPlainText(faq.question).toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((faq) => ({
        "@type": "Question",
        name: toPlainText(faq.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: toPlainText(faq.answer),
        },
      }))
      // An Answer with no text makes the whole block invalid.
      .filter((q) => q.acceptedAnswer.text.length > 0);

    if (questions.length === 0) return null;

    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: questions,
    };
  }

  if (type === "BreadcrumbList" && Array.isArray(data.breadcrumbs)) {
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: (data.breadcrumbs as { name: string; url: string }[]).map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith("http") ? crumb.url : `${SITE_URL}${crumb.url}`,
      })),
    };
  }

  if (Object.keys(schema).length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export { SITE_NAME };
