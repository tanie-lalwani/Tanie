-- ==============================================================================
-- SUPABASE SCHEMA: CLIENT MANAGEMENT, PACKAGES & LEADS
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (Extends auth.users for Clients & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Website Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  price_usd NUMERIC NOT NULL,
  price_inr NUMERIC NOT NULL,
  turnaround_weeks TEXT NOT NULL,
  badge TEXT,
  popular BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Client Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  company_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  package_id TEXT REFERENCES public.packages(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Discovery' CHECK (status IN ('Discovery', 'Design', 'Development', 'Review', 'Launch', 'Completed', 'On Hold')),
  progress_percent INT DEFAULT 10 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  budget_usd NUMERIC,
  budget_inr NUMERIC,
  target_launch_date DATE,
  live_preview_url TEXT,
  figma_url TEXT,
  github_repo TEXT,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Digital E-Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  scope_summary TEXT NOT NULL,
  total_amount_usd NUMERIC NOT NULL,
  payment_terms TEXT NOT NULL,
  legal_terms TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  signature_url TEXT,
  signature_name TEXT,
  signed_at TIMESTAMPTZ,
  signed_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Project Brand Assets Table
CREATE TABLE IF NOT EXISTS public.project_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('logo', 'brand_assets', 'content_copy', 'images_media', 'design_reference', 'contract', 'general')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Bookings / Leads / Inquiries Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company_name TEXT,
  package_id TEXT REFERENCES public.packages(id) ON DELETE SET NULL,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  estimated_budget_usd NUMERIC,
  timeline_requirement TEXT,
  project_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_client_email ON public.projects(client_email);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON public.contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assets_project_id ON public.project_assets(project_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (SELECT auth.jwt() ->> 'email') IN ('tanielalwani.work@gmail.com', 'admin@tanie.me') OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid()) AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated 
  USING ((SELECT auth.uid()) = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = id OR public.is_admin())
  WITH CHECK ((SELECT auth.uid()) = id OR public.is_admin());

-- 2. Packages Policies (Publicly viewable, Admin manageable)
CREATE POLICY "Anyone can view active packages" ON public.packages
  FOR SELECT TO anon, authenticated 
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3. Projects Policies
CREATE POLICY "Clients can view own projects" ON public.projects
  FOR SELECT TO authenticated 
  USING (
    (SELECT auth.uid()) = client_id OR 
    (SELECT auth.jwt() ->> 'email') = client_email OR 
    public.is_admin()
  );

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Contracts Policies
CREATE POLICY "Clients can view own contracts" ON public.contracts
  FOR SELECT TO authenticated 
  USING (
    (SELECT auth.uid()) = client_id OR 
    (SELECT auth.jwt() ->> 'email') = client_email OR 
    public.is_admin()
  );

CREATE POLICY "Clients can sign own contracts" ON public.contracts
  FOR UPDATE TO authenticated 
  USING (
    (SELECT auth.uid()) = client_id OR 
    (SELECT auth.jwt() ->> 'email') = client_email OR 
    public.is_admin()
  )
  WITH CHECK (
    (SELECT auth.uid()) = client_id OR 
    (SELECT auth.jwt() ->> 'email') = client_email OR 
    public.is_admin()
  );

CREATE POLICY "Admins can manage contracts" ON public.contracts
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Project Assets Policies
CREATE POLICY "Clients can view own project assets" ON public.project_assets
  FOR SELECT TO authenticated 
  USING (
    (SELECT auth.uid()) = client_id OR 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_assets.project_id 
      AND (projects.client_id = (SELECT auth.uid()) OR projects.client_email = (SELECT auth.jwt() ->> 'email'))
    ) OR 
    public.is_admin()
  );

CREATE POLICY "Clients can upload project assets" ON public.project_assets
  FOR INSERT TO authenticated 
  WITH CHECK (
    (SELECT auth.uid()) = client_id OR 
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_assets.project_id 
      AND (projects.client_id = (SELECT auth.uid()) OR projects.client_email = (SELECT auth.jwt() ->> 'email'))
    ) OR 
    public.is_admin()
  );

