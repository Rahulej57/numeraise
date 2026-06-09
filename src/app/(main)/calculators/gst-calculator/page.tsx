"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { SliderInput } from "@/components/calculators/slider-input";
import { ResultActions } from "@/components/calculators/result-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators } from "@/config/calculators";
import { CalculatorHeader } from "@/components/calculators/calculator-header";

export default function GSTCalculatorPage() {
  const { format, currency } = useCurrency();
  const [amount, setAmount] = useState(10000 / 83);
  const [taxRate, setTaxRate] = useState(18);
  const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");

  const taxName = currency.code === 'USD' ? 'Sales Tax' : (['EUR', 'GBP'].includes(currency.code) ? 'VAT' : 'GST');
  const isIndian = currency.code === 'INR';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('mode')) setMode(params.get('mode') as any);
    
    // Only override from URL on initial load, otherwise update defaults based on currency
    if (params.has('amount') && !window.history.state?.initialized) {
      setAmount(Number(params.get('amount')));
    } else {
      setAmount(currency.code === 'INR' ? 10000 : 120);
    }

    if (params.has('rate') && !window.history.state?.initialized) {
      setTaxRate(Number(params.get('rate')));
    } else {
      switch (currency.code) {
        case 'USD': setTaxRate(8); break;
        case 'GBP': setTaxRate(20); break;
        case 'EUR': setTaxRate(21); break;
        case 'CAD': setTaxRate(13); break;
        case 'AUD': setTaxRate(10); break;
        case 'SGD': setTaxRate(9); break;
        case 'AED': setTaxRate(5); break;
        default: setTaxRate(18); // INR
      }
    }

    // Mark as initialized so URL params don't override future currency switches
    window.history.replaceState({ ...window.history.state, initialized: true }, '');
    
    // Dynamically update URL slug to match the UI without reloading
    const newSlug = currency.code === 'USD' ? 'sales-tax-calculator' : (['EUR', 'GBP'].includes(currency.code) ? 'vat-calculator' : 'gst-calculator');
    const currentPath = window.location.pathname;
    const expectedPath = `/calculators/${newSlug}`;
    if (currentPath !== expectedPath && (currentPath.includes('/gst-calculator') || currentPath.includes('/sales-tax-calculator') || currentPath.includes('/vat-calculator'))) {
      window.history.replaceState(window.history.state, '', `${expectedPath}${window.location.search}`);
    }
  }, [currency.code]);

  const getPresets = () => {
    switch (currency.code) {
      case 'INR': return [5, 12, 18, 28]; // Indian GST slabs
      case 'USD': return [4, 6, 8, 10];   // Common US state rates
      case 'GBP': return [5, 20];         // UK VAT
      case 'EUR': return [7, 19, 21];     // Common EU VAT rates
      case 'CAD': return [5, 13, 15];     // Canada GST/HST
      case 'AUD': return [10];            // Australia GST
      case 'SGD': return [9];             // Singapore GST
      case 'AED': return [5];             // UAE VAT
      default: return [5, 10, 15, 20];
    }
  };
  const presets = getPresets();

  const taxAmount = mode === "exclusive" 
    ? (amount * taxRate) / 100 
    : amount - (amount * (100 / (100 + taxRate)));
    
  const netAmount = mode === "exclusive" 
    ? amount + taxAmount 
    : amount - taxAmount;
    
  const totalAmount = mode === "exclusive" ? netAmount : amount;
  const originalCost = mode === "exclusive" ? amount : netAmount;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?amount=${amount}&rate=${taxRate}&mode=${mode}`
    : '';

  const copyPayload = `${taxName} Calculation (${mode === "exclusive" ? "Exclusive" : "Inclusive"}):
Original Cost: ${format(Math.round(originalCost))}
${taxName} Rate: ${taxRate}%
${taxName} Amount: ${format(Math.round(taxAmount))}

Total Price: ${format(Math.round(totalAmount))}

