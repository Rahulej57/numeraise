import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Numeraise | Smart Financial Calculators & Planning Tools",
  description: "Plan investments, loans, taxes, retirement, and wealth creation using our powerful suite of 50+ financial calculators designed for smarter decisions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://numeraise.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Numeraise | Smart Financial Calculators",
    description: "Plan investments, loans, taxes, retirement, and wealth creation using our powerful suite of 50+ financial calculators.",
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
    title: "Numeraise | Smart Financial Calculators",
    description: "50+ Financial Calculators designed for smarter decisions.",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
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
};

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { QuickLauncher } from "@/components/layout/quick-launcher";

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-background text-foreground overscroll-x-none`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
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
      </body>
    </html>
  );
}
