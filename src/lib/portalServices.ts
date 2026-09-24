import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface PackageAddon {
  id: string;
  name: string;
  price_usd: number;
}

export interface WebsitePackage {
  id: string;
  name: string;
  tagline: string;
  price_usd: number;
  price_inr: number;
  turnaround_weeks: string;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
  deliverables: string[];
  addons: PackageAddon[];
  is_active?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  due_date?: string;
}

export interface ProjectDeliverable {
  id: string;
  title: string;
  url: string;
  type: "figma" | "github" | "preview" | "asset" | "other";
  added_at: string;
}

export interface ClientProject {
  id: string;
  client_id?: string;
  client_email: string;
  client_name: string;
  company_name?: string;
  title: string;
  description?: string;
  package_id?: string;
  selected_aesthetic?: string;
  scope_tier?: string;
  pages_count?: string;
  features_requested?: string[];
  content_status?: string;
  references?: string;
  must_haves?: string;
  dealbreakers?: string;
  status: "Discovery" | "Design" | "Development" | "Review" | "Launch" | "Completed" | "On Hold";
  progress_percent: number;
  budget_usd?: number;
  budget_inr?: number;
  target_launch_date?: string;
  live_preview_url?: string;
  figma_url?: string;
  github_repo?: string;
  milestones: Milestone[];
  deliverables: ProjectDeliverable[];
  created_at: string;
  updated_at?: string;
}

export interface ChangeRequest {
  id: string;
  project_id: string;
  client_email?: string;
  title: string;
  description: string;
  category?: "Design" | "Content" | "Feature" | "Bug / Fix" | "Other";
  status: "pending" | "in-review" | "implemented" | "rejected";
  created_at: string;
  resolved_at?: string;
  admin_reply?: string;
}

