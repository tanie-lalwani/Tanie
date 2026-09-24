import type { Metadata } from "next";
import TermsView from "@/views/TermsView";

export const metadata: Metadata = {
  title: "Terms, Privacy & Policies | Tanie Lalwani",
  description:
    "Unified terms of service, privacy policy, milestone refund policy, and digital service delivery agreement for Tanie Lalwani Studio.",
  alternates: {
    canonical: "https://tanie.me/terms",
  },
  openGraph: {
    title: "Terms, Privacy & Policies | Tanie Lalwani",
    description:
      "Unified terms of service, privacy policy, milestone refund policy, and digital service delivery agreement for Tanie Lalwani Studio.",
    url: "https://tanie.me/terms",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms, Privacy & Policies | Tanie Lalwani",
    description:
      "Unified terms of service, privacy policy, milestone refund policy, and digital service delivery agreement for Tanie Lalwani Studio.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function TermsPage() {
  return <TermsView />;
}
