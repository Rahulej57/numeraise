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

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find((c) => c.href.includes('age-calculator'));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const ageData = useMemo(() => {
    if (!dob || !targetDate) return null;

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

    if (d1 > d2) return { error: 'Date of birth cannot be after the target date.' };

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Extra details
    const timeDiff = d2.getTime() - d1.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);

    return { years, months, days, totalDays, totalMonths, totalWeeks };
  }, [dob, targetDate]);

  const relatedCalcs = getRelatedCalculators('age-calculator');
  return (
    <CalculatorLayout
      title="Age Calculator - Calculate Your Exact Age in Years, Months, Days"
      description=""
      icon={calculatorIcon ?? undefined}
    >
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
            <CardContent className="p-0 lg:p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-12 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Age at the Date of</Label>
                <Input
                  id="target"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-12 px-4"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4">
              <CardTitle className="text-sm lg:text-xl">Your Exact Age</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              {!ageData ? (
                <div className="text-center py-8 text-muted-foreground">Please enter your date of birth.</div>
              ) : ageData.error ? (
                <div className="text-center py-8 text-destructive font-medium">{ageData.error}</div>
              ) : (
                <>
                  <div className="text-xl lg:text-3xl font-extrabold tracking-tight mb-6 text-primary flex items-baseline gap-2 flex-wrap">
                    <span>
                      {ageData.years} <span className="text-base font-medium text-muted-foreground">years</span>
                    </span>
                    <span>
                      {ageData.months} <span className="text-base font-medium text-muted-foreground">months</span>
                    </span>
                    <span>
                      {ageData.days} <span className="text-base font-medium text-muted-foreground">days</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border mt-8">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Months</p>
                      <p className="font-semibold text-lg">{ageData.totalMonths?.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Weeks</p>
                      <p className="font-semibold text-lg">{ageData.totalWeeks?.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Days</p>
                      <p className="font-semibold text-lg">{ageData.totalDays?.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CalculatorContent>
        <h2>What is an Age Calculator?</h2>
        <p>
          An age calculator is a simple but precise tool that calculates the exact time difference between two dates.
          While most people know their age in years, this calculator provides a highly granular breakdown, showing
          exactly how many years, months, and days you have been alive.
        </p>
        <h2>How Does the Age Calculator Work?</h2>
        <p>
          You simply input your date of birth and a target date (which defaults to today). The calculator then uses
          standard calendar mathematics to compute the exact span of time between those two dates, automatically
          adjusting for leap years and months with varying numbers of days.
        </p>

        <h3>The Calendar Calculation Method</h3>
        <p>
          Calculating exact age is slightly more complex than simple subtraction because months have varying lengths
          (28, 29, 30, or 31 days). The logic follows these rules:
        </p>
        <ul>
          <li>
            If the current day of the month is less than the birth day, borrow a month and add the number of days from
            the previous month.
          </li>
          <li>
            If the current month is less than the birth month, borrow a year and add 12 months to the current month.
          </li>
          <li>Finally, subtract the years, months, and days to get the exact age.</li>
        </ul>

        <h2>Common Uses for an Age Calculator</h2>
        <ul>
          <li>
            <strong>Applications and Forms:</strong> Many government and legal documents require your exact age in
            years, months, and days on a specific cutoff date.
          </li>
          <li>
            <strong>Milestone Tracking:</strong> Easily find out exactly how many days old you are, or figure out when
            your 10,000th day on earth will be!
          </li>
          <li>
            <strong>Age Differences:</strong> Enter two different birthdays to find the exact age gap between you and a
            sibling, partner, or friend.
          </li>
        </ul>

        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Age = Current Date - Birth Date</p>
        </div>
      </CalculatorContent>
      <FAQAccordion
        faqs={[
          {
            question: 'Does the calculator account for leap years?',
            answer:
              'Yes, the calculator strictly uses the Gregorian calendar rules, automatically accounting for leap years when calculating total days and exact age.',
          },
          {
            question: 'Can I calculate my age on a past or future date?',
            answer:
              "Absolutely. Simply change the 'Age at the Date of' field to any date in the past or future to see exactly how old you were (or will be) on that specific day.",
          },
          {
            question: "Why do 'Total Months' not perfectly equal 'Total Days / 30'?",
            answer:
              'Because months are not uniformly 30 days long. Our total months calculation counts full calendar months passed, while total days counts every individual 24-hour cycle.',
          },
          {
            question: 'How does leap year affect my age calculation?',
            answer:
              'Leap years are automatically accounted for by the underlying engine. If you were born on Feb 29, the calculator handles the exact number of days accurately.',
          },
          {
            question: 'Why do different cultures calculate age differently?',
            answer:
              'In many Western cultures, a child is 0 at birth. In traditional Chinese culture, a child is considered 1 year old at birth and ages up on the Lunar New Year.',
          },
        ]}
      />

      <RelatedCalculators calculators={getRelatedCalculators('age-calculator')} />
      <StructuredData
        type="Calculator"
        data={{
          name: 'Age Calculator',
          description:
            'Calculate your exact age in years, months, and days, and find out your total time alive in weeks and hours.',
        }}
      />
    </CalculatorLayout>
  );
}
