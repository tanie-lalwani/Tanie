export interface CalculatedQuote {
  scope_tier: string;
  selected_aesthetic?: string;
  liked_aesthetics?: string[];
  features: string[];
  timeline: string;
  calculated_price: number;
  currency: string;
  symbol: string;
  saved_at: string;
  social_handle?: string;
}

export interface ClientAssetItem {
  id: string;
  name: string;
  url: string;
  type: "file" | "link";
  category: "logo" | "brand_assets" | "content_copy" | "images_media" | "design_reference" | "general";
  size_label?: string;
  description?: string;
  created_at: string;
  is_deleted?: boolean;
  deleted_at?: string;
}

export interface InvoiceData {
  id: string;
  invoice_number: string;
  type: "advance" | "completion";
  project_title: string;
  client_name: string;
  client_email: string;
  company_name?: string;
  amount: number;
  currency: string;
  symbol: string;
  issued_at: string;
  status: "paid";
  payment_method: string;
  payment_id: string;
  breakdown: Array<{ description: string; amount: number }>;
}

export interface PostHandoverOrder {
  id: string;
  type: "changes" | "addon";
  title: string;
  description: string;
  status: "pending_review" | "quoted" | "paid" | "completed";
  quoted_price?: number;
  currency?: string;
  created_at: string;
}

export interface ClientHubProject {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  company_name?: string;
  status: "Discovery" | "Design" | "Development" | "Review" | "Launch" | "Handed Over";
  booking_status: "not_booked" | "requested" | "contract_ready" | "booked_advance_paid" | "handed_over";
  progress_percent: number;
  target_launch_date?: string;
  live_preview_url?: string;
  figma_url?: string;
  github_repo?: string;
  calculated_quote: CalculatedQuote | null;
  saved_aesthetics?: string[];
  admin_agreed_price: number | null;
  admin_advance_required: number | null;
  admin_completion_balance: number | null;
  currency: string;
  symbol: string;
  contract_uploaded: boolean;
  contract_title?: string;
  contract_terms?: string;
  contract_signed: boolean;
  contract_signed_at?: string;
  contract_signature_name?: string;
  contract_signature_url?: string;
  advance_paid: boolean;
  advance_paid_at?: string;
  advance_payment_id?: string;
  completion_paid: boolean;
  completion_paid_at?: string;
  completion_payment_id?: string;
  assets: ClientAssetItem[];
  deliverables_breakdown: Array<{
    title: string;
    description: string;
    included: boolean;
    price?: number;
  }>;
  invoices: InvoiceData[];
  post_orders: PostHandoverOrder[];
}
