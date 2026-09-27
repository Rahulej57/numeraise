import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/config/site';

export const metadata: Metadata = {
  title: `Free Financial Calculator Widgets for Your Website | ${SITE_NAME}`,
  description:
    'Embed responsive, lightweight, and private financial calculators (SIP, Loan EMI, Compound Interest, PPF) on your blog, WordPress, or website with one click.',
  alternates: {
    canonical: `${SITE_URL}/widgets`,
  },
  openGraph: {
    title: 'Free Financial Calculator Widgets for Bloggers & Webmasters',
    description:
      'Embed interactive SIP, EMI, and investment calculators on your site for free. Zero coding required, 100% private and responsive.',
    url: `${SITE_URL}/widgets`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Financial Calculator Widgets for Your Website',
    description:
      'Embed interactive SIP, EMI, and investment calculators on your site for free. Zero coding required, 100% private and responsive.',
  },
};

export default function WidgetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
