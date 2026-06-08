import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Loan EMI Calculator | Housing Loan Interest Calculation",
  description: "Plan your real estate purchase with our Home Loan Calculator. Calculate your monthly EMI, view total interest payable over 20 years, and see full amortization data.",
  keywords: ["home loan calculator", "housing loan EMI", "mortgage calculator", "real estate calculator", "home loan interest", "amortization schedule"],
  alternates: {
    canonical: "/calculators/home-loan-calculator"
  }
};

export default function HomeLoanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
