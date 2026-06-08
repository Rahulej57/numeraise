"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface ViewedCalculator {
  title: string;
  href: string;
}

export function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedCalculator[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("Numeraise_recently_viewed");
      if (stored) {
        setRecentlyViewed(JSON.parse(stored).slice(0, 4));
      } else {
        setRecentlyViewed([]);
      }
    } catch (e) {
      console.error("Failed to parse recently viewed calculators");
    }
  }, []);

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="w-full py-6 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base font-bold tracking-tight">Recently Viewed</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {recentlyViewed.map((calc, idx) => (
            <Link href={calc.href} key={idx} className="block">
              <Card className="h-full hover:border-primary/50 transition-colors bg-muted/30">
                <CardHeader className="py-2.5 px-3 flex flex-row items-center justify-between gap-2 space-y-0 h-full">
                  <CardTitle className="text-[11px] md:text-xs font-medium line-clamp-1">{calc.title}</CardTitle>
                  <ArrowRight className="w-3 h-3 shrink-0 text-muted-foreground" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
