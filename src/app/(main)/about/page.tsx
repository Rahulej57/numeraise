import { Calculator, Shield, Users } from "lucide-react";

export const metadata = {
  title: "About Numeraise - Free Financial Tools",
  description: "Learn about Numeraise, our mission to democratize financial planning, and why millions trust our calculators.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Numeraise</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We build professional-grade financial tools that are entirely free, beautifully designed, and respect your privacy.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Our Mission</h2>
        <p>
          Financial planning shouldn't require an expensive advisor or a degree in finance. Our mission is to democratize access to high-quality financial calculations by building tools that are powerful enough for professionals, yet simple enough for beginners.
        </p>

        <div className="grid md:grid-cols-3 gap-8 my-12 not-prose">
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Calculator className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Absolute Accuracy</h3>
            <p className="text-muted-foreground text-sm">Our calculators use standard industry formulas identical to those used by top-tier financial institutions and banks.</p>
          </div>
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">100% Private</h3>
            <p className="text-muted-foreground text-sm">Your financial data never leaves your device. All calculations are executed securely within your own browser.</p>
          </div>
          <div className="p-6 bg-muted/50 rounded-xl border border-border">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Free Forever</h3>
            <p className="text-muted-foreground text-sm">We believe basic financial literacy should be free. You will never encounter a paywall to use our core calculators.</p>
          </div>
        </div>

        <h2>Why We Built This</h2>
        <p>
          We noticed that most financial calculators on the web were either outdated, riddled with intrusive pop-up ads, or required you to hand over your email address just to see the results. We wanted to create a platform that felt like a premium native app, but was accessible instantly via the web.
        </p>
      </div>
    </div>
  );
}
