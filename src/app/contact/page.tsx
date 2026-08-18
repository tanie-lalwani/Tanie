import type { Metadata } from "next";
import Home from "@/views/Home";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact | Tanie Lalwani",
  description:
    "Get in touch with Tanie Lalwani for frontend development, portfolio websites, WebGL/Three.js interactive experiences, and creative web projects.",
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
};

export default function ContactPage() {
  return (
    <>
      <Home phase="default" />
      <SiteFooter />
    </>
  );
}
