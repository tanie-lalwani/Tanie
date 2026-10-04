import type { Metadata } from "next";
import PackagesView from "@/views/PackagesView";

export const metadata: Metadata = {
  title: "Website Pricing & Cost Calculator | Tanie Lalwani",
  description:
    "Calculate your custom website cost and explore bespoke design aesthetics by Tanie Lalwani. 3D WebGL interactive brand experiences, full-stack Next.js web applications, and high-converting luxury websites.",
  alternates: {
    canonical: "https://tanie.me/pricing",
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
    title: "Website Pricing & Cost Calculator | Tanie Lalwani",
    description:
      "Calculate your custom website cost and explore bespoke design aesthetics by Tanie Lalwani. 3D WebGL interactive brand experiences, full-stack Next.js web applications, and high-converting luxury websites.",
    url: "https://tanie.me/pricing",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Pricing & Cost Calculator | Tanie Lalwani",
    description:
      "Calculate your custom website cost and explore bespoke design aesthetics by Tanie Lalwani.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function PricingPage() {
  return <PackagesView />;
}

