import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FD Calculator | Fixed Deposit Return & Maturity Calculator",
  description: "Calculate your Fixed Deposit maturity amount and total interest earned. Our FD Calculator uses precise quarterly compounding formulas used by all major banks.",
  keywords: ["FD calculator", "fixed deposit calculator", "bank FD returns", "maturity value calculator", "interest calculator", "quarterly compounding"],
  alternates: {
    canonical: "/calculators/fd-calculator"
  }
};

export default function FDCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
