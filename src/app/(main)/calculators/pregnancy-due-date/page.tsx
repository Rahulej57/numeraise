"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";

export default function PregnancyDueDatePage() {
  const [lmp, setLmp] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [cycle, setCycle] = useState("28");

  const pregnancyData = useMemo(() => {
    if (!lmp || !cycle || isNaN(Number(cycle))) return null;

    const cycleLength = Number(cycle);
    if (cycleLength < 20 || cycleLength > 45) return { error: "Cycle length must be between 20 and 45 days." };

    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;

    // Standard gestation is 280 days for a 28-day cycle.
    // Adjust by cycle length difference.
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280 + (cycleLength - 28));

    const conceptionDate = new Date(lmpDate);
    conceptionDate.setDate(conceptionDate.getDate() + 14 + (cycleLength - 28));

    // Current progress
    const today = new Date();
    const totalDays = 280 + (cycleLength - 28);
    const daysPassed = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let weeksPregnant = Math.floor(daysPassed / 7);
    let daysPregnant = daysPassed % 7;
    let trimester = 1;

    let error = "";
    if (daysPassed < 0) {
      error = "LMP cannot be in the future.";
    } else if (daysPassed > totalDays + 14) {
      error = "Based on this LMP, the due date has already passed significantly.";
    }

    if (weeksPregnant < 13) trimester = 1;
    else if (weeksPregnant < 27) trimester = 2;
    else trimester = 3;

    let progress = (daysPassed / totalDays) * 100;
    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    return {
      dueDate: dueDate.toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
      conceptionDate: conceptionDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      weeksPregnant,
      daysPregnant,
      trimester,
      progress,
      error
    };

  }, [lmp, cycle]);

  return (
    <CalculatorLayout title="Pregnancy Due Date Calculator" description="">
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="lmp">First Day of Last Period (LMP)</Label>
                <Input 
                  id="lmp"
                  type="date" 
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                  className="w-full h-12 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle">Average Cycle Length (Days)</Label>
                <Input 
                  id="cycle"
                  type="number" 
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                  className="w-full h-12 px-4"
                />
                <p className="text-xs text-muted-foreground mt-1">Usually 28 days.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full flex flex-col min-h-[300px]">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Your Pregnancy Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 flex-1 flex flex-col justify-center text-center">
              {!pregnancyData ? (
                <div className="text-muted-foreground text-sm lg:text-base">
                  Enter your details to calculate your due date.
                </div>
              ) : pregnancyData.error ? (
                <div className="text-destructive font-medium">
                  {pregnancyData.error}
                </div>
              ) : (
                <div className="space-y-6">
                  
                  <div>
                    <div className="text-muted-foreground text-sm font-medium mb-1">Estimated Due Date</div>
                    <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
                      {pregnancyData.dueDate}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-xl border">
                    <div className="grid grid-cols-2 gap-4 divide-x">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Current Progress</div>
                        <div className="text-xl font-bold">{pregnancyData.weeksPregnant}w {pregnancyData.daysPregnant}d</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Trimester</div>
                        <div className="text-xl font-bold">{pregnancyData.trimester}{pregnancyData.trimester===1?'st':pregnancyData.trimester===2?'nd':'rd'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${pregnancyData.progress || 0}%` }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 text-right">{Math.round(pregnancyData.progress || 0)}% Complete</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/10 p-3 rounded border">
                    Estimated Conception Date: <span className="font-semibold text-foreground">{pregnancyData.conceptionDate}</span>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is a Pregnancy Due Date Calculator?</h2>
        <p>A Pregnancy Due Date Calculator is a medical forecasting tool used by obstetricians and expectant parents to estimate the Expected Date of Delivery (EDD). Since only about 4-5% of babies are born exactly on their due date, this date serves as an essential anchor point for tracking fetal development and scheduling medical checkups.</p>
        
        <h2>How Does the Due Date Calculator Work?</h2>
        <p>Our calculator primarily relies on Naegele's Rule, which is the standard medical formula used worldwide. By inputting the First Day of your Last Menstrual Period (LMP) and your average cycle length, the engine calculates the exact date you will hit the 40-week gestation mark.</p>

        <h3>The Naegele's Rule Mathematical Formula</h3>
        <p>Naegele's Rule assumes a standard 28-day menstrual cycle, with ovulation occurring on day 14. The formula is:</p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
          <p>EDD = LMP Date + 7 days - 3 months + 1 year</p>
          <p className="mt-2 text-sm text-muted-foreground">(Or simply: LMP + 280 days)</p>
        </div>
        <p>If your average cycle is longer or shorter than 28 days, our calculator automatically adjusts the 280-day baseline to account for the delayed or early ovulation, giving you a mathematically personalized result.</p>

        <h2>Major Benefits of Calculating Your Due Date</h2>
        <ul>
          <li><strong>Medical Tracking:</strong> Allows your doctor to accurately measure fetal growth against standard percentile charts for a specific gestational age.</li>
          <li><strong>Maternity Leave Planning:</strong> Gives you a hard date to provide HR when organizing financial and professional arrangements.</li>
          <li><strong>Trimester Milestones:</strong> Knowing your exact weeks and days pregnant helps you understand the physiological changes happening to your body week-to-week.</li>
        </ul>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Why do doctors measure pregnancy from the Last Menstrual Period (LMP)?",
          answer: "Because it's usually impossible to know the exact day of conception. The first day of the last period is a highly visible, trackable biological event that doctors can use as a reliable starting anchor."
        },
        {
          question: "Is my due date guaranteed?",
          answer: "No. A 'due date' is simply an estimate of when you will be 40 weeks pregnant. A pregnancy is considered 'full term' anywhere between 37 and 42 weeks."
        },
        {
          question: "What if I know my exact conception date?",
          answer: "If you know your exact conception date (such as via IVF), simply add exactly 266 days to the conception date to find your true medical due date."
        }
      ,
        {
          question: "Why is a pregnancy calculated as 40 weeks?",
          answer: "Medical professionals date pregnancies from the first day of the last menstrual period (LMP), which is usually about two weeks before conception actually occurs."
        },
        {
          question: "Is the due date highly accurate?",
          answer: "No, only about 4% to 5% of babies are born on their exact calculated due date. It is simply an estimate. Delivery anytime between 37 and 42 weeks is considered normal."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("pregnancy-due-date")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Pregnancy Due Date Calculator",
          description: "Calculate your estimated due date, conception date, and current trimester based on your Last Menstrual Period."
        }} 
      />
    </CalculatorLayout>
  );
}

