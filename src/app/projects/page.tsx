import type { Metadata } from "next";
import Projects from "@/views/Projects";

export const metadata: Metadata = {
  title: "Projects | Tanie Lalwani",
  description:
    "Explore the portfolio projects, interactive web applications, performance work, and creative frontend engineering built by Tanie Lalwani.",
  alternates: {
    canonical: "https://tanie.me/projects",
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
  const projectsSchema = {
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
            name: "Projects",
            item: "https://tanie.me/projects",
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Featured Works & Web Applications by Tanie Lalwani",
        itemListElement: [
          {
            "@type": "CreativeWork",
            position: 1,
            name: "UAE ATS Resume Generator AI",
            description: "AI-powered Applicant Tracking System resume generator built for UAE recruiters.",
            url: "https://emiratescv.in",
          },
          {
            "@type": "CreativeWork",
            position: 2,
            name: "Viziona",
            description: "Responsive web application shaped around clear interaction, UI/UX design, and practical product execution.",
            url: "https://viziona.com",
          },
          {
            "@type": "CreativeWork",
            position: 3,
            name: "FinchPay",
            description: "Checkout performance overhaul focused on faster flows and smooth feedback.",
            url: "https://tanie.me/projects",
          },
          {
            "@type": "CreativeWork",
            position: 4,
            name: "Leafline",
            description: "Modern marketing site rebuild with responsive layouts and calm visual design.",
            url: "https://tanie.me/projects",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <Projects />
    </>
  );
}

