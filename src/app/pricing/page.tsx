import type { Metadata } from "next";
import PackagesView from "@/views/PackagesView";

export const metadata: Metadata = {
  title: "Website Pricing & Cost Calculator | Tanie Lalwani",
  description:
    "Calculate your custom website cost and explore bespoke design aesthetics by Tanie Lalwani. 3D WebGL interactive brand experiences, full-stack Next.js web applications, and high-converting luxury websites.",
  alternates: {
    canonical: "https://tanie.me/pricing",
  },
  openGraph: {
    title: "Website Pricing & Cost Calculator | Tanie Lalwani",
    description:
      "Calculate your custom website cost and explore bespoke design aesthetics by Tanie Lalwani.",
    url: "https://tanie.me/pricing",
    type: "website",
  },
};

export default function PricingPage() {
  return <PackagesView />;
}