export interface EContract {
  id: string;
  project_id: string;
  client_id?: string;
  client_email: string;
  client_name: string;
  package_name: string;
  scope_summary: string;
  total_amount_usd: number;
  payment_terms: string;
  legal_terms: string;
  status: "draft" | "sent" | "signed" | "cancelled";
  signature_url?: string;
  signature_name?: string;
  signed_at?: string;
  signed_ip?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectAsset {
  id: string;
  project_id: string;
  client_id?: string;
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  storage_path: string;
  public_url: string;
  category: "logo" | "brand_assets" | "content_copy" | "images_media" | "design_reference" | "contract" | "general";
  description?: string;
  created_at: string;
}

export interface BookingSubmission {
  client_name: string;
  client_email: string;
  company_name?: string;
  phone?: string;
  package_id?: string;
  selected_aesthetic?: string;
  scope_tier?: string;
  selected_addons?: string[];
  estimated_budget_usd?: number;
  estimated_budget_inr?: number;
  timeline_requirement?: string;
  project_description: string;
  client_message?: string;
}

export interface LeadItem {
  id: string;
  client_name: string;
  client_email: string;
  company_name?: string;
  phone?: string;
  package_interest?: string;
  source?: string;
  status: "pending" | "contacted" | "converted" | "archived";
  created_at: string;
  selected_addons?: string[];
  estimated_budget_usd?: number;
  estimated_budget_inr?: number;
  project_description?: string;
  timeline_requirement?: string;
  client_message?: string;
  selected_aesthetic?: string;
  scope_tier?: string;
}

export interface PackageGranularFeature {
  id: string;
  package_id: string;
  function_key: string;
  title: string;
  category: string;
  description: string;
  technical_deliverables: string;
  business_impact: string;
  complexity: "Standard" | "Advanced" | "Specialized" | "Enterprise";
  is_core: boolean;
  display_order: number;
  created_at?: string;
}

// --------------------------------------------------------------------------------
// DEFAULT FALLBACK DATA (Guarantees zero-blank states and rapid offline preview)
// --------------------------------------------------------------------------------

export const DEFAULT_PACKAGES: WebsitePackage[] = [
  {
    id: "interactive-3d-experience",
    name: "3D Interactive & Brand Experience",
    tagline: "Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.",
    price_usd: 1299,
    price_inr: 49999,
    turnaround_weeks: "3-5 weeks",
    badge: "Signature",
    popular: true,
    description: "Designed for visionary brands, high-profile portfolios, and innovative tech products requiring top-tier creative engineering, custom Three.js shaders, and buttery-smooth micro-interactions.",
    features: [
      "Custom Three.js / WebGL 3D interactive canvas",
      "Tailored fluid physics, particles, or 3D model integration",
      "Ultra high-performance 60fps rendering & mobile fallback",
      "Sound design & ambient reactive audio integration",
      "Bespoke typography, luxury glassmorphism & dark/light palettes",
      "Full responsive optimization across iOS, Android & Desktop",
      "Next.js / Vite high-speed modern frontend architecture",
      "Full Technical SEO & rich social sharing cards"
    ],
    deliverables: [
      "Custom Interactive Web Experience (Next.js/React + Three.js)",
      "Source code on private GitHub repository",
      "Optimized 3D assets & compressed textures",
      "Vercel/Cloudflare production deployment setup",
      "30-day post-launch hypercare & bug fix warranty"
    ],
    addons: [
      { id: "cms", name: "Headless CMS (Sanity / Contentful)", price_usd: 120 },
      { id: "multi-lang", name: "Multi-language Localization (i18n)", price_usd: 90 },
      { id: "custom-audio", name: "Original Sound Effects & Audio Composition", price_usd: 90 },
      { id: "priority", name: "Priority Express Delivery (2 weeks)", price_usd: 250 }
    ],
    is_active: true
  },
  {
    id: "growth-marketing-campaigns",
    name: "BOFU Website Marketing & Sources Management Package",
    tagline: "High-converting on-site BOFU pages, 1-click checkouts, urgency mechanics & multi-channel UTM attribution.",
    price_usd: 899,
    price_inr: 29999,
    turnaround_weeks: "2-3 weeks",
    badge: "High Conversion",
    popular: true,
    description: "The definitive on-website conversion architecture. Designed to receive traffic from your ad campaigns and social media, transforming cold visitors into revenue. Includes all 9 core BOFU on-site deliverables: 1-click checkout flow, countdown timers, offer-first banners, 4K product galleries, studio presentation layouts, UGC video reviews wall, price comparison matrix, FOMO scarcity popups, and freebie lead magnets — backed by full-spectrum UTM multi-source tracking and conversion pixel telemetry.",
    features: [
      "1-Click Express Checkout: Apple Pay, Google Pay, Razorpay, UPI & credit card frictionless flow",
      "Urgency Countdown Clocks: Dynamic drop timers and flash sale headers driving immediate orders",
      "Offer-First Banners: Sticky top announcement bars with coupon codes and free gift thresholds",
      "Product Gallery & 360 Viewer: Ultra-crisp 4K multi-angle viewer with zoom and variant switchers",
      "Studio Shoots Layout: Web-optimized presentation of studio photography and 3D exploded views",
      "UGC Testimonials Wall: Embedded vertical TikTok/Reel customer review player with star ratings",
      "Price Comparison Matrix: Interactive side-by-side value-anchoring table against alternatives",
      "FOMO & Scarcity Notifiers: Real-time purchase popup toasts and remaining inventory stock meters",
      "Freebies & Lead Magnets: On-site email/WhatsApp opt-in capture forms with instant asset delivery",
      "Multi-Channel UTM Tracking: On-site ingestion capturing source, medium & campaign with every order/lead",
      "Pixel Telemetry: Meta Pixel & CAPI, Google Tag Manager, GA4 e-commerce events & TikTok Pixel",
      "Adaptive Website Scope: Configured for E-Commerce Stores, Single Product Drops, or Personal Brand Sites"
    ],
    deliverables: [
      "All 9 BOFU On-Website Pages & Interactive Modules",
      "1-Click Frictionless Checkout & Payment Gateway Integration",
      "Centralized Multi-Channel UTM Campaign Generator & Link Builder",
      "Automated On-Site Source Attribution Logging to Supabase Database",
      "Meta CAPI, GA4 & GTM Conversion Pixel Integration",
      "30-Day Post-Launch Conversion Rate Hypercare & Support"
    ],
    addons: [
      { id: "ab-testing", name: "Dynamic A/B Testing & Split Landing Page Routing", price_usd: 120 },
      { id: "retention-flows", name: "Automated Post-Purchase Email/SMS Sequence (Klaviyo/Resend)", price_usd: 90 },
      { id: "influencer-portal", name: "Affiliate & Influencer Referral Source Tracking Portal", price_usd: 150 }
    ],
    is_active: true
  },
  {
    id: "fullstack-web-app",
    name: "Full-Stack Web App / SaaS MVP",
    tagline: "Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.",
    price_usd: 1899,
    price_inr: 79999,
    turnaround_weeks: "4-6 weeks",
    badge: "Full-Stack",
    popular: false,
    description: "Engineered for startups, digital products, and founders who need a production-ready web application with user auth, real-time database, role permissions, payment gateway, and an executive admin dashboard.",
    features: [
      "Next.js App Router full-stack architecture",
      "Supabase PostgreSQL database & Row-Level Security (RLS)",
      "Secure Auth (Email, Google, Magic Link, GitHub)",
      "Stripe / LemonSqueezy / Razorpay payment gateway integration",
      "Comprehensive Admin Dashboard for business metrics & control",
      "Client / User self-serve portal with dashboard views",
      "Real-time updates, file uploads & notification streams",
      "Automated CI/CD pipelines & Vercel deployment"
    ],
    deliverables: [
      "Full-Stack Production Web Application",
      "Complete Database Schema & Supabase migrations",
      "Admin and Client Management Dashboards",
      "Payment Webhook integrations & automated receipts",
      "45-day post-launch hypercare support"
    ],
    addons: [
      { id: "ai-copilot", name: "Gemini / OpenAI AI Assistant Integration", price_usd: 175 },
      { id: "analytics-suite", name: "Advanced Analytics & Event Tracking", price_usd: 95 },
      { id: "sms-email", name: "Transactional Email & SMS (Resend/Twilio)", price_usd: 75 }
    ],
    is_active: true
  },
  {
    id: "luxury-landing-sprint",
    name: "High-Converting Luxury Landing Page",
    tagline: "Precision-crafted marketing landing page engineered to captivate and convert.",
    price_usd: 499,
    price_inr: 14999,
    turnaround_weeks: "1-2 weeks",
    badge: "Fast Sprint",
    popular: false,
    description: "Ideal for boutique agencies, product launches, founders, and creators seeking a razor-sharp, ultra-fast landing page with bespoke animations and high-converting copy lockups.",
    features: [
      "Bespoke layout tailored to your brand identity",
      "Framer Motion smooth scroll and micro-interactions",
      "Interactive pricing calculator / feature matrix",
      "Lead capture & Formspree / CRM webhook integration",
      "Lighthouse 95+ performance & accessibility score",
      "Comprehensive meta tags & Open Graph visuals",
      "Domain setup & CDN deployment on Vercel"
    ],
    deliverables: [
      "Single-Page or Multi-Section Landing Experience",
      "Configured Lead Capture & Notification flows",
      "Complete design assets & typography license links",
      "14-day post-launch support"
    ],
    addons: [
      { id: "copywriting", name: "Conversion Copywriting & Messaging", price_usd: 120 },
      { id: "subpages", name: "2 Additional Content Subpages (Legal / About)", price_usd: 75 },
      { id: "newsletter", name: "Newsletter / Waitlist Automation Sync", price_usd: 75 }
    ],
    is_active: true
  }
];

export const DEMO_CLIENT_PROJECT: ClientProject = {
  id: "demo-project-001",
  client_email: "client@demo.com",
  client_name: "Alex Sterling",
  company_name: "Aetheria Studios",
  title: "Aetheria 3D Interactive Brand Platform",
  description: "Next-generation brand showcase with real-time WebGL interactive particle canvas and full client portal.",
  package_id: "interactive-3d-experience",
  status: "Development",
  progress_percent: 65,
  budget_usd: 3798,
  target_launch_date: "2026-09-30",
  live_preview_url: "https://aetheria.example.com",
  figma_url: "https://figma.com/@aetheria",
  milestones: [
    { id: "m1", title: "Discovery & Art Direction", description: "Design tokens, 3D moodboard, color palette & typography selection.", status: "completed" },
    { id: "m2", title: "Interactive 3D Prototyping", description: "WebGL particle shader simulation, camera choreography & orbit controls.", status: "completed" },
    { id: "m3", title: "Full-Stack Development", description: "Next.js pages, responsive components & audio immersion.", status: "in-progress" },
    { id: "m4", title: "Client Review & QA Sprint", description: "Cross-device testing, accessibility, Lighthouse 95+ audit.", status: "pending" },
    { id: "m5", title: "Production Deployment & Handover", description: "Domain DNS setup, analytics setup & source code delivery.", status: "pending" }
  ],
  deliverables: [
    { id: "d1", title: "Brand Identity & Design Tokens (Figma)", url: "https://figma.com", type: "figma", added_at: "2026-08-20" },
    { id: "d2", title: "Staging Preview Build v0.4", url: "https://tanie.me", type: "preview", added_at: "2026-08-24" }
  ],
  created_at: "2026-08-15T10:00:00Z"
};

export const DEMO_CONTRACT: EContract = {
  id: "demo-contract-001",
  project_id: "demo-project-001",
  client_email: "client@demo.com",
  client_name: "Alex Sterling",
  package_name: "3D Interactive & Brand Experience",
  scope_summary: "Design and engineering of bespoke 3D Interactive brand experience with WebGL canvas, Next.js architecture, CMS integration addon, and deployment.",
  total_amount_usd: 3798,
  payment_terms: "50% upfront deposit upon contract execution, 50% upon final staging approval prior to DNS domain point.",
  legal_terms: `1. ENGAGEMENT & SCOPE: Tanie Lalwani ("Developer") agrees to provide creative design and full-stack software development services as specified in the agreed project scope.
2. INTELLECTUAL PROPERTY: Upon receipt of full payment, all custom source code, design assets, and intellectual property developed exclusively for this project shall be fully transferred to the Client. Developer retains the right to display project media in professional portfolios.
3. TIMELINE & DELIVERABLES: Developer shall work diligently to meet agreed milestones. Client agrees to provide necessary feedback, brand assets, and approvals within 3 business days of submission.
4. WARRANTIES & HYPERCARE: Developer provides a 30-day post-launch warranty covering defect rectification and technical stabilization at no additional charge.
5. GOVERNING LAW: This Agreement shall be governed by and construed in accordance with applicable intellectual property and commercial law.`,
  status: "draft",
  created_at: "2026-08-15T11:00:00Z"
};

export const DEMO_ASSETS: ProjectAsset[] = [
  {
    id: "asset-001",
    project_id: "demo-project-001",
    file_name: "Aetheria_Vector_Logo_Kit.svg",
    file_size_bytes: 245000,
    mime_type: "image/svg+xml",
    storage_path: "client-assets/demo/Aetheria_Vector_Logo_Kit.svg",
    public_url: "/circular_favicon.png",
    category: "logo",
    description: "Primary vector brand marks and light/dark lockups",
    created_at: "2026-08-16T14:30:00Z"
  },
  {
    id: "asset-002",
    project_id: "demo-project-001",
    file_name: "Brand_Copywriting_Guidelines.pdf",
    file_size_bytes: 1280000,
    mime_type: "application/pdf",
    storage_path: "client-assets/demo/Brand_Copywriting_Guidelines.pdf",
    public_url: "/favicon.ico",
    category: "content_copy",
    description: "Website hero messaging, product value props & founder bios",
    created_at: "2026-08-17T09:15:00Z"
  }
];

/**
 * Fetch all active website packages
 */
export async function getWebsitePackages(): Promise<WebsitePackage[]> {
  try {
    if (!isSupabaseConfigured()) {
      return DEFAULT_PACKAGES;
    }
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("price_usd", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PACKAGES;
    }
    return data as WebsitePackage[];
  } catch (err) {
    console.warn("Using fallback packages:", err);
    return DEFAULT_PACKAGES;
  }
}

/**
 * Save / Update a package (Admin)
 */
export async function saveWebsitePackage(pkg: WebsitePackage): Promise<void> {
  if (!isSupabaseConfigured()) {
    const idx = DEFAULT_PACKAGES.findIndex((p) => p.id === pkg.id);
    if (idx >= 0) DEFAULT_PACKAGES[idx] = pkg;
    else DEFAULT_PACKAGES.push(pkg);
    return;
  }
  const { error } = await supabase.from("packages").upsert(pkg);
  if (error) throw error;
}

/**
 * Returns the dedicated table name for a given package
 */
export function getPackageFeatureTableName(packageId: string): string {
  switch (packageId) {
    case "luxury-landing-sprint":
      return "package_landing_sprint_features";
    case "growth-marketing-campaigns":
      return "package_bofu_marketing_features";
    case "interactive-3d-experience":
      return "package_3d_experience_features";
    case "fullstack-web-app":
      return "package_fullstack_backend_features";
    default:
      return "package_landing_sprint_features";
  }
}

export const DEFAULT_GRANULAR_FEATURES: Record<string, PackageGranularFeature[]> = {
  "luxury-landing-sprint": [
    {
      id: "ls-1",
      package_id: "luxury-landing-sprint",
      function_key: "landing_hero_narrative_architecture",
      title: "Above-the-Fold Hero Narrative & Magnetic CTA Lockup",
      category: "UI & Layout",
      description: "Single-focus visual entrance engineered to immediately communicate your primary value proposition with luxury typography, high-contrast CTA, and zero cognitive clutter.",
      technical_deliverables: "Semantic HTML5 header structure, responsive flex/grid CSS layout, fluid clamp() typography scaling, and high-contrast CTA button with subtle shimmer glow animation.",
      business_impact: "Captures visitor attention in the first 3 seconds and slashes bounce rates on paid and organic traffic.",
      complexity: "Standard",
      is_core: true,
      display_order: 1
    },
    {
      id: "ls-2",
      package_id: "luxury-landing-sprint",
      function_key: "landing_responsive_viewport_system",
      title: "Adaptive Multi-Device Breakpoint System (320px to 4K)",
      category: "UI & Layout",
      description: "Flawless layout responsiveness across all screen sizes, including ultra-small mobile displays, tablets, laptops, and ultra-wide desktop monitors with dedicated mobile navigation.",
      technical_deliverables: "Mobile-first CSS media queries, responsive touch gestures, slide-out mobile drawer with backdrop blur, and thumb-friendly sticky navigation bar.",
      business_impact: "Ensures the 70%+ of mobile visitors coming from social media experience native-app visual perfection.",
      complexity: "Standard",
      is_core: true,
      display_order: 2
    },
    {
      id: "ls-3",
      package_id: "luxury-landing-sprint",
      function_key: "landing_framer_motion_microinteractions",
      title: "Framer Motion Micro-Interactions & Scroll Reveals",
      category: "Animation & Motion",
      description: "Buttery-smooth entrance transitions, magnetic cursor pull effects on buttons, interactive card hover states, and staggered content reveals that create an unmistakable feel of craftsmanship.",
      technical_deliverables: "Framer Motion useScroll and useTransform hooks, staggered viewport entrance variants, and hardware-accelerated GPU transforms (will-change: transform).",
      business_impact: "Subconsciously elevates the perceived value of your service or brand, commanding premium client pricing.",
      complexity: "Advanced",
      is_core: true,
      display_order: 3
    },
    {
      id: "ls-4",
      package_id: "luxury-landing-sprint",
      function_key: "landing_intake_form_validation",
      title: "Frictionless Lead Intake Form with Real-Time Validation",
      category: "Lead Capture",
      description: "Streamlined 3-to-4 field lead intake form with immediate inline error feedback, smart international phone formatting, and smooth loading submission states.",
      technical_deliverables: "React Hook Form client validation, masked phone input formatting, asynchronous submission handler, and Formspree/Email notification webhook integration.",
      business_impact: "Eliminates form abandonment caused by confusing errors, maximizing inquiry conversion rates.",
      complexity: "Standard",
      is_core: true,
      display_order: 4
    },
    {
      id: "ls-5",
      package_id: "luxury-landing-sprint",
      function_key: "landing_antispam_honeypot_layer",
      title: "Invisible Bot Shield & Honeypot Spam Prevention",
      category: "Security & Deliverability",
      description: "Client-side invisible honeypot trap and timestamp velocity verification that silently drops automated bot submissions without forcing users to solve ugly CAPTCHA puzzles.",
      technical_deliverables: "CSS-hidden honeypot trap field, client-side timestamp submission verification (<500ms rejected), and payload sanitization pipeline.",
      business_impact: "Guarantees 100% human-verified inquiries in your inbox without annoying genuine clients.",
      complexity: "Standard",
      is_core: true,
      display_order: 5
    },
    {
      id: "ls-6",
      package_id: "luxury-landing-sprint",
      function_key: "landing_social_proof_logo_marquee",
      title: "Brand Partner & Client Social Proof Marquee",
      category: "Social Proof",
      description: "Seamless infinite-scrolling marquee bar showcasing featured client logos, press mentions, or certification badges with interactive pause-on-hover.",
      technical_deliverables: "Pure CSS continuous keyframe translation (translateX -50%), responsive SVG vector logo grid, and subtle monochrome-to-color hover filter transitions.",
      business_impact: "Instantly builds authoritative social proof and trust before the prospect scrolls down to pricing.",
      complexity: "Standard",
      is_core: true,
      display_order: 6
    },
    {
      id: "ls-7",
      package_id: "luxury-landing-sprint",
      function_key: "landing_faq_objection_accordion",
      title: "Interactive Objection-Crushing FAQ Accordion",
      category: "Content & Conversion",
      description: "Animated disclosure accordion resolving top buyer objections regarding timelines, pricing, process, and deliverables with single-click accordion reveals.",
      technical_deliverables: "Accessible WAI-ARIA disclosure pattern, animated height transitions via Framer Motion, and embedded Schema.org FAQPage structured data.",
      business_impact: "Neutralizes pre-booking hesitations and unlocks Google rich FAQ search snippet eligibility.",
      complexity: "Standard",
      is_core: true,
      display_order: 7
    },
    {
      id: "ls-8",
      package_id: "luxury-landing-sprint",
      function_key: "landing_lighthouse_speed_optimization",
      title: "Lighthouse 95+ Core Web Vitals & Asset Compression",
      category: "Performance",
      description: "Sub-second First Contentful Paint (FCP), zero Cumulative Layout Shift (CLS < 0.01), next-gen WebP/AVIF image formats, and minimal blocking JavaScript.",
      technical_deliverables: "Next.js image optimization pipeline, font preloading with font-display: swap, aggressive CSS tree-shaking, and critical path CSS inlining.",
      business_impact: "Maximizes Google Ads Quality Score, lowers paid traffic CPC, and retains mobile visitors on slow networks.",
      complexity: "Advanced",
      is_core: true,
      display_order: 8
    },
    {
      id: "ls-9",
      package_id: "luxury-landing-sprint",
      function_key: "landing_technical_seo_opengraph",
      title: "Semantic Technical SEO & Custom OpenGraph Cards",
      category: "SEO & Social",
      description: "Full semantic HTML5 structure, customized 1200x630 social sharing preview banners for WhatsApp, LinkedIn, iMessage, and X (Twitter), plus automated XML sitemap.",
      technical_deliverables: "Dynamic OpenGraph meta tags, Twitter card specifications, JSON-LD Organization schema markup, and complete favicon suite (Apple Touch, 32x32, 16x16, SVG).",
      business_impact: "Ensures every link shared across messaging apps and social media displays an enticing, branded preview.",
      complexity: "Standard",
      is_core: true,
      display_order: 9
    },
    {
      id: "ls-10",
      package_id: "luxury-landing-sprint",
      function_key: "landing_edge_cdn_domain_setup",
      title: "Custom Domain DNS Pointing & Global Edge CDN Setup",
      category: "Infrastructure",
      description: "Complete domain DNS connection, automated SSL/TLS encryption certificate provisioning, and multi-region edge caching on Vercel or Cloudflare.",
      technical_deliverables: "DNS A/CNAME configuration, automated Let's Encrypt HTTPS certificates, edge cache invalidation rules, and production environment secrets lockdown.",
      business_impact: "Provides 99.99% uptime with sub-50ms response times worldwide with zero server maintenance required.",
      complexity: "Standard",
      is_core: true,
      display_order: 10
    }
  ],
  "growth-marketing-campaigns": [
    {
      id: "gm-1",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_1click_express_checkout",
      title: "1-Click Express Checkout & Dynamic Payment Modal",
      category: "BOFU Conversion Engine",
      description: "Frictionless on-site checkout modal supporting Apple Pay, Google Pay, Razorpay UPI, and direct credit cards without redirecting users through a convoluted multi-page cart maze.",
      technical_deliverables: "Razorpay / Stripe Elements modal integration, automated webhook payment listener, and immediate in-page order receipt and confirmation state.",
      business_impact: "Cuts cart abandonment in half by facilitating impulsive, high-intent purchases directly from ad traffic.",
      complexity: "Advanced",
      is_core: true,
      display_order: 1
    },
    {
      id: "gm-2",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_urgency_countdown_clock",
      title: "Dynamic Urgency Countdown Timers & Drop Deadlines",
      category: "BOFU Conversion Engine",
      description: "Configurable drop timers with persistent client-side cookies or fixed promotional deadlines to trigger genuine urgency and immediate order placement.",
      technical_deliverables: "Synchronized JavaScript countdown component with localStorage session recovery, millisecond precision ticker, and automated expired-state banner changeover.",
      business_impact: "Drives immediate purchase decisions by up to 40% during time-sensitive promotional drops.",
      complexity: "Standard",
      is_core: true,
      display_order: 2
    },
    {
      id: "gm-3",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_offer_announcement_bars",
      title: "Offer-First Sticky Announcement Bar & 1-Tap Coupon Copy",
      category: "BOFU Conversion Engine",
      description: "High-contrast sticky top bar highlighting current discount codes, free shipping thresholds, or limited gift bonuses with 1-tap clipboard copying and toast confirmation.",
      technical_deliverables: "Sticky CSS top bar with automatic page offset calculation, navigator.clipboard API copy action, visual toast feedback, and dismiss cookie logic.",
      business_impact: "Ensures 100% of incoming visitors immediately recognize your core promotional incentive.",
      complexity: "Standard",
      is_core: true,
      display_order: 3
    },
    {
      id: "gm-4",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_4k_product_zoom_loupe",
      title: "Ultra-Crisp 4K Multi-Angle Product Gallery & Zoom Loupe",
      category: "BOFU Visual Showcase",
      description: "Interactive product photo gallery with smooth cursor-following magnifying loupe, fluid thumbnail carousel, and instant color/finish variant preview switchers.",
      technical_deliverables: "Canvas / CSS transform magnifying loupe, responsive thumbnail strip, swipeable mobile touch gallery, and high-density retina image preloading.",
      business_impact: "Overcomes tactile buyer hesitation for luxury goods and physical products by showcasing micro-details.",
      complexity: "Advanced",
      is_core: true,
      display_order: 4
    },
    {
      id: "gm-5",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_studio_photography_staging",
      title: "Editorial Studio Presentation & Technical Breakdown Cards",
      category: "BOFU Visual Showcase",
      description: "Magazine-grade editorial presentation featuring high-resolution studio photography, exploded product views, material callouts, and interactive spec hotspots.",
      technical_deliverables: "Interactive SVG/CSS hotspot annotations with popover tooltips, high-res WebP visual grids, and before-and-after comparison slider.",
      business_impact: "Justifies higher price points by presenting your product with the prestige of a luxury designer label.",
      complexity: "Advanced",
      is_core: true,
      display_order: 5
    },
    {
      id: "gm-6",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_ugc_video_reels_wall",
      title: "Vertical UGC Video Reviews Wall & 9:16 Reels Player",
      category: "BOFU Social Validation",
      description: "Embedded vertical video player showcasing authentic customer unboxings, video testimonials, and creator reviews with star ratings and product tags.",
      technical_deliverables: "Custom lightweight 9:16 HTML5 video player with autoplay-on-view, tap-to-unmute toggle, mobile swipe transition, and customer verification badges.",
      business_impact: "Delivers authentic peer-to-peer social proof that drastically outperforms standard written testimonials.",
      complexity: "Advanced",
      is_core: true,
      display_order: 6
    },
    {
      id: "gm-7",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_sidebyside_comparison_matrix",
      title: "Side-by-Side Value-Anchoring Comparison Matrix",
      category: "BOFU Value Anchoring",
      description: "Interactive comparison table clearly highlighting your product advantages vs. cheaper knock-offs or generic alternatives with checkmarks and feature breakdowns.",
      technical_deliverables: "Sticky header comparison table with checkmark/cross badges, highlighted recommended tier column, and horizontal touch scrolling on mobile devices.",
      business_impact: "Frames your offer as the obvious superior choice, making your price feel like an exceptional bargain.",
      complexity: "Standard",
      is_core: true,
      display_order: 7
    },
    {
      id: "gm-8",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_fomo_scarcity_stock_counters",
      title: "Real-Time FOMO Scarcity Toasts & Dynamic Stock Counters",
      category: "BOFU Urgency",
      description: "Live order notification popups (e.g., 'Sarah from London just purchased...') paired with low-stock inventory warning meters (e.g., 'Only 3 items remaining').",
      technical_deliverables: "Staggered notification queue with animated exit transitions, realistic randomized order pool or live DB order feed, and animated SVG stock meter.",
      business_impact: "Leverages social validation and scarcity psychology to convert indecisive visitors into active buyers.",
      complexity: "Standard",
      is_core: true,
      display_order: 8
    },
    {
      id: "gm-9",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_freebie_lead_magnet_gate",
      title: "High-Value Freebie Lead Magnet & Instant Asset Gate",
      category: "BOFU Lead Capture",
      description: "Premium digital asset giveaway (PDF buyer guide, discount voucher, lookbook) gated behind a 1-tap email or WhatsApp opt-in with immediate automated download.",
      technical_deliverables: "Modal opt-in with instant client validation, direct signed download link generation, and automated lead sync to Supabase database.",
      business_impact: "Recovers 15% to 25% of visitors who are not ready to purchase immediately, building an owned email/SMS list.",
      complexity: "Standard",
      is_core: true,
      display_order: 9
    },
    {
      id: "gm-10",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_utm_multisource_attribution_engine",
      title: "Multi-Source UTM Tracking & Channel Attribution Engine",
      category: "Attribution & Analytics",
      description: "Automatic capture and storage of URL campaign parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid) with every order and lead.",
      technical_deliverables: "URL query parser, browser sessionStorage/localStorage session persistence, and automatic payload enrichment sent to Supabase bookings and orders.",
      business_impact: "Reveals your exact Customer Acquisition Cost (CAC) and ROAS across Instagram, TikTok, Google Ads, and influencers.",
      complexity: "Advanced",
      is_core: true,
      display_order: 10
    },
    {
      id: "gm-11",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_pixel_telemetry_capi_suite",
      title: "Full-Spectrum Conversion Pixels & Server-Side CAPI Telemetry",
      category: "Attribution & Analytics",
      description: "Pre-wired conversion tracking: Meta Pixel + Server-Side Conversions API (CAPI), Google Tag Manager, GA4 e-commerce events, and TikTok Pixel.",
      technical_deliverables: "Standardized e-commerce events (ViewContent, InitiateCheckout, Purchase), client-to-server event deduplication with event_id, and data layer push triggers.",
      business_impact: "Bypasses iOS 14+ ad-blockers and privacy filters, delivering 100% signal accuracy to Meta/Google ad algorithms for cheaper conversions.",
      complexity: "Advanced",
      is_core: true,
      display_order: 11
    },
    {
      id: "gm-12",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_campaign_link_generator_tool",
      title: "In-Portal Campaign UTM Link Generator & Source Manager",
      category: "Campaign Management",
      description: "Self-serve tool inside your client admin portal to generate tracked campaign URLs for ad sets, influencers, and newsletters in under 5 seconds.",
      technical_deliverables: "Interactive URL builder UI with preset channels (Instagram Bio, Meta Ad 1, TikTok Creator A, Email Blast), 1-click clipboard copy, and historical link registry.",
      business_impact: "Allows you or your team to launch targeted marketing campaigns without tracking mistakes or broken attribution.",
      complexity: "Standard",
      is_core: true,
      display_order: 12
    }
  ],
  "interactive-3d-experience": [
    {
      id: "td-1",
      package_id: "interactive-3d-experience",
      function_key: "threed_webgl_canvas_render_loop",
      title: "Custom Three.js / WebGL Scene Canvas & Render Lifecycle",
      category: "3D Core Architecture",
      description: "Dedicated high-performance WebGL 3D scene embedded smoothly within modern HTML DOM, supporting retina displays, auto-resizing, and dynamic aspect ratios.",
      technical_deliverables: "Three.js Scene, PerspectiveCamera, WebGLRenderer with tone mapping and anti-aliasing, and requestAnimationFrame render loop with delta timing.",
      business_impact: "Instantly places your brand in the tier of Awwwards Site of the Year nominees and global tech pioneers like Apple.",
      complexity: "Specialized",
      is_core: true,
      display_order: 1
    },
    {
      id: "td-2",
      package_id: "interactive-3d-experience",
      function_key: "threed_glsl_particle_fluid_shaders",
      title: "Custom GLSL Particle System & Fluid Physics Shaders",
      category: "3D Shaders & Physics",
      description: "Interactive GPU-accelerated particle field reacting dynamically to mouse movement, velocity, and touch gestures using custom GLSL vertex and fragment shaders.",
      technical_deliverables: "BufferGeometry with custom Float32Array attributes, custom ShaderMaterial, curl noise algorithms, and GPU instanced rendering.",
      business_impact: "Creates an irresistible tactile browsing experience that boosts visitor dwell time by up to 300%.",
      complexity: "Specialized",
      is_core: true,
      display_order: 2
    },
    {
      id: "td-3",
      package_id: "interactive-3d-experience",
      function_key: "threed_draco_gltf_compression_pipeline",
      title: "3D Model Optimization & Draco/KTX2 Mesh Compression",
      category: "3D Asset Optimization",
      description: "Ultra-compact 3D model loading pipeline converting high-poly models into lightweight Draco-compressed GLB assets with KTX2 GPU textures for instant loading.",
      technical_deliverables: "Three.js GLTFLoader, DRACOLoader multi-worker thread decoder, and progressive asset loading state with luxury percentage indicator.",
      business_impact: "Delivers rich 3D visuals without sluggish download times or mobile bandwidth consumption.",
      complexity: "Advanced",
      is_core: true,
      display_order: 3
    },
    {
      id: "td-4",
      package_id: "interactive-3d-experience",
      function_key: "threed_camera_scrollytelling_choreography",
      title: "Cinematic Camera Choreography & Scroll-Synced Orbit",
      category: "3D Camera & Motion",
      description: "Cinematic camera paths and focal-point rotations mathematically synchronized to page scroll position (scrollytelling) and subtle mouse parallax.",
      technical_deliverables: "Lenis smooth scroll integration, Three.js CatmullRomCurve3 spline interpolation, damping orbit controls, and smooth lerp calculations.",
      business_impact: "Turns passive browsing into an active, cinematic journey that guides the user through your product narrative.",
      complexity: "Specialized",
      is_core: true,
      display_order: 4
    },
    {
      id: "td-5",
      package_id: "interactive-3d-experience",
      function_key: "threed_pbr_hdri_lighting_shadows",
      title: "Photorealistic PBR Materials, HDRI Lighting & Soft Shadows",
      category: "3D Visual Fidelity",
      description: "Physically Based Rendering (PBR) materials with realistic metallic, glass transmission, roughness reflections, and HDR environment map radiance.",
      technical_deliverables: "MeshPhysicalMaterial with transmission and roughness maps, RGBELoader environment radiance maps, and PCFSoftShadowMap calculations.",
      business_impact: "Produces hyper-realistic material textures (brushed aluminum, gold, glass) that reflect elite product craftsmanship.",
      complexity: "Advanced",
      is_core: true,
      display_order: 5
    },
    {
      id: "td-6",
      package_id: "interactive-3d-experience",
      function_key: "threed_postprocessing_bloom_dof",
      title: "Cinematic Post-Processing Pipeline (Bloom & Depth of Field)",
      category: "3D Post-Processing",
      description: "Bespoke post-processing pass including selective bloom glow for emissive elements, chromatic aberration, subtle vignette, and realistic depth of field (DoF).",
      technical_deliverables: "Three.js EffectComposer, RenderPass, UnrealBloomPass, and custom ShaderPass color grading curves.",
      business_impact: "Gives your web application the visual aesthetic of high-budget AAA video game engines and luxury automotive configurators.",
      complexity: "Specialized",
      is_core: true,
      display_order: 6
    },
    {
      id: "td-7",
      package_id: "interactive-3d-experience",
      function_key: "threed_spatial_audio_haptic_sound",
      title: "Ambient Spatial Audio & Interactive Haptic Sound Design",
      category: "Audio Immersion",
      description: "Subtle interactive sound design: low-frequency ambient drone, tactile clicking frequencies on button interactions, and 3D sound positioning.",
      technical_deliverables: "Web Audio API sound synthesis / Howler.js integration, user interaction audio unlock handler, sound toggle UI control with sound waves.",
      business_impact: "Engages the visitor auditory senses, creating an unforgettable emotional bond with the experience.",
      complexity: "Advanced",
      is_core: true,
      display_order: 7
    },
    {
      id: "td-8",
      package_id: "interactive-3d-experience",
      function_key: "threed_mobile_gyroscope_thermal_guard",
      title: "Mobile Gyroscope Controls & Adaptive 60fps Thermal Guard",
      category: "Mobile Performance",
      description: "Device orientation sensor integration on smartphones for physical tilt navigation, paired with automatic quality scaling to maintain solid 60fps on mobile.",
      technical_deliverables: "DeviceOrientationEvent API with iOS permission trigger, dynamic pixelRatio downscaling on frame drops, and WebGL context loss recovery.",
      business_impact: "Ensures flawless execution across high-end desktops and everyday mobile smartphones without battery drain or lag.",
      complexity: "Advanced",
      is_core: true,
      display_order: 8
    }
  ],
  "fullstack-web-app": [
    {
      id: "fs-1",
      package_id: "fullstack-web-app",
      function_key: "backend_supabase_postgres_relational_schema",
      title: "Supabase PostgreSQL Production Database Architecture",
      category: "Database & Architecture",
      description: "Normalized relational database schema with foreign key constraints, UUID primary keys, automated timestamp triggers, and optimized indexes.",
      technical_deliverables: "PostgreSQL DDL schema scripts, migration management, custom PL/pgSQL database functions, and automated backups.",
      business_impact: "Provides an enterprise-grade relational data foundation that scales effortlessly to hundreds of thousands of users without data corruption.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 1
    },
    {
      id: "fs-2",
      package_id: "fullstack-web-app",
      function_key: "backend_row_level_security_rls",
      title: "Zero-Trust Row-Level Security (RLS) Policy Architecture",
      category: "Security & Compliance",
      description: "Granular database-level access policies guaranteeing that clients can only read/write their own records, while administrative roles have global access.",
      technical_deliverables: "Postgres RLS policies on all tables (FOR SELECT, INSERT, UPDATE, DELETE), auth.uid() validation, and SQL injection immune queries.",
      business_impact: "Eliminates catastrophic data leaks at the database level, ensuring full compliance with GDPR and industry security standards.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 2
    },
    {
      id: "fs-3",
      package_id: "fullstack-web-app",
      function_key: "backend_omnichannel_auth_suite",
      title: "Multi-Provider Auth & Session Management",
      category: "Authentication & Identity",
      description: "Enterprise authentication supporting Google OAuth 2.0, GitHub, Magic Link passwordless login, and traditional email/password with secure password resets.",
      technical_deliverables: "Supabase Auth SSR client, PKCE auth flow, secure HTTP-only session cookies, and automated email verification triggers.",
      business_impact: "Zero-friction onboarding for new users while keeping accounts protected against brute-force and credential stuffing.",
      complexity: "Advanced",
      is_core: true,
      display_order: 3
    },
    {
      id: "fs-4",
      package_id: "fullstack-web-app",
      function_key: "backend_stripe_razorpay_webhook_pipeline",
      title: "Stripe & Razorpay Payment Webhooks Engine",
      category: "Payments & Billing",
      description: "Automated payment processing handling one-time purchases, subscriptions, recurring billing cycles, invoice generation, and refund webhooks.",
      technical_deliverables: "Idempotent Next.js API webhook endpoints, cryptographic signature verification, and database transaction updates on payment confirmation.",
      business_impact: "Instant monetization with automated digital fulfillment and zero manual payment verification required.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 4
    },
    {
      id: "fs-5",
      package_id: "fullstack-web-app",
      function_key: "backend_customer_selfserve_portal",
      title: "Customer Self-Serve Portal & Order Center",
      category: "Client Portal",
      description: "Authenticated client dashboard where customers view active orders, download invoices, access purchased assets, update profiles, and manage subscriptions.",
      technical_deliverables: "Protected route middleware, responsive client dashboard UI, real-time status tracker, and digital asset secure download generator.",
      business_impact: "Drastically cuts customer support tickets by 80% through self-serve management.",
      complexity: "Advanced",
      is_core: true,
      display_order: 5
    },
    {
      id: "fs-6",
      package_id: "fullstack-web-app",
      function_key: "backend_executive_admin_cockpit",
      title: "Executive Admin Cockpit & Business Intelligence",
      category: "Admin Management",
      description: "Private master control dashboard for founders: real-time revenue stats, active user count, order management, status transitions, and user bans.",
      technical_deliverables: "Role-guarded admin layout (is_admin() check), data tables with multi-filter sorting, pagination, and CSV data export.",
      business_impact: "Provides founders total clarity and control over their business operations from a single clean screen.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 6
    },
    {
      id: "fs-7",
      package_id: "fullstack-web-app",
      function_key: "backend_transactional_email_sms_pipeline",
      title: "Automated Transactional Emails & SMS Notifications",
      category: "Communications",
      description: "Beautiful React Email templates dispatched automatically on order completion, password resets, welcome sequences, and project milestone updates.",
      technical_deliverables: "Resend / Twilio API integration, React Email component templates, and DKIM / SPF email authentication setup for 99%+ deliverability.",
      business_impact: "Maintains high customer engagement and establishes a professional post-purchase experience.",
      complexity: "Standard",
      is_core: true,
      display_order: 7
    },
    {
      id: "fs-8",
      package_id: "fullstack-web-app",
      function_key: "backend_s3_storage_signed_uploads",
      title: "Encrypted Cloud Storage & Secure File Uploads",
      category: "Storage & Media",
      description: "Direct-to-storage file upload pipeline for user avatars, project documents, high-res assets, and signed legal contracts with signed URL downloads.",
      technical_deliverables: "Supabase Storage buckets (client-assets, contracts), fine-grained storage RLS policies, and client-side image compression before upload.",
      business_impact: "Prevents public leakage of sensitive business documents and contracts while handling large files effortlessly.",
      complexity: "Advanced",
      is_core: true,
      display_order: 8
    },
    {
      id: "fs-9",
      package_id: "fullstack-web-app",
      function_key: "backend_rbac_audit_logging",
      title: "Role-Based Access Control (RBAC) & Audit Logging",
      category: "Governance & Audit",
      description: "Granular permission tiers (Super Admin, Manager, Client, Member) with an immutable audit log tracking critical account modifications and payments.",
      technical_deliverables: "Role column with PostgreSQL CHECK constraints, audit log triggers capturing user IP, timestamp, action type, and old/new state.",
      business_impact: "Essential for team delegation, preventing unauthorized modifications and providing a verifiable record of all platform activities.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 9
    },
    {
      id: "fs-10",
      package_id: "fullstack-web-app",
      function_key: "backend_outbound_webhook_bridge",
      title: "Secure External API & Outbound Webhook Dispatcher",
      category: "Integrations & Automation",
      description: "Expose secure REST endpoints with API key authorization or trigger outbound webhooks to Zapier, Make.com, or Slack whenever key events occur.",
      technical_deliverables: "API route handlers with rate limiting, SHA-256 HMAC payload signing, and outbound HTTP fetch retry queue.",
      business_impact: "Allows seamless integration with your existing CRM, accounting software, and Slack alert channels.",
      complexity: "Advanced",
      is_core: true,
      display_order: 10
    }
  ]
};

/**
 * Fetch granular features from the dedicated table for a given package
 */
export async function getGranularPackageFeatures(packageId: string): Promise<PackageGranularFeature[]> {
  const fallback = DEFAULT_GRANULAR_FEATURES[packageId] || [];
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  const tableName = getPackageFeatureTableName(packageId);
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("package_id", packageId)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallback;
    }
    return data as PackageGranularFeature[];
  } catch (err) {
    console.warn(`Falling back to static features for ${tableName}:`, err);
    return fallback;
  }
}

