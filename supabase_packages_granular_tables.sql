-- ==============================================================================
-- SUPABASE MIGRATION: SEPARATE GRANULAR FEATURE TABLES FOR PACKAGES
-- Architecture: Package 1 (Luxury Landing) is the Non-Negotiable Foundational Base (₹14,999 / $499)
-- Independent Packages (2, 3, 4) ALREADY INCLUDE Base Package 1.
-- Their specific feature tables distribute the leftover price above the ₹15k base:
--   • BOFU Marketing: ₹14,999 base + ₹15,000 marketing delta = ₹29,999 ($899)
--   • 3D Experience:  ₹14,999 base + ₹35,000 3D delta        = ₹49,999 ($1,299)
--   • Fullstack SaaS: ₹14,999 base + ₹65,000 backend delta   = ₹79,999 ($1,899)
-- ==============================================================================

-- 1. Ensure Master Packages Exist with Calibrated Fast Acquisition Pricing
INSERT INTO public.packages (id, name, tagline, price_usd, price_inr, turnaround_weeks, badge, popular, description, is_active)
VALUES 
(
  'luxury-landing-sprint',
  'High-Converting Luxury Landing Page',
  'Precision-crafted marketing landing page engineered to captivate and convert.',
  499,
  14999,
  '1-2 weeks',
  'Foundational Base',
  false,
  'The common non-negotiable foundation for every website project. Ideal for boutique agencies, product launches, founders, and creators seeking a razor-sharp, ultra-fast landing page with bespoke animations and high-converting copy lockups.',
  true
),
(
  'growth-marketing-campaigns',
  'BOFU Website Marketing & Sources Management Package',
  'High-converting on-site BOFU pages, 1-click checkouts, urgency mechanics & multi-channel UTM attribution.',
  899,
  29999,
  '2-3 weeks',
  'High Conversion',
  true,
  'The definitive on-website conversion architecture. Includes the complete Luxury Landing Foundation (₹14,999 value) plus all 9 core BOFU conversion modules, 1-click checkout, product showcases, UGC review wall, and full-spectrum UTM multi-source tracking.',
  true
),
(
  'interactive-3d-experience',
  '3D Interactive & Brand Experience',
  'Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.',
  1299,
  49999,
  '3-5 weeks',
  'Signature',
  false,
  'Designed for visionary brands, high-profile portfolios, and innovative tech products. Includes the complete Luxury Landing Foundation (₹14,999 value) plus custom Three.js WebGL canvas, particle fluid shaders, scrollytelling camera choreography, and photorealistic PBR materials.',
  true
),
(
  'fullstack-web-app',
  'Full-Stack Web App / SaaS MVP',
  'Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.',
  1899,
  79999,
  '4-6 weeks',
  'Full-Stack',
  false,
  'Engineered for startups, digital platforms, and founders. Includes the complete Luxury Landing Foundation (₹14,999 value) plus production PostgreSQL database schema, row-level security, multi-provider auth, payment webhooks, self-serve client portal, and executive founder cockpit.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  price_usd = EXCLUDED.price_usd,
  price_inr = EXCLUDED.price_inr,
  turnaround_weeks = EXCLUDED.turnaround_weeks,
  badge = EXCLUDED.badge,
  popular = EXCLUDED.popular,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- ==============================================================================
-- TABLE 1: BASE LUXURY LANDING SPRINT FEATURES
-- Foreign Key -> public.packages(id) = 'luxury-landing-sprint'
-- Scope: Foundational website architecture, layout, typography, speed, contact, CDN
-- Package Total: ₹14,999 INR | $499 USD (All other packages build on this)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_landing_sprint_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'luxury-landing-sprint' REFERENCES public.packages(id) ON DELETE CASCADE,
  function_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  technical_deliverables TEXT NOT NULL,
  business_impact TEXT NOT NULL,
  complexity TEXT NOT NULL DEFAULT 'Standard' CHECK (complexity IN ('Standard', 'Advanced', 'Specialized', 'Enterprise')),
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  included_limit TEXT NOT NULL DEFAULT 'Included in package',
  feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  overage_unit_label TEXT DEFAULT NULL,
  overage_price_inr NUMERIC(10,2) DEFAULT NULL,
  overage_price_usd NUMERIC(10,2) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 2: BOFU WEBSITE MARKETING & SOURCES MANAGEMENT FEATURES
-- Foreign Key -> public.packages(id) = 'growth-marketing-campaigns'
-- Scope: Specialty conversion mechanics, checkout, UTM attribution, pixel telemetry
-- Delta Price (Above ₹14,999 Base): ₹15,000 INR | $400 USD (Total Package: ₹29,999 / $899)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_bofu_marketing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'growth-marketing-campaigns' REFERENCES public.packages(id) ON DELETE CASCADE,
  function_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  technical_deliverables TEXT NOT NULL,
  business_impact TEXT NOT NULL,
  complexity TEXT NOT NULL DEFAULT 'Standard' CHECK (complexity IN ('Standard', 'Advanced', 'Specialized', 'Enterprise')),
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  included_limit TEXT NOT NULL DEFAULT 'Included in package',
  feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  overage_unit_label TEXT DEFAULT NULL,
  overage_price_inr NUMERIC(10,2) DEFAULT NULL,
  overage_price_usd NUMERIC(10,2) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 3: 3D INTERACTIVE & BRAND EXPERIENCE FEATURES
-- Foreign Key -> public.packages(id) = 'interactive-3d-experience'
-- Scope: Specialty WebGL 3D scene, GLSL shaders, camera choreography, spatial audio
-- Delta Price (Above ₹14,999 Base): ₹35,000 INR | $800 USD (Total Package: ₹49,999 / $1,299)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_3d_experience_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'interactive-3d-experience' REFERENCES public.packages(id) ON DELETE CASCADE,
  function_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  technical_deliverables TEXT NOT NULL,
  business_impact TEXT NOT NULL,
  complexity TEXT NOT NULL DEFAULT 'Standard' CHECK (complexity IN ('Standard', 'Advanced', 'Specialized', 'Enterprise')),
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  included_limit TEXT NOT NULL DEFAULT 'Included in package',
  feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  overage_unit_label TEXT DEFAULT NULL,
  overage_price_inr NUMERIC(10,2) DEFAULT NULL,
  overage_price_usd NUMERIC(10,2) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 4: FULL-STACK WEB APP & SAAS MVP FEATURES
-- Foreign Key -> public.packages(id) = 'fullstack-web-app'
-- Scope: Specialty PostgreSQL DB, RLS, Auth, Stripe/Razorpay webhooks, Admin & Client portals
-- Delta Price (Above ₹14,999 Base): ₹65,000 INR | $1,400 USD (Total Package: ₹79,999 / $1,899)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_fullstack_backend_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'fullstack-web-app' REFERENCES public.packages(id) ON DELETE CASCADE,
  function_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  technical_deliverables TEXT NOT NULL,
  business_impact TEXT NOT NULL,
  complexity TEXT NOT NULL DEFAULT 'Standard' CHECK (complexity IN ('Standard', 'Advanced', 'Specialized', 'Enterprise')),
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  included_limit TEXT NOT NULL DEFAULT 'Included in package',
  feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  overage_unit_label TEXT DEFAULT NULL,
  overage_price_inr NUMERIC(10,2) DEFAULT NULL,
  overage_price_usd NUMERIC(10,2) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist idempotently
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_landing_sprint_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_bofu_marketing_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_3d_experience_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_fullstack_backend_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

-- ==============================================================================
-- SEED DATA: TABLE 1 (package_landing_sprint_features)
-- Package Total: ₹14,999 INR | $499 USD (The Foundation)
-- ==============================================================================
INSERT INTO public.package_landing_sprint_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'luxury-landing-sprint',
  'landing_hero_narrative_architecture',
  'Above-the-Fold Hero Narrative & Magnetic CTA Lockup',
  'UI & Layout',
  'Single-focus visual entrance engineered to immediately communicate your primary value proposition with luxury typography, high-contrast CTA, and zero cognitive clutter.',
  'Semantic HTML5 header structure, responsive flex/grid CSS layout, fluid clamp() typography scaling, and high-contrast CTA button with subtle shimmer glow animation.',
  'Captures visitor attention in the first 3 seconds and slashes bounce rates on paid and organic traffic.',
  'Standard',
  true,
  1,
  'Hero narrative lockup & magnetic CTA system',
  2500,
  80,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_responsive_viewport_system',
  'Adaptive Multi-Device Breakpoint System (320px to 4K)',
  'UI & Layout',
  'Flawless layout responsiveness across all screen sizes, including mobile phones, tablets, laptops, and ultra-wide desktop monitors with dedicated mobile navigation.',
  'Mobile-first CSS media queries, responsive touch gestures, slide-out mobile drawer with backdrop blur, and thumb-friendly sticky navigation bar.',
  'Ensures the 70%+ of mobile visitors coming from social media experience native-app visual perfection.',
  'Standard',
  true,
  2,
  'Full responsive website structure (up to 7 standard pages)',
  3500,
  110,
  'Per additional custom page',
  1000,
  35
),
(
  'luxury-landing-sprint',
  'landing_framer_motion_microinteractions',
  'Framer Motion Micro-Interactions & Scroll Reveals',
  'Animation & Motion',
  'Buttery-smooth entrance transitions, magnetic cursor pull effects on buttons, interactive card hover states, and staggered content reveals that create an unmistakable feel of craftsmanship.',
  'Framer Motion useScroll and useTransform hooks, staggered viewport entrance variants, and hardware-accelerated GPU transforms (will-change: transform).',
  'Subconsciously elevates the perceived value of your service or brand, commanding premium client pricing.',
  'Advanced',
  true,
  3,
  'Complete site-wide micro-interactions & scroll animation suite',
  1500,
  50,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_intake_form_validation',
  'Frictionless Lead Intake Form with Real-Time Validation',
  'Lead Capture',
  'Streamlined lead intake form with immediate inline error feedback, international phone formatting, and smooth submission states.',
  'React Hook Form client validation, masked phone input formatting, asynchronous submission handler, and email notification webhook integration.',
  'Eliminates form abandonment caused by confusing errors, maximizing inquiry conversion rates.',
  'Standard',
  true,
  4,
  'Lead intake and contact forms with automated email notifications',
  1500,
  50,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_antispam_honeypot_layer',
  'Invisible Bot Shield & Honeypot Spam Prevention',
  'Security & Deliverability',
  'Client-side invisible honeypot trap and timestamp velocity verification that silently drops automated bot submissions without forcing users to solve ugly CAPTCHA puzzles.',
  'CSS-hidden honeypot trap field, client-side timestamp submission verification (<500ms rejected), and payload sanitization pipeline.',
  'Guarantees 100% human-verified inquiries in your inbox without annoying genuine clients.',
  'Standard',
  true,
  5,
  'Full invisible spam & bot shield across all forms',
  800,
  25,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_social_proof_logo_marquee',
  'Brand Partner & Client Social Proof Marquee',
  'Social Proof',
  'Seamless infinite-scrolling marquee bar showcasing featured client logos, press mentions, or certification badges with interactive pause-on-hover.',
  'Pure CSS continuous keyframe translation (translateX -50%), responsive SVG vector logo grid, and subtle monochrome-to-color hover filter transitions.',
  'Instantly builds authoritative social proof and trust before the prospect scrolls down to pricing.',
  'Standard',
  true,
  6,
  'Infinite logo proof marquee for brand partners and press',
  900,
  30,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_faq_objection_accordion',
  'Interactive Objection-Crushing FAQ Accordion',
  'Content & Conversion',
  'Animated disclosure accordion resolving top buyer objections regarding timelines, pricing, process, and deliverables with single-click accordion reveals.',
  'Accessible WAI-ARIA disclosure pattern, animated height transitions via Framer Motion, and embedded Schema.org FAQPage structured data.',
  'Neutralizes pre-booking hesitations and unlocks Google rich FAQ search snippet eligibility.',
  'Standard',
  true,
  7,
  'Objection FAQ accordion with embedded Google Schema markup',
  800,
  25,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_lighthouse_speed_optimization',
  'Lighthouse 95+ Core Web Vitals & Asset Compression',
  'Performance',
  'Sub-second First Contentful Paint (FCP), zero Cumulative Layout Shift (CLS < 0.01), next-gen WebP/AVIF image formats, and minimal blocking JavaScript.',
  'Next.js image optimization pipeline, font preloading with font-display: swap, aggressive CSS tree-shaking, and critical path CSS inlining.',
  'Maximizes Google Ads Quality Score, lowers paid traffic CPC, and retains mobile visitors on slow networks.',
  'Advanced',
  true,
  8,
  'Comprehensive 95+ Lighthouse speed tuning across desktop & mobile',
  1500,
  50,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_technical_seo_opengraph',
  'Semantic Technical SEO & Custom OpenGraph Cards',
  'SEO & Social',
  'Full semantic HTML5 structure, customized 1200x630 social sharing preview banners for WhatsApp, LinkedIn, iMessage, and X (Twitter), plus automated XML sitemap.',
  'Dynamic OpenGraph meta tags, Twitter card specifications, JSON-LD Organization schema markup, and complete favicon suite (Apple Touch, 32x32, 16x16, SVG).',
  'Ensures every link shared across messaging apps and social media displays an enticing, branded preview.',
  'Standard',
  true,
  9,
  'Complete OpenGraph social cards, XML sitemaps & SEO meta tags',
  1000,
  35,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_edge_cdn_domain_setup',
  'Custom Domain DNS Pointing & Global Edge CDN Setup',
  'Infrastructure',
  'Complete domain DNS connection, automated SSL/TLS encryption certificate provisioning, and multi-region edge caching on Vercel or Cloudflare.',
  'DNS A/CNAME configuration, automated Let''s Encrypt HTTPS certificates, edge cache invalidation rules, and production environment secrets lockdown.',
  'Provides 99.99% uptime with sub-50ms response times worldwide with zero server maintenance required.',
  'Standard',
  true,
  10,
  'Production custom domain connection + SSL + Global Edge CDN',
  999,
  44,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (function_key) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  technical_deliverables = EXCLUDED.technical_deliverables,
  business_impact = EXCLUDED.business_impact,
  complexity = EXCLUDED.complexity,
  is_core = EXCLUDED.is_core,
  display_order = EXCLUDED.display_order,
  included_limit = EXCLUDED.included_limit,
  feature_price_inr = EXCLUDED.feature_price_inr,
  feature_price_usd = EXCLUDED.feature_price_usd,
  overage_unit_label = EXCLUDED.overage_unit_label,
  overage_price_inr = EXCLUDED.overage_price_inr,
  overage_price_usd = EXCLUDED.overage_price_usd;

-- ==============================================================================
-- SEED DATA: TABLE 2 (package_bofu_marketing_features)
-- Package 2 Delta Features (₹15,000 INR | $400 USD)
-- + Base Package 1 Included (₹14,999 INR | $499 USD) = Final Price ₹29,999 / $899
-- ==============================================================================
INSERT INTO public.package_bofu_marketing_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'growth-marketing-campaigns',
  'bofu_1click_express_checkout',
  '1-Click Express Checkout & Dynamic Payment Modal',
  'BOFU Conversion Engine',
  'Frictionless on-site checkout modal supporting Apple Pay, Google Pay, Razorpay UPI, and direct credit cards without redirecting users through a convoluted multi-page cart maze.',
  'Razorpay / Stripe Elements modal integration, automated webhook payment listener, and immediate in-page order receipt and confirmation state.',
  'Cuts cart abandonment in half by facilitating impulsive, high-intent purchases directly from ad traffic.',
  'Advanced',
  true,
  1,
  '1-Click checkout engine with Apple Pay, Google Pay, UPI & Cards',
  2500,
  70,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_urgency_countdown_clock',
  'Dynamic Urgency Countdown Timers & Drop Deadlines',
  'BOFU Conversion Engine',
  'Configurable drop timers with persistent client-side cookies or fixed promotional deadlines to trigger genuine urgency and immediate order placement.',
  'Synchronized JavaScript countdown component with localStorage session recovery, millisecond precision ticker, and automated expired-state banner changeover.',
  'Drives immediate purchase decisions by up to 40% during time-sensitive promotional drops.',
  'Standard',
  true,
  2,
  'Dynamic campaign countdown clocks and drop deadline tickers',
  1000,
  25,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_offer_announcement_bars',
  'Offer-First Sticky Announcement Bar & 1-Tap Coupon Copy',
  'BOFU Conversion Engine',
  'High-contrast sticky top bar highlighting current discount codes, free shipping thresholds, or limited gift bonuses with 1-tap clipboard copying and toast confirmation.',
  'Sticky CSS top bar with automatic page offset calculation, navigator.clipboard API copy action, visual toast feedback, and dismiss cookie logic.',
  'Ensures 100% of incoming visitors immediately recognize your core promotional incentive.',
  'Standard',
  true,
  3,
  'Sticky announcement header with 1-tap clipboard coupon copying',
  800,
  20,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_4k_product_zoom_loupe',
  'Ultra-Crisp 4K Multi-Angle Product Gallery & Zoom Loupe',
  'BOFU Visual Showcase',
  'Interactive product photo gallery with smooth cursor-following magnifying loupe, fluid thumbnail carousel, and instant color/finish variant preview switchers.',
  'Canvas / CSS transform magnifying loupe, responsive thumbnail strip, swipeable mobile touch gallery, and high-density retina image preloading.',
  'Overcomes tactile buyer hesitation for luxury goods and physical products by showcasing micro-details.',
  'Advanced',
  true,
  4,
  'Complete product showcase gallery with 4K zoom loupe & variants',
  1800,
  50,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_studio_photography_staging',
  'Editorial Studio Presentation & Technical Breakdown Cards',
  'BOFU Visual Showcase',
  'Magazine-grade editorial presentation featuring high-resolution studio photography, exploded product views, material callouts, and interactive spec hotspots.',
  'Interactive SVG/CSS hotspot annotations with popover tooltips, high-res WebP visual grids, and before-and-after comparison slider.',
  'Justifies higher price points by presenting your product with the prestige of a luxury designer label.',
  'Advanced',
  true,
  5,
  'Editorial studio product presentations with interactive spec hotspots',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_ugc_video_reels_wall',
  'Vertical UGC Video Reviews Wall & 9:16 Reels Player',
  'BOFU Social Validation',
  'Embedded vertical video player showcasing authentic customer unboxings, video testimonials, and creator reviews with star ratings and product tags.',
  'Custom lightweight 9:16 HTML5 video player with autoplay-on-view, tap-to-unmute toggle, mobile swipe transition, and customer verification badges.',
  'Delivers authentic peer-to-peer social proof that drastically outperforms standard written testimonials.',
  'Advanced',
  true,
  6,
  'Full vertical TikTok / Reels customer video reviews wall',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_sidebyside_comparison_matrix',
  'Side-by-Side Value-Anchoring Comparison Matrix',
  'BOFU Value Anchoring',
  'Interactive comparison table clearly highlighting your product advantages vs. cheaper knock-offs or generic alternatives with checkmarks and feature breakdowns.',
  'Sticky header comparison table with checkmark/cross badges, highlighted recommended tier column, and horizontal touch scrolling on mobile devices.',
  'Frames your offer as the obvious superior choice, making your price feel like an exceptional bargain.',
  'Standard',
  true,
  7,
  'Side-by-side comparison tables against market alternatives',
  1000,
  25,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_fomo_scarcity_stock_counters',
  'Real-Time FOMO Scarcity Toasts & Dynamic Stock Counters',
  'BOFU Urgency',
  'Live order notification popups (e.g., "Sarah from London just purchased...") paired with low-stock inventory warning meters (e.g., "Only 3 items remaining").',
  'Staggered notification queue with animated exit transitions, realistic randomized order pool or live DB order feed, and animated SVG stock meter.',
  'Leverages social validation and scarcity psychology to convert indecisive visitors into active buyers.',
  'Standard',
  true,
  8,
  'Live purchase notification toasts and dynamic low-stock meters',
  1000,
  25,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_freebie_lead_magnet_gate',
  'High-Value Freebie Lead Magnet & Instant Asset Gate',
  'BOFU Lead Capture',
  'Premium digital asset giveaway (PDF buyer guide, discount voucher, lookbook) gated behind a 1-tap email or WhatsApp opt-in with immediate automated download.',
  'Modal opt-in with instant client validation, direct signed download link generation, and automated lead sync to Supabase database.',
  'Recovers 15% to 25% of visitors who are not ready to purchase immediately, building an owned email/SMS list.',
  'Standard',
  true,
  9,
  'Lead magnet opt-in gate with instant digital asset delivery',
  1000,
  25,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_utm_multisource_attribution_engine',
  'Multi-Source UTM Tracking & Channel Attribution Engine',
  'Attribution & Analytics',
  'Automatic capture and storage of URL campaign parameters (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid) with every order and lead.',
  'URL query parser, browser sessionStorage/localStorage session persistence, and automatic payload enrichment sent to Supabase bookings and orders.',
  'Reveals your exact Customer Acquisition Cost (CAC) and ROAS across Instagram, TikTok, Google Ads, and influencers.',
  'Advanced',
  true,
  10,
  'Full multi-source UTM attribution engine across all marketing channels',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_pixel_telemetry_capi_suite',
  'Full-Spectrum Conversion Pixels & Server-Side CAPI Telemetry',
  'Attribution & Analytics',
  'Pre-wired conversion tracking: Meta Pixel + Server-Side Conversions API (CAPI), Google Tag Manager, GA4 e-commerce events, and TikTok Pixel.',
  'Standardized e-commerce events (ViewContent, InitiateCheckout, Purchase), client-to-server event deduplication with event_id, and data layer push triggers.',
  'Bypasses iOS 14+ ad-blockers and privacy filters, delivering 100% signal accuracy to Meta/Google ad algorithms for cheaper conversions.',
  'Advanced',
  true,
  11,
  'Pre-wired Meta CAPI, GA4, GTM and TikTok conversion pixels',
  1000,
  30,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_campaign_link_generator_tool',
  'In-Portal Campaign UTM Link Generator & Source Manager',
  'Campaign Management',
  'Self-serve tool inside your client admin portal to generate tracked campaign URLs for ad sets, influencers, and newsletters in under 5 seconds.',
  'Interactive URL builder UI with preset channels (Instagram Bio, Meta Ad 1, TikTok Creator A, Email Blast), 1-click clipboard copy, and historical link registry.',
  'Allows you or your team to launch targeted marketing campaigns without tracking mistakes or broken attribution.',
  'Standard',
  true,
  12,
  'In-portal UTM campaign link builder with 1-click presets',
  400,
  10,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (function_key) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  technical_deliverables = EXCLUDED.technical_deliverables,
  business_impact = EXCLUDED.business_impact,
  complexity = EXCLUDED.complexity,
  is_core = EXCLUDED.is_core,
  display_order = EXCLUDED.display_order,
  included_limit = EXCLUDED.included_limit,
  feature_price_inr = EXCLUDED.feature_price_inr,
  feature_price_usd = EXCLUDED.feature_price_usd,
  overage_unit_label = EXCLUDED.overage_unit_label,
  overage_price_inr = EXCLUDED.overage_price_inr,
  overage_price_usd = EXCLUDED.overage_price_usd;

-- ==============================================================================
-- SEED DATA: TABLE 3 (package_3d_experience_features)
-- Package 3 Delta Features (₹35,000 INR | $800 USD)
-- + Base Package 1 Included (₹14,999 INR | $499 USD) = Final Price ₹49,999 / $1,299
-- ==============================================================================
INSERT INTO public.package_3d_experience_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'interactive-3d-experience',
  'threed_webgl_canvas_render_loop',
  'Custom Three.js / WebGL Scene Canvas & Render Lifecycle',
  '3D Core Architecture',
  'Dedicated high-performance WebGL 3D scene embedded smoothly within modern HTML DOM, supporting retina displays, auto-resizing, and dynamic aspect ratios.',
  'Three.js Scene, PerspectiveCamera, WebGLRenderer with tone mapping and anti-aliasing, and requestAnimationFrame render loop with delta timing.',
  'Instantly places your brand in the tier of Awwwards Site of the Year nominees and global tech pioneers like Apple.',
  'Specialized',
  true,
  1,
  'High-performance Three.js / WebGL responsive scene canvas',
  8000,
  180,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_glsl_particle_fluid_shaders',
  'Custom GLSL Particle System & Fluid Physics Shaders',
  '3D Shaders & Physics',
  'Interactive GPU-accelerated particle field reacting dynamically to mouse movement, velocity, and touch gestures using custom GLSL vertex and fragment shaders.',
  'BufferGeometry with custom Float32Array attributes, custom ShaderMaterial, curl noise algorithms, and GPU instanced rendering.',
  'Creates an irresistible tactile browsing experience that boosts visitor dwell time by up to 300%.',
  'Specialized',
  true,
  2,
  'Interactive GPU particle systems & dynamic fluid shader physics',
  6000,
  140,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_draco_gltf_compression_pipeline',
  '3D Model Optimization & Draco/KTX2 Mesh Compression',
  '3D Asset Optimization',
  'Ultra-compact 3D model loading pipeline converting high-poly models into lightweight Draco-compressed GLB assets with KTX2 GPU textures for instant loading.',
  'Three.js GLTFLoader, DRACOLoader multi-worker thread decoder, and progressive asset loading state with luxury percentage indicator.',
  'Eliminates heavy 3D loading times, achieving instantaneous initial scene renders on mobile networks.',
  'Advanced',
  true,
  3,
  'Full 3D model optimization & Draco/KTX2 asset compression pipeline',
  5000,
  110,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_scroll_choreography_camera_paths',
  'Scroll-Driven Camera Choreography & Chapter Orbiting',
  'Camera & Animation',
  'Cinematic 3D camera animations tied directly to page scroll position using GSAP ScrollTrigger and CatmullRomCurve3 splines.',
  'GSAP ScrollTrigger binding, CatmullRomCurve3 camera track, Smooth damping with Vector3.lerp(), and chapter-pinned story sections.',
  'Turns a standard product overview into an interactive guided 3D product tour that captivates enterprise clients.',
  'Specialized',
  true,
  4,
  'Scroll-driven 3D camera paths & chapter-pinned story transitions',
  5500,
  130,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_pbr_hdri_lighting_shadows',
  'Photorealistic PBR Materials, HDRI Lighting & Soft Shadows',
  '3D Visual Fidelity',
  'Physically Based Rendering (PBR) materials with realistic metallic, glass transmission, roughness reflections, and HDR environment map radiance.',
  'MeshPhysicalMaterial with transmission and roughness maps, RGBELoader environment radiance maps, and PCFSoftShadowMap calculations.',
  'Produces hyper-realistic material textures (brushed aluminum, gold, glass) that reflect elite product craftsmanship.',
  'Advanced',
  true,
  5,
  'Photorealistic PBR materials, HDRI environment lighting & soft shadows',
  4000,
  90,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_postprocessing_bloom_dof',
  'Cinematic Post-Processing Pipeline (Bloom & Depth of Field)',
  '3D Post-Processing',
  'Bespoke post-processing pass including selective bloom glow for emissive elements, chromatic aberration, subtle vignette, and realistic depth of field (DoF).',
  'Three.js EffectComposer, RenderPass, UnrealBloomPass, and custom ShaderPass color grading curves.',
  'Gives your web application the visual aesthetic of high-budget AAA video game engines and luxury automotive configurators.',
  'Specialized',
  true,
  6,
  'Cinematic post-processing pass (selective bloom, vignette & depth of field)',
  3000,
  70,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_spatial_audio_haptic_sound',
  'Ambient Spatial Audio & Interactive Haptic Sound Design',
  'Audio Immersion',
  'Subtle interactive sound design: low-frequency ambient drone, tactile clicking frequencies on button interactions, and 3D sound positioning.',
  'Web Audio API sound synthesis / Howler.js integration, user interaction audio unlock handler, sound toggle UI control with sound waves.',
  'Engages the visitor auditory senses, creating an unforgettable emotional bond with the experience.',
  'Advanced',
  true,
  7,
  'Ambient spatial audio & tactile interactive sound design',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_mobile_gyroscope_thermal_guard',
  'Mobile Gyroscope Controls & Adaptive 60fps Thermal Guard',
  'Mobile Performance',
  'Device orientation sensor integration on smartphones for physical tilt navigation, paired with automatic quality scaling to maintain solid 60fps on mobile.',
  'DeviceOrientationEvent API with iOS permission trigger, dynamic pixelRatio downscaling on frame drops, and WebGL context loss recovery.',
  'Ensures flawless execution across high-end desktops and everyday mobile smartphones without battery drain or lag.',
  'Advanced',
  true,
  8,
  'Mobile gyroscope tilt controls & adaptive 60fps thermal guard',
  1500,
  30,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (function_key) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  technical_deliverables = EXCLUDED.technical_deliverables,
  business_impact = EXCLUDED.business_impact,
  complexity = EXCLUDED.complexity,
  is_core = EXCLUDED.is_core,
  display_order = EXCLUDED.display_order,
  included_limit = EXCLUDED.included_limit,
  feature_price_inr = EXCLUDED.feature_price_inr,
  feature_price_usd = EXCLUDED.feature_price_usd,
  overage_unit_label = EXCLUDED.overage_unit_label,
  overage_price_inr = EXCLUDED.overage_price_inr,
  overage_price_usd = EXCLUDED.overage_price_usd;

-- ==============================================================================
-- SEED DATA: TABLE 4 (package_fullstack_backend_features)
-- Package 4 Delta Features (₹65,000 INR | $1,400 USD)
-- + Base Package 1 Included (₹14,999 INR | $499 USD) = Final Price ₹79,999 / $1,899
-- ==============================================================================
INSERT INTO public.package_fullstack_backend_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'fullstack-web-app',
  'backend_supabase_postgres_relational_schema',
  'Supabase PostgreSQL Production Database Architecture',
  'Database & Architecture',
  'Normalized relational database schema with foreign key constraints, UUID primary keys, automated timestamp triggers, and optimized indexes.',
  'PostgreSQL DDL schema scripts, migration management, custom PL/pgSQL database functions, and automated backups.',
  'Provides an enterprise-grade relational data foundation that scales effortlessly to hundreds of thousands of users without data corruption.',
  'Enterprise',
  true,
  1,
  'Production PostgreSQL relational database schema with custom triggers',
  12000,
  260,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_row_level_security_rls',
  'Zero-Trust Row-Level Security (RLS) Policy Architecture',
  'Security & Compliance',
  'Granular database-level access policies guaranteeing that clients can only read/write their own records, while administrative roles have global access.',
  'Postgres RLS policies on all tables (FOR SELECT, INSERT, UPDATE, DELETE), auth.uid() validation, and SQL injection immune queries.',
  'Eliminates catastrophic data leaks at the database level, ensuring full compliance with GDPR and industry security standards.',
  'Enterprise',
  true,
  2,
  'Zero-Trust Row-Level Security policies across all database models',
  8000,
  170,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_omnichannel_auth_suite',
  'Multi-Provider Auth & Session Management',
  'Authentication & Identity',
  'Enterprise authentication supporting Google OAuth 2.0, GitHub, Magic Link passwordless login, and traditional email/password with secure password resets.',
  'Supabase Auth SSR client, PKCE auth flow, secure HTTP-only session cookies, and automated email verification triggers.',
  'Zero-friction onboarding for new users while keeping accounts protected against brute-force and credential stuffing.',
  'Advanced',
  true,
  3,
  'Multi-provider auth suite (Email, Google OAuth, Magic Link & sessions)',
  7500,
  160,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_stripe_razorpay_webhook_pipeline',
  'Stripe & Razorpay Payment Webhooks Engine',
  'Payments & Billing',
  'Automated payment processing handling one-time purchases, subscriptions, recurring billing cycles, invoice generation, and refund webhooks.',
  'Idempotent Next.js API webhook endpoints, cryptographic signature verification, and database transaction updates on payment confirmation.',
  'Instant monetization with automated digital fulfillment and zero manual payment verification required.',
  'Enterprise',
  true,
  4,
  'Full payment webhooks engine for purchases and subscriptions',
  8500,
  180,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_customer_selfserve_portal',
  'Customer Self-Serve Portal & Order Center',
  'Client Portal',
  'Authenticated client dashboard where customers view active orders, download invoices, access purchased assets, update profiles, and manage subscriptions.',
  'Protected route middleware, responsive client dashboard UI, real-time status tracker, and digital asset secure download generator.',
  'Drastically cuts customer support tickets by 80% through self-serve management.',
  'Advanced',
  true,
  5,
  'Authenticated client self-service portal & order management center',
  9000,
  200,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_executive_admin_cockpit',
  'Executive Admin Cockpit & Business Intelligence',
  'Admin Management',
  'Private master control dashboard for founders: real-time revenue stats, active user count, order management, status transitions, and user bans.',
  'Role-guarded admin layout (is_admin() check), data tables with multi-filter sorting, pagination, and CSV data export.',
  'Provides founders total clarity and control over their business operations from a single clean screen.',
  'Enterprise',
  true,
  6,
  'Executive founder admin cockpit with live analytics & management',
  10000,
  220,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_transactional_email_sms_pipeline',
  'Automated Transactional Emails & SMS Notifications',
  'Communications',
  'Beautiful React Email templates dispatched automatically on order completion, password resets, welcome sequences, and project milestone updates.',
  'Resend / Twilio API integration, React Email component templates, and DKIM / SPF email authentication setup for 99%+ deliverability.',
  'Maintains high customer engagement and establishes a professional post-purchase experience.',
  'Standard',
  true,
  7,
  'Automated transactional email notifications & lifecycle alerts',
  3500,
  70,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_s3_storage_signed_uploads',
  'Encrypted Cloud Storage & Secure File Uploads',
  'Storage & Media',
  'Direct-to-storage file upload pipeline for user avatars, project documents, high-res assets, and signed legal contracts with signed URL downloads.',
  'Supabase Storage buckets (client-assets, contracts), fine-grained storage RLS policies, and client-side image compression before upload.',
  'Prevents public leakage of sensitive business documents and contracts while handling large files effortlessly.',
  'Advanced',
  true,
  8,
  'Encrypted cloud storage buckets with signed URL access',
  3000,
  60,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_rbac_audit_logging',
  'Role-Based Access Control (RBAC) & Audit Logging',
  'Governance & Audit',
  'Granular permission tiers (Super Admin, Manager, Client, Member) with an immutable audit log tracking critical account modifications and payments.',
  'Role column with PostgreSQL CHECK constraints, audit log triggers capturing user IP, timestamp, action type, and old/new state.',
  'Essential for team delegation, preventing unauthorized modifications and providing a verifiable record of all platform activities.',
  'Enterprise',
  true,
  9,
  'Role-based access control with immutable security audit logging',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_outbound_webhook_bridge',
  'Secure External API & Outbound Webhook Dispatcher',
  'Integrations & Automation',
  'Expose secure REST endpoints with API key authorization or trigger outbound webhooks to Zapier, Make.com, or Slack whenever key events occur.',
  'API route handlers with rate limiting, SHA-256 HMAC payload signing, and outbound HTTP fetch retry queue.',
  'Allows seamless integration with your existing CRM, accounting software, and Slack alert channels.',
  'Advanced',
  true,
  10,
  'Outbound webhook dispatcher & external API connectivity',
  1500,
  30,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (function_key) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  technical_deliverables = EXCLUDED.technical_deliverables,
  business_impact = EXCLUDED.business_impact,
  complexity = EXCLUDED.complexity,
  is_core = EXCLUDED.is_core,
  display_order = EXCLUDED.display_order,
  included_limit = EXCLUDED.included_limit,
  feature_price_inr = EXCLUDED.feature_price_inr,
  feature_price_usd = EXCLUDED.feature_price_usd,
  overage_unit_label = EXCLUDED.overage_unit_label,
  overage_price_inr = EXCLUDED.overage_price_inr,
  overage_price_usd = EXCLUDED.overage_price_usd;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR ALL 4 TABLES
-- ==============================================================================
ALTER TABLE public.package_landing_sprint_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bofu_marketing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_3d_experience_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_fullstack_backend_features ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow clients & visitors to view features)
DROP POLICY IF EXISTS "Public read on landing sprint features" ON public.package_landing_sprint_features;
CREATE POLICY "Public read on landing sprint features" 
  ON public.package_landing_sprint_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on bofu marketing features" ON public.package_bofu_marketing_features;
