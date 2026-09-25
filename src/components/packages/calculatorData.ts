export interface MacroFeature {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  microFeatures: string[];
}

export interface FeatureBundle {
  id: string;
  name: string;
  icon: string;
  priceInr: number;
  priceUsd: number;
  deltaPriceInr?: number;
  deltaPriceUsd?: number;
  badge?: string;
  tagline: string;
  description: string;
  includedFeatures: string[];
  macroFeatures: MacroFeature[];
  isEssential?: boolean;
}

export const FEATURE_BUNDLES: FeatureBundle[] = [
  {
    id: "essential_core",
    name: "Luxury Brand Landing Foundation",
    icon: "🏛️",
    priceInr: 4999,
    priceUsd: 99,
    deltaPriceInr: 4999,
    deltaPriceUsd: 99,
    isEssential: true,
    badge: "Base Foundation",
    tagline: "Ultra-fast modern responsive foundation with bespoke typography & lead intake.",
    description: "Responsive layout across mobile/tablet/desktop, About story, Service sections, Contact form with instant email alerts, 95+ Lighthouse speed, SSL and Edge CDN hosting setup.",
    includedFeatures: [
      "Bespoke Responsive Layout (Mobile + Desktop)",
      "Hero Narrative & Brand Positioning Lockup",
      "Services & Offerings Directory Sections",
      "Contact Inquiry Form with Instant Email Alerts",
      "Speed Optimization (Lighthouse 95+ Score)"
    ],
    macroFeatures: [
      {
        id: "ec_macro_arch",
        name: "Core Responsive Architecture & Layout",
        icon: "🏛️",
        description: "Mobile-first responsive layout with server-rendered Next.js App Router DOM, zero layout shift, and Vercel edge deployment.",
        microFeatures: [
          "Bespoke Mobile, Tablet & 4K Breakpoints",
          "Next.js App Router SSR DOM Hydration",
          "Edge CDN Global Caching (Sub-100ms)",
          "Strict SSL / TLS & Automated DNS Setup"
        ]
      },
      {
        id: "ec_macro_motion",
        name: "Typography, Fluid Motion & Aesthetics",
        icon: "✨",
        description: "Kinetic typography, smooth momentum scrolling with Lenis, and subtle micro-interactions that communicate luxury.",
        microFeatures: [
          "Curated Google / Typekit Font Pairings",
          "Smooth Lenis Momentum Scrolling",
          "IntersectionObserver Reveal Animations",
          "Magnetic Button Pull & Cursor Physics"
        ]
      },
      {
        id: "ec_macro_conversion",
        name: "Lead Capture & Conversion System",
        icon: "🎯",
        description: "High-converting inquiry forms with real-time validation, instant email alerts to your inbox, and direct WhatsApp routing.",
        microFeatures: [
          "Asynchronous Contact Form with Client Validation",
          "Instant Email Dispatcher to Owner Inbox",
          "WhatsApp Direct Floating Action Button",
          "Custom Thank-You State & Lead Confirmation"
        ]
      },
      {
        id: "ec_macro_seo",
        name: "SEO, Meta Architecture & Social Sharing",
        icon: "📊",
        description: "Search engine optimization and high-resolution OpenGraph cards for WhatsApp, iMessage, and Twitter.",
        microFeatures: [
          "OpenGraph & Twitter Card Dynamic Previews",
          "Automated XML Sitemap & Robots.txt",
          "Organization JSON-LD Rich Schema",
          "Semantic Heading H1-H6 Hierarchy"
        ]
      },
      {
        id: "ec_macro_accessibility",
        name: "Accessibility & Visitor Utilities",
        icon: "♿",
        description: "Inclusive design with screen-reader compliance, dark/light theme options, and privacy consent banners.",
        microFeatures: [
          "WCAG 2.1 AAA Screen Reader Landmarks",
          "Dark / Light Mode Aesthetic Theme Switcher",
          "Dynamic Fluid Typography Scaling",
          "GDPR & CCPA Cookie Consent Banner"
        ]
      }
    ]
  },
  {
    id: "sales_engine",
    name: "Sales Website & Smart Booking Engine",
    icon: "🛍️",
    priceInr: 19999,
    priceUsd: 499,
    deltaPriceInr: 15000,
    deltaPriceUsd: 400,
    badge: "Revenue Engine",
    tagline: "E-Commerce store, 1-click checkouts, appointment calendar & instant payment gateways.",
    description: "Direct revenue engine: sell physical/digital products or book calendar appointments. Includes product catalogs, slide-over carts, live calendar slot booking, automated WhatsApp reminders, and Stripe/Razorpay/UPI checkout.",
    includedFeatures: [
      "1-Click Express Checkout (Apple Pay, Google Pay, Razorpay, UPI)",
      "Interactive Real-Time Calendar Slot Picker & Sync",
      "Product Catalog with Variants (Size, Color, SKU) & Cart",
      "Automated WhatsApp & Email 24h/2h Confirmation Reminders",
      "GST-Compliant Automated PDF Invoices & Receipts"
    ],
    macroFeatures: [
      {
        id: "se_macro_checkout",
        name: "1-Click Express Checkout & Gateways",
        icon: "💳",
        description: "Zero-friction single-page checkout supporting Apple Pay, Google Pay, UPI, and credit cards with instant order fulfillment.",
        microFeatures: [
          "Apple Pay, Google Pay, Razorpay & UPI Checkout",
          "Dynamic Tax & Promo Discount Engine",
          "Abandoned Checkout Recovery Hook",
          "Instant Digital Fulfillment Handshake"
        ]
      },
      {
        id: "se_macro_booking",
        name: "Interactive Live Appointment Slot Picker",
        icon: "📅",
        description: "Real-time calendar slot blocking with timezone auto-detection, custom meeting buffers, and operational hours.",
        microFeatures: [
          "Real-Time Calendar Date & Slot Grid",
          "Automatic Timezone Detection & Conversion",
          "Custom Meeting Buffers & Operating Hours",
          "Doctor / Specialist Selection per Branch"
        ]
      },
      {
        id: "se_macro_reminders",
        name: "2-Way Calendar Sync & Reminders",
        icon: "📱",
        description: "Google Calendar & Outlook sync paired with automated WhatsApp reminders that eliminate appointment no-shows.",
        microFeatures: [
          "Google Calendar 2-Way API Sync",
          "Microsoft Outlook / Office 365 Sync",
          "Automated WhatsApp 24h & 2h Reminders",
          "1-Click Client Reschedule & Cancel Links"
        ]
      },
      {
        id: "se_macro_catalog",
        name: "Product Catalog & Cart Management",
        icon: "🛍️",
        description: "Comprehensive e-commerce catalog with variant selectors, slide-over cart, and live inventory indicators.",
        microFeatures: [
          "Product Catalog with Variants (Size, Color, SKU)",
          "Interactive Slide-Over Shopping Cart",
          "Dynamic Low-Stock Inventory Indicators",
          "Live Variant & Material Switcher"
        ]
      },
      {
        id: "se_macro_invoicing",
        name: "Pre-Payments & Automated Invoicing",
        icon: "🧾",
        description: "Mandatory booking deposits, verified webhooks, and automatic GST-compliant PDF invoices.",
        microFeatures: [
          "Mandatory Booking Deposit Checkout Step",
          "Razorpay, UPI & Stripe Webhook Verification",
          "Automated GST / Tax Invoice Receipts (PDF)",
          "Multi-Branch & Location Routing"
        ]
      }
    ]
  },
  {
    id: "marketing_campaigns",
    name: "Marketing & BOFU Conversion Campaigns",
    icon: "📈",
    priceInr: 19999,
    priceUsd: 499,
    deltaPriceInr: 15000,
    deltaPriceUsd: 400,
    badge: "High Conversion",
    tagline: "Ad traffic landing pages, UGC review wall, urgency mechanics & UTM attribution.",
    description: "Transform cold ad traffic into paying customers with high-converting BOFU pages, countdown drop timers, sticky announcement bars, video testimonials, comparison matrices, and Meta CAPI / GA4 pixel telemetry.",
    includedFeatures: [
      "High-Converting BOFU Ad Landing Architecture",
      "Urgency Countdown Timers & Sticky Announcement Banners",
      "UGC Video Reviews Wall & 4K Product Showcase",
      "Multi-Channel UTM Attribution Tracking & Link Builder",
      "Meta CAPI, Google Analytics 4 & TikTok Pixel Telemetry"
    ],
    macroFeatures: [
      {
        id: "mc_macro_landing",
        name: "High-Converting BOFU Landing Architecture",
        icon: "🚀",
        description: "Direct response layouts engineered to convert cold ad traffic into paying customers.",
        microFeatures: [
          "Direct Response Hero & Value Proposition",
          "Benefit Stacks & Objection Handling Sections",
          "Sticky Mobile Conversion Call-to-Action Bar",
          "High-Speed Edge Delivery & Asset Inlining"
        ]
      },
      {
        id: "mc_macro_urgency",
        name: "Urgency & Scarcity Mechanics",
        icon: "⚡",
        description: "Dynamic countdown timers, top announcement bars, and stock meters that compel visitors to take action immediately.",
        microFeatures: [
          "Real-Time Flash Sale Countdown Clocks",
          "Sticky Offer-First Announcement Banner",
          "Dynamic Low-Stock Inventory Indicators",
          "Live Social-Proof Purchase Toasts"
        ]
      },
      {
        id: "mc_macro_attribution",
        name: "Full-Spectrum UTM & Telemetry Attribution",
        icon: "📊",
        description: "Captures source, medium, and campaign parameters with every order and passes server-side conversion pixels to Meta and Google.",
        microFeatures: [
          "URL Parameter Parser (UTM Source, Medium, Campaign)",
          "Persistent 30-Day Cookie Source Binding",
          "Meta Pixel & CAPI Server-Side Telemetry",
          "GA4 & Google Tag Manager DataLayer Events"
        ]
      },
      {
        id: "mc_macro_ugc",
        name: "Social Proof & UGC Video Review Wall",
        icon: "📹",
        description: "Mobile-optimized vertical TikTok / Reel video testimonials wall with customer star ratings and before/after comparisons.",
        microFeatures: [
          "Vertical Reel / TikTok Video Player",
          "Verified Customer Star Rating Filters",
          "Before & After Interactive Split Slider",
          "Customer Video Testimonials Grid"
        ]
      },
      {
        id: "mc_macro_comparison",
        name: "Interactive Comparison Matrix & 360 Viewer",
        icon: "🔄",
        description: "Interactive 4K multi-angle viewer and value-anchoring comparison table establishing your offering as superior to alternatives.",
        microFeatures: [
          "4K Multi-Angle Product Zoomer",
          "Side-by-Side Value-Anchoring Matrix",
          "Live Variant & Material Switcher",
          "Competitor Comparison Breakdown"
        ]
      }
    ]
  },
  {
    id: "portals_dashboards",
    name: "Portals, Dashboards & Team Operations",
    icon: "👥",
    priceInr: 24999,
    priceUsd: 599,
    deltaPriceInr: 20000,
    deltaPriceUsd: 500,
    badge: "Operations Hub",
    tagline: "Client hubs, staff rostering, geolocation punch clock, inventory & admin dashboards.",
    description: "Equip your business with dedicated Client Hubs (file vaults, milestone tracking, invoices, e-signatures), Staff Rostering & Time-off approval workflows, GPS Geolocation Punch Clock, and an Executive Admin Control Dashboard.",
    includedFeatures: [
      "Dedicated Client Hub with Document Vault & E-Signatures",
      "Searchable Staff Directory & Weekly Shift Rostering Calendar",
      "Mobile Clock-in Punch Clock with GPS Geolocation Verification",
      "Self-Serve Time-Off & Leave Approval Workflow",
      "Executive Business Analytics & CRM Pipeline Dashboard"
    ],
    macroFeatures: [
      {
        id: "pd_macro_client_hub",
        name: "Dedicated Client Hub & Document Vault",
        icon: "💼",
        description: "A secure digital space for your clients with file storage, digital contracts, and live project progress tracking.",
        microFeatures: [
          "Secure Client Project Dashboard",
          "Proposal Agreements & E-Signatures",
          "Automated PDF Invoices & Milestone Tracker",
          "Encrypted Private Document Vault"
        ]
      },
      {
        id: "pd_macro_directory",
        name: "Digital Staff Directory & RBAC Security",
        icon: "👥",
        description: "Searchable employee directory with department categorization, individual profiles, and granular role permissions.",
        microFeatures: [
          "Searchable Team Directory with Profiles",
          "Granular RBAC Security Roles (Admin, Manager, Staff)",
          "Encrypted Employee Profile Space",
          "Team Member Invitation & Role Revocation"
        ]
      },
      {
        id: "pd_macro_roster",
        name: "Interactive Weekly Shift Rostering",
        icon: "🗓️",
        description: "Drag-and-drop weekly shift calendar builder with automated conflict detection and 1-click roster broadcasting.",
        microFeatures: [
          "Weekly & Monthly Shift Calendar Builder",
          "Automated Shift Conflict & Overtime Detection",
          "1-Click Roster Publishing & SMS/WhatsApp Alerts",
          "Multi-Department Coverage Views"
        ]
      },
      {
        id: "pd_macro_leave",
        name: "Time-Off & Leave Approval Engine",
        icon: "🏖️",
        description: "Self-serve leave requests with 1-click manager approvals and automated roster blocking on approved time off.",
        microFeatures: [
          "Staff Self-Serve Time-Off Request Portal",
          "Manager 1-Click Approve / Decline Action",
          "Automated Roster Blocking on Leave",
          "Accrued Leave Balance Tracking"
        ]
      },
      {
        id: "pd_macro_punchclock",
        name: "Mobile GPS Punch Clock Timesheets",
        icon: "⏱️",
        description: "Mobile web punch clock with geofencing verification ensuring staff are physically on-site when clocking in.",
        microFeatures: [
          "Mobile Web Geofenced Clock-In Punch Clock",
          "Branch Geofence 100m Radius Verification",
          "Break Time & Meal Tracking",
          "1-Click Work-Hour Summary & Payroll CSV Export"
        ]
      }
    ]
  },
  {
    id: "design_3d",
    name: "3D Interactive & Experiential Design",
    icon: "🎨",
    priceInr: 39999,
    priceUsd: 899,
    deltaPriceInr: 35000,
    deltaPriceUsd: 800,
    badge: "Awwwards Tier",
    tagline: "Interactive Three.js 3D viewport, spatial particles, reactive audio & 60fps rendering.",
    description: "Give your brand a breathtaking digital presence with interactive 3D model orbiters, particle shaders, scroll-driven typography reveals, reactive audio, and silky smooth transitions.",
    includedFeatures: [
      "Three.js / WebGL Interactive 3D Model Canvas",
      "Lenis Smooth Scrolling with Pinned Story Chapters",
      "Kinetic Magnetic Buttons & Fluid Micro-Interactions",
      "Ambient Reactive Sound Design & Audio Immersion",
      "High-Performance 60fps Mobile-Optimized Rendering"
    ],
    macroFeatures: [
      {
        id: "d3_macro_webgl",
        name: "High-Performance WebGL / Three.js 3D Canvas",
        icon: "🎨",
        description: "Three.js WebGL viewport with DRACO compression, studio HDRI lighting, and smooth dampening orbit controls.",
        microFeatures: [
          "Three.js / React Three Fiber Viewport",
          "DRACO & KTX2 85% Asset Compression",
          "Studio HDRI Environment Map Lighting",
          "Smooth OrbitControls with Dampening"
        ]
      },
      {
        id: "d3_macro_choreography",
        name: "Scroll-Driven 3D Camera Choreography",
        icon: "🎬",
        description: "Pinned camera trajectory along scroll position with cinematic keyframes and clickable annotation hotspots.",
        microFeatures: [
          "GSAP ScrollTrigger Pinned 3D Timeline",
          "Cinematic Keyframe Camera Transitions",
          "Interactive 3D Hotspot Annotation Pins",
          "Exploded View Animations"
        ]
      },
      {
        id: "d3_macro_customizer",
        name: "Real-Time Material & Color Switcher",
        icon: "🔄",
        description: "Interactive UI controls allowing visitors to swap model colors, textures, and metallic finishes in real-time.",
        microFeatures: [
          "Real-Time Mesh Material Color Switcher",
          "Metallic & Roughness Finish Toggles (Matte, Gloss, Carbon)",
          "Branded Canvas Loading Preloader",
          "Dynamic Texture Swap Engine"
        ]
      },
      {
        id: "d3_macro_audio",
        name: "Ambient Spatial Audio & Sound Design",
        icon: "🎵",
        description: "Interactive procedural sound design, click feedback, and spatial audio positioning engaging the visitor's senses.",
        microFeatures: [
          "Web Audio API Spatial Sound Synthesis",
          "Tactile Haptic Click & Rotation Sound",
          "Persistent Sound Toggle with Waveform",
          "Ambient Sound Immersion"
        ]
      },
      {
        id: "d3_macro_mobile",
        name: "Mobile Gyroscope Controls & 60fps Thermal Guard",
        icon: "📱",
        description: "Smartphone gyroscope tilt controls paired with dynamic resolution scaling maintaining solid 60fps without battery drain.",
        microFeatures: [
          "DeviceOrientation Gyroscope Tilt Navigation",
          "Adaptive 60fps Thermal & Battery Guard",
          "WebGL Context Loss Recovery Handler",
          "Mobile Touch Gestures"
        ]
      }
    ]
  },
  {
    id: "fullstack_saas",
    name: "Custom SaaS & Full-Stack Web Application",
    icon: "⚡",
    priceInr: 69999,
    priceUsd: 1499,
    deltaPriceInr: 65000,
    deltaPriceUsd: 1400,
    badge: "Software MVP",
    tagline: "Full-stack software with Supabase PostgreSQL, multi-role auth & billing webhooks.",
    description: "Production-ready software platforms, SaaS MVPs, marketplaces, and custom web apps with Next.js App Router, Supabase PostgreSQL with Row-Level Security, multi-role authentication, and subscription billing.",
    includedFeatures: [
      "Next.js Full-Stack App Router Architecture",
      "Supabase PostgreSQL Database & Row-Level Security (RLS)",
      "Secure Multi-Provider Authentication (Google, Email, Magic Link)",
      "Stripe / Razorpay Subscription & Payment Webhooks",
      "Executive Admin and Client Management Dashboards"
    ],
    macroFeatures: [
      {
        id: "fs_macro_app",
        name: "Next.js App Router Architecture",
        icon: "⚡",
        description: "Full-stack server-side rendered application with type-safe APIs, fast edge routes, and production caching.",
        microFeatures: [
          "Server Components & Server Actions",
          "Type-Safe API Route Handlers",
          "Edge Middleware & Route Guards",
          "High-Performance Production Build Optimization"
        ]
      },
      {
        id: "fs_macro_db",
        name: "Supabase PostgreSQL Relational Database",
        icon: "🗄️",
        description: "Normalized relational schema with foreign key constraints, UUID primary keys, and automated timestamp triggers.",
        microFeatures: [
          "Normalized Relational PostgreSQL DDL Schema",
          "B-Tree Indexes & Sub-20ms Queries",
          "Automated Updated_at Database Triggers",
          "Database Migrations & Seed Data"
        ]
      },
      {
        id: "fs_macro_auth",
        name: "Zero-Trust Row-Level Security & Auth",
        icon: "🔐",
        description: "Postgres RLS policies guaranteeing strict tenant isolation, paired with Google OAuth, Magic Links, and session tokens.",
        microFeatures: [
          "Postgres Row-Level Security (RLS) Policies",
          "Multi-Provider OAuth 2.0 (Google, Magic Link, Email)",
          "PKCE Auth Flow with HTTP-Only Cookies",
          "Automated Password Reset Workflows"
        ]
      },
      {
        id: "fs_macro_billing",
        name: "Stripe & Razorpay Webhook Billing Engine",
        icon: "💳",
        description: "Subscription and recurring billing engine with cryptographic signature verification and automated digital fulfillment.",
        microFeatures: [
          "Recurring Subscriptions & One-Time Payments",
          "Cryptographic Webhook Signature Handlers",
          "Automated Invoice Generation & Customer Portal",
          "Plan Upgrade & Downgrade Proration"
        ]
      },
      {
        id: "fs_macro_operations",
        name: "Role-Based Access Control & Operations",
        icon: "🛡️",
        description: "Multi-tier administrative roles with immutable audit logging and automated daily database snapshot backups.",
        microFeatures: [
          "Multi-Tier Role Permissions (Admin, Manager, Member)",
          "Immutable Security Audit Logging",
          "Outbound Webhooks to Zapier & Slack",
          "Automated Daily Database Snapshots & CSV Export"
        ]
      }
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