CREATE POLICY "Clients can delete own project assets" ON public.project_assets
  FOR DELETE TO authenticated 
  USING (
    (SELECT auth.uid()) = client_id OR 
    public.is_admin()
  );

-- 6. Bookings / Leads Policies
CREATE POLICY "Anyone can submit a booking or lead" ON public.bookings
  FOR INSERT TO anon, authenticated 
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view and manage bookings" ON public.bookings
  FOR ALL TO authenticated 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP (For Client Brand Media & Contracts)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-assets', 'client-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Allow authenticated users to upload to client-assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('client-assets', 'contracts'));

CREATE POLICY "Allow public read access to client assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('client-assets', 'contracts'));

-- ==============================================================================
-- SEED STARTER WEBSITE PACKAGES
-- ==============================================================================
INSERT INTO public.packages (id, name, tagline, price_usd, price_inr, turnaround_weeks, badge, popular, description, features, deliverables, addons)
VALUES 
(
  'interactive-3d-experience',
  '3D Interactive & Brand Experience',
  'Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.',
  3499,
  3499,
  '3-5 weeks',
  'Signature',
  true,
  'Designed for visionary brands, high-profile portfolios, and innovative tech products requiring top-tier creative engineering, custom Three.js shaders, and buttery-smooth micro-interactions.',
  '[
    "Custom Three.js / WebGL 3D interactive canvas",
    "Tailored fluid physics, particles, or 3D model integration",
    "Ultra high-performance 60fps rendering & mobile fallback",
    "Sound design & ambient reactive audio integration",
    "Bespoke typography, luxury glassmorphism & dark/light palettes",
    "Full responsive optimization across iOS, Android & Desktop",
    "Next.js / Vite high-speed modern frontend architecture",
    "Full Technical SEO & rich social sharing cards"
  ]'::jsonb,
  '[
    "Custom Interactive Web Experience (Next.js/React + Three.js)",
    "Source code on private GitHub repository",
    "Optimized 3D assets & compressed textures",
    "Vercel/Cloudflare production deployment setup",
    "30-day post-launch hypercare & bug fix warranty"
  ]'::jsonb,
  '[
    {"id": "cms", "name": "Headless CMS (Sanity / Contentful)", "price_usd": 499},
    {"id": "multi-lang", "name": "Multi-language Localization (i18n)", "price_usd": 399},
    {"id": "custom-audio", "name": "Original Sound Effects & Audio Composition", "price_usd": 299},
    {"id": "priority", "name": "Priority Express Delivery (2 weeks)", "price_usd": 799}
  ]'::jsonb
),
(
  'fullstack-web-app',
  'Full-Stack Web App / SaaS MVP',
  'Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.',
  4299,
  4299,
  '4-6 weeks',
  'Full-Stack',
  false,
  'Engineered for startups, digital products, and founders who need a production-ready web application with user auth, real-time database, role permissions, payment gateway, and an executive admin dashboard.',
  '[
    "Next.js App Router full-stack architecture",
    "Supabase PostgreSQL database & Row-Level Security (RLS)",
    "Secure Auth (Email, Google, Magic Link, GitHub)",
    "Stripe / LemonSqueezy / Razorpay payment gateway integration",
    "Comprehensive Admin Dashboard for business metrics & control",
    "Client / User self-serve portal with dashboard views",
    "Real-time updates, file uploads & notification streams",
    "Automated CI/CD pipelines & Vercel deployment"
  ]'::jsonb,
  '[
    "Full-Stack Production Web Application",
    "Complete Database Schema & Supabase migrations",
    "Admin and Client Management Dashboards",
    "Payment Webhook integrations & automated receipts",
    "45-day post-launch hypercare support"
  ]'::jsonb,
  '[
    {"id": "ai-copilot", "name": "Gemini / OpenAI AI Assistant Integration", "price_usd": 599},
    {"id": "analytics-suite", "name": "Advanced Analytics & Event Tracking", "price_usd": 349},
    {"id": "sms-email", "name": "Transactional Email & SMS (Resend/Twilio)", "price_usd": 299}
  ]'::jsonb
),
(
  'luxury-landing-sprint',
  'High-Converting Luxury Landing Page',
  'Precision-crafted marketing landing page engineered to captivate and convert.',
  1999,
  1999,
  '1-2 weeks',
  'Fast Sprint',
  false,
  'Ideal for boutique agencies, product launches, founders, and creators seeking a razor-sharp, ultra-fast landing page with bespoke animations and high-converting copy lockups.',
  '[
    "Bespoke layout tailored to your brand identity",
    "Framer Motion smooth scroll and micro-interactions",
    "Interactive pricing calculator / feature matrix",
    "Lead capture & Formspree / CRM webhook integration",
    "Lighthouse 95+ performance & accessibility score",
    "Comprehensive meta tags & Open Graph visuals",
    "Domain setup & CDN deployment on Vercel"
  ]'::jsonb,
  '[
    "Single-Page or Multi-Section Landing Experience",
    "Configured Lead Capture & Notification flows",
    "Complete design assets & typography license links",
    "14-day post-launch support"
  ]'::jsonb,
  '[
    {"id": "copywriting", "name": "Conversion Copywriting & Messaging", "price_usd": 399},
    {"id": "subpages", "name": "2 Additional Content Subpages (Legal / About)", "price_usd": 349},
    {"id": "newsletter", "name": "Newsletter / Waitlist Automation Sync", "price_usd": 199}
  ]'::jsonb
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
  features = EXCLUDED.features,
  deliverables = EXCLUDED.deliverables,
  addons = EXCLUDED.addons,
  is_active = EXCLUDED.is_active;

