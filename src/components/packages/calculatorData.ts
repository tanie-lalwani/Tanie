export interface FeatureBundle {
  id: string;
  name: string;
  icon: string;
  priceInr: number;
  priceUsd: number;
  badge?: string;
  tagline: string;
  description: string;
  includedFeatures: string[];
  isEssential?: boolean;
}

export const FEATURE_BUNDLES: FeatureBundle[] = [
  {
    id: "essential_core",
    name: "Luxury Brand Landing Foundation",
    icon: "🏛️",
    priceInr: 4999,
    priceUsd: 99,
    isEssential: true,
    badge: "Base Included",
    tagline: "Ultra-fast modern responsive foundation with bespoke typography & lead intake.",
    description: "Responsive layout across mobile/tablet/desktop, About story, Service sections, Contact form with instant email alerts, 95+ Lighthouse speed, SSL and Edge CDN hosting setup.",
    includedFeatures: [
      "Bespoke Responsive Layout (Mobile + Desktop)",
      "Hero Narrative & Brand Positioning Lockup",
      "Services & Offerings Directory Sections",
      "Contact Inquiry Form with Instant Email Alerts",
      "Speed Optimization (Lighthouse 95+ Score)"
    ]
  },
  {
    id: "sales_engine",
    name: "Sales Website & Smart Booking Engine",
    icon: "🛍️",
    priceInr: 19999,
    priceUsd: 499,
    badge: "Revenue Engine",
    tagline: "E-Commerce store, 1-click checkouts, appointment calendar & instant payment gateways.",
    description: "Direct revenue engine: sell physical/digital products or book calendar appointments. Includes product catalogs, slide-over carts, live calendar slot booking, automated WhatsApp reminders, and Stripe/Razorpay/UPI checkout.",
    includedFeatures: [
      "1-Click Express Checkout (Apple Pay, Google Pay, Razorpay, UPI)",
      "Interactive Real-Time Calendar Slot Picker & Sync",
      "Product Catalog with Variants (Size, Color, SKU) & Cart",
      "Automated WhatsApp & Email 24h/2h Confirmation Reminders",
      "GST-Compliant Automated PDF Invoices & Receipts"
    ]
  },
  {
    id: "marketing_campaigns",
    name: "Marketing & BOFU Conversion Campaigns",
    icon: "📈",
    priceInr: 19999,
    priceUsd: 499,
    badge: "High Conversion",
    tagline: "Ad traffic landing pages, UGC review wall, urgency mechanics & UTM attribution.",
    description: "Transform cold ad traffic into paying customers with high-converting BOFU pages, countdown drop timers, sticky announcement bars, video testimonials, comparison matrices, and Meta CAPI / GA4 pixel telemetry.",
    includedFeatures: [
      "High-Converting BOFU Ad Landing Architecture",
      "Urgency Countdown Timers & Sticky Announcement Banners",
      "UGC Video Reviews Wall & 4K Product Showcase",
      "Multi-Channel UTM Attribution Tracking & Link Builder",
      "Meta CAPI, Google Analytics 4 & TikTok Pixel Telemetry"
    ]
  },
  {
    id: "portals_dashboards",
    name: "Portals, Dashboards & Team Operations",
    icon: "👥",
    priceInr: 24999,
    priceUsd: 599,
    badge: "Operations Hub",
    tagline: "Client hubs, staff rostering, geolocation punch clock, inventory & admin dashboards.",
    description: "Equip your business with dedicated Client Hubs (file vaults, milestone tracking, invoices, e-signatures), Staff Rostering & Time-off approval workflows, GPS Geolocation Punch Clock, and an Executive Admin Control Dashboard.",
    includedFeatures: [
      "Dedicated Client Hub with Document Vault & E-Signatures",
      "Searchable Staff Directory & Weekly Shift Rostering Calendar",
      "Mobile Clock-in Punch Clock with GPS Geolocation Verification",
      "Self-Serve Time-Off & Leave Approval Workflow",
      "Executive Business Analytics & CRM Pipeline Dashboard"
    ]
  },
  {
    id: "design_3d",
    name: "3D Interactive & Experiential Design",
    icon: "🎨",
    priceInr: 39999,
    priceUsd: 899,
    badge: "Awwwards Tier",
    tagline: "Interactive Three.js 3D viewport, spatial particles, reactive audio & 60fps rendering.",
    description: "Give your brand a breathtaking digital presence with interactive 3D model orbiters, particle shaders, scroll-driven typography reveals, reactive audio, and silky smooth transitions.",
    includedFeatures: [
      "Three.js / WebGL Interactive 3D Model Canvas",
      "Lenis Smooth Scrolling with Pinned Story Chapters",
      "Kinetic Magnetic Buttons & Fluid Micro-Interactions",
      "Ambient Reactive Sound Design & Audio Immersion",
      "High-Performance 60fps Mobile-Optimized Rendering"
    ]
  },
  {
    id: "fullstack_saas",
    name: "Custom SaaS & Full-Stack Web Application",
    icon: "⚡",
    priceInr: 69999,
    priceUsd: 1499,
    badge: "Software MVP",
    tagline: "Full-stack software with Supabase PostgreSQL, multi-role auth & billing webhooks.",
    description: "Production-ready software platforms, SaaS MVPs, marketplaces, and custom web apps with Next.js App Router, Supabase PostgreSQL with Row-Level Security, multi-role authentication, and subscription billing.",
    includedFeatures: [
      "Next.js Full-Stack App Router Architecture",
      "Supabase PostgreSQL Database & Row-Level Security (RLS)",
      "Secure Multi-Provider Authentication (Google, Email, Magic Link)",
      "Stripe / Razorpay Subscription & Payment Webhooks",
      "Executive Admin and Client Management Dashboards"
    ]
  }
];

