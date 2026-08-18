import type { Metadata } from "next";
import Home from "@/views/Home";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Tanie Lalwani | Creative and Full Stack Developer",
  description:
    "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
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
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
    images: ["https://tanie.me/og.webp"],
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
