"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Calculator, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { CALCULATOR_DIRECTORY } from "@/config/calculators";
import { useCurrency } from "@/context/CurrencyContext";

export function CalculatorSearchModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { currency } = useCurrency();

  const ALL_CALCULATORS = useMemo(() => {
    return CALCULATOR_DIRECTORY.flatMap((section) => 
      section.calculators.map((calc) => {
        const slug = calc.href.split('/').pop() || "";
        let title = calc.name;
        let href = calc.href;
        let aliases = "";

        if (slug === "gst-calculator") {
          // Provide aliases so searching "Sales Tax", "VAT", or "GST" always works
          aliases = "Sales Tax VAT GST";
          
          if (currency.code === "USD") {
            title = "Sales Tax Calculator";
            href = "/calculators/sales-tax-calculator";
          } else if (["EUR", "GBP"].includes(currency.code)) {
            title = "VAT Calculator";
            href = "/calculators/vat-calculator";
          }
        }

        return {
          id: calc.href,
          title,
          category: section.category,
          href,
          searchTerms: `${title} ${section.category} ${aliases}`,
        };
      })
    );
  }, [currency.code]);

  // Keyboard shortcut cmd+k
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 sm:w-40 md:w-56 xl:w-64 sm:justify-start sm:px-3 sm:py-2 rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden xl:inline-flex">Search calculators...</span>
        <span className="hidden sm:inline-flex xl:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
        <span className="sr-only sm:hidden">Search</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-2xl border-2 border-primary/20">
          <VisuallyHidden>
            <DialogTitle>Search Calculators</DialogTitle>
          </VisuallyHidden>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-6 [&_[cmdk-input-wrapper]_svg]:w-6 [&_[cmdk-input]]:h-14 [&_[cmdk-input]]:text-lg [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput placeholder="Type a calculator name or category..." />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No calculators found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {ALL_CALCULATORS.map((calc) => (
                  <CommandItem
                    key={calc.id}
                    value={calc.searchTerms}
                    onSelect={() => runCommand(() => router.push(calc.href))}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="p-2 bg-primary/10 text-primary rounded-md">
                        <Calculator className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{calc.title}</p>
                        <p className="text-xs text-muted-foreground">{calc.category}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
