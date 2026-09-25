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
    name: "Essential Website Core Architecture",
    icon: "🏛️",
    priceInr: 4999,
    priceUsd: 175,
    isEssential: true,
    badge: "Base Included",
    tagline: "Ultra-fast modern responsive foundation with pristine typography.",
    description: "Responsive layout for mobile/tablet/desktop, About story, Service pages, Contact form with email notifications, 95+ Lighthouse speed, SSL and Edge CDN hosting setup.",
    includedFeatures: [
      "Bespoke Responsive Layout (Mobile + Desktop)",
      "About Us & Services Directory Pages",
      "Contact Inquiry Form with Instant Email Alerts",
      "Speed Optimization (Lighthouse 95+)",
      "SSL Certificate & Domain DNS Configuration"
    ]
  },
  {
    id: "ecommerce_ordering",
    name: "E-Commerce & Online Storefront Suite",
    icon: "🛍️",
    priceInr: 8999,
    priceUsd: 295,
    badge: "High-ROI",
    tagline: "Product catalog, variants, cart, Razorpay/Stripe checkout & GST invoices.",
    description: "Sell products seamlessly with inventory management, color/size variants, faceted search, discount coupon codes, automated tax invoice PDFs, and abandoned cart recovery.",
    includedFeatures: [
      "Product Catalog with Variants (Size, Color, SKU)",
      "Slide-Over Cart & Frictionless One-Page Checkout",
      "Razorpay, Stripe & UPI Payment Gateway Integration",
      "Real-Time Stock Inventory & Low-Stock Alerts",
      "GST Compliant Automated PDF Invoices"
    ]
  },
  {
    id: "booking_appointments",
    name: "Smart Appointment & Booking Engine",
    icon: "📅",
    priceInr: 6999,
    priceUsd: 235,
    badge: "Popular",
    tagline: "Live slot picker, stylist/doctor selection & automated WhatsApp reminders.",
    description: "Allow clients to book appointments 24/7 with real-time calendar slot blocking, staff availability schedules, deposit payments, and automated WhatsApp/SMS notifications.",
    includedFeatures: [
      "Interactive Calendar Slot Availability Blocker",
      "Staff, Stylist, or Doctor Specialist Selector",
      "Booking Deposit & Prepayment Gateway Integration",
      "Automated WhatsApp & Email 24h/2h Reminders",
      "Self-Service Rescheduling & Cancellation Link"
    ]
  },
  {
    id: "lead_crm",
    name: "Lead Capture & Sales CRM Funnel",
    icon: "🎯",
    priceInr: 5499,
    priceUsd: 185,
    tagline: "Quote builders, lead database, instant WhatsApp pings & sales pipeline.",
    description: "Turn casual visitors into paying clients with high-converting inquiry forms, centralized searchable lead database, instant WhatsApp alerts to owners, and follow-up reminders.",
    includedFeatures: [
      "Multi-Step Consultation & Quote Request Modals",
      "Centralized Searchable Lead Repository",
      "Instant WhatsApp & Telegram Notification to Owner",
      "Lead Status Pipeline (New, Contacted, Qualified, Won)",
      "HubSpot / Zoho CRM Webhook Synchronization"
    ]
  },
  {
    id: "ai_assistant",
    name: "AI Copilot & Conversational Chatbot",
    icon: "🧠",
    priceInr: 6999,
    priceUsd: 235,
    badge: "AI Native",
    tagline: "Context-aware AI assistant trained on your business docs, products & FAQs.",
    description: "Empower visitors with a streaming AI assistant that answers questions accurately, recommends relevant services/products, and qualifies prospects before booking.",
    includedFeatures: [
      "Streaming Gemini / OpenAI Conversational Widget",
      "Custom Knowledge Base Trained on Your Business",
      "Smart 24/7 FAQ & Policy Resolution",
      "AI Product & Service Recommendation Engine",
      "Natural Language Lead Qualification Chat"
    ]
  },
  {
    id: "design_3d_gsap",
    name: "Luxury 3D WebGL & GSAP Choreography",
    icon: "🎨",
    priceInr: 11999,
    priceUsd: 395,
    badge: "Awwwards Tier",
    tagline: "Interactive Three.js 3D viewport, Lenis smooth scroll & magnetic physics.",
    description: "Give your brand a breathtaking digital presence with interactive 3D model orbiters, particle shaders, scroll-driven typography reveals, and silky smooth transitions.",
    includedFeatures: [
      "Three.js / WebGL Interactive 3D Model Canvas",
      "Lenis Smooth Scrolling with Pinned Story Chapters",
      "Kinetic Magnetic Buttons & Fluid Micro-Interactions",
      "Custom Dark / Light Mode Palette Engine",
      "GSAP High-Performance Hardware-Accelerated Timelines"
    ]
  },
  {
    id: "staff_portal",
    name: "Employee & Staff Management Portal",
    icon: "👥",
    priceInr: 6999,
    priceUsd: 235,
    tagline: "Staff logins, shift scheduling roster, attendance & commission tracking.",
    description: "Equip your internal team with dedicated logins, daily appointment rosters, shift schedules, task checklists, and automated performance commission reports.",
    includedFeatures: [
      "Dedicated Employee Login & Profile Space",
      "Weekly Shift Scheduling & Availability Calendar",
      "Digital Attendance & Timesheet Tracking",
      "Lead & Booking Assignment per Specialist",
      "Automated Sales Commission & Performance Reports"
    ]
  },
  {
    id: "multi_location",
    name: "Multi-Location & Branch Network Hub",
    icon: "🏢",
    priceInr: 5999,
    priceUsd: 195,
    tagline: "Branch landing pages, geolocation store locator & local booking routing.",
    description: "Engineered for growing businesses with multiple clinics, salons, restaurants, or offices across different cities with individual contact info and schedules.",
    includedFeatures: [
      "Dynamic Branch / Store City Landing Pages",
      "Interactive Geolocation GPS Map Locator",
      "City-Specific Contact Phones & Operating Hours",
      "Auto-Routing Bookings to Closest Branch Manager",
      "Multi-Branch Performance Comparison Dashboard"
    ]
  },
  {
    id: "growth_seo",
    name: "Hyper-Growth SEO, Schema & Ad Telemetry",
    icon: "📈",
    priceInr: 4999,
    priceUsd: 165,
    tagline: "Google Rich Snippets, JSON-LD schema, GA4 funnels & Meta ad pixels.",
    description: "Rank higher on Google searches and track ad performance accurately with JSON-LD organization schema, sitemap generator, Meta Pixel and GA4 conversion funnels.",
    includedFeatures: [
      "Automated XML Sitemap & Google Search Console Verification",
      "Local Business & Organization JSON-LD Schema",
      "Meta (Facebook/Instagram) Pixel with Event Tracking",
      "Google Analytics 4 (GA4) Custom Funnel Setup",
      "Core Web Vitals & Image Alt-Text Optimization"
    ]
  },
  {
    id: "devops_care",
    name: "Cloud DevOps, Daily Backups & Care Retainer",
    icon: "🛡️",
    priceInr: 3499,
    priceUsd: 120,
    tagline: "Automated daily cloud backups, 60-day warranty & monthly maintenance.",
    description: "Worry-free production stability with automated database snapshots, 24/7 uptime monitoring, security patches, and direct priority developer support.",
    includedFeatures: [
      "Vercel Edge CDN & Production Database Provisioning",
      "Automated Daily Code & Data Cloud Backups",
      "24/7 Uptime & Error Crash Monitoring (Sentry)",
      "60-Day Extended Hypercare Bug Fix Warranty",
      "3-Month Monthly Software & Content Maintenance Retainer"
    ]
  },
  {
    id: "copywriting",
    name: "Conversion Copywriting & Strategic Messaging",
    icon: "✍️",
    priceInr: 3499,
    priceUsd: 120,
    badge: "High Impact",
    tagline: "Audience-tailored headlines, value propositions & conversion-tested CTAs.",
    description: "Engage visitors immediately with bespoke narrative copywriting, pain-point hooks, clear service descriptions, and punchy action buttons that drive conversions.",
    includedFeatures: [
      "Brand Narrative & Value Proposition Formulation",
      "Conversion-Focused Hero Headline & Sub-Headline Crafting",
      "Feature-Benefit Translation & Micro-Copy Polish",
      "Persuasive Section Headers & Call-to-Action Buttons"
    ]
  },
  {
    id: "source_attribution_hub",
    name: "Multi-Source UTM Campaign & Attribution Hub",
    icon: "📊",
    priceInr: 5499,
    priceUsd: 185,
    badge: "Tracking",
    tagline: "UTM campaign generator, multi-channel source tracker & ad conversion pixels.",
    description: "Track and attribute every lead and sale across Meta Ads, Google Ads, TikTok, YouTube, Newsletters, and Influencers with live tracking link generator.",
    includedFeatures: [
      "Interactive Multi-Channel UTM Campaign Generator",
      "Meta Conversions API (CAPI) & TikTok Pixel Integration",
      "Google Tag Manager & GA4 E-Commerce Event Telemetry",
      "First-Touch & Last-Touch Source Tracking on Leads",
      "Custom Campaign QR Codes & 1-Click Shortlinks"
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
    title: "Get More Inbound Leads & Sales",
    tag: "Sales & Pipeline",
    icon: "🎯",
    symptom: "Visitors browse but inquiries are low. Leads slip through the cracks without immediate follow-ups.",
    outcome: "Interactive quote builders, centralized lead database & instant WhatsApp alerts to owner.",
    recommendedBundles: ["essential_core", "lead_crm", "growth_seo"]
  },
  {
    id: "bofu_conversion",
    title: "Turn Traffic into Immediate Buyers (E-Comm / Drop)",
    tag: "Conversion & Orders",
    icon: "🚀",
    symptom: "High bounce rate and cart abandonment. Visitors leave without purchasing from ads or socials.",
    outcome: "1-Click checkout, urgency countdowns, offer banners, UGC video reviews & UTM tracking.",
    recommendedBundles: ["essential_core", "ecommerce_ordering", "source_attribution_hub", "copywriting"]
  },
  {
    id: "ai_assistant",
    title: "24/7 AI Customer Concierge & Smart Chat",
    tag: "AI Automation",
    icon: "🧠",
    symptom: "Tired of answering repetitive FAQs manually and losing customers outside business hours.",
    outcome: "Context-aware AI concierge trained on your business to answer questions & qualify buyers 24/7.",
    recommendedBundles: ["essential_core", "ai_assistant", "lead_crm"]
  },
  {
    id: "brand_authority",
    title: "Elevate Brand Presence to Luxury / Premium Tier",
    tag: "High-Status Trust",
    icon: "💎",
    symptom: "Site looks generic or outdated. Can't justify charging premium prices or closing enterprise deals.",
    outcome: "Awwwards-tier 3D WebGL visuals, silky Lenis scroll, kinetic typography & luxury positioning.",
    recommendedBundles: ["essential_core", "design_3d_gsap", "growth_seo"]
  },
  {
    id: "automate_operations",
    title: "Save Time & Automate Bookings / Operations",
    tag: "Time-Saving Hub",
    icon: "⚙️",
    symptom: "Wasting hours scheduling calls, coordinating staff appointments, and chasing client updates.",
    outcome: "Self-serve 24/7 calendar booking, staff rosters, deposit payments & client portal.",
    recommendedBundles: ["essential_core", "booking_appointments", "staff_portal"]
  },
  {
    id: "fast_launchpad",
    title: "Clean, High-Speed Launchpad (Base)",
    tag: "Fast Go-Live",
    icon: "🟢",
    symptom: "Just need a razor-sharp, ultra-fast modern frontend landing page to go live right away.",
    outcome: "Next.js performance foundation, mobile responsiveness, contact form & edge hosting.",
    recommendedBundles: ["essential_core"]
  }
];

