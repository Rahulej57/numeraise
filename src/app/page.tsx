import { HeroSection } from '@/components/home/hero-section';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { PopularCalculators } from '@/components/home/popular-calculators';
import { ComparisonShowcase } from '@/components/home/comparison-showcase';
import { HomeIntro } from '@/components/home/home-intro';

export const metadata = {
  // `title.absolute` opts out of the root layout's "%s | Numeraise" template so
  // the homepage title is not "... | Numeraise | Numeraise".
  title: { absolute: 'Numeraise: Free Financial Calculators for SIP, EMI & Tax' },
  description:
    '70+ free financial calculators for SIP, EMI, income tax, PPF and retirement. Every formula shown, no signup, and your figures never leave your browser.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative pb-20 md:pb-0">
      <HeroSection />
      <PopularCalculators />
      <CategoryShowcase />
      <ComparisonShowcase />
      {/* The homepage rendered 153 visible words before this. */}
      <HomeIntro />
    </div>
  );
}