CREATE POLICY "Public read on bofu marketing features" 
  ON public.package_bofu_marketing_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on 3d experience features" ON public.package_3d_experience_features;
CREATE POLICY "Public read on 3d experience features" 
  ON public.package_3d_experience_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on fullstack backend features" ON public.package_fullstack_backend_features;
CREATE POLICY "Public read on fullstack backend features" 
  ON public.package_fullstack_backend_features FOR SELECT TO anon, authenticated USING (true);

-- 2. Admin Management Policies (Admins can insert/update/delete)
DROP POLICY IF EXISTS "Admin manage landing sprint features" ON public.package_landing_sprint_features;
CREATE POLICY "Admin manage landing sprint features" 
  ON public.package_landing_sprint_features FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage bofu marketing features" ON public.package_bofu_marketing_features;
CREATE POLICY "Admin manage bofu marketing features" 
  ON public.package_bofu_marketing_features FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage 3d experience features" ON public.package_3d_experience_features;
CREATE POLICY "Admin manage 3d experience features" 
  ON public.package_3d_experience_features FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage fullstack backend features" ON public.package_fullstack_backend_features;
CREATE POLICY "Admin manage fullstack backend features" 
  ON public.package_fullstack_backend_features FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================================================
-- CONSOLIDATED VIEW: public.package_all_features_view
-- For seamless unified querying across all 4 separate tables
-- ==============================================================================
CREATE OR REPLACE VIEW public.package_all_features_view AS
SELECT 
  f.id,
  f.package_id,
  p.name AS package_name,
  p.price_usd,
  p.price_inr,
  'package_landing_sprint_features' AS source_table,
  f.function_key,
  f.title,
  f.category,
  f.description,
  f.technical_deliverables,
  f.business_impact,
  f.complexity,
  f.is_core,
  f.display_order,
  f.included_limit,
  f.feature_price_inr,
  f.feature_price_usd,
  f.overage_unit_label,
  f.overage_price_inr,
  f.overage_price_usd,
  f.created_at
