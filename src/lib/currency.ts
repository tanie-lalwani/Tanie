// ==============================================================================
// UNIVERSAL CURRENCY CONVERTER UTILITY & RATES
// Base Currency: INR (Indian Rupee)
// ==============================================================================

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  // Multiplier to convert from INR to Target Currency: target = inr * rateFromInr
  rateFromInr: number;
  formatDecimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    rateFromInr: 1.0,
    formatDecimals: 0
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    rateFromInr: 1 / 83.5, // 1 USD ≈ 83.5 INR
    formatDecimals: 0
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    rateFromInr: 1 / 91.0, // 1 EUR ≈ 91.0 INR
    formatDecimals: 0
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    rateFromInr: 1 / 106.5, // 1 GBP ≈ 106.5 INR
    formatDecimals: 0
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    rateFromInr: 1 / 22.7, // 1 AED ≈ 22.7 INR
    formatDecimals: 0
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    rateFromInr: 1 / 61.5, // 1 CAD ≈ 61.5 INR
    formatDecimals: 0
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "🇦🇺",
    rateFromInr: 1 / 55.0, // 1 AUD ≈ 55.0 INR
    formatDecimals: 0
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    name: "Singapore Dollar",
    flag: "🇸🇬",
    rateFromInr: 1 / 63.0, // 1 SGD ≈ 63.0 INR
    formatDecimals: 0
  }
};

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

/**
 * Converts a base INR price to the target currency
 */
export function convertFromInr(priceInr: number, targetCurrency: string = "INR"): {
  rawAmount: number;
  roundedAmount: number;
  formatted: string;
  symbol: string;
  code: string;
} {
  const config = SUPPORTED_CURRENCIES[targetCurrency.toUpperCase()] || SUPPORTED_CURRENCIES.INR;
  const raw = priceInr * config.rateFromInr;
  const rounded = Math.round(raw);
  
  const formattedNumber = rounded.toLocaleString(undefined, {
    minimumFractionDigits: config.formatDecimals,
    maximumFractionDigits: config.formatDecimals
  });

  return {
    rawAmount: raw,
    roundedAmount: rounded,
    formatted: `${config.symbol}${formattedNumber}`,
    symbol: config.symbol,
    code: config.code
  };
}

/**
 * Format price directly with currency symbol
 */
export function formatCurrency(priceInr: number, targetCurrency: string = "INR"): string {
  return convertFromInr(priceInr, targetCurrency).formatted;
}
