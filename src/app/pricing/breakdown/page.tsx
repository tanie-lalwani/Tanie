import type { Metadata } from "next";
import PricingBreakdownView from "@/views/PricingBreakdownView";

export const metadata: Metadata = {
  title: "Website Scope & Feature Breakdown | Tanie Lalwani",
  description:
    "Review your custom website architecture, macro and micro-feature specifications, deduplicated modular scope, and transparent pricing by Tanie Lalwani.",
  alternates: {
    canonical: "https://tanie.me/pricing/breakdown",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Website Scope & Feature Breakdown | Tanie Lalwani",
    description:
      "Review your custom website architecture, macro and micro-feature specifications, and transparent pricing by Tanie Lalwani.",
    url: "https://tanie.me/pricing/breakdown",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Scope & Feature Breakdown | Tanie Lalwani",
    description:
      "Review your custom website architecture, macro and micro-feature specifications, and transparent pricing by Tanie Lalwani.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function PricingBreakdownPage() {
  return <PricingBreakdownView />;
}

