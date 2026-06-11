import { 
  Calculator, TrendingUp, Landmark, ShieldCheck, HeartHandshake, ReceiptText, 
  Briefcase, Bitcoin, Home, Car, Calendar, Activity,
  ArrowRightLeft, PiggyBank, BarChart3, Percent, Wallet, TrendingDown,
  Building2, CreditCard, GraduationCap, RefreshCw, CircleDollarSign,
  FileText, Receipt, Banknote, Coins, Shield, HeartPulse, Stethoscope, Heart,
  Flame, Target, HandCoins, HandHeart, DollarSign, BadgeDollarSign,
  Key, FileCheck, Clock, Ruler, Utensils, Baby
} from "lucide-react";

export const CALCULATOR_DIRECTORY = [
  {
    slug: "investments",
    category: "Investment & Wealth Creation",
    icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
    calculators: [
      { name: "SIP vs Lumpsum", desc: "Compare SIP and Lumpsum returns side-by-side.", href: "/calculators/sip-vs-lumpsum", icon: <ArrowRightLeft className="w-5 h-5 text-emerald-500" /> },
      { name: "SIP Calculator", desc: "Systematic Investment Plan returns.", href: "/calculators/sip-calculator", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
      { name: "Lumpsum Calculator", desc: "One-time investment compounding.", href: "/calculators/lumpsum-calculator", icon: <Coins className="w-5 h-5 text-emerald-500" /> },
      { name: "CAGR Calculator", desc: "Compound Annual Growth Rate.", href: "/calculators/cagr-calculator", icon: <BarChart3 className="w-5 h-5 text-emerald-500" /> },
      { name: "SWP Calculator", desc: "Systematic Withdrawal Plan.", href: "/calculators/swp-calculator", icon: <Wallet className="w-5 h-5 text-emerald-500" /> },
      { name: "Mutual Fund Returns", desc: "Analyze historical mutual fund returns.", href: "/calculators/mutual-fund-returns", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
      { name: "Step-Up SIP", desc: "SIP with annual increment.", href: "/calculators/step-up-sip", icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
      { name: "Stock Profit", desc: "Calculate profit or loss from equity trades.", href: "/calculators/stock-profit", icon: <BarChart3 className="w-5 h-5 text-emerald-500" /> },
      { name: "Net Worth Calculator", desc: "Calculate total assets minus liabilities.", href: "/calculators/net-worth-calculator", icon: <CircleDollarSign className="w-5 h-5 text-emerald-500" /> },
      { name: "Dividend Yield", desc: "Calculate return from dividend payouts.", href: "/calculators/dividend-yield", icon: <Percent className="w-5 h-5 text-emerald-500" /> },
    ]
  },
  {
    slug: "loans",
    category: "Loans & Borrowing",
    icon: <Landmark className="w-6 h-6 text-blue-500" />,
    calculators: [
      { name: "Flat vs Reducing Loan", desc: "Compare interest calculation methods.", href: "/calculators/flat-vs-reducing-loan", icon: <RefreshCw className="w-5 h-5 text-blue-500" /> },
      { name: "EMI Calculator", desc: "Equated Monthly Installments.", href: "/calculators/emi-calculator", icon: <Calculator className="w-5 h-5 text-blue-500" /> },
      { name: "Home Loan Calculator", desc: "Amortization and schedule.", href: "/calculators/home-loan-calculator", icon: <Home className="w-5 h-5 text-blue-500" /> },
      { name: "Car Loan EMI", desc: "Vehicle financing estimator.", href: "/calculators/car-loan-emi", icon: <Car className="w-5 h-5 text-blue-500" /> },
      { name: "Lease vs. Buy", desc: "Compare leasing vs buying a car.", href: "/calculators/lease-vs-buy", icon: <ArrowRightLeft className="w-5 h-5 text-blue-500" /> },
      { name: "Prepayment Calculator", desc: "Impact of extra payments.", href: "/calculators/home-loan-prepayment", icon: <TrendingDown className="w-5 h-5 text-blue-500" /> },
      { name: "Personal Loan", desc: "Unsecured loan EMI and interest.", href: "/calculators/personal-loan-calculator", icon: <Banknote className="w-5 h-5 text-blue-500" /> },
      { name: "Education Loan", desc: "Student loan repayment plan.", href: "/calculators/education-loan-calculator", icon: <GraduationCap className="w-5 h-5 text-blue-500" /> },
      { name: "Loan Refinance", desc: "Balance transfer benefit analysis.", href: "/calculators/loan-refinance", icon: <RefreshCw className="w-5 h-5 text-blue-500" /> },
      { name: "Credit Card Payoff", desc: "Time to clear credit card debt.", href: "/calculators/credit-card-payoff", icon: <CreditCard className="w-5 h-5 text-blue-500" /> },
    ]
  },
  {
    slug: "savings",
    category: "Savings & Fixed Returns",
    icon: <Calculator className="w-6 h-6 text-amber-500" />,
    calculators: [
      { name: "FD Calculator", desc: "Fixed Deposit maturity value.", href: "/calculators/fd-calculator", icon: <PiggyBank className="w-5 h-5 text-amber-500" /> },
      { name: "RD Calculator", desc: "Recurring Deposit interest.", href: "/calculators/rd-calculator", icon: <RefreshCw className="w-5 h-5 text-amber-500" /> },
      { name: "PPF Calculator", desc: "Public Provident Fund returns.", href: "/calculators/ppf-calculator", icon: <Building2 className="w-5 h-5 text-amber-500" /> },
      { name: "EPF Calculator", desc: "Employee Provident Fund.", href: "/calculators/epf-calculator", icon: <Building2 className="w-5 h-5 text-amber-500" /> },
      { name: "Post Office MIS", desc: "Monthly Income Scheme calculator.", href: "/calculators/pomis-calculator", icon: <Building2 className="w-5 h-5 text-amber-500" /> },
      { name: "Senior Citizen Savings", desc: "SCSS interest calculations.", href: "/calculators/scss-calculator", icon: <HeartHandshake className="w-5 h-5 text-amber-500" /> },
      { name: "Sukanya Samriddhi", desc: "SSY scheme for girl child.", href: "/calculators/ssy-calculator", icon: <HeartHandshake className="w-5 h-5 text-amber-500" /> },
      { name: "NSC Calculator", desc: "National Savings Certificate.", href: "/calculators/nsc-calculator", icon: <FileText className="w-5 h-5 text-amber-500" /> },
    ]
  },
  {
    slug: "taxes",
    category: "Tax Planning",
    icon: <ReceiptText className="w-6 h-6 text-rose-500" />,
    calculators: [
      { name: "Paycheck Estimator", desc: "Calculate take-home net pay.", href: "/calculators/paycheck-calculator", icon: <Banknote className="w-5 h-5 text-rose-500" /> },
      { name: "Income Tax Calculator", desc: "Old vs New Regime tax liability.", href: "/calculators/income-tax-calculator", icon: <ReceiptText className="w-5 h-5 text-rose-500" /> },
      { name: "GST Calculator", desc: "Calculate Goods & Services Tax.", href: "/calculators/gst-calculator", icon: <Receipt className="w-5 h-5 text-rose-500" /> },
      { name: "Sales Tax Calculator", desc: "Calculate retail sales tax.", href: "/calculators/sales-tax-calculator", icon: <Receipt className="w-5 h-5 text-rose-500" /> },
      { name: "VAT Calculator", desc: "Value Added Tax calculations.", href: "/calculators/vat-calculator", icon: <Receipt className="w-5 h-5 text-rose-500" /> },
      { name: "HRA Exemption", desc: "House Rent Allowance deduction.", href: "/calculators/hra-exemption", icon: <Home className="w-5 h-5 text-rose-500" /> },
      { name: "Capital Gains Tax", desc: "STCG and LTCG on investments.", href: "/calculators/capital-gains-tax", icon: <TrendingUp className="w-5 h-5 text-rose-500" /> },
      { name: "TDS Calculator", desc: "Tax Deducted at Source estimation.", href: "/calculators/tds-calculator", icon: <FileText className="w-5 h-5 text-rose-500" /> },
      { name: "Advance Tax", desc: "Calculate advance tax liability.", href: "/calculators/advance-tax", icon: <Calendar className="w-5 h-5 text-rose-500" /> },
    ]
  },
  {
    slug: "insurance",
    category: "Insurance & Security",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    calculators: [
      { name: "Term Insurance", desc: "Life cover requirement.", href: "/calculators/term-insurance-calculator", icon: <Shield className="w-5 h-5 text-indigo-500" /> },
      { name: "Health Insurance", desc: "Medical cover estimator.", href: "/calculators/health-insurance-calculator", icon: <HeartPulse className="w-5 h-5 text-indigo-500" /> },
      { name: "Life Insurance Premium", desc: "Endowment/ULIP premium estimation.", href: "/calculators/life-insurance-premium", icon: <Stethoscope className="w-5 h-5 text-indigo-500" /> },
      { name: "Human Life Value", desc: "Economic value of a human life.", href: "/calculators/human-life-value", icon: <Heart className="w-5 h-5 text-indigo-500" /> },
    ]
  },
  {
    slug: "retirement",
    category: "Retirement & FIRE",
    icon: <HeartHandshake className="w-6 h-6 text-purple-500" />,
    calculators: [
      { name: "Retirement Corpus", desc: "Money needed to retire.", href: "/calculators/retirement-calculator", icon: <Flame className="w-5 h-5 text-purple-500" /> },
      { name: "FIRE Calculator", desc: "Financial Independence Retire Early.", href: "/calculators/fire-calculator", icon: <Flame className="w-5 h-5 text-purple-500" /> },
      { name: "401(k) Calculator", desc: "US Employer Retirement Plan.", href: "/calculators/401k-calculator", icon: <PiggyBank className="w-5 h-5 text-purple-500" /> },
      { name: "NPS Calculator", desc: "National Pension System.", href: "/calculators/nps-calculator", icon: <HandCoins className="w-5 h-5 text-purple-500" /> },
      { name: "Gratuity Calculator", desc: "Employer gratuity estimation.", href: "/calculators/gratuity-calculator", icon: <Banknote className="w-5 h-5 text-purple-500" /> },
      { name: "Pension Calculator", desc: "Monthly pension payout estimator.", href: "/calculators/pension-calculator", icon: <HandHeart className="w-5 h-5 text-purple-500" /> },
      { name: "Inflation Calculator", desc: "Future value of money.", href: "/calculators/inflation-calculator", icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
    ]
  },
  {
    slug: "business",
    category: "Business & Corporate",
    icon: <Briefcase className="w-6 h-6 text-teal-500" />,
    calculators: [
      { name: "Margin Calculator", desc: "Gross and net profit margins.", href: "/calculators/margin-calculator", icon: <Percent className="w-5 h-5 text-teal-500" /> },
      { name: "Markup Calculator", desc: "Pricing based on cost.", href: "/calculators/markup-calculator", icon: <DollarSign className="w-5 h-5 text-teal-500" /> },
      { name: "Break-Even Point", desc: "Sales needed to cover costs.", href: "/calculators/break-even-calculator", icon: <Target className="w-5 h-5 text-teal-500" /> },
      { name: "ROI Calculator", desc: "Return on Investment for projects.", href: "/calculators/roi-calculator", icon: <TrendingUp className="w-5 h-5 text-teal-500" /> },
      { name: "Discount Calculator", desc: "Final price after sales discount.", href: "/calculators/discount-calculator", icon: <BadgeDollarSign className="w-5 h-5 text-teal-500" /> },
      { name: "EBITDA Calculator", desc: "Operating performance metric.", href: "/calculators/ebitda-calculator", icon: <BarChart3 className="w-5 h-5 text-teal-500" /> },
    ]
  },
  {
    slug: "real-estate",
    category: "Real Estate",
    icon: <Home className="w-6 h-6 text-orange-500" />,
    calculators: [
      { name: "Rent vs Buy", desc: "Financial comparison of renting or buying.", href: "/calculators/rent-vs-buy", icon: <ArrowRightLeft className="w-5 h-5 text-orange-500" /> },
      { name: "US Mortgage Calculator", desc: "Calculate PITI and PMI.", href: "/calculators/us-mortgage-calculator", icon: <Home className="w-5 h-5 text-orange-500" /> },
      { name: "Rental Yield", desc: "Return on real estate investment.", href: "/calculators/rental-yield", icon: <Key className="w-5 h-5 text-orange-500" /> },
      { name: "Stamp Duty", desc: "Property registration costs.", href: "/calculators/stamp-duty", icon: <FileCheck className="w-5 h-5 text-orange-500" /> },
    ]
  },
  {
    slug: "crypto",
    category: "Crypto & Forex",
    icon: <Bitcoin className="w-6 h-6 text-yellow-500" />,
    calculators: [
      { name: "Crypto Profit", desc: "Profit on cryptocurrency trades.", href: "/calculators/crypto-profit", icon: <Bitcoin className="w-5 h-5 text-yellow-500" /> },
      { name: "Forex Pip", desc: "Value of a pip in currency pairs.", href: "/calculators/forex-pip", icon: <Coins className="w-5 h-5 text-yellow-500" /> },
    ]
  },
  {
    slug: "health",
    category: "Health & Fitness",
    icon: <Activity className="w-6 h-6 text-pink-500" />,
    calculators: [
      { name: "BMI Calculator", desc: "Calculate Body Mass Index (BMI).", href: "/calculators/bmi-calculator", icon: <Activity className="w-5 h-5 text-pink-500" /> },
      { name: "BMR Calculator", desc: "Calculate your Basal Metabolic Rate.", href: "/calculators/bmr-calculator", icon: <Heart className="w-5 h-5 text-pink-500" /> },
      { name: "TDEE Calculator", desc: "Total daily energy expenditure.", href: "/calculators/bmr-calculator", icon: <Heart className="w-5 h-5 text-pink-500" /> },
      { name: "Body Fat", desc: "Estimate body fat percentage.", href: "/calculators/body-fat-calculator", icon: <Calculator className="w-5 h-5 text-pink-500" /> },
      { name: "Pregnancy Due Date", desc: "Estimate conception & due dates.", href: "/calculators/pregnancy-due-date", icon: <Baby className="w-5 h-5 text-pink-500" /> },
    ]
  },
  {
    slug: "utility",
    category: "Basic Utilities",
    icon: <Calendar className="w-6 h-6 text-slate-500" />,
    calculators: [
      { name: "Age Calculator", desc: "Calculate exact age in years, months, days.", href: "/calculators/age-calculator", icon: <Calendar className="w-5 h-5 text-slate-500" /> },
      { name: "Basic Calculator", desc: "Standard arithmetic operations.", href: "/calculators/basic-calculator", icon: <Calculator className="w-5 h-5 text-slate-500" /> },
      { name: "Measurement Converter", desc: "Convert length, weight, area & volume.", href: "/calculators/measurement-calculator", icon: <Ruler className="w-5 h-5 text-slate-500" /> },
      { name: "Percentage Calculator", desc: "Calculate percentages and changes.", href: "/calculators/percentage-calculator", icon: <Percent className="w-5 h-5 text-slate-500" /> },
      { name: "Date & Time", desc: "Calculate durations between dates.", href: "/calculators/date-time-calculator", icon: <Clock className="w-5 h-5 text-slate-500" /> },
      { name: "Tip Calculator", desc: "Calculate tips and split bills.", href: "/calculators/tip-calculator", icon: <Utensils className="w-5 h-5 text-slate-500" /> },
      { name: "Salary Converter", desc: "Convert hourly, daily, annual wages.", href: "/calculators/salary-calculator", icon: <Banknote className="w-5 h-5 text-slate-500" /> },
      { name: "50/30/20 Budget", desc: "Split your income into needs, wants, and savings.", href: "/calculators/budget-calculator", icon: <Wallet className="w-5 h-5 text-slate-500" /> },
      { name: "Currency Converter", desc: "Live exchange rates for world currencies.", href: "/calculators/currency-converter", icon: <DollarSign className="w-5 h-5 text-slate-500" /> },
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
      href: c.href,
      icon: c.icon
    }));
}
