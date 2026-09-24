// ==============================================================================
// GEO-IP MARKET PRICING CONFIGURATION (Purchasing Power & Market-Specific Tiers)
// ==============================================================================

export interface MarketPricingTier {
  countryCode: string;
  countryName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  // Specific market pricing per package
  packages: {
    "luxury-landing-sprint": number;
    "growth-marketing-campaigns": number;
    "interactive-3d-experience": number;
    "fullstack-web-app": number;
  };
  // Specific market pricing for calculator bundles
  bundles: Record<string, number>;
  // Specific market pricing for package addons
  addons: Record<string, number>;
}

export const MARKET_TIERS: Record<string, MarketPricingTier> = {
  // 🇮🇳 INDIA (Domestic Market Pricing)
  IN: {
    countryCode: "IN",
    countryName: "India",
    flag: "🇮🇳",
    currencyCode: "INR",
    currencySymbol: "₹",
    packages: {
      "luxury-landing-sprint": 1999,
      "growth-marketing-campaigns": 2899,
      "interactive-3d-experience": 3499,
      "fullstack-web-app": 4299
    },
    bundles: {
      essential_core: 500,
      ecommerce_ordering: 950,
      booking_appointments: 850,
      lead_crm: 650,
      ai_assistant: 800,
      design_3d_gsap: 750,
      multi_location: 600,
      growth_seo: 500,
      custom_integrations: 850,
      devops_care: 400
    },
    addons: {
      cms: 499,
      ai: 599,
      audio: 299,
      copywriting: 399,
      subpages: 349,
      newsletter: 199,
      priority: 799
    }
  },

  // 🇺🇸 UNITED STATES & GLOBAL TIER 1 (International Market Pricing)
  US: {
    countryCode: "US",
    countryName: "United States (Global)",
    flag: "🇺🇸",
    currencyCode: "USD",
    currencySymbol: "$",
    packages: {
      "luxury-landing-sprint": 1999,
      "growth-marketing-campaigns": 2899,
      "interactive-3d-experience": 3499,
      "fullstack-web-app": 4299
    },
    bundles: {
      essential_core: 75,
      ecommerce_ordering: 135,
      booking_appointments: 120,
      lead_crm: 95,
      ai_assistant: 115,
      design_3d_gsap: 110,
      multi_location: 85,
      growth_seo: 70,
      custom_integrations: 125,
      devops_care: 60
    },
    addons: {
      cms: 499,
      ai: 599,
      audio: 299,
      copywriting: 399,
      subpages: 349,
      newsletter: 199,
      priority: 799
    }
  },

  // 🇬🇧 UNITED KINGDOM
  GB: {
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    currencyCode: "GBP",
    currencySymbol: "£",
    packages: {
      "luxury-landing-sprint": 1699,
      "growth-marketing-campaigns": 2499,
      "interactive-3d-experience": 2999,
      "fullstack-web-app": 3699
    },
    bundles: {
      essential_core: 65,
      ecommerce_ordering: 115,
      booking_appointments: 100,
      lead_crm: 80,
      ai_assistant: 95,
      design_3d_gsap: 90,
      multi_location: 70,
      growth_seo: 60,
      custom_integrations: 105,
      devops_care: 50
    },
    addons: {
      cms: 420,
      ai: 499,
      audio: 250,
      copywriting: 340,
      subpages: 299,
      newsletter: 170,
      priority: 680
    }
  },

  // 🇪🇺 EUROPEAN UNION (Eurozone)
  EU: {
    countryCode: "EU",
    countryName: "Europe (Eurozone)",
    flag: "🇪🇺",
    currencyCode: "EUR",
    currencySymbol: "€",
    packages: {
      "luxury-landing-sprint": 1899,
      "growth-marketing-campaigns": 2749,
      "interactive-3d-experience": 3299,
      "fullstack-web-app": 4099
    },
    bundles: {
      essential_core: 70,
      ecommerce_ordering: 125,
      booking_appointments: 110,
      lead_crm: 90,
      ai_assistant: 105,
      design_3d_gsap: 100,
      multi_location: 80,
      growth_seo: 65,
      custom_integrations: 115,
      devops_care: 55
    },
    addons: {
      cms: 460,
      ai: 550,
      audio: 275,
      copywriting: 370,
      subpages: 320,
      newsletter: 185,
      priority: 740
    }
  },

  // 🇦🇪 UNITED ARAB EMIRATES & GCC
  AE: {
    countryCode: "AE",
    countryName: "UAE / Middle East",
    flag: "🇦🇪",
    currencyCode: "AED",
    currencySymbol: "AED ",
    packages: {
      "luxury-landing-sprint": 7350,
      "growth-marketing-campaigns": 10650,
      "interactive-3d-experience": 12850,
      "fullstack-web-app": 15790
    },
    bundles: {
      essential_core: 275,
      ecommerce_ordering: 495,
      booking_appointments: 440,
      lead_crm: 350,
      ai_assistant: 420,
      design_3d_gsap: 400,
      multi_location: 310,
      growth_seo: 260,
      custom_integrations: 460,
      devops_care: 220
    },
    addons: {
      cms: 1830,
      ai: 2200,
      audio: 1100,
      copywriting: 1460,
      subpages: 1280,
      newsletter: 730,
      priority: 2930
    }
  },

  // 🇨🇦 CANADA
  CA: {
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    currencyCode: "CAD",
    currencySymbol: "C$",
    packages: {
      "luxury-landing-sprint": 2699,
      "growth-marketing-campaigns": 3899,
      "interactive-3d-experience": 4699,
      "fullstack-web-app": 5799
    },
    bundles: {
      essential_core: 100,
      ecommerce_ordering: 180,
      booking_appointments: 160,
      lead_crm: 130,
      ai_assistant: 155,
      design_3d_gsap: 150,
      multi_location: 115,
      growth_seo: 95,
      custom_integrations: 170,
      devops_care: 80
    },
    addons: {
      cms: 670,
      ai: 800,
      audio: 400,
      copywriting: 540,
      subpages: 470,
      newsletter: 270,
      priority: 1080
    }
  },

  // 🇦🇺 AUSTRALIA
  AU: {
    countryCode: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    currencyCode: "AUD",
    currencySymbol: "A$",
    packages: {
      "luxury-landing-sprint": 2999,
      "growth-marketing-campaigns": 4399,
      "interactive-3d-experience": 5299,
      "fullstack-web-app": 6499
    },
    bundles: {
      essential_core: 115,
      ecommerce_ordering: 205,
      booking_appointments: 185,
      lead_crm: 145,
      ai_assistant: 175,
      design_3d_gsap: 170,
      multi_location: 130,
      growth_seo: 110,
      custom_integrations: 190,
      devops_care: 90
    },
    addons: {
      cms: 760,
      ai: 910,
      audio: 450,
      copywriting: 610,
      subpages: 530,
      newsletter: 300,
      priority: 1220
    }
  },

  // 🇸🇬 SINGAPORE
  SG: {
    countryCode: "SG",
    countryName: "Singapore",
    flag: "🇸🇬",
    currencyCode: "SGD",
    currencySymbol: "S$",
    packages: {
      "luxury-landing-sprint": 2699,
      "growth-marketing-campaigns": 3899,
      "interactive-3d-experience": 4699,
      "fullstack-web-app": 5799
    },
    bundles: {
      essential_core: 100,
      ecommerce_ordering: 180,
      booking_appointments: 160,
      lead_crm: 130,
      ai_assistant: 155,
      design_3d_gsap: 150,
      multi_location: 115,
      growth_seo: 95,
      custom_integrations: 170,
      devops_care: 80
    },
    addons: {
      cms: 670,
      ai: 800,
      audio: 400,
      copywriting: 540,
      subpages: 470,
      newsletter: 270,
      priority: 1080
    }
  }
};

