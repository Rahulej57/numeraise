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
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

const selectClass = "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

export default function BodyFatCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  
  // Metric state (cm, kg)
  const [cm, setCm] = useState("175");
  const [neckCm, setNeckCm] = useState("40");
  const [waistCm, setWaistCm] = useState("90");
  const [hipCm, setHipCm] = useState("100"); // for women
  
  // Imperial state (inches, lbs)
  const [heightIn, setHeightIn] = useState("69");
  const [neckIn, setNeckIn] = useState("15.5");
  const [waistIn, setWaistIn] = useState("35.5");
  const [hipIn, setHipIn] = useState("39.5");

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("body-fat-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const resultData = useMemo(() => {
    let h = 0, n = 0, w = 0, hip = 0;
    
    if (unitSystem === "metric") {
      h = Number(cm);
      n = Number(neckCm);
      w = Number(waistCm);
      hip = Number(hipCm);
    } else {
      h = Number(heightIn) * 2.54;
      n = Number(neckIn) * 2.54;
      w = Number(waistIn) * 2.54;
      hip = Number(hipIn) * 2.54;
    }

    if (h <= 0 || n <= 0 || w <= 0 || (gender === "female" && hip <= 0)) return null;

    let bodyFat = 0;

    // US Navy Method
    if (gender === "male") {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
    }

    if (isNaN(bodyFat) || !isFinite(bodyFat) || bodyFat < 1 || bodyFat > 80) return { error: "Invalid measurements. Please check your inputs." };

    let category = "";
    let color = "";

    // American Council on Exercise (ACE) categorization
    if (gender === "male") {
      if (bodyFat < 6) { category = "Essential fat"; color = "text-blue-500"; }
      else if (bodyFat < 14) { category = "Athletes"; color = "text-emerald-500"; }
      else if (bodyFat < 18) { category = "Fitness"; color = "text-emerald-400"; }
      else if (bodyFat < 25) { category = "Average"; color = "text-amber-500"; }
      else { category = "Obese"; color = "text-rose-500"; }
    } else {
      if (bodyFat < 14) { category = "Essential fat"; color = "text-blue-500"; }
      else if (bodyFat < 21) { category = "Athletes"; color = "text-emerald-500"; }
      else if (bodyFat < 25) { category = "Fitness"; color = "text-emerald-400"; }
      else if (bodyFat < 32) { category = "Average"; color = "text-amber-500"; }
      else { category = "Obese"; color = "text-rose-500"; }
    }

    return { 
      bodyFat: bodyFat.toFixed(1),
      category,
      color
    };
  }, [unitSystem, gender, cm, neckCm, waistCm, hipCm, heightIn, neckIn, waistIn, hipIn]);

  return (
    <CalculatorLayout title="Body Fat Calculator" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              
              <div className="flex bg-muted/50 p-1 rounded-lg">
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${unitSystem === "metric" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setUnitSystem("metric")}
                >
                  Metric (cm)
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${unitSystem === "imperial" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setUnitSystem("imperial")}
                >
                  Imperial (inches)
                </button>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="relative">
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male"|"female")}
                    className={selectClass}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {unitSystem === "metric" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-cm">Height (cm)</Label>
                    <Input id="height-cm" type="number" value={cm} onChange={(e) => setCm(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neck-cm">Neck (cm)</Label>
                    <Input id="neck-cm" type="number" value={neckCm} onChange={(e) => setNeckCm(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist-cm">Waist (cm)</Label>
                    <Input id="waist-cm" type="number" value={waistCm} onChange={(e) => setWaistCm(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  {gender === "female" && (
                    <div className="space-y-2">
                      <Label htmlFor="hip-cm">Hip (cm)</Label>
                      <Input id="hip-cm" type="number" value={hipCm} onChange={(e) => setHipCm(e.target.value)} className="w-full h-12 px-4" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-in">Height (inches)</Label>
                    <Input id="height-in" type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neck-in">Neck (inches)</Label>
                    <Input id="neck-in" type="number" value={neckIn} onChange={(e) => setNeckIn(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist-in">Waist (inches)</Label>
                    <Input id="waist-in" type="number" value={waistIn} onChange={(e) => setWaistIn(e.target.value)} className="w-full h-12 px-4" />
                  </div>
                  {gender === "female" && (
                    <div className="space-y-2">
                      <Label htmlFor="hip-in">Hip (inches)</Label>
                      <Input id="hip-in" type="number" value={hipIn} onChange={(e) => setHipIn(e.target.value)} className="w-full h-12 px-4" />
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full flex flex-col min-h-[300px]">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Body Fat Percentage</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 flex-1 flex flex-col justify-center items-center text-center">
              {!resultData ? (
                <div className="text-muted-foreground text-sm lg:text-base">
                  Enter your measurements to calculate your body fat.
                </div>
              ) : 'error' in resultData ? (
                <div className="text-destructive font-medium">
                  {resultData.error}
                </div>
              ) : (
                <>
                  <div className="text-muted-foreground text-sm font-medium mb-2">Estimated Body Fat</div>
                  <div className={`text-6xl lg:text-8xl font-extrabold tracking-tight mb-4 ${resultData.color}`}>
                    {resultData.bodyFat}<span className="text-3xl lg:text-5xl">%</span>
                  </div>
                  <div className={`text-xl lg:text-2xl font-bold px-4 py-1.5 rounded-full bg-muted/50 ${resultData.color}`}>
                    {resultData.category}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is Body Fat Percentage?</h2>
        <p>Your Body Fat Percentage is the total mass of fat divided by your total body mass, multiplied by 100. Unlike BMI, which only looks at height and weight, body fat percentage provides a much more accurate picture of your overall fitness and health by distinguishing between fat mass and lean muscle mass.</p>
        
        <h2>How Does the Body Fat Calculator Work?</h2>
        <p>This calculator uses the highly regarded <strong>U.S. Navy Tape Measure Method</strong>. By taking simple circumference measurements of your neck, waist, and hips (for women), the formula can estimate your body fat percentage with surprising accuracy without the need for expensive DEXA scans or calipers.</p>

        <h3>The U.S. Navy Mathematical Formula</h3>
        <p>The core engine behind this calculator relies on logarithmic equations developed by the U.S. Naval Health Research Center. The formulas are:</p>
        <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono overflow-x-auto whitespace-nowrap">
          <p>Men: 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450</p>
          <p>Women: 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Note: The formula above assumes measurements are in inches. Our calculator automatically handles metric conversions behind the scenes.</p>

        <h2>Major Benefits of Tracking Body Fat</h2>
        <ul>
          <li><strong>True Fitness Tracking:</strong> When losing weight, the scale might not move because you are building muscle. Tracking body fat ensures you are losing fat, not just water or muscle weight.</li>
          <li><strong>Better Health Indicator:</strong> A high body fat percentage is a better predictor of cardiovascular disease and metabolic syndrome than BMI alone.</li>
          <li><strong>Realistic Goal Setting:</strong> Knowing your lean body mass allows you to set scientifically realistic goals for your dream physique.</li>
        </ul>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "How accurate is the U.S. Navy Tape Measure method?",
          answer: "It is generally accurate within 3-4% of a DEXA scan (the gold standard). It is considered the most accurate method you can do at home for free, making it excellent for tracking week-to-week progress."
        },
        {
          question: "How should I measure my waist and neck?",
          answer: "For men, measure the neck just below the larynx (Adam's apple) and the waist at the navel. For women, measure the waist at the narrowest point and the hips at the widest point. Do not pull the tape too tight."
        },
        {
          question: "What is 'Essential Fat'?",
          answer: "Essential fat is the absolute minimum amount of fat required for your body to function properly, protect internal organs, and regulate hormones. Dropping below essential fat levels (usually <5% for men and <13% for women) is extremely dangerous."
        }
      ,
        {
          question: "Is the U.S. Navy method perfectly accurate?",
          answer: "No, tape measure methods generally have a 3-4% margin of error. The only perfectly accurate methods are DEXA scans or hydrostatic weighing."
        },
        {
          question: "Why is essential fat different for men and women?",
          answer: "Women naturally carry more essential body fat (around 10-13%) compared to men (2-5%) to support reproductive functions and hormonal balance."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("body-fat-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Body Fat Calculator",
          description: "Estimate your body fat percentage using the U.S. Navy Tape Measure method to get an accurate view of your health and fitness."
        }} 
      />
    </CalculatorLayout>
  );
}

