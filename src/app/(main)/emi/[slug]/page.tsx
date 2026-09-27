import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PROGRAMMATIC_EMI_SCENARIOS,
  getProgrammaticEMIBySlug,
  computeEMIDetails,
} from '@/config/programmatic-emi';
import { SITE_URL, SITE_NAME } from '@/config/site';
import { ArrowRight, Sparkles, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROGRAMMATIC_EMI_SCENARIOS.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getProgrammaticEMIBySlug(slug);

  if (!scenario) {
    return { title: 'Not Found' };
  }

  const url = `${SITE_URL}/emi/${scenario.slug}`;

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

export default async function ProgrammaticEMIPage({ params }: PageProps) {
  const { slug } = await params;
  const scenario = getProgrammaticEMIBySlug(slug);

  if (!scenario) {
    notFound();
  }

  const details = computeEMIDetails(scenario);

  // Generate FAQ Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the monthly EMI for ${formatINR(scenario.principal)} for ${scenario.tenureYears} years at ${scenario.interestRate}%?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The monthly EMI for a ${formatINR(scenario.principal)} loan at an interest rate of ${scenario.interestRate}% per annum for ${scenario.tenureYears} years (${scenario.tenureYears * 12} months) is ${formatINR(details.emi)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much total interest will I pay on a ${formatINR(scenario.principal)} loan?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Over the complete ${scenario.tenureYears}-year tenure, total interest payable is ${formatINR(details.totalInterest)}, making your total repayment amount ${formatINR(details.totalPayment)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much can I save by paying 1 extra EMI each year?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `By paying the equivalent of just 1 extra EMI each year, you will shorten your loan tenure by approximately ${details.yearsSaved} years and save around ${formatINR(details.interestSaved)} in interest.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I claim tax benefits on a ${formatINR(scenario.principal)} home loan in India?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, if you choose the Old Tax Regime. You can claim tax deductions up to ₹2 Lakhs per financial year on home loan interest under Section 24(b), and up to ₹1.5 Lakhs on principal repayment under Section 80C.`,
        },
      },
    ],
  };

  const loanSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: scenario.title,
    annualPercentageRate: `${scenario.interestRate}%`,
    feesAndCommissionsSpecification: 'Check with lending bank for processing charges (typically 0.25% - 0.50%)',
  };

  // Nearby scenarios for internal linking
  const otherScenarios = PROGRAMMATIC_EMI_SCENARIOS.filter((s) => s.slug !== scenario.slug).slice(0, 8);

  return (
    <div className="container max-w-5xl py-8 md:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/calculators/emi-calculator" className="hover:text-primary transition-colors">
          EMI Calculator
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium truncate">{scenario.headline}</span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified 2026 Loan Amortization Schedule</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {scenario.headline}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {scenario.description} Here is your complete financial calculation: monthly EMI, total interest payable, principal-to-interest ratio, and how much you can save with loan prepayment hacks.
        </p>
      </div>

      {/* Key Result KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/60 bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Monthly EMI Payable
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatINR(details.emi)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              For {scenario.tenureYears * 12} months at {scenario.interestRate}% interest
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold">Total Principal Amount</CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
              {formatINR(scenario.principal)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Original loan disbursed by lender
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
              Total Interest Payable
            </CardDescription>
            <CardTitle className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {formatINR(details.totalInterest)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total Repayment: {formatINR(details.totalPayment)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prepayment Hack Highlight */}
      <div className="p-6 md:p-7 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary/5 to-muted/30 border border-blue-500/20 space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-lg">
          <Zap className="w-5 h-5" />
          <span>The "1-Extra-EMI" Prepayment Wealth Saver</span>
        </div>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
          Most home loan borrowers don't realize that in the first 5 to 7 years, over 70% of each EMI goes purely toward bank interest. If you pay just <strong>one extra EMI per year</strong> (or increase your monthly payment by 1/12th):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-background/90 rounded-xl border border-border shadow-xs">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
              Interest Money Saved
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ~{formatINR(details.interestSaved)}
            </span>
            <p className="text-xs text-muted-foreground mt-1">Stays in your pocket instead of the bank&apos;s</p>
          </div>
          <div className="p-4 bg-background/90 rounded-xl border border-border shadow-xs">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
              Time Off Your Loan
            </span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              ~{details.yearsSaved} Years Shorter
            </span>
            <p className="text-xs text-muted-foreground mt-1">Become completely debt-free much earlier</p>
          </div>
        </div>
      </div>

      {/* Yearly Repayment Schedule */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Year-by-Year Repayment Amortization Schedule
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-3.5 font-semibold">Year</th>
                <th className="p-3.5 font-semibold">Principal Paid</th>
                <th className="p-3.5 font-semibold">Interest Paid</th>
                <th className="p-3.5 font-semibold">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {details.yearlySummary.map((row) => (
                <tr key={row.year} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-medium">Year {row.year}</td>
                  <td className="p-3.5 text-foreground">{formatINR(row.principal)}</td>
                  <td className="p-3.5 text-amber-600 dark:text-amber-400">{formatINR(row.interest)}</td>
                  <td className="p-3.5 font-bold text-foreground">{formatINR(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customize in Full Calculator CTA */}
      <div className="p-6 md:p-8 rounded-2xl bg-primary text-primary-foreground flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold">Want to customize the interest rate or down payment?</h3>
          <p className="text-sm opacity-90">
            Open our full interactive loan calculator with sliders, pie charts, and monthly amortization downloads.
          </p>
        </div>
        <Link
          href={`/calculators/emi-calculator?amount=${scenario.principal}&years=${scenario.tenureYears}&rate=${scenario.interestRate}`}
          className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'whitespace-nowrap font-semibold text-primary' })}
        >
          Open Interactive EMI Calculator
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

      {/* Related EMI Scenarios (Internal Links) */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h2 className="text-lg font-bold text-foreground">Explore Other Popular Loan EMI Scenarios</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {otherScenarios.map((other) => (
            <Link
              key={other.slug}
              href={`/emi/${other.slug}`}
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