-- ==============================================================================
-- 7. UNIVERSAL FEATURE CATALOG & PRICING DATABASE
-- ==============================================================================

-- 7.1 Feature Categories (18 Categories)
CREATE TABLE IF NOT EXISTS public.feature_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.2 Atomic Catalog Features (300+ Items with INR pricing)
CREATE TABLE IF NOT EXISTS public.catalog_features (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.feature_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_inr NUMERIC NOT NULL,
  price_usd NUMERIC NOT NULL DEFAULT 0,
  price_type TEXT NOT NULL DEFAULT 'flat' CHECK (price_type IN ('flat', 'per_form', 'per_location', 'per_brand', 'per_page', 'per_product', 'per_service', 'per_post', 'per_image', 'per_account', 'per_hour', 'per_month', 'starting_at')),
  unit_label TEXT,
  default_qty INT DEFAULT 1,
  min_qty INT DEFAULT 1,
  max_qty INT DEFAULT 100,
  description TEXT,
  badge TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.3 Client Custom Quotes (Saved by Logged-in Clients & Admins)
CREATE TABLE IF NOT EXISTS public.client_custom_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_email TEXT NOT NULL,
  client_name TEXT,
  company_name TEXT,
  project_name TEXT NOT NULL DEFAULT 'Custom Web Project',
  industry_template TEXT DEFAULT 'custom',
  selected_features JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "feature_id": quantity }
  base_price_inr NUMERIC NOT NULL DEFAULT 5000,
  base_price_usd NUMERIC NOT NULL DEFAULT 75,
  itemized_total_inr NUMERIC NOT NULL DEFAULT 0,
  itemized_total_usd NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC NOT NULL DEFAULT 0,
  discount_amount_inr NUMERIC NOT NULL DEFAULT 0,
  discount_amount_usd NUMERIC NOT NULL DEFAULT 0,
  final_total_inr NUMERIC NOT NULL DEFAULT 0,
  final_total_usd NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'approved', 'converted_to_project', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_catalog_features_cat ON public.catalog_features(category_id);
