export interface MicroFeature {
  id: string;
  name: string;
  detail?: string;
  tag?: string;
}

export interface MacroFeature {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  isEssential?: boolean;
  priceInr?: number;
  priceUsd?: number;
  isCustomQuoteOnly?: boolean;
  priceLabel?: string;
  microFeatures: (string | MicroFeature)[];
  weightPercent?: number;
}

export interface UniversalAddon {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  priceInr: number;
  priceUsd: number;
  badge?: string;
}

export interface FeatureBundle {
  id: string;
  name: string;
  icon: string;
  priceInr: number;
  priceUsd: number;
  deltaPriceInr?: number;
  deltaPriceUsd?: number;
  startingPriceInr?: number;
  startingPriceUsd?: number;
  typicalRangeInr?: string;
  typicalRangeUsd?: string;
  isCustomQuoteOnly?: boolean;
  priceLabel?: string;
  badge?: string;
  tagline: string;
  description: string;
  turnaround?: string;
  includedFeatures: string[];
  macroFeatures: MacroFeature[];
  isEssential?: boolean;
}

/**
 * Calculates distributed price for a macro feature from its package's delta/base price
 */
export function getMacroDistributedPrice(
  packageDeltaOrBasePrice: number,
  macro: MacroFeature,
  totalMacrosCount: number = 5
): number {
  if (macro.priceInr) return macro.priceInr;
  const weight = macro.weightPercent ? macro.weightPercent / 100 : 1 / Math.max(1, totalMacrosCount);
  return Math.round(packageDeltaOrBasePrice * weight);
}

/**
 * Calculates distributed price for a micro feature from its macro feature price
 */
export function getMicroDistributedPrice(
  macroPrice: number,
  microCount: number = 4
): number {
  if (microCount <= 0) return 0;
  return Math.round(macroPrice / microCount);
}

// ════════════════════════════════════════════════════════════════════════════
// 1. PRIMARY PACKAGES (Independent, Standalone, No Redundancy / Combination)
// ════════════════════════════════════════════════════════════════════════════

