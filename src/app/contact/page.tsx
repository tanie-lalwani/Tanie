import type { Metadata } from "next";
import Home from "@/views/Home";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact | Tanie Lalwani",
  description:
    "Get in touch with Tanie Lalwani for frontend engineering, bespoke portfolio websites, Three.js / WebGL 3D interactive experiences, and full-stack web applications. Serving clients in the US, UK, UAE, India, and globally.",
  alternates: {
    canonical: "https://tanie.me/contact",
  },
  openGraph: {
    title: "Contact | Tanie Lalwani",
    description:
      "Get in touch with Tanie Lalwani for frontend development, portfolio websites, WebGL/Three.js interactive experiences, and creative web projects.",
    url: "https://tanie.me/contact",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Tanie Lalwani",
    description:
      "Get in touch with Tanie Lalwani for frontend development, portfolio websites, WebGL/Three.js interactive experiences, and creative web projects.",
    images: ["https://tanie.me/og.webp"],
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "23.0225;72.5714",
    ICBM: "23.0225, 72.5714",
    "dc.coverage": "Worldwide (United States, United Kingdom, United Arab Emirates, India, Canada, Australia, Europe, Global)",
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Tanie Lalwani",
  url: "https://tanie.me/contact",
  description: "Official contact page to hire or collaborate with creative full-stack developer Tanie Lalwani.",
  mainEntity: {
    "@type": "Person",
    name: "Tanie Lalwani",
    email: "tanielalwani@gmail.com",
    url: "https://tanie.me",
    jobTitle: "Creative & Full-Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.0225,
      longitude: 72.5714,
    },
    areaServed: [
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United Arab Emirates" },
      { "@type": "Country", "name": "India" },
      { "@type": "Place", "name": "Worldwide" },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Home phase="default" />
      <SiteFooter />
    </>
  );
}
