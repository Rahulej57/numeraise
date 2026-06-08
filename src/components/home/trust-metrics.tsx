import { Calculator, Activity, ShieldCheck, Clock } from "lucide-react";

export function TrustMetrics() {
  return (
    <section className="w-full py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center divide-x-0 md:divide-x divide-border">
          
          <div className="flex flex-col items-center p-2 hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">50+</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Calculators</p>
          </div>

          <div className="flex flex-col items-center p-2 hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">100K+</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Calculations</p>
          </div>

          <div className="flex flex-col items-center p-2 hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">100%</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Free Tools</p>
          </div>

          <div className="flex flex-col items-center p-2 hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">24/7</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Available</p>
          </div>

        </div>
      </div>
    </section>
  );
}