CREATE INDEX IF NOT EXISTS idx_client_quotes_email ON public.client_custom_quotes(client_email);
CREATE INDEX IF NOT EXISTS idx_client_quotes_client_id ON public.client_custom_quotes(client_id);

-- RLS Policies
ALTER TABLE public.feature_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_custom_quotes ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Admin write
DROP POLICY IF EXISTS "Public can view feature categories" ON public.feature_categories;
CREATE POLICY "Public can view feature categories" ON public.feature_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage feature categories" ON public.feature_categories;
CREATE POLICY "Admins manage feature categories" ON public.feature_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Catalog Features: Public read, Admin write
DROP POLICY IF EXISTS "Public can view catalog features" ON public.catalog_features;
CREATE POLICY "Public can view catalog features" ON public.catalog_features FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage catalog features" ON public.catalog_features;
CREATE POLICY "Admins manage catalog features" ON public.catalog_features FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Client Custom Quotes: User read/write own, Admin full access
DROP POLICY IF EXISTS "Clients can view own custom quotes" ON public.client_custom_quotes;
CREATE POLICY "Clients can view own custom quotes" ON public.client_custom_quotes FOR SELECT USING (
  auth.uid() = client_id OR
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Clients can insert own custom quotes" ON public.client_custom_quotes;
CREATE POLICY "Clients can insert own custom quotes" ON public.client_custom_quotes FOR INSERT WITH CHECK (
  auth.uid() = client_id OR
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  auth.uid() IS NULL
);

DROP POLICY IF EXISTS "Clients can update own custom quotes" ON public.client_custom_quotes;
CREATE POLICY "Clients can update own custom quotes" ON public.client_custom_quotes FOR UPDATE USING (
  auth.uid() = client_id OR
  client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Clients can delete own custom quotes" ON public.client_custom_quotes;
CREATE POLICY "Clients can delete own custom quotes" ON public.client_custom_quotes FOR DELETE USING (
  auth.uid() = client_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ==============================================================================
-- 8. SEED DATA: 18 MASTER CATEGORIES
-- ==============================================================================
INSERT INTO public.feature_categories (id, name, short_name, icon, display_order, description) VALUES
('customer_website', '1. Customer & Website Features', 'Website Essentials', '🌐', 1, 'Core website architecture, customer navigation, accounts, and discovery elements.'),
('booking_appointment', '2. Booking & Appointment', 'Booking Systems', '📅', 2, 'Calendars, appointments, staff scheduling, deposits, and automated reminders.'),
('ecommerce_ordering', '3. E-commerce & Ordering', 'E-Commerce & Orders', '🛍️', 3, 'Cart, checkout, payments, shipping calculation, inventory, and order management.'),
('lead_generation', '4. Lead Generation', 'Lead Gen & CRM', '🎯', 4, 'Capture high-intent inquiries, CRM pipeline, lead scoring, and instant WhatsApp alerts.'),
('marketing_conversion', '5. Marketing & Conversion', 'Marketing & Growth', '📈', 5, 'SEO setup, Meta/Google tracking pixels, A/B testing, and conversion funnels.'),
('admin_management', '6. Admin & Business Management', 'Admin Dashboard', '⚙️', 6, 'Executive portal to manage products, services, bookings, customers, and analytics.'),
('employee_staff', '7. Employee / Staff Systems', 'Staff Systems', '👥', 7, 'Employee portals, shift scheduling, commissions, tasks, and attendance tracking.'),
('customer_retention', '8. Customer Retention', 'Retention & Loyalty', '🎁', 8, 'Loyalty points, referral programs, VIP subscriptions, and automated rebooking reminders.'),
('communication', '9. Communication', 'Communication', '💬', 9, 'Live chat, WhatsApp chatbots, SMS alerts, automated email sequences, and push alerts.'),
('ai_features', '10. AI Features', 'AI Copilots & GenAI', '🧠', 10, 'Gemini & OpenAI intelligent copilots, automated proposals, search, and document AI.'),
('interactive_features', '11. Advanced Interactive Features', 'Interactive & 3D', '✨', 11, 'Interactive calculators, 3D WebGL viewers, custom configurators, and customer portals.'),
('multi_location', '12. Multi-business / Multi-location', 'Multi-Location & Brands', '🏢', 12, 'Multi-branch setups, separate brand catalogs, centralized backend, and location pages.'),
('integrations', '13. Integrations', 'API Integrations', '🔌', 13, 'Payment gateways, CRMs, ERPs, accounting software, social APIs, and webhooks.'),
('security_infrastructure', '14. Security & Infrastructure', 'Security & Hosting', '🛡️', 14, 'Hosting setup, SSL, automated backups, speed tuning, 2FA, and performance optimization.'),
('seo', '15. SEO (Search Engine Optimization)', 'Advanced SEO', '🔍', 15, 'Granular on-page, local, technical, schema, and Core Web Vitals optimization.'),
('design_ux', '16. Design & UX Add-ons', 'Design & UX Polish', '🎨', 16, 'Custom UI design systems, GSAP scroll choreographies, Three.js 3D scenes, and dark mode.'),
('content_management', '17. Content Management', 'CMS & Publishing', '📝', 17, 'Headless CMS, visual page editors, media libraries, draft/publish, and revision history.'),
('hidden_essentials', '18. Things people forget to charge for', 'Migration, DevOps & Care', '📦', 18, 'Migrations, data entry, domain/DNS, production setup, hourly development, and monthly retainers.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  description = EXCLUDED.description;

-- ==============================================================================
-- 9. DEDICATED GRANULAR FEATURE TABLES PER PACKAGE
-- Linked to Master: public.packages
-- ==============================================================================

-- 9.1 Package 1 Features: Base Luxury Landing Sprint
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.2 Package 2 Features: BOFU Marketing & Sources Management
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.3 Package 3 Features: 3D Interactive & Brand Experience
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.4 Package 4 Features: Full-Stack Web App / SaaS MVP
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9.5 RLS on Feature Tables
ALTER TABLE public.package_landing_sprint_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_bofu_marketing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_3d_experience_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_fullstack_backend_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read on landing sprint features" 
  ON public.package_landing_sprint_features FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read on bofu marketing features" 
  ON public.package_bofu_marketing_features FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read on 3d experience features" 
  ON public.package_3d_experience_features FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read on fullstack backend features" 
  ON public.package_fullstack_backend_features FOR SELECT TO anon, authenticated USING (true);

-- 9.6 Unified Multi-Table View
CREATE OR REPLACE VIEW public.package_all_features_view AS
SELECT f.id, f.package_id, p.name AS package_name, p.price_usd, p.price_inr, 'package_landing_sprint_features' AS source_table, f.function_key, f.title, f.category, f.description, f.technical_deliverables, f.business_impact, f.complexity, f.is_core, f.display_order, f.created_at
FROM public.package_landing_sprint_features f JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT f.id, f.package_id, p.name AS package_name, p.price_usd, p.price_inr, 'package_bofu_marketing_features' AS source_table, f.function_key, f.title, f.category, f.description, f.technical_deliverables, f.business_impact, f.complexity, f.is_core, f.display_order, f.created_at
FROM public.package_bofu_marketing_features f JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT f.id, f.package_id, p.name AS package_name, p.price_usd, p.price_inr, 'package_3d_experience_features' AS source_table, f.function_key, f.title, f.category, f.description, f.technical_deliverables, f.business_impact, f.complexity, f.is_core, f.display_order, f.created_at
FROM public.package_3d_experience_features f JOIN public.packages p ON p.id = f.package_id
UNION ALL
SELECT f.id, f.package_id, p.name AS package_name, p.price_usd, p.price_inr, 'package_fullstack_backend_features' AS source_table, f.function_key, f.title, f.category, f.description, f.technical_deliverables, f.business_impact, f.complexity, f.is_core, f.display_order, f.created_at
FROM public.package_fullstack_backend_features f JOIN public.packages p ON p.id = f.package_id;


