import Link from "next/link";
import { Flame } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function TrendingCalculators() {
  const trending = [
    { title: "Income Tax", metric: "Most Used", href: "/calculators/income-tax-calculator" },
    { title: "SIP", metric: "Popular", href: "/calculators/sip-calculator" },
    { title: "GST", metric: "Fastest Growing", href: "/calculators/gst-calculator" },
    { title: "Home Loan EMI", metric: "Hot", href: "/calculators/home-loan-calculator" },
  ];

  return (
    <section className="w-full py-8 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 max-w-5xl mx-auto">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Trending</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {trending.map((item, idx) => (
            <Link href={item.href} key={idx} className="group">
              <Card className="h-full hover:border-orange-500/50 hover:shadow-sm transition-all duration-300 bg-background/50">
                <CardHeader className="p-3 md:p-4">
                  <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider mb-1 block">
                    {item.metric}
                  </span>
                  <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
