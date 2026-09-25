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
