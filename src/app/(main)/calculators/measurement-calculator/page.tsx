'use client';

import { useState, useMemo, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculators/calculator-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalculatorContent } from '@/components/calculators/calculator-content';
import { FAQAccordion } from '@/components/calculators/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { RelatedCalculators } from '@/components/calculators/related-calculators';
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from '@/config/calculators';

const CONVERSIONS: Record<string, Record<string, number>> = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Mile: 1609.34,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254,
  },
  Weight: {
    Kilogram: 1,
    Gram: 0.001,
    Milligram: 0.000001,
    'Metric Ton': 1000,
    Pound: 0.453592,
    Ounce: 0.0283495,
  },
  Area: {
    'Square Meter': 1,
    'Square Kilometer': 1000000,
    'Square Foot': 0.092903,
    'Square Yard': 0.836127,
    Acre: 4046.86,
    Hectare: 10000,
  },
  Volume: {
    Liter: 1,
    Milliliter: 0.001,
    'Cubic Meter': 1000,
    'US Gallon': 3.78541,
    'US Quart': 0.946353,
    'US Pint': 0.473176,
    'US Cup': 0.236588,
    'US Fluid Ounce': 0.0295735,
  },
};

const selectClass =
  'flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';

export default function MeasurementCalculatorPage() {
  const categories = ['Length', 'Weight', 'Area', 'Volume', 'Temperature'];
  const [category, setCategory] = useState(categories[0]);

  const [fromUnit, setFromUnit] = useState(Object.keys(CONVERSIONS['Length'])[0]);
  const [toUnit, setToUnit] = useState(Object.keys(CONVERSIONS['Length'])[1]);

  const [inputValue, setInputValue] = useState<string>('1');

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find((c) => c.href.includes('measurement-calculator'));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  // Reset units when category changes
  useEffect(() => {
    if (category === 'Temperature') {
      setFromUnit('Celsius');
      setToUnit('Fahrenheit');
    } else {
      const units = Object.keys(CONVERSIONS[category]);
      setFromUnit(units[0]);
      setToUnit(units[1]);
    }
  }, [category]);

  const convertedValue = useMemo(() => {
    if (!inputValue || isNaN(Number(inputValue))) return '0';
    const val = Number(inputValue);

    if (category === 'Temperature') {
      if (fromUnit === toUnit) return val;
      if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return (val * 9) / 5 + 32;
      if (fromUnit === 'Celsius' && toUnit === 'Kelvin') return val + 273.15;
      if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return ((val - 32) * 5) / 9;
      if (fromUnit === 'Fahrenheit' && toUnit === 'Kelvin') return ((val - 32) * 5) / 9 + 273.15;
      if (fromUnit === 'Kelvin' && toUnit === 'Celsius') return val - 273.15;
      if (fromUnit === 'Kelvin' && toUnit === 'Fahrenheit') return ((val - 273.15) * 9) / 5 + 32;
      return val;
    }

    const rates = CONVERSIONS[category];
    if (!rates || !rates[fromUnit] || !rates[toUnit]) return val;

    // Convert to base unit, then to target unit
    const baseValue = val * rates[fromUnit];
    const result = baseValue / rates[toUnit];

    // Format avoiding scientific notation for small numbers if possible,
    // but allowing it if extremely small/large
    return parseFloat(result.toPrecision(8)).toString();
  }, [category, fromUnit, toUnit, inputValue]);

  const unitsOptions =
    category === 'Temperature' ? ['Celsius', 'Fahrenheit', 'Kelvin'] : Object.keys(CONVERSIONS[category] || {});

  const relatedCalcs = getRelatedCalculators('measurement-calculator');
  return (
    <CalculatorLayout title="Measurement Converter" description="" icon={calculatorIcon ?? undefined}>
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={selectClass}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromUnit">From</Label>
                  <div className="relative">
                    <select
                      id="fromUnit"
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className={selectClass}
                    >
                      {unitsOptions.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toUnit">To</Label>
                  <div className="relative">
                    <select
                      id="toUnit"
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className={selectClass}
                    >
                      {unitsOptions.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Enter Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-12 px-4 text-lg font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border h-full flex flex-col justify-center min-h-[250px]">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex-none">
              <CardTitle className="text-sm lg:text-xl">Converted Value</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 flex-1 flex flex-col justify-center items-center text-center">
              <div className="text-muted-foreground text-lg mb-2">
                {inputValue || '0'} {fromUnit} =
              </div>
              <div className="text-3xl lg:text-5xl font-extrabold tracking-tight text-primary break-all max-w-full">
                {convertedValue}
              </div>
              <div className="text-xl font-medium text-muted-foreground mt-2">{toUnit}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is a Measurement Converter?</h2>
        <p>
          A measurement converter is an essential utility that bridges the gap between different systems of measurement,
          primarily the Metric System (used by most of the world) and the Imperial System (used primarily in the United
          States).
        </p>
        <h2>How Does the Measurement Calculator Work?</h2>
        <p>
          Our calculator uses exact mathematical conversion rates defined by international standards bodies. Simply
          select a category (Length, Weight, Area, Volume, or Temperature), choose your starting unit and target unit,
          and input a value. The calculator instantly processes the conversion using high-precision math to avoid
          rounding errors.
        </p>

        <h3>Mathematical Conversion Examples</h3>
        <ul>
          <li>
            <strong>Length:</strong> 1 Inch = exactly 2.54 Centimeters. Therefore, to convert inches to cm, you multiply
            by 2.54.
          </li>
          <li>
            <strong>Weight:</strong> 1 Kilogram = approximately 2.20462 Pounds. Therefore, to convert kg to lbs, you
            multiply by 2.20462.
          </li>
          <li>
            <strong>Temperature:</strong> Temperature is unique because it doesn't scale from absolute zero.
            <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
              <p>(°C × 9/5) + 32 = °F</p>
            </div>
          </li>
        </ul>

        <h2>Common Uses for Measurement Conversion</h2>
        <ul>
          <li>
            <strong>Cooking & Baking:</strong> Converting recipe measurements (like grams to ounces, or Celsius to
            Fahrenheit for oven temps).
          </li>
          <li>
            <strong>Travel:</strong> Understanding speed limits in kilometers per hour, or checking the local weather
            forecast in Celsius.
          </li>
          <li>
            <strong>Engineering & Science:</strong> Ensuring absolute precision when moving between SI units and
            Imperial units in CAD software.
          </li>
        </ul>
      </CalculatorContent>
      <FAQAccordion
        faqs={[
          {
            question: 'Why does the conversion sometimes have long decimal numbers?',
            answer:
              'Because the metric and imperial systems are not perfectly divisible by one another (except for the inch, which is strictly defined as 2.54cm). We display high precision so you can choose where to round based on your needs.',
          },
          {
            question: 'What is the difference between an Ounce and a Fluid Ounce?',
            answer:
              "An 'Ounce' is a measure of weight (mass), while a 'Fluid Ounce' is a measure of volume (space). Make sure you are in the correct category (Weight vs. Volume) when converting!",
          },
          {
            question: 'How is Kelvin different from Celsius?',
            answer:
              'Kelvin is the primary unit of temperature in the physical sciences. It uses the exact same degree increments as Celsius, but it starts at Absolute Zero (-273.15 °C) instead of the freezing point of water.',
          },
          {
            question: 'Why are there US and Imperial gallons?',
            answer:
              'Although they share the same name, the US liquid gallon is legally defined as 231 cubic inches (approx 3.785 liters), while the British Imperial gallon is based on the volume of 10 lbs of water (approx 4.546 liters).',
          },
          {
            question: 'Is a nautical mile the same as a regular mile?',
            answer:
              'No. A standard (statute) mile is 5,280 feet. A nautical mile is slightly longer at 6,076 feet, historically based on one minute of latitude around the Earth.',
          },
        ]}
      />

      <RelatedCalculators calculators={getRelatedCalculators('measurement-calculator')} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Measurement Converter',
          description:
            'Convert length, weight, area, volume, and temperature between the Metric and Imperial systems instantly.',
        }}
      />
    </CalculatorLayout>
  );
}
