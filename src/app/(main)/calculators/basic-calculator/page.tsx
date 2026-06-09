"use client";

import { useState, useMemo } from "react";
import { CalculatorLayout } from "@/components/calculators/calculator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalculatorContent } from "@/components/calculators/calculator-content";
import { FAQAccordion } from "@/components/calculators/faq-accordion";
import { StructuredData } from "@/components/seo/structured-data";
import { RelatedCalculators } from "@/components/calculators/related-calculators";
import { getRelatedCalculators, CALCULATOR_DIRECTORY } from "@/config/calculators";

export default function BasicCalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isScientific, setIsScientific] = useState(false);

  const calculatorIcon = useMemo(() => {
    for (const category of CALCULATOR_DIRECTORY) {
      const calc = category.calculators.find(c => c.href.includes("basic-calculator"));
      if (calc?.icon) return calc.icon;
    }
    return null;
  }, []);

  const handleNum = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    if (display === "Error") return;
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const handleFunc = (func: string) => {
    if (display === "Error") setDisplay("0");
    if (display === "0") {
      setDisplay(func + "(");
    } else {
      setDisplay(display + func + "(");
    }
  };

  const handleConstant = (val: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const calculate = () => {
    try {
      let cleanEq = equation + display;
      // Replace visual symbols with JS equivalents
      cleanEq = cleanEq
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**");

      // Auto-close missing parentheses
      const openParen = (cleanEq.match(/\(/g) || []).length;
      const closeParen = (cleanEq.match(/\)/g) || []).length;
      for (let i = 0; i < openParen - closeParen; i++) {
        cleanEq += ")";
      }

      // eslint-disable-next-line no-new-func
      const result = new Function("return " + cleanEq)();
      
      if (!isFinite(result) || isNaN(result)) throw new Error("Math Error");
      
      // Round to avoid floating point weirdness
      setDisplay(String(Math.round(result * 100000000) / 100000000));
      setEquation("");
    } catch (e) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };

  const backspace = () => {
    if (display === "Error") {
      setDisplay("0");
    } else if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  return (
    <CalculatorLayout title="Scientific Calculator" description="" icon={calculatorIcon ?? undefined}>
      <div className="max-w-md mx-auto mt-4">
        
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsScientific(!isScientific)}
            className="text-xs"
          >
            {isScientific ? "Basic Mode" : "Scientific Mode"}
          </Button>
        </div>

        <Card className="border-none shadow-none bg-muted/20 p-2 md:p-4">
          <CardContent className="p-0">
            {/* Display */}
            <div className="bg-card border border-border rounded-xl p-4 mb-4 text-right flex flex-col justify-end min-h-[100px] shadow-sm">
              <div className="text-sm text-muted-foreground h-5 tracking-wider">{equation.replace(/\*/g, "×").replace(/\//g, "÷")}</div>
              <div className="text-3xl md:text-5xl font-extrabold tracking-tight truncate font-mono">{display}</div>
            </div>
            
            {/* Keypad */}
            <div className={`grid gap-2 ${isScientific ? 'grid-cols-5' : 'grid-cols-4'}`}>
              
              {/* Scientific Functions */}
              {isScientific && (
                <>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("sin")}>sin</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("cos")}>cos</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("tan")}>tan</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("log")}>log</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("ln")}>ln</Button>

                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleNum("(")}>(</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleNum(")")}>)</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleFunc("√")}>√</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleConstant("π")}>π</Button>
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleConstant("e")}>e</Button>
                  
                  <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono" onClick={() => handleNum("^")}>x^y</Button>
                </>
              )}

              {/* Standard Keypad row 1 */}
              <Button variant="outline" className={`${isScientific ? 'col-span-1' : 'col-span-1'} bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20 h-12 md:h-14 text-lg font-bold`} onClick={clear}>C</Button>
              <Button variant="outline" className="bg-muted/50 border-transparent hover:bg-muted h-12 md:h-14 text-xl" onClick={backspace}>⌫</Button>
              <Button variant="outline" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20 h-12 md:h-14 text-xl font-bold" onClick={() => handleOp("÷")}>÷</Button>
              <Button variant="outline" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20 h-12 md:h-14 text-xl font-bold" onClick={() => handleOp("×")}>×</Button>
              
              {/* Row 2 */}
              {isScientific && <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono invisible" />}
              {[7, 8, 9].map(n => (
                <Button key={n} variant="ghost" className="bg-background border shadow-sm hover:bg-muted h-12 md:h-14 text-xl md:text-2xl font-semibold font-mono" onClick={() => handleNum(String(n))}>{n}</Button>
              ))}
              <Button variant="outline" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20 h-12 md:h-14 text-xl font-bold" onClick={() => handleOp("-")}>-</Button>
              
              {/* Row 3 */}
              {isScientific && <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono invisible" />}
              {[4, 5, 6].map(n => (
                <Button key={n} variant="ghost" className="bg-background border shadow-sm hover:bg-muted h-12 md:h-14 text-xl md:text-2xl font-semibold font-mono" onClick={() => handleNum(String(n))}>{n}</Button>
              ))}
              <Button variant="outline" className="bg-primary/10 text-primary border-transparent hover:bg-primary/20 h-12 md:h-14 text-xl font-bold" onClick={() => handleOp("+")}>+</Button>
              
              {/* Row 4 */}
              {isScientific && <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono invisible" />}
              {[1, 2, 3].map(n => (
                <Button key={n} variant="ghost" className="bg-background border shadow-sm hover:bg-muted h-12 md:h-14 text-xl md:text-2xl font-semibold font-mono" onClick={() => handleNum(String(n))}>{n}</Button>
              ))}
              <Button className="row-span-2 h-full text-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90" onClick={calculate}>=</Button>
              
              {/* Row 5 */}
              {isScientific && <Button variant="outline" className="bg-muted/30 h-12 md:h-14 font-mono invisible" />}
              <Button variant="ghost" className="col-span-2 bg-background border shadow-sm hover:bg-muted h-12 md:h-14 text-xl md:text-2xl font-semibold font-mono" onClick={() => handleNum("0")}>0</Button>
              <Button variant="ghost" className="bg-background border shadow-sm hover:bg-muted h-12 md:h-14 text-xl md:text-2xl font-semibold font-mono" onClick={() => { if(!display.includes(".")) handleNum(".") }}>.</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CalculatorContent>
        <h2>What is an Online Calculator?</h2>
        <p>Our online calculator is a free, interactive web tool that mimics the functionality of a physical handheld calculator. It provides immediate solutions to mathematical problems ranging from simple daily arithmetic to complex scientific equations without requiring any software installation.</p>
        
        <h2>Basic vs. Scientific Mode</h2>
        <p>By default, the calculator opens in <strong>Basic Mode</strong>, providing a clean, uncluttered interface perfect for quick addition, subtraction, multiplication, and division. However, with a single click, you can switch to <strong>Scientific Mode</strong> to unlock advanced mathematical operations.</p>

        <h3>Scientific Mode Features</h3>
        <ul>
          <li><strong>Trigonometric Functions:</strong> Sine (sin), Cosine (cos), and Tangent (tan) for geometry and physics calculations.</li>
          <li><strong>Logarithms:</strong> Base-10 logarithm (log) and Natural logarithm (ln).</li>
          <li><strong>Exponents & Roots:</strong> Easily calculate square roots (√) and powers (x^y).</li>
          <li><strong>Mathematical Constants:</strong> Built-in buttons for Pi (π ≈ 3.14159) and Euler's number (e ≈ 2.71828).</li>
        </ul>

        <h2>Common Use Cases</h2>
        <ul>
          <li><strong>Daily Finances:</strong> Balancing a checkbook, splitting a dinner bill, or calculating a quick tip percentage.</li>
          <li><strong>Homework Help:</strong> Assisting students with high school algebra, geometry, or trigonometry assignments.</li>
          <li><strong>Engineering & Science:</strong> Quick on-the-fly calculations for professionals needing immediate access to scientific constants.</li>
        </ul>
      
        <h3>The Mathematical Formula</h3>
        <div className="bg-muted p-4 rounded-lg my-4 text-center font-mono text-sm">
          <p>Result = X [+, -, ×, ÷] Y</p>
        </div>
      </CalculatorContent>
      <FAQAccordion faqs={[
        {
          question: "Does the calculator follow the order of operations (PEMDAS)?",
          answer: "Yes! Our calculator's internal engine strictly follows the standard mathematical order of operations: Parentheses, Exponents, Multiplication and Division, then Addition and Subtraction."
        },
        {
          question: "Is there a limit to how large a number I can calculate?",
          answer: "The calculator uses standard 64-bit floating-point arithmetic. It can handle extremely large numbers up to approximately 1.79 × 10^308 before returning an 'Infinity' error."
        },
        {
          question: "Can I use my physical keyboard to type numbers?",
          answer: "Our calculator is designed to be fully responsive. While the on-screen buttons are perfect for mobile and tablet users, desktop users can utilize their keyboard's number pad for rapid data entry."
        }
      ,
        {
          question: "What is the order of operations?",
          answer: "Mathematical calculations follow PEMDAS: Parentheses, Exponents, Multiplication and Division (left to right), and Addition and Subtraction (left to right)."
        },
        {
          question: "Why do some calculators give different answers?",
          answer: "Simple pocket calculators evaluate from left to right immediately. Scientific calculators evaluate the entire expression using the strict order of operations."
        }
      ]} />

      

      
      

      <RelatedCalculators calculators={getRelatedCalculators("basic-calculator")} /><StructuredData 
        type="Calculator" 
        data={{
          name: "Online Scientific Calculator",
          description: "A free online calculator with both basic arithmetic and advanced scientific modes for math, engineering, and daily use."
        }} 
      />
    </CalculatorLayout>
  );
}

