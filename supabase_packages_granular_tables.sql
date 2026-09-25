-- ==============================================================================
-- SUPABASE MIGRATION: SEPARATE GRANULAR FEATURE TABLES FOR ALL PACKAGES
-- Architecture: Package 1 (Luxury Landing) is the Non-Negotiable Foundational Base (₹14,999 / $499)
-- Independent Packages (2, 3, 4, 5, 6) ALREADY INCLUDE Base Package 1.
-- Their specific feature tables distribute the leftover price above the ₹15k base:
--   • High-Converting Sales Engine (BOFU): ₹14,999 base + ₹15,000 delta = ₹29,999 ($899)
--   • Smart Booking & Appointment Engine:  ₹14,999 base + ₹15,000 delta = ₹29,999 ($899)
--   • Staff & Team Management Portal:      ₹14,999 base + ₹20,000 delta = ₹34,999 ($999)
--   • 3D Interactive Brand Experience:     ₹14,999 base + ₹35,000 delta = ₹49,999 ($1,299)
--   • Fullstack Web App / SaaS MVP:        ₹14,999 base + ₹65,000 delta = ₹79,999 ($1,899)
--
-- Customization Stacking Formula:
--   Total = Base (₹14,999 / $499) + Sum of Selected Package Deltas
-- ==============================================================================