export const FEATURE_BUNDLES: FeatureBundle[] = [
  // ─── 1. LANDING PAGE PACKAGE ───────────────────────────────────────────────
  {
    id: "landing",
    name: "Simple Landing Page Package",
    icon: "🌐",
    priceInr: 4999,
    priceUsd: 99,
    deltaPriceInr: 4999,
    deltaPriceUsd: 99,
    startingPriceInr: 4999,
    startingPriceUsd: 99,
    typicalRangeInr: "₹5k–₹15k",
    typicalRangeUsd: "$99–$299",
    isEssential: true,
    badge: "Fast & Clean",
    turnaround: "5–7 Days",
    tagline: "Ultra-fast modern landing presence with bespoke typography, lead intake & CMS.",
    description: "Ideal for founders, creators, and brands needing a crisp, ultra-fast online presence with Home/Hero, About, Services/Portfolio, Contact, and basic content controls.",
    includedFeatures: [
      "Home / Hero narrative & value proposition",
      "About brand story & founder positioning",
      "Services / Portfolio / Catalog showcase",
      "Contact inquiry form with instant notifications",
      "Basic CMS / content management",
      "Basic admin controls & speed optimization"
    ],
    macroFeatures: [
      {
        id: "lp_macro_hero",
        name: "Home / Hero Section",
        icon: "🏛️",
        isEssential: true,
        priceInr: 1200,
        priceUsd: 25,
        description: "Striking hero presentation with kinetic typography, brand positioning, and clear primary CTA.",
        microFeatures: [
          "High-Impact Brand Lockup & Tagline",
          "Kinetic Typography & Staggered Reveal",
          "Primary Conversion CTA Button",
          "Social Proof & Trust Badges"
        ]
      },
      {
        id: "lp_macro_about",
        name: "About Section",
        icon: "✨",
        isEssential: true,
        priceInr: 800,
        priceUsd: 15,
        description: "Engaging founder story, company mission, core values, and team introduction.",
        microFeatures: [
          "Founder / Brand Narrative Layout",
          "Core Values & Mission Statement",
          "Interactive Credibility Milestones",
          "Press Mentions & Media Features"
        ]
      },
      {
        id: "lp_macro_services",
        name: "Services / Portfolio / Catalog",
        icon: "📁",
        isEssential: true,
        priceInr: 1200,
        priceUsd: 25,
        description: "Structured showcase of services, past work case studies, or visual product catalog.",
        microFeatures: [
          "Services Grid with Feature Highlights",
          "Portfolio Case Study Cards & Modals",
          "Visual Catalog Previews",
          "Client Testimonials & Outcomes"
        ]
      },
      {
        id: "lp_macro_contact",
        name: "Contact & Lead Intake",
        icon: "🎯",
        isEssential: true,
        priceInr: 800,
        priceUsd: 15,
        description: "Zero-friction inquiry form with instant email alerts and direct WhatsApp routing.",
        microFeatures: [
          "Async Contact Form with Live Validation",
          "Instant Email Dispatcher to Owner",
          "Direct WhatsApp Floating Action Link",
          "Custom Confirmation & Thank-You State"
        ]
      },
      {
        id: "lp_macro_cms",
        name: "Basic CMS & Content Management",
        icon: "📝",
        isEssential: true,
        priceInr: 500,
        priceUsd: 10,
        description: "Simple content management allowing you to update text, announcements, and imagery easily.",
        microFeatures: [
          "Lightweight CMS Schema Setup",
          "Dynamic Text & Banner Updates",
          "Image & Media Asset Management",
          "Fast Edge Revalidation"
        ]
      },
      {
        id: "lp_macro_admin",
        name: "Basic Admin Controls",
        icon: "🛡️",
        isEssential: true,
        priceInr: 499,
        priceUsd: 9,
        description: "Secure login to review submitted contact inquiries and view basic site performance.",
        microFeatures: [
          "Password-Protected Inquiries View",
          "Lead Export to CSV",
          "Site Meta Tags & SEO Controls",
          "Core Web Vitals Telemetry"
        ]
      }
    ]
  },

  // ─── 2. E-COMMERCE PACKAGE ────────────────────────────────────────────────
  {
    id: "ecommerce",
    name: "E-Commerce Package",
    icon: "🛍️",
    priceInr: 49999,
    priceUsd: 999,
    deltaPriceInr: 49999,
    deltaPriceUsd: 999,
    startingPriceInr: 49999,
    startingPriceUsd: 999,
    typicalRangeInr: "₹50k–₹1.5L+",
    typicalRangeUsd: "$999–$2,999+",
    badge: "Direct Revenue",
    turnaround: "2–3 Weeks",
    tagline: "Complete online storefront: Landing + Sales CRM + Marketing Funnels + E-Commerce Operations & Inventory.",
    description: "The complete commercial store engine. Combines luxury Landing, full Sales CRM, high-converting Marketing funnels, Products catalog with variants, Cart, Checkout, Shipping, Taxes, Inventory, and Fulfillment operations.",
    includedFeatures: [
      "Landing: Home/Hero, About, Services/Catalog, Contact, Basic CMS & Admin",
      "Sales: Lead capture, CRM database, Contact management, Customer accounts, Payments, Inquiries",
      "Marketing: Campaign pages, Ad landing pages, Offer pages, Discount systems, Urgency timers, Funnels, Marketing dashboard",
      "Products: Catalog, Variants (Size/Color/SKU), Pricing & Inventory levels",
      "Cart, 1-Click Checkout, Stripe / Razorpay / UPI Payments & Orders",
      "Customers, Dynamic Discounts, Taxes & GST Invoices",
      "Shipping Methods, Order Tracking & Live Delivery Status",
      "Inventory Management: Real-time stock, Updates & Availability alerts",
      "Admin Control: Orders, Products, Customers & Financial Analytics",
      "Operations: Fulfillment, Returns & Order lifecycle management"
    ],
    macroFeatures: [
      {
        id: "ecom_macro_landing",
        name: "Landing Foundation Module",
        icon: "🌐",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        description: "High-end brand presence including Home/Hero, About, Services/Catalog, Contact, Basic CMS & Admin controls.",
        microFeatures: [
          "Home / Hero Narrative & Visuals",
          "About Story & Founder Credibility",
          "Services & Catalog Showcase",
          "Contact & Lead Capture Form",
          "Basic CMS & Basic Admin Controls"
        ]
      },
      {
        id: "ecom_macro_sales",
        name: "Sales & CRM System",
        icon: "💼",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Integrated sales database, contact management, customer profiles, booking/inquiry flows, and admin sales dashboard.",
        microFeatures: [
          "Lead Capture & CRM Database",
          "Contact & Customer Profile Management",
          "Booking / Inquiry Qualification Flows",
          "Customer Login & Client-Facing Account Hub",
          "Admin Dashboard (Leads, Customers, Sales, Analytics)"
        ]
      },
      {
        id: "ecom_macro_marketing",
        name: "Marketing & Conversion Funnels",
        icon: "📈",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Full conversion suite: Campaign pages, Ad landing pages, Offer pages, Discount systems, Urgency countdowns, and Marketing dashboard.",
        microFeatures: [
          "Ad Landing Pages & Campaign Pages",
          "Offer Pages & Dynamic Discount Engine",
          "Urgency / Scarcity Drop Countdown Timers",
          "Multiple Conversion Funnels & Push Notifications",
          "Marketing Dashboard (Campaigns, Leads, Analytics, Conversion Data)"
        ]
      },
      {
        id: "ecom_macro_products",
        name: "Products & Variant Catalog",
        icon: "📦",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 100,
        description: "Rich product catalog with multi-dimensional variants (size, color, material, SKU), high-res galleries, and dynamic pricing.",
        microFeatures: [
          "Product Catalog & Multi-Category Hierarchy",
          "Variants Management (Size, Color, Material, SKU)",
          "Dynamic Pricing & Tiered Volume Discounts",
          "Real-Time Stock Availability Indicators"
        ]
      },
      {
        id: "ecom_macro_checkout",
        name: "Cart, Checkout & Payments",
        icon: "💳",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 100,
        description: "Slide-over cart, 1-click express checkout, UPI, Razorpay, Stripe, and Apple Pay payment processing.",
        microFeatures: [
          "Interactive Slide-Over Shopping Cart",
          "1-Click Express Checkout Flow",
          "Razorpay, Stripe, UPI & Card Payment Gateways",
          "Automated Order Confirmation & Digital Receipts"
        ]
      },
      {
        id: "ecom_macro_operations",
        name: "Shipping, Tracking & Operations",
        icon: "⚙️",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 102,
        description: "Comprehensive merchant admin for managing orders, stock updates, fulfillment tracking, returns, and sales analytics.",
        microFeatures: [
          "Admin Orders, Products & Customers Dashboard",
          "Live Shipping Tracking & Tax PDF Invoices",
          "Order Fulfillment & Dispatch Status Workflow",
          "Returns, Refunds & Stock Replenishment"
        ]
      }
    ]
  },

  // ─── 3. SAAS PACKAGE ──────────────────────────────────────────────────────
  {
    id: "saas",
    name: "SaaS Product Package",
    icon: "⚡",
    priceInr: 49999,
    priceUsd: 999,
    deltaPriceInr: 49999,
    deltaPriceUsd: 999,
    startingPriceInr: 49999,
    startingPriceUsd: 999,
    typicalRangeInr: "₹50k–₹2.5L+",
    typicalRangeUsd: "$999–$4,999+",
    badge: "Software MVP",
    turnaround: "4–6 Weeks",
    tagline: "Full-stack software platform: Public Website + Sales CRM + Marketing + Auth + Subscriptions + Core Engine + Dashboards.",
    description: "Engineered for tech founders and startups. Includes Public Marketing/Sales Website, Multi-Provider Auth, User Accounts, Subscription Billing, Application Logic, User Dashboards, APIs, RBAC Roles, and Executive Admin System.",
    includedFeatures: [
      "Public Landing: Hero story & Brand positioning",
      "Sales: Lead capture, CRM demo booking & conversion pipeline",
      "Marketing: Campaign funnels, plan comparison & SEO",
      "Authentication: Google OAuth, Magic Links, Passwords & Session tokens",
      "User Accounts: Profiles, Settings, Team workspaces & Organization switcher",
      "Subscription / Plans: Stripe & Razorpay recurring billing, proration & invoices",
      "Application & Core Software Logic: Custom business algorithms & database architecture",
      "User Dashboard: Real-time data visualization, workflows & interactive UI",
      "Permissions & RBAC: Granular role-based security across admins, managers & members",
      "APIs and Integrations: Webhooks, REST API endpoints & third-party connectors",
      "Admin System: User management, subscription telemetry & global system controls"
    ],
    macroFeatures: [
      {
        id: "saas_macro_public_web",
        name: "Public Landing Foundation",
        icon: "🌐",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        description: "High-converting public-facing web presence with Landing story and interactive demo showcase.",
        microFeatures: [
          "Public Landing & Brand Positioning",
          "Interactive Product Tour & Hero Teaser",
          "SEO Optimization & Social OpenGraph Metadata",
          "Fast Edge Caching & Content Delivery"
        ]
      },
      {
        id: "saas_macro_sales",
        name: "Sales & CRM System",
        icon: "💼",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Enterprise lead qualification flow, sales CRM database, and automated demo booking calendar sync.",
        microFeatures: [
          "Sales Lead Capture & Demo Booking Flows",
          "CRM Pipeline & Lead Scoring",
          "Prospect Contact Management & Notes",
          "Automated Sales Notifications"
        ]
      },
      {
        id: "saas_macro_marketing",
        name: "Marketing & Conversion Funnels",
        icon: "📈",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Marketing campaign funnels, dynamic annual/monthly plan comparison matrix, and conversion triggers.",
        microFeatures: [
          "Marketing Campaign Landing Pages",
          "Dynamic Pricing Matrix & Plan Comparison",
          "Urgency Triggers & Promo Code Engine",
          "Marketing Traffic Attribution Telemetry"
        ]
      },
      {
        id: "saas_macro_auth",
        name: "Authentication & User Accounts",
        icon: "🔐",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 100,
        description: "Zero-trust auth with Google OAuth, Magic Links, secure cookie sessions, user account profiles, and password resets.",
        microFeatures: [
          "Multi-Provider OAuth (Google, Email, Magic Link)",
          "Secure Cookie Sessions & PKCE Handshake",
          "User Profile & Account Preferences Management",
          "Team Workspaces & Organization Switcher"
        ]
      },
      {
        id: "saas_macro_billing",
        name: "Subscription, Plans & Billing",
        icon: "💳",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 100,
        description: "Recurring SaaS billing engine with tiered pricing, Stripe / Razorpay webhooks, customer self-serve portal, and invoices.",
        microFeatures: [
          "Tiered Subscription Plans & Feature Gating",
          "Stripe & Razorpay Recurring Billing Integration",
          "Cryptographic Webhook Signature Handlers",
          "Automated Invoices & Self-Serve Billing Portal"
        ]
      },
      {
        id: "saas_macro_core_app",
        name: "Application Logic & Dashboards",
        icon: "⚙️",
        isEssential: true,
        priceInr: 5000,
        priceUsd: 102,
        description: "The proprietary application engine, database architecture, user dashboard, workflows, and admin system.",
        microFeatures: [
          "Server-Side App Router Architecture",
          "Proprietary Business Logic & Algorithms",
          "PostgreSQL Normalized Relational Schema",
          "Real-Time Data Visualization Dashboard",
          "Role-Based Access Control & Admin Controls"
        ]
      }
    ]
  },

  // ─── 4. BUSINESS AUTOMATION PACKAGE ───────────────────────────────────────
  {
    id: "business_automation",
    name: "Business Automation Package",
    icon: "🤖",
    priceInr: 0,
    priceUsd: 0,
    deltaPriceInr: 0,
    deltaPriceUsd: 0,
    typicalRangeInr: "₹25k–₹2L+",
    typicalRangeUsd: "$499–$3,999+",
    isCustomQuoteOnly: true,
    priceLabel: "Quotation on Request",
    badge: "Efficiency Engine",
    turnaround: "2–3 Weeks",
    tagline: "Automate manual chaos: Select workflows or describe custom automation for a tailored quote.",
    description: "Eliminate repetitive manual tasks. Select standard Sales & Marketing automation modules (₹15,000 each) or select custom workflows, WhatsApp automations, ERP connectors, and AI bots for a custom quotation.",
    includedFeatures: [
      "Sales & CRM Automation (₹15,000 / $299)",
      "Marketing & Campaign Automation (₹15,000 / $299)",
      "WhatsApp Cloud API 2-way workflows & automated reminders",
      "Order processing workflows & digital invoice generation",
      "Employee workflows, shift scheduling & leave approvals",
      "Multi-system database & Google Sheets synchronization",
      "Custom ERP / API integrations & AI conversational agents"
    ],
    macroFeatures: [
      {
        id: "ba_macro_sales",
        name: "Sales & CRM Automation (₹15,000 / $299)",
        icon: "💼",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Automatic lead routing, instant CRM updates, prospect scoring, and pipeline stage progression.",
        microFeatures: [
          "Instant Lead Qualification & Scoring",
          "Automated CRM Pipeline Stage Triggers",
          "Lead Distribution & Team Assignment",
          "Duplicate Contact Deduplication & Sync"
        ]
      },
      {
        id: "ba_macro_marketing",
        name: "Marketing & Campaign Automation (₹15,000 / $299)",
        icon: "📈",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Ad campaign landing pages, offer pages, automated lead nurture drip sequences, and marketing analytics.",
        microFeatures: [
          "Ad Landing Pages & Campaign Pages",
          "Offer Pages & Discount Automation",
          "Triggered Email Nurture Sequences",
          "Marketing Dashboard & Analytics"
        ]
      },
      {
        id: "ba_macro_comms",
        name: "WhatsApp & Notification Workflows",
        icon: "📱",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹5k–₹25k)",
        priceInr: 0,
        priceUsd: 0,
        description: "2-way WhatsApp Cloud API automation, appointment reminder sequences, and triggered transactional notifications.",
        microFeatures: [
          "WhatsApp 24h & 2h Automated Reminders",
          "Instant Customer Confirmation Messages",
          "Dynamic Template Variables & Personalization",
          "Custom WhatsApp Webhook Trigger Handlers"
        ]
      },
      {
        id: "ba_macro_ops_staff",
        name: "Order & Employee Workflows",
        icon: "👥",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹10k–₹50k)",
        priceInr: 0,
        priceUsd: 0,
        description: "Automated order fulfillment handoffs, digital invoice dispatch, staff shift notifications, and approval systems.",
        microFeatures: [
          "Order Status Progression & Dispatch Alerts",
          "Employee Shift Publishing & Schedule Alerts",
          "1-Click Manager Leave Approval System",
          "Automated Work-Hour & Payroll Summary"
        ]
      },
      {
        id: "ba_macro_sync_ai",
        name: "Data Sync, ERP Connectors & AI Workflows",
        icon: "🤖",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹15k–₹1L+)",
        priceInr: 0,
        priceUsd: 0,
        description: "Background cron jobs, multi-system database synchronization, custom API webhooks, and AI-powered intelligence.",
        microFeatures: [
          "Two-Way Database & Google Sheets Sync",
          "Custom Webhook Ingestion & API Connectors",
          "Scheduled Background Cron Jobs",
          "Gemini / OpenAI AI Assistant Automation"
        ]
      }
    ]
  },

  // ─── 5. CUSTOM APPLICATION PACKAGE ────────────────────────────────────────
  {
    id: "custom_app",
    name: "Custom Application Package",
    icon: "✨",
    priceInr: 0,
    priceUsd: 0,
    deltaPriceInr: 0,
    deltaPriceUsd: 0,
    typicalRangeInr: "₹60k–₹5L+",
    typicalRangeUsd: "$1,199–$9,999+",
    isCustomQuoteOnly: true,
    priceLabel: "Quotation on Request",
    badge: "Bespoke Architecture",
    turnaround: "Bespoke Timeline",
    tagline: "Tailor-made digital architecture, proprietary business logic & bespoke engineering.",
    description: "For bespoke projects, unique workflows, interactive 3D web apps, or specialized digital tools. Choose standardized Sales & Marketing modules (₹15,000 each) or select bespoke engineering modules for a custom quotation.",
    includedFeatures: [
      "Sales & CRM Module (₹15,000 / $299)",
      "Marketing & Conversion Funnels (₹15,000 / $299)",
      "Custom system architecture & technical specification",
      "Tailor-made business logic & proprietary workflows",
      "Dedicated PostgreSQL / Cloud database schema",
      "Custom UI/UX component design system",
      "Direct milestone reviews & bespoke hypercare"
    ],
    macroFeatures: [
      {
        id: "ca_macro_sales",
        name: "Sales & CRM Module (₹15,000 / $299)",
        icon: "💼",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Lead capture, CRM database, contact management, customer accounts, and sales qualification.",
        microFeatures: [
          "Lead Capture & CRM Database",
          "Contact & Customer Profile Management",
          "Booking / Inquiry Qualification Flows",
          "Customer Login & Client Account Hub"
        ]
      },
      {
        id: "ca_macro_marketing",
        name: "Marketing & Conversion Funnels (₹15,000 / $299)",
        icon: "📈",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        description: "Campaign pages, Ad landing pages, offer pages, and conversion telemetry.",
        microFeatures: [
          "Ad Landing Pages & Campaign Pages",
          "Offer Pages & Discount Systems",
          "Conversion Funnels & Notifications",
          "Marketing Dashboard & Analytics"
        ]
      },
      {
        id: "ca_macro_arch",
        name: "Bespoke Architecture & Engineering",
        icon: "🏛️",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹20k–₹1L+)",
        priceInr: 0,
        priceUsd: 0,
        description: "Tailored full-stack technical foundation built specifically to your requirements.",
        microFeatures: [
          "Custom Frontend & Backend Architecture",
          "High-Performance Edge Deployment",
          "Security & Data Compliance Protocol",
          "Comprehensive Technical Documentation"
        ]
      },
      {
        id: "ca_macro_logic",
        name: "Proprietary Business Logic & APIs",
        icon: "⚙️",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹30k–₹2L+)",
        priceInr: 0,
        priceUsd: 0,
        description: "Proprietary algorithmic workflows, calculation engines, and third-party integrations.",
        microFeatures: [
          "Custom Business Algorithms & Logic",
          "Third-Party API Integrations & Webhooks",
          "PostgreSQL Normalized Relational Schema",
          "Automated Background Processing Queues"
        ]
      },
      {
        id: "ca_macro_ui_exp",
        name: "Custom UI/UX & Bespoke Experience",
        icon: "🎨",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quote on Request (Typ: ₹15k–₹80k)",
        priceInr: 0,
        priceUsd: 0,
        description: "Bespoke component library, 3D interactive graphics, custom sound design, and micro-interactions.",
        microFeatures: [
          "Custom Design System & Component Library",
          "Three.js / GSAP 3D Interactive Canvas",
          "Interactive Micro-Interactions & Gestures",
          "Accessibility & Cross-Platform Responsive Testing"
        ]
      }
    ]
  }
];

