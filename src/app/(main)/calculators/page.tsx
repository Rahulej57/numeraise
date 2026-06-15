import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';
import { ChevronRight, Calculator } from 'lucide-react';
import { DynamicCalculatorList } from '@/components/calculators/dynamic-calculator-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Financial Calculators | Numeraise',
  description: 'Explore our collection of 50+ premium financial calculators designed to help you make smarter money decisions.',
  alternates: {
    canonical: '/calculators',
  },
};

export default function AllCalculatorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[70vh]">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">All Financial Calculators</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of 50+ premium financial calculators designed to help you make smarter money decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CALCULATOR_DIRECTORY.map((category) => (
          <Card key={category.slug} className="border-2 border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg shadow-sm">{category.icon}</div>
                <div>
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                  <CardDescription className="text-sm mt-1">{category.calculators.length} calculators</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DynamicCalculatorList calculators={category.calculators} variant="list" categoryIcon={category.icon} />
              <div className="p-4 border-t bg-muted/10 text-center">
                <Link
                  href={`/calculators/category/${category.slug}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View all {category.category} calculators &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