/**
 * Fetch all package features across all 4 dedicated tables (or unified view)
 */
export async function getAllGranularPackageFeatures(): Promise<PackageGranularFeature[]> {
  const allFallback = Object.values(DEFAULT_GRANULAR_FEATURES).flat();
  if (!isSupabaseConfigured()) {
    return allFallback;
  }

  try {
    const { data, error } = await supabase
      .from("package_all_features_view")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as PackageGranularFeature[];
    }
  } catch {
    // view might not be compiled yet, fallback to fetching tables
  }

  // Fallback to querying each of the 4 dedicated tables
  try {
    const [p1, p2, p3, p4] = await Promise.all([
      getGranularPackageFeatures("luxury-landing-sprint"),
      getGranularPackageFeatures("growth-marketing-campaigns"),
      getGranularPackageFeatures("interactive-3d-experience"),
      getGranularPackageFeatures("fullstack-web-app"),
    ]);
    const merged = [...p1, ...p2, ...p3, ...p4];
    return merged.length > 0 ? merged : allFallback;
  } catch {
    return allFallback;
  }
}

/**
 * Fetch projects for a specific client email
 */
export async function getClientProjects(email: string): Promise<ClientProject[]> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return [];
  }

  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_email", cleanEmail)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as ClientProject[];
  } catch (err) {
    console.warn("Error fetching client projects:", err);
    return [];
  }
}

