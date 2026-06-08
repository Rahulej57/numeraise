import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIP Calculator | Calculate Mutual Fund Returns & Wealth Creation",
  description: "Use our free SIP Calculator to estimate your future wealth, calculate mutual fund returns, and view detailed amortization schedules for your investments.",
  keywords: ["SIP calculator", "mutual fund calculator", "investment returns", "systematic investment plan", "compounding calculator", "financial planning"],
  alternates: {
    canonical: "/calculators/sip-calculator"
  }
};

export default function SIPCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
