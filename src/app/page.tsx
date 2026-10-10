import type { Metadata } from "next";
import Home from "@/views/Home";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Tanie Lalwani | Creative and Full Stack Developer",
  description:
    "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Building interactive 3D WebGL experiences and high-performance web applications for clients across the US, UK, UAE, India, and worldwide.",
  alternates: {
    canonical: "https://tanie.me/",
  },
  openGraph: {
    title: "Tanie Lalwani | Creative and Full Stack Developer",
    description:
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
    url: "https://tanie.me/",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanie Lalwani | Creative and Full Stack Developer",
    description:
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js.",
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

export default function Page() {
  return (
    <>
      <Home phase="default" />
      <SiteFooter />
    </>
  );
}
