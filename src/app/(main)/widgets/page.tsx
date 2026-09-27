"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { Code2, Copy, Check, Sparkles, ExternalLink, ShieldCheck, Smartphone, Palette, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FEATURED_WIDGETS = [
  {
    id: "sip-calculator",
    name: "SIP Calculator Widget",
    description: "Embed mutual fund SIP compounding calculator with interactive charts.",
    category: "Investments",
    defaultHeight: 520,
  },
  {
    id: "emi-calculator",
    name: "Loan EMI Calculator Widget",
    description: "Home loan, car loan, and personal loan EMI calculator with amortization table.",
    category: "Loans",
    defaultHeight: 520,
  },
  {
    id: "compound-interest",
    name: "Compound Interest Widget",
    description: "Demonstrates compounding frequency with exponential growth breakdowns.",
    category: "Savings",
    defaultHeight: 520,
  },
  {
    id: "ppf-calculator",
    name: "PPF Calculator Widget",
    description: "Public Provident Fund guaranteed government return schedule calculator.",
    category: "Govt Schemes",
    defaultHeight: 520,
  },
];

export default function WidgetsShowroomPage() {
  const [selectedWidget, setSelectedWidget] = useState(FEATURED_WIDGETS[0]);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [copied, setCopied] = useState(false);

  const embedUrl = `${SITE_URL}/embed/${selectedWidget.id}${theme !== "auto" ? `?theme=${theme}` : ""}`;
  const canonicalUrl = `${SITE_URL}/calculators/${selectedWidget.id}`;

  const iframeSnippet = `<!-- Numeraise ${selectedWidget.name} -->
<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="${selectedWidget.defaultHeight}" 
  frameborder="0" 
  style="border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.05);max-width:100%;" 
  title="${selectedWidget.name} by Numeraise"
  loading="lazy"
></iframe>
<p style="font-size:12px;color:#64748b;margin-top:6px;text-align:right;font-family:sans-serif;">
  Free tool powered by <a href="${canonicalUrl}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Numeraise Financial Calculators</a>
</p>`;

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(iframeSnippet);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = iframeSnippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-5xl py-8 md:py-12 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Code2 className="w-3.5 h-3.5" />
          <span>Free Embeddable Financial Tools</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Free Calculator Widgets for Your Blog or Website
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Boost your website engagement and dwell time. Embed our responsive, fast, and 100% private financial calculators on WordPress, Ghost, Squarespace, or custom websites with one copy-paste code.
        </p>
      </div>

      {/* Widget Customizer & Interactive Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selector & Options */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold">1. Select a Calculator Widget</CardTitle>
              <CardDescription>Choose the calculator that best fits your article topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {FEATURED_WIDGETS.map((widget) => {
                const isSelected = selectedWidget.id === widget.id;
                return (
                  <button
                    key={widget.id}
                    onClick={() => setSelectedWidget(widget)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-xs"
                        : "border-border hover:border-primary/40 hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{widget.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{widget.description}</div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {widget.category}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span>2. Customize Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(["auto", "light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg capitalize border transition-all ${
                      theme === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/40 bg-card text-foreground"
                    }`}
                  >
                    {t} Mode
                  </button>
                ))}
              </div>

              {/* Copy Code Block */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>HTML Embed Code</span>
                  <span>Responsive Iframe</span>
                </div>
                <div className="relative">
                  <pre className="p-3 bg-muted rounded-xl text-[11px] font-mono overflow-x-auto text-foreground border border-border/80 max-h-36">
                    {iframeSnippet}
                  </pre>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className="w-full mt-3 font-semibold shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-green-400" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy Embed Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Live Interactive Preview
            </span>
            <Link
              href={`/embed/${selectedWidget.id}`}
              target="_blank"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Open Standalone
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-border shadow-lg overflow-hidden bg-card">
            <iframe
              src={embedUrl}
              width="100%"
              height="530"
              frameBorder="0"
              className="w-full bg-background"
              title={`${selectedWidget.name} Preview`}
            />
          </div>
        </div>
      </div>

      {/* Feature Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-2.5">
          <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-foreground">100% Mobile & Responsive</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Adapts smoothly to mobile smartphones, tablets, and full desktop displays without breaking layout.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-2.5">
          <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Private & Client-Side</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All mathematical calculations execute in the visitor&apos;s browser. Zero user financial data is transmitted to or stored on servers.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-2.5">
          <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-base text-foreground">Compatible With Everything</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste directly into WordPress (Custom HTML block), Ghost, Squarespace, Wix, Substack, or static HTML sites.
          </p>
        </div>
      </div>

      {/* Embedding Guide */}
      <div className="p-6 md:p-8 rounded-2xl bg-muted/30 border border-border space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <span>How to Embed in 3 Simple Steps</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-1.5">
            <div className="font-bold text-primary">Step 1: Copy Embed Code</div>
            <p className="text-muted-foreground">
              Select your desired calculator and click the "Copy Embed Code" button above.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-primary">Step 2: Paste in CMS</div>
            <p className="text-muted-foreground">
              In WordPress, add a <strong>Custom HTML block</strong>. In Ghost, add an <strong>HTML card</strong>.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-primary">Step 3: Publish & Engage</div>
            <p className="text-muted-foreground">
              Save or publish your page. Your readers can now calculate finances directly without leaving your site!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
