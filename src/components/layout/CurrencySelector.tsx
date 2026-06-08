'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const currencyFlags: Record<string, string> = {
  USD: '🇺🇸', INR: '🇮🇳', GBP: '🇬🇧', EUR: '🇪🇺',
  CAD: '🇨🇦', AUD: '🇦🇺', SGD: '🇸🇬', AED: '🇦🇪',
};

export default function CurrencySelector() {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-lg cursor-pointer text-sm font-medium transition-colors"
      >
        <span>{currencyFlags[currency.code]}</span>
        <span className="hidden sm:inline">{currency.code}</span>
        <span className="text-muted-foreground text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
          {Object.entries(availableCurrencies).map(([code, curr]) => (
            <button
              key={code}
              onClick={() => { setCurrency(code); setIsOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm cursor-pointer hover:bg-muted transition-colors ${
                currency.code === code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
              }`}
            >
              <span className="text-lg">{currencyFlags[code]}</span>
              <span className="flex-1">{curr.symbol}</span>
              <span className="text-muted-foreground">{code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
