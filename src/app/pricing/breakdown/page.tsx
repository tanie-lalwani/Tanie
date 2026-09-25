import type { Metadata } from "next";
import PricingBreakdownView from "@/views/PricingBreakdownView";

export const metadata: Metadata = {
  title: "Website Scope & Feature Breakdown | Tanie Lalwani",
  description:
    "Review your custom website architecture, macro and micro-feature specifications, deduplicated modular scope, and transparent pricing by Tanie Lalwani.",
  alternates: {
    canonical: "https://tanie.me/pricing/breakdown",
  },
  openGraph: {
    title: "Website Scope & Feature Breakdown | Tanie Lalwani",
    description:
      "Review your custom website architecture, macro and micro-feature specifications, and transparent pricing by Tanie Lalwani.",
    url: "https://tanie.me/pricing/breakdown",
    type: "website",
  },
};

export default function PricingBreakdownPage() {
  return <PricingBreakdownView />;
}
