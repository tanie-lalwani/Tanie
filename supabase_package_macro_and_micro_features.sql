-- ==============================================================================
-- SUPABASE MIGRATION: PACKAGES, MACRO FEATURES & EXPANDABLE MICRO FEATURES
-- ==============================================================================

-- 1. Create Macro Features Table
CREATE TABLE IF NOT EXISTS public.package_macro_features (
  id TEXT PRIMARY KEY,
  package_id TEXT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  is_essential BOOLEAN NOT NULL DEFAULT TRUE,
  price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Micro Features Table
CREATE TABLE IF NOT EXISTS public.package_micro_features (
  id TEXT PRIMARY KEY,
  macro_id TEXT NOT NULL REFERENCES public.package_macro_features(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tag TEXT DEFAULT NULL,
  detail TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_macro_pkg ON public.package_macro_features(package_id);
CREATE INDEX IF NOT EXISTS idx_micro_macro ON public.package_micro_features(macro_id);
CREATE INDEX IF NOT EXISTS idx_micro_pkg ON public.package_micro_features(package_id);

-- Enable RLS
ALTER TABLE public.package_macro_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_micro_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read macro features" ON public.package_macro_features FOR SELECT USING (true);
CREATE POLICY "Public read micro features" ON public.package_micro_features FOR SELECT USING (true);

-- ==============================================================================
-- SEED DATA: ALL 6 PACKAGES, 42 MACRO-FEATURES & 131 MICRO-FEATURES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PACKAGE 1: LUXURY LANDING SPRINT (BASE FOUNDATION)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('ls_macro_core_arch', 'luxury-landing-sprint', 'Core Responsive Architecture & Luxury Layout', 'Architecture & Performance', '🏛️', 'Mobile-first responsive layout with server-rendered Next.js App Router DOM, zero layout shift, and Vercel edge deployment.', TRUE, 1500, 30, 1),
('ls_macro_motion', 'luxury-landing-sprint', 'Typography, Fluid Motion & Aesthetics', 'Visual Design & UX', '✨', 'Kinetic typography, smooth momentum scrolling with Lenis, and subtle micro-interactions that communicate luxury.', TRUE, 1000, 20, 2),
('ls_macro_conversion', 'luxury-landing-sprint', 'Lead Capture & Conversion System', 'Conversion Infrastructure', '🎯', 'High-converting inquiry forms with real-time validation, instant email alerts to your inbox, and direct WhatsApp routing.', TRUE, 800, 16, 3),
('ls_macro_accessibility', 'luxury-landing-sprint', 'Accessibility & Inclusive Design', 'Usability & Compliance', '♿', 'Inclusive design accommodating all users with multi-language switching, theme toggles, font scaling, and screen-reader compliance.', FALSE, 600, 12, 4),
('ls_macro_seo', 'luxury-landing-sprint', 'SEO, Meta Architecture & Social Sharing', 'Organic Discovery', '🔍', 'Complete search engine optimization with OpenGraph preview cards, automated XML sitemaps, and rich schema markup.', FALSE, 600, 12, 5),
('ls_macro_compliance', 'luxury-landing-sprint', 'Compliance & Visitor Utilities', 'Trust & Legal', '🛡️', 'GDPR/CCPA cookie consent management, sticky scroll-to-top buttons, and smart clipboard copy interactions.', FALSE, 499, 9, 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('ls_micro_1', 'ls_macro_core_arch', 'luxury-landing-sprint', 'Bespoke Mobile, Tablet & 4K Breakpoints', 'Responsive', 'Tailored viewport layouts with precision padding for phones, tablets, and ultra-wide screens.', 1),
('ls_micro_2', 'ls_macro_core_arch', 'luxury-landing-sprint', 'Next.js App Router SSR DOM', 'Engine', 'Static and server-rendered hydration eliminating content flash and maximizing SEO visibility.', 2),
('ls_micro_3', 'ls_macro_core_arch', 'luxury-landing-sprint', 'Edge CDN Global Caching', 'Speed', 'Sub-100ms global static asset delivery via Vercel & Cloudflare Edge network.', 3),
('ls_micro_4', 'ls_macro_core_arch', 'luxury-landing-sprint', 'Strict SSL / TLS & Automated DNS Setup', 'Security', 'Production HTTPS certificate provisioning with custom domain DNS record verification.', 4),
('ls_micro_5', 'ls_macro_motion', 'luxury-landing-sprint', 'Curated Google / Typekit Font Pairings', 'Typography', 'Editorial typographic hierarchy with zero FOIT (flash of invisible text) preloads.', 5),
('ls_micro_6', 'ls_macro_motion', 'luxury-landing-sprint', 'Smooth Lenis Momentum Scroll', 'Motion', 'Hardware-accelerated inertia scroll preventing jittery trackpad or wheel movement.', 6),
('ls_micro_7', 'ls_macro_motion', 'luxury-landing-sprint', 'IntersectionObserver Reveal Animations', 'Animation', 'Scroll-triggered staggered text reveals and card fades without CPU overhead.', 7),
('ls_micro_8', 'ls_macro_motion', 'luxury-landing-sprint', 'Magnetic Button Pull & Cursor Physics', 'Micro-UX', 'Tactile spring physics on primary CTA buttons for elevated interactive engagement.', 8),
('ls_micro_9', 'ls_macro_conversion', 'luxury-landing-sprint', 'Asynchronous Contact Form with Client Validation', 'Forms', 'Frictionless form with inline error prevention and zero-page-reload submission.', 9),
('ls_micro_10', 'ls_macro_conversion', 'luxury-landing-sprint', 'Instant Email Dispatcher to Business Owner', 'Alerts', 'Automated Resend / SendGrid notification delivering full lead details to your inbox in 2 seconds.', 10),
('ls_micro_11', 'ls_macro_conversion', 'luxury-landing-sprint', 'WhatsApp Direct Floating Action Button', 'Messaging', 'One-tap pre-filled chat link opening WhatsApp with your pre-set greeting message.', 11),
('ls_micro_12', 'ls_macro_conversion', 'luxury-landing-sprint', 'Custom Thank-You State & Lead Confirmation', 'Conversion', 'Branded interactive confirmation toast reassuring prospects their inquiry was safely received.', 12),
('ls_micro_13', 'ls_macro_accessibility', 'luxury-landing-sprint', 'Multi-Language Localization Framework (i18n)', 'Language', 'Language switcher allowing international visitors to toggle between languages with URL persistence.', 13),
('ls_micro_14', 'ls_macro_accessibility', 'luxury-landing-sprint', 'Dark / Light Mode Aesthetic Theme Switcher', 'Theme', 'Smooth color transition toggle with system preference auto-detection and localStorage save.', 14),
('ls_micro_15', 'ls_macro_accessibility', 'luxury-landing-sprint', 'Dynamic Fluid Typography Scaling', 'Font', 'Client font-size adjustment controls (+A / -A) for effortless reading without breaking layout.', 15),
('ls_micro_16', 'ls_macro_accessibility', 'luxury-landing-sprint', 'WCAG 2.1 AAA Screen Reader Landmarks', 'Compliance', 'Semantic ARIA roles, skip-to-content links, and focus rings for complete keyboard accessibility.', 16),
('ls_micro_17', 'ls_macro_accessibility', 'luxury-landing-sprint', 'Reduced Motion Mode', 'Accessibility', 'Automatically disables motion effects when visitor has OS ''prefers-reduced-motion'' enabled.', 17),
('ls_micro_18', 'ls_macro_seo', 'luxury-landing-sprint', 'OpenGraph & Twitter Card Dynamic Previews', 'Social', 'High-res branded card previews when shared on WhatsApp, iMessage, Twitter, and LinkedIn.', 18),
('ls_micro_19', 'ls_macro_seo', 'luxury-landing-sprint', 'Automated XML Sitemap & Robots.txt', 'Indexing', 'Self-updating sitemap indexing all canonical routes for Google Search Console crawlers.', 19),
('ls_micro_20', 'ls_macro_seo', 'luxury-landing-sprint', 'Organization JSON-LD Rich Schema', 'Schema', 'Structured data telling Google your business name, logo, phone, address, and operating hours.', 20),
('ls_micro_21', 'ls_macro_seo', 'luxury-landing-sprint', 'Semantic Heading H1-H6 Hierarchy', 'On-Page', 'Strict single-H1 semantic structure with keyword-optimized section hierarchy and image alt tags.', 21),
('ls_micro_22', 'ls_macro_compliance', 'luxury-landing-sprint', 'GDPR & CCPA Glassmorphic Cookie Consent Banner', 'Privacy', 'Polished banner with granular Accept / Reject / Preferences options and consent storage.', 22),
('ls_micro_23', 'ls_macro_compliance', 'luxury-landing-sprint', 'Sticky Scroll-to-Top Floating Button', 'Navigation', 'Appears smoothly after 400px of scrolling with dynamic circular scroll-depth progress ring.', 23),
('ls_micro_24', 'ls_macro_compliance', 'luxury-landing-sprint', 'Smart Copy-to-Clipboard Interactions', 'Micro-UX', 'Clicking your email or phone number copies it instantly with a tactile ''Copied!'' tooltip.', 24)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- PACKAGE 2: BOFU WEBSITE MARKETING & SOURCES (INDEPENDENT PACKAGE)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('gm_macro_foundation', 'growth-marketing-campaigns', 'Luxury Landing Sprint Foundation (Included)', 'Base Architecture', '🏛️', 'Includes the entire Luxury Landing Sprint foundation (₹4,999 value) built directly under your marketing funnels.', TRUE, 4999, 99, 1),
('gm_macro_checkout', 'growth-marketing-campaigns', 'Frictionless 1-Click Express Checkout & Payments', 'Revenue & Checkout', '💳', 'Zero-friction single-page checkout supporting Apple Pay, Google Pay, UPI, and credit cards with instant order fulfillment.', TRUE, 3500, 90, 2),
('gm_macro_urgency', 'growth-marketing-campaigns', 'High-Conversion Urgency & Scarcity Mechanics', 'Psychological Triggers', '⚡', 'Dynamic countdown timers, top announcement bars, and stock meters that compel visitors to take action immediately.', TRUE, 3000, 80, 3),
('gm_macro_attribution', 'growth-marketing-campaigns', 'Full-Spectrum UTM Multi-Source Attribution', 'Analytics & Telemetry', '📊', 'Captures source, medium, and campaign parameters with every order and passes server-side conversion pixels to Meta and Google.', TRUE, 3000, 80, 4),
('gm_macro_ugc', 'growth-marketing-campaigns', 'Social Proof & UGC Video Review Wall', 'Social Trust', '📹', 'Mobile-optimized vertical TikTok / Reel video testimonials wall with customer star ratings and before/after comparisons.', FALSE, 1500, 40, 5),
('gm_macro_comparison', 'growth-marketing-campaigns', 'Interactive Product 360 & Comparison Matrix', 'Product Presentation', '🔄', 'Interactive 4K multi-angle viewer and value-anchoring comparison table establishing your offering as superior to alternatives.', FALSE, 1500, 40, 6),
('gm_macro_ai_concierge', 'growth-marketing-campaigns', 'AI Sales Concierge Bot', 'AI Sales Agent', '🤖', '24/7 intelligent sales assistant that answers buyer questions, handles objections, and guides prospects directly to checkout.', FALSE, 1500, 40, 7),
('gm_macro_multilingual', 'growth-marketing-campaigns', 'Multi-Lingual International Localization (i18n)', 'Global Reach', '🌍', 'Language switcher supporting up to 3 global languages with localized currency and Right-to-Left (RTL) support.', FALSE, 1000, 30, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('gm_micro_0a', 'gm_macro_foundation', 'growth-marketing-campaigns', 'Complete Next.js App Router Architecture', 'Core', 'Full SSR foundation with edge hosting and CDN delivery.', 1),
('gm_micro_0b', 'gm_macro_foundation', 'growth-marketing-campaigns', 'Responsive Layout & Typography System', 'Core', 'Curated typography with 95+ Lighthouse speed benchmarks.', 2),
('gm_micro_0c', 'gm_macro_foundation', 'growth-marketing-campaigns', 'Lead Capture & Contact Engine', 'Core', 'Asynchronous forms with instant notifications to owner.', 3),
('gm_micro_1', 'gm_macro_checkout', 'growth-marketing-campaigns', 'Multi-Gateway Checkout (Apple Pay, Google Pay, Cards)', 'Payment', 'Stripe & Razorpay integrated single-page checkout with native mobile wallet buttons.', 4),
('gm_micro_2', 'gm_macro_checkout', 'growth-marketing-campaigns', 'Dynamic Tax & Discount Coupon Engine', 'Promo', 'Real-time promo code validator with automated percent or flat discount calculation.', 5),
('gm_micro_3', 'gm_macro_checkout', 'growth-marketing-campaigns', 'Abandoned Checkout Recovery Hook', 'Recovery', 'Captures partial email and cart contents to trigger automated abandoned cart recovery.', 6),
('gm_micro_4', 'gm_macro_checkout', 'growth-marketing-campaigns', 'Instant Digital Fulfillment Handshake', 'Order', 'Immediate redirect to order confirmation with downloadable receipts and delivery tracking.', 7),
('gm_micro_5', 'gm_macro_urgency', 'growth-marketing-campaigns', 'Real-Time Flash Sale Countdown Clocks', 'Urgency', 'Localized drop timers showing hours, minutes, and seconds remaining in flash campaign.', 8),
('gm_micro_6', 'gm_macro_urgency', 'growth-marketing-campaigns', 'Sticky Offer-First Announcement Bar', 'Banner', 'Top header banner with 1-click coupon code copy and free shipping progress meter.', 9),
('gm_micro_7', 'gm_macro_urgency', 'growth-marketing-campaigns', 'Dynamic Low-Stock Inventory Indicators', 'Scarcity', 'Urgency badges (''Only 3 left in stock!'') that dynamically deplete based on purchase volume.', 10),
('gm_micro_8', 'gm_macro_urgency', 'growth-marketing-campaigns', 'Live Social-Proof Purchase Toasts', 'Social Proof', 'Subtle popups showing recent orders from real cities to validate buyer trust.', 11),
('gm_micro_9', 'gm_macro_attribution', 'growth-marketing-campaigns', 'URL Parameter Parser (UTM Source, Medium, Campaign)', 'Attribution', 'Automatically extracts marketing query params and persists them across the entire visitor session.', 12),
('gm_micro_10', 'gm_macro_attribution', 'growth-marketing-campaigns', 'Persistent 30-Day Cookie Source Binding', 'Tracking', 'Binds origin campaign to checkout payload even if visitor returns weeks later.', 13),
('gm_micro_11', 'gm_macro_attribution', 'growth-marketing-campaigns', 'Meta Pixel & CAPI Server-Side Telemetry', 'Pixels', 'Direct Graph API server-side event transmission bypassing ad blockers for accurate ROAS.', 14),
('gm_micro_12', 'gm_macro_attribution', 'growth-marketing-campaigns', 'GA4 & Google Tag Manager DataLayer Events', 'Analytics', 'Structured e-commerce events (view_item, begin_checkout, purchase) pushed to DataLayer.', 15),
('gm_micro_13', 'gm_macro_ugc', 'growth-marketing-campaigns', 'Vertical Reel/TikTok Video Player', 'Video', 'Fast-loading muted vertical video player with tap-to-unmute and carousel sliding.', 16),
('gm_micro_14', 'gm_macro_ugc', 'growth-marketing-campaigns', 'Verified Customer Star Rating Filters', 'Reviews', 'Breakdown of 5-star reviews with keyword filtering (Quality, Speed, Customer Service).', 17),
('gm_micro_15', 'gm_macro_ugc', 'growth-marketing-campaigns', 'Before & After Interactive Split Slider', 'Visual', 'Draggable divider showing transformative client results side-by-side.', 18),
('gm_micro_16', 'gm_macro_comparison', 'growth-marketing-campaigns', '4K Multi-Angle Product Zoomer', '360 Viewer', 'Drag-to-rotate multi-frame product viewer with high-resolution lens zoom on hover.', 19),
('gm_micro_17', 'gm_macro_comparison', 'growth-marketing-campaigns', 'Side-by-Side Value-Anchoring Matrix', 'Comparison', 'Clear checkmark vs X comparison matrix highlighting your unique advantages over competitors.', 20),
('gm_micro_18', 'gm_macro_comparison', 'growth-marketing-campaigns', 'Live Variant & Material Switcher', 'Variants', 'Instant swap of product photos and pricing based on selected color or bundle size.', 21),
('gm_micro_19', 'gm_macro_ai_concierge', 'growth-marketing-campaigns', '24/7 Context-Aware Sales Assistant', 'AI Bot', 'Trained on your specific product catalogs, FAQs, warranties, and pricing tiers.', 22),
('gm_micro_20', 'gm_macro_ai_concierge', 'growth-marketing-campaigns', 'Automated Objection Handling Engine', 'Closing', 'Pre-programmed objection handling for shipping times, refund guarantees, and sizing questions.', 23),
('gm_micro_21', 'gm_macro_ai_concierge', 'growth-marketing-campaigns', 'Direct In-Chat 1-Click Checkout Routing', 'Sales', 'Recommends relevant packages and generates a direct checkout link inside the conversation.', 24),
('gm_micro_22', 'gm_macro_multilingual', 'growth-marketing-campaigns', 'Multi-Language Header Switcher', 'i18n', 'Seamless toggle supporting English, Arabic, Spanish, or your chosen regional languages.', 25),
('gm_micro_23', 'gm_macro_multilingual', 'growth-marketing-campaigns', 'Right-to-Left (RTL) Mirroring Architecture', 'RTL', 'Complete layout mirroring support for Arabic and Urdu typography and navigation.', 26),
('gm_micro_24', 'gm_macro_multilingual', 'growth-marketing-campaigns', 'Localized Currency Formatting', 'Currency', 'Automatically presents figures in INR (₹), USD ($), EUR (€), or AED based on visitor country.', 27)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- PACKAGE 3: SMART APPOINTMENT & BOOKING ENGINE (INDEPENDENT PACKAGE)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('bk_macro_foundation', 'booking-appointments-engine', 'Luxury Landing Sprint Foundation (Included)', 'Base Architecture', '🏛️', 'Includes the entire Luxury Landing Sprint foundation (₹4,999 value) as the baseline for your booking portal.', TRUE, 4999, 99, 1),
('bk_macro_slot_picker', 'booking-appointments-engine', 'Interactive Live Slot Availability Engine', 'Calendar Engine', '📅', 'Real-time calendar slot blocking with timezone auto-detection, custom meeting buffers, and operational hours.', TRUE, 3500, 90, 2),
('bk_macro_calendar_sync', 'booking-appointments-engine', 'Bidirectional 2-Way Calendar Synchronization', 'Calendar API', '🔄', 'Google Calendar and Outlook 2-way sync that automatically blocks booked slots and eliminates double-booking.', TRUE, 3000, 80, 3),
('bk_macro_reminders', 'booking-appointments-engine', 'Automated WhatsApp & Email Reminders', 'Notifications', '📱', 'Automated confirmation and 24h/2h reminder sequences that reduce appointment no-shows by up to 80%.', TRUE, 2500, 70, 4),
('bk_macro_payments', 'booking-appointments-engine', 'Deposit & Session Pre-Payment Gateway', 'Payments', '💳', 'Stripe and Razorpay integration requiring clients to pay a mandatory deposit or full fee before confirming.', FALSE, 2500, 70, 5),
('bk_macro_qualification', 'booking-appointments-engine', 'Pre-Appointment Qualification Questionnaire', 'Intake', '📋', 'Multi-step intake questionnaire with file uploads ensuring you only spend time on qualified high-value appointments.', FALSE, 1500, 40, 6),
('bk_macro_multibranch', 'booking-appointments-engine', 'Multi-Branch & Location Routing', 'Location', '🏢', 'Routes appointments across up to 3 physical or virtual clinics/branches with independent calendars and staff mapping.', FALSE, 2000, 50, 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('bk_micro_0a', 'bk_macro_foundation', 'booking-appointments-engine', 'Complete Next.js App Router Architecture', 'Core', 'Full SSR foundation with edge hosting and CDN delivery.', 1),
('bk_micro_0b', 'bk_macro_foundation', 'booking-appointments-engine', 'Mobile Responsive Layout & Typography', 'Core', 'Curated typography with 95+ Lighthouse speed benchmarks.', 2),
('bk_micro_1', 'bk_macro_slot_picker', 'booking-appointments-engine', 'Interactive Calendar Date & Slot Grid', 'Grid', 'Live availability grid showing morning, afternoon, and evening booking slots.', 3),
('bk_micro_2', 'bk_macro_slot_picker', 'booking-appointments-engine', 'Automatic Timezone Detection & Conversion', 'Timezone', 'Converts meeting times to client''s local timezone automatically to prevent confusion.', 4),
('bk_micro_3', 'bk_macro_slot_picker', 'booking-appointments-engine', 'Custom Meeting Buffers & Operating Hours', 'Buffers', 'Configurable buffer gaps (e.g. 15 min cooldown) and holiday blackout dates.', 5),
('bk_micro_4', 'bk_macro_calendar_sync', 'booking-appointments-engine', 'Google Calendar 2-Way API Sync', 'Google', 'Instantly adds bookings to your Google Calendar and blocks dates when you add personal events.', 6),
('bk_micro_5', 'bk_macro_calendar_sync', 'booking-appointments-engine', 'Microsoft Outlook / Office 365 Sync', 'Outlook', 'Synchronizes appointment events with enterprise Outlook calendars in real-time.', 7),
('bk_micro_6', 'bk_macro_calendar_sync', 'booking-appointments-engine', 'Automated .ics Calendar File Attachments', 'iCal', 'Sends Apple / Google Calendar 1-tap add event links in confirmation messages.', 8),
('bk_micro_7', 'bk_macro_reminders', 'booking-appointments-engine', 'Instant Confirmation Email & WhatsApp Dispatch', 'Instant', 'Sends calendar link and appointment details immediately upon slot selection.', 9),
('bk_micro_8', 'bk_macro_reminders', 'booking-appointments-engine', '24-Hour & 2-Hour Pre-Appointment Reminders', 'Reminders', 'Automated reminders sent via WhatsApp Cloud API or Twilio SMS to prevent no-shows.', 10),
('bk_micro_9', 'bk_macro_reminders', 'booking-appointments-engine', '1-Click Client Reschedule & Cancellation Links', 'Self-Serve', 'Self-serve reschedule link freeing up staff from manual appointment coordination.', 11),
('bk_micro_10', 'bk_macro_payments', 'booking-appointments-engine', 'Mandatory Booking Deposit Checkout Step', 'Deposit', 'Requires partial or full prepayment to hold the appointment slot on the calendar.', 12),
('bk_micro_11', 'bk_macro_payments', 'booking-appointments-engine', 'Razorpay, UPI & Stripe Webhook Verification', 'Webhook', 'Cryptographically verifies payment completion before confirming the calendar block.', 13),
('bk_micro_12', 'bk_macro_payments', 'booking-appointments-engine', 'Automated GST / Tax Invoice Receipts', 'Invoice', 'Generates digital PDF receipt with order number and tax breakdown automatically.', 14),
('bk_micro_13', 'bk_macro_qualification', 'booking-appointments-engine', 'Multi-Step Client Brief Questionnaire', 'Form', 'Collects business budget, goals, medical history, or requirements before booking.', 15),
('bk_micro_14', 'bk_macro_qualification', 'booking-appointments-engine', 'Reference File & Document Uploads', 'Uploads', 'Allows clients to attach floor plans, briefs, or medical scans directly into the booking.', 16),
('bk_micro_15', 'bk_macro_qualification', 'booking-appointments-engine', 'Conditional Branching Questions', 'Logic', 'Adapts follow-up questions based on the specific service or treatment selected.', 17),
('bk_micro_16', 'bk_macro_multibranch', 'booking-appointments-engine', 'Up to 3 Physical or Virtual Clinic Branches', 'Branches', 'Allows clients to select their nearest branch or virtual consultation option.', 18),
('bk_micro_17', 'bk_macro_multibranch', 'booking-appointments-engine', 'Branch-Specific Operating Hours & Holidays', 'Schedule', 'Each location manages independent operating days, holidays, and available chairs.', 19),
('bk_micro_18', 'bk_macro_multibranch', 'booking-appointments-engine', 'Doctor / Specialist Assignment per Branch', 'Staff', 'Filters available team members based on the selected clinic location.', 20)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- PACKAGE 4: STAFF & TEAM MANAGEMENT PORTAL (INDEPENDENT PACKAGE)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('st_macro_foundation', 'staff-team-management-portal', 'Luxury Landing Sprint Foundation (Included)', 'Base Architecture', '🏛️', 'Includes the entire Luxury Landing Sprint foundation (₹4,999 value) with enterprise security and mobile responsiveness.', TRUE, 4999, 99, 1),
('st_macro_directory', 'staff-team-management-portal', 'Digital Staff Directory & Role-Based Access Control', 'Team Directory', '👥', 'Searchable employee directory with department categorization, individual profiles, and granular role permissions.', TRUE, 4500, 110, 2),
('st_macro_roster', 'staff-team-management-portal', 'Interactive Weekly Shift Rostering & Scheduling', 'Rostering', '🗓️', 'Drag-and-drop weekly shift calendar builder with automated conflict detection and 1-click roster broadcasting.', TRUE, 4000, 100, 3),
('st_macro_leave', 'staff-team-management-portal', 'Time-Off & Leave Approval Engine', 'Leave Management', '🏖️', 'Self-serve leave requests with 1-click manager approvals and automated roster blocking on approved time off.', TRUE, 3500, 90, 4),
('st_macro_punchclock', 'staff-team-management-portal', 'Mobile GPS Geolocation Punch Clock Timesheets', 'Time Tracking', '⏱️', 'Mobile web punch clock with geofencing verification ensuring staff are physically on-site when clocking in.', FALSE, 3000, 80, 5),
('st_macro_payroll', 'staff-team-management-portal', '1-Click Work-Hour Summary & Payroll CSV Export', 'Payroll', '💵', 'Automated work-hour calculation with overtime tracking and 1-click export to Excel, QuickBooks, or Gusto.', FALSE, 2500, 60, 6),
('st_macro_notices', 'staff-team-management-portal', 'Internal Company Notice Board & Broadcasts', 'Internal Comms', '📢', 'Digital bulletin board for company announcements, safety SOPs, and mandatory read-receipt tracking.', FALSE, 2500, 60, 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('st_micro_0a', 'st_macro_foundation', 'staff-team-management-portal', 'Complete Next.js App Router Architecture', 'Core', 'Full SSR foundation with edge hosting and CDN delivery.', 1),
('st_micro_0b', 'st_macro_foundation', 'staff-team-management-portal', 'Mobile Responsive Layout & Typography', 'Core', 'Curated typography with 95+ Lighthouse speed benchmarks.', 2),
('st_micro_1', 'st_macro_directory', 'staff-team-management-portal', 'Searchable Digital Staff Directory', 'Directory', 'Search team members by name, skill, department, or branch with contact info.', 3),
('st_micro_2', 'st_macro_directory', 'staff-team-management-portal', 'Granular RBAC Security Roles', 'RBAC', 'Dedicated permission tiers: Super Admin, Branch Manager, Staff, and Contractor.', 4),
('st_micro_3', 'st_macro_directory', 'staff-team-management-portal', 'Encrypted Employee Profile Space', 'Security', 'Secure repository for staff certifications, emergency contacts, and contracts.', 5),
('st_micro_4', 'st_macro_roster', 'staff-team-management-portal', 'Weekly & Monthly Shift Calendar Builder', 'Calendar', 'Visual timetable builder displaying morning, evening, and night duty coverage.', 6),
('st_micro_5', 'st_macro_roster', 'staff-team-management-portal', 'Automated Shift Conflict Detection', 'Safety', 'Flags double-booking, back-to-back shifts, or overtime violations automatically.', 7),
('st_micro_6', 'st_macro_roster', 'staff-team-management-portal', '1-Click Roster Publishing & SMS Alerts', 'Publish', 'Broadcasts updated schedules to all staff members with instant notifications.', 8),
('st_micro_7', 'st_macro_leave', 'staff-team-management-portal', 'Staff Self-Serve Time-Off Request Portal', 'Requests', 'Employees submit vacation, sick leave, or personal days with dates and notes.', 9),
('st_micro_8', 'st_macro_leave', 'staff-team-management-portal', 'Manager 1-Click Approve / Decline Action', 'Approval', 'Managers review pending leave requests with team coverage visibility.', 10),
('st_micro_9', 'st_macro_leave', 'staff-team-management-portal', 'Automated Roster Blocking on Leave', 'Auto-Block', 'Prevents managers from assigning shifts to staff during approved leave days.', 11),
('st_micro_10', 'st_macro_punchclock', 'staff-team-management-portal', 'Mobile Web Geofenced Clock-In Punch Clock', 'Punch Clock', '1-tap clock-in/out button running on smartphones with GPS coordinate logging.', 12),
('st_micro_11', 'st_macro_punchclock', 'staff-team-management-portal', 'Branch Geofence Radius Verification', 'Geofence', 'Confirms employee is within 100 meters of the assigned clinic or office branch.', 13),
('st_micro_12', 'st_macro_punchclock', 'staff-team-management-portal', 'Break Time & Meal Tracking', 'Breaks', 'Tracks lunch and rest breaks to compute accurate net productive work hours.', 14),
('st_micro_13', 'st_macro_payroll', 'staff-team-management-portal', 'Automated Regular & Overtime Hour Totals', 'Totals', 'Computes total billable hours per employee across weekly or monthly pay periods.', 15),
('st_micro_14', 'st_macro_payroll', 'staff-team-management-portal', '1-Click Payroll CSV / Excel Export', 'Export', 'Pre-formatted spreadsheet download ready for your accountant or payroll software.', 16),
('st_micro_15', 'st_macro_payroll', 'staff-team-management-portal', 'Timesheet Dispute & Edit Audit Trail', 'Audit', 'Managers can adjust missed punches with complete audit timestamp logging.', 17),
('st_micro_16', 'st_macro_notices', 'staff-team-management-portal', 'Priority Company Announcement Feed', 'Broadcast', 'Broadcasts operational changes, updates, and milestones to all employees.', 18),
('st_micro_17', 'st_macro_notices', 'staff-team-management-portal', 'Mandatory Read-Receipt Tracking', 'Receipts', 'Shows managers which staff members have read and acknowledged critical notices.', 19),
('st_micro_18', 'st_macro_notices', 'staff-team-management-portal', 'Pinned SOP & Safety Document Downloads', 'Docs', 'Central hub for downloadable clinic protocols, policy manuals, and guidelines.', 20)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- PACKAGE 5: 3D INTERACTIVE & BRAND EXPERIENCE (INDEPENDENT PACKAGE)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('td_macro_foundation', 'interactive-3d-experience', 'Luxury Landing Sprint Foundation (Included)', 'Base Architecture', '🏛️', 'Includes the entire Luxury Landing Sprint foundation (₹4,999 value) with high-speed Next.js edge deployment.', TRUE, 4999, 99, 1),
('td_macro_webgl', 'interactive-3d-experience', 'High-Performance WebGL / Three.js 3D Canvas', '3D Canvas Engine', '🎨', 'Three.js WebGL viewport with DRACO compression, studio HDRI lighting, and smooth dampening orbit controls.', TRUE, 12000, 280, 2),
('td_macro_choreography', 'interactive-3d-experience', 'Scroll-Driven 3D Camera Choreography', 'Storytelling', '🎬', 'Pinned camera trajectory along scroll position with cinematic keyframes and clickable annotation hotspots.', TRUE, 9000, 200, 3),
('td_macro_customizer', 'interactive-3d-experience', 'Interactive Real-Time Material & Color Switcher', '3D Customization', '🎨', 'Interactive UI controls allowing visitors to swap model colors, textures, and metallic finishes in real-time.', FALSE, 5000, 120, 4),
('td_macro_audio', 'interactive-3d-experience', 'Ambient Spatial Audio & Haptic Sound Design', 'Audio Immersion', '🎵', 'Interactive procedural sound design, click feedback, and spatial audio positioning engaging the visitor''s senses.', FALSE, 4500, 100, 5),
('td_macro_mobile', 'interactive-3d-experience', 'Mobile Gyroscope Controls & 60fps Thermal Guard', 'Mobile Performance', '📱', 'Smartphone gyroscope tilt controls paired with dynamic resolution scaling maintaining solid 60fps without battery drain.', FALSE, 4500, 100, 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('td_micro_0a', 'td_macro_foundation', 'interactive-3d-experience', 'Complete Next.js App Router Architecture', 'Core', 'Full SSR foundation with edge hosting and CDN delivery.', 1),
('td_micro_0b', 'td_macro_foundation', 'interactive-3d-experience', 'Mobile Responsive Layout & Typography', 'Core', 'Curated typography with 95+ Lighthouse speed benchmarks.', 2),
('td_micro_1', 'td_macro_webgl', 'interactive-3d-experience', 'Three.js / React Three Fiber Viewport', 'Three.js', 'GPU-accelerated 3D canvas with PBR photorealistic materials and reflections.', 3),
('td_micro_2', 'td_macro_webgl', 'interactive-3d-experience', 'DRACO & KTX2 Asset Compression Pipeline', 'Optimization', 'Reduces 3D file sizes by up to 85% for lightning-fast asset downloads.', 4),
('td_micro_3', 'td_macro_webgl', 'interactive-3d-experience', 'Studio HDRI Environment Map Lighting', 'Lighting', 'Cinematic image-based lighting creating ultra-realistic reflections and depth.', 5),
('td_micro_4', 'td_macro_webgl', 'interactive-3d-experience', 'Smooth OrbitControls with Angle Constraints', 'Controls', 'Tactile mouse/touch rotation with inertia and bounded angles preventing clipping.', 6),
('td_micro_5', 'td_macro_choreography', 'interactive-3d-experience', 'GSAP ScrollTrigger Pinned 3D Timeline', 'Timeline', 'Ties camera orbit coordinates and model rotation directly to page scroll progress.', 7),
('td_micro_6', 'td_macro_choreography', 'interactive-3d-experience', 'Cinematic Keyframe Camera Transitions', 'Cinematic', 'Flawless transitions between macro close-ups, exploded views, and overview angles.', 8),
('td_micro_7', 'td_macro_choreography', 'interactive-3d-experience', 'Interactive 3D Hotspot Annotation Pins', 'Hotspots', 'Clickable pulsating 3D markers revealing product specifications and feature callouts.', 9),
('td_micro_8', 'td_macro_customizer', 'interactive-3d-experience', 'Real-Time Mesh Material Color Switcher', 'Colors', 'Palette picker allowing clients to preview products in different custom colorways.', 10),
('td_micro_9', 'td_macro_customizer', 'interactive-3d-experience', 'Metallic & Roughness Finish Toggles', 'Textures', 'Swaps between matte, gloss, brushed aluminum, and carbon fiber textures.', 11),
('td_micro_10', 'td_macro_customizer', 'interactive-3d-experience', 'Branded Canvas Loading Preloader', 'Preloader', 'Sleek glowing progress bar with decompression counter preventing bounce on load.', 12),
('td_micro_11', 'td_macro_audio', 'interactive-3d-experience', 'Web Audio API Spatial Sound Synthesis', 'Synthesis', 'Ambient low-frequency background drone calibrated to visual aesthetic.', 13),
('td_micro_12', 'td_macro_audio', 'interactive-3d-experience', 'Tactile Haptic Click & Rotation Sound', 'Haptics', 'Subtle micro-audio clicks on button hovers and 3D object rotation.', 14),
('td_micro_13', 'td_macro_audio', 'interactive-3d-experience', 'Persistent Sound Toggle with Waveform', 'Controls', 'Unobtrusive sound control button remembering visitor preference in session.', 15),
('td_micro_14', 'td_macro_mobile', 'interactive-3d-experience', 'DeviceOrientation Gyroscope Tilt Navigation', 'Gyroscope', 'Tilting the phone subtly rotates the 3D model in physical space.', 16),
('td_micro_15', 'td_macro_mobile', 'interactive-3d-experience', 'Adaptive 60fps Thermal & Battery Guard', 'Performance', 'Dynamically scales pixelRatio on frame drops to preserve mobile battery.', 17),
('td_micro_16', 'td_macro_mobile', 'interactive-3d-experience', 'WebGL Context Loss Recovery Handler', 'Resilience', 'Gracefully reinitializes 3D shaders if phone OS suspends memory.', 18)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- PACKAGE 6: FULL-STACK WEB APP / SAAS MVP (INDEPENDENT PACKAGE)
-- ------------------------------------------------------------------------------
INSERT INTO public.package_macro_features (id, package_id, name, category, icon, description, is_essential, price_inr, price_usd, display_order)
VALUES
('fs_macro_foundation', 'fullstack-web-app', 'Luxury Landing Sprint Foundation (Included)', 'Base Architecture', '🏛️', 'Includes the entire Luxury Landing Sprint foundation (₹4,999 value) as the polished public-facing marketing front.', TRUE, 4999, 99, 1),
('fs_macro_db', 'fullstack-web-app', 'Supabase PostgreSQL Relational Database Architecture', 'Database Engineering', '🗄️', 'Normalized relational schema with foreign key constraints, UUID primary keys, and automated timestamp triggers.', TRUE, 15000, 330, 2),
('fs_macro_auth', 'fullstack-web-app', 'Zero-Trust Row-Level Security & Multi-Provider Auth', 'Authentication & Security', '🔐', 'Postgres RLS policies guaranteeing strict tenant isolation, paired with Google OAuth, Magic Links, and session tokens.', TRUE, 14000, 300, 3),
('fs_macro_billing', 'fullstack-web-app', 'Stripe & Razorpay Webhook Billing Engine', 'Payments & Subscriptions', '💳', 'Subscription and recurring billing engine with cryptographic signature verification and automated digital fulfillment.', TRUE, 12000, 260, 4),
('fs_macro_storage', 'fullstack-web-app', 'Encrypted Cloud Storage & Secure Signed Uploads', 'Storage', '☁️', 'Direct-to-storage upload pipeline for avatars, documents, and contracts with time-expiring signed download URLs.', FALSE, 8000, 170, 5),
('fs_macro_rbac', 'fullstack-web-app', 'Role-Based Access Control & Immutable Audit Logging', 'Governance', '🛡️', 'Granular administrative roles with an immutable audit log tracking critical account modifications and financial changes.', FALSE, 6000, 130, 6),
('fs_macro_api_bridge', 'fullstack-web-app', 'External API & Outbound Webhook Dispatcher', 'Integrations', '🔌', 'Exposes secure REST API endpoints with API key authentication or triggers webhooks to Zapier, Make.com, or Slack.', FALSE, 5000, 110, 7),
('fs_macro_backups_export', 'fullstack-web-app', 'Automated Daily Backups & 1-Click CSV Export', 'Operations', '💾', 'Automated daily WAL database snapshots with point-in-time recovery and one-click data table export to CSV & Excel.', FALSE, 5000, 100, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, category = EXCLUDED.category, icon = EXCLUDED.icon,
  description = EXCLUDED.description, is_essential = EXCLUDED.is_essential,
  price_inr = EXCLUDED.price_inr, price_usd = EXCLUDED.price_usd, display_order = EXCLUDED.display_order;

INSERT INTO public.package_micro_features (id, macro_id, package_id, name, tag, detail, display_order)
VALUES
('fs_micro_0a', 'fs_macro_foundation', 'fullstack-web-app', 'Complete Next.js App Router Architecture', 'Core', 'Full SSR foundation with edge hosting and CDN delivery.', 1),
('fs_micro_0b', 'fs_macro_foundation', 'fullstack-web-app', 'Mobile Responsive Layout & Typography', 'Core', 'Curated typography with 95+ Lighthouse speed benchmarks.', 2),
('fs_micro_1', 'fs_macro_db', 'fullstack-web-app', 'Normalized Relational PostgreSQL DDL Schema', 'Schema', 'Production tables with foreign key cascades, unique constraints, and enum types.', 3),
('fs_micro_2', 'fs_macro_db', 'fullstack-web-app', 'B-Tree Indexes & Query Optimization', 'Speed', 'Optimized indexes on frequent query paths guaranteeing sub-20ms database queries.', 4),
('fs_micro_3', 'fs_macro_db', 'fullstack-web-app', 'Automated Updated_at Database Triggers', 'Triggers', 'PL/pgSQL triggers automatically keeping record update timestamps synchronized.', 5),
('fs_micro_4', 'fs_macro_auth', 'fullstack-web-app', 'Zero-Trust Postgres Row-Level Security (RLS)', 'RLS', 'Database-level security policies guaranteeing clients only access their own records.', 6),
('fs_micro_5', 'fs_macro_auth', 'fullstack-web-app', 'Multi-Provider OAuth 2.0 (Google, Magic Link, Email)', 'Auth', 'PKCE auth flow with HTTP-only cookies eliminating token theft vulnerabilities.', 7),
('fs_micro_6', 'fs_macro_auth', 'fullstack-web-app', 'Automated Password Reset & Email Verification', 'Workflows', 'Secure password reset links and automated email verification workflows.', 8),
('fs_micro_7', 'fs_macro_billing', 'fullstack-web-app', 'Recurring Subscriptions & One-Time Payments', 'Billing', 'Handles monthly/annual recurring tiers, plan upgrades, downgrades, and cancellations.', 9),
('fs_micro_8', 'fs_macro_billing', 'fullstack-web-app', 'Cryptographic Webhook Signature Handlers', 'Webhooks', 'Idempotent API webhook handlers with replay protection and transaction integrity.', 10),
('fs_micro_9', 'fs_macro_billing', 'fullstack-web-app', 'Automated Invoice Generation & Customer Portal', 'Portal', 'Self-serve Stripe billing portal where customers download invoices and update cards.', 11),
('fs_micro_10', 'fs_macro_storage', 'fullstack-web-app', 'Encrypted Cloud Storage Buckets with RLS', 'S3 Buckets', 'Secure storage buckets with folder-level permissions preventing unauthorized access.', 12),
('fs_micro_11', 'fs_macro_storage', 'fullstack-web-app', 'Time-Expiring Cryptographic Signed URLs', 'Signed URLs', 'Download links that expire after 15 minutes to keep sensitive files private.', 13),
('fs_micro_12', 'fs_macro_storage', 'fullstack-web-app', 'Client-Side Image Compression & Validation', 'Compression', 'Compresses large files in the browser before upload to save bandwidth and storage.', 14),
('fs_micro_13', 'fs_macro_rbac', 'fullstack-web-app', 'Multi-Tier Role Permissions (Admin, Manager, Member)', 'RBAC', 'Configurable role guards on API routes, dashboard views, and database operations.', 15),
('fs_micro_14', 'fs_macro_rbac', 'fullstack-web-app', 'Immutable Security Audit Log', 'Audit', 'Captures IP address, timestamp, actor, and old/new state for every sensitive change.', 16),
('fs_micro_15', 'fs_macro_rbac', 'fullstack-web-app', 'Team Member Invitation & Role Revocation', 'Invites', 'Email invitation flow allowing organization owners to add team members with roles.', 17),
('fs_micro_16', 'fs_macro_api_bridge', 'fullstack-web-app', 'Outbound Webhook Dispatcher to Zapier & Slack', 'Webhooks', 'Fires instant JSON payloads to external services whenever key business events occur.', 18),
('fs_micro_17', 'fs_macro_api_bridge', 'fullstack-web-app', 'HMAC SHA-256 Payload Signature Signing', 'Signing', 'Cryptographically signs outbound payloads so receiving servers can verify origin.', 19),
('fs_micro_18', 'fs_macro_api_bridge', 'fullstack-web-app', 'Automated HTTP Retry Queue with Backoff', 'Queue', 'Retries failed webhooks with exponential backoff to prevent dropped notifications.', 20),
('fs_micro_19', 'fs_macro_backups_export', 'fullstack-web-app', 'Automated Daily Database Snapshots & PITR', 'Snapshots', 'Automated pg_dump backup archiving with 7-day emergency rollback capability.', 21),
('fs_micro_20', 'fs_macro_backups_export', 'fullstack-web-app', 'One-Click Data Export to CSV & Excel Sheets', 'Export', 'Instant data table download button with CSV formula injection sanitization.', 22),
('fs_micro_21', 'fs_macro_backups_export', 'fullstack-web-app', 'Automated System Health & Error Alerting', 'Monitoring', 'Integrates with error monitors to notify engineers if a database error spikes.', 23)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, tag = EXCLUDED.tag, detail = EXCLUDED.detail, display_order = EXCLUDED.display_order;

-- ==============================================================================
-- CONVENIENCE QUERY VIEW: FLAT DENORMALIZED JOIN (FOR EASY INSPECTION)
-- ==============================================================================
CREATE OR REPLACE VIEW public.view_packages_macro_micro_catalog AS
SELECT 
  p.id AS package_id,
  p.name AS package_name,
  p.badge AS package_badge,
  p.price_inr AS package_price_inr,
  p.price_usd AS package_price_usd,
  p.turnaround_weeks,
  ma.id AS macro_id,
  ma.name AS macro_name,
  ma.category AS macro_category,
  ma.is_essential AS macro_is_essential,
  ma.price_inr AS macro_price_inr,
  ma.price_usd AS macro_price_usd,
  ma.description AS macro_description,
  mi.id AS micro_id,
  mi.name AS micro_name,
  mi.tag AS micro_tag,
  mi.detail AS micro_detail
FROM public.packages p
JOIN public.package_macro_features ma ON p.id = ma.package_id
JOIN public.package_micro_features mi ON ma.id = mi.macro_id
ORDER BY p.price_inr ASC, ma.display_order ASC, mi.display_order ASC;
