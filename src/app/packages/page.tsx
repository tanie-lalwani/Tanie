import type { Metadata } from "next";
import PackagesView from "@/views/PackagesView";

export const metadata: Metadata = {
  title: "Website Packages & Bespoke Design Aesthetics | Tanie Lalwani",
  description:
    "Explore curated website packages, design aesthetics, and interactive WebGL feature tiers by creative full-stack developer Tanie Lalwani.",
  alternates: {
    canonical: "https://tanie.me/packages",
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
    title: "Website Packages & Bespoke Design Aesthetics | Tanie Lalwani",
    description:
      "Explore curated website packages, design aesthetics, and interactive WebGL feature tiers by creative full-stack developer Tanie Lalwani.",
    url: "https://tanie.me/packages",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Packages & Bespoke Design Aesthetics | Tanie Lalwani",
    description:
      "Explore curated website packages, design aesthetics, and interactive WebGL feature tiers by creative full-stack developer Tanie Lalwani.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function PackagesPage() {
  return <PackagesView />;
}

