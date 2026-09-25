"use client";

import { ClientHubProject, CalculatedQuote, ClientAssetItem, InvoiceData, PostHandoverOrder } from "./types";

const STORAGE_KEY_PREFIX = "tanie_client_hub_project_";
const LAST_CALCULATED_QUOTE_KEY = "tanie_last_calculated_quote";

export function getSavedCalculatedQuote(): CalculatedQuote | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_CALCULATED_QUOTE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCalculatedQuote(quote: CalculatedQuote): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_CALCULATED_QUOTE_KEY, JSON.stringify(quote));
  } catch {}
}

export function getDefaultClientHubProject(userEmail: string, userName?: string): ClientHubProject {
  const savedQuote = getSavedCalculatedQuote();
  const cleanEmail = userEmail.toLowerCase().trim();
  const name = userName || cleanEmail.split("@")[0] || "Client";

  return {
    id: `proj-${cleanEmail.replace(/[^a-z0-9]/g, "-")}`,
    title: savedQuote ? `${savedQuote.scope_tier} Web Sprint` : "Custom Engineering Sprint",
    client_name: name,
    client_email: cleanEmail,
    company_name: "",
    status: "Discovery",
    booking_status: "not_booked",
    progress_percent: 15,
    target_launch_date: "3–4 Weeks from Kickoff",
    live_preview_url: "https://staging-client-preview.tanie.me",
    figma_url: "https://figma.com/@tanie/project-board",
    github_repo: "https://github.com/tanie-clients/production-suite",
    calculated_quote: savedQuote,
    admin_agreed_price: null,
    admin_advance_required: null,
    admin_completion_balance: null,
    currency: savedQuote?.currency || "USD",
    symbol: savedQuote?.symbol || "$",
    contract_uploaded: false,
    contract_title: "Master Services Agreement & Milestone Schedule",
    contract_terms: `1. SCOPE OF SERVICES: Tanie Studio will provide engineering, UI/UX, responsive development, and deployment.\n2. PAYMENT MILESTONES: 50% upfront advance deposit to lock calendar dates. Remaining 50% upon delivery of staging review.\n3. INTELLECTUAL PROPERTY: Upon final completion payment, full ownership of code and assets transfers to Client.\n4. REVISIONS: Includes 2 comprehensive iteration rounds during design and staging phases.`,
    contract_signed: false,
    advance_paid: false,
    completion_paid: false,
    assets: [
      {
        id: "asset-default-1",
        name: "Brand Logo Vector (Dark & Light).svg",
        url: "/circular_favicon.png",
        type: "file",
        category: "logo",
        size_label: "245 KB",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_deleted: false,
      },
      {
        id: "asset-default-2",
        name: "Design Inspiration & Competitor Moodboard",
        url: "https://dribbble.com",
        type: "link",
        category: "design_reference",
        description: "Minimal typography and spatial dark-mode layout references",
        created_at: new Date(Date.now() - 43200000).toISOString(),
        is_deleted: false,
      }
    ],
    deliverables_breakdown: [
      { title: "Bespoke Responsive UI/UX Design System", description: "Figma design tokens, typography scale & desktop/mobile layouts", included: true, price: 800 },
      { title: "Modern High-Speed Next.js Architecture", description: "SSR, static optimization, edge routing & zero cognitive delay", included: true, price: 1200 },
      { title: "Micro-Interactions & Motion Choreography", description: "Fluid animations, hover states & scroll-driven dynamics", included: true, price: 600 },
      { title: "Full Technical SEO & Speed Optimization", description: "Semantic markup, OpenGraph cards & 95+ PageSpeed score", included: true, price: 400 },
      { title: "30-Day Post-Launch Warranty & Support", description: "Dedicated bug-fix warranty and cloud hosting hypercare", included: true, price: 200 }
    ],
    invoices: [],
    post_orders: []
  };
}

export function loadClientHubProject(userEmail: string, userName?: string): ClientHubProject {
  if (typeof window === "undefined") {
    return getDefaultClientHubProject(userEmail, userName);
  }
  const cleanEmail = userEmail.toLowerCase().trim();
  const key = `${STORAGE_KEY_PREFIX}${cleanEmail}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: ClientHubProject = JSON.parse(raw);
      // Ensure quote updates if a newer one was calculated
      const latestQuote = getSavedCalculatedQuote();
      if (latestQuote && !parsed.calculated_quote) {
        parsed.calculated_quote = latestQuote;
      }
      return parsed;
    }
  } catch {}

  const initial = getDefaultClientHubProject(userEmail, userName);
  saveClientHubProject(initial);
  return initial;
}

export function saveClientHubProject(project: ClientHubProject): void {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_KEY_PREFIX}${project.client_email.toLowerCase().trim()}`;
  try {
    localStorage.setItem(key, JSON.stringify(project));
  } catch {}
}
