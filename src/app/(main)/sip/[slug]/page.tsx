import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PROGRAMMATIC_SIP_SCENARIOS,
  getProgrammaticSIPBySlug,
  computeSIPDetails,
} from '@/config/programmatic-sip';
import { SITE_URL, SITE_NAME, CONTENT_REVISION_DATE } from '@/config/site';
import { ArrowRight, Sparkles, TrendingUp, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROGRAMMATIC_SIP_SCENARIOS.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getProgrammaticSIPBySlug(slug);

  if (!scenario) {
    return { title: 'Not Found' };
  }

  const url = `${SITE_URL}/sip/${scenario.slug}`;

  return {
    title: `${scenario.title} | ${SITE_NAME}`,
    description: scenario.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: scenario.title,
      description: scenario.metaDescription,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: scenario.title,
      description: scenario.metaDescription,
    },
  };
}

function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export default async function ProgrammaticSIPPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = getProgrammaticSIPBySlug(slug);

  if (!scenario) {
    notFound();
  }

  const details = computeSIPDetails(scenario);

  // Generate FAQ Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the return on a ${formatINR(scenario.monthlyAmount)} monthly SIP for ${scenario.years} years?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Investing ${formatINR(scenario.monthlyAmount)} per month for ${scenario.years} years at an expected 12% annual return results in a total investment of ${formatINR(details.investedAmount)}, an estimated wealth gain of ${formatINR(details.estimatedReturns)}, and a final maturity value of approximately ${formatINR(details.totalValue)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much more will I get with a 10% annual Step-Up SIP?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `If you step up your SIP by 10% each year, your final corpus will reach ${formatINR(details.stepUpCorpus)} instead of ${formatINR(details.totalValue)}, generating an extra ${formatINR(details.stepUpGainDiff)} in total wealth.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the inflation-adjusted value of ${formatINR(details.totalValue)} after ${scenario.years} years?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Assuming a standard Indian retail inflation rate of 6% per annum, the real purchasing power of ${formatINR(details.totalValue)} in today's terms will be approximately ${formatINR(details.realPurchasingPower)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are returns from SIP mutual funds taxable in India?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Under current Indian income tax rules, Long-Term Capital Gains (LTCG) on equity mutual funds held for more than 1 year are exempt up to ₹1.25 Lakh per financial year, with gains above this limit taxed at 12.5%. Short-term capital gains (under 1 year) are taxed at 20%.`,
        },
      },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: scenario.title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  // Nearby scenarios for internal linking
  const otherScenarios = PROGRAMMATIC_SIP_SCENARIOS.filter((s) => s.slug !== scenario.slug).slice(0, 8);

  return (
    <div className="container max-w-5xl py-8 md:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/calculators/sip-calculator" className="hover:text-primary transition-colors">
          SIP Calculator
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate">{scenario.headline}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified 2026 SIP Compounding Analysis</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {scenario.headline}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {scenario.description} Here is the exact calculation of your future value, total capital invested, 10% annual step-up advantage, and real inflation purchasing power based on an average 12% equity return.
        </p>
      </div>

      {/* Key Result KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold">Total Invested Capital</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              {formatINR(details.investedAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {formatINR(scenario.monthlyAmount)} × {scenario.years * 12} monthly installments
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
              Estimated Wealth Gain
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatINR(details.estimatedReturns)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Pure compounding growth at {scenario.expectedRate}% p.a.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Total Maturity Corpus
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(details.totalValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Expected value after {scenario.years} years
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Step-Up and Inflation Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-Up Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-muted/40 to-muted/20 border border-primary/20 space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <TrendingUp className="w-5 h-5" />
            <span>The 10% Annual Step-Up Multiplier</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you increase your monthly contribution by just 10% each year (matching standard career increments), your corpus leaps from <strong>{formatINR(details.totalValue)}</strong> to:
          </p>
          <div className="p-3 bg-background/80 rounded-xl border border-border/80">
            <span className="text-xl md:text-2xl font-extrabold text-foreground">
              {formatINR(details.stepUpCorpus)}
            </span>
            <span className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              (+{formatINR(details.stepUpGainDiff)} extra wealth)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Total invested with Step-Up: {formatINR(details.totalInvestedStepUp)}.
          </p>
        </div>

        {/* Inflation Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 via-muted/40 to-muted/20 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Purchasing Power Reality Check (Inflation)</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Due to average Indian inflation (~6% p.a.), {formatINR(details.totalValue)} in {scenario.years} years will have the equivalent buying power of:
          </p>
          <div className="p-3 bg-background/80 rounded-xl border border-border/80">
            <span className="text-xl md:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {formatINR(details.realPurchasingPower)}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">in today's rupees</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Always plan targets using real purchasing power rather than nominal figures.
          </p>
        </div>
      </div>

      {/* Year by Year Compounding Schedule Table */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Year-by-Year Growth Table for {formatINR(scenario.monthlyAmount)}/mo SIP
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-3.5 font-semibold">End of Year</th>
                <th className="p-3.5 font-semibold">Total Invested</th>
                <th className="p-3.5 font-semibold">Estimated Returns</th>
                <th className="p-3.5 font-semibold">Total Wealth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {details.yearlyData.map((row) => (
                <tr key={row.year} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-medium">Year {row.year}</td>
                  <td className="p-3.5">{formatINR(row.invested)}</td>
                  <td className="p-3.5 text-blue-600 dark:text-blue-400">
                    {formatINR(row.value - row.invested)}
                  </td>
                  <td className="p-3.5 font-bold text-foreground">{formatINR(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customize in Full Calculator CTA */}
      <div className="p-6 md:p-8 rounded-2xl bg-primary text-primary-foreground flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Want to customize the return rate or tenure?</h3>
          <p className="text-sm opacity-90">
            Use our full interactive SIP calculator with sliders, dynamic charts, and downloadable schedules.
          </p>
        </div>
        <Link
          href={`/calculators/sip-calculator?amount=${scenario.monthlyAmount}&years=${scenario.years}&rate=${scenario.expectedRate}`}
          className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'whitespace-nowrap font-semibold text-primary' })}
        >
          Open Full Interactive Tool
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      {/* FAQs Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions (FAQ)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqSchema.mainEntity.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-border bg-card space-y-2">
              <h3 className="font-semibold text-foreground text-base">{faq.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related SIP Scenarios (Internal Links) */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-lg font-bold text-foreground">Explore Other Popular SIP Scenarios</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {otherScenarios.map((other) => (
            <Link
              key={other.slug}
              href={`/sip/${other.slug}`}
              className="p-3 rounded-lg border border-border/80 hover:border-primary/60 hover:bg-muted/40 transition-colors text-xs font-medium text-foreground flex items-center justify-between group"
            >
              <span className="truncate">{other.headline}</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
