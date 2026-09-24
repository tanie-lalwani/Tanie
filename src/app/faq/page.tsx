import type { Metadata } from "next";
import FaqView from "@/views/FaqView";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
  description:
    "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
  alternates: {
    canonical: "https://tanie.me/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
    description:
      "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
    url: "https://tanie.me/faq",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
    description:
      "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function FaqPage() {
  return <FaqView />;
}
