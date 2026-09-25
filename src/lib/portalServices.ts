import { supabase, isSupabaseConfigured } from './supabaseClient';
export * from '../types/portal';
export * from '../data/portalMockData';
import type {
  WebsitePackage,
  ClientProject,
  EContract,
  ProjectAsset,
  PackageGranularFeature,
  LeadItem,
  BookingSubmission,
  ChangeRequest,
} from '../types/portal';
import {
  DEFAULT_PACKAGES,
  DEMO_CLIENT_PROJECT,
  DEMO_CONTRACT,
  DEMO_ASSETS,
  DEFAULT_GRANULAR_FEATURES,
} from '../data/portalMockData';

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
