import { NextRequest, NextResponse } from "next/server";
import { upsertCapturedLead } from "@/lib/leads-store.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check or generate lead ID
    let leadId = body.id || body.leadId;
    if (!leadId) {
      // Check cookie
      leadId = req.cookies.get("tanie_calc_lead_id")?.value;
    }
    if (!leadId) {
      leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const savedLead = await upsertCapturedLead({
      id: leadId,
      company_name: body.businessName || body.companyName || body.projectName,
      client_name: body.clientName || body.name,
      client_email: body.clientEmail || body.email,
      phone: body.phone,
      business_type: body.businessType,
      industry: body.industry,
      selected_bundles: body.selectedBundles,
      budget_tier: body.budgetTier,
      timeline: body.timeline,
      estimated_cost_inr: body.estimatedCostInr,
      estimated_cost_usd: body.estimatedCostUsd,
      discount_percent: body.discountPercent,
      source: body.source || "hero_cost_calculator",
      current_step: body.step || body.currentStep || "Hero Search Input",
      status: body.status || "typing",
      ip_address: ip,
      user_agent: userAgent
    });

    const res = NextResponse.json({
      success: true,
      leadId: savedLead.id,
      lead: savedLead
    });

    // Set cookie for session persistence (30 days)
    res.cookies.set("tanie_calc_lead_id", savedLead.id, {
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: false, // Accessible from client-side script for synchronization
      sameSite: "lax"
    });

    return res;
  } catch (error: any) {
    console.error("Error in lead capture API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to capture lead" },
      { status: 500 }
    );
  }
}
