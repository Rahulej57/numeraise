import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StructuredData } from '@/components/seo/structured-data';
import { CalculatorSearchModal } from '@/components/layout/calculator-search-modal';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';

export default function FinancialCalculatorsHubPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 flex items-center justify-center gap-3">
          <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          The Calculator Hub
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto px-4">
          Explore our complete directory of 50+ professional calculators to plan your wealth journey.
        </p>
        <div className="w-full max-w-md">
          <CalculatorSearchModal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {CALCULATOR_DIRECTORY.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-muted rounded-lg">{section.icon}</div>
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.calculators.map((calc, cIdx) => (
                <Link href={calc.href} key={cIdx} className="group">
                  <Card className="h-full hover:border-primary/50 hover:bg-muted/30 transition-colors">
                    <CardHeader className="p-5">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-background shadow-sm border border-border rounded-lg shrink-0">
                            <div className="scale-[0.80] origin-center">{section.icon}</div>
                          </div>
                          <span>{calc.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300 shrink-0 mt-1" />
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">{calc.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <StructuredData
        type="WebSite"
        data={{
          name: 'Numeraise Calculator Hub',
          description: 'Directory of all financial calculators on Numeraise.',
          url: 'https://numeraise.com/financial-calculators',
        }}
      />
    </div>
  );
}
