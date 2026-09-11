import type { Metadata } from "next";
import PaywallView from "@/views/PaywallView";

export const metadata: Metadata = {
  title: "Razorpay Payment & Verification Paywall | Tanie Lalwani",
  description:
    "Secure Razorpay payment gateway and verification paywall for Tanie Lalwani's web design, 3D WebGL experiences, and full-stack software sprints.",
  alternates: {
    canonical: "https://tanie.me/paywall",
  },
  openGraph: {
    title: "Razorpay Payment & Verification Paywall | Tanie Lalwani",
    description:
      "Secure Razorpay payment gateway and verification paywall for web design and full-stack software sprints.",
    url: "https://tanie.me/paywall",
    type: "website",
  },
};

export default function PaywallPage() {
  return <PaywallView />;
}
