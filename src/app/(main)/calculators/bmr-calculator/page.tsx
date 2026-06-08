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

const selectClass = "flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

export default function BMRCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  
  // Metric state
  const [cm, setCm] = useState("175");
  const [kg, setKg] = useState("75");
  
  // Imperial state
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [lbs, setLbs] = useState("165");

  const [activity, setActivity] = useState("1.2");

  const resultData = useMemo(() => {
    let weight = 0;
    let height = 0;
    
    if (unitSystem === "metric") {
      weight = Number(kg);
      height = Number(cm);
    } else {
      weight = Number(lbs) * 0.453592; // lbs to kg
      height = ((Number(feet) * 12) + Number(inches)) * 2.54; // inches to cm
    }

    const a = Number(age);

    if (weight <= 0 || height <= 0 || a <= 0) return null;

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * a);
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * Number(activity);

    return { 
      bmr: Math.round(bmr), 
      tdee: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      loss: Math.round(tdee - 500),
      extremeLoss: Math.round(tdee - 1000),
      mildGain: Math.round(tdee + 250),
      gain: Math.round(tdee + 500),
    };
  }, [unitSystem, gender, age, cm, kg, feet, inches, lbs, activity]);

  return (
    <CalculatorLayout title="BMR & TDEE Calculator" description="">
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
                  Metric (kg/cm)
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${unitSystem === "imperial" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setUnitSystem("imperial")}
                >
                  Imperial (lbs/ft)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age"
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-12 px-4"
                  />
                </div>
              </div>

              {unitSystem === "metric" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-cm">Height (cm)</Label>
                    <Input 
                      id="height-cm"
                      type="number" 
                      value={cm}
                      onChange={(e) => setCm(e.target.value)}
                      className="w-full h-12 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-kg">Weight (kg)</Label>
                    <Input 
                      id="weight-kg"
                      type="number" 
                      value={kg}
                      onChange={(e) => setKg(e.target.value)}
                      className="w-full h-12 px-4"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-ft">Height (ft)</Label>
                    <Input 
                      id="height-ft"
                      type="number" 
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="w-full h-12 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height-in">Inches</Label>
                    <Input 
                      id="height-in"
                      type="number" 
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="w-full h-12 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input 
                      id="weight-lbs"
                      type="number" 
                      value={lbs}
                      onChange={(e) => setLbs(e.target.value)}
                      className="w-full h-12 px-4"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <div className="relative">
                  <select 
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className={selectClass}
                  >
                    <option value="1.2">Sedentary (little to no exercise)</option>
                    <option value="1.375">Light Activity (1-3 days/week)</option>
                    <option value="1.55">Moderate Activity (3-5 days/week)</option>
                    <option value="1.725">Active (6-7 days/week)</option>
                    <option value="1.9">Very Active (physical job or training)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Your Calorie Needs</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 flex-1 flex flex-col">
              {!resultData ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm lg:text-base">
                  Enter your stats to see results.
                </div>
              ) : (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl text-center border">
                      <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">BMR</div>
                      <div className="text-3xl font-bold text-foreground">{resultData.bmr}</div>
                      <div className="text-xs text-muted-foreground mt-1">calories/day</div>
                    </div>
                    <div className="bg-primary/10 border-primary/20 p-4 rounded-xl text-center border">
                      <div className="text-xs text-primary mb-1 uppercase tracking-wider font-semibold">Maintenance (TDEE)</div>
                      <div className="text-3xl font-bold text-primary">{resultData.tdee}</div>
                      <div className="text-xs text-primary/70 mt-1">calories/day</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weight Loss</h4>
                    <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
                      <span className="text-sm">Mild Loss (0.5 lb/wk)</span>
                      <span className="font-semibold">{resultData.mildLoss} cal</span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-primary/10">
                      <span className="text-sm font-medium">Standard Loss (1 lb/wk)</span>
                      <span className="font-bold text-primary">{resultData.loss} cal</span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
                      <span className="text-sm">Extreme Loss (2 lb/wk)</span>
                      <span className="font-semibold">{resultData.extremeLoss} cal</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Weight Gain</h4>
                    <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-primary/10">
                      <span className="text-sm font-medium">Standard Gain (1 lb/wk)</span>
                      <span className="font-bold text-primary">{resultData.gain} cal</span>
                    </div>
                  </div>

                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is BMR and TDEE?</h2>
        <p><strong>BMR (Basal Metabolic Rate)</strong> is the number of calories your body burns at rest just to keep you alive (breathing, circulating blood, cellular growth). <strong>TDEE (Total Daily Energy Expenditure)</strong> is an estimate of how many calories you burn per day when exercise and daily activity are taken into account.</p>
        
        <h2>How Does the BMR Calculator Work?</h2>
        <p>Our calculator uses your age, gender, height, and weight to determine your base BMR using the Mifflin-St Jeor equation. It then applies an activity multiplier based on how active you are during the week to calculate your true Maintenance Calories (TDEE). From there, we provide safe caloric targets for weight loss or weight gain.</p>

        <h3>The Mifflin-St Jeor Equation</h3>
        <p>The core engine behind this calculator relies on the Mifflin-St Jeor Equation, which is currently considered the most accurate formula by the American Dietetic Association. The formula is:</p>
        <div className="bg-muted p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto whitespace-nowrap">
          <p>Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5</p>
          <p>Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161</p>
          <p className="mt-2">TDEE = BMR × Activity Multiplier</p>
        </div>

        <h3>Practical Example</h3>
        <p>Let's assume you are a 30-year-old male, weighing 75 kg, and 175 cm tall, who works out 3-5 days a week (Moderate Activity multiplier of 1.55).</p>
        <ul>
          <li><strong>Step 1:</strong> Calculate BMR: (10 × 75) + (6.25 × 175) - (5 × 30) + 5 = <strong>1,699 calories</strong></li>
          <li><strong>Step 2:</strong> Calculate TDEE: 1,699 × 1.55 = <strong>2,633 calories</strong></li>
        </ul>
        <p>If this person wants to lose 1 pound per week (a 500-calorie daily deficit), their target calorie intake would be <strong>2,133 calories/day</strong>.</p>

        <h2>Major Benefits of Calculating Your BMR</h2>
        <ul>
          <li><strong>Precision Dieting:</strong> Stop guessing how much you should eat. TDEE gives you an exact mathematical baseline for your diet.</li>
          <li><strong>Safe Weight Loss:</strong> Ensure you are not dropping your calories dangerously low (below your BMR), which can crash your metabolism.</li>
          <li><strong>Muscle Gain:</strong> To build muscle, you need to be in a caloric surplus. Knowing your TDEE ensures you eat enough to grow without gaining excessive fat.</li>
        </ul>
      
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Can I eat less than my BMR to lose weight faster?",
          answer: "It is highly discouraged to eat below your BMR without medical supervision. Your BMR represents the absolute minimum energy required for your organs to function. Eating below this can lead to muscle loss, hormonal imbalances, and metabolic slowdown."
        },
        {
          question: "How accurate is the Mifflin-St Jeor equation?",
          answer: "While it is the most accurate population-level formula available, it is still an estimate. Individual metabolisms can vary by 10-15% depending on genetics, muscle mass, and medical conditions."
        },
        {
          question: "Why does gender matter in BMR?",
          answer: "Men generally have a lower body fat percentage and more muscle mass than women of the exact same weight and height. Since muscle burns more calories at rest than fat, men typically have a slightly higher BMR."
        }
      ,
        {
          question: "What is the difference between BMR and RMR?",
          answer: "Basal Metabolic Rate (BMR) measures calories burned for life-sustaining functions. Resting Metabolic Rate (RMR) also includes calories burned during very light daily activities like eating and shivering."
        },
        {
          question: "How can I increase my BMR?",
          answer: "The most effective way to permanently increase your BMR is by building muscle mass. Muscle tissue is metabolically active and burns more calories at rest than fat tissue."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("bmr-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "BMR & TDEE Calculator",
          description: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to find your exact calorie needs for weight loss, maintenance, or muscle gain."
        }} 
      />
    </CalculatorLayout>
  );
}

