import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";
import { DynamicCalculatorClient } from "@/components/calculators/dynamic-calculator-client";
import { SITE_URL, SITE_NAME } from "@/config/site";

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ theme?: string }>;
}

export async function generateStaticParams() {
  const slugs = CALCULATOR_DIRECTORY.flatMap((category) =>
    category.calculators.map((c) => c.href.replace("/calculators/", ""))
  );
  return Array.from(new Set(slugs)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  let calcName = "Financial Calculator";

  for (const category of CALCULATOR_DIRECTORY) {
    const found = category.calculators.find((c) => c.href.includes(slug));
    if (found) {
      calcName = found.name;
      break;
    }
  }

  return {
    title: `${calcName} Widget | ${SITE_NAME}`,
    description: `Free embeddable interactive ${calcName} widget by Numeraise.`,
    alternates: {
      canonical: `${SITE_URL}/calculators/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function EmbedCalculatorPage({ params, searchParams }: EmbedPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const theme = resolvedSearchParams.theme || "auto";
  const isDark = theme === "dark";

  let calcName: string | null = null;
  for (const category of CALCULATOR_DIRECTORY) {
    const found = category.calculators.find((c) => c.href.includes(slug));
    if (found) {
      calcName = found.name;
      break;
    }
  }

  if (!calcName) {
    notFound();
  }

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col justify-between p-2 sm:p-4 ${isDark ? "dark bg-slate-950 text-slate-50" : ""}`}>
      {/* Top Branding Bar for Embed Visitors */}
      <header className="embed-header flex items-center justify-between pb-2 mb-2 border-b border-border/60">
        <a 
          href={`${SITE_URL}/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity"
        >
          <span className="font-extrabold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            <span className="text-primary font-black">⚡</span> {SITE_NAME}
          </span>
          <span className="text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 group-hover:border-primary/40 group-hover:text-primary transition-colors">
            numeraise.com ↗
          </span>
        </a>

        <a
          href={`${SITE_URL}/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1"
        >
          Full Calculator ↗
        </a>
      </header>

      <div className="w-full max-w-5xl mx-auto flex-1">
        <DynamicCalculatorClient slug={slug} name={calcName} />
      </div>

      <footer className="embed-footer mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="font-semibold text-foreground">{calcName}</span>
        </div>
        <a
          href={`${SITE_URL}/calculators/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-bold flex items-center gap-1"
        >
          Free Tool Powered by <span className="underline font-black text-foreground hover:text-primary">Numeraise.com</span> ↗
        </a>
      </footer>
    </div>
  );
}
