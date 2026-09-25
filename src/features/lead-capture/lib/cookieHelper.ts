// Client and server-compatible Cookie & Autofill Helpers

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days: number = 30): void {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getSavedLeadProfile(): {
  name: string;
  email: string;
  businessName: string;
  socialAccount: string;
  leadId: string;
} {
  if (typeof window === "undefined") {
    return { name: "", email: "", businessName: "", socialAccount: "", leadId: "" };
  }

  const name = getCookie("tanie_lead_name") || localStorage.getItem("tanie_lead_name") || "";
  const email = getCookie("tanie_lead_email") || localStorage.getItem("tanie_lead_email") || "";
  const businessName = getCookie("tanie_lead_business") || localStorage.getItem("tanie_lead_business") || "";
  const socialAccount = getCookie("tanie_client_social") || localStorage.getItem("tanie_client_social") || "";
  const leadId = getCookie("tanie_calc_lead_id") || localStorage.getItem("tanie_calc_lead_id") || "";

  return { name, email, businessName, socialAccount, leadId };
}

export function saveLeadProfile(data: {
  name?: string;
  email?: string;
  businessName?: string;
  socialAccount?: string;
  leadId?: string;
}): void {
  if (typeof window === "undefined") return;

  if (data.name) {
    setCookie("tanie_lead_name", data.name, 60);
    localStorage.setItem("tanie_lead_name", data.name);
  }
  if (data.email) {
    setCookie("tanie_lead_email", data.email, 60);
    localStorage.setItem("tanie_lead_email", data.email);
  }
  if (data.businessName) {
    setCookie("tanie_lead_business", data.businessName, 60);
    localStorage.setItem("tanie_lead_business", data.businessName);
  }
  if (data.socialAccount) {
    setCookie("tanie_client_social", data.socialAccount, 60);
    localStorage.setItem("tanie_client_social", data.socialAccount);
  }
  if (data.leadId) {
    setCookie("tanie_calc_lead_id", data.leadId, 60);
    localStorage.setItem("tanie_calc_lead_id", data.leadId);
  }
}