/**
 * Fetch all projects (Admin)
 */
export async function getAllProjects(): Promise<ClientProject[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as ClientProject[];
  } catch (err) {
    console.warn("Using fallback all projects:", err);
    return [];
  }
}

/**
 * Create a new client project
 */
export async function createClientProject(project: Partial<ClientProject>): Promise<ClientProject> {
  const newProject: ClientProject = {
    id: project.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`),
    client_email: project.client_email?.toLowerCase() || "client@example.com",
    client_name: project.client_name || "New Client",
    company_name: project.company_name || "",
    title: project.title || "Custom Web Development",
    description: project.description || "",
    package_id: project.package_id || "interactive-3d-experience",
    status: project.status || "Discovery",
    progress_percent: project.progress_percent ?? 10,
    budget_usd: project.budget_usd || 3499,
    target_launch_date: project.target_launch_date || "",
    live_preview_url: project.live_preview_url || "",
    figma_url: project.figma_url || "",
    github_repo: project.github_repo || "",
    milestones: project.milestones || [
      { id: "m1", title: "Discovery & Requirements", description: "Define goals, visual tokens, and technical architecture.", status: "completed" },
      { id: "m2", title: "Creative Design & Wireframes", description: "Figma design system, high-fidelity mockups & interactive prototype.", status: "in-progress" },
      { id: "m3", title: "Full-Stack Development", description: "Frontend code, database integration & animations.", status: "pending" },
      { id: "m4", title: "Review & Quality Assurance", description: "Lighthouse optimization, multi-browser tests & client feedback.", status: "pending" },
      { id: "m5", title: "Launch & Delivery", description: "Production release, custom domain connection & warranty handover.", status: "pending" }
    ],
    deliverables: project.deliverables || [],
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from("projects").insert([newProject]).select().single();
    if (!error && data) return data as ClientProject;
  }
  return newProject;
}

/**
 * Update project progress / status / milestones
 */
export async function updateProject(projectId: string, updates: Partial<ClientProject>): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from("projects")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    if (error) console.error("Error updating project in Supabase:", error);
  }
}

/**
 * Fetch contract for a project
 */
export async function getContractForProject(projectId: string): Promise<EContract | null> {
  if (!projectId) return null;

  try {
    if (!isSupabaseConfigured()) {
      return null;
    }
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as EContract;
  } catch (err) {
    console.warn("Using fallback contract:", err);
    return null;
  }
}

/**
 * Fetch all contracts (Admin)
 */
export async function getAllContracts(): Promise<EContract[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as EContract[];
  } catch (err) {
    return [];
  }
}

/**
 * Sign an e-contract with signature image and metadata
 */
export async function signContract(
  contractId: string,
  signatureDataUrl: string,
  signatureName: string,
  clientIp?: string
): Promise<EContract> {
  const signedPayload = {
    status: "signed" as const,
    signature_url: signatureDataUrl,
    signature_name: signatureName,
    signed_at: new Date().toISOString(),
    signed_ip: clientIp || "127.0.0.1 (Client Portal Verified)",
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("contracts")
      .update(signedPayload)
      .eq("id", contractId)
      .select()
      .single();

    if (!error && data) {
      return data as EContract;
    }
  }

  // Fallback state
  DEMO_CONTRACT.status = "signed";
  DEMO_CONTRACT.signature_url = signatureDataUrl;
  DEMO_CONTRACT.signature_name = signatureName;
  DEMO_CONTRACT.signed_at = signedPayload.signed_at;
  DEMO_CONTRACT.signed_ip = signedPayload.signed_ip;
  return { ...DEMO_CONTRACT };
}

/**
 * Fetch uploaded assets for a project
 */
export async function getProjectAssets(projectId: string): Promise<ProjectAsset[]> {
  if (!projectId) return [];
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await supabase
      .from("project_assets")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as ProjectAsset[];
  } catch (err) {
    console.warn("Using fallback assets:", err);
    return [];
  }
}

/**
 * Fetch all uploaded assets (Admin)
 */
export async function getAllAssets(): Promise<ProjectAsset[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [];
    }
    const { data, error } = await supabase
      .from("project_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data as ProjectAsset[];
  } catch (err) {
    return [];
  }
}

/**
 * Upload an asset file to Supabase Storage and register in database
 */
export async function uploadProjectAsset(
  file: File,
  projectId: string,
  category: ProjectAsset["category"] = "general",
  description: string = ""
): Promise<ProjectAsset> {
  const fileExt = file.name.split(".").pop() || "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueKey = `${projectId}/${Date.now()}_${safeName}`;
  let publicUrl = "";

  if (isSupabaseConfigured()) {
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("client-assets")
        .upload(uniqueKey, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("client-assets").getPublicUrl(uniqueKey);
        publicUrl = urlData.publicUrl;
      }
    } catch (e) {
      console.warn("Storage upload fallback:", e);
    }
  }

  // If local or public url not generated, create temporary blob preview
  if (!publicUrl && typeof URL !== "undefined") {
    try {
      publicUrl = URL.createObjectURL(file);
    } catch {
      publicUrl = "/circular_favicon.png";
    }
  }

  const newAsset: ProjectAsset = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `asset-${Date.now()}`,
    project_id: projectId,
    file_name: file.name,
    file_size_bytes: file.size,
    mime_type: file.type || "application/octet-stream",
    storage_path: uniqueKey,
    public_url: publicUrl,
    category: category,
    description: description,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("project_assets").insert([newAsset]).select().single();
      if (!error && data) return data as ProjectAsset;
    } catch (err) {
      console.warn("DB insert asset error, returning local representation:", err);
    }
  }

  DEMO_ASSETS.unshift(newAsset);
  return newAsset;
}

/**
 * Delete a project asset
 */
export async function deleteProjectAsset(assetId: string, storagePath: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.storage.from("client-assets").remove([storagePath]);
      await supabase.from("project_assets").delete().eq("id", assetId);
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  }
  const idx = DEMO_ASSETS.findIndex((a) => a.id === assetId);
  if (idx >= 0) DEMO_ASSETS.splice(idx, 1);
}

export const DEMO_LEADS: LeadItem[] = [
  {
    id: "lead-001",
    client_name: "Elena Rostova",
    client_email: "elena@lumina.design",
    company_name: "Lumina Design Group",
    phone: "+1 (555) 234-5678",
    package_interest: "3D Interactive & Brand Experience",
    source: "Pricing Unlock Gate",
    status: "pending",
    created_at: "2026-08-26T14:10:00Z"
  },
  {
    id: "lead-002",
    client_name: "Marcus Vance",
    client_email: "marcus@hypergrowth.vc",
    company_name: "Hypergrowth Capital",
    phone: "+1 (555) 987-6543",
    package_interest: "Full-Stack Web App / SaaS MVP",
    source: "Intake Booking Modal",
    status: "contacted",
    created_at: "2026-08-25T18:30:00Z"
  }
];

/**
 * Submit a lead from the Pricing Unlock Gate or Website Inquiry
 */
export async function submitLead(lead: {
  client_name: string;
  client_email: string;
  company_name?: string;
  phone?: string;
  package_interest?: string;
  timeline?: string;
  source?: string;
  project_description?: string;
}): Promise<{ success: boolean; id?: string }> {
  const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  // 1. Dispatch to Formspree if endpoint configured for instant email notification
  if (formspreeEndpoint) {
    try {
      await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "Lead Collection & Rate Card Unlock",
          name: lead.client_name,
          email: lead.client_email,
          company: lead.company_name || "N/A",
          phone: lead.phone || "N/A",
          package: lead.package_interest || "All Packages",
          timeline: lead.timeline || "N/A",
          source: lead.source || "Pricing Unlock Gate",
          description: lead.project_description || "N/A",
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn("Formspree lead notification error:", e);
    }
  }

  const newLead: LeadItem = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`,
    client_name: lead.client_name,
    client_email: lead.client_email.toLowerCase(),
    company_name: lead.company_name || "",
    phone: lead.phone || "",
    package_interest: lead.package_interest || "General Inquiry",
    source: lead.source || "Pricing Unlock Gate",
    status: "pending",
    created_at: new Date().toISOString()
  };

  // 2. Save into Supabase bookings table
  if (isSupabaseConfigured()) {
    try {
      const description = lead.project_description || `[Lead Collected via ${newLead.source}] Package of Interest: ${newLead.package_interest}${lead.phone ? ` | Phone: ${lead.phone}` : ""}`;
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            client_name: newLead.client_name,
            client_email: newLead.client_email,
            company_name: newLead.company_name,
            project_description: description,
            status: "pending"
          }
        ])
        .select()
        .single();

      if (!error && data) {
        DEMO_LEADS.unshift(newLead);
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.warn("Supabase lead insert fallback:", err);
    }
  }

  DEMO_LEADS.unshift(newLead);
  return { success: true, id: newLead.id };
}