-- 1. Ensure Master Packages Exist with Calibrated Fast Acquisition Pricing
INSERT INTO public.packages (id, name, tagline, price_usd, price_inr, turnaround_weeks, badge, popular, description, is_active)
VALUES 
(
  'luxury-landing-sprint',
  'High-Converting Luxury Landing Page',
  'Precision-crafted marketing landing page engineered to captivate and convert.',
  99,
  4999,
  '1-2 weeks',
  'Foundational Base',
  false,
  'The common non-negotiable foundation for every website project. Ideal for boutique agencies, product launches, founders, and creators seeking a razor-sharp, ultra-fast landing page with bespoke animations and high-converting copy lockups.',
  true
),
(
  'growth-marketing-campaigns',
  'High-Converting Sales Engine & Sources Management',
  'High-converting on-site BOFU pages, 1-click checkouts, AI sales concierge bot, multi-lingual i18n & multi-channel UTM attribution.',
  499,
  19999,
  '2-3 weeks',
  'High Conversion',
  true,
  'The definitive on-website sales architecture. Includes the complete Luxury Landing Foundation (₹4,999 value) plus all 9 core BOFU conversion modules, 1-click checkout, native AI sales concierge bot, multi-lingual localization (i18n), and full-spectrum UTM multi-source tracking.',
  true
),
(
  'booking-appointments-engine',
  'Smart Appointment & Booking Engine',
  'Live slot picker, calendar sync, staff assignment, automated WhatsApp reminders, multi-branch routing & pre-payments.',
  499,
  19999,
  '2-3 weeks',
  'High Conversion',
  false,
  'Turnkey appointment and consultation booking infrastructure. Includes the complete Luxury Landing Foundation (₹4,999 value) plus real-time calendar slot engine, 2-way Google/Outlook sync, automated WhatsApp/email reminders, multi-branch location routing, and Stripe/Razorpay session pre-payments.',
  true
),
(
  'staff-team-management-portal',
  'Staff & Team Management Portal',
  'Digital staff directory, weekly shift scheduling, leave approvals, RBAC & payroll summaries.',
  599,
  24999,
  '3-4 weeks',
  'Operations',
  false,
  'Complete internal team management and operational portal. Includes the complete Luxury Landing Foundation (₹4,999 value) plus secure employee logins, shift rostering, time-off approval workflows, geolocation clock-in timesheets, role-based access, and 1-click payroll CSV export.',
  true
),
(
  'interactive-3d-experience',
  '3D Interactive & Brand Experience',
  'Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.',
  899,
  39999,
  '3-5 weeks',
  'Signature',
  false,
  'Designed for visionary brands, high-profile portfolios, and innovative tech products. Includes the complete Luxury Landing Foundation (₹4,999 value) plus custom Three.js WebGL canvas, particle fluid shaders, scrollytelling camera choreography, material customizers, and photorealistic PBR materials.',
  true
),
(
  'fullstack-web-app',
  'Full-Stack Web App / SaaS MVP',
  'Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.',
  1499,
  69999,
  '4-6 weeks',
  'Full-Stack',
  false,
  'Engineered for startups, digital platforms, and founders. Includes the complete Luxury Landing Foundation (₹4,999 value) plus production PostgreSQL database schema, row-level security, multi-provider auth, payment webhooks, self-serve client portal, automated daily backup snapshots, and executive founder cockpit.',
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
-- Scope: Specialty conversion mechanics, checkout, AI bot, multi-lingual i18n, UTM attribution
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
-- TABLE 3: SMART APPOINTMENT & BOOKING ENGINE FEATURES
-- Foreign Key -> public.packages(id) = 'booking-appointments-engine'
-- Scope: Calendar slots, Google/Outlook sync, WhatsApp reminders, multi-branch routing, deposits
-- Delta Price (Above ₹14,999 Base): ₹15,000 INR | $400 USD (Total Package: ₹29,999 / $899)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_booking_engine_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'booking-appointments-engine' REFERENCES public.packages(id) ON DELETE CASCADE,
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
-- TABLE 4: STAFF & TEAM MANAGEMENT PORTAL FEATURES
-- Foreign Key -> public.packages(id) = 'staff-team-management-portal'
-- Scope: Staff directory, shift scheduling, leave approvals, RBAC, geolocation timesheets, payroll
-- Delta Price (Above ₹14,999 Base): ₹20,000 INR | $500 USD (Total Package: ₹34,999 / $999)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.package_staff_portal_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL DEFAULT 'staff-team-management-portal' REFERENCES public.packages(id) ON DELETE CASCADE,
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
-- TABLE 5: 3D INTERACTIVE & BRAND EXPERIENCE FEATURES
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
-- TABLE 6: FULL-STACK WEB APP & SAAS MVP FEATURES
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

ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_booking_engine_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS included_limit TEXT NOT NULL DEFAULT 'Included in package';
ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS feature_price_inr NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS feature_price_usd NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS overage_unit_label TEXT DEFAULT NULL;
ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS overage_price_inr NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE public.package_staff_portal_features ADD COLUMN IF NOT EXISTS overage_price_usd NUMERIC(10,2) DEFAULT NULL;

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
-- Package Total: ₹14,999 INR | $499 USD (The Foundation Built Into Every Package)
-- Sum: 2500+3500+1500+1500+800+900+800+1500+1000+999 = 14,999 INR | 80+110+50+45+25+30+25+50+35+49 = $499 USD
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
  'Frictionless lead intake form with instant webhook routing',
  1500,
  45,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_bot_protection_honeypot',
  'Honeypot Anti-Spam & Bot Shield Protection',
  'Security & Clean Data',
  'Zero-friction spam prevention that catches automated scraping bots and junk submissions without forcing real humans to solve annoying captcha puzzles.',
  'Hidden CSS honeypot input trap, timestamp submission delta verification (>2.5s human threshold), and IP rate limiter.',
  'Keeps your client CRM and notification inbox 100% free of junk spam leads.',
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
  49,
  NULL,
  NULL,
  NULL
),
-- Extra Included Micro-Features (No Extra Charge)
(
  'luxury-landing-sprint',
  'landing_dark_light_theme_mode',
  'Zero-Flash Dark / Light Theme Mode Switcher',
  'UI & Customization',
  'Smooth dark and light mode toggle with zero layout-shift or white flash on page load, synced with system preferences and persisted in localStorage.',
  'CSS custom property design tokens, inline theme initialization script preventing FOUC, and animated sun/moon icon switcher.',
  'Offers an ultra-modern aesthetic that matches visitor ambient lighting and personal device preference.',
  'Standard',
  true,
  11,
  'Zero-flash Dark / Light theme toggle with local persistence',
  0,
  0,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_cookie_gdpr_consent_modal',
  'Privacy Policy & Cookie Consent Compliance Banner',
  'Compliance & Legal',
  'Minimalist, non-intrusive cookie consent drawer with accept/customize toggles adhering to international GDPR and CCPA web guidelines.',
  'Consent state persistence in client cookies, conditional script blocking for analytics until accepted, and branded backdrop styling.',
  'Protects your business from international privacy penalties while maintaining client trust.',
  'Standard',
  true,
  12,
  'Branded GDPR & Cookie consent compliance modal',
  0,
  0,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_social_share_drawer',
  'Native Web Share API Drawer & 1-Click Link Copy',
  'Social & Viral',
  'Modern floating share button that launches native mobile share sheets (iOS/Android) or copies direct referral links with toast confirmation on desktop.',
  'navigator.share() API with automatic fallback to clipboard copy and animated feedback toast.',
  'Encourages immediate word-of-mouth referral sharing without leaving the page.',
  'Standard',
  true,
  13,
  'Native mobile share sheet & 1-click clipboard link drawer',
  0,
  0,
  NULL,
  NULL,
  NULL
),
(
  'luxury-landing-sprint',
  'landing_custom_404_recovery_hub',
  'Custom 404 Luxury Error Page with Recovery Navigation',
  'UX & Retention',
  'Bespoke, brand-aligned 404 error page with helpful quick-links back to popular sections and interactive search instead of an ugly default browser dead end.',
  'Next.js not-found template, dynamic route suggestion algorithms, and search bar recovery.',
  'Prevents lost traffic from broken links or typos by guiding visitors back into your conversion funnel.',
  'Standard',
  true,
  14,
  'Custom luxury 404 error recovery hub',
  0,
  0,
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
-- Delta Price: ₹15,000 INR | $400 USD (Includes ₹14,999 Base -> Total ₹29,999 / $899)
-- Sum: 2000+2000+2000+1500+1500+1500+1500+1500+1500 = 15,000 INR | 50+50+50+40+40+40+40+40+50 = $400 USD
-- ==============================================================================
INSERT INTO public.package_bofu_marketing_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'growth-marketing-campaigns',
  'bofu_conversion_landing_strip',
  'High-Converting BOFU Landing Strip & Value Stacks',
  'Conversion Architecture',
  'Bottom-of-Funnel (BOFU) focused page layout with irresistible benefit anchors, value stack breakdowns, guaranteed risk-reversal badges, and frictionless lead CTAs.',
  'Next.js dynamic section render, high-contrast gradient conversion badges, and mobile-optimized viewports.',
  'Converts warm, ad-driven prospects who are actively comparing alternatives into committed paying customers.',
  'Advanced',
  true,
  1,
  'Full BOFU high-converting landing structure and value stack modules',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_frictionless_instant_checkout',
  '1-Click Express Checkout & Digital Payment Gateway',
  'Checkout & Revenue',
  'Streamlined checkout flow supporting Apple Pay, Google Pay, Razorpay, UPI, and Credit Cards with zero account creation hurdles.',
  'Stripe Elements & Razorpay Webhook integration, automated payment verification, and instant confirmation screens.',
  'Eliminates multi-step checkout fatigue and captures impulse buyers on both mobile and desktop.',
  'Specialized',
  true,
  2,
  'Complete 1-click express checkout gateway with instant payment verification',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_ai_sales_concierge_bot',
  'AI Sales Concierge Bot & Automated Objection Closer',
  'AI & Automated Sales',
  'Intelligent 24/7 on-site conversational AI trained on your offerings, pricing, FAQs, and policies that answers prospect objections and routes hot buyers directly into checkout.',
  'Streaming LLM integration (OpenAI/Gemini), business context retrieval knowledge-base, automated lead qualification, and 1-click checkout launch from chat.',
  'Recovers 20-30% of abandoning shoppers by answering doubts in real time and qualifies buyers around the clock.',
  'Specialized',
  true,
  3,
  'Native conversational AI sales bot with objection resolution & checkout trigger',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_multilingual_localization_i18n',
  'Multi-Lingual Support & International Currency Localization (i18n)',
  'Global Localization',
  'Seamless multi-language translation architecture and dynamic multi-currency display (USD, EUR, GBP, INR, AED) with automatic geo-detection.',
  'Next-intl / i18next internationalization setup, dynamic locale routing (/es, /fr, /de, /hi), geo-IP currency detection, and localized currency formatting.',
  'Expands your addressable market internationally and boosts global cross-border conversion by up to 70%.',
  'Advanced',
  true,
  4,
  'Multi-language switcher (up to 3 languages) & multi-currency price localization',
  1500,
  40,
  'Per additional language translation package',
  750,
  25
),
(
  'growth-marketing-campaigns',
  'bofu_multi_channel_utm_attribution',
  'Multi-Channel UTM Attribution & Campaign Source Hub',
  'Attribution & Analytics',
  'Automated ingestion of UTM source, medium, campaign, term, and referrer headers saved with every purchase and lead submission.',
  'Custom UTM tracking middleware, cookie persistence across subdomains, and Supabase marketing_sources sync.',
  'Reveals exactly which ad campaigns, TikTok creators, and referral links generate real revenue.',
  'Advanced',
  true,
  5,
  'Full multi-touch UTM attribution engine & marketing sources hub',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_sticky_floating_cart_drawer',
  'Sticky Quick-View Cart Drawer & Live Product Showcase',
  'UX & E-Commerce',
  'Slide-over cart drawer showing selected items, tier discounts, free-shipping progress bars, and instant upsell cross-sells.',
  'Zustand cart state store, local storage hydration, animated drawer slide-out with Framer Motion, and real-time total recalculation.',
  'Increases Average Order Value (AOV) by up to 22% through dynamic order bumps and threshold bars.',
  'Standard',
  true,
  6,
  'Slide-over quick cart drawer with dynamic upsells and free-shipping meter',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_urgency_scarcity_conversion_triggers',
  'Real-Time Urgency Triggers & Inventory Scarcity Meters',
  'Conversion Psychology',
  'Dynamic countdown timers for flash sales, live recent purchase toasts, and low-inventory stock badges that trigger ethical FOMO.',
  'Real-time WebSocket / polling order toasts, dynamic SVG inventory meters, and configurable flash-deal countdown hooks.',
  'Encourages immediate purchase decisions and prevents prospects from postponing until tomorrow.',
  'Standard',
  true,
  7,
  'Full urgency suite (live countdown clocks, scarcity meters & purchase popups)',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_social_proof_ticker_reviews',
  'Verified Buyer UGC Reviews Wall & Video Testimonials',
  'Social Proof',
  'Filterable review feed with 5-star ratings, photo attachments, verified buyer badges, and embedded TikTok/Reel video player.',
  'Interactive review modal, video player with custom controls, star-rating breakdown histogram, and Schema.org Review structured data.',
  'Builds ironclad credibility by demonstrating real customer success and organic video validation.',
  'Standard',
  true,
  8,
  'Filterable verified customer review wall with video testimonial player',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'growth-marketing-campaigns',
  'bofu_direct_lead_routing_notifications',
  'Direct Instant WhatsApp & Email Lead Alerts with Conversion Telemetry',
  'Lead Routing & Telemetry',
  'Instant notification pipeline that pings the business owner on WhatsApp and email the exact second a high-intent lead or checkout is submitted, backed by Meta CAPI & GA4 e-commerce events.',
  'WhatsApp Business Cloud API / Twilio webhook, transactional Resend email dispatcher, Meta Conversions API (CAPI), and GA4 purchase events.',
  'Enables sub-5-minute lead response times, which boosts appointment and deal close rates by 391%.',
  'Advanced',
  true,
  9,
  'Instant WhatsApp + Email lead alerts & Meta CAPI / GA4 conversion telemetry',
  1500,
  50,
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
-- SEED DATA: TABLE 3 (package_booking_engine_features)
-- Delta Price: ₹15,000 INR | $400 USD (Includes ₹14,999 Base -> Total ₹29,999 / $899)
-- Sum: 3000+2500+2000+1500+1500+2500+2000 = 15,000 INR | 80+70+50+40+40+70+50 = $400 USD
-- ==============================================================================
INSERT INTO public.package_booking_engine_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'booking-appointments-engine',
  'booking_interactive_calendar_slots',
  'Real-Time Interactive Calendar & Time Slot Picker',
  'Booking UI',
  'Modern, responsive booking calendar interface displaying available days, real-time open time slots, duration options, and instant date selection.',
  'React date/time calendar picker, real-time availability slot calculation engine, and smooth selection animations.',
  'Eliminates the endless back-and-forth email scheduling and lets qualified prospects book immediately.',
  'Standard',
  true,
  1,
  'Complete responsive calendar slot picker with real-time availability display',
  3000,
  80,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_google_outlook_cal_sync',
  '2-Way Google Calendar & Outlook Real-Time Sync',
  'Calendar Sync',
  'Bidirectional calendar integration preventing double-bookings by automatically reading busy events from your calendar and writing new bookings instantly.',
  'Google Calendar API OAuth2 integration, Microsoft Graph Outlook API, webhook change listeners, and automated event creation with meeting links.',
  'Guarantees you will never get double-booked and saves hours of manual schedule management every week.',
  'Advanced',
  true,
  2,
  'Bidirectional Google & Outlook calendar synchronization',
  2500,
  70,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_automated_reminders_whatsapp_email',
  'Automated WhatsApp & Email Confirmation & Reminder Sequences',
  'Automations & Retention',
  'Automated reminder workflows dispatched immediately upon booking, 24 hours prior, and 1 hour before the session with calendar invite (.ics) attachments.',
  'Twilio / WhatsApp Business Cloud API webhook, Resend transactional email pipeline, dynamic ICS calendar invite generation, and 1-click reschedule links.',
  'Slashes appointment no-show rates from 30% down to under 4%, protecting your billable hours.',
  'Advanced',
  true,
  3,
  'Automated multi-channel WhatsApp + Email confirmation & reminder workflow',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_flexible_buffer_timezone_engine',
  'Timezone Auto-Detection, Buffer Gaps & Working Hours Engine',
  'Scheduling Logic',
  'Intelligent scheduling logic that automatically detects the visitor local timezone, enforces custom daily working hours, and adds custom buffer buffers between meetings.',
  'Intl.DateTimeFormat browser timezone converter, customizable break buffer rules (e.g. 15-min gap), maximum bookings per day caps, and holiday blackout dates.',
  'Ensures international clients book at comfortable hours while keeping your calendar humane and fatigue-free.',
  'Standard',
  true,
  4,
  'Timezone auto-converter, meeting buffer gaps & custom operational hours',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_custom_intake_questionnaire',
  'Pre-Meeting Intake Questionnaire & Document Attachment',
  'Client Intake',
  'Custom pre-appointment questionnaire allowing prospects to provide background context, select project budget ranges, and upload reference files before the call.',
  'Dynamic multi-step form schema, file upload to Supabase storage, and automated appending of client responses to calendar invite notes.',
  'Ensures every meeting starts fully prepared and qualified, eliminating unproductive discovery calls.',
  'Standard',
  true,
  5,
  'Custom pre-call qualification questionnaire with secure file uploads',
  1500,
  40,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_deposit_prepayment_flow',
  'Stripe & Razorpay Consultation Pre-Payment & Deposit Gateway',
  'Payments & Billing',
  'Seamless payment collection requiring clients to pay full session fees or deposit retainers prior to booking confirmation.',
  'Stripe Checkout & Razorpay payment intent integration, automated refund handling on cancellation, and branded tax invoice receipts.',
  'Guarantees upfront commitment and eliminates tire-kickers who waste your consultation time.',
  'Specialized',
  true,
  6,
  'Integrated deposit & consultation fee payment gateway',
  2500,
  70,
  NULL,
  NULL,
  NULL
),
(
  'booking-appointments-engine',
  'booking_multibranch_location_routing',
  'Multi-Branch & Location Routing (Micro-Feature)',
  'Multi-Location',
  'Smart routing that lets visitors select physical branches or virtual meeting rooms with independent practitioner calendars and location-specific directions.',
  'Location selection switcher, branch-specific staff assignment, Google Maps embeds, and independent calendar routing for up to 3 physical or virtual clinics/branches.',
  'Enables multi-location businesses, clinics, and studios to manage independent branch bookings under a single unified website.',
  'Advanced',
  true,
  7,
  'Multi-branch selection with independent practitioner calendars (up to 3 branches)',
  2000,
  50,
  'Per additional branch or studio location',
  1000,
  35
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
-- SEED DATA: TABLE 4 (package_staff_portal_features)
-- Delta Price: ₹20,000 INR | $500 USD (Includes ₹14,999 Base -> Total ₹34,999 / $999)
-- Sum: 3500+3500+2500+3000+2000+3000+2500 = 20,000 INR | 90+90+60+70+50+80+60 = $500 USD
-- ==============================================================================
INSERT INTO public.package_staff_portal_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'staff-team-management-portal',
  'staff_directory_profiles_roster',
  'Digital Staff Directory, Member Profiles & Department Rostering',
  'Directory & Roster',
  'Searchable digital directory of all team members with contact details, department tags, assigned roles, bio cards, and emergency contacts.',
  'Supabase staff profiles table, search & filter by department, profile editing UI, and avatar upload pipeline.',
  'Centralizes employee information and makes internal communication effortless as the team expands.',
  'Standard',
  true,
  1,
  'Searchable digital staff directory with department grouping & member profiles',
  3500,
  90,
  'Per additional 25 employee accounts',
  1500,
  45
),
(
  'staff-team-management-portal',
  'staff_shift_scheduling_availability',
  'Weekly Shift Scheduling, Overtime Tracker & Availability Board',
  'Shift Scheduling',
  'Interactive weekly shift scheduler allowing managers to publish employee shifts, track open slots, view employee availability, and prevent scheduling conflicts.',
  'Interactive weekly timetable grid, shift assignment state, conflict detection algorithm, and push notification on shift publish.',
  'Saves 10+ hours per week of manual shift coordination and eliminates no-shows and miscommunicated hours.',
  'Advanced',
  true,
  2,
  'Interactive weekly shift roster with shift publishing & conflict detection',
  3500,
  90,
  NULL,
  NULL,
  NULL
),
(
  'staff-team-management-portal',
  'staff_timeoff_leave_approval_workflow',
  'Time-Off & Leave Request Portal with 1-Click Manager Approvals',
  'Leave Management',
  'Self-serve portal where staff can submit paid leave, sick days, or vacation requests with manager email notifications and 1-click approvals.',
  'Leave balance tracking table, manager approval/rejection modal, automated status notification, and calendar sync of approved leaves.',
  'Automates time-off tracking with clear audit trails, replacing messy WhatsApp messages and spreadsheets.',
  'Standard',
  true,
  3,
  'Self-serve time-off portal with automated manager approval workflow',
  2500,
  60,
  NULL,
  NULL,
  NULL
),
(
  'staff-team-management-portal',
  'staff_granular_rbac_roles',
  'Multi-Tier Role-Based Permissions (Admin, Manager, Staff, Contractor)',
  'Access Control & Security',
  'Strict security boundaries ensuring staff members only view their personal shifts and profile, managers see their department, and owners see full financial/operational data.',
  'PostgreSQL Row-Level Security (RLS) policies based on user auth role, private route guards, and admin privilege escalation protection.',
  'Protects sensitive company finances, salary info, and client records from unauthorized internal eyes.',
  'Enterprise',
  true,
  4,
  'Granular RBAC role security across Admin, Manager, Staff and Contractor',
  3000,
  70,
  NULL,
  NULL,
  NULL
),
(
  'staff-team-management-portal',
  'staff_internal_announcements_broadcast',
  'Internal Team Notice Board, Company Broadcasts & Push Alerts',
  'Internal Comms',
  'Company-wide digital bulletin board for broadcasting policy updates, shift change alerts, holiday schedules, and team recognition.',
  'Announcement feeds with read-receipt confirmations, priority pinning, and email/SMS broadcast triggers.',
  'Ensures 100% of staff members receive and acknowledge critical operational announcements.',
  'Standard',
  true,
  5,
  'Company notice board with read-receipt tracking & priority announcements',
  2000,
  50,
  NULL,
  NULL,
  NULL
),
(
  'staff-team-management-portal',
  'staff_timesheets_clockin_geolocation',
  'Digital Clock-In / Clock-Out Timesheets with Geolocation Verification',
  'Timesheets & Attendance',
  'Mobile-friendly digital punch clock where staff can log shift starts, breaks, and shift ends, with optional GPS geolocation verification.',
  'Browser Geolocation API coordinate capture against workplace geofence radius, timesheet database records, and duration calculations.',
  'Eliminates time theft and buddy punching with verified real-time digital attendance records.',
  'Advanced',
  true,
  6,
  'Digital mobile clock-in punch clock with GPS geolocation verification',
  3000,
  80,
  NULL,
  NULL,
  NULL
),
(
  'staff-team-management-portal',
  'staff_payroll_summary_csv_export',
  'Automated Work-Hour Summary & 1-Click Payroll CSV Export',
  'Payroll & Operations',
  'Automated aggregation of regular hours, overtime, and approved leaves formatted for 1-click export into Excel or accounting software (Tally, QuickBooks, Gusto).',
  'SQL aggregation queries calculating total shift hours, hourly rate multiplication, and formatted CSV report generator.',
  'Reduces month-end payroll preparation time from hours down to a single click with zero math errors.',
  'Standard',
  true,
  7,
  'Automated employee work-hour summaries & 1-click payroll CSV export',
  2500,
  60,
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
-- SEED DATA: TABLE 5 (package_3d_experience_features)
-- Delta Price: ₹35,000 INR | $800 USD (Includes ₹14,999 Base -> Total ₹49,999 / $1,299)
-- Sum: 8000+6000+5000+5500+4000+3000+2000+1500 = 35,000 INR | 180+140+110+130+90+70+50+30 = $800 USD
-- ==============================================================================
INSERT INTO public.package_3d_experience_features 
  (package_id, function_key, title, category, description, technical_deliverables, business_impact, complexity, is_core, display_order, included_limit, feature_price_inr, feature_price_usd, overage_unit_label, overage_price_inr, overage_price_usd)
VALUES
(
  'interactive-3d-experience',
  'threed_threejs_webgl_canvas_engine',
  'Custom Three.js / WebGL 3D Interactive Canvas Engine',
  '3D Core Architecture',
  'Bespoke WebGL render canvas powered by Three.js, supporting real-time camera manipulation, smooth mouse parallax, and responsive viewport sizing.',
  'Three.js WebGLRenderer, PerspectiveCamera, OrbitControls with smooth inertia damping, dynamic pixelRatio clamp (1-2), and requestAnimationFrame render loop.',
  'Establishes immediate high-tech prestige, commanding top-tier brand positioning and industry recognition.',
  'Specialized',
  true,
  1,
  'Full interactive Three.js WebGL canvas architecture with smooth camera damping',
  8000,
  180,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_particle_fluid_glsl_shaders',
  'Interactive Particle Field & Fluid Physics GLSL Shaders',
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
  'threed_camera_scrollytelling_choreography',
  'Cinematic Camera Choreography & Scroll-Synced Orbit',
  '3D Camera & Motion',
  'Cinematic camera paths and focal-point rotations mathematically synchronized to page scroll position (scrollytelling) and subtle mouse parallax.',
  'Lenis smooth scroll integration, Three.js CatmullRomCurve3 spline interpolation, damping orbit controls, and smooth lerp calculations.',
  'Turns passive browsing into an active, cinematic journey that guides the user through your product narrative.',
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
),
-- Extra Included Micro-Features
(
  'interactive-3d-experience',
  'threed_material_color_customizer',
  'Interactive Real-Time Material & Color Finish Customizer',
  '3D Interactivity',
  'Interactive client-side colorway and material finish switcher (e.g. Chrome, Matte Black, Frosted Glass, Rose Gold) updating 3D PBR materials instantaneously.',
  'Dynamic material color tweening with Three.js Color.lerp, material roughness/metalness state machine, and swatch UI selector.',
  'Allows clients and customers to preview custom product finishes in real time, increasing purchase confidence.',
  'Advanced',
  true,
  9,
  'Real-time 3D product material and colorway customizer',
  0,
  0,
  NULL,
  NULL,
  NULL
),
(
  'interactive-3d-experience',
  'threed_loading_progress_experience',
  'Branded 3D Preloader & Asset Percentage Progress Bar',
  '3D UX & Performance',
  'Luxury branded preloading screen with asset percentage counter and animated spinner, ensuring zero visual pop-in before the 3D scene is fully cached.',
  'Three.js LoadingManager onProgress callback hook, smooth percentage interpolation, and fade-out scene reveal transition.',
  'Eliminates blank screens while 3D meshes and textures download, giving visitors a polished, AAA game-style intro.',
  'Standard',
  true,
  10,
  'Branded 3D asset preloader with real-time percentage progress counter',
  0,
  0,
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
-- SEED DATA: TABLE 6 (package_fullstack_backend_features)
-- Delta Price: ₹65,000 INR | $1,400 USD (Includes ₹14,999 Base -> Total ₹79,999 / $1,899)
-- Sum: 12000+10000+8000+7000+8000+10000+3500+3000+2000+1500 = 65,000 INR | 260+220+180+160+180+220+70+60+50+30 = $1,430 -> Adjusted: 260+220+180+150+170+220+70+50+50+30 = $1,400 USD
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
  'backend_row_level_security_rls_policies',
  'Granular Row-Level Security (RLS) & Tenant Isolation',
  'Security & Compliance',
  'Bulletproof data privacy where users can only read and write their own data, verified cryptographically at the database layer (not just in client code).',
  'PostgreSQL RLS policies on all tables, auth.uid() session verification, and service_role security overrides.',
  'Prevents catastrophic data leaks and guarantees multi-tenant enterprise data privacy compliance.',
  'Enterprise',
  true,
  2,
  'Comprehensive Row-Level Security (RLS) isolation on every table',
  10000,
  220,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_multiprovider_auth_session_system',
  'Multi-Provider Authentication & Session Security',
  'Authentication',
  'Secure user authentication supporting Email/Password, Google OAuth, GitHub, and passwordless Magic Links with JWT refresh token rotation.',
  'Supabase Auth GoTrue engine, HTTP-only secure session cookies, PKCE OAuth flow, and automated user onboarding trigger.',
  'Provides users a frictionless, modern login experience while eliminating credential stuffing vulnerabilities.',
  'Advanced',
  true,
  3,
  'Multi-provider authentication suite (Google, GitHub, Email, Magic Link)',
  8000,
  180,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_stripe_payment_webhook_engine',
  'Payment Webhook Engine & Subscription Billing (Stripe / Razorpay)',
  'Payments & Billing',
  'Production billing integration handling one-off orders, recurring subscriptions, failed payment recovery, tax invoices, and real-time webhook listeners.',
  'Stripe / Razorpay webhooks listener, cryptographic signature verification, idempotent event processing, and subscription lifecycle management.',
  'Monetizes your SaaS or platform on autopilot with zero missed billing events or sync errors.',
  'Specialized',
  true,
  4,
  'Production payment webhook engine with recurring subscription lifecycle',
  7000,
  150,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_selfserve_client_portal',
  'Client Self-Serve Portal & Live Project Hub',
  'Client Experience',
  'Dedicated private portal where clients view their purchased packages, track project milestones, download invoices, request changes, and execute contracts.',
  'Client-facing dashboard layout, milestone progress bars, interactive change request log, and digital e-signature pad with canvas capture.',
  'Delivers a world-class client onboarding experience that eliminates 90% of status check emails and phone calls.',
  'Enterprise',
  true,
  5,
  'Private client self-serve portal with milestone tracking & e-contracts',
  8000,
  170,
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
  50,
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
),
-- Extra Included Micro-Features
(
  'fullstack-web-app',
  'backend_automated_daily_backup_snapshots',
  'Automated Daily Database Snapshots & Point-in-Time Recovery',
  'DevOps & Reliability',
  'Automated daily PostgreSQL database snapshots with 30-day retention and point-in-time restore capability, guarding against accidental data loss.',
  'Automated Supabase backup retention scripts, encrypted storage archives, and 1-click restore protocol.',
  'Guarantees zero catastrophe downtime or lost customer data in unexpected outage events.',
  'Advanced',
  true,
  11,
  'Automated daily database snapshot backups with 30-day retention',
  0,
  0,
  NULL,
  NULL,
  NULL
),
(
  'fullstack-web-app',
  'backend_activity_log_export_csv',
  '1-Click CSV & Excel Export for Leads, Orders & Audit Records',
  'Reporting & Data Portability',
  'Instant client and admin CSV / XLSX export for leads, transactions, customer lists, and audit records with customizable date-range filters.',
  'Client-side Blob export generator with UTF-8 BOM encoding for seamless Excel / Numbers spreadsheet compatibility.',
  'Empowers founders to run custom offline financial analysis and integrate directly with accounting teams.',
  'Standard',
  true,
  12,
  '1-click CSV & Excel spreadsheet export for all platform tables',
  0,
  0,
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
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR ALL 6 TABLES
-- ==============================================================================
ALTER TABLE public.package_landing_sprint_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bofu_marketing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_booking_engine_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_staff_portal_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_3d_experience_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_fullstack_backend_features ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow clients & visitors to view features)
DROP POLICY IF EXISTS "Public read on landing sprint features" ON public.package_landing_sprint_features;
CREATE POLICY "Public read on landing sprint features" 
  ON public.package_landing_sprint_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on bofu marketing features" ON public.package_bofu_marketing_features;
CREATE POLICY "Public read on bofu marketing features" 
  ON public.package_bofu_marketing_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on booking engine features" ON public.package_booking_engine_features;
CREATE POLICY "Public read on booking engine features" 
  ON public.package_booking_engine_features FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read on staff portal features" ON public.package_staff_portal_features;
CREATE POLICY "Public read on staff portal features" 
  ON public.package_staff_portal_features FOR SELECT TO anon, authenticated USING (true);

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

DROP POLICY IF EXISTS "Admin manage booking engine features" ON public.package_booking_engine_features;
CREATE POLICY "Admin manage booking engine features" 
  ON public.package_booking_engine_features FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin manage staff portal features" ON public.package_staff_portal_features;
CREATE POLICY "Admin manage staff portal features" 
  ON public.package_staff_portal_features FOR ALL TO authenticated 
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
-- For seamless unified querying across all 6 separate tables
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
  'package_booking_engine_features' AS source_table,
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
FROM public.package_booking_engine_features f
JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT 
  f.id,
  f.package_id,
  p.name AS package_name,
  p.price_usd,
  p.price_inr,
  'package_staff_portal_features' AS source_table,
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
FROM public.package_staff_portal_features f
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
