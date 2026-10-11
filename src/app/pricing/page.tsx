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

const pricingSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://tanie.me",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing & Calculator",
          item: "https://tanie.me/pricing",
        },
      ],
    },
    {
      "@type": "ItemList",
      name: "Website & Web Application Packages by Tanie Lalwani",
      description: "Transparent market-adjusted pricing across USD, INR, and AED currencies.",
      itemListElement: [
        {
          "@type": "Offer",
          position: 1,
          name: "Luxury Landing Sprint",
          description: "High-converting bespoke landing page with custom motion, typography, and rapid delivery.",
          price: "99",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
        {
          "@type": "Offer",
          position: 2,
          name: "Sales Website Engine",
          description: "Full multi-page sales platform with lead capture, CMS integration, and SEO optimization.",
          price: "999",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
        {
          "@type": "Offer",
          position: 3,
          name: "Interactive 3D Experience",
          description: "Bespoke Three.js / WebGL interactive 3D web experience with custom shaders and interactive models.",
          price: "899",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
        {
          "@type": "Offer",
          position: 4,
          name: "Portals & Dashboards Suite",
          description: "Internal tools, client portals, real-time analytics dashboards, and authentication.",
          price: "499",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
        {
          "@type": "Offer",
          position: 5,
          name: "Full-Stack SaaS App",
          description: "End-to-end web application with authentication, database models, payment integration, and cloud workflows.",
          price: "999",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
        {
          "@type": "Offer",
          position: 6,
          name: "Custom Bespoke Build",
          description: "Complete tailored creative technology build designed to client specifications.",
          price: "1199",
          priceCurrency: "USD",
          url: "https://tanie.me/pricing",
          seller: {
            "@type": "Person",
            name: "Tanie Lalwani",
          },
        },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <PackagesView />
    </>
  );
}