/**
 * Fetch all collected leads (Admin)
 */
export async function getAllLeads(): Promise<LeadItem[]> {
  try {
    if (!isSupabaseConfigured()) {
      return DEMO_LEADS;
    }
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_LEADS;
    }

    return data.map((b: any) => {
      let extractedPhone = b.phone || "";
      let extractedMessage = "";
      let extractedAesthetic = "";
      let extractedScope = "";

      if (b.project_description) {
        if (!extractedPhone) {
          const phoneMatch = b.project_description.match(/Phone(?:\s*\/\s*WhatsApp)?:\s*([^\n\r|]+)/i);
          if (phoneMatch) extractedPhone = phoneMatch[1].trim();
        }
        const noteMatch = b.project_description.match(/(?:Client Note|Client Message|Project Message|Message):\s*([\s\S]+?)(?=\n\[|\n⚡|\n💰|\nSelected|$)/i);
        if (noteMatch) extractedMessage = noteMatch[1].trim();

        const aesMatch = b.project_description.match(/Selected Aesthetic:\s*([^\n\r(]+)/i);
        if (aesMatch) extractedAesthetic = aesMatch[1].trim();

        const scopeMatch = b.project_description.match(/Scope Foundation:\s*([^\n\r]+)/i);
        if (scopeMatch) extractedScope = scopeMatch[1].trim();
      }

      return {
        id: b.id,
        client_name: b.client_name || "Prospective Client",
        client_email: b.client_email || "",
        company_name: b.company_name || "",
        phone: extractedPhone,
        package_interest: b.package_id || "Website Package",
        source: b.project_description?.includes("[Lead Collected")
          ? "Pricing Unlock Gate"
          : b.project_description?.includes("[Website Booking Intake]") || b.project_description?.includes("[Website Design Marketplace Intake]")
          ? "Website Booking Intake"
          : "Direct Booking",
        status: b.status || "pending",
        created_at: b.created_at || new Date().toISOString(),
        selected_addons: b.selected_addons || [],
        estimated_budget_usd: b.estimated_budget_usd,
        estimated_budget_inr: b.estimated_budget_inr,
        project_description: b.project_description || "",
        timeline_requirement: b.timeline_requirement || "",
        client_message: extractedMessage,
        selected_aesthetic: extractedAesthetic,
        scope_tier: extractedScope
      };
    });
  } catch (err) {
    return DEMO_LEADS;
  }
}

/**
 * Update lead status (Admin)
 */
export async function updateLeadStatus(leadId: string, status: LeadItem["status"]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("bookings").update({ status }).eq("id", leadId);
    } catch (err) {
      console.error("Update lead status err:", err);
    }
  }
  const item = DEMO_LEADS.find((l) => l.id === leadId);
  if (item) item.status = status;
}

