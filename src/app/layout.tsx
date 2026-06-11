import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Numeraise | Smart Financial Calculators & Planning Tools',
  description:
    'Plan investments, loans, taxes, retirement, and wealth creation using our powerful suite of 50+ financial calculators designed for smarter decisions.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://numeraise.com'),
  openGraph: {
    title: 'Numeraise | Smart Financial Calculators',
    description:
      'Plan investments, loans, taxes, retirement, and wealth creation using our powerful suite of 50+ financial calculators.',
    url: 'https://numeraise.com',
    siteName: 'Numeraise',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Numeraise - Smart Financial Calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Numeraise | Smart Financial Calculators',
    description: '50+ Financial Calculators designed for smarter decisions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_SEARCH_CONSOLE_ID,
  },
};

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { QuickLauncher } from '@/components/layout/quick-launcher';

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-background text-foreground overscroll-x-none`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CurrencyProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                <Breadcrumbs />
                {children}
              </main>
              <Footer />
              <QuickLauncher />
            </div>
          </CurrencyProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Script
          id="global-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://numeraise.com/#organization',
                  name: 'Numeraise',
                  url: 'https://numeraise.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://numeraise.com/og-image.png',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://numeraise.com/#website',
                  url: 'https://numeraise.com',
                  name: 'Numeraise',
                  publisher: {
                    '@id': 'https://numeraise.com/#organization',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
