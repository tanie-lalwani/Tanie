export interface CapturedLead {
  id: string;
  client_name?: string;
  client_email?: string;
  company_name?: string;
  phone?: string;
  business_type?: string;
  industry?: string;
  selected_bundles?: string[];
  budget_tier?: string;
  timeline?: string;
  estimated_cost_inr?: number;
  estimated_cost_usd?: number;
  discount_percent?: number;
  source: string;
  current_step: string;
  status: "new" | "typing" | "in_progress" | "unlocked" | "contacted" | "converted";
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
