"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrendingUp, Info } from "lucide-react";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function SipVsLumpsumPage() {
  const { format, currency } = useCurrency();
  const [totalCapital, setTotalCapital] = useState((1200000 / 83).toString());
  const [years, setYears] = useState("10");
  const [returnRate, setReturnRate] = useState("12");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("sip-vs-lumpsum"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const results = useMemo(() => {
    const p = Number(totalCapital);
    const y = Number(years);
    const r = Number(returnRate) / 100;

    if (isNaN(p) || isNaN(y) || isNaN(r) || p <= 0 || y <= 0 || r <= 0) return null;

    // Lumpsum Calculation
    const lumpsumMaturity = p * Math.pow(1 + r, y);
    const lumpsumProfit = lumpsumMaturity - p;

    // SIP Calculation
    // Total capital is spread over 'y' years (y * 12 months)
    const months = y * 12;
    const monthlySip = p / months;
    const monthlyRate = r / 12;
    
    // SIP Formula: P * [ (1+i)^n - 1 ] * (1+i) / i
    const sipMaturity = monthlySip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const sipProfit = sipMaturity - p;

    const diff = lumpsumMaturity - sipMaturity;
    const diffPercent = (diff / sipMaturity) * 100;

    const f = (val: number) => format(val);

    return {
      monthlySip,
      lumpsumMaturity: f(lumpsumMaturity),
      lumpsumProfit: f(lumpsumProfit),
      sipMaturity: f(sipMaturity),
      sipProfit: f(sipProfit),
      diff: f(Math.abs(diff)),
      diffPercent: diffPercent.toFixed(1),
      winner: diff > 0 ? "Lumpsum" : diff < 0 ? "SIP" : "Equal",
      winnerValue: diff > 0 ? f(diff) : f(Math.abs(diff))
    };
  }, [totalCapital, years, returnRate, format, currency.rate]);

  return (
    <CalculatorLayout title="SIP vs Lumpsum Comparison" description="Compare investing your money all at once vs spreading it out over time." icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto">
        
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-card shadow-sm border-border">
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="capital">Total Capital Available</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground font-medium">{currency.symbol}</div>
                  <Input 
                    id="capital"
                    type="number" 
                    value={(Number(totalCapital) * currency.rate).toFixed(0)}
                    onChange={(e) => setTotalCapital((Number(e.target.value) / currency.rate).toString())}
                    className="h-12 pl-8 font-medium text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Duration (Years)</Label>
                <Input 
                  id="years"
                  type="number" 
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="rate">Expected Return Rate</Label>
                  <span className="font-bold text-primary">{returnRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="30" step="0.5" 
                  value={returnRate} 
                  onChange={(e) => setReturnRate(e.target.value)} 
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-xl border flex gap-3 text-sm text-muted-foreground">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p>Because money invested as a Lumpsum spends more "Time in the Market" than money slowly dripped via SIP, Lumpsum mathematically produces higher returns in a consistently growing market.</p>
          </div>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-7">
          {results ? (
            <div className="space-y-6">
              
              <Card className="bg-card text-card-foreground border border-border shadow-md">
                <CardContent className="p-6 md:p-8 flex items-center gap-4">
                  <div className="p-4 bg-muted rounded-full shrink-0">
                    <TrendingUp className="w-8 h-8 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">
                      {results.winner} wins by {results.winnerValue}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Investing exactly the same total amount, {results.winner} generates {results.diffPercent}% more wealth over {years} years.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                
                {/* Lumpsum Card */}
                <Card className={`border-2 ${results.winner === "Lumpsum" ? "border-emerald-500 shadow-emerald-500/10" : "border-border"} relative overflow-hidden`}>
                  {results.winner === "Lumpsum" && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>}
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg flex justify-between items-center">
                      Option A: Lumpsum
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Invest all {format(Number(totalCapital))} today.</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Final Maturity Value</div>
                      <div className="text-3xl font-extrabold text-foreground">{results.lumpsumMaturity}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Invested:</span>
                        <span className="font-semibold">{format(Number(totalCapital))}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-muted-foreground">Wealth Gained:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{results.lumpsumProfit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SIP Card */}
                <Card className={`border-2 ${results.winner === "SIP" ? "border-emerald-500 shadow-emerald-500/10" : "border-border"} relative overflow-hidden`}>
                  {results.winner === "SIP" && <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>}
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-lg flex justify-between items-center">
                      Option B: SIP
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Invest {format(Math.round(results.monthlySip))} every month.</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Final Maturity Value</div>
                      <div className="text-3xl font-extrabold text-foreground">{results.sipMaturity}</div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border/60">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Total Invested:</span>
                        <span className="font-semibold">{format(Number(totalCapital))}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-muted-foreground">Wealth Gained:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{results.sipProfit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-muted-foreground border-dashed bg-muted/20">
              Enter valid values to see the comparison.
            </Card>
          )}
        </div>
      </div>

      <CalculatorContent>
        <h2>SIP vs Lumpsum: The Ultimate Showdown</h2>
        <p>A SIP vs Lumpsum Calculator helps you decide the most profitable way to deploy a large amount of cash. If you just received an inheritance, a massive bonus, or sold a property, you face a critical dilemma: Should you invest all the money into the stock market today (Lumpsum), or should you hold it in a bank account and drip-feed it into the market slowly every month (SIP)?</p>
        
        <h2>Why Lumpsum Usually Wins</h2>
        <p>Mathematically, if the stock market goes up over the long term, Lumpsum investing will beat SIP investing roughly 70% of the time. This is because of a principle called <strong>Time in the Market</strong>. When you invest via Lumpsum, 100% of your capital begins compounding from Day 1. When you SIP, your money sits in a low-interest bank account waiting to be deployed, missing out on months or years of stock market gains.</p>

        <h3>When SIP (Cost Averaging) Makes Sense</h3>
        <p>Despite the mathematical superiority of Lumpsum, SIP (often called Dollar Cost Averaging in the US) is incredibly valuable for two reasons:</p>
        <ul>
          <li><strong>Psychological Safety:</strong> If you invest {format(Number(totalCapital))} today and the market crashes 20% tomorrow, it is psychologically devastating. Dripping the money in over 12 months prevents you from panic-selling.</li>
          <li><strong>No Existing Capital:</strong> If you don't actually have a massive pile of cash, but rather earn a monthly salary, SIP is your only option. You cannot lumpsum money you haven't earned yet!</li>
        </ul>

        <h2>The Risk of "Timing the Market"</h2>
        <p>Many investors try to hold their lumpsum cash, waiting for a "market crash" so they can buy at the bottom. Studies overwhelmingly show that investors who wait for crashes end up losing far more money (via missed compounding growth) than they ever save by buying the dip. The famous saying holds true: <em>Time in the market beats timing the market.</em></p>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Compares FV of SIP vs FV of Lumpsum compounding</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "How long should I spread my SIP if I have a large lump sum?",
          answer: "If you are terrified of a market crash, financial advisors usually recommend spreading your lumpsum via an STP (Systematic Transfer Plan) or SIP over a period of 6 to 12 months. Taking longer than 12 months usually results in a severe 'cash drag' that kills your returns."
        },
        {
          question: "Does this calculator account for taxes?",
          answer: "No. This calculator provides the gross pre-tax maturity value. Remember that in most jurisdictions, long-term capital gains are taxed much more favorably than short-term gains or bank interest."
        },
        {
          question: "Can I do both?",
          answer: "Absolutely. The ideal strategy for most salaried individuals is to set up a permanent, non-stop monthly SIP from their paycheck. Then, whenever they receive an annual bonus or tax refund, they immediately inject it into the market as a Lumpsum."
        }
      ,
        {
          question: "Does SIP always beat Lumpsum?",
          answer: "No. In a consistently rising bull market, Lumpsum wins because your entire money is working for you from day one. SIP only wins during volatile or falling markets."
        },
        {
          question: "Should I split my bonus into an SIP?",
          answer: "If you receive a large bonus and fear a market crash, you can put it in a Liquid Fund and run a Systematic Transfer Plan (STP) into an equity fund over 6-12 months."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("sip-vs-lumpsum")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "SIP vs Lumpsum Calculator",
          description: "Mathematically compare the returns of investing a lump sum versus dollar-cost averaging via an SIP."
        }} 
      />
    </CalculatorLayout>
  );
}

