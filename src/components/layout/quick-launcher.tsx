"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, X, ChevronUp, TrendingUp, Landmark, Calculator as CalcIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_CALCS = [
  { title: "SIP Calculator", href: "/calculators/sip-calculator", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
  { title: "EMI Calculator", href: "/calculators/emi-calculator", icon: <Landmark className="w-4 h-4 text-blue-500" /> },
  { title: "FD Calculator", href: "/calculators/fd-calculator", icon: <CalcIcon className="w-4 h-4 text-amber-500" /> },
  { title: "GST Calculator", href: "/calculators/gst-calculator", icon: <CalcIcon className="w-4 h-4 text-rose-500" /> },
  { title: "CAGR Calculator", href: "/calculators/cagr-calculator", icon: <TrendingUp className="w-4 h-4 text-purple-500" /> },
  { title: "Retirement Calculator", href: "/calculators/retirement-calculator", icon: <CalcIcon className="w-4 h-4 text-indigo-500" /> },
];

export function QuickLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Menu Box */}
      {isOpen && (
        <div className="mb-4 bg-background border border-border rounded-2xl shadow-2xl w-[280px] overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Quick Calculators
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 flex flex-col">
            {QUICK_CALCS.map((calc) => (
              <Link 
                key={calc.title} 
                href={calc.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-colors text-sm font-medium"
              >
                <div className="p-2 bg-background rounded-lg border shadow-sm">
                  {calc.icon}
                </div>
                {calc.title}
              </Link>
            ))}
          </div>
          <div className="p-3 bg-muted/30 border-t border-border">
            <Link 
              href="/financial-calculators" 
              onClick={() => setIsOpen(false)}
              className="text-xs text-center block w-full text-primary font-medium hover:underline"
            >
              View all 50+ tools &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="w-11 h-11 md:w-12 md:h-12 rounded-full shadow-2xl bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6 rotate-180 transition-transform" /> : <Calculator className="w-5 h-5 md:w-6 md:h-6" />}
      </Button>

    </div>
  );
}
