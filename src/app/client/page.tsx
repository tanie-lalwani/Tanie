import type { Metadata } from "next";
import ClientPortal from "@/views/ClientPortal";

export const metadata: Metadata = {
  title: "Client Workspace & Portal | Tanie Lalwani",
  description:
    "Secure client workspace for Tanie Lalwani's web engineering clients. Manage your project, track sprint milestones, upload brand assets, and sign e-contracts directly.",
  alternates: {
    canonical: "https://tanie.me/client",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClientPage() {
  return <ClientPortal />;
}
