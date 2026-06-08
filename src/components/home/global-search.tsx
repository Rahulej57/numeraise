"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Calculator, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

// Comprehensive list of all available and planned calculators for fuzzy search
const CALCULATORS = [
  { id: "sip", title: "SIP Calculator", category: "Investments", href: "/calculators/sip-calculator" },
  { id: "lumpsum", title: "Lumpsum Calculator", category: "Investments", href: "/calculators/lumpsum-calculator" },
  { id: "fd", title: "FD Calculator", category: "Savings", href: "/calculators/fd-calculator" },
  { id: "emi", title: "EMI Calculator", category: "Loans", href: "/calculators/emi-calculator" },
  { id: "home-loan", title: "Home Loan Calculator", category: "Loans", href: "/calculators/home-loan-calculator" },
  { id: "income-tax", title: "Income Tax Calculator", category: "Taxes", href: "/calculators/income-tax-calculator" },
  { id: "gst", title: "GST Calculator", category: "Taxes", href: "/calculators/gst-calculator" },
  { id: "term-insurance", title: "Term Insurance Calculator", category: "Insurance", href: "/calculators/term-insurance-calculator" },
  { id: "retirement", title: "Retirement Calculator", category: "Retirement", href: "/calculators/retirement-calculator" },
  { id: "cagr", title: "CAGR Calculator", category: "Investments", href: "/calculators/cagr-calculator" },
];

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fuzzy match logic
  const filteredCalculators = query === "" 
    ? CALCULATORS.slice(0, 5) // Show top 5 suggestions if empty
    : CALCULATORS.filter((calc) => {
        const searchTerms = query.toLowerCase().split(" ");
        const targetString = `${calc.title.toLowerCase()} ${calc.category.toLowerCase()}`;
        return searchTerms.every(term => targetString.includes(term));
      });

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") setIsOpen(true);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCalculators.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCalculators.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCalculators[selectedIndex]) {
        handleSelect(filteredCalculators[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (calc: typeof CALCULATORS[0]) => {
    setQuery("");
    setIsOpen(false);
    router.push(calc.href);
  };

  return (
    <div className="w-full max-w-2xl mx-auto -mt-8 relative z-20 px-4" ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-background border-2 border-primary/20 rounded-full shadow-lg overflow-hidden focus-within:border-primary transition-colors">
          <Search className="w-6 h-6 ml-6 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search calculators (e.g. 'SIP', 'EMI', 'Tax')..."
            className="border-0 focus-visible:ring-0 text-lg py-7 px-4 shadow-none bg-transparent h-14"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            {filteredCalculators.length > 0 ? (
              <ul className="max-h-[300px] overflow-y-auto py-2">
                {query === "" && (
                  <li className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Popular Searches
                  </li>
                )}
                {filteredCalculators.map((calc, idx) => (
                  <li 
                    key={calc.id}
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                      idx === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleSelect(calc)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${idx === selectedIndex ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{calc.title}</p>
                        <p className="text-xs text-muted-foreground">{calc.category}</p>
                      </div>
                    </div>
                    {idx === selectedIndex && <ArrowRight className="w-4 h-4 text-primary" />}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p>No calculators found for "{query}".</p>
                <p className="text-sm mt-1">Try searching for "Loans" or "Investments"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
