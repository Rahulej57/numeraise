"use client";

import React, { useState } from "react";
import { Code, Copy, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/config/site";

interface EmbedModalProps {
  slug: string;
  calculatorName: string;
}

export function EmbedModal({ slug, calculatorName }: EmbedModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [height, setHeight] = useState("520");

  const embedUrl = `${SITE_URL}/embed/${slug}${theme !== "auto" ? `?theme=${theme}` : ""}`;
  const canonicalCalcUrl = `${SITE_URL}/calculators/${slug}`;

  const embedSnippet = `<iframe src="${embedUrl}" width="100%" height="${height}" frameborder="0" style="border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.05);" title="${calculatorName} by Numeraise"></iframe>
<p style="font-size:12px;color:#64748b;margin-top:6px;text-align:right;font-family:sans-serif;">
  Free tool powered by <a href="${canonicalCalcUrl}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Numeraise ${calculatorName}</a>
</p>`;

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(embedSnippet);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = embedSnippet;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex-1 sm:flex-none gap-1.5 border-dashed border-primary/40 hover:border-primary text-primary"
        title="Embed this interactive calculator on your blog or website for free"
      >
        <Code className="w-4 h-4" />
        <span>Embed Widget</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-card text-card-foreground rounded-2xl border border-border shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Embed Calculator</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free interactive widget for your website or blog
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="space-y-4 mb-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="auto">Auto (Match Website)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div className="w-32">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Code Snippet Box */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  HTML Embed Code (Paste into your CMS / WordPress / HTML)
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    rows={5}
                    value={embedSnippet}
                    className="w-full p-3 font-mono text-xs rounded-xl bg-muted/70 border border-border text-foreground resize-none focus:outline-none"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="absolute top-2.5 right-2.5 h-8 gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer notice */}
            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                ✓ Free to use • No API key required
              </span>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                Preview Widget <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