/**
 * Submit a package booking or project intake inquiry
 */
export async function submitBooking(booking: BookingSubmission): Promise<{ success: boolean; id?: string }> {
  const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  if (formspreeEndpoint) {
    try {
      await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "Website Package Booking Kickoff",
          name: booking.client_name,
          email: booking.client_email,
          phone: booking.phone || "N/A",
          company: booking.company_name || "N/A",
          package: booking.package_id,
          aesthetic: booking.selected_aesthetic,
          scope: booking.scope_tier,
          budget_usd: booking.estimated_budget_usd,
          budget_inr: booking.estimated_budget_inr,
          timeline: booking.timeline_requirement,
          message: booking.client_message,
          description: booking.project_description,
          addons: booking.selected_addons?.join(", ") || "None",
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn("Formspree booking notification error:", e);
    }
  }

  try {
    if (isSupabaseConfigured()) {
      const payload: Record<string, any> = {
        client_name: booking.client_name,
        client_email: booking.client_email.toLowerCase(),
        company_name: booking.company_name || "",
        package_id: booking.package_id || booking.selected_aesthetic || "Custom Build",
        selected_addons: booking.selected_addons || [],
        estimated_budget_usd: booking.estimated_budget_usd,
        timeline_requirement: booking.timeline_requirement,
        project_description: booking.project_description,
        status: "pending"
      };

      // Try inserting with phone and inr budget
      try {
        const { data, error } = await supabase
          .from("bookings")
          .insert([{ ...payload, phone: booking.phone, estimated_budget_inr: booking.estimated_budget_inr }])
          .select()
          .single();

        if (!error && data) {
          return { success: true, id: data.id };
        }
      } catch {
        // Fall back to base schema if custom columns not added yet
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
    }
    return { success: true, id: `booking-${Date.now()}` };
  } catch (err) {
    console.error("Booking error:", err);
    return { success: true };
  }
}

// --------------------------------------------------------------------------------
// CHANGE REQUESTS & PROJECT REVISION LOG
// --------------------------------------------------------------------------------

export const DEMO_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: "cr-001",
    project_id: "demo-project-001",
    client_email: "client@demo.com",
    title: "Can we make the hero 3D particle speed slightly more reactive?",
    description: "The current drift is great, but we'd love the interactive mouse repelling effect to be slightly more responsive on desktop screens.",
    category: "Design",
    status: "in-review",
    created_at: "2026-08-25T11:20:00Z",
    admin_reply: "Looking into the particle damping coefficient now. Will deploy an updated staging preview shortly!"
  },
  {
    id: "cr-002",
    project_id: "demo-project-001",
    client_email: "client@demo.com",
    title: "Update founder bio copy in about section",
    description: "Please replace the second paragraph with the updated copy doc uploaded to the asset dropzone.",
    category: "Content",
    status: "implemented",
    created_at: "2026-08-22T09:15:00Z",
    resolved_at: "2026-08-23T14:00:00Z",
    admin_reply: "Updated with the new copy from Aetheria_Brand_Copy_v2.docx."
  }
];

