# Pricing & Website Cost Calculator Feature Module (Boilerplate)

A dynamic, multi-step website cost estimation and proposal engine with locked sign-up/login gating.

## Included Capabilities
1. **Interactive 4-Step Questionnaire**:
   - Step 1: Website foundation & architecture type (Business, E-Commerce, Creator, SaaS)
   - Step 2: Industry selector with pre-configured feature sets (Salon, Clinic, Restaurant, Fashion, B2B, SaaS, etc.)
   - Step 3: Curated feature bundle picker (E-Commerce, Booking, AI Copilot, 3D GSAP, Multi-location, DevOps)
   - Step 4: Target budget & preferred launch speed
2. **Gated Quote Gate (Step 5)**:
   - Full lead persistence with browser cookie sync and debounced typing capture.
   - Strictly hides calculated price, discount percent, and timeline until the user creates a free client account or signs in.
   - Once authenticated, unlocks itemized breakdown, currency toggle (INR / USD), direct WhatsApp quote sharing, and custom project draft saving.
3. **100+ Feature Scope Matrix (`CustomScopeCalculator`)**:
   - 18 categorized feature groups with itemized quantity adjustments, add-ons, and dynamic bundle discount calculation.

## Copy-Paste Usage in Any Project
```tsx
import { WebsiteCostCalculatorFunnel, CustomScopeCalculator } from "@/features/pricing-calculator";

export default function PricingPage() {
  return <WebsiteCostCalculatorFunnel onProceedWithCustomQuote={(quote) => console.log(quote)} />;
}
```
