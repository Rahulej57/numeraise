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

const selectClass = "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

export default function SalaryCalculatorPage() {
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState("50000");
  const [period, setPeriod] = useState("Annually");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [holidays, setHolidays] = useState("10");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("salary-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const salaryData = useMemo(() => {
    const a = Number(amount);
    const hpw = Number(hoursPerWeek);
    const dpw = Number(daysPerWeek);
    const h = Number(holidays);

    if (isNaN(a) || isNaN(hpw) || isNaN(dpw) || isNaN(h) || a <= 0 || hpw <= 0 || dpw <= 0) return null;

    // Standard working weeks in a year
    const weeksPerYear = 52;
    // Total working days per year
    const totalWorkingDays = (weeksPerYear * dpw) - h;
    const totalWorkingHours = totalWorkingDays * (hpw / dpw);

    let annual = 0;

    if (period === "Hourly") {
      annual = a * totalWorkingHours;
    } else if (period === "Daily") {
      annual = a * totalWorkingDays;
    } else if (period === "Weekly") {
      // assumes paid for 52 weeks
      annual = a * weeksPerYear; 
    } else if (period === "Bi-Weekly") {
      annual = a * 26;
    } else if (period === "Semi-Monthly") {
      annual = a * 24;
    } else if (period === "Monthly") {
      annual = a * 12;
    } else {
      annual = a;
    }

    const hourly = annual / totalWorkingHours;
    const daily = annual / totalWorkingDays;
    const weekly = annual / weeksPerYear;
    const biWeekly = annual / 26;
    const semiMonthly = annual / 24;
    const monthly = annual / 12;

    const f = (val: number) => format(val);

    return {
      hourly: f(hourly),
      daily: f(daily),
      weekly: f(weekly),
      biWeekly: f(biWeekly),
      semiMonthly: f(semiMonthly),
      monthly: f(monthly),
      annual: f(annual),
      totalWorkingHours: Math.round(totalWorkingHours),
      totalWorkingDays: Math.round(totalWorkingDays)
    };
  }, [amount, period, hoursPerWeek, daysPerWeek, holidays]);

  return (
    <CalculatorLayout title="Salary Converter" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">{currency.symbol}</div>
                    <Input 
                      id="amount"
                      type="number" 
                      value={(Number(amount) * currency.rate).toFixed(0)}
                      onChange={(e) => setAmount((Number(e.target.value) / currency.rate).toString())}
                      className="w-full h-12 pl-7 font-medium text-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Pay Period</Label>
                  <div className="relative">
                    <select 
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className={selectClass}
                    >
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Semi-Monthly">Semi-Monthly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Annually">Annually</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Work Schedule</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hpw" className="text-xs">Hours / Week</Label>
                    <Input id="hpw" type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} className="h-10 text-center" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dpw" className="text-xs">Days / Week</Label>
                    <Input id="dpw" type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} className="h-10 text-center" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hol" className="text-xs">Holidays / Year</Label>
                    <Input id="hol" type="number" value={holidays} onChange={e => setHolidays(e.target.value)} className="h-10 text-center" />
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card shadow-lg border border-border h-full flex flex-col overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-4 lg:p-6 lg:pb-4">
              <CardTitle className="text-sm lg:text-xl flex justify-between items-center">
                <span>Salary Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!salaryData ? (
                <div className="p-6 text-center text-muted-foreground">Enter valid inputs.</div>
              ) : (
                <div className="divide-y">
                  <div className="p-4 lg:p-6 flex justify-between items-center bg-primary/5 hover:bg-primary/10 transition-colors">
                    <span className="font-semibold text-muted-foreground">Hourly</span>
                    <span className="text-xl font-bold">{salaryData.hourly}</span>
                  </div>
                  <div className="p-4 lg:p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                    <span className="font-semibold text-muted-foreground">Daily</span>
                    <span className="text-xl font-bold">{salaryData.daily}</span>
                  </div>
                  <div className="p-4 lg:p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                    <span className="font-semibold text-muted-foreground">Weekly</span>
                    <span className="text-xl font-bold">{salaryData.weekly}</span>
                  </div>
                  <div className="p-4 lg:p-6 flex justify-between items-center hover:bg-muted/50 transition-colors hidden sm:flex">
                    <span className="font-semibold text-muted-foreground">Bi-Weekly</span>
                    <span className="text-xl font-bold">{salaryData.biWeekly}</span>
                  </div>
                  <div className="p-4 lg:p-6 flex justify-between items-center hover:bg-muted/50 transition-colors">
                    <span className="font-semibold text-muted-foreground">Monthly</span>
                    <span className="text-xl font-bold">{salaryData.monthly}</span>
                  </div>
                  <div className="p-4 lg:p-6 flex justify-between items-center bg-muted border-t">
                    <span className="font-semibold uppercase tracking-wider text-sm text-muted-foreground">Annually</span>
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60">{salaryData.annual}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is a Salary Calculator?</h2>
        <p>A salary calculator is an essential employment tool that converts your pay across different time periods. Whether you are paid hourly, daily, weekly, or annually, this tool instantly breaks down your income into all other equivalent frequencies. This is particularly crucial when comparing a salaried job offer to an hourly freelance contract.</p>
        
        <h2>How Does the Salary Converter Work?</h2>
        <p>This calculator relies on standard annualization math. By inputting your base pay amount, pay frequency, and your specific work schedule (hours per week, days per week, and holidays), the engine first calculates your total 'Annual Salary'. From that baseline, it divides the total back down into hourly, daily, weekly, and monthly equivalents.</p>

        <h3>The Conversion Mathematical Formula</h3>
        <p>To convert an hourly wage to an annual salary, the formula relies on the total working hours in a year:</p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
          <p>Annual Salary = Hourly Wage × Total Work Hours Per Year</p>
          <p className="mt-2 text-sm text-muted-foreground">(Total Hours = [Weeks per year × Days per week - Holidays] × Hours per day)</p>
        </div>

        <h2>Common Uses for Salary Conversion</h2>
        <ul>
          <li><strong>Job Hunting:</strong> Instantly compare a $35/hour contract job against a $70,000/year salaried position to see which actually pays more.</li>
          <li><strong>Budgeting:</strong> Convert your annual salary into exact bi-weekly or monthly take-home amounts to accurately plan your rent and expenses.</li>
          <li><strong>Freelance Pricing:</strong> Determine exactly what you need to charge per hour as a freelancer to hit your target annual income goal.</li>
        </ul>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Does this calculator account for income tax?",
          answer: "No, this calculator strictly converts Gross Salary (before taxes). To see exactly how much money you will take home after taxes, use our Income Tax Calculator."
        },
        {
          question: "How many working hours are in a standard year?",
          answer: "A standard full-time US working year is generally considered to be 2,080 hours (40 hours a week × 52 weeks). However, subtracting 10 standard public holidays drops this to 2,000 hours."
        },
        {
          question: "What is the difference between Bi-Weekly and Semi-Monthly?",
          answer: "Bi-Weekly means getting paid every two weeks (26 paychecks per year). Semi-Monthly means getting paid twice a month, usually on the 1st and 15th (24 paychecks per year). Bi-weekly paychecks are slightly smaller, but you get two 'extra' checks a year."
        }
      ,
        {
          question: "Are there 52 weeks in a year?",
          answer: "Actually, there are 52.14 weeks in a standard year (365/7). When calculating weekly salary perfectly accurately, you should divide the annual salary by 52.14."
        },
        {
          question: "Why are bi-weekly and semi-monthly pay periods different?",
          answer: "Bi-weekly means you get paid every two weeks (26 paychecks a year). Semi-monthly means you get paid twice a month, usually on the 1st and 15th (24 paychecks a year)."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("salary-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Salary Calculator",
          description: "Convert your salary between hourly, weekly, monthly, and annual amounts to compare job offers and budget effectively."
        }} 
      />
    </CalculatorLayout>
  );
}

