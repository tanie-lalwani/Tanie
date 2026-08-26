import type { Metadata } from "next";
import PackagesView from "@/views/PackagesView";

export const metadata: Metadata = {
  title: "Website Packages & Pricing | Tanie Lalwani",
  description:
    "Explore bespoke website engineering packages by Tanie Lalwani. 3D WebGL interactive brand experiences, full-stack Next.js web applications, and high-converting luxury landing pages with client portal & e-contracts.",
  alternates: {
    canonical: "https://tanie.me/packages",
  },
  openGraph: {
    title: "Website Packages & Pricing | Tanie Lalwani",
    description:
      "Explore bespoke website engineering packages by Tanie Lalwani. 3D WebGL interactive brand experiences, full-stack Next.js web applications, and luxury landing pages.",
    url: "https://tanie.me/packages",
    type: "website",
  },
};

export default function PackagesPage() {
  return <PackagesView />;
}
