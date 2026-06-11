"use client";

import { useState, useMemo, useEffect } from "react";
import { CalculatorConfig } from "@/lib/calculator-engine";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { SliderInput } from "@/components/calculators/slider-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, Share2, Printer, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularStatistics } from "@/components/calculators/circular-statistics";

import { getCalculatorConfig } from "@/lib/calculator-engine";
import { useCurrency } from "@/context/CurrencyContext";
import { IndiaOnlyGate } from "@/components/calculators/india-only-gate";
import { CALCULATOR_DIRECTORY } from "@/config/calculators";

const INR_BASE_RATE = 83.00;

export function DynamicCalculatorClient({ slug, name, children }: { slug: string, name: string, children?: React.ReactNode }) {
  const config = useMemo(() => getCalculatorConfig(slug, name), [slug, name]);
  const { currency, format, convert, economicRates } = useCurrency();

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes(slug));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, [slug]);

  // Map input IDs to global economic rates
  const getDynamicDefault = (id: string, currentDefault: number, type: string) => {
    if (type !== "percentage") return currentDefault;
    const lower = id.toLowerCase();
    if (lower.includes("inflation")) return economicRates.inflation;
    if (lower.includes("tax") || lower.includes("gst") || lower.includes("vat")) return economicRates.tax;
    if (lower.includes("loan") || lower.includes("mortgage") || lower.includes("emi")) return economicRates.homeLoan;
    if (lower.includes("debt") || lower.includes("fd") || lower.includes("rd")) return economicRates.debt;
    // Default to equity return for generic "rate" or "return" fields if they seem like investment returns
    if (lower === "rate" || lower.includes("return") || lower.includes("cagr") || lower.includes("sip")) return economicRates.equity;
    return currentDefault;
  };

  // Initialize state dynamically based on config defaults. All currency states are stored internally as USD.
  const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
    const initialState: Record<string, number | string> = {};
    config.inputs.forEach(input => {
      if (input.type === "currency") {
        initialState[input.id] = (input.default as number) / INR_BASE_RATE;
      } else {
        initialState[input.id] = getDynamicDefault(input.id, input.default, input.type);
      }
    });
    return initialState;
  });

  const [copied, setCopied] = useState(false);

  // Sync state from URL on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      let hasUrlParams = false;
      const urlState = { ...inputs };

      config.inputs.forEach(input => {
        const val = params.get(input.id);
        if (val !== null) {
          urlState[input.id] = Number(val);
          hasUrlParams = true;
        }
      });

      if (hasUrlParams) {
        setInputs(urlState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // We removed automatic URL syncing to prevent SEO duplicate content issues.
  // The URL will now remain perfectly clean unless the user clicks the "Share" button.

  // Apply currency overrides when the selected currency changes
  useEffect(() => {
    setInputs(prev => {
      const newState = { ...prev };
      let changed = false;
      config.inputs.forEach(input => {
        const override = input.currencyOverrides?.[currency.code];
        
        // Handle explicit overrides defined in the config
        if (override?.default !== undefined) {
           const newDefault = override.default;
           const internalVal = input.type === "currency" ? newDefault / currency.rate : newDefault;
           if (Math.abs(Number(newState[input.id]) - internalVal) > 0.001) {
             newState[input.id] = internalVal;
             changed = true;
           }
        } 
        // Handle global economic rate defaults
        else if (input.type === "percentage") {
           const dynamicVal = getDynamicDefault(input.id, input.default, input.type);
           if (dynamicVal !== input.default && newState[input.id] !== dynamicVal) {
             newState[input.id] = dynamicVal;
             changed = true;
           }
        }
      });
      return changed ? newState : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency.code, economicRates]); // Trigger when the user actually changes the currency code or rates

  const handleInputChange = (id: string, value: number | string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  // Run calculation
  const results = useMemo(() => {
    // Parse inputs. Bridge USD internal state to INR for the engine calculation.
    const numericInputs: Record<string, number> = {};
    for (const [key, val] of Object.entries(inputs)) {
      const num = Number(val) || 0;
      const inputDef = config.inputs.find(i => i.id === key);
      if (inputDef && inputDef.type === "currency") {
        numericInputs[key] = num * INR_BASE_RATE;
      } else {
        numericInputs[key] = num;
      }
    }
    
    // Engine computes everything assuming INR numbers
    const rawResults = config.calculate(numericInputs);
    
    // Bridge INR results back to USD
    const finalResults: any = {
      ...rawResults,
      primaryValue: rawResults.primaryType === "currency" ? rawResults.primaryValue / INR_BASE_RATE : rawResults.primaryValue,
      secondaryValue: rawResults.secondaryType === "currency" && rawResults.secondaryValue ? rawResults.secondaryValue / INR_BASE_RATE : rawResults.secondaryValue,
      tertiaryValue: rawResults.tertiaryType === "currency" && rawResults.tertiaryValue ? rawResults.tertiaryValue / INR_BASE_RATE : rawResults.tertiaryValue,
    };

    // Auto-generate chart data for typical Investment/Loan breakdowns
    const sl = finalResults.secondaryLabel?.toLowerCase() || "";
    const tl = finalResults.tertiaryLabel?.toLowerCase() || "";
    const pl = finalResults.primaryLabel?.toLowerCase() || "";
    
    let autoChartData;

    if (
      (sl.includes("invest") || sl.includes("principal") || sl.includes("cost")) && 
      (tl.includes("gain") || tl.includes("interest") || tl.includes("profit")) &&
      finalResults.secondaryType === "currency" && finalResults.tertiaryType === "currency"
    ) {
      autoChartData = [
        { name: finalResults.secondaryLabel!, value: finalResults.secondaryValue!, color: "var(--chart-1)" },
        { name: finalResults.tertiaryLabel!, value: finalResults.tertiaryValue!, color: "var(--chart-2)" }
      ];
    } 
    // Pattern 2: Primary is Profit, Secondary is Investment
    else if (
      pl.includes("profit") && sl.includes("invest") &&
      finalResults.primaryType === "currency" && finalResults.secondaryType === "currency"
    ) {
      // Only show chart if profit is positive
      if (finalResults.primaryValue > 0) {
        autoChartData = [
          { name: finalResults.secondaryLabel!, value: finalResults.secondaryValue!, color: "var(--chart-1)" },
          { name: finalResults.primaryLabel, value: finalResults.primaryValue, color: "var(--chart-2)" }
        ];
      }
    }

    if (autoChartData && !rawResults.chartData) {
      finalResults.chartData = autoChartData;
    } else if (rawResults.chartData) {
      finalResults.chartData = rawResults.chartData.map((item: any) => ({
        ...item,
        value: item.type === "currency" ? item.value / INR_BASE_RATE : item.value
      }));
    }

    return finalResults;
  }, [inputs, config]);

  const formatValue = (value: number, type: "currency" | "percentage" | "number") => {
    if (type === "currency") return format(value);
    if (type === "percentage") return `${value.toFixed(2)}%`;
    return value.toLocaleString();
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      params.set(key, typeof value === 'number' ? Number(value.toFixed(2)).toString() : value.toString());
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.name} | Numeraise`,
          text: `Check out my calculation for ${config.name}!`,
          url: url,
        });
        return;
      } catch (err) {}
    } 
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
    } else {
      fallbackCopyTextToClipboard(url);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const escapeCSV = (str: string) => {
      return `"${str.replace(/"/g, '""')}"`;
    };

    const getCleanValue = (value: number, type: "currency" | "percentage" | "number") => {
      if (type === "currency") {
        return convert(value).toFixed(2);
      }
      if (type === "percentage") {
        return `${value.toFixed(2)}%`;
      }
      return value.toString();
    };

    const rows = [
      [escapeCSV("Metric"), escapeCSV("Value")],
      ...config.inputs.map(input => {
         const isCurr = input.type === "currency";
         const rawVal = inputs[input.id];
         const valStr = isCurr 
           ? getCleanValue(rawVal as number, "currency") 
           : rawVal.toString();
         return [escapeCSV(input.label), escapeCSV(valStr)];
      }),
      [escapeCSV("--"), escapeCSV("--")],
      [escapeCSV(results.primaryLabel), escapeCSV(getCleanValue(results.primaryValue, results.primaryType))]
    ];

    if (results.secondaryLabel) {
      rows.push([
        escapeCSV(results.secondaryLabel), 
        escapeCSV(getCleanValue(results.secondaryValue || 0, results.secondaryType || "number"))
      ]);
    }
    if (results.tertiaryLabel) {
      rows.push([
        escapeCSV(results.tertiaryLabel), 
        escapeCSV(getCleanValue(results.tertiaryValue || 0, results.tertiaryType || "number"))
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${config.slug}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getValueColorClass = (label: string, value: number, isPrimary: boolean = false) => {
    if (!label) return "print:text-black";
    const lower = label.toLowerCase();
    
    // Explicitly positive words
    if (lower.includes("profit") || lower.includes("gain") || lower.includes("return") || lower.includes("earn") || lower.includes("yield") || lower.includes("savings")) {
      return value < 0 ? "text-rose-600 dark:text-rose-400 print:text-black" : "text-emerald-600 dark:text-emerald-400 print:text-black";
    }
    // Explicitly negative words
    if (lower.includes("loss") || lower.includes("tax") || lower.includes("expense") || lower.includes("fee") || lower.includes("debt") || lower.includes("liability") || lower.includes("emi")) {
      return "text-rose-600 dark:text-rose-400 print:text-black";
    }
    
    // For the primary main result, use a brilliant brand gradient if it doesn't match above keywords
    if (isPrimary) {
      return "text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/60 print:text-black";
    }
    
    return "text-foreground print:text-black";
  };

  // Direct SSR render. The client will hydrate with the default state and update if URL parameters or context changes.

  return (
    <IndiaOnlyGate slug={slug}>
    <CalculatorLayout 
      title={config.name} 
      description={config.description}
      icon={calculatorIcon ?? undefined}
    >
      <div className="grid lg:grid-cols-12 gap-2 lg:gap-8">
        
        {/* INPUTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm print:shadow-none print:border-none">
            <CardContent className="p-0 lg:p-6 space-y-3 lg:space-y-8">
              {config.inputs.map((input) => {
                const isCurrency = input.type === "currency";
                const override = input.currencyOverrides?.[currency.code];
                
                // For currency, we convert internal USD values to the local selected currency for the UI
                const displayValue = isCurrency ? convert(inputs[input.id] as number) : inputs[input.id] as number;
                const displayMin = override?.min !== undefined ? override.min : (isCurrency ? convert(input.min / INR_BASE_RATE) : input.min);
                const displayMax = override?.max !== undefined ? override.max : (isCurrency ? convert(input.max / INR_BASE_RATE) : input.max);
                const displayStep = override?.step !== undefined ? override.step : (isCurrency ? convert(input.step / INR_BASE_RATE) : input.step);

                return (
                  <SliderInput
                    key={input.id}
                    label={input.label}
                    value={displayValue}
                    min={displayMin}
                    max={displayMax}
                    step={displayStep}
                    onChange={(val) => {
                      // Convert user's local currency input back to USD for internal state
                      const parsedVal = isCurrency ? val / currency.rate : val;
                      handleInputChange(input.id, parsedVal);
                    }}
                    symbol={isCurrency ? currency.symbol : undefined}
                    suffix={input.type === "percentage" ? "%" : input.type === "years" ? "Yr" : undefined}
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-6 space-y-2 lg:space-y-6">
          <Card className="bg-card text-card-foreground shadow-lg overflow-hidden border border-border print:shadow-none print:border-black print:text-black">
            <CardHeader className="bg-muted/30 border-b border-border p-3 lg:p-6 lg:pb-4 flex flex-row items-center justify-between space-y-0 print:bg-white print:border-b-2 print:border-black">
              <CardTitle className="text-sm lg:text-xl flex items-center gap-1.5 lg:gap-2">
                <Calculator className="w-4 h-4 lg:w-5 lg:h-5" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">Calculation Results</h3>
                <p className="text-xs text-muted-foreground/70">Your computed breakdown</p>
              </div>

              <div className={`grid gap-3 lg:gap-4 ${
                (results.secondaryLabel && results.tertiaryLabel) 
                  ? "grid-cols-1 sm:grid-cols-3" 
                  : results.secondaryLabel 
                    ? "grid-cols-1 sm:grid-cols-2" 
                    : "grid-cols-1"
              }`}>
                {/* Primary Result */}
                <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col justify-center transition-transform hover:scale-[1.02] duration-300">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium mb-1.5 print:text-black">{results.primaryLabel}</p>
                  <div className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${getValueColorClass(results.primaryLabel, results.primaryValue, true)}`}>
                    {formatValue(results.primaryValue, results.primaryType)}
                  </div>
                </div>

                {/* Secondary Result */}
                {results.secondaryLabel && (
                  <div className="bg-card p-4 rounded-xl border flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] duration-300">
                    <p className="text-xs lg:text-sm text-muted-foreground mb-1.5 print:text-black">{results.secondaryLabel}</p>
                    <div className={`font-semibold text-xl lg:text-2xl ${getValueColorClass(results.secondaryLabel, results.secondaryValue || 0)}`}>
                      {formatValue(results.secondaryValue || 0, results.secondaryType || "number")}
                    </div>
                  </div>
                )}

                {/* Tertiary Result */}
                {results.tertiaryLabel && (
                  <div className="bg-card p-4 rounded-xl border flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] duration-300">
                    <p className="text-xs lg:text-sm text-muted-foreground mb-1.5 print:text-black">{results.tertiaryLabel}</p>
                    <div className={`font-semibold text-xl lg:text-2xl ${getValueColorClass(results.tertiaryLabel, results.tertiaryValue || 0)}`}>
                      {formatValue(results.tertiaryValue || 0, results.tertiaryType || "number")}
                    </div>
                  </div>
                )}
              </div>

              {results.chartData && results.chartData.length > 0 && (
                <div className="mt-8 border-t border-border/50 pt-6">
                  <CircularStatistics data={results.chartData} title="Visual Breakdown" />
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2 mt-4 p-4 bg-muted/30 rounded-lg border border-border/50 print:hidden">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleShare}>
              {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Share2 className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleDownloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>
      {children}
    </CalculatorLayout>
    </IndiaOnlyGate>
  );
}
