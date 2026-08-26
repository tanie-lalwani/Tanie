-- ==============================================================================
-- SUPABASE SCHEMA FOR TANIE LALWANI PORTFOLIO, CLIENT PORTAL, PACKAGES & CONTRACTS
-- ==============================================================================

-- 1. Create profiles table (extends auth.users)
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

-- 2. Create website packages table
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

-- 3. Create client projects table
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

-- 4. Create e-contracts table
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

-- 5. Create project assets table (client uploads)
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

-- 6. Create bookings / inquiries table
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
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view & update their own profile; Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Packages: Anyone can view active packages; Admins can insert/update/delete
CREATE POLICY "Anyone can view active packages" ON public.packages
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL USING (public.is_admin());

-- Projects: Clients can view their own projects; Admins can manage all
CREATE POLICY "Clients can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = client_id OR client_email = auth.jwt()->>'email' OR public.is_admin());

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- Contracts: Clients can view & sign their own contracts; Admins can manage all
CREATE POLICY "Clients can view own contracts" ON public.contracts
  FOR SELECT USING (auth.uid() = client_id OR client_email = auth.jwt()->>'email' OR public.is_admin());

CREATE POLICY "Clients can sign own contracts" ON public.contracts
  FOR UPDATE USING (auth.uid() = client_id OR client_email = auth.jwt()->>'email' OR public.is_admin())
  WITH CHECK (auth.uid() = client_id OR client_email = auth.jwt()->>'email' OR public.is_admin());

CREATE POLICY "Admins can manage contracts" ON public.contracts
  FOR ALL USING (public.is_admin());

-- Project Assets: Clients can view and upload assets for their projects; Admins manage all
CREATE POLICY "Clients can view own project assets" ON public.project_assets
  FOR SELECT USING (
    auth.uid() = client_id OR 
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_assets.project_id AND (projects.client_id = auth.uid() OR projects.client_email = auth.jwt()->>'email'))
    OR public.is_admin()
  );

CREATE POLICY "Clients can insert own project assets" ON public.project_assets
  FOR INSERT WITH CHECK (
    auth.uid() = client_id OR 
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_assets.project_id AND (projects.client_id = auth.uid() OR projects.client_email = auth.jwt()->>'email'))
    OR public.is_admin()
  );

CREATE POLICY "Admins can delete project assets" ON public.project_assets
  FOR DELETE USING (public.is_admin());

-- Bookings: Anyone can submit a booking; Admins can view/manage
CREATE POLICY "Anyone can submit a booking" ON public.bookings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view bookings" ON public.bookings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE USING (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-assets', 'client-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Allow authenticated users to upload client assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('client-assets', 'contracts'));

CREATE POLICY "Allow public read of client assets and contracts"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('client-assets', 'contracts'));

-- ==============================================================================
-- SEED DEFAULT WEBSITE PACKAGES
-- ==============================================================================
INSERT INTO public.packages (id, name, tagline, price_usd, price_inr, turnaround_weeks, badge, popular, description, features, deliverables, addons)
VALUES 
(
  'interactive-3d-experience',
  '3D Interactive & Brand Experience',
  'Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.',
  3499,
  289000,
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
  349000,
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
  165000,
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
