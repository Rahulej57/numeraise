import { Metadata } from 'next';
import { CALCULATOR_DIRECTORY } from '@/config/calculators';

export async function generateMetadata(): Promise<Metadata> {
  const slug = 'nsc-calculator';
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

  return {
    title: `${name} | Numeraise`,
    description: desc,
    alternates: {
      canonical: `/calculators/${slug}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