export async function getProjectChangeRequests(projectId?: string): Promise<ChangeRequest[]> {
  if (isSupabaseConfigured() && projectId) {
    try {
      const { data, error } = await supabase
        .from("change_requests")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ChangeRequest[];
      }
    } catch (e) {
      console.warn("Using fallback change requests:", e);
    }
  }
  return DEMO_CHANGE_REQUESTS;
}

export async function submitChangeRequest(
  req: Omit<ChangeRequest, "id" | "created_at" | "status">
): Promise<ChangeRequest> {
  const newReq: ChangeRequest = {
    ...req,
    id: `cr-${Date.now()}`,
    status: "pending",
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("change_requests")
        .insert([newReq])
        .select()
        .single();

      if (!error && data) {
        return data as ChangeRequest;
      }
    } catch (err) {
      console.error("Supabase change request error:", err);
    }
  }

  DEMO_CHANGE_REQUESTS.unshift(newReq);
  return newReq;
}

export async function updateChangeRequestStatus(
  id: string,
  status: ChangeRequest["status"],
  admin_reply?: string
): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("change_requests")
        .update({
          status,
          admin_reply,
          resolved_at: status === "implemented" ? new Date().toISOString() : undefined
        })
        .eq("id", id);
    } catch (err) {
      console.error("Update change request error:", err);
    }
  }

  const item = DEMO_CHANGE_REQUESTS.find((r) => r.id === id);
  if (item) {
    item.status = status;
    if (admin_reply) item.admin_reply = admin_reply;
    if (status === "implemented") item.resolved_at = new Date().toISOString();
  }
}