Calculate your own: ${shareUrl}`;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <CalculatorHeader title={`${taxName} Calculator`} />

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* INPUTS */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-none shadow-none bg-muted/20">
            <CardContent className="p-5 md:p-6 space-y-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="exclusive">Add {taxName}</TabsTrigger>
                  <TabsTrigger value="inclusive">Remove {taxName}</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <SliderInput
                label={mode === "exclusive" ? "Original Cost" : `Total Price (inc. ${taxName})`}
                value={Math.round(amount * currency.rate)}
                min={Math.round((100 / 83) * currency.rate)}
                max={Math.round((100000 / 83) * currency.rate)}
                step={Math.round((100 / 83) * currency.rate) || 1}
                onChange={(val) => setAmount(val / currency.rate)}
                symbol={currency.symbol}
              />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Select {taxName} Rate</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={taxRate} 
                      onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                      className="w-16 h-8 text-right bg-background border rounded-md px-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-sm font-medium text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setTaxRate(rate)}
                      className={`py-2 rounded-lg border text-sm font-semibold transition-all ${
                        taxRate === rate 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20 ring-offset-2 ring-offset-background" 
                          : "bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RESULTS */}
        <div className="lg:col-span-6">
          <Card className="border-border shadow-md bg-muted/40 border-none shadow-none">
            <CardContent className="p-5 md:p-8">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Final Price</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                  {format(Math.round(totalAmount))}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-background p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-muted-foreground mb-1">Original Cost</span>
                  <span className="text-lg font-bold">{format(Math.round(originalCost))}</span>
                </div>
                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20 shadow-sm flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-orange-600 dark:text-orange-400 mb-1">Total {taxName} ({taxRate}%)</span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{format(Math.round(taxAmount))}</span>
                </div>
              </div>

              {isIndian && (
                <div className="bg-background rounded-xl border p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Central GST (CGST)</span>
                    <span className="font-medium text-foreground">{format(Math.round(taxAmount/2))} ({taxRate/2}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>State GST (SGST)</span>
                    <span className="font-medium text-foreground">{format(Math.round(taxAmount/2))} ({taxRate/2}%)</span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <ResultActions 
                  shareUrl={shareUrl}
                  copyPayload={copyPayload}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <CalculatorContent>
          <h2>What is a GST / Sales Tax Calculator?</h2>
          <p>A GST (Goods and Services Tax) or Sales Tax calculator is a business and consumer utility that instantly computes the exact amount of tax applied to a purchase. It allows you to seamlessly add tax to a net price, or extract the hidden tax from a total gross price.</p>
          
          <h2>How Does the Tax Engine Work?</h2>
          <p>The calculator adapts its terminology (GST, VAT, or Sales Tax) based on your selected currency. It features two distinct calculation modes:</p>

          <h3>1. Exclusive (Add Tax)</h3>
          <p>Use this when you know the base price of an item and need to know the final price at checkout.</p>
          
          <h4>The Mathematical Formula</h4>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Tax Amount = Original Cost × (Tax Rate / 100)</p>
          </div>

          <h3>2. Inclusive (Remove Tax)</h3>
          <p>Use this when you see a final shelf price (like {currency.symbol}100) and need to reverse-engineer exactly how much of that {currency.symbol}100 is actually going to the government. The extraction formula is mathematically different.</p>

          <h4>The Mathematical Formula</h4>
          <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
            <p>Tax Amount = Total Price - (Total Price × (100 / (100 + Tax Rate)))</p>
          </div>

          <h2>Common Uses for Tax Calculation</h2>
          <ul>
            <li><strong>Invoicing:</strong> Freelancers and business owners use the 'Exclusive' mode to accurately add the legally required tax amount to client invoices.</li>
            <li><strong>Accounting:</strong> Bookkeepers use the 'Inclusive' mode to extract the exact tax amount from mixed receipts for tax write-offs and returns.</li>
            <li><strong>Consumer Budgeting:</strong> Calculating the exact final price of a car or appliance in a country/state where prices are displayed without tax.</li>
          </ul>
        </CalculatorContent>
      <FAQAccordion faqs={[
          {
            question: "Why can't I just subtract 18% from the final price in Inclusive mode?",
            answer: `This is a common mathematical error! If a ${currency.symbol}100 item gets 18% tax added, it becomes ${currency.symbol}118. If you later subtract 18% from ${currency.symbol}118, you get ${currency.symbol}96.76, not ${currency.symbol}100. To find the original cost, you must divide the final price by 1.18.`
          },
          {
            question: "What is the difference between GST, VAT, and Sales Tax?",
            answer: "Functionally to the end consumer, they are very similar. GST (India, Australia) and VAT (Europe, UK) are value-added taxes collected at every stage of the supply chain. US Sales Tax is only collected once at the final point of retail sale."
          },
          {
            question: "Why does the calculator show CGST and SGST for INR?",
            answer: "In India, the Goods and Services Tax is split equally between the Central Government (CGST) and the State Government (SGST) for intra-state sales. If the total GST is 18%, it is split as 9% CGST and 9% SGST."
          }
        ,
        {
          question: "Can I claim GST back on business purchases?",
          answer: "Yes, registered businesses can claim Input Tax Credit (ITC) for the GST paid on their purchases, reducing the total GST they have to pay to the government."
        },
        {
          question: "What is reverse charge mechanism in GST?",
          answer: "Normally, the supplier pays the GST. Under the reverse charge mechanism, the buyer or receiver of the goods/services is directly liable to pay the GST to the government."
        }
      ]} />

        

        
      

        <RelatedCalculators calculators={getRelatedCalculators("gst-calculator")} /><StructuredData 
          type="Calculator" 
          data={{
            name: "GST & Sales Tax Calculator",
            description: "Easily add exclusive tax to a price or extract inclusive tax from a total amount. Supports GST, VAT, and US Sales Tax."
          }} 
        />
      </div>
    </div>
  );
}

