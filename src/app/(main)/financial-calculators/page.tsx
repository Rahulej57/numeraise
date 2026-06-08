import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StructuredData } from "@/components/seo/structured-data";
import { CalculatorSearchModal } from "@/components/layout/calculator-search-modal";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function FinancialCalculatorsHubPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          <span className="text-5xl mr-2">🧮</span> The Ultimate Calculator Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Browse our complete directory of 50+ professional-grade financial calculators. Plan every aspect of your wealth journey.
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
                      <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center justify-between">
                        {calc.name}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
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
          name: "Numeraise Calculator Hub",
          description: "Directory of all financial calculators on Numeraise.",
          url: "https://Numeraise.com/financial-calculators"
        }} 
      />
    </div>
  );
}
