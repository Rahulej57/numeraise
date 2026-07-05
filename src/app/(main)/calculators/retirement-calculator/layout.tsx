import { Metadata } from 'next';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';

export async function generateMetadata(): Promise<Metadata> {
  const slug = 'retirement-calculator';
  let name = slug.replace(/-/g, ' ');
  let desc = 'Financial Calculator';

  for (const category of CALCULATOR_DIRECTORY) {
    const calc = category.calculators.find((c) => c.href.includes(slug));
    if (calc) {
      name = calc.name;
      desc = calc.desc;
      break;
    }
  }

  // Generate a high-quality, SEO-optimized description between 140-160 characters
  let seoDesc = `Use our free ${name} to estimate, calculate, and analyze details. ${desc} Plan smarter and manage your money better with Numeraise.`;
  if (seoDesc.length < 140) {
    seoDesc = `Use our free ${name} to calculate, estimate, and analyze details. ${desc} Plan your wealth and make smarter money decisions with Numeraise.`;
  }
  if (seoDesc.length > 160) {
    seoDesc = seoDesc.substring(0, 157) + '...';
  }

  return {
    title: `${name} | Numeraise`,
    description: seoDesc,
    alternates: {
      canonical: `/calculators/${slug}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
