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
  included_limit?: string;
  feature_price_inr?: number;
  feature_price_usd?: number;
  overage_unit_label?: string | null;
  overage_price_inr?: number | null;
  overage_price_usd?: number | null;
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
    price_usd: 899,
    price_inr: 39999,
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
    price_usd: 499,
    price_inr: 19999,
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
      "AI Sales Concierge Bot: 24/7 automated objection handling, FAQ answers & direct checkout guidance",
      "Multi-Lingual Localization (i18n): Language switcher supporting up to 3 languages for international buyers",
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
    id: "booking-appointments-engine",
    name: "Smart Appointment & Booking Engine",
    tagline: "Live slot picker, calendar sync, staff assignment, automated WhatsApp reminders, multi-branch routing & pre-payments.",
    price_usd: 499,
    price_inr: 19999,
    turnaround_weeks: "2-3 weeks",
    badge: "High Conversion",
    popular: false,
    description: "Turnkey appointment and consultation booking infrastructure. Includes the complete Luxury Landing Foundation (₹4,999 value) plus real-time calendar slot engine, 2-way Google/Outlook sync, automated WhatsApp/email reminders, multi-branch location routing, and Stripe/Razorpay session pre-payments.",
    features: [
      "Real-time interactive calendar slot picker with instant booking",
      "Bidirectional Google Calendar & Outlook 2-way sync",
      "Automated WhatsApp & Email confirmation and reminder sequences",
      "Timezone auto-detection, custom meeting buffers & operational hours",
      "Pre-appointment qualification questionnaire with file uploads",
      "Stripe & Razorpay session deposit & pre-payment checkout",
      "Multi-Branch & Location Routing (up to 3 physical or virtual clinics/branches)",
      "Automated cancellation & 1-click client reschedule links"
    ],
    deliverables: [
      "Turnkey Booking & Appointment Web Application",
      "Google & Outlook Calendar API Sync Setup",
      "Twilio / WhatsApp Business Cloud API Integration",
      "Payment Gateway Integration for Booking Deposits",
      "Multi-Branch Location Routing & Staff Mapping",
      "30-Day Post-Launch Hypercare & Operational Support"
    ],
    addons: [
      { id: "sms-credits", name: "High-Volume SMS/WhatsApp Notification Bundle", price_usd: 75 },
      { id: "multi-location-ext", name: "Additional 5 Branch Locations & Calendars", price_usd: 120 },
      { id: "priority", name: "Priority Express Delivery (10 Days)", price_usd: 200 }
    ],
    is_active: true
  },
  {
    id: "staff-team-management-portal",
    name: "Staff & Team Management Portal",
    tagline: "Digital staff directory, weekly shift scheduling, leave approvals, RBAC & payroll summaries.",
    price_usd: 599,
    price_inr: 24999,
    turnaround_weeks: "3-4 weeks",
    badge: "Operations",
    popular: false,
    description: "Complete internal team management and operational portal. Includes the complete Luxury Landing Foundation (₹4,999 value) plus secure employee logins, shift rostering, time-off approval workflows, geolocation clock-in timesheets, role-based access, and 1-click payroll CSV export.",
    features: [
      "Searchable digital staff directory with department grouping",
      "Interactive weekly shift roster with shift publishing & conflict detection",
      "Self-serve time-off portal with automated manager approval workflow",
      "Granular RBAC role security across Admin, Manager, Staff and Contractor",
      "Company notice board with read-receipt tracking & priority broadcasts",
      "Digital mobile clock-in punch clock with GPS geolocation verification",
      "Automated employee work-hour summaries & 1-click payroll CSV export",
      "Encrypted staff profile documents & emergency contact registry"
    ],
    deliverables: [
      "Staff & Team Operations Portal Application",
      "Complete PostgreSQL Staff & Shift Database Schema",
      "Role-Guarded Manager & Employee Dashboards",
      "Geolocation Punch Clock Timesheet System",
      "Automated Payroll CSV Export Module",
      "30-Day Post-Launch Support & Staff Training"
    ],
    addons: [
      { id: "extra-seats", name: "Additional 50 Employee Account Licenses", price_usd: 90 },
      { id: "payroll-api", name: "Direct QuickBooks / Gusto / Tally API Sync", price_usd: 150 },
      { id: "priority", name: "Priority Express Delivery (2 Weeks)", price_usd: 250 }
    ],
    is_active: true
  },
  {
    id: "fullstack-web-app",
    name: "Full-Stack Web App / SaaS MVP",
    tagline: "Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.",
    price_usd: 1499,
    price_inr: 69999,
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
    price_usd: 99,
    price_inr: 4999,
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
    case "booking-appointments-engine":
      return "package_booking_engine_features";
    case "staff-team-management-portal":
      return "package_staff_portal_features";
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
      display_order: 1,
      included_limit: "Hero narrative lockup & magnetic CTA system",
      feature_price_inr: 800,
      feature_price_usd: 16,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-2",
      package_id: "luxury-landing-sprint",
      function_key: "landing_responsive_viewport_system",
      title: "Adaptive Multi-Device Breakpoint System (320px to 4K)",
      category: "UI & Layout",
      description: "Flawless layout responsiveness across all screen sizes, including mobile phones, tablets, laptops, and ultra-wide desktop monitors with dedicated mobile navigation.",
      technical_deliverables: "Mobile-first CSS media queries, responsive touch gestures, slide-out mobile drawer with backdrop blur, and thumb-friendly sticky navigation bar.",
      business_impact: "Ensures the 70%+ of mobile visitors coming from social media experience native-app visual perfection.",
      complexity: "Standard",
      is_core: true,
      display_order: 2,
      included_limit: "Full responsive website structure (up to 7 standard pages)",
      feature_price_inr: 1000,
      feature_price_usd: 20,
      overage_unit_label: "Per additional custom page",
      overage_price_inr: 1000,
      overage_price_usd: 35
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
      display_order: 3,
      included_limit: "Complete site-wide micro-interactions & scroll animation suite",
      feature_price_inr: 500,
      feature_price_usd: 10,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-4",
      package_id: "luxury-landing-sprint",
      function_key: "landing_intake_form_validation",
      title: "Frictionless Lead Intake Form with Real-Time Validation",
      category: "Lead Capture",
      description: "Streamlined lead intake form with immediate inline error feedback, international phone formatting, and smooth submission states.",
      technical_deliverables: "React Hook Form client validation, masked phone input formatting, asynchronous submission handler, and email notification webhook integration.",
      business_impact: "Eliminates form abandonment caused by confusing errors, maximizing inquiry conversion rates.",
      complexity: "Standard",
      is_core: true,
      display_order: 4,
      included_limit: "Lead intake and contact forms with automated email notifications",
      feature_price_inr: 500,
      feature_price_usd: 10,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 5,
      included_limit: "Full invisible spam & bot shield across all forms",
      feature_price_inr: 300,
      feature_price_usd: 6,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 6,
      included_limit: "Infinite logo proof marquee for brand partners and press",
      feature_price_inr: 300,
      feature_price_usd: 6,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 7,
      included_limit: "Objection FAQ accordion with embedded Google Schema markup",
      feature_price_inr: 300,
      feature_price_usd: 6,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 8,
      included_limit: "Comprehensive 95+ Lighthouse speed tuning across desktop & mobile",
      feature_price_inr: 500,
      feature_price_usd: 10,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 9,
      included_limit: "Complete OpenGraph social cards, XML sitemaps & SEO meta tags",
      feature_price_inr: 400,
      feature_price_usd: 8,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 10,
      included_limit: "Production custom domain connection + SSL + Global Edge CDN",
      feature_price_inr: 399,
      feature_price_usd: 7,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-11",
      package_id: "luxury-landing-sprint",
      function_key: "landing_dark_light_theme_mode",
      title: "Zero-Flash Dark / Light Theme Mode Switcher",
      category: "UI & Customization",
      description: "Smooth dark and light mode toggle with zero layout-shift or white flash on page load, synced with system preferences and persisted in localStorage.",
      technical_deliverables: "CSS custom property design tokens, inline theme initialization script preventing FOUC, and animated sun/moon icon switcher.",
      business_impact: "Offers an ultra-modern aesthetic that matches visitor ambient lighting and personal device preference.",
      complexity: "Standard",
      is_core: true,
      display_order: 11,
      included_limit: "Zero-flash Dark / Light theme toggle with local persistence",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-12",
      package_id: "luxury-landing-sprint",
      function_key: "landing_cookie_gdpr_consent_modal",
      title: "Privacy Policy & Cookie Consent Compliance Banner",
      category: "Compliance & Legal",
      description: "Minimalist, non-intrusive cookie consent drawer with accept/customize toggles adhering to international GDPR and CCPA web guidelines.",
      technical_deliverables: "Consent state persistence in client cookies, conditional script blocking for analytics until accepted, and branded backdrop styling.",
      business_impact: "Protects your business from international privacy penalties while maintaining client trust.",
      complexity: "Standard",
      is_core: true,
      display_order: 12,
      included_limit: "Branded GDPR & Cookie consent compliance modal",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-13",
      package_id: "luxury-landing-sprint",
      function_key: "landing_social_share_drawer",
      title: "Native Web Share API Drawer & 1-Click Link Copy",
      category: "Social & Viral",
      description: "Modern floating share button that launches native mobile share sheets (iOS/Android) or copies direct referral links with toast confirmation on desktop.",
      technical_deliverables: "navigator.share() API with automatic fallback to clipboard copy and animated feedback toast.",
      business_impact: "Encourages immediate word-of-mouth referral sharing without leaving the page.",
      complexity: "Standard",
      is_core: true,
      display_order: 13,
      included_limit: "Native mobile share sheet & 1-click clipboard link drawer",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "ls-14",
      package_id: "luxury-landing-sprint",
      function_key: "landing_custom_404_recovery_hub",
      title: "Custom 404 Luxury Error Page with Recovery Navigation",
      category: "UX & Retention",
      description: "Bespoke, brand-aligned 404 error page with helpful quick-links back to popular sections and interactive search instead of an ugly default browser dead end.",
      technical_deliverables: "Next.js not-found template, dynamic route suggestion algorithms, and search bar recovery.",
      business_impact: "Prevents lost traffic from broken links or typos by guiding visitors back into your conversion funnel.",
      complexity: "Standard",
      is_core: true,
      display_order: 14,
      included_limit: "Custom luxury 404 error recovery hub",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    }
  ],
  "growth-marketing-campaigns": [
    {
      id: "gm-1",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_conversion_landing_strip",
      title: "High-Converting BOFU Landing Strip & Value Stacks",
      category: "Conversion Architecture",
      description: "Bottom-of-Funnel (BOFU) focused page layout with irresistible benefit anchors, value stack breakdowns, guaranteed risk-reversal badges, and frictionless lead CTAs.",
      technical_deliverables: "Next.js dynamic section render, high-contrast gradient conversion badges, and mobile-optimized viewports.",
      business_impact: "Converts warm, ad-driven prospects who are actively comparing alternatives into committed paying customers.",
      complexity: "Advanced",
      is_core: true,
      display_order: 1,
      included_limit: "Full BOFU high-converting landing structure and value stack modules",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-2",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_frictionless_instant_checkout",
      title: "1-Click Express Checkout & Digital Payment Gateway",
      category: "Checkout & Revenue",
      description: "Streamlined checkout flow supporting Apple Pay, Google Pay, Razorpay, UPI, and Credit Cards with zero account creation hurdles.",
      technical_deliverables: "Stripe Elements & Razorpay Webhook integration, automated payment verification, and instant confirmation screens.",
      business_impact: "Eliminates multi-step checkout fatigue and captures impulse buyers on both mobile and desktop.",
      complexity: "Specialized",
      is_core: true,
      display_order: 2,
      included_limit: "Complete 1-click express checkout gateway with instant payment verification",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-3",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_ai_sales_concierge_bot",
      title: "AI Sales Concierge Bot & Automated Objection Closer",
      category: "AI & Automated Sales",
      description: "Intelligent 24/7 on-site conversational AI trained on your offerings, pricing, FAQs, and policies that answers prospect objections and routes hot buyers directly into checkout.",
      technical_deliverables: "Streaming LLM integration (OpenAI/Gemini), business context retrieval knowledge-base, automated lead qualification, and 1-click checkout launch from chat.",
      business_impact: "Recovers 20-30% of abandoning shoppers by answering doubts in real time and qualifies buyers around the clock.",
      complexity: "Specialized",
      is_core: true,
      display_order: 3,
      included_limit: "Native conversational AI sales bot with objection resolution & checkout trigger",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-4",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_multilingual_localization_i18n",
      title: "Multi-Lingual Support & International Currency Localization (i18n)",
      category: "Global Localization",
      description: "Seamless multi-language translation architecture and dynamic multi-currency display (USD, EUR, GBP, INR, AED) with automatic geo-detection.",
      technical_deliverables: "Next-intl / i18next internationalization setup, dynamic locale routing (/es, /fr, /de, /hi), geo-IP currency detection, and localized currency formatting.",
      business_impact: "Expands your addressable market internationally and boosts global cross-border conversion by up to 70%.",
      complexity: "Advanced",
      is_core: true,
      display_order: 4,
      included_limit: "Multi-language switcher (up to 3 languages) & multi-currency price localization",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: "Per additional language translation package",
      overage_price_inr: 750,
      overage_price_usd: 25
    },
    {
      id: "gm-5",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_multi_channel_utm_attribution",
      title: "Multi-Channel UTM Attribution & Campaign Source Hub",
      category: "Attribution & Analytics",
      description: "Automated ingestion of UTM source, medium, campaign, term, and referrer headers saved with every purchase and lead submission.",
      technical_deliverables: "Custom UTM tracking middleware, cookie persistence across subdomains, and Supabase marketing_sources sync.",
      business_impact: "Reveals exactly which ad campaigns, TikTok creators, and referral links generate real revenue.",
      complexity: "Advanced",
      is_core: true,
      display_order: 5,
      included_limit: "Full multi-touch UTM attribution engine & marketing sources hub",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-6",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_sticky_floating_cart_drawer",
      title: "Sticky Quick-View Cart Drawer & Live Product Showcase",
      category: "UX & E-Commerce",
      description: "Slide-over cart drawer showing selected items, tier discounts, free-shipping progress bars, and instant upsell cross-sells.",
      technical_deliverables: "Zustand cart state store, local storage hydration, animated drawer slide-out with Framer Motion, and real-time total recalculation.",
      business_impact: "Increases Average Order Value (AOV) by up to 22% through dynamic order bumps and threshold bars.",
      complexity: "Standard",
      is_core: true,
      display_order: 6,
      included_limit: "Slide-over quick cart drawer with dynamic upsells and free-shipping meter",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-7",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_urgency_scarcity_conversion_triggers",
      title: "Real-Time Urgency Triggers & Inventory Scarcity Meters",
      category: "Conversion Psychology",
      description: "Dynamic countdown timers for flash sales, live recent purchase toasts, and low-inventory stock badges that trigger ethical FOMO.",
      technical_deliverables: "Real-time WebSocket / polling order toasts, dynamic SVG inventory meters, and configurable flash-deal countdown hooks.",
      business_impact: "Encourages immediate purchase decisions and prevents prospects from postponing until tomorrow.",
      complexity: "Standard",
      is_core: true,
      display_order: 7,
      included_limit: "Full urgency suite (live countdown clocks, scarcity meters & purchase popups)",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-8",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_social_proof_ticker_reviews",
      title: "Verified Buyer UGC Reviews Wall & Video Testimonials",
      category: "Social Proof",
      description: "Filterable review feed with 5-star ratings, photo attachments, verified buyer badges, and embedded TikTok/Reel video player.",
      technical_deliverables: "Interactive review modal, video player with custom controls, star-rating breakdown histogram, and Schema.org Review structured data.",
      business_impact: "Builds ironclad credibility by demonstrating real customer success and organic video validation.",
      complexity: "Standard",
      is_core: true,
      display_order: 8,
      included_limit: "Filterable verified customer review wall with video testimonial player",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "gm-9",
      package_id: "growth-marketing-campaigns",
      function_key: "bofu_direct_lead_routing_notifications",
      title: "Direct Instant WhatsApp & Email Lead Alerts with Conversion Telemetry",
      category: "Lead Routing & Telemetry",
      description: "Instant notification pipeline that pings the business owner on WhatsApp and email the exact second a high-intent lead or checkout is submitted, backed by Meta CAPI & GA4 e-commerce events.",
      technical_deliverables: "WhatsApp Business Cloud API / Twilio webhook, transactional Resend email dispatcher, Meta Conversions API (CAPI), and GA4 purchase events.",
      business_impact: "Enables sub-5-minute lead response times, which boosts appointment and deal close rates by 391%.",
      complexity: "Advanced",
      is_core: true,
      display_order: 9,
      included_limit: "Instant WhatsApp + Email lead alerts & Meta CAPI / GA4 conversion telemetry",
      feature_price_inr: 1500,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    }
  ],
  "booking-appointments-engine": [
    {
      id: "bk-1",
      package_id: "booking-appointments-engine",
      function_key: "booking_interactive_calendar_slots",
      title: "Real-Time Interactive Calendar & Time Slot Picker",
      category: "Booking UI",
      description: "Modern, responsive booking calendar interface displaying available days, real-time open time slots, duration options, and instant date selection.",
      technical_deliverables: "React date/time calendar picker, real-time availability slot calculation engine, and smooth selection animations.",
      business_impact: "Eliminates the endless back-and-forth email scheduling and lets qualified prospects book immediately.",
      complexity: "Standard",
      is_core: true,
      display_order: 1,
      included_limit: "Complete responsive calendar slot picker with real-time availability display",
      feature_price_inr: 3000,
      feature_price_usd: 80,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-2",
      package_id: "booking-appointments-engine",
      function_key: "booking_google_outlook_cal_sync",
      title: "2-Way Google Calendar & Outlook Real-Time Sync",
      category: "Calendar Sync",
      description: "Bidirectional calendar integration preventing double-bookings by automatically reading busy events from your calendar and writing new bookings instantly.",
      technical_deliverables: "Google Calendar API OAuth2 integration, Microsoft Graph Outlook API, webhook change listeners, and automated event creation with meeting links.",
      business_impact: "Guarantees you will never get double-booked and saves hours of manual schedule management every week.",
      complexity: "Advanced",
      is_core: true,
      display_order: 2,
      included_limit: "Bidirectional Google & Outlook calendar synchronization",
      feature_price_inr: 2500,
      feature_price_usd: 70,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-3",
      package_id: "booking-appointments-engine",
      function_key: "booking_automated_reminders_whatsapp_email",
      title: "Automated WhatsApp & Email Confirmation & Reminder Sequences",
      category: "Automations & Retention",
      description: "Automated reminder workflows dispatched immediately upon booking, 24 hours prior, and 1 hour before the session with calendar invite (.ics) attachments.",
      technical_deliverables: "Twilio / WhatsApp Business Cloud API webhook, Resend transactional email pipeline, dynamic ICS calendar invite generation, and 1-click reschedule links.",
      business_impact: "Slashes appointment no-show rates from 30% down to under 4%, protecting your billable hours.",
      complexity: "Advanced",
      is_core: true,
      display_order: 3,
      included_limit: "Automated multi-channel WhatsApp + Email confirmation & reminder workflow",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-4",
      package_id: "booking-appointments-engine",
      function_key: "booking_flexible_buffer_timezone_engine",
      title: "Timezone Auto-Detection, Buffer Gaps & Working Hours Engine",
      category: "Scheduling Logic",
      description: "Intelligent scheduling logic that automatically detects the visitor local timezone, enforces custom daily working hours, and adds custom buffer buffers between meetings.",
      technical_deliverables: "Intl.DateTimeFormat browser timezone converter, customizable break buffer rules (e.g. 15-min gap), maximum bookings per day caps, and holiday blackout dates.",
      business_impact: "Ensures international clients book at comfortable hours while keeping your calendar humane and fatigue-free.",
      complexity: "Standard",
      is_core: true,
      display_order: 4,
      included_limit: "Timezone auto-converter, meeting buffer gaps & custom operational hours",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-5",
      package_id: "booking-appointments-engine",
      function_key: "booking_custom_intake_questionnaire",
      title: "Pre-Meeting Intake Questionnaire & Document Attachment",
      category: "Client Intake",
      description: "Custom pre-appointment questionnaire allowing prospects to provide background context, select project budget ranges, and upload reference files before the call.",
      technical_deliverables: "Dynamic multi-step form schema, file upload to Supabase storage, and automated appending of client responses to calendar invite notes.",
      business_impact: "Ensures every meeting starts fully prepared and qualified, eliminating unproductive discovery calls.",
      complexity: "Standard",
      is_core: true,
      display_order: 5,
      included_limit: "Custom pre-call qualification questionnaire with secure file uploads",
      feature_price_inr: 1500,
      feature_price_usd: 40,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-6",
      package_id: "booking-appointments-engine",
      function_key: "booking_deposit_prepayment_flow",
      title: "Stripe & Razorpay Consultation Pre-Payment & Deposit Gateway",
      category: "Payments & Billing",
      description: "Seamless payment collection requiring clients to pay full session fees or deposit retainers prior to booking confirmation.",
      technical_deliverables: "Stripe Checkout & Razorpay payment intent integration, automated refund handling on cancellation, and branded tax invoice receipts.",
      business_impact: "Guarantees upfront commitment and eliminates tire-kickers who waste your consultation time.",
      complexity: "Specialized",
      is_core: true,
      display_order: 6,
      included_limit: "Integrated deposit & consultation fee payment gateway",
      feature_price_inr: 2500,
      feature_price_usd: 70,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "bk-7",
      package_id: "booking-appointments-engine",
      function_key: "booking_multibranch_location_routing",
      title: "Multi-Branch & Location Routing (Micro-Feature)",
      category: "Multi-Location",
      description: "Smart routing that lets visitors select physical branches or virtual meeting rooms with independent practitioner calendars and location-specific directions.",
      technical_deliverables: "Location selection switcher, branch-specific staff assignment, Google Maps embeds, and independent calendar routing for up to 3 physical or virtual clinics/branches.",
      business_impact: "Enables multi-location businesses, clinics, and studios to manage independent branch bookings under a single unified website.",
      complexity: "Advanced",
      is_core: true,
      display_order: 7,
      included_limit: "Multi-branch selection with independent practitioner calendars (up to 3 branches)",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: "Per additional branch or studio location",
      overage_price_inr: 1000,
      overage_price_usd: 35
    }
  ],
  "staff-team-management-portal": [
    {
      id: "st-1",
      package_id: "staff-team-management-portal",
      function_key: "staff_directory_profiles_roster",
      title: "Digital Staff Directory, Member Profiles & Department Rostering",
      category: "Directory & Roster",
      description: "Searchable digital directory of all team members with contact details, department tags, assigned roles, bio cards, and emergency contacts.",
      technical_deliverables: "Supabase staff profiles table, search & filter by department, profile editing UI, and avatar upload pipeline.",
      business_impact: "Centralizes employee information and makes internal communication effortless as the team expands.",
      complexity: "Standard",
      is_core: true,
      display_order: 1,
      included_limit: "Searchable digital staff directory with department grouping & member profiles",
      feature_price_inr: 3500,
      feature_price_usd: 90,
      overage_unit_label: "Per additional 25 employee accounts",
      overage_price_inr: 1500,
      overage_price_usd: 45
    },
    {
      id: "st-2",
      package_id: "staff-team-management-portal",
      function_key: "staff_shift_scheduling_availability",
      title: "Weekly Shift Scheduling, Overtime Tracker & Availability Board",
      category: "Shift Scheduling",
      description: "Interactive weekly shift scheduler allowing managers to publish employee shifts, track open slots, view employee availability, and prevent scheduling conflicts.",
      technical_deliverables: "Interactive weekly timetable grid, shift assignment state, conflict detection algorithm, and push notification on shift publish.",
      business_impact: "Saves 10+ hours per week of manual shift coordination and eliminates no-shows and miscommunicated hours.",
      complexity: "Advanced",
      is_core: true,
      display_order: 2,
      included_limit: "Interactive weekly shift roster with shift publishing & conflict detection",
      feature_price_inr: 3500,
      feature_price_usd: 90,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "st-3",
      package_id: "staff-team-management-portal",
      function_key: "staff_timeoff_leave_approval_workflow",
      title: "Time-Off & Leave Request Portal with 1-Click Manager Approvals",
      category: "Leave Management",
      description: "Self-serve portal where staff can submit paid leave, sick days, or vacation requests with manager email notifications and 1-click approvals.",
      technical_deliverables: "Leave balance tracking table, manager approval/rejection modal, automated status notification, and calendar sync of approved leaves.",
      business_impact: "Automates time-off tracking with clear audit trails, replacing messy WhatsApp messages and spreadsheets.",
      complexity: "Standard",
      is_core: true,
      display_order: 3,
      included_limit: "Self-serve time-off portal with automated manager approval workflow",
      feature_price_inr: 2500,
      feature_price_usd: 60,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "st-4",
      package_id: "staff-team-management-portal",
      function_key: "staff_granular_rbac_roles",
      title: "Multi-Tier Role-Based Permissions (Admin, Manager, Staff, Contractor)",
      category: "Access Control & Security",
      description: "Strict security boundaries ensuring staff members only view their personal shifts and profile, managers see their department, and owners see full financial/operational data.",
      technical_deliverables: "PostgreSQL Row-Level Security (RLS) policies based on user auth role, private route guards, and admin privilege escalation protection.",
      business_impact: "Protects sensitive company finances, salary info, and client records from unauthorized internal eyes.",
      complexity: "Enterprise",
      is_core: true,
      display_order: 4,
      included_limit: "Granular RBAC role security across Admin, Manager, Staff and Contractor",
      feature_price_inr: 3000,
      feature_price_usd: 70,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "st-5",
      package_id: "staff-team-management-portal",
      function_key: "staff_internal_announcements_broadcast",
      title: "Internal Team Notice Board, Company Broadcasts & Push Alerts",
      category: "Internal Comms",
      description: "Company-wide digital bulletin board for broadcasting policy updates, shift change alerts, holiday schedules, and team recognition.",
      technical_deliverables: "Announcement feeds with read-receipt confirmations, priority pinning, and email/SMS broadcast triggers.",
      business_impact: "Ensures 100% of staff members receive and acknowledge critical operational announcements.",
      complexity: "Standard",
      is_core: true,
      display_order: 5,
      included_limit: "Company notice board with read-receipt tracking & priority announcements",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "st-6",
      package_id: "staff-team-management-portal",
      function_key: "staff_timesheets_clockin_geolocation",
      title: "Digital Clock-In / Clock-Out Timesheets with Geolocation Verification",
      category: "Timesheets & Attendance",
      description: "Mobile-friendly digital punch clock where staff can log shift starts, breaks, and shift ends, with optional GPS geolocation verification.",
      technical_deliverables: "Browser Geolocation API coordinate capture against workplace geofence radius, timesheet database records, and duration calculations.",
      business_impact: "Eliminates time theft and buddy punching with verified real-time digital attendance records.",
      complexity: "Advanced",
      is_core: true,
      display_order: 6,
      included_limit: "Digital mobile clock-in punch clock with GPS geolocation verification",
      feature_price_inr: 3000,
      feature_price_usd: 80,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "st-7",
      package_id: "staff-team-management-portal",
      function_key: "staff_payroll_summary_csv_export",
      title: "Automated Work-Hour Summary & 1-Click Payroll CSV Export",
      category: "Payroll & Operations",
      description: "Automated aggregation of regular hours, overtime, and approved leaves formatted for 1-click export into Excel or accounting software (Tally, QuickBooks, Gusto).",
      technical_deliverables: "SQL aggregation queries calculating total shift hours, hourly rate multiplication, and formatted CSV report generator.",
      business_impact: "Reduces month-end payroll preparation time from hours down to a single click with zero math errors.",
      complexity: "Standard",
      is_core: true,
      display_order: 7,
      included_limit: "Automated employee work-hour summaries & 1-click payroll CSV export",
      feature_price_inr: 2500,
      feature_price_usd: 60,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 1,
      included_limit: "High-performance Three.js / WebGL responsive scene canvas",
      feature_price_inr: 8000,
      feature_price_usd: 180,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 2,
      included_limit: "Interactive GPU particle systems & dynamic fluid shader physics",
      feature_price_inr: 6000,
      feature_price_usd: 140,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "td-3",
      package_id: "interactive-3d-experience",
      function_key: "threed_draco_gltf_compression_pipeline",
      title: "3D Model Optimization & Draco/KTX2 Mesh Compression",
      category: "3D Asset Optimization",
      description: "Ultra-compact 3D model loading pipeline converting high-poly models into lightweight Draco-compressed GLB assets with KTX2 GPU textures for instant loading.",
      technical_deliverables: "Three.js GLTFLoader, DRACOLoader multi-worker thread decoder, and progressive asset loading state with luxury percentage indicator.",
      business_impact: "Eliminates heavy 3D loading times, achieving instantaneous initial scene renders on mobile networks.",
      complexity: "Advanced",
      is_core: true,
      display_order: 3,
      included_limit: "Full 3D model optimization & Draco/KTX2 asset compression pipeline",
      feature_price_inr: 5000,
      feature_price_usd: 110,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 4,
      included_limit: "Scroll-driven 3D camera paths & chapter-pinned story transitions",
      feature_price_inr: 5500,
      feature_price_usd: 130,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 5,
      included_limit: "Photorealistic PBR materials, HDRI environment lighting & soft shadows",
      feature_price_inr: 4000,
      feature_price_usd: 90,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 6,
      included_limit: "Cinematic post-processing pass (selective bloom, vignette & depth of field)",
      feature_price_inr: 3000,
      feature_price_usd: 70,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 7,
      included_limit: "Ambient spatial audio & tactile interactive sound design",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 8,
      included_limit: "Mobile gyroscope tilt controls & adaptive 60fps thermal guard",
      feature_price_inr: 1500,
      feature_price_usd: 30,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "td-9",
      package_id: "interactive-3d-experience",
      function_key: "threed_material_color_customizer",
      title: "Interactive Real-Time Material & Color Switcher",
      category: "3D Micro-Feature",
      description: "Interactive visual UI controls allowing clients to swap color finishes, metallic sheens, or textures on the 3D model in real-time.",
      technical_deliverables: "Three.js mesh material uniform dispatcher, color picker UI controls, and reactive state binding for instant visual updates.",
      business_impact: "Boosts prospect engagement and interactive exploration time by up to 300%.",
      complexity: "Advanced",
      is_core: false,
      display_order: 9,
      included_limit: "Real-time material & color customizer switcher controls",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "td-10",
      package_id: "interactive-3d-experience",
      function_key: "threed_loading_progress_experience",
      title: "Branded Canvas Preloader & Dynamic Progress Bar",
      category: "3D Micro-Feature",
      description: "Sleek glowing progress bar with percentage counter and asset decompression indicator so visitors never stare at a blank screen while 3D assets download.",
      technical_deliverables: "THREE.LoadingManager item progress callback integration with smooth animated CSS progress meter.",
      business_impact: "Drastically prevents bounce rates during asset downloads on slower mobile connections.",
      complexity: "Advanced",
      is_core: false,
      display_order: 10,
      included_limit: "Branded canvas loading progress bar & asset decompressor UI",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 1,
      included_limit: "Production PostgreSQL relational database schema with custom triggers",
      feature_price_inr: 12000,
      feature_price_usd: 260,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 2,
      included_limit: "Zero-Trust Row-Level Security policies across all database models",
      feature_price_inr: 8000,
      feature_price_usd: 170,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 3,
      included_limit: "Multi-provider auth suite (Email, Google OAuth, Magic Link & sessions)",
      feature_price_inr: 7500,
      feature_price_usd: 160,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 4,
      included_limit: "Full payment webhooks engine for purchases and subscriptions",
      feature_price_inr: 8500,
      feature_price_usd: 180,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 5,
      included_limit: "Authenticated client self-service portal & order management center",
      feature_price_inr: 9000,
      feature_price_usd: 200,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 6,
      included_limit: "Executive founder admin cockpit with live analytics & management",
      feature_price_inr: 10000,
      feature_price_usd: 220,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 7,
      included_limit: "Automated transactional email notifications & lifecycle alerts",
      feature_price_inr: 3500,
      feature_price_usd: 70,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 8,
      included_limit: "Encrypted cloud storage buckets with signed URL access",
      feature_price_inr: 3000,
      feature_price_usd: 60,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 9,
      included_limit: "Role-based access control with immutable security audit logging",
      feature_price_inr: 2000,
      feature_price_usd: 50,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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
      display_order: 10,
      included_limit: "Outbound webhook dispatcher & external API connectivity",
      feature_price_inr: 1500,
      feature_price_usd: 30,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "fs-11",
      package_id: "fullstack-web-app",
      function_key: "backend_automated_daily_backup_snapshots",
      title: "Automated Daily Database Snapshots & Point-in-Time Recovery",
      category: "Backend Micro-Feature",
      description: "Automated daily pg_dump snapshot cron with 7-day retention and one-click database rollback capabilities.",
      technical_deliverables: "Supabase automated daily WAL backup archiving, pg_dump snapshot cron script, and recovery documentation.",
      business_impact: "Guarantees zero catastrophe or data loss in the event of human error or hardware disruption.",
      complexity: "Advanced",
      is_core: false,
      display_order: 11,
      included_limit: "Automated daily database snapshot backups & PITR recovery",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
    },
    {
      id: "fs-12",
      package_id: "fullstack-web-app",
      function_key: "backend_activity_log_export_csv",
      title: "One-Click Data Export to CSV & Excel Formats",
      category: "Backend Micro-Feature",
      description: "Instant data table export button allowing admins to download customer records, transaction histories, and analytics as CSV or Excel sheets.",
      technical_deliverables: "Client-side / server-side CSV streaming generator with automated column sanitization against CSV injection.",
      business_impact: "Empowers non-technical founders to extract operational data into spreadsheet software in one second.",
      complexity: "Advanced",
      is_core: false,
      display_order: 12,
      included_limit: "One-click data export to CSV & Excel spreadsheet format",
      feature_price_inr: 0,
      feature_price_usd: 0,
      overage_unit_label: null,
      overage_price_inr: null,
      overage_price_usd: null
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

  // Fallback to querying each of the 6 dedicated tables
  try {
    const [p1, p2, p3, p4, p5, p6] = await Promise.all([
      getGranularPackageFeatures("luxury-landing-sprint"),
      getGranularPackageFeatures("growth-marketing-campaigns"),
      getGranularPackageFeatures("booking-appointments-engine"),
      getGranularPackageFeatures("staff-team-management-portal"),
      getGranularPackageFeatures("interactive-3d-experience"),
      getGranularPackageFeatures("fullstack-web-app"),
    ]);
    const merged = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6];
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