// ════════════════════════════════════════════════════════════════════════════
// 2. UNIVERSAL ADD ONS
// ════════════════════════════════════════════════════════════════════════════

export const UNIVERSAL_ADDONS: UniversalAddon[] = [
  {
    id: "addon_mgmt",
    name: "Management Systems",
    icon: "👥",
    tagline: "Internal operations, CRM & staff/client portals",
    description: "Empower your operations with internal CRM dashboards, staff shift rostering, timesheet punch clocks, and dedicated client document vaults.",
    priceInr: 9999,
    priceUsd: 199,
    badge: "Operations"
  },
  {
    id: "addon_custom_site",
    name: "Custom Site",
    icon: "📄",
    tagline: "Additional bespoke subpages & custom page builder",
    description: "Expanded multi-page architecture, custom case study templates, dynamic blog/editorial modules, and tailored landing extensions.",
    priceInr: 14999,
    priceUsd: 299,
    badge: "Content"
  },
  {
    id: "addon_3d",
    name: "3D Interactive Experience",
    icon: "🎨",
    tagline: "Three.js WebGL canvas, 3D viewport & 60fps animations",
    description: "Award-winning interactive 3D model orbiters, particle shaders, scroll-driven camera choreography, and ambient reactive sound design.",
    priceInr: 19999,
    priceUsd: 399,
    badge: "Luxury Motion"
  },
  {
    id: "addon_seo",
    name: "SEO & Search Visibility",
    icon: "🔍",
    tagline: "Full schema markup, OpenGraph cards & speed tuning",
    description: "Complete technical search engine optimization, JSON-LD structured data, XML sitemaps, robots protocol, and top-tier Lighthouse scores.",
    priceInr: 4999,
    priceUsd: 99,
    badge: "Growth"
  },
  {
    id: "addon_hosting",
    name: "Managed Hosting & Edge CDN",
    icon: "☁️",
    tagline: "Global edge CDN deployment & SSL certificates",
    description: "Zero-maintenance edge hosting with sub-100ms global speeds, automated SSL certificates, custom DNS setup, and DDoS mitigation.",
    priceInr: 2999,
    priceUsd: 59,
    badge: "Infrastructure"
  },
  {
    id: "addon_security",
    name: "Security & Compliance",
    icon: "🛡️",
    tagline: "GDPR consent, CSRF shields & enterprise protection",
    description: "Hardened security posture including GDPR/CCPA consent banners, CSRF/XSS protection, rate limiting, and encrypted payload handling.",
    priceInr: 4999,
    priceUsd: 99,
    badge: "Protection"
  },
  {
    id: "addon_cloud",
    name: "Cloud Integration & APIs",
    icon: "🔗",
    tagline: "AWS / GCP / Supabase cloud sync & third-party APIs",
    description: "Seamless integration with AWS, Google Cloud, Supabase, Twilio, Zapier, and custom external REST API bridges.",
    priceInr: 7999,
    priceUsd: 149,
    badge: "Integration"
  },
  {
    id: "addon_custom",
    name: "Custom Add On",
    icon: "🧩",
    tagline: "Tailored microservice or specialized feature request",
    description: "Have a specific feature in mind? Dedicated engineering for custom calculators, AI integrations, or unique functional requirements.",
    priceInr: 9999,
    priceUsd: 199,
    badge: "Bespoke"
  }
];

