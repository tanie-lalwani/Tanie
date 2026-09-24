import { NextRequest, NextResponse } from "next/server";
import { resolveMarketTier, MARKET_TIERS } from "@/lib/geoPricing";

export async function GET(req: NextRequest) {
  try {
    // 1. Check edge deployment headers (Vercel, Cloudflare, AWS)
    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const cfCountry = req.headers.get("cf-ipcountry");
    const xCountry = req.headers.get("x-country-code");

    let detectedCountry = vercelCountry || cfCountry || xCountry;

    // 2. If running locally or header missing, check IP lookup
    if (!detectedCountry || detectedCountry === "XX") {
      const forwardedFor = req.headers.get("x-forwarded-for");
      const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : null;

      // If local IP, default to IN (India) based on workspace context
      if (!clientIp || clientIp === "127.0.0.1" || clientIp === "::1" || clientIp.startsWith("192.168.") || clientIp.startsWith("10.")) {
        detectedCountry = "IN";
      } else {
        try {
          const lookup = await fetch(`https://api.country.is/${clientIp}`, {
            next: { revalidate: 3600 }
          });
          if (lookup.ok) {
            const data = await lookup.json();
            if (data?.country) detectedCountry = data.country;
          }
        } catch {
          detectedCountry = "IN";
        }
      }
    }

    const marketTier = resolveMarketTier(detectedCountry);
    const tierConfig = MARKET_TIERS[marketTier] || MARKET_TIERS.IN;

    return NextResponse.json({
      success: true,
      detectedCountry: detectedCountry || "IN",
      marketTier,
      countryName: tierConfig.countryName,
      flag: tierConfig.flag,
      currencyCode: tierConfig.currencyCode,
      currencySymbol: tierConfig.currencySymbol
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      detectedCountry: "IN",
      marketTier: "IN",
      countryName: "India",
      flag: "🇮🇳",
      currencyCode: "INR",
      currencySymbol: "₹",
      error: err.message
    });
  }
}
