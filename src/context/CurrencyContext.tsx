'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Currency = {
  code: string;
  symbol: string;
  rate: number;
};

export type EconomicRates = {
  inflation: number;
  equity: number;
  debt: number;
  homeLoan: number;
  tax: number;
};

export const GLOBAL_RATES: Record<string, EconomicRates> = {
  USD: { inflation: 3, equity: 10, debt: 5, homeLoan: 7, tax: 24 },
  INR: { inflation: 6, equity: 12, debt: 7, homeLoan: 8.5, tax: 18 },
  GBP: { inflation: 4, equity: 8, debt: 5, homeLoan: 6, tax: 20 },
  EUR: { inflation: 3, equity: 8, debt: 4, homeLoan: 5, tax: 21 },
  CAD: { inflation: 3, equity: 8, debt: 5, homeLoan: 6, tax: 15 },
  AUD: { inflation: 4, equity: 9, debt: 5, homeLoan: 6, tax: 30 },
  SGD: { inflation: 3, equity: 8, debt: 4, homeLoan: 4, tax: 17 },
  AED: { inflation: 2, equity: 7, debt: 4, homeLoan: 4, tax: 9 },
};

// Fallback rates used when offline or API unavailable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.00,
  INR: 83.00,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.35,
  AUD: 1.52,
  SGD: 1.34,
  AED: 3.67,
};

const CURRENCY_META: Record<string, { symbol: string }> = {
  USD: { symbol: '$' },
  INR: { symbol: '₹' },
  GBP: { symbol: '£' },
  EUR: { symbol: '€' },
  CAD: { symbol: 'C$' },
  AUD: { symbol: 'A$' },
  SGD: { symbol: 'S$' },
  AED: { symbol: 'د.إ' },
};

const CACHE_KEY = 'fx_rates_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function buildCurrencies(rates: Record<string, number>): Record<string, Currency> {
  return Object.fromEntries(
    Object.entries(CURRENCY_META).map(([code, { symbol }]) => [
      code,
      { code, symbol, rate: rates[code] ?? FALLBACK_RATES[code] },
    ])
  );
}

async function fetchLiveRates(): Promise<Record<string, number> | null> {
  try {
    // Check localStorage cache first (1-hour TTL)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) return rates;
      }
    }
    // Frankfurter API — completely free, no API key, CORS-safe
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=INR,GBP,EUR,CAD,AUD,SGD,AED'
    ).catch(() => null);
    
    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || !data.rates) return null;
    
    const rates: Record<string, number> = { USD: 1.00, ...data.rates };
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
    }
    return rates;
  } catch {
    return null;
  }
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  convert: (amountInUSD: number) => number;
  format: (amountInUSD: number) => string;
  availableCurrencies: Record<string, Currency>;
  ratesLoading: boolean;
  economicRates: EconomicRates;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [currencies, setCurrencies] = useState(() => buildCurrencies(FALLBACK_RATES));
  const [currencyCode, setCurrencyCode] = useState('USD');

  // Fetch live rates on mount
  useEffect(() => {
    fetchLiveRates().then(liveRates => {
      const r = liveRates ?? FALLBACK_RATES;
      setRates(r);
      setCurrencies(buildCurrencies(r));
      setRatesLoading(false);
    });
  }, []);

  // Detect and update currency whenever route changes
  useEffect(() => {
    if (!pathname) return;

    // US Tools -> strictly USD
    const usTools = [
      '/sales-tax-calculator', '/us-mortgage-calculator', '/401k-calculator',
      '/cd-calculator', '/paycheck-calculator', '/roth-ira', '/traditional-ira'
    ];
    if (usTools.some(tool => pathname.includes(tool))) {
      setCurrencyCode('USD');
      return;
    }

    // UK Tools -> strictly GBP
    const ukTools = ['/vat-calculator', '/uk-mortgage-calculator', '/isa-calculator'];
    if (ukTools.some(tool => pathname.includes(tool))) {
      setCurrencyCode('GBP');
      return;
    }

    // India-Specific Regulations -> strictly INR
    const indiaTools = [
      '/gst-calculator', '/epf-calculator', '/pomis-calculator', '/scss-calculator',
      '/ppf-calculator', '/ssy-calculator', '/nps-calculator', '/hra-exemption',
      '/income-tax-calculator', '/gratuity-calculator', '/advance-tax',
      '/tds-calculator', '/nsc-calculator', '/pension-calculator', '/flat-vs-reducing-loan'
    ];
    if (indiaTools.some(tool => pathname.includes(tool))) {
      setCurrencyCode('INR');
      return;
    }

    // Check localStorage for universal tools
    const saved = localStorage.getItem('preferredCurrency');
    if (saved && CURRENCY_META[saved]) {
      setCurrencyCode(saved);
      return;
    }

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Kolkata') || tz.includes('Calcutta')) setCurrencyCode('INR');
      else if (tz.includes('London') || tz.includes('Belfast')) setCurrencyCode('GBP');
      else if (tz.startsWith('Europe/')) setCurrencyCode('EUR');
      else if (['Toronto','Vancouver','Montreal','Winnipeg','Edmonton'].some(c => tz.includes(c))) setCurrencyCode('CAD');
      else if (tz.startsWith('Australia/')) setCurrencyCode('AUD');
      else if (tz.includes('Singapore')) setCurrencyCode('SGD');
      else if (tz.includes('Dubai')) setCurrencyCode('AED');
      else setCurrencyCode('USD');
    } catch {
  }, [pathname]);

  const currency = currencies[currencyCode] ?? currencies['USD'];
  const economicRates = GLOBAL_RATES[currencyCode] ?? GLOBAL_RATES['USD'];

  const setCurrency = (code: string) => {
    if (CURRENCY_META[code]) {
      setCurrencyCode(code);
      localStorage.setItem('preferredCurrency', code);
      window.dispatchEvent(new Event('currencyChange'));
    }
  };

  const convert = (amountInUSD: number): number => amountInUSD * currency.rate;

  const format = (amountInUSD: number): string => {
    const converted = convert(amountInUSD);
    const sym = currency.symbol;

    if (currency.code === 'INR') {
      if (converted >= 10_000_000) return `${sym}${(converted / 10_000_000).toFixed(2)} Cr`;
      if (converted >= 100_000)    return `${sym}${(converted / 100_000).toFixed(2)} L`;
      return `${sym}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    // For non-INR: only abbreviate above 10K to avoid awkward "£1.2K" for £1,200
    if (converted >= 1_000_000) return `${sym}${(converted / 1_000_000).toFixed(2)}M`;
    if (converted >= 10_000)    return `${sym}${(converted / 1_000).toFixed(1)}K`;
    return `${sym}${Math.round(converted).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, availableCurrencies: currencies, ratesLoading, economicRates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
