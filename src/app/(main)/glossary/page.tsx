"use client";

import { useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { GLOSSARY_TERMS } from "@/config/glossary";

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filter terms based on search query OR selected letter
  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          term.shortDef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLetter = selectedLetter ? term.term.toUpperCase().startsWith(selectedLetter) : true;
    
    // If typing in search, prioritize search. Otherwise, use letter filter.
    if (searchQuery.trim() !== "") {
      return matchesSearch;
    }
    return matchesLetter;
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[70vh]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-primary" />
          Financial Glossary
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Master the language of money. Simple definitions for complex financial terms.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            className="pl-10 py-6 text-lg rounded-full" 
            placeholder="Search for a term (e.g. Amortization)..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setSelectedLetter(null); // Clear letter filter when searching
            }}
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center mb-12">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {letters.map(l => (
            <button 
              key={l} 
              onClick={() => {
                setSelectedLetter(selectedLetter === l ? null : l);
                setSearchQuery(""); // Clear search when clicking a letter
              }}
              className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors
                ${selectedLetter === l 
                  ? "bg-primary text-primary-foreground border-primary shadow-md" 
                  : "hover:bg-primary/10 hover:text-primary hover:border-primary/50 bg-card"}`}
            >
              {l}
            </button>
          ))}
        </div>
        {selectedLetter && (
          <button 
            onClick={() => setSelectedLetter(null)}
            className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" /> Clear Letter Filter
          </button>
        )}
      </div>

      {filteredTerms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map(term => (
            <Link key={term.slug} href={`/glossary/${term.slug}`} className="p-6 border rounded-lg hover:shadow-md transition-all bg-card hover:border-primary/50 group block">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{term.term}</h3>
              <p className="text-muted-foreground line-clamp-3">{term.shortDef}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/10">
          <h3 className="text-2xl font-semibold mb-2">No terms found</h3>
          <p className="text-muted-foreground">
            We couldn't find any glossary terms matching your search criteria.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedLetter(null); }}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