// ════════════════════════════════════════════════════════════════════════════
// 3. "WHAT ARE YOU BUILDING?" SELECTION (Maps Directly to Suggested Package)
// ════════════════════════════════════════════════════════════════════════════

export interface BuildingOption {
  id: string;
  title: string;
  tag: string;
  icon: string;
  targetPackageId: string;
  symptom: string;
  outcome: string;
}

export const BUILDING_OPTIONS: BuildingOption[] = [
  {
    id: "landing",
    title: "A website / online presence",
    tag: "Landing Presence",
    icon: "🌐",
    targetPackageId: "landing",
    symptom: "Need an ultra-fast, modern website presence with bespoke typography, brand storytelling, and lead intake.",
    outcome: "Simple Landing Page Package: Home/Hero, About, Services/Catalog, Contact, Basic CMS & Admin controls."
  },
  {
    id: "saas",
    title: "A SaaS product",
    tag: "Software & SaaS",
    icon: "⚡",
    targetPackageId: "saas",
    symptom: "Building a software product with user accounts, subscriptions, core app logic, databases, and admin controls.",
    outcome: "SaaS Product Package: Full-stack platform with Public Web, Auth, Billing Plans, User Dashboard & Admin System."
  },
  {
    id: "ecommerce",
    title: "An e-commerce store",
    tag: "E-Commerce",
    icon: "🛍️",
    targetPackageId: "ecommerce",
    symptom: "Need a complete direct-to-consumer store with product catalog, variants, 1-click cart, checkout, shipping & inventory.",
    outcome: "E-Commerce Package: Landing + Sales CRM + Marketing Funnels + Products, Cart, Checkout, Shipping & Operations."
  },
  {
    id: "business_automation",
    title: "Business automation",
    tag: "Automation Engine",
    icon: "🤖",
    targetPackageId: "business_automation",
    symptom: "Eliminate manual repetitive work across leads, WhatsApp, emails, orders, employee workflows, and scheduled tasks.",
    outcome: "Business Automation Package: Lead CRM automation, WhatsApp/Email flows, order routing, approvals & AI automation."
  },
  {
    id: "custom_app",
    title: "A custom application",
    tag: "Custom Application",
    icon: "✨",
    targetPackageId: "custom_app",
    symptom: "Have unique technical specifications, multi-platform requirements, or bespoke proprietary business logic.",
    outcome: "Custom Application Package: Tailored system architecture, proprietary logic, custom data schema & bespoke design."
  }
];

