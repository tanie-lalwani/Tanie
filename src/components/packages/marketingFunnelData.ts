export type WebsiteMarketingScope = "ecommerce" | "single_product" | "personal_brand";

export interface MarketingFunnelSuiteProps {
  currency?: "USD" | "INR";
  onCurrencyChange?: (c: "USD" | "INR") => void;
  onBookMarketingPackage: (packageDetails: {
    packageName: string;
    businessModel: string;
    selectedItems: string[];
    priceInr?: number;
    priceUsd?: number;
    priceAmount?: number;
    currencyCode?: string;
    currencySymbol?: string;
    formattedPrice?: string;
    timeline: string;
  }) => void;
}

export interface BofuPageModule {
  id: string;
  title: string;
  badge: string;
  icon: string;
  shortDesc: string;
  websiteScope: {
    ecommerce: string;
    single_product: string;
    personal_brand: string;
  };
  conversionMetric: string;
}

export const BOFU_PAGE_MODULES: BofuPageModule[] = [
  {
    id: "checkout_flow",
    title: "Check Out Mockup & Flow",
    badge: "Revenue Engine",
    icon: "💳",
    shortDesc: "Frictionless 1-page checkout flow with express mobile wallets and zero distraction.",
    websiteScope: {
      ecommerce: "Slide-over cart with 1-click Apple Pay, Google Pay, Razorpay, UPI & credit card support.",
      single_product: "One-page high-converting checkout landing page with 1-click order bump upsell.",
      personal_brand: "Secure consultation deposit checkout, contract billing, or stripe subscription invoice."
    },
    conversionMetric: "Cuts cart abandonment by up to 35%"
  },
  {
    id: "countdown_timers",
    title: "Countdown Urgency Clocks",
    badge: "Urgency Driver",
    icon: "⏳",
    shortDesc: "Real-time urgency countdown tickers on landing pages driving immediate purchase commitment.",
    websiteScope: {
      ecommerce: "Timed flash sale ticker, next-day shipping dispatch timer ('Order within 2h 14m').",
      single_product: "Limited batch quantity countdown: 'Batch #04 Closes In 14:22 Minutes'.",
      personal_brand: "Cohort intake deadline or monthly consulting client slots locking down."
    },
    conversionMetric: "Boosts immediate checkout conversion by +22%"
  },
  {
    id: "offer_first_banners",
    title: "Offer-First Announcement Strip",
    badge: "Attention Grabber",
    icon: "🎁",
    shortDesc: "High-contrast marquee & smart offer banners displaying exclusive first-order perks or bundles.",
    websiteScope: {
      ecommerce: "Sticky free shipping progress bar ('Add $14 more for Free Priority Dispatch').",
      single_product: "Buy 1 Get 1 complimentary accessory or lifetime warranty banner.",
      personal_brand: "Free audit voucher or downloadable masterclass blueprint pinned atop site."
    },
    conversionMetric: "Raises top-of-funnel engagement by 28%"
  },
  {
    id: "product_images_gallery",
    title: "360° Zoom Product Imagery",
    badge: "Clarity & Detail",
    icon: "🔍",
    shortDesc: "High-resolution multi-angle macro zooms, color swatch switchers, and interactive tactile views.",
    websiteScope: {
      ecommerce: "Multi-angle photo switcher with instant thumbnail zoom and fabric detail preview.",
      single_product: "Interactive 3D/360 spin or exploded engineering parts showcase.",
      personal_brand: "Editorial portfolio snapshots, speaking engagement stills, and media feature gallery."
    },
    conversionMetric: "Decreases product return inquiries by 40%"
  },
  {
    id: "studio_shoots_presentation",
    title: "Editorial Studio Lookbook",
    badge: "Aesthetic Halo",
    icon: "📸",
    shortDesc: "High-fashion studio shoot integration with lifestyle atmosphere that justifies premium pricing.",
    websiteScope: {
      ecommerce: "Lookbook grid with 'Shop the Look' clickable hotspots over studio photography.",
      single_product: "Editorial hero banners showcasing the product in luxury, real-world context.",
      personal_brand: "High-caliber executive portraiture and workspace environmental photography."
    },
    conversionMetric: "Increases average perceived brand value by 3x"
  },
  {
    id: "ugc_wall",
    title: "TikTok / IG Video UGC Wall",
    badge: "Social Proof",
    icon: "📱",
    shortDesc: "Embedded 9:16 vertical TikTok/Reels video reviews from verified customers with shoppable links.",
    websiteScope: {
      ecommerce: "Shoppable customer video carousel with direct product tag popups.",
      single_product: "Unboxing reaction compilation and verified before/after results loop.",
      personal_brand: "Video testimonials from client founders highlighting revenue spikes."
    },
    conversionMetric: "Generates 4x higher trust than standard text reviews"
  },
  {
    id: "price_comparison_matrix",
    title: "Competitor 'Us vs Them' Matrix",
    badge: "Objection Killer",
    icon: "⚖️",
    shortDesc: "Side-by-side benchmark table comparing your craftsmanship and specs against traditional alternatives.",
    websiteScope: {
      ecommerce: "Detailed materials comparison: Real Italian Leather vs Cheap Bonded Alternatives.",
      single_product: "Proprietary technology breakdown highlighting unique patented advantages.",
      personal_brand: "Why boutique dedicated bespoke engineering beats sluggish generic agencies."
    },
    conversionMetric: "Shortens evaluation cycle by overcoming buyer doubts"
  },
  {
    id: "fomo_scarcity_notifiers",
    title: "Real-Time FOMO Activity Toasts",
    badge: "Social Momentum",
    icon: "🔥",
    shortDesc: "Micro popups displaying verified live order activity ('Sarah from London just ordered 2m ago').",
    websiteScope: {
      ecommerce: "Subtle toast popups in bottom left showing recent orders & high stock velocity.",
      single_product: "Live stock counter: 'Only 7 left in Stock — 38 people viewing right now'.",
      personal_brand: "Notification of latest client onboarding or speaking keynotes booked."
    },
    conversionMetric: "Adds urgency that nudges hesitant on-the-fence visitors"
  },
  {
    id: "freebie_lead_magnets",
    title: "Lead Magnet & Exit-Intent Trap",
    badge: "List Builder",
    icon: "🧲",
    shortDesc: "High-value downloadable cheatsheets, discount roulette wheels, or exit-intent capture modals.",
    websiteScope: {
      ecommerce: "Instant 15% discount code delivered via SMS / Email upon exit-intent mouse track.",
      single_product: "Free sample pack or digital buyer guide download in exchange for WhatsApp opt-in.",
      personal_brand: "Qualifies high-ticket leads and collects project budgets before routing to founder calendar."
    },
    conversionMetric: "Recovers 20-30% of abandoning shoppers by answering doubts in real time"
  }
];
