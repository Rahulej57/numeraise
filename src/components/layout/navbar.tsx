"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalculatorSearchModal } from "@/components/layout/calculator-search-modal";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import CurrencySelector from "@/components/layout/CurrencySelector";
import { Menu, X, TrendingUp } from "lucide-react";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Robustly determine active category by checking the actual calculator directory map
  const isInvestments = pathname.includes('/category/investments') || 
    (pathname.startsWith('/calculators/') && !!CALCULATOR_DIRECTORY.find(c => c.slug === 'investments')?.calculators.some(calc => pathname.includes(calc.href)));
          
  const isLoans = pathname.includes('/category/loans') || 
    (pathname.startsWith('/calculators/') && !!CALCULATOR_DIRECTORY.find(c => c.slug === 'loans')?.calculators.some(calc => pathname.includes(calc.href)));

  const isTax = pathname.includes('/category/taxes') || 
    (pathname.startsWith('/calculators/') && !!CALCULATOR_DIRECTORY.find(c => c.slug === 'taxes')?.calculators.some(calc => pathname.includes(calc.href)));

  const isAllCalculators = pathname === '/calculators' || (pathname.startsWith('/calculators') && !pathname.includes('/category/') && !isInvestments && !isLoans && !isTax);

  return (
    <header className={`print:hidden sticky top-0 z-50 w-full border-b bg-background/95 ${mobileMenuOpen ? '' : 'backdrop-blur supports-[backdrop-filter]:bg-background/60'}`}>
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-2 md:gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden p-2 -ml-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-primary stroke-[2.5]" />
            </div>
            <span className="hidden sm:inline-block font-extrabold text-xl text-primary tracking-tight">Numeraise</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 items-center absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={`text-sm ${pathname === '/' ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Home</Link>
          <Link href="/calculators" className={`text-sm ${isAllCalculators ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>All Calculators</Link>
          <Link href="/calculators/category/investments" className={`text-sm ${isInvestments ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Investments</Link>
          <Link href="/calculators/category/loans" className={`text-sm ${isLoans ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Loans</Link>
          <Link href="/calculators/category/taxes" className={`text-sm ${isTax ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Tax</Link>
          <Link href="/blog" className={`text-sm ${pathname.startsWith('/blog') ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Blog</Link>
          <Link href="/glossary" className={`text-sm ${pathname.startsWith('/glossary') ? 'font-bold text-primary' : 'font-medium text-muted-foreground hover:text-foreground'}`}>Glossary</Link>
        </nav>
        
        {/* Search & Actions */}
        <div className="flex items-center justify-end space-x-2 md:space-x-4 flex-1 lg:flex-none">
          <div className="flex-none sm:flex-1 w-auto sm:max-w-xs md:max-w-sm flex justify-end">
            {pathname !== '/' && <CalculatorSearchModal />}
          </div>
          
          <CurrencySelector />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute left-0 top-0 h-full w-[280px] bg-background border-r border-border shadow-2xl flex flex-col p-6 gap-6 z-50 animate-in slide-in-from-left duration-300 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="flex items-center gap-2 group">
                <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary stroke-[2.5]" />
                </div>
                <span className="font-extrabold text-xl text-primary tracking-tight">Numeraise</span>
              </Link>
              <button 
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-2">
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  pathname === '/' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Home
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/calculators" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  isAllCalculators 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                All Calculators
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/calculators/category/investments" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  isInvestments 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Investments
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/calculators/category/loans" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  isLoans 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Loans
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/calculators/category/taxes" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  isTax 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Tax
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/blog" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  pathname.startsWith('/blog') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Blog
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                href="/glossary" 
                className={`text-base font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                  pathname.startsWith('/glossary') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Glossary
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