export interface WebsiteGoalOption {
  id: string;
  title: string;
  tag: string;
  icon: string;
  symptom: string;
  outcome: string;
  recommendedBundles: string[];
}

export const WEBSITE_GOALS: WebsiteGoalOption[] = [
  {
    id: "more_sales",
    title: "Get Direct Revenue & Online Sales",
    tag: "Sales & Checkout",
    icon: "🎯",
    symptom: "Need seamless 1-click checkouts, product storefronts, or automated appointment slot bookings.",
    outcome: "Sales engine with e-commerce cart, calendar booking slots, instant payment gateways & WhatsApp alerts.",
    recommendedBundles: ["essential_core", "sales_engine"]
  },
  {
    id: "bofu_conversion",
    title: "Maximize Ad Traffic & Marketing ROI",
    tag: "Campaigns & Growth",
    icon: "🚀",
    symptom: "Running ads on Meta/Google/TikTok but conversion rates and source tracking are low.",
    outcome: "BOFU landing pages, urgency countdowns, UGC review walls & multi-channel UTM attribution.",
    recommendedBundles: ["essential_core", "marketing_campaigns"]
  },
  {
    id: "portals_operations",
    title: "Streamline Client & Staff Operations",
    tag: "Portals & Team",
    icon: "👥",
    symptom: "Scattered communication, manual shift management, and disorganized client file sharing.",
    outcome: "Client Hub with e-signatures & invoices, staff shift rosters, GPS punch clock, and Admin dashboard.",
    recommendedBundles: ["essential_core", "portals_dashboards"]
  },
  {
    id: "brand_authority",
    title: "Elevate Brand with 3D & Creative Experience",
    tag: "Awwwards Luxury",
    icon: "💎",
    symptom: "Site looks generic. Need breathtaking spatial visuals and awards-level creative storytelling.",
    outcome: "Three.js WebGL canvas, particle shaders, reactive audio & buttery 60fps motion choreography.",
    recommendedBundles: ["essential_core", "design_3d"]
  },
  {
    id: "saas_mvp",
    title: "Launch a Custom SaaS / Web App MVP",
    tag: "Software & SaaS",
    icon: "⚡",
    symptom: "Building a software product, marketplace, or custom platform requiring user accounts and databases.",
    outcome: "Full-stack Next.js + Supabase database, secure auth, subscription billing & admin portals.",
    recommendedBundles: ["essential_core", "fullstack_saas"]
  }
];

