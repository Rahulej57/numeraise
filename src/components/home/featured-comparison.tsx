import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const COMPARISONS = [
  {
    title: "SIP vs Fixed Deposit",
    href: "/compare/sip-vs-fd",
  },
  {
    title: "Rent vs Buy",
    href: "/compare/rent-vs-buy",
  },
  {
    title: "Old vs New Tax",
    href: "/compare/old-vs-new-tax",
  },
  {
    title: "Prepayment Impact",
    href: "/calculators/home-loan-prepayment",
  },
];

export function FeaturedComparison() {
  return (
    <section className="w-full py-8 bg-primary/5 dark:bg-primary/10 border-y border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Compare Scenarios</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {COMPARISONS.map((comp, idx) => {
            const colors = [
              "text-emerald-500 bg-emerald-500/10",
              "text-blue-500 bg-blue-500/10",
              "text-amber-500 bg-amber-500/10",
              "text-purple-500 bg-purple-500/10"
            ];
            const iconColor = colors[idx % colors.length];

            return (
              <Link href={comp.href} key={idx} className="group block">
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="p-3 md:p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                        <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                    </div>
                    <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors leading-tight">
                      {comp.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
