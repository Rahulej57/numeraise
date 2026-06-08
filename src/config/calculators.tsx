import { Calculator, TrendingUp, Landmark, ShieldCheck, HeartHandshake, ReceiptText, Briefcase, Bitcoin, Home, Car, Calendar, Activity } from "lucide-react";

export const CALCULATOR_DIRECTORY = [
  {
    slug: "investments",
    category: "Investment & Wealth Creation",
    icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    calculators: [
      { name: "SIP vs Lumpsum", desc: "Compare SIP and Lumpsum returns side-by-side.", href: "/calculators/sip-vs-lumpsum" },
      { name: "SIP Calculator", desc: "Systematic Investment Plan returns.", href: "/calculators/sip-calculator" },
      { name: "Lumpsum Calculator", desc: "One-time investment compounding.", href: "/calculators/lumpsum-calculator" },
      { name: "CAGR Calculator", desc: "Compound Annual Growth Rate.", href: "/calculators/cagr-calculator" },
      { name: "SWP Calculator", desc: "Systematic Withdrawal Plan.", href: "/calculators/swp-calculator" },
      { name: "Mutual Fund Returns", desc: "Analyze historical mutual fund returns.", href: "/calculators/mutual-fund-returns" },
      { name: "Step-Up SIP", desc: "SIP with annual increment.", href: "/calculators/step-up-sip" },
      { name: "Stock Profit", desc: "Calculate profit or loss from equity trades.", href: "/calculators/stock-profit" },
      { name: "Net Worth Calculator", desc: "Calculate total assets minus liabilities.", href: "/calculators/net-worth-calculator" },
      { name: "Dividend Yield", desc: "Calculate return from dividend payouts.", href: "/calculators/dividend-yield" },
    ]
  },
  {
    slug: "loans",
    category: "Loans & Borrowing",
    icon: <Landmark className="w-6 h-6 text-blue-500" />,
    calculators: [
      { name: "Flat vs Reducing Loan", desc: "Compare interest calculation methods.", href: "/calculators/flat-vs-reducing-loan" },
      { name: "EMI Calculator", desc: "Equated Monthly Installments.", href: "/calculators/emi-calculator" },
      { name: "Home Loan Calculator", desc: "Amortization and schedule.", href: "/calculators/home-loan-calculator" },
      { name: "Car Loan EMI", desc: "Vehicle financing estimator.", href: "/calculators/car-loan-emi" },
      { name: "Lease vs. Buy", desc: "Compare leasing vs buying a car.", href: "/calculators/lease-vs-buy" },
      { name: "Prepayment Calculator", desc: "Impact of extra payments.", href: "/calculators/home-loan-prepayment" },
      { name: "Personal Loan", desc: "Unsecured loan EMI and interest.", href: "/calculators/personal-loan-calculator" },
      { name: "Education Loan", desc: "Student loan repayment plan.", href: "/calculators/education-loan-calculator" },
      { name: "Loan Refinance", desc: "Balance transfer benefit analysis.", href: "/calculators/loan-refinance" },
      { name: "Credit Card Payoff", desc: "Time to clear credit card debt.", href: "/calculators/credit-card-payoff" },
    ]
  },
  {
    slug: "savings",
    category: "Savings & Fixed Returns",
    icon: <Calculator className="w-6 h-6 text-amber-500" />,
    calculators: [
      { name: "FD Calculator", desc: "Fixed Deposit maturity value.", href: "/calculators/fd-calculator" },
      { name: "RD Calculator", desc: "Recurring Deposit interest.", href: "/calculators/rd-calculator" },
      { name: "PPF Calculator", desc: "Public Provident Fund returns.", href: "/calculators/ppf-calculator" },
      { name: "EPF Calculator", desc: "Employee Provident Fund.", href: "/calculators/epf-calculator" },
      { name: "Post Office MIS", desc: "Monthly Income Scheme calculator.", href: "/calculators/pomis-calculator" },
      { name: "Senior Citizen Savings", desc: "SCSS interest calculations.", href: "/calculators/scss-calculator" },
      { name: "Sukanya Samriddhi", desc: "SSY scheme for girl child.", href: "/calculators/ssy-calculator" },
      { name: "NSC Calculator", desc: "National Savings Certificate.", href: "/calculators/nsc-calculator" },
    ]
  },
  {
    slug: "taxes",
    category: "Tax Planning",
    icon: <ReceiptText className="w-6 h-6 text-rose-500" />,
    calculators: [
      { name: "Paycheck Estimator", desc: "Calculate take-home net pay.", href: "/calculators/paycheck-calculator" },
      { name: "Income Tax Calculator", desc: "Old vs New Regime tax liability.", href: "/calculators/income-tax-calculator" },
      { name: "GST Calculator", desc: "Goods and Services Tax.", href: "/calculators/gst-calculator" },
      { name: "HRA Exemption", desc: "House Rent Allowance deduction.", href: "/calculators/hra-exemption" },
      { name: "Capital Gains Tax", desc: "STCG and LTCG on investments.", href: "/calculators/capital-gains-tax" },
      { name: "TDS Calculator", desc: "Tax Deducted at Source estimation.", href: "/calculators/tds-calculator" },
      { name: "Advance Tax", desc: "Calculate advance tax liability.", href: "/calculators/advance-tax" },
    ]
  },
  {
    slug: "insurance",
    category: "Insurance & Security",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    calculators: [
      { name: "Term Insurance", desc: "Life cover requirement.", href: "/calculators/term-insurance-calculator" },
      { name: "Health Insurance", desc: "Medical cover estimator.", href: "/calculators/health-insurance-calculator" },
      { name: "Life Insurance Premium", desc: "Endowment/ULIP premium estimation.", href: "/calculators/life-insurance-premium" },
      { name: "Human Life Value", desc: "Economic value of a human life.", href: "/calculators/human-life-value" },
    ]
  },
  {
    slug: "retirement",
    category: "Retirement & FIRE",
    icon: <HeartHandshake className="w-6 h-6 text-purple-500" />,
    calculators: [
      { name: "Retirement Corpus", desc: "Money needed to retire.", href: "/calculators/retirement-calculator" },
      { name: "FIRE Calculator", desc: "Financial Independence Retire Early.", href: "/calculators/fire-calculator" },
      { name: "401(k) Calculator", desc: "US Employer Retirement Plan.", href: "/calculators/401k-calculator" },
      { name: "NPS Calculator", desc: "National Pension System.", href: "/calculators/nps-calculator" },
      { name: "Gratuity Calculator", desc: "Employer gratuity estimation.", href: "/calculators/gratuity-calculator" },
      { name: "Pension Calculator", desc: "Monthly pension payout estimator.", href: "/calculators/pension-calculator" },
      { name: "Inflation Calculator", desc: "Future value of money.", href: "/calculators/inflation-calculator" },
    ]
  },
  {
    slug: "business",
    category: "Business & Corporate",
    icon: <Briefcase className="w-6 h-6 text-teal-500" />,
    calculators: [
      { name: "Margin Calculator", desc: "Gross and net profit margins.", href: "/calculators/margin-calculator" },
      { name: "Markup Calculator", desc: "Pricing based on cost.", href: "/calculators/markup-calculator" },
      { name: "Break-Even Point", desc: "Sales needed to cover costs.", href: "/calculators/break-even-calculator" },
      { name: "ROI Calculator", desc: "Return on Investment for projects.", href: "/calculators/roi-calculator" },
      { name: "Discount Calculator", desc: "Final price after sales discount.", href: "/calculators/discount-calculator" },
      { name: "EBITDA Calculator", desc: "Operating performance metric.", href: "/calculators/ebitda-calculator" },
    ]
  },
  {
    slug: "real-estate",
    category: "Real Estate",
    icon: <Home className="w-6 h-6 text-orange-500" />,
    calculators: [
      { name: "Rent vs Buy", desc: "Financial comparison of renting or buying.", href: "/calculators/rent-vs-buy" },
      { name: "US Mortgage Calculator", desc: "Calculate PITI and PMI.", href: "/calculators/us-mortgage-calculator" },
      { name: "Rental Yield", desc: "Return on real estate investment.", href: "/calculators/rental-yield" },
      { name: "Stamp Duty", desc: "Property registration costs.", href: "/calculators/stamp-duty" },
    ]
  },
  {
    slug: "crypto",
    category: "Crypto & Forex",
    icon: <Bitcoin className="w-6 h-6 text-yellow-500" />,
    calculators: [
      { name: "Crypto Profit", desc: "Profit on cryptocurrency trades.", href: "/calculators/crypto-profit" },
      { name: "Forex Pip", desc: "Value of a pip in currency pairs.", href: "/calculators/forex-pip" },
    ]
  },
  {
    slug: "health",
    category: "Health & Fitness",
    icon: <Activity className="w-6 h-6 text-pink-500" />,
    calculators: [
      { name: "BMI Calculator", desc: "Calculate Body Mass Index (BMI).", href: "/calculators/bmi-calculator" },
      { name: "BMR & TDEE", desc: "Basal metabolic rate & daily calories.", href: "/calculators/bmr-calculator" },
      { name: "Body Fat", desc: "Estimate body fat percentage.", href: "/calculators/body-fat-calculator" },
      { name: "Pregnancy Due Date", desc: "Estimate conception & due dates.", href: "/calculators/pregnancy-due-date" },
    ]
  },
  {
    slug: "utility",
    category: "Basic Utilities",
    icon: <Calendar className="w-6 h-6 text-slate-500" />,
    calculators: [
      { name: "Age Calculator", desc: "Calculate exact age in years, months, days.", href: "/calculators/age-calculator" },
      { name: "Basic Calculator", desc: "Standard arithmetic operations.", href: "/calculators/basic-calculator" },
      { name: "Measurement Converter", desc: "Convert length, weight, area & volume.", href: "/calculators/measurement-calculator" },
      { name: "Percentage Calculator", desc: "Calculate percentages and changes.", href: "/calculators/percentage-calculator" },
      { name: "Date & Time", desc: "Calculate durations between dates.", href: "/calculators/date-time-calculator" },
      { name: "Tip Calculator", desc: "Calculate tips and split bills.", href: "/calculators/tip-calculator" },
      { name: "Salary Converter", desc: "Convert hourly, daily, annual wages.", href: "/calculators/salary-calculator" },
      { name: "50/30/20 Budget", desc: "Split your income into needs, wants, and savings.", href: "/calculators/budget-calculator" },
      { name: "Currency Converter", desc: "Live exchange rates for world currencies.", href: "/calculators/currency-converter" },
    ]
  }
];

export function getRelatedCalculators(slug: string) {
  const category = CALCULATOR_DIRECTORY.find(c => c.calculators.some(calc => calc.href.includes(slug)));
  if (!category) return [];
  
  return category.calculators
    .filter(c => !c.href.includes(slug))
    .slice(0, 3)
    .map(c => ({
      title: c.name,
      description: c.desc,
      href: c.href
    }));
}
