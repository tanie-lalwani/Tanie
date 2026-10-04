import type { Metadata } from "next";
import FaqView from "@/views/FaqView";
import { faqTranslations } from "@/data/faqTranslations";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
  description:
    "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
  alternates: {
    canonical: "https://tanie.me/faq",
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
    title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
    description:
      "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
    url: "https://tanie.me/faq",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Tanie Lalwani",
    description:
      "Find answers to frequently asked questions about custom website packages, 3D WebGL experiences, pricing, turnaround times, payments, and client deliverables.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function FaqPage() {
  const faqSchema = {
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
            name: "FAQ",
            item: "https://tanie.me/faq",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqTranslations.en.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer.join(" "),
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqView />
    </>
  );
}

