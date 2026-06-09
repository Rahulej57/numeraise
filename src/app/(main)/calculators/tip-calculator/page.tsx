"use client";

import { useState, useMemo } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function TipCalculatorPage() {
  const { format, currency } = useCurrency();
  const [bill, setBill] = useState("100");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("tip-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const tipData = useMemo(() => {
    const b = Number(bill);
    const p = Number(tipPercent);
    const n = Math.max(1, Math.floor(Number(people)));

    if (isNaN(b) || isNaN(p) || isNaN(n) || b < 0 || p < 0) return null;

    const totalTip = b * (p / 100);
    const totalBill = b + totalTip;
    
    const tipPerPerson = totalTip / n;
    const billPerPerson = b / n;
    const totalPerPerson = totalBill / n;

    const f = (val: number) => format(val);

    return {
      totalTip: f(totalTip),
      totalBill: f(totalBill),
      tipPerPerson: f(tipPerPerson),
      billPerPerson: f(billPerPerson),
      totalPerPerson: f(totalPerPerson),
      n
    };
  }, [bill, tipPercent, people]);

  return (
    <CalculatorLayout title="Tip & Split Calculator" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="bill">Bill Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground font-medium">{currency.symbol}</div>
                  <Input 
                    id="bill"
                    type="number" 
                    step="0.01"
                    value={Number(bill) * currency.rate}
                    onChange={(e) => setBill((Number(e.target.value) / currency.rate).toString())}
                    className="w-full h-14 pl-8 text-lg font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tip">Tip Percentage</Label>
                  <span className="text-primary font-bold">{tipPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="30" step="1" 
                  value={tipPercent} 
                  onChange={(e) => setTipPercent(e.target.value)} 
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-4">
                  {[10, 15, 18, 20, 25].map(pct => (
                    <button 
                      key={pct}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${Number(tipPercent) === pct ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/30 hover:bg-muted'}`}
                      onClick={() => setTipPercent(String(pct))}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="people">Split Among</Label>
                  <span className="font-bold">{people} {Number(people) === 1 ? 'Person' : 'People'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    className="w-12 h-12 rounded-full border bg-muted/30 hover:bg-muted text-xl flex items-center justify-center font-bold"
                    onClick={() => setPeople(String(Math.max(1, Number(people) - 1)))}
                  >-</button>
                  <Input 
                    id="people"
                    type="number" 
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className="h-12 text-center text-lg font-medium flex-1"
                  />
                  <button 
                    className="w-12 h-12 rounded-full border bg-muted/30 hover:bg-muted text-xl flex items-center justify-center font-bold"
                    onClick={() => setPeople(String(Number(people) + 1))}
                  >+</button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full flex flex-col min-h-[300px]">
            <CardContent className="p-6 lg:p-8 flex-1 flex flex-col justify-center">
              {!tipData ? (
                <div className="text-muted-foreground text-center">
                  Enter bill amount to see split.
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Per Person */}
                  <div className="flex justify-between items-center border-b pb-8">
                    <div>
                      <div className="text-muted-foreground font-medium">Total Per Person</div>
                      <div className="text-sm text-muted-foreground/80 mt-1">
                        (Bill: {tipData.billPerPerson} + Tip: {tipData.tipPerPerson})
                      </div>
                    </div>
                    <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">
                      {tipData.totalPerPerson}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground">Total Bill</div>
                      <div className="text-xl font-bold">{tipData.totalBill}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground">Total Tip</div>
                      <div className="text-xl font-bold">{tipData.totalTip}</div>
                    </div>
                    {tipData.n > 1 && (
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-muted-foreground">Split Among</div>
                        <div className="text-lg font-medium">{tipData.n} People</div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is a Tip Calculator?</h2>
        <p>A Tip & Split Calculator is an everyday dining utility designed to instantly calculate the exact gratuity on a restaurant bill and automatically divide the total cost evenly among a group of people. It eliminates the social awkwardness and mental math associated with splitting a check at the end of a meal.</p>
        
        <h2>How Does It Work?</h2>
        <p>The calculator requires three inputs: the total bill amount, your desired tip percentage, and the number of people splitting the bill. The engine first calculates the absolute tip amount. It then adds this to the original bill to find the 'Total Bill'. Finally, it divides that total by the number of people to give you the exact 'Per Person' contribution.</p>

        <h3>The Tipping Mathematical Formula</h3>
        <p>The underlying math is straightforward percentage addition followed by division:</p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Total Tip = Bill Amount × (Tip Percentage / 100)</p>
          <p className="mt-2 text-sm text-muted-foreground">Per Person = (Bill Amount + Total Tip) / Number of People</p>
        </div>

        <h2>Common Uses for a Tip Calculator</h2>
        <ul>
          <li><strong>Dining Out:</strong> Quickly figuring out a standard 18% or 20% tip at a restaurant without struggling with mental math after a few drinks.</li>
          <li><strong>Group Events:</strong> Easily splitting the cost of a large pizza delivery, an Uber ride, or a shared Airbnb among friends.</li>
          <li><strong>Service Industry:</strong> Calculating appropriate tips for hairdressers, massage therapists, delivery drivers, and tour guides.</li>
        </ul>
      
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Should I calculate the tip before or after tax?",
          answer: "Etiquette experts generally agree that you should tip based on the pre-tax subtotal. However, it has become common practice in the US to simply tip on the final post-tax total for the sake of simplicity."
        },
        {
          question: "What is the standard tipping rate?",
          answer: "In the United States, 15% is considered minimum for average service, 18-20% is standard for good service, and 25%+ is for exceptional service. In many European and Asian countries, tipping is either not expected or a flat 10%."
        },
        {
          question: "How do I split the bill if someone ordered way more food?",
          answer: "This calculator is designed for an even split (where everyone pays the same amount). If one person ordered a $50 steak and everyone else ordered $10 salads, you should manually calculate their individual totals instead of splitting evenly."
        }
      ,
        {
          question: "Should I tip on the pre-tax or post-tax amount?",
          answer: "Proper etiquette dictates calculating the tip on the pre-tax subtotal. Tipping on the post-tax total means you are unnecessarily tipping on government taxes."
        },
        {
          question: "Is a service charge the same as a tip?",
          answer: "No. A mandatory service charge added to your bill goes entirely to the restaurant management, who may or may not distribute it to the staff. A tip goes directly to the server."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("tip-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Tip & Split Calculator",
          description: "Instantly calculate gratuity and divide a restaurant bill evenly among friends with our free tip calculator."
        }} 
      />
    </CalculatorLayout>
  );
}