export interface IndustryOption {
  id: string;
  name: string;
  icon: string;
  typicalNeeds: string;
  sampleBusinessName: string;
  recommendedBundles: string[];
  recommendedBundleIds?: string[];
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "ecommerce_retail",
    name: "E-Commerce, Direct-to-Consumer & Retail",
    icon: "🛍️",
    typicalNeeds: "Product catalog, variant picker, 1-click express checkout, GST tax invoices & UTM ad tracking.",
    sampleBusinessName: "Aura Haute Couture",
    recommendedBundles: ["essential_core", "sales_engine", "marketing_campaigns"],
    recommendedBundleIds: ["essential_core", "sales_engine", "marketing_campaigns"]
  },
  {
    id: "services_clinics",
    name: "Clinics, Consultancies & Professional Services",
    icon: "🩺",
    typicalNeeds: "Appointment slot picker, doctor/consultant selector, calendar sync & automated WhatsApp reminders.",
    sampleBusinessName: "Apex Dental & Aesthetics",
    recommendedBundles: ["essential_core", "sales_engine", "portals_dashboards"],
    recommendedBundleIds: ["essential_core", "sales_engine", "portals_dashboards"]
  },
  {
    id: "b2b_agencies",
    name: "B2B, Agencies & Growing Teams",
    icon: "🏢",
    typicalNeeds: "Client project portal, staff scheduling, timesheets, proposal agreements & admin CRM.",
    sampleBusinessName: "Vanguard Growth Partners",
    recommendedBundles: ["essential_core", "portals_dashboards", "marketing_campaigns"],
    recommendedBundleIds: ["essential_core", "portals_dashboards", "marketing_campaigns"]
  },
  {
    id: "luxury_creative",
    name: "Luxury Brands, Fashion & Creative Studios",
    icon: "💎",
    typicalNeeds: "Awwwards-level 3D WebGL visual canvas, smooth scroll, reactive sound design & spatial storytelling.",
    sampleBusinessName: "Maison de L'Ombre",
    recommendedBundles: ["essential_core", "design_3d"],
    recommendedBundleIds: ["essential_core", "design_3d"]
  },
  {
    id: "saas_tech",
    name: "Tech Startups, Platforms & SaaS Founders",
    icon: "⚡",
    typicalNeeds: "Full-stack application architecture, PostgreSQL database, user auth & subscription billing.",
    sampleBusinessName: "FlowMatrix Cloud",
    recommendedBundles: ["essential_core", "fullstack_saas"],
    recommendedBundleIds: ["essential_core", "fullstack_saas"]
  },
  {
    id: "hospitality_dining",
    name: "Restaurants, Cafes & Hospitality",
    icon: "🍽️",
    typicalNeeds: "Online table reservations, digital QR menu, event booking & customer reviews.",
    sampleBusinessName: "L'Osteria Privata",
    recommendedBundles: ["essential_core", "sales_engine"],
    recommendedBundleIds: ["essential_core", "sales_engine"]
  },
  {
    id: "creator_education",
    name: "Coaches, Creators & Digital Educators",
    icon: "🎓",
    typicalNeeds: "Lead capture funnels, course/session checkout, video reviews & email automation.",
    sampleBusinessName: "Titan Mastery Academy",
    recommendedBundles: ["essential_core", "sales_engine", "marketing_campaigns"],
    recommendedBundleIds: ["essential_core", "sales_engine", "marketing_campaigns"]
  },
  {
    id: "realestate_architecture",
    name: "Real Estate & Architecture",
    icon: "🏛️",
    typicalNeeds: "High-resolution property galleries, 3D architectural showcase & inquiry intake.",
    sampleBusinessName: "Elysian Estate Holdings",
    recommendedBundles: ["essential_core", "design_3d", "sales_engine"],
    recommendedBundleIds: ["essential_core", "design_3d", "sales_engine"]
  }
];