// Map of European country codes to EU tier
const EU_COUNTRIES = new Set([
  "DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "FI", "GR", "SE", "DK", "PL", "CZ", "RO", "HU"
]);

// Map of Gulf / Middle East country codes to AE tier
const GCC_COUNTRIES = new Set([
  "AE", "SA", "QA", "KW", "OM", "BH"
]);

/**
 * Resolves a 2-letter ISO country code to our supported market tier key
 */
export function resolveMarketTier(countryCode: string | null | undefined): string {
  if (!countryCode) return "IN"; // Default to India
  const upper = countryCode.toUpperCase();

  if (MARKET_TIERS[upper]) {
    return upper;
  }
  if (EU_COUNTRIES.has(upper)) {
    return "EU";
  }
  if (GCC_COUNTRIES.has(upper)) {
    return "AE";
  }

  // Fallback: Western/Global to US, Asian/South Asian to IN
  const southAsia = new Set(["IN", "NP", "BD", "LK", "PK"]);
  if (southAsia.has(upper)) {
    return "IN";
  }

  return "US";
}

/**
 * Returns formatted package price based on market tier
 */
export function formatPackageMarketPrice(
  packageId: string,
  marketTierKey: string = "IN"
): { amount: number; formatted: string; symbol: string; currency: string } {
  const tier = MARKET_TIERS[marketTierKey] || MARKET_TIERS.IN;
  const amount = tier.packages[packageId as keyof typeof tier.packages] ?? tier.packages["luxury-landing-sprint"];
  return {
    amount,
    formatted: `${tier.currencySymbol}${amount.toLocaleString()}`,
    symbol: tier.currencySymbol,
    currency: tier.currencyCode
  };
}
