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
  package_id?: string;
  selected_addons?: string[];
  estimated_budget_usd?: number;
  timeline_requirement?: string;
  project_description: string;
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
}

// --------------------------------------------------------------------------------
// DEFAULT FALLBACK DATA (Guarantees zero-blank states and rapid offline preview)
// --------------------------------------------------------------------------------

export const DEFAULT_PACKAGES: WebsitePackage[] = [
  {
    id: "interactive-3d-experience",
    name: "3D Interactive & Brand Experience",
    tagline: "Bespoke WebGL, Three.js & immersive storytelling that leaves lasting impressions.",
    price_usd: 3499,
    price_inr: 289000,
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
      { id: "cms", name: "Headless CMS (Sanity / Contentful)", price_usd: 499 },
      { id: "multi-lang", name: "Multi-language Localization (i18n)", price_usd: 399 },
      { id: "custom-audio", name: "Original Sound Effects & Audio Composition", price_usd: 299 },
      { id: "priority", name: "Priority Express Delivery (2 weeks)", price_usd: 799 }
    ],
    is_active: true
  },
  {
    id: "fullstack-web-app",
    name: "Full-Stack Web App / SaaS MVP",
    tagline: "Robust, scalable web applications with Supabase DB, Auth, Payments & Admin portals.",
    price_usd: 4299,
    price_inr: 349000,
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
      { id: "ai-copilot", name: "Gemini / OpenAI AI Assistant Integration", price_usd: 599 },
      { id: "analytics-suite", name: "Advanced Analytics & Event Tracking", price_usd: 349 },
      { id: "sms-email", name: "Transactional Email & SMS (Resend/Twilio)", price_usd: 299 }
    ],
    is_active: true
  },
  {
    id: "luxury-landing-sprint",
    name: "High-Converting Luxury Landing Page",
    tagline: "Precision-crafted marketing landing page engineered to captivate and convert.",
    price_usd: 1999,
    price_inr: 165000,
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
      { id: "copywriting", name: "Conversion Copywriting & Messaging", price_usd: 399 },
      { id: "subpages", name: "2 Additional Content Subpages (Legal / About)", price_usd: 349 },
      { id: "newsletter", name: "Newsletter / Waitlist Automation Sync", price_usd: 199 }
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

// --------------------------------------------------------------------------------
// SERVICE FUNCTIONS (SUPABASE + RESILIENT FALLBACK)
// --------------------------------------------------------------------------------

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
 * Fetch projects for a specific client email
 */
export async function getClientProjects(email: string): Promise<ClientProject[]> {
  try {
    if (!isSupabaseConfigured() || !email) {
      return [DEMO_CLIENT_PROJECT];
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_email", email.trim().toLowerCase())
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [DEMO_CLIENT_PROJECT];
    }
    return data as ClientProject[];
  } catch (err) {
    console.warn("Using fallback client project:", err);
    return [DEMO_CLIENT_PROJECT];
  }
}

/**
 * Fetch all projects (Admin)
 */
export async function getAllProjects(): Promise<ClientProject[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [DEMO_CLIENT_PROJECT];
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [DEMO_CLIENT_PROJECT];
    }
    return data as ClientProject[];
  } catch (err) {
    console.warn("Using fallback all projects:", err);
    return [DEMO_CLIENT_PROJECT];
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
  try {
    if (!isSupabaseConfigured()) {
      return DEMO_CONTRACT;
    }
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error || !data) {
      return DEMO_CONTRACT;
    }
    return data as EContract;
  } catch (err) {
    console.warn("Using fallback contract:", err);
    return DEMO_CONTRACT;
  }
}

/**
 * Fetch all contracts (Admin)
 */
export async function getAllContracts(): Promise<EContract[]> {
  try {
    if (!isSupabaseConfigured()) {
      return [DEMO_CONTRACT];
    }
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [DEMO_CONTRACT];
    }
    return data as EContract[];
  } catch (err) {
    return [DEMO_CONTRACT];
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
  try {
    if (!isSupabaseConfigured()) {
      return DEMO_ASSETS;
    }
    const { data, error } = await supabase
      .from("project_assets")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_ASSETS;
    }
    return data as ProjectAsset[];
  } catch (err) {
    console.warn("Using fallback assets:", err);
    return DEMO_ASSETS;
  }
}

/**
 * Fetch all uploaded assets (Admin)
 */
export async function getAllAssets(): Promise<ProjectAsset[]> {
  try {
    if (!isSupabaseConfigured()) {
      return DEMO_ASSETS;
    }
    const { data, error } = await supabase
      .from("project_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_ASSETS;
    }
    return data as ProjectAsset[];
  } catch (err) {
    return DEMO_ASSETS;
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
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            client_name: newLead.client_name,
            client_email: newLead.client_email,
            company_name: newLead.company_name,
            project_description: `[Lead Collected via ${newLead.source}] Package of Interest: ${newLead.package_interest}${lead.phone ? ` | Phone: ${lead.phone}` : ""}`,
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

    return data.map((b: any) => ({
      id: b.id,
      client_name: b.client_name || "Prospective Client",
      client_email: b.client_email || "",
      company_name: b.company_name || "",
      phone: "",
      package_interest: b.package_id || "Website Package",
      source: b.project_description?.includes("[Lead Collected") ? "Pricing Unlock Gate" : "Booking Inquiry",
      status: b.status || "pending",
      created_at: b.created_at || new Date().toISOString()
    }));
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
          company: booking.company_name || "N/A",
          package: booking.package_id,
          budget_usd: booking.estimated_budget_usd,
          timeline: booking.timeline_requirement,
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
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            client_name: booking.client_name,
            client_email: booking.client_email.toLowerCase(),
            company_name: booking.company_name || "",
            package_id: booking.package_id,
            selected_addons: booking.selected_addons || [],
            estimated_budget_usd: booking.estimated_budget_usd,
            timeline_requirement: booking.timeline_requirement,
            project_description: booking.project_description,
            status: "pending"
          }
        ])
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