FROM public.package_landing_sprint_features f
JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT 
  f.id,
  f.package_id,
  p.name AS package_name,
  p.price_usd,
  p.price_inr,
  'package_bofu_marketing_features' AS source_table,
  f.function_key,
  f.title,
  f.category,
  f.description,
  f.technical_deliverables,
  f.business_impact,
  f.complexity,
  f.is_core,
  f.display_order,
  f.included_limit,
  f.feature_price_inr,
  f.feature_price_usd,
  f.overage_unit_label,
  f.overage_price_inr,
  f.overage_price_usd,
  f.created_at
FROM public.package_bofu_marketing_features f
JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT 
  f.id,
  f.package_id,
  p.name AS package_name,
  p.price_usd,
  p.price_inr,
  'package_3d_experience_features' AS source_table,
  f.function_key,
  f.title,
  f.category,
  f.description,
  f.technical_deliverables,
  f.business_impact,
  f.complexity,
  f.is_core,
  f.display_order,
  f.included_limit,
  f.feature_price_inr,
  f.feature_price_usd,
  f.overage_unit_label,
  f.overage_price_inr,
  f.overage_price_usd,
  f.created_at
FROM public.package_3d_experience_features f
JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT 
  f.id,
  f.package_id,
  p.name AS package_name,
  p.price_usd,
  p.price_inr,
  'package_fullstack_backend_features' AS source_table,
  f.function_key,
  f.title,
  f.category,
  f.description,
  f.technical_deliverables,
  f.business_impact,
  f.complexity,
  f.is_core,
  f.display_order,
  f.included_limit,
  f.feature_price_inr,
  f.feature_price_usd,
  f.overage_unit_label,
  f.overage_price_inr,
  f.overage_price_usd,
  f.created_at
FROM public.package_fullstack_backend_features f
JOIN public.packages p ON p.id = f.package_id;
