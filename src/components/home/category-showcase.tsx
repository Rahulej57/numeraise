import Link from "next/link";
import { TrendingUp, Landmark, PiggyBank, ReceiptText, ShieldAlert, HeartHandshake, Briefcase, Home, Calendar, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

const CATEGORIES = [
  { title: "Investments", icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />, slug: "investments", href: "/calculators/category/investments", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Loans", icon: <Landmark className="w-5 h-5 md:w-6 md:h-6" />, slug: "loans", href: "/calculators/category/loans", color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Savings", icon: <PiggyBank className="w-5 h-5 md:w-6 md:h-6" />, slug: "savings", href: "/calculators/category/savings", color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Taxes", icon: <ReceiptText className="w-5 h-5 md:w-6 md:h-6" />, slug: "taxes", href: "/calculators/category/taxes", color: "text-rose-500", bg: "bg-rose-500/10" },
  { title: "Insurance", icon: <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />, slug: "insurance", href: "/calculators/category/insurance", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Retirement", icon: <HeartHandshake className="w-5 h-5 md:w-6 md:h-6" />, slug: "retirement", href: "/calculators/category/retirement", color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Business", icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />, slug: "business", href: "/calculators/category/business", color: "text-teal-500", bg: "bg-teal-500/10" },
  { title: "Real Estate", icon: <Home className="w-5 h-5 md:w-6 md:h-6" />, slug: "real-estate", href: "/calculators/category/real-estate", color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Health", icon: <Activity className="w-5 h-5 md:w-6 md:h-6" />, slug: "health", href: "/calculators/category/health", color: "text-pink-500", bg: "bg-pink-500/10" },
  { title: "Utilities", icon: <Calendar className="w-5 h-5 md:w-6 md:h-6" />, slug: "utility", href: "/calculators/category/utility", color: "text-slate-500", bg: "bg-slate-500/10" },
];

export function CategoryShowcase() {
  return (
    <section className="w-full py-8 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Browse by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CATEGORIES.map((cat) => (
            <Link href={cat.href} key={cat.title} className="group">
              <Card className="h-full border-none bg-muted/40 hover:bg-muted transition-all duration-300 shadow-none">
                <CardHeader className="p-3 md:p-4 flex flex-row items-center gap-3 space-y-0">
                  <div className={`p-2 rounded-lg ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    {cat.icon}
                  </div>
                  <CardTitle className="text-sm md:text-base group-hover:text-primary transition-colors">
                    {cat.title}
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
