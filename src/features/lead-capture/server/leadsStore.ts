import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/features/auth";
import type { CapturedLead } from "../types/lead.types";

// Resilient local file fallback
const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "captured_leads.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Ignore in read-only environments
  }
}

function readLocalLeads(): CapturedLead[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(LEADS_FILE)) return [];
    const raw = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalLeads(leads: CapturedLead[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write local leads file:", e);
  }
}

export async function upsertCapturedLead(leadData: Partial<CapturedLead> & { id: string }): Promise<CapturedLead> {
  const now = new Date().toISOString();
  const existingList = readLocalLeads();
  const existingIdx = existingList.findIndex((l) => l.id === leadData.id);

  const mergedLead: CapturedLead = {
    id: leadData.id,
    client_name: leadData.client_name || (existingIdx >= 0 ? existingList[existingIdx].client_name : undefined),
    client_email: leadData.client_email || (existingIdx >= 0 ? existingList[existingIdx].client_email : undefined),
    company_name: leadData.company_name || (existingIdx >= 0 ? existingList[existingIdx].company_name : undefined),
    phone: leadData.phone || (existingIdx >= 0 ? existingList[existingIdx].phone : undefined),
    business_type: leadData.business_type || (existingIdx >= 0 ? existingList[existingIdx].business_type : undefined),
    industry: leadData.industry || (existingIdx >= 0 ? existingList[existingIdx].industry : undefined),
    selected_bundles: leadData.selected_bundles || (existingIdx >= 0 ? existingList[existingIdx].selected_bundles : []),
    budget_tier: leadData.budget_tier || (existingIdx >= 0 ? existingList[existingIdx].budget_tier : undefined),
    timeline: leadData.timeline || (existingIdx >= 0 ? existingList[existingIdx].timeline : undefined),
    estimated_cost_inr: leadData.estimated_cost_inr ?? (existingIdx >= 0 ? existingList[existingIdx].estimated_cost_inr : undefined),
    estimated_cost_usd: leadData.estimated_cost_usd ?? (existingIdx >= 0 ? existingList[existingIdx].estimated_cost_usd : undefined),
    discount_percent: leadData.discount_percent ?? (existingIdx >= 0 ? existingList[existingIdx].discount_percent : undefined),
    source: leadData.source || (existingIdx >= 0 ? existingList[existingIdx].source : "cost_calculator_hero"),
    current_step: leadData.current_step || (existingIdx >= 0 ? existingList[existingIdx].current_step : "Hero Input"),
    status: leadData.status || (existingIdx >= 0 ? existingList[existingIdx].status : "typing"),
    ip_address: leadData.ip_address || (existingIdx >= 0 ? existingList[existingIdx].ip_address : undefined),
    user_agent: leadData.user_agent || (existingIdx >= 0 ? existingList[existingIdx].user_agent : undefined),
    created_at: existingIdx >= 0 ? existingList[existingIdx].created_at : now,
    updated_at: now
  };

  // 1. Write to local resilient file
  if (existingIdx >= 0) {
    existingList[existingIdx] = mergedLead;
  } else {
    existingList.unshift(mergedLead);
  }
  writeLocalLeads(existingList);

  // 2. Write to Supabase `bookings` / `client_custom_quotes` / `profiles` if configured
  if (isSupabaseConfigured()) {
    try {
      if (mergedLead.client_email) {
        await supabase
          .from("bookings")
          .upsert([
            {
              id: mergedLead.id,
              client_name: mergedLead.client_name || mergedLead.company_name || "Anonymous Lead",
              client_email: mergedLead.client_email,
              company_name: mergedLead.company_name,
              package_id: mergedLead.industry || "custom-package",
              selected_addons: mergedLead.selected_bundles || [],
              estimated_budget_usd: mergedLead.estimated_cost_usd,
              timeline_requirement: mergedLead.timeline,
              project_description: `[Captured Cost Calculator Lead] Business: ${mergedLead.company_name || "N/A"}, Industry: ${mergedLead.industry || "N/A"}, Step: ${mergedLead.current_step}, Budget Tier: ${mergedLead.budget_tier || "N/A"}, Estimated Total: ₹${mergedLead.estimated_cost_inr || 0}`,
              status: mergedLead.status === "unlocked" ? "converted" : "pending"
            }
          ])
          .select();
      }
    } catch (err) {
      console.warn("Supabase lead sync warning:", err);
    }
  }

  return mergedLead;
}

export function getAllCapturedLeads(): CapturedLead[] {
  return readLocalLeads();
}
