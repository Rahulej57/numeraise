import { CheckCircle2 } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    { title: "Accurate Formulas" },
    { title: "Always Updated" },
    { title: "Privacy Focused" },
    { title: "100% Free" },
  ];

  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Why Numeraise?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-colors text-center items-center md:flex-row md:text-left md:items-center">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <h3 className="font-bold text-sm leading-tight">{benefit.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
