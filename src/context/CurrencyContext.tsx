'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = {
  code: string;
  symbol: string;
  rate: number;
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
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS) return rates;
    }
    // Frankfurter API — completely free, no API key, CORS-safe
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=INR,GBP,EUR,CAD,AUD,SGD,AED'
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rates: Record<string, number> = { USD: 1.00, ...data.rates };
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
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
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
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

  // Detect user preferred currency from storage or timezone
  useEffect(() => {
    const pathname = window.location.pathname;
    
    // 1. Strongly typed URLs should force a specific currency on first load
    // so if a user shares a link to "sales-tax-calculator", the receiver sees USD
    // even if they are in India or haven't set a preference.
    if (pathname.includes('/sales-tax-calculator') || pathname.includes('us-mortgage-calculator') || pathname.includes('401k-calculator')) {
      setCurrencyCode('USD');
      return;
    }
    if (pathname.includes('/vat-calculator')) {
      setCurrencyCode('GBP');
      return;
    }
    if (pathname.includes('/gst-calculator')) {
      setCurrencyCode('INR');
      return;
    }

    // 2. Check localStorage
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
    } catch { /* silent fallback to USD */ }
  }, []);

  const currency = currencies[currencyCode] ?? currencies['USD'];

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
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, availableCurrencies: currencies, ratesLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
