"use client";

import { useState, useEffect, useRef, useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  symbol?: string;
  suffix?: string;
}

export function SliderInput({ label, value, min, max, step = 1, onChange, symbol, suffix }: SliderInputProps) {
  // Automatically sanitize floating point imprecision caused by dynamic currency rate conversions.
  // Only round if the original step is >= 1 to avoid breaking small decimal sliders (like Interest Rates).
  const sanitize = (val: number) => {
    if (step >= 1) return Math.round(val);
    return Number(Number(val).toFixed(2)); // Cap at 2 decimal places for small steps
  };

  const cleanValue = sanitize(value);
  const cleanMin = sanitize(min);
  const cleanMax = sanitize(max);
  const cleanStep = sanitize(step) || 1;

  const isLargeNumber = (cleanMax - cleanMin) > 50000;
  const exponent = isLargeNumber ? 3 : 1; // Use cubic curve for large money sliders
  const RESOLUTION = 10000; // High resolution track for smooth curved sliding

  const [localValue, setLocalValue] = useState(cleanValue);
  const [inputValue, setInputValue] = useState(cleanValue.toString());

  /*
   * The visible <Label> was previously detached: no htmlFor, and the <Input>
   * sat in a sibling <div> rather than inside it. A crawl of all 127 pages
   * found 419 form controls with no accessible name across 71 pages, with 64
   * pages at 100% unlabelled. That is a WCAG 2.2 SC 4.1.2 failure and makes
   * every calculator unusable with a screen reader.
   *
   * useId gives a stable id that matches between server and client render, so
   * associating them does not introduce a hydration mismatch.
   */
  const fieldId = useId();
  const inputId = `${fieldId}-value`;
  const sliderId = `${fieldId}-slider`;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const lastCallRef = useRef(0);

  // Sync external changes (only if not actively interacting with the slider)
  useEffect(() => {
    const sanitizedVal = sanitize(value);
    if (!isDragging.current && sanitizedVal !== localValue) {
      setLocalValue(sanitizedVal);
      setInputValue(sanitizedVal.toString());
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isDragging.current = true;
    const val = e.target.value;
    setInputValue(val);
    
    const num = val === "" ? 0 : Number(val);
    if (!isNaN(num)) {
      setLocalValue(num);
      onChange(num);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        isDragging.current = false;
      }, 50);
    }
  };

  const handleSliderChange = (vals: any) => {
    isDragging.current = true;
    const rawPosition = Array.isArray(vals) ? vals[0] : (typeof vals === 'number' ? vals : 0);
    
    // Convert physical slider position back to real value using the curve
    const ratio = rawPosition / RESOLUTION;
    let newVal = cleanMin + (cleanMax - cleanMin) * Math.pow(ratio, exponent);
    
    if (cleanStep > 0) {
      newVal = Math.round(newVal / cleanStep) * cleanStep;
    }
    newVal = Math.max(cleanMin, Math.min(cleanMax, newVal));
    newVal = sanitize(newVal);
    
    // Instantly update the local UI (slider thumb and input text)
    setLocalValue(newVal);
    setInputValue(newVal.toString());
    
    // Throttle the heavy parent update to 25 FPS (40ms) to save CPU on mobile
    const now = Date.now();
    if (now - lastCallRef.current >= 40) {
      onChange(newVal);
      lastCallRef.current = now;
    }
    
    // Ensure the final exact value is committed when dragging stops
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newVal);
      // Wait a fraction of a second before unlocking to prevent incoming parent renders from snapping the thumb
      setTimeout(() => { isDragging.current = false; }, 50);
    }, 50); 
  };

  const getSliderPosition = (val: number) => {
    if (cleanMax <= cleanMin) return 0;
    const boundedVal = Math.max(cleanMin, Math.min(cleanMax, isNaN(val) ? cleanMin : val));
    const ratio = (boundedVal - cleanMin) / (cleanMax - cleanMin);
    return Math.pow(ratio, 1 / exponent) * RESOLUTION;
  };

  return (
    <div className="space-y-2 lg:space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} className="text-sm lg:text-base font-medium">
          {label}
        </Label>
        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-md border">
          {symbol && (
            <span aria-hidden="true" className="text-muted-foreground font-medium">
              {symbol}
            </span>
          )}
          <Input
            id={inputId}
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            min={cleanMin}
            max={cleanMax}
            step={cleanStep}
            // The currency symbol and unit sit in sibling spans, so the
            // accessible name would otherwise be just the label. Spelling out
            // the unit here is what a screen reader actually announces.
            aria-label={`${label}${symbol ? ` in ${symbol}` : ''}${suffix ? ` in ${suffix}` : ''}`}
            className="w-24 h-8 border-0 bg-transparent text-right font-bold text-primary focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
          {suffix && (
            <span aria-hidden="true" className="text-muted-foreground font-medium">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <Slider
        id={sliderId}
        value={[getSliderPosition(localValue)]}
        min={0}
        max={RESOLUTION}
        step={1}
        onValueChange={handleSliderChange}
        // The slider drives an internal 0-10000 resolution track, so its raw
        // aria-valuenow is meaningless to a listener. aria-valuetext reports the
        // real figure the user is choosing.
        aria-label={`${label} slider`}
        aria-valuetext={`${symbol ?? ''}${localValue}${suffix ? ` ${suffix}` : ''}`}
        className="py-4 touch-pan-y print:hidden"
      />
    </div>
  );
}
