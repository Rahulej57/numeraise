"use client";

import { useState, useMemo, useEffect } from "react";
import { Scale, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { getComparisonConfig } from "@/lib/comparison-engine";
import { SliderInput } from "@/components/calculators/slider-input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";

export function ScenarioClient({ slug }: { slug: string }) {
  const config = useMemo(() => getComparisonConfig(slug), [slug]);
  const { currency } = useCurrency();

  const [inputsA, setInputsA] = useState<Record<string, number>>(() => {
    const initialState: Record<string, number> = {};
    config?.scenarioA.inputs.forEach(input => {
      initialState[input.id] = input.default;
    });
    return initialState;
  });

  const [inputsB, setInputsB] = useState<Record<string, number>>(() => {
    const initialState: Record<string, number> = {};
    config?.scenarioB.inputs.forEach(input => {
      initialState[input.id] = input.default;
    });
    return initialState;
  });

  useEffect(() => {
    setInputsA(prev => {
      const newState = { ...prev };
      let changed = false;
      config?.scenarioA.inputs.forEach(input => {
        const override = input.currencyOverrides?.[currency.code];
        if (override?.default !== undefined && prev[input.id] !== override.default) {
           newState[input.id] = override.default;
           changed = true;
        }
      });
      return changed ? newState : prev;
    });

    setInputsB(prev => {
      const newState = { ...prev };
      let changed = false;
      config?.scenarioB.inputs.forEach(input => {
        const override = input.currencyOverrides?.[currency.code];
        if (override?.default !== undefined && prev[input.id] !== override.default) {
           newState[input.id] = override.default;
           changed = true;
        }
      });
      return changed ? newState : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency.code]);

  const results = useMemo(() => {
    if (!config) return null;
    return config.calculate(inputsA, inputsB);
  }, [inputsA, inputsB, config]);

  if (!config || !results) return null;

  const formatValue = (value: number, type: "currency" | "percentage" | "number") => {
    if (type === "currency") return `${currency.symbol}${Math.round(value).toLocaleString(currency.code === 'INR' ? 'en-IN' : 'en-US')}`;
    if (type === "percentage") return `${value.toFixed(2)}%`;
    return value.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[70vh]">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          {config.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {config.description}
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* SCENARIO A */}
        <Card className={`border-2 transition-all ${results.verdict.winner === 'A' ? 'border-emerald-500/50 shadow-emerald-500/10 shadow-lg' : 'border-border'}`}>
          <div className={`p-4 border-b text-center font-bold text-xl flex items-center justify-center gap-2 ${results.verdict.winner === 'A' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted/30'}`}>
            {results.verdict.winner === 'A' && <Trophy className="w-5 h-5" />}
            {config.scenarioA.name}
            {results.verdict.winner === 'A' && <Badge variant="default" className="bg-emerald-500 ml-2">Winner</Badge>}
          </div>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              {config.scenarioA.inputs.map((input) => {
                const override = input.currencyOverrides?.[currency.code];
                return (
                  <SliderInput
                    key={input.id}
                    label={input.label}
                    value={inputsA[input.id]}
                    min={override?.min !== undefined ? override.min : input.min}
                    max={override?.max !== undefined ? override.max : input.max}
                    step={override?.step !== undefined ? override.step : input.step}
                    onChange={(val) => setInputsA(prev => ({ ...prev, [input.id]: val }))}
                    symbol={input.type === "currency" ? currency.symbol : undefined}
                    suffix={input.type === "percentage" ? "%" : input.type === "years" ? "Yr" : undefined}
                  />
                );
              })}
              {config.scenarioA.inputs.length === 0 && (
                <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <TrendingUp className="w-8 h-8 opacity-20" />
                  <p>No configurable inputs for this scenario.</p>
                </div>
              )}
            </div>
            
            <div className="pt-6 border-t border-border space-y-4 bg-muted/20 p-6 rounded-xl">
              <h4 className="font-semibold text-foreground/80 text-sm uppercase tracking-wider mb-4">Scenario Results</h4>
              {results.metricsA.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className={`font-semibold text-lg ${idx === 0 ? 'text-primary text-xl' : ''}`}>
                    {formatValue(metric.value, metric.type)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SCENARIO B */}
        <Card className={`border-2 transition-all ${results.verdict.winner === 'B' ? 'border-emerald-500/50 shadow-emerald-500/10 shadow-lg' : 'border-border'}`}>
          <div className={`p-4 border-b text-center font-bold text-xl flex items-center justify-center gap-2 ${results.verdict.winner === 'B' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted/30'}`}>
            {results.verdict.winner === 'B' && <Trophy className="w-5 h-5" />}
            {config.scenarioB.name}
            {results.verdict.winner === 'B' && <Badge variant="default" className="bg-emerald-500 ml-2">Winner</Badge>}
          </div>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-6">
              {config.scenarioB.inputs.map((input) => {
                const override = input.currencyOverrides?.[currency.code];
                return (
                  <SliderInput
                    key={input.id}
                    label={input.label}
                    value={inputsB[input.id]}
                    min={override?.min !== undefined ? override.min : input.min}
                    max={override?.max !== undefined ? override.max : input.max}
                    step={override?.step !== undefined ? override.step : input.step}
                    onChange={(val) => setInputsB(prev => ({ ...prev, [input.id]: val }))}
                    symbol={input.type === "currency" ? currency.symbol : undefined}
                    suffix={input.type === "percentage" ? "%" : input.type === "years" ? "Yr" : undefined}
                  />
                );
              })}
              {config.scenarioB.inputs.length === 0 && (
                <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                  <TrendingUp className="w-8 h-8 opacity-20" />
                  <p>No configurable inputs for this scenario.</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-border space-y-4 bg-muted/20 p-6 rounded-xl">
              <h4 className="font-semibold text-foreground/80 text-sm uppercase tracking-wider mb-4">Scenario Results</h4>
              {results.metricsB.map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className={`font-semibold text-lg ${idx === 0 ? 'text-primary text-xl' : ''}`}>
                    {formatValue(metric.value, metric.type)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VERDICT BOX */}
      <Card className="bg-card border-border shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-emerald-500"></div>
        <CardContent className="p-8 md:p-10 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-primary/10 rounded-full shrink-0">
            {results.verdict.winner === 'Tie' ? (
              <AlertTriangle className="w-10 h-10 text-amber-500" />
            ) : (
              <Trophy className="w-10 h-10 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold mb-2 text-foreground">
              {results.verdict.winner === 'Tie' ? "It's a Tie!" : `Verdict: ${results.verdict.winner === 'A' ? config.scenarioA.name : config.scenarioB.name} Wins!`}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {results.verdict.summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
