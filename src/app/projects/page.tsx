import type { Metadata } from "next";
import Projects from "@/views/Projects";

export const metadata: Metadata = {
  title: "Projects | Tanie Lalwani",
  description:
    "Explore the portfolio projects, interactive web applications, performance work, and creative frontend engineering built by Tanie Lalwani.",
  alternates: {
    canonical: "https://tanie.me/projects",
  },
  openGraph: {
    title: "Projects | Tanie Lalwani",
    description:
      "Explore the portfolio projects, interactive web applications, performance work, and creative frontend engineering built by Tanie Lalwani.",
    url: "https://tanie.me/projects",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Tanie Lalwani",
    description:
      "Explore the portfolio projects, interactive web applications, performance work, and creative frontend engineering built by Tanie Lalwani.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function ProjectsPage() {
  return <Projects />;
}
