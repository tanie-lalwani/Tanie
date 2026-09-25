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
    "booking-appointments-engine": number;
    "staff-team-management-portal": number;
    "interactive-3d-experience": number;
    "fullstack-web-app": number;
  };
  // Specific market pricing for calculator bundles
  bundles: Record<string, number>;
  // Specific market pricing for package addons
  addons: Record<string, number>;
}

export const MARKET_TIERS: Record<string, MarketPricingTier> = {
  // 🇮🇳 INDIA (Domestic Market Pricing - Fast Acquisition Tier)
  IN: {
    countryCode: "IN",
    countryName: "India",
    flag: "🇮🇳",
    currencyCode: "INR",
    currencySymbol: "₹",
    packages: {
      "luxury-landing-sprint": 4999,
      "growth-marketing-campaigns": 19999,
      "booking-appointments-engine": 19999,
      "staff-team-management-portal": 24999,
      "interactive-3d-experience": 39999,
      "fullstack-web-app": 69999
    },
    bundles: {
      essential_core: 4999,
      ecommerce_ordering: 8999,
      booking_appointments: 6999,
      lead_crm: 5499,
      ai_assistant: 6999,
      design_3d_gsap: 11999,
      staff_portal: 6999,
      multi_location: 5999,
      growth_seo: 4499,
      marketing_funnel_suite: 29999,
      source_attribution_hub: 5499,
      custom_integrations: 7999,
      devops_care: 3499
    },
    addons: {
      cms: 3499,
      ai: 4999,
      audio: 2499,
      copywriting: 3499,
      subpages: 1999,
      newsletter: 1999,
      priority: 6999
    }
  },

  // 🇺🇸 UNITED STATES & GLOBAL TIER 1 (International Market Pricing - Fast Acquisition Tier)
  US: {
    countryCode: "US",
    countryName: "United States (Global)",
    flag: "🇺🇸",
    currencyCode: "USD",
    currencySymbol: "$",
    packages: {
      "luxury-landing-sprint": 99,
      "growth-marketing-campaigns": 499,
      "booking-appointments-engine": 499,
      "staff-team-management-portal": 599,
      "interactive-3d-experience": 899,
      "fullstack-web-app": 1499
    },
    bundles: {
      essential_core: 175,
      ecommerce_ordering: 295,
      booking_appointments: 235,
      lead_crm: 185,
      ai_assistant: 235,
      design_3d_gsap: 395,
      staff_portal: 235,
      multi_location: 195,
      growth_seo: 150,
      marketing_funnel_suite: 899,
      source_attribution_hub: 185,
      custom_integrations: 265,
      devops_care: 120
    },
    addons: {
      cms: 120,
      ai: 175,
      audio: 90,
      copywriting: 120,
      subpages: 75,
      newsletter: 75,
      priority: 250
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
      "luxury-landing-sprint": 79,
      "growth-marketing-campaigns": 399,
      "booking-appointments-engine": 399,
      "staff-team-management-portal": 479,
      "interactive-3d-experience": 729,
      "fullstack-web-app": 1199
    },
    bundles: {
      essential_core: 140,
      ecommerce_ordering: 235,
      booking_appointments: 190,
      lead_crm: 150,
      ai_assistant: 190,
      design_3d_gsap: 315,
      staff_portal: 190,
      multi_location: 155,
      growth_seo: 120,
      marketing_funnel_suite: 720,
      source_attribution_hub: 150,
      custom_integrations: 210,
      devops_care: 95
    },
    addons: {
      cms: 95,
      ai: 140,
      audio: 70,
      copywriting: 95,
      subpages: 60,
      newsletter: 60,
      priority: 200
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
      "luxury-landing-sprint": 89,
      "growth-marketing-campaigns": 459,
      "booking-appointments-engine": 459,
      "staff-team-management-portal": 549,
      "interactive-3d-experience": 819,
      "fullstack-web-app": 1379
    },
    bundles: {
      essential_core: 160,
      ecommerce_ordering: 270,
      booking_appointments: 215,
      lead_crm: 170,
      ai_assistant: 215,
      design_3d_gsap: 360,
      staff_portal: 215,
      multi_location: 180,
      growth_seo: 140,
      marketing_funnel_suite: 830,
      source_attribution_hub: 170,
      custom_integrations: 245,
      devops_care: 110
    },
    addons: {
      cms: 110,
      ai: 160,
      audio: 85,
      copywriting: 110,
      subpages: 70,
      newsletter: 70,
      priority: 230
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
      "luxury-landing-sprint": 370,
      "growth-marketing-campaigns": 1820,
      "booking-appointments-engine": 1820,
      "staff-team-management-portal": 2170,
      "interactive-3d-experience": 3270,
      "fullstack-web-app": 5470
    },
    bundles: {
      essential_core: 650,
      ecommerce_ordering: 1090,
      booking_appointments: 860,
      lead_crm: 680,
      ai_assistant: 860,
      design_3d_gsap: 1450,
      staff_portal: 860,
      multi_location: 720,
      growth_seo: 550,
      marketing_funnel_suite: 3300,
      source_attribution_hub: 680,
      custom_integrations: 970,
      devops_care: 440
    },
    addons: {
      cms: 440,
      ai: 640,
      audio: 330,
      copywriting: 440,
      subpages: 275,
      newsletter: 275,
      priority: 920
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
      "luxury-landing-sprint": 135,
      "growth-marketing-campaigns": 680,
      "booking-appointments-engine": 680,
      "staff-team-management-portal": 810,
      "interactive-3d-experience": 1220,
      "fullstack-web-app": 2040
    },
    bundles: {
      essential_core: 240,
      ecommerce_ordering: 400,
      booking_appointments: 320,
      lead_crm: 250,
      ai_assistant: 320,
      design_3d_gsap: 530,
      staff_portal: 320,
      multi_location: 265,
      growth_seo: 205,
      marketing_funnel_suite: 1220,
      source_attribution_hub: 250,
      custom_integrations: 360,
      devops_care: 160
    },
    addons: {
      cms: 160,
      ai: 240,
      audio: 120,
      copywriting: 160,
      subpages: 100,
      newsletter: 100,
      priority: 340
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
      "luxury-landing-sprint": 150,
      "growth-marketing-campaigns": 760,
      "booking-appointments-engine": 760,
      "staff-team-management-portal": 910,
      "interactive-3d-experience": 1360,
      "fullstack-web-app": 2270
    },
    bundles: {
      essential_core: 265,
      ecommerce_ordering: 445,
      booking_appointments: 355,
      lead_crm: 280,
      ai_assistant: 355,
      design_3d_gsap: 595,
      staff_portal: 355,
      multi_location: 295,
      growth_seo: 225,
      marketing_funnel_suite: 1360,
      source_attribution_hub: 280,
      custom_integrations: 400,
      devops_care: 180
    },
    addons: {
      cms: 180,
      ai: 265,
      audio: 135,
      copywriting: 180,
      subpages: 115,
      newsletter: 115,
      priority: 380
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
      "luxury-landing-sprint": 130,
      "growth-marketing-campaigns": 655,
      "booking-appointments-engine": 655,
      "staff-team-management-portal": 785,
      "interactive-3d-experience": 1185,
      "fullstack-web-app": 1985
    },
    bundles: {
      essential_core: 235,
      ecommerce_ordering: 395,
      booking_appointments: 315,
      lead_crm: 245,
      ai_assistant: 315,
      design_3d_gsap: 525,
      staff_portal: 315,
      multi_location: 260,
      growth_seo: 200,
      marketing_funnel_suite: 1190,
      source_attribution_hub: 245,
      custom_integrations: 355,
      devops_care: 160
    },
    addons: {
      cms: 160,
      ai: 235,
      audio: 120,
      copywriting: 160,
      subpages: 100,
      newsletter: 100,
      priority: 335
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
