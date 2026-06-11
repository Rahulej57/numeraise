import { HeroSection } from '@/components/home/hero-section';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { PopularCalculators } from '@/components/home/popular-calculators';
import { ComparisonShowcase } from '@/components/home/comparison-showcase';

export const metadata = {
  title: 'Numeraise - Free Financial Calculators for Investment, Loans & Tax',
  description:
    'Plan investments, loans, taxes, retirement, and wealth creation using our powerful suite of 50+ financial calculators designed for smarter decisions.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative pb-20 md:pb-0">
      <HeroSection />
      <PopularCalculators />
      <CategoryShowcase />
      <ComparisonShowcase />
    </div>
  );
}