// Backward-compatible alias for existing imports
export const WEBSITE_GOALS = BUILDING_OPTIONS.map(b => ({
  id: b.id,
  title: b.title,
  tag: b.tag,
  icon: b.icon,
  symptom: b.symptom,
  outcome: b.outcome,
  recommendedBundles: [b.targetPackageId]
}));

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
    typicalNeeds: "Product catalog, variant picker, 1-click express checkout, GST tax invoices & shipping tracking.",
    sampleBusinessName: "Aura Haute Couture",
    recommendedBundles: ["ecommerce"],
    recommendedBundleIds: ["ecommerce"]
  },
  {
    id: "services_clinics",
    name: "Clinics, Consultancies & Professional Services",
    icon: "🩺",
    typicalNeeds: "Appointment slot picker, doctor/consultant selector, calendar sync & automated WhatsApp reminders.",
    sampleBusinessName: "Apex Dental & Aesthetics",
    recommendedBundles: ["business_automation"],
    recommendedBundleIds: ["business_automation"]
  },
  {
    id: "b2b_agencies",
    name: "B2B, Agencies & Growing Teams",
    icon: "🏢",
    typicalNeeds: "Client project portal, staff scheduling, timesheets, proposal agreements & CRM pipelines.",
    sampleBusinessName: "Vanguard Growth Partners",
    recommendedBundles: ["business_automation"],
    recommendedBundleIds: ["business_automation"]
  },
  {
    id: "luxury_creative",
    name: "Luxury Brands, Fashion & Creative Studios",
    icon: "💎",
    typicalNeeds: "Award-winning 3D WebGL visual canvas, smooth scroll, reactive sound design & spatial storytelling.",
    sampleBusinessName: "Maison de L'Ombre",
    recommendedBundles: ["landing"],
    recommendedBundleIds: ["landing"]
  },
  {
    id: "saas_tech",
    name: "Tech Startups, Platforms & SaaS Founders",
    icon: "⚡",
    typicalNeeds: "Full-stack application architecture, PostgreSQL database, user auth & subscription billing.",
    sampleBusinessName: "FlowMatrix Cloud",
    recommendedBundles: ["saas"],
    recommendedBundleIds: ["saas"]
  },
  {
    id: "hospitality_dining",
    name: "Restaurants, Cafes & Hospitality",
    icon: "🍽️",
    typicalNeeds: "Online table reservations, digital QR menu, event booking & customer reviews.",
    sampleBusinessName: "L'Osteria Privata",
    recommendedBundles: ["landing"],
    recommendedBundleIds: ["landing"]
  },
  {
    id: "creator_education",
    name: "Coaches, Creators & Digital Educators",
    icon: "🎓",
    typicalNeeds: "Lead capture funnels, course/session checkout, video reviews & email automation.",
    sampleBusinessName: "Titan Mastery Academy",
    recommendedBundles: ["landing"],
    recommendedBundleIds: ["landing"]
  },
  {
    id: "realestate_architecture",
    name: "Real Estate & Architecture",
    icon: "🏛️",
    typicalNeeds: "High-resolution property galleries, 3D architectural showcase & inquiry intake.",
    sampleBusinessName: "Elysian Estate Holdings",
    recommendedBundles: ["landing"],
    recommendedBundleIds: ["landing"]
  }
];
