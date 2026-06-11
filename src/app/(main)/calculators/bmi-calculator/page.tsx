'use client';

import { useState, useMemo } from 'react';
import { CalculatorLayout } from '@/components/calculators/calculator-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from '@/config/calculators';

export default function BMICalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find((c) => c.href.includes('bmi-calculator'));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  // Metric state
  const [cm, setCm] = useState('170');
  const [kg, setKg] = useState('70');

  // Imperial state
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [lbs, setLbs] = useState('154');

  const bmiData = useMemo(() => {
    let bmiValue = 0;

    if (unitSystem === 'metric') {
      const heightInMeters = Number(cm) / 100;
      const weightInKg = Number(kg);
      if (heightInMeters > 0 && weightInKg > 0) {
        bmiValue = weightInKg / (heightInMeters * heightInMeters);
      }
    } else {
      const totalInches = Number(feet) * 12 + Number(inches);
      const weightInLbs = Number(lbs);
      if (totalInches > 0 && weightInLbs > 0) {
        bmiValue = (weightInLbs / (totalInches * totalInches)) * 703;
      }
    }

    if (bmiValue <= 0 || isNaN(bmiValue)) return null;

    let category = '';
    let color = '';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      category = 'Normal weight';
      color = 'text-emerald-500';
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      category = 'Overweight';
      color = 'text-amber-500';
    } else {
      category = 'Obese';
      color = 'text-rose-500';
    }

    return { value: bmiValue.toFixed(1), category, color };
  }, [unitSystem, cm, kg, feet, inches, lbs]);

  const relatedCalcs = getRelatedCalculators('bmi-calculator');
  return (
    <CalculatorLayout
      title="BMI Calculator - Calculate Your Body Mass Index"
      description=""
      icon={calculatorIcon ?? undefined}
    >
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              <div className="flex bg-muted/50 p-1 rounded-lg">
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setUnitSystem('metric')}
                >
                  Metric (kg/cm)
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setUnitSystem('imperial')}
                >
                  Imperial (lbs/ft)
                </button>
              </div>

              {unitSystem === 'metric' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="height-cm">Height (cm)</Label>
                    <Input
                      id="height-cm"
                      type="number"
                      value={cm}
                      onChange={(e) => setCm(e.target.value)}
                      className="w-full h-12 px-4"
                      placeholder="e.g. 170"
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
                      placeholder="e.g. 70"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height-ft">Height (feet)</Label>
                      <Input
                        id="height-ft"
                        type="number"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="w-full h-12 px-4"
                        placeholder="ft"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height-in">Height (inches)</Label>
                      <Input
                        id="height-in"
                        type="number"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        className="w-full h-12 px-4"
                        placeholder="in"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      value={lbs}
                      onChange={(e) => setLbs(e.target.value)}
                      className="w-full h-12 px-4"
                      placeholder="e.g. 154"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full min-h-[250px] flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Your BMI Result</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 flex-1 flex flex-col justify-center items-center text-center">
              {!bmiData ? (
                <div className="text-muted-foreground text-sm lg:text-base">
                  Enter your height and weight to calculate your BMI.
                </div>
              ) : (
                <>
                  <div className="text-muted-foreground text-sm font-medium mb-1">Body Mass Index</div>
                  <div className={`text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 ${bmiData.color}`}>
                    {bmiData.value}
                  </div>
                  <div
                    className={`text-xl lg:text-2xl font-bold px-4 py-1.5 rounded-full bg-muted/50 ${bmiData.color}`}
                  >
                    {bmiData.category}
                  </div>

                  {/* Reference Scale */}
                  <div className="w-full max-w-sm mt-8 hidden sm:block">
                    <div className="flex w-full h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
                      <div className="bg-emerald-500 h-full" style={{ width: '25%' }}></div>
                      <div className="bg-amber-500 h-full" style={{ width: '25%' }}></div>
                      <div className="bg-rose-500 h-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-medium">
                      <span>&lt;18.5</span>
                      <span>18.5 - 24.9</span>
                      <span>25 - 29.9</span>
                      <span>30+</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is Body Mass Index (BMI)?</h2>
        <p>
          Body Mass Index (BMI) is a simple, widely used calculation that uses your height and weight to determine if
          you are at a healthy weight. While it doesn't measure body fat directly, it provides a reliable indicator of
          body fatness for most people and is used to screen for weight categories that may lead to health problems.
        </p>
        <h2>How Does the BMI Calculator Work?</h2>
        <p>
          Our BMI calculator accepts both Metric (kilograms and centimeters) and Imperial (pounds, feet, and inches)
          measurements. It instantly applies the standard mathematical formula used by the World Health Organization
          (WHO) and categorizes your result on the official BMI scale.
        </p>

        <h3>The BMI Mathematical Formula</h3>
        <p>
          The core engine behind this calculator relies on a straightforward formula. Depending on your preferred unit
          system, it is expressed as:
        </p>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono">
          <p>Metric: BMI = weight(kg) / height(m)²</p>
          <p>Imperial: BMI = 703 × weight(lbs) / height(in)²</p>
        </div>

        <h3>Understanding Your Results</h3>
        <ul>
          <li>
            <strong>Underweight (&lt; 18.5):</strong> May indicate a need to gain weight for better health.
          </li>
          <li>
            <strong>Normal weight (18.5 - 24.9):</strong> Associated with the lowest risk of weight-related illness.
          </li>
          <li>
            <strong>Overweight (25.0 - 29.9):</strong> Suggests you may benefit from losing a small amount of weight.
          </li>
          <li>
            <strong>Obese (30.0+):</strong> Associated with a higher risk of diseases like type 2 diabetes, heart
            disease, and some cancers.
          </li>
        </ul>

        <h2>Major Benefits of Knowing Your BMI</h2>
        <ul>
          <li>
            <strong>Health Screening:</strong> It is a quick, non-invasive first step to screen for potential health
            risks.
          </li>
          <li>
            <strong>Goal Setting:</strong> Helps establish a baseline for weight loss or muscle gain journeys.
          </li>
          <li>
            <strong>Universal Standard:</strong> Because it is a global medical standard, you can easily discuss your
            BMI with healthcare professionals anywhere in the world.
          </li>
        </ul>
      </CalculatorContent>
      <FAQAccordion
        faqs={[
          {
            question: 'Is BMI accurate for athletes or bodybuilders?',
            answer:
              "No, BMI can be inaccurate for highly muscular individuals. Because muscle is denser than fat, a bodybuilder might have a high BMI (categorizing them as 'overweight' or 'obese') despite having very low body fat.",
          },
          {
            question: 'What is the difference between BMI and Body Fat Percentage?',
            answer:
              'BMI is simply a ratio of your height to your weight. It cannot distinguish between fat, muscle, or bone mass. Body Fat Percentage is a direct measurement of how much of your total weight is specifically composed of fat.',
          },
          {
            question: 'Is BMI the same for men and women?',
            answer:
              'Yes, the standard BMI formula and categories are identical for both men and women. However, women naturally carry a higher percentage of body fat than men at the same BMI.',
          },
          {
            question: 'Is BMI an accurate measure of health?',
            answer:
              'BMI is a useful screening tool for populations but flawed for individuals. It cannot distinguish between muscle mass and fat, meaning muscular athletes often classify as "overweight" or "obese".',
          },
          {
            question: 'Are there different BMI standards for different ethnicities?',
            answer:
              'Yes, the World Health Organization (WHO) has established different cut-off points for Asian populations because they have a higher risk of type 2 diabetes at lower BMI levels.',
          },
        ]}
      />

      <RelatedCalculators calculators={getRelatedCalculators('bmi-calculator')} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'BMI Calculator',
          description:
            'Calculate your Body Mass Index (BMI) using standard metric or imperial measurements to check your health category.',
        }}
      />
    </CalculatorLayout>
  );
}
