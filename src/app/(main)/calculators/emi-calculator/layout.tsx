import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Calculator | Calculate Personal & Car Loan Installments",
  description: "Use our free EMI Calculator to instantly calculate your monthly loan installments. View detailed amortization schedules, principal breakdowns, and total interest payable.",
  keywords: ["EMI calculator", "loan calculator", "personal loan EMI", "car loan calculator", "amortization schedule", "interest calculator"],
  alternates: {
    canonical: "/calculators/emi-calculator"
  }
};

export default function EMICalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
