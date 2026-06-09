"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function DateTimeCalculatorPage() {
  const [d1, setD1] = useState(() => new Date().toISOString().split("T")[0]);
  const [d2, setD2] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [addYears, setAddYears] = useState("");
  const [addMonths, setAddMonths] = useState("");
  const [addDays, setAddDays] = useState("30");
  const [op, setOp] = useState<"add"|"subtract">("add");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("date-time-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const durationData = useMemo(() => {
    if (!d1 || !d2) return null;
    const start = new Date(d1);
    const end = new Date(d2);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (start > end) {
      years = start.getFullYear() - end.getFullYear();
      months = start.getMonth() - end.getMonth();
      days = start.getDate() - end.getDate();
    }

    if (days < 0) {
      months--;
      const prevMonth = new Date((start > end ? start : end).getFullYear(), (start > end ? start : end).getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { days: diffDays, y: years, m: months, d: days };
  }, [d1, d2]);

  const calcDateData = useMemo(() => {
    if (!baseDate) return null;
    const base = new Date(baseDate);
    if (isNaN(base.getTime())) return null;

    const y = Number(addYears) || 0;
    const m = Number(addMonths) || 0;
    const d = Number(addDays) || 0;

    const result = new Date(base);
    if (op === "add") {
      result.setFullYear(result.getFullYear() + y);
      result.setMonth(result.getMonth() + m);
      result.setDate(result.getDate() + d);
    } else {
      result.setFullYear(result.getFullYear() - y);
      result.setMonth(result.getMonth() - m);
      result.setDate(result.getDate() - d);
    }

    return result.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [baseDate, addYears, addMonths, addDays, op]);

  return (
    <CalculatorLayout title="Date & Time Calculator" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 max-w-6xl mx-auto">
        
        {/* Mode 1 */}
        <Card className="bg-card shadow-lg border border-border flex flex-col">
          <div className="p-4 lg:p-6 border-b bg-muted/30">
            <h3 className="font-semibold text-lg">Duration Between Dates</h3>
          </div>
          <CardContent className="p-4 lg:p-6 space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="d1">Start Date</Label>
                <Input type="date" id="d1" value={d1} onChange={e => setD1(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d2">End Date</Label>
                <Input type="date" id="d2" value={d2} onChange={e => setD2(e.target.value)} className="h-12" />
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <div className="bg-muted/10 border p-6 rounded-xl text-center">
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">Total Duration</div>
                {durationData ? (
                  <>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {durationData.days} <span className="text-lg text-muted-foreground font-medium">days</span>
                    </div>
                    <div className="text-sm font-medium">
                      (or {durationData.y} years, {durationData.m} months, {durationData.d} days)
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Select valid dates</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode 2 */}
        <Card className="bg-card shadow-lg border border-border flex flex-col">
          <div className="p-4 lg:p-6 border-b bg-muted/30">
            <h3 className="font-semibold text-lg">Add or Subtract from Date</h3>
          </div>
          <CardContent className="p-4 lg:p-6 space-y-6 flex-1 flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="baseDate">Start Date</Label>
              <Input type="date" id="baseDate" value={baseDate} onChange={e => setBaseDate(e.target.value)} className="h-12" />
            </div>

            <div className="flex bg-muted/50 p-1 rounded-lg">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${op === "add" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setOp("add")}
              >
                Add To Date
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${op === "subtract" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setOp("subtract")}
              >
                Subtract From Date
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" placeholder="0" value={addYears} onChange={e => setAddYears(e.target.value)} className="h-12 text-center" />
              </div>
              <div className="space-y-2">
                <Label>Months</Label>
                <Input type="number" placeholder="0" value={addMonths} onChange={e => setAddMonths(e.target.value)} className="h-12 text-center" />
              </div>
              <div className="space-y-2">
                <Label>Days</Label>
                <Input type="number" placeholder="0" value={addDays} onChange={e => setAddDays(e.target.value)} className="h-12 text-center" />
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <div className="bg-muted/10 border p-6 rounded-xl text-center">
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">New Date</div>
                <div className="text-2xl font-bold text-primary min-h-[32px]">
                  {calcDateData || "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <CalculatorContent>
        <h2>What is a Date & Time Calculator?</h2>
        <p>A Date & Time Calculator is a utility tool designed to solve complex calendar math. Calculating the exact duration between two dates, or projecting a future date by adding a specific number of days, is notoriously difficult to do mentally because of leap years and varying month lengths.</p>
        
        <h2>How Does It Work?</h2>
        <p>This tool provides two distinct calculation modes to cover all your calendar needs:</p>

        <h3>1. Duration Between Dates</h3>
        <p>This mode answers the question: <em>"How long is it until..."</em> or <em>"How long ago was..."</em>. By selecting a Start Date and an End Date, the engine calculates the exact absolute difference in total days. It also breaks that duration down into human-readable format: Years, Months, and Days.</p>
        
        <h3>2. Add or Subtract from Date</h3>
        <p>This mode answers the question: <em>"What date will it be 90 days from now?"</em>. You select a Base Date, choose whether to add or subtract time, and input any combination of years, months, and days. The engine then perfectly calculates the exact calendar date (including the day of the week) that the jump lands on.</p>

        <h2>Common Uses for Calendar Math</h2>
        <ul>
          <li><strong>Project Management:</strong> Calculate exact deadlines (e.g. "We need this done 45 days from Monday").</li>
          <li><strong>Financial Grace Periods:</strong> Determine the exact day a 30-day grace period on a loan or credit card expires.</li>
          <li><strong>Travel Visas:</strong> Ensure you don't overstay your welcome by calculating the exact 90th day of a tourist visa.</li>
          <li><strong>Event Planning:</strong> Find out exactly how many days remain until a wedding, graduation, or retirement.</li>
        </ul>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Difference = End Date - Start Date</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Does this calculator adjust for Leap Years?",
          answer: "Yes. Our internal calendar engine uses standard international time APIs which perfectly account for February 29th during leap years."
        },
        {
          question: "Can I enter a negative number of days?",
          answer: "There's no need! If you want to go backwards in time, simply use the 'Subtract From Date' toggle in the second calculator."
        },
        {
          question: "Why is the duration difference sometimes 1 day off from my math?",
          answer: "This is often due to whether or not you count the end date. Our calculator measures the exact duration *between* the days (e.g. Monday to Tuesday is exactly 1 day)."
        }
      ,
        {
          question: "Does the calculator account for daylight saving time?",
          answer: "If the dates cross a daylight saving boundary, the exact hour duration will be affected. Standard day counting strictly calculates 24-hour periods."
        },
        {
          question: "What is a Business Day?",
          answer: "Business days generally exclude weekends (Saturday and Sunday) and official public holidays. This is crucial for banking and shipping estimates."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("date-time-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Date & Time Calculator",
          description: "Calculate the exact duration between two dates, or add/subtract days from a date to find a future deadline."
        }} 
      />
    </CalculatorLayout>
  );
}

