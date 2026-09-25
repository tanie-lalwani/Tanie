export interface MicroFeatureItem {
  id: string;
  name: string;
  detail: string;
  tag?: string;
  priceInr?: number;
  priceUsd?: number;
  isCustomQuoteOnly?: boolean;
  priceLabel?: string;
}

export interface MacroFeatureItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  isEssential: boolean; // true = locked, core foundation; false = optional, client can cut down
  priceInr: number;
  priceUsd: number;
  isCustomQuoteOnly?: boolean;
  priceLabel?: string;
  microFeatures: MicroFeatureItem[];
}

export interface PackageBreakdownDef {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  basePriceInr: number;
  basePriceUsd: number;
  startingPriceInr?: number;
  startingPriceUsd?: number;
  typicalRangeInr?: string;
  typicalRangeUsd?: string;
  isCustomQuoteOnly?: boolean;
  priceLabel?: string;
  turnaround: string;
  accentGradient: string;
  macroFeatures: MacroFeatureItem[];
}

export const PACKAGE_BREAKDOWN_DATA: PackageBreakdownDef[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. SIMPLE LANDING PAGE PACKAGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "landing",
    name: "Simple Landing Page Package",
    badge: "Base Foundation",
    tagline: "Ultra-fast modern landing presence with bespoke typography, lead intake & CMS.",
    basePriceInr: 4999,
    basePriceUsd: 99,
    startingPriceInr: 4999,
    startingPriceUsd: 99,
    typicalRangeInr: "₹5k–₹15k",
    typicalRangeUsd: "$99–$299",
    turnaround: "5–7 Days",
    accentGradient: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    macroFeatures: [
      {
        id: "lp_macro_hero",
        name: "Home / Hero Section",
        category: "Visuals & Brand",
        icon: "🏛️",
        description: "Striking hero presentation with kinetic typography, brand positioning, and clear primary CTA.",
        isEssential: true,
        priceInr: 1200,
        priceUsd: 25,
        microFeatures: [
          { id: "lp_micro_1", name: "High-Impact Brand Lockup", detail: "Custom typography styling with tagline and value statement.", tag: "Hero", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_2", name: "Kinetic Typography & Reveals", detail: "Staggered scroll-triggered text animations with zero layout shift.", tag: "Motion", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_3", name: "Primary Conversion CTA", detail: "Magnetic button pull with direct link to inquiry modal or WhatsApp.", tag: "CTA", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_4", name: "Trust Badges & Social Proof", detail: "Client logos, rating stars, and credibility anchors.", tag: "Trust", priceInr: 300, priceUsd: 7 }
        ]
      },
      {
        id: "lp_macro_about",
        name: "About Section",
        category: "Narrative & Authority",
        icon: "✨",
        description: "Engaging founder story, company mission, core values, and interactive milestones.",
        isEssential: true,
        priceInr: 800,
        priceUsd: 15,
        microFeatures: [
          { id: "lp_micro_5", name: "Founder & Brand Story", detail: "Editorial storytelling section outlining your journey and vision.", tag: "About", priceInr: 200, priceUsd: 4 },
          { id: "lp_micro_6", name: "Core Values & Mission", detail: "Distinct pillar highlights communicating brand philosophy.", tag: "Story", priceInr: 200, priceUsd: 4 },
          { id: "lp_micro_7", name: "Credibility Milestones", detail: "Key metrics counter showcasing projects completed and clients served.", tag: "Milestones", priceInr: 200, priceUsd: 3 },
          { id: "lp_micro_8", name: "Press & Media Mentions", detail: "Publications, interviews, and feature highlights.", tag: "Press", priceInr: 200, priceUsd: 4 }
        ]
      },
      {
        id: "lp_macro_services",
        name: "Services / Portfolio / Catalog",
        category: "Offerings & Showcase",
        icon: "📁",
        description: "Structured showcase of services, past work case studies, or visual catalog items.",
        isEssential: true,
        priceInr: 1200,
        priceUsd: 25,
        microFeatures: [
          { id: "lp_micro_9", name: "Services Grid with Feature List", detail: "Structured service cards detailing deliverables and target outcomes.", tag: "Services", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_10", name: "Portfolio Case Study Cards", detail: "Interactive cards displaying before/after previews and project summaries.", tag: "Portfolio", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_11", name: "Visual Catalog Showcase", detail: "High-resolution media galleries with lightbox modal previews.", tag: "Catalog", priceInr: 300, priceUsd: 6 },
          { id: "lp_micro_12", name: "Client Testimonials & Outcomes", detail: "Quoted client reviews with author photos and results achieved.", tag: "Reviews", priceInr: 300, priceUsd: 7 }
        ]
      },
      {
        id: "lp_macro_contact",
        name: "Contact & Lead Intake",
        category: "Conversion Infrastructure",
        icon: "🎯",
        description: "Zero-friction inquiry form with instant email alerts and direct WhatsApp routing.",
        isEssential: true,
        priceInr: 800,
        priceUsd: 15,
        microFeatures: [
          { id: "lp_micro_13", name: "Async Contact Form", detail: "Frictionless form with inline validation and no-reload submissions.", tag: "Forms", priceInr: 200, priceUsd: 4 },
          { id: "lp_micro_14", name: "Instant Email Dispatcher", detail: "Immediate lead notification delivered directly to your inbox.", tag: "Alerts", priceInr: 200, priceUsd: 4 },
          { id: "lp_micro_15", name: "WhatsApp Direct Floating Link", detail: "One-tap pre-filled chat link opening WhatsApp instantly.", tag: "Messaging", priceInr: 200, priceUsd: 4 },
          { id: "lp_micro_16", name: "Branded Confirmation State", detail: "Custom thank-you message reassuring prospects of quick reply.", tag: "Conversion", priceInr: 200, priceUsd: 3 }
        ]
      },
      {
        id: "lp_macro_cms",
        name: "Basic CMS / Content Management",
        category: "Content Operations",
        icon: "📝",
        description: "Simple content management allowing you to update text, announcements, and imagery easily.",
        isEssential: false,
        priceInr: 500,
        priceUsd: 10,
        microFeatures: [
          { id: "lp_micro_17", name: "Lightweight CMS Schema", detail: "Structured data model for headings, subtexts, and announcements.", tag: "CMS", priceInr: 125, priceUsd: 2.5 },
          { id: "lp_micro_18", name: "Dynamic Text & Banner Updates", detail: "Easily update headlines and notification banners without code.", tag: "CMS", priceInr: 125, priceUsd: 2.5 },
          { id: "lp_micro_19", name: "Media Asset Uploads", detail: "Image optimization and cloud storage asset linking.", tag: "Media", priceInr: 125, priceUsd: 2.5 },
          { id: "lp_micro_20", name: "Fast Edge Revalidation", detail: "Automatic on-demand ISR cache clearing when content is edited.", tag: "Speed", priceInr: 125, priceUsd: 2.5 }
        ]
      },
      {
        id: "lp_macro_admin",
        name: "Basic Admin Controls",
        category: "Control & Security",
        icon: "🛡️",
        description: "Secure login to review submitted contact inquiries, manage meta tags, and check performance.",
        isEssential: false,
        priceInr: 499,
        priceUsd: 9,
        microFeatures: [
          { id: "lp_micro_21", name: "Password-Protected Inquiries View", detail: "Private admin screen to review, search, and manage leads.", tag: "Admin", priceInr: 125, priceUsd: 2.25 },
          { id: "lp_micro_22", name: "CSV Lead Export", detail: "One-click download of all lead submissions for Excel/Sheets.", tag: "Data", priceInr: 125, priceUsd: 2.25 },
          { id: "lp_micro_23", name: "Site Meta Tags & SEO Setup", detail: "Dynamic page titles, meta descriptions, and OpenGraph images.", tag: "SEO", priceInr: 125, priceUsd: 2.25 },
          { id: "lp_micro_24", name: "Core Web Vitals Telemetry", detail: "Performance monitoring ensuring sub-1s load times.", tag: "Speed", priceInr: 124, priceUsd: 2.25 }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. E-COMMERCE PACKAGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ecommerce",
    name: "E-Commerce Package",
    badge: "Direct Revenue",
    tagline: "Landing + Sales CRM + Marketing Funnels + Full E-Commerce Store Engine & Operations.",
    basePriceInr: 29999,
    basePriceUsd: 599,
    startingPriceInr: 29999,
    startingPriceUsd: 599,
    typicalRangeInr: "₹30k–₹1.5L+",
    typicalRangeUsd: "$599–$2,999+",
    turnaround: "2–3 Weeks",
    accentGradient: "from-emerald-500/20 via-teal-500/10 to-sky-500/20",
    macroFeatures: [
      {
        id: "ecom_macro_landing",
        name: "Landing Foundation Module",
        category: "Brand & Showcase",
        icon: "🌐",
        description: "Complete brand presence: Home/Hero, About, Services/Catalog, Contact, Basic CMS & Admin controls.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "ecom_micro_l1", name: "Home / Hero Narrative", detail: "Brand positioning, value proposition, and hero visual staging.", tag: "Landing", priceInr: 1000, priceUsd: 20 },
          { id: "ecom_micro_l2", name: "About Story & Vision", detail: "Founder credentials, mission statement, and brand values.", tag: "Landing", priceInr: 1000, priceUsd: 20 },
          { id: "ecom_micro_l3", name: "Services & Portfolio Catalog", detail: "Showcase directory of brand offerings and past case studies.", tag: "Landing", priceInr: 1000, priceUsd: 20 },
          { id: "ecom_micro_l4", name: "Contact & Lead Form", detail: "Inquiry submission with instant email alerts and WhatsApp routing.", tag: "Landing", priceInr: 1000, priceUsd: 20 },
          { id: "ecom_micro_l5", name: "Basic CMS & Admin Controls", detail: "Content editing controls and password-protected admin dashboard.", tag: "Landing", priceInr: 999, priceUsd: 19 }
        ]
      },
      {
        id: "ecom_macro_sales",
        name: "Sales & CRM Engine",
        category: "Customer & Sales",
        icon: "💼",
        description: "Lead capture, CRM database, contact management, customer profiles, booking/inquiries, and sales dashboard.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ecom_micro_s1", name: "Lead Capture & CRM Database", detail: "Centralized lead storage with contact status and conversion notes.", tag: "CRM", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_s2", name: "Contact & Customer Management", detail: "Searchable customer database with order histories and lifetime value.", tag: "CRM", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_s3", name: "Forms & Booking / Inquiry Flows", detail: "Interactive qualification questionnaires and calendar appointment booking.", tag: "Sales", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_s4", name: "Customer Login & Client Account Hub", detail: "Client-facing portal for order tracking, saved addresses, and past invoices.", tag: "Accounts", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_s5", name: "Admin Dashboard (Leads, Customers, Sales, Analytics)", detail: "Real-time sales charts, revenue metrics, conversion rates, and database.", tag: "Admin", priceInr: 3000, priceUsd: 59 }
        ]
      },
      {
        id: "ecom_macro_marketing",
        name: "Marketing & Conversion Funnels",
        category: "Marketing & Growth",
        icon: "📈",
        description: "Campaign pages, Ad landing pages, Offer pages, Discount systems, Urgency scarcity, Notifications & Marketing dashboard.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ecom_micro_m1", name: "Campaign & Ad Landing Pages", detail: "High-converting standalone landing pages tailored for Meta and Google ads.", tag: "Marketing", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_m2", name: "Offer Pages & Discount Systems", detail: "Coupons, bundle discounts, buy-one-get-one, and percentage promo rules.", tag: "Offers", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_m3", name: "Urgency & Scarcity Drop Timers", detail: "Live flash sale countdown headers, sticky announcement bars, and low-stock indicators.", tag: "FOMO", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_m4", name: "Multiple Funnels & Notifications", detail: "Multi-step conversion paths with automated email/WhatsApp abandon recovery.", tag: "Funnels", priceInr: 3000, priceUsd: 60 },
          { id: "ecom_micro_m5", name: "Marketing Dashboard & Analytics", detail: "Campaign management, UTM traffic source telemetry, performance data, and conversion rates.", tag: "Analytics", priceInr: 3000, priceUsd: 59 }
        ]
      },
      {
        id: "ecom_macro_products",
        name: "Products & Variant Catalog",
        category: "E-Commerce Core",
        icon: "📦",
        description: "Products catalog with multi-dimensional variants (size, color, SKU), pricing, and real-time inventory.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "ecom_micro_p1", name: "Product Catalog & Hierarchy", detail: "Category filters, search, sorting, and rich product presentation.", tag: "Products", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_p2", name: "Variants Management", detail: "Size, color, material, and SKU variant matrix with dynamic image switching.", tag: "Variants", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_p3", name: "Dynamic Pricing & Discounts", detail: "Original vs sale pricing strikethrough and tiered bulk volume rules.", tag: "Pricing", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_p4", name: "Real-Time Stock Availability", detail: "Live stock counts with automatic 'Sold Out' status and restock alerts.", tag: "Inventory", priceInr: 1249, priceUsd: 24 }
        ]
      },
      {
        id: "ecom_macro_checkout",
        name: "Cart, Checkout & Payments",
        category: "Transactions",
        icon: "💳",
        description: "Slide-over cart, 1-click express checkout, UPI, Razorpay, Stripe, and Apple Pay payment processing.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "ecom_micro_c1", name: "Slide-Over Shopping Cart", detail: "Quick-access cart drawer with quantity adjustments and free-shipping meter.", tag: "Cart", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_c2", name: "1-Click Express Checkout", detail: "Streamlined single-page checkout minimizing form fields and dropoffs.", tag: "Checkout", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_c3", name: "Multi-Gateway Payments", detail: "Razorpay, Stripe, UPI, Apple Pay, Google Pay & Credit Cards.", tag: "Payments", priceInr: 1250, priceUsd: 25 },
          { id: "ecom_micro_c4", name: "Orders & Confirmation Webhooks", detail: "Secure transaction verification with instant digital receipts.", tag: "Orders", priceInr: 1249, priceUsd: 24 }
        ]
      },
      {
        id: "ecom_macro_operations",
        name: "Shipping, Tracking & Operations",
        category: "Operations & Admin",
        icon: "⚙️",
        description: "Merchant admin dashboard for managing orders, stock updates, fulfillment tracking, returns, and sales analytics.",
        isEssential: false,
        priceInr: 5002,
        priceUsd: 103,
        microFeatures: [
          { id: "ecom_micro_op1", name: "Admin Orders & Customer Management", detail: "Centralized view to update order statuses, client notes, and shipping tags.", tag: "Admin", priceInr: 1250, priceUsd: 26 },
          { id: "ecom_micro_op2", name: "Inventory Stock Updates", detail: "Bulk stock editing, low-stock threshold warnings, and inventory logs.", tag: "Inventory", priceInr: 1250, priceUsd: 26 },
          { id: "ecom_micro_op3", name: "Order Fulfillment Workflow", detail: "Pick, pack, ship lifecycle management with printable packing slips.", tag: "Fulfillment", priceInr: 1250, priceUsd: 26 },
          { id: "ecom_micro_op4", name: "Returns & Refund Handling", detail: "Customer return requests and one-click payment refund processing.", tag: "Returns", priceInr: 1252, priceUsd: 25 }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. SAAS PACKAGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "saas",
    name: "SaaS Product Package",
    badge: "Software MVP",
    tagline: "Public Website + Auth + Subscriptions + Application Logic + User Dashboards + Admin System.",
    basePriceInr: 49999,
    basePriceUsd: 999,
    startingPriceInr: 49999,
    startingPriceUsd: 999,
    typicalRangeInr: "₹50k–₹2.5L+",
    typicalRangeUsd: "$999–$4,999+",
    turnaround: "4–6 Weeks",
    accentGradient: "from-blue-600/20 via-indigo-600/10 to-violet-600/20",
    macroFeatures: [
      {
        id: "saas_macro_public_web",
        name: "Public Landing Foundation",
        category: "Acquisition & Marketing",
        icon: "🌐",
        description: "Public marketing website: Brand Landing, Sales CRM demo intake, and high-converting Marketing funnels.",
        isEssential: true,
        priceInr: 4999,
        priceUsd: 99,
        microFeatures: [
          { id: "saas_micro_pw1", name: "Public Landing & Brand Positioning", detail: "High-impact narrative, value proposition, and interactive product demo.", tag: "Landing", priceInr: 1250, priceUsd: 25 },
          { id: "saas_micro_pw2", name: "Product Tour & Feature Matrix", detail: "Interactive product demo and plan comparison.", tag: "Demo", priceInr: 1250, priceUsd: 25 },
          { id: "saas_micro_pw3", name: "Conversion Funnels", detail: "Streamlined sign-up paths with lead capture.", tag: "Conversion", priceInr: 1250, priceUsd: 25 },
          { id: "saas_micro_pw4", name: "SEO & Social OpenGraph Cards", detail: "Complete search indexation and dynamic sharing visuals.", tag: "SEO", priceInr: 1249, priceUsd: 24 }
        ]
      },
      {
        id: "saas_macro_sales",
        name: "Sales & CRM System",
        category: "Customer & Sales",
        icon: "💼",
        description: "Enterprise lead qualification flow, sales CRM database, and automated demo booking calendar sync.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "saas_micro_s1", name: "Sales Lead Capture & Demo Booking", detail: "Enterprise qualification questionnaires and calendar appointment booking.", tag: "Sales", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_s2", name: "CRM Pipeline & Lead Scoring", detail: "Move deals automatically across pipeline stages upon lead qualification.", tag: "CRM", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_s3", name: "Prospect Contact Database", detail: "Centralized prospect storage with status notes and activity history.", tag: "CRM", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_s4", name: "Automated Sales Notifications", detail: "Instant alerts to team members via email and webhook triggers.", tag: "Alerts", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "saas_macro_marketing",
        name: "Marketing & Conversion Funnels",
        category: "Marketing & Growth",
        icon: "📈",
        description: "Marketing campaign funnels, dynamic annual/monthly plan comparison matrix, and conversion triggers.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "saas_micro_m1", name: "Campaign Landing Pages", detail: "High-converting standalone landing pages tailored for ad traffic.", tag: "Marketing", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_m2", name: "Dynamic Pricing Matrix", detail: "Interactive monthly/annual billing toggle with feature matrix.", tag: "Pricing", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_m3", name: "Urgency Triggers & Promo Codes", detail: "Special discount rules, flash sale headers, and promo coupon system.", tag: "Offers", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_m4", name: "Marketing Traffic Attribution", detail: "UTM traffic source telemetry, performance data, and conversion analytics.", tag: "Analytics", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "saas_macro_auth",
        name: "Authentication & User Accounts",
        category: "Identity & Security",
        icon: "🔐",
        description: "Google OAuth, Magic Links, Passwords, secure session cookies, user profiles, and organization switcher.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "saas_micro_au1", name: "Multi-Provider OAuth", detail: "Google OAuth 2.0, GitHub, Magic Links & Email passwords.", tag: "Auth", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_au2", name: "Secure Sessions & PKCE Handshake", detail: "HTTP-only cookie tokens with CSRF protection and token refreshes.", tag: "Security", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_au3", name: "User Profile & Account Preferences", detail: "Avatar uploads, password changes, notification preferences, and 2FA.", tag: "Accounts", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_au4", name: "Team Workspaces & Organization Switcher", detail: "Multi-tenant workspace isolation with invitation links.", tag: "Workspaces", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "saas_macro_billing",
        name: "Subscription / Plans & Invoicing",
        category: "Monetization & Billing",
        icon: "💳",
        description: "Recurring SaaS billing engine with tiered pricing, Stripe / Razorpay webhooks, customer self-serve portal, and invoices.",
        isEssential: true,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "saas_micro_bi1", name: "Tiered Subscription Plans", detail: "Feature-gating per tier (Free, Pro, Enterprise) with upgrade prompts.", tag: "Billing", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_bi2", name: "Stripe & Razorpay Recurring Billing", detail: "Automated recurring charge schedules, proration, and dunning logic.", tag: "Gateways", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_bi3", name: "Cryptographic Webhook Handlers", detail: "Verified event signatures for payment success, renewals, and cancellations.", tag: "Webhooks", priceInr: 3750, priceUsd: 75 },
          { id: "saas_micro_bi4", name: "Self-Serve Billing Portal & Invoices", detail: "Customer portal to manage payment methods, upgrade plans, and download PDFs.", tag: "Invoices", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "saas_macro_core_app",
        name: "Application & Core Software Logic",
        category: "Software Engineering",
        icon: "⚙️",
        description: "The proprietary application engine, database architecture, server actions, and core domain algorithms.",
        isEssential: true,
        priceInr: 20000,
        priceUsd: 399,
        microFeatures: [
          { id: "saas_micro_ca1", name: "Next.js App Router Architecture", detail: "Server components, streaming hydration, and sub-100ms edge routing.", tag: "Engine", priceInr: 5000, priceUsd: 100 },
          { id: "saas_micro_ca2", name: "Proprietary Core Logic & Algorithms", detail: "Custom data transformation, scoring engines, or generative workflows.", tag: "Logic", priceInr: 5000, priceUsd: 100 },
          { id: "saas_micro_ca3", name: "PostgreSQL Relational Schema", detail: "Normalized relational DDL, foreign keys, triggers, and automated migrations.", tag: "Database", priceInr: 5000, priceUsd: 100 },
          { id: "saas_micro_ca4", name: "APIs & Third-Party Integrations", detail: "Type-safe REST API endpoints and outbound webhook dispatchers.", tag: "APIs", priceInr: 5000, priceUsd: 99 }
        ]
      },
      {
        id: "saas_macro_user_dashboard",
        name: "User Dashboard & Data Management",
        category: "User Experience",
        icon: "📊",
        description: "Interactive client dashboard with live data metrics, project management, file uploads, and notification streams.",
        isEssential: true,
        priceInr: 10000,
        priceUsd: 199,
        microFeatures: [
          { id: "saas_micro_ud1", name: "Real-Time Data Visualization", detail: "Interactive metrics charts, KPIs, and status summaries.", tag: "Analytics", priceInr: 2500, priceUsd: 50 },
          { id: "saas_micro_ud2", name: "CRUD Data Tables & Filters", detail: "Paginated, searchable data tables with multi-column filtering and sorting.", tag: "Data", priceInr: 2500, priceUsd: 50 },
          { id: "saas_micro_ud3", name: "File Vault & Asset Storage", detail: "Secure encrypted cloud file uploads with direct pre-signed URLs.", tag: "Storage", priceInr: 2500, priceUsd: 50 },
          { id: "saas_micro_ud4", name: "Real-Time Notifications & Activity Logs", detail: "In-app notification bell and audit log of tenant actions.", tag: "Notifications", priceInr: 2500, priceUsd: 49 }
        ]
      },
      {
        id: "saas_macro_admin_system",
        name: "Permissions, Roles & Admin System",
        category: "Platform Administration",
        icon: "🛡️",
        description: "Executive control panel for platform admins: Manage tenant users, RBAC permissions, audit trails, and system controls.",
        isEssential: false,
        priceInr: 5000,
        priceUsd: 104,
        microFeatures: [
          { id: "saas_micro_ad1", name: "Granular RBAC Roles & Permissions", detail: "Admin, Manager, Member, and Guest security policies.", tag: "RBAC", priceInr: 1250, priceUsd: 26 },
          { id: "saas_micro_ad2", name: "Master Admin Control Panel", detail: "Global tenant overview, user impersonation, and subscription telemetry.", tag: "Admin", priceInr: 1250, priceUsd: 26 },
          { id: "saas_micro_ad3", name: "Security Audit Logging", detail: "Immutable event logs recording logins, config updates, and data exports.", tag: "Security", priceInr: 1250, priceUsd: 26 },
          { id: "saas_micro_ad4", name: "CSV / JSON Data Export Engine", detail: "Full tenant data export complying with GDPR and business intelligence needs.", tag: "Export", priceInr: 1250, priceUsd: 26 }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. BUSINESS AUTOMATION PACKAGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "business_automation",
    name: "Business Automation Package",
    badge: "Efficiency Engine",
    tagline: "Leads + CRM + WhatsApp + Emails + Orders + Staff + AI Automation Workflows.",
    basePriceInr: 24999,
    basePriceUsd: 499,
    startingPriceInr: 24999,
    startingPriceUsd: 499,
    typicalRangeInr: "₹25k–₹2L+",
    typicalRangeUsd: "$499–$3,999+",
    isCustomQuoteOnly: true,
    priceLabel: "Quotation on Request",
    turnaround: "2–3 Weeks",
    accentGradient: "from-amber-500/20 via-orange-500/10 to-rose-500/20",
    macroFeatures: [
      {
        id: "ba_macro_sales",
        name: "Sales & CRM Automation (₹15,000 / $299)",
        category: "Customer & Sales",
        icon: "💼",
        description: "Automatic lead capture, CRM pipeline qualification, scoring, and instant team routing.",
        isEssential: false,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ba_micro_s1", name: "Instant Lead Qualification & Scoring", detail: "Real-time parsing of form submissions with automatic lead tier assignment.", tag: "Leads", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_s2", name: "Automated CRM Pipeline Triggers", detail: "Move deals automatically across pipeline stages upon form submission.", tag: "CRM", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_s3", name: "Lead Distribution & Team Alerts", detail: "Round-robin team member assignment with instant notification to Slack/WhatsApp.", tag: "Routing", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_s4", name: "Duplicate Deduplication & Sync", detail: "Automatic merging of repeat contact submissions and activity timeline update.", tag: "Data", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "ba_macro_marketing",
        name: "Marketing & Campaign Automation (₹15,000 / $299)",
        category: "Marketing & Growth",
        icon: "📈",
        description: "Ad campaign landing pages, offer pages, automated lead nurture drip sequences, and marketing analytics.",
        isEssential: false,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ba_micro_m1", name: "Campaign & Ad Landing Pages", detail: "High-converting standalone landing pages tailored for ad campaigns.", tag: "Marketing", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_m2", name: "Offer Pages & Discount Automation", detail: "Coupons, bundle discounts, and promo rules automation.", tag: "Offers", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_m3", name: "Triggered Email Nurture Sequences", detail: "Drip campaign sequences delivering relevant case studies and next steps.", tag: "Email", priceInr: 3750, priceUsd: 75 },
          { id: "ba_micro_m4", name: "Marketing Dashboard & Analytics", detail: "Campaign management, UTM traffic source telemetry, and conversion rates.", tag: "Analytics", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "ba_macro_comms",
        name: "WhatsApp & Notification Workflows",
        category: "Messaging Automation",
        icon: "📱",
        description: "2-way WhatsApp Cloud API automation, appointment reminder sequences, and triggered transactional notifications.",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ba_micro_c1", name: "WhatsApp 24h & 2h Automated Reminders", detail: "Eliminate appointment and order no-shows with timed WhatsApp messages.", tag: "WhatsApp" },
          { id: "ba_micro_c2", name: "Instant Confirmation Messages", detail: "Real-time booking and inquiry receipts sent within 2 seconds.", tag: "Alerts" },
          { id: "ba_micro_c3", name: "Dynamic Template Variables", detail: "Merge tags for client name, service, branch, and dynamic payment links.", tag: "Personalization" },
          { id: "ba_micro_c4", name: "Custom WhatsApp Webhook Handlers", detail: "Bi-directional customer responses routed directly to staff.", tag: "Webhooks" }
        ]
      },
      {
        id: "ba_macro_ops_staff",
        name: "Order & Employee Workflows",
        category: "Operations & Approvals",
        icon: "👥",
        description: "Automated order fulfillment handoffs, digital invoice dispatch, staff shift notifications, and approval systems.",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ba_micro_o1", name: "Order Status Progression Workflows", detail: "Automatic transitions from payment received to packing and dispatched.", tag: "Orders" },
          { id: "ba_micro_o2", name: "Employee Shift Alerts & Rostering", detail: "Automated broadcasting of weekly shift schedules to employee phones.", tag: "Staff" },
          { id: "ba_micro_o3", name: "1-Click Manager Approval Systems", detail: "Approve or reject time-off and expense requests directly from email or WhatsApp.", tag: "Approvals" },
          { id: "ba_micro_o4", name: "Automated Payroll & Work-Hour Summaries", detail: "Scheduled calculation of hours worked with 1-click CSV export.", tag: "Payroll" }
        ]
      },
      {
        id: "ba_macro_sync_ai",
        name: "Data Sync, ERP Connectors & AI Workflows",
        category: "Integrations & AI",
        icon: "🤖",
        description: "Background cron jobs, multi-system database synchronization, custom API webhooks, and AI-powered intelligence.",
        isEssential: false,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ba_micro_s1", name: "Two-Way Database & Google Sheets Sync", detail: "Mirror all customer and order entries into real-time shared spreadsheets.", tag: "Sync" },
          { id: "ba_micro_s2", name: "Custom API Webhook Connectors", detail: "Seamless bridges connecting Zapier, Make, ERPs, and custom software.", tag: "APIs" },
          { id: "ba_micro_s3", name: "Scheduled Background Cron Jobs", detail: "Daily, weekly, or hourly automated data audits, backups, and reports.", tag: "Cron" },
          { id: "ba_micro_s4", name: "Gemini / OpenAI AI Assistant Automation", detail: "Intelligent chatbot assistant answering FAQs and pre-qualifying leads.", tag: "AI" }
        ]
      }
    ]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. CUSTOM APPLICATION PACKAGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "custom_app",
    name: "Custom Application Package",
    badge: "Bespoke Architecture",
    tagline: "Tailor-made digital architecture, proprietary business logic & bespoke engineering.",
    basePriceInr: 59999,
    basePriceUsd: 1199,
    startingPriceInr: 59999,
    startingPriceUsd: 1199,
    typicalRangeInr: "₹60k–₹5L+",
    typicalRangeUsd: "$1,199–$9,999+",
    isCustomQuoteOnly: true,
    priceLabel: "Quotation on Request",
    turnaround: "Bespoke Timeline",
    accentGradient: "from-purple-500/20 via-pink-500/10 to-amber-500/20",
    macroFeatures: [
      {
        id: "ca_macro_sales",
        name: "Sales & CRM Module (₹15,000 / $299)",
        category: "Customer & Sales",
        icon: "💼",
        description: "Lead capture, CRM database, contact management, customer accounts, and sales qualification.",
        isEssential: false,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ca_micro_s1", name: "Lead Capture & CRM Database", detail: "Custom lead ingestion schema with status tracking.", tag: "CRM", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_s2", name: "Contact Profile Management", detail: "Searchable customer database with interaction logs.", tag: "CRM", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_s3", name: "Booking & Inquiry Flows", detail: "Interactive qualification questionnaires.", tag: "Sales", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_s4", name: "Customer Portal & Account Hub", detail: "Client-facing portal with history and invoices.", tag: "Accounts", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "ca_macro_marketing",
        name: "Marketing & Conversion Funnels (₹15,000 / $299)",
        category: "Marketing & Growth",
        icon: "📈",
        description: "Campaign pages, Ad landing pages, offer pages, and conversion telemetry.",
        isEssential: false,
        priceInr: 15000,
        priceUsd: 299,
        microFeatures: [
          { id: "ca_micro_m1", name: "Ad Landing Pages & Campaign Pages", detail: "Custom designed conversion funnels.", tag: "Marketing", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_m2", name: "Offer Pages & Promo Engine", detail: "Dynamic promo coupon and discount rules.", tag: "Offers", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_m3", name: "Conversion Funnels & Notifications", detail: "Multi-step conversion paths with automated alerts.", tag: "Funnels", priceInr: 3750, priceUsd: 75 },
          { id: "ca_micro_m4", name: "Marketing Dashboard & Analytics", detail: "Campaign telemetry and conversion rates.", tag: "Analytics", priceInr: 3750, priceUsd: 74 }
        ]
      },
      {
        id: "ca_macro_arch",
        name: "Bespoke Architecture & Engineering",
        category: "Engineering",
        icon: "🏛️",
        description: "Tailored full-stack technical foundation built specifically to your requirements.",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ca_micro_1", name: "Custom Frontend & Backend Architecture", detail: "Bespoke Next.js or React full-stack structure engineered for scale.", tag: "Architecture" },
          { id: "ca_micro_2", name: "High-Performance Edge Deployment", detail: "Global edge CDN configuration with optimized caching headers.", tag: "Deployment" },
          { id: "ca_micro_3", name: "Security & Data Compliance Protocol", detail: "Strict encryption, CSRF protection, and data governance.", tag: "Security" },
          { id: "ca_micro_4", name: "Comprehensive Technical Documentation", detail: "Complete API specs, database diagrams, and deployment guides.", tag: "Docs" }
        ]
      },
      {
        id: "ca_macro_logic",
        name: "Proprietary Business Logic & APIs",
        category: "Algorithms & Logic",
        icon: "⚙️",
        description: "Tailored business logic, calculation engines, and third-party API orchestrations.",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ca_micro_5", name: "Custom Algorithm & Calculation Engine", detail: "Proprietary formulas, estimators, and custom business workflows.", tag: "Logic" },
          { id: "ca_micro_6", name: "Third-Party Service API Connectors", detail: "Deep integrations with enterprise software, CRMs, and payment rails.", tag: "APIs" },
          { id: "ca_micro_7", name: "Automated Data Ingestion & Exports", detail: "Scheduled ETL sync scripts, batch processing, and reporting.", tag: "Data" },
          { id: "ca_micro_8", name: "Type-Safe Internal API Endpoints", detail: "End-to-end type safety with Zod schema validation.", tag: "API" }
        ]
      },
      {
        id: "ca_macro_db",
        name: "Dedicated Data Schema & Security",
        category: "Data & Storage",
        icon: "🗄️",
        description: "Custom relational database design with role permissions and backup guarantees.",
        isEssential: true,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ca_micro_9", name: "Custom Relational Schema & Indexes", detail: "Optimized database design for rapid query execution.", tag: "Database" },
          { id: "ca_micro_10", name: "Row-Level Security & Role Access", detail: "Strict isolation of sensitive records per tenant and role.", tag: "Security" },
          { id: "ca_micro_11", name: "Automated Snapshot Backups", detail: "Daily encrypted point-in-time recovery archives.", tag: "Backups" },
          { id: "ca_micro_12", name: "Data Migration Scripts", detail: "Safe schema evolution scripts with zero-downtime guarantees.", tag: "Migrations" }
        ]
      },
      {
        id: "ca_macro_design",
        name: "Bespoke UX / UI Design System",
        category: "Design System",
        icon: "🎨",
        description: "Distinct visual styling, custom micro-animations, and responsive component library.",
        isEssential: false,
        isCustomQuoteOnly: true,
        priceLabel: "Quotation on Request",
        priceInr: 0,
        priceUsd: 0,
        microFeatures: [
          { id: "ca_micro_13", name: "Tailored Typography & Color Tokens", detail: "Bespoke design tokens aligned with your unique brand language.", tag: "Design" },
          { id: "ca_micro_14", name: "Framer Motion Micro-Interactions", detail: "Silky 60fps gesture and scroll animations.", tag: "Motion" },
          { id: "ca_micro_15", name: "Custom Component Library", detail: "Reusable UI kit covering modals, drawers, tooltips, and navigation.", tag: "Components" },
          { id: "ca_micro_16", name: "Mobile-First Responsive Layouts", detail: "Flawless rendering across phones, tablets, and 4K displays.", tag: "Responsive" }
        ]
      }
    ]
  }
];

// Helper to look up a package breakdown definition
export function getPackageBreakdownDef(packageId: string): PackageBreakdownDef {
  const normalizedId = packageId === "luxury-landing-sprint" ? "landing"
    : packageId === "sales-website-engine" || packageId === "growth-marketing-campaigns" ? "ecommerce"
    : packageId === "fullstack-saas-app" ? "saas"
    : packageId === "portals-dashboards-suite" ? "business_automation"
    : packageId === "custom-bespoke-build" ? "custom_app"
    : packageId;

  return PACKAGE_BREAKDOWN_DATA.find((p) => p.id === normalizedId) || PACKAGE_BREAKDOWN_DATA[0];
}