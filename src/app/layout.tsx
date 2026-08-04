import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SOCIAL_PROFILES, CONTACT_EMAIL } from '@/config/site';
import { ROBOTS_DIRECTIVE } from '@/config/deployment';
import { bylineFor } from '@/config/authors';
import { Suspense } from 'react';
import { NavigationProgress } from '@/components/layout/navigation-progress';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    // Child routes supply only their own title; this appends the brand once.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // Derived from src/config/authors.ts rather than hardcoded, so the site-wide
  // author meta tag cannot assert a credential that config treats as unverified.
  authors: [{ name: bylineFor('Rahul Sharma'), url: `${SITE_URL}/authors/rahul-sharma` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@numeraise',
    creator: '@numeraise',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  // Resolves to noindex,nofollow on any preview or branch deployment, so a
  // generated *.vercel.app or *.netlify.app URL can never rank against the
  // canonical domain. See src/config/deployment.ts.
  robots: ROBOTS_DIRECTIVE,
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
            {/*
              Appears on the click itself, before React begins rendering — the
              exact window in which tapping a link produced no visible response.
              useSearchParams requires a Suspense boundary during prerender.
            */}
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
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
        {/*
          Plain <script>, NOT next/script's <Script>.

          <Script> defaults to strategy="afterInteractive", which injects the tag
          client-side after hydration. The Organization and WebSite graph was
          therefore never present in the server HTML: measured across all 127
          URLs, `"@type":"Organization"` appeared 0 times, while 86 pages emitted
          `"provider":{"@id":".../#organization"}` and `"publisher":{...}`
          references pointing at a node that did not exist. Every one of those
          @id references was a dangling pointer.

          Crawlers parse the server response. JSON-LD must be in it.
        */}
        <script
          id="global-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  // Brand disambiguation. "Numeraise" sits one character from
                  // "numeraire", an established economics term with its own
                  // Wikipedia entity in the same subject domain -- Bing
                  // autocorrects the query and the site does not rank for its
                  // own brand. alternateName plus sameAs are the on-page half of
                  // teaching engines this is a distinct entity.
                  alternateName: ['Numeraise.com', 'Numeraise Calculators'],
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  email: CONTACT_EMAIL,
                  foundingDate: '2026-06-08',
                  knowsAbout: [
                    'Personal finance',
                    'Investment calculators',
                    'Loan amortisation',
                    'Indian income tax',
                    'Retirement planning',
                  ],
                  logo: {
                    '@type': 'ImageObject',
                    '@id': `${SITE_URL}/#logo`,
                    url: `${SITE_URL}/og-image.png`,
                    width: 1200,
                    height: 630,
                  },
                  // sameAs is the strongest cheap entity signal for a new domain:
                  // it ties the site to verifiable off-site profiles.
                  sameAs: SOCIAL_PROFILES,
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: CONTACT_EMAIL,
                    url: `${SITE_URL}/contact`,
                    availableLanguage: ['English'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  description: SITE_DESCRIPTION,
                  inLanguage: 'en',
                  publisher: { '@id': `${SITE_URL}/#organization` },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/calculators?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
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
