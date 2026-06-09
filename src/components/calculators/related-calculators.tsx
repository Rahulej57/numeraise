import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface RelatedCalculator {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalculator[];
}

export function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  if (!calculators || calculators.length === 0) return null;

  return (
    <div className="print:hidden mt-16 w-full">
      <h3 className="text-2xl font-bold mb-8 text-center">Related Calculators</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc, idx) => (
          <Link href={calc.href} key={idx} className="group">
            <Card className="h-full border border-border transition-colors hover:border-primary/50 group-hover:shadow-sm">
              <CardHeader className="p-5 flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-3">
                  {calc.icon && (
                    <div className="p-1.5 bg-background border border-border rounded-lg shrink-0 mt-0.5">
                      <div className="scale-[0.85]">{calc.icon}</div>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{calc.title}</CardTitle>
                    <CardDescription className="mt-1.5">{calc.description}</CardDescription>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 flex-shrink-0 ml-2 mt-1" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