// =============================================================================
// CLIENT CUSTOM QUOTES & SCOPE ESTIMATOR SERVICES
// =============================================================================

export interface ClientCustomQuote {
  id: string;
  client_id?: string;
  client_email: string;
  client_name?: string;
  company_name?: string;
  project_name: string;
  industry_template: string;
  selected_features: Record<string, number>;
  base_price_inr: number;
  base_price_usd: number;
  itemized_total_inr: number;
  itemized_total_usd: number;
  discount_percent: number;
  discount_amount_inr: number;
  discount_amount_usd: number;
  final_total_inr: number;
  final_total_usd: number;
  currency: "INR" | "USD";
  notes?: string;
  status: "draft" | "submitted" | "in_review" | "approved" | "converted_to_project" | "archived";
  created_at: string;
  updated_at?: string;
}

const LOCAL_QUOTES_KEY = "tanie_custom_quotes_drafts";

function getLocalStoredQuotes(): ClientCustomQuote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_QUOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalStoredQuotes(quotes: ClientCustomQuote[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to persist local quotes:", e);
  }
}

export async function saveClientCustomQuote(
  quote: Partial<ClientCustomQuote> & {
    client_email: string;
    project_name: string;
    selected_features: Record<string, number>;
    final_total_inr: number;
  }
): Promise<ClientCustomQuote> {
  const quoteId = quote.id || `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const completeQuote: ClientCustomQuote = {
    id: quoteId,
    client_id: quote.client_id,
    client_email: quote.client_email,
    client_name: quote.client_name || "Client",
    company_name: quote.company_name,
    project_name: quote.project_name || "Custom Web Project",
    industry_template: quote.industry_template || "custom",
    selected_features: quote.selected_features || {},
    base_price_inr: quote.base_price_inr ?? 5000,
    base_price_usd: quote.base_price_usd ?? 75,
    itemized_total_inr: quote.itemized_total_inr ?? 0,
    itemized_total_usd: quote.itemized_total_usd ?? 0,
    discount_percent: quote.discount_percent ?? 0,
    discount_amount_inr: quote.discount_amount_inr ?? 0,
    discount_amount_usd: quote.discount_amount_usd ?? 0,
    final_total_inr: quote.final_total_inr ?? 0,
    final_total_usd: quote.final_total_usd ?? 0,
    currency: quote.currency || "INR",
    notes: quote.notes,
    status: quote.status || "draft",
    created_at: quote.created_at || now,
    updated_at: now
  };

  // 1. Try Supabase
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("client_custom_quotes")
        .upsert([completeQuote])
        .select()
        .single();

      if (!error && data) {
        // Also sync local cache
        const local = getLocalStoredQuotes().filter((q) => q.id !== completeQuote.id);
        saveLocalStoredQuotes([data as ClientCustomQuote, ...local]);
        return data as ClientCustomQuote;
      }
    } catch (err) {
      console.warn("Supabase custom quote save warning:", err);
    }
  }

  // 2. Fallback to LocalStorage
  const local = getLocalStoredQuotes().filter((q) => q.id !== completeQuote.id);
  saveLocalStoredQuotes([completeQuote, ...local]);
  return completeQuote;
}

export async function getClientCustomQuotes(clientEmail: string): Promise<ClientCustomQuote[]> {
  if (isSupabaseConfigured() && clientEmail) {
    try {
      const { data, error } = await supabase
        .from("client_custom_quotes")
        .select("*")
        .eq("client_email", clientEmail)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as ClientCustomQuote[];
      }
    } catch (err) {
      console.warn("Supabase load client custom quotes error:", err);
    }
  }

  // Fallback to local storage
  const local = getLocalStoredQuotes();
  if (clientEmail) {
    return local.filter((q) => q.client_email.toLowerCase() === clientEmail.toLowerCase());
  }
  return local;
}

export async function getClientCustomQuoteById(quoteId: string): Promise<ClientCustomQuote | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("client_custom_quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (!error && data) {
        return data as ClientCustomQuote;
      }
    } catch (err) {
      console.warn("Supabase load quote by ID error:", err);
    }
  }

  const local = getLocalStoredQuotes();
  return local.find((q) => q.id === quoteId) || null;
}

export async function deleteClientCustomQuote(quoteId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from("client_custom_quotes")
        .delete()
        .eq("id", quoteId);

      if (!error) {
        const local = getLocalStoredQuotes().filter((q) => q.id !== quoteId);
        saveLocalStoredQuotes(local);
        return true;
      }
    } catch (err) {
      console.warn("Supabase delete custom quote error:", err);
    }
  }

  const local = getLocalStoredQuotes().filter((q) => q.id !== quoteId);
  saveLocalStoredQuotes(local);
  return true;
}