export interface IndustryOption {
  id: string;
  name: string;
  icon: string;
  recommendedBundles: string[];
  sampleBusinessName: string;
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "salon",
    name: "Salon, Spa & Aesthetics",
    icon: "💇‍♀️",
    sampleBusinessName: "Lumina Hair & Beauty Lounge",
    recommendedBundles: ["essential_core", "booking_appointments", "growth_seo", "design_3d_gsap"]
  },
  {
    id: "fashion",
    name: "Fashion & E-Commerce D2C",
    icon: "👗",
    sampleBusinessName: "Velvet & Silk Apparel",
    recommendedBundles: ["essential_core", "ecommerce_ordering", "growth_seo", "ai_assistant"]
  },
  {
    id: "clinic",
    name: "Doctor, Dental & Healthcare",
    icon: "🩺",
    sampleBusinessName: "Apex Dental & Wellness Care",
    recommendedBundles: ["essential_core", "booking_appointments", "lead_crm", "growth_seo"]
  },
  {
    id: "restaurant",
    name: "Restaurant, Bar & Cafe",
    icon: "🍽️",
    sampleBusinessName: "Artisan Bistro & Espresso",
    recommendedBundles: ["essential_core", "ecommerce_ordering", "booking_appointments", "growth_seo"]
  },
  {
    id: "real_estate",
    name: "Real Estate & Builders",
    icon: "🏢",
    sampleBusinessName: "Skyline Realty & Estates",
    recommendedBundles: ["essential_core", "lead_crm", "design_3d_gsap", "growth_seo"]
  },
  {
    id: "b2b",
    name: "B2B Manufacturer & Exporter",
    icon: "🏭",
    sampleBusinessName: "PrimeTech Industrial Goods",
    recommendedBundles: ["essential_core", "lead_crm", "multi_location", "growth_seo"]
  },
  {
    id: "portfolio",
    name: "Creator, Studio & Freelancer",
    icon: "🎨",
    sampleBusinessName: "Kinetics Visual Design Studio",
    recommendedBundles: ["essential_core", "design_3d_gsap", "lead_crm"]
  },
  {
    id: "saas",
    name: "SaaS App & Digital Platform",
    icon: "⚡",
    sampleBusinessName: "FlowMetric AI Cloud Platform",
    recommendedBundles: ["essential_core", "ai_assistant", "design_3d_gsap", "devops_care"]
  },
  {
    id: "education",
    name: "Education, Coaching & Academy",
    icon: "🎓",
    sampleBusinessName: "NextGen Learning Institute",
    recommendedBundles: ["essential_core", "booking_appointments", "lead_crm", "ai_assistant"]
  },
  {
    id: "custom",
    name: "Custom Bespoke Business",
    icon: "🛠️",
    sampleBusinessName: "Signature Enterprise Project",
    recommendedBundles: ["essential_core", "lead_crm", "design_3d_gsap"]
  }
];
