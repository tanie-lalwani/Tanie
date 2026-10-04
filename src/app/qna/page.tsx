import type { Metadata } from "next";
import QnA from "@/views/QnA";
import botKnowledge from "@/data/botKnowledge.json";

export const metadata: Metadata = {
  title: "Frontend Developer Interview Q&A | Tanie Lalwani",
  description:
    "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
  alternates: {
    canonical: "https://tanie.me/qna",
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
    title: "Frontend Developer Interview Q&A | Tanie Lalwani",
    description:
      "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
    url: "https://tanie.me/qna",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Developer Interview Q&A | Tanie Lalwani",
    description:
      "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function QnAPage() {
  const qnaSchema = {
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
            name: "Q&A",
            item: "https://tanie.me/qna",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: botKnowledge.map((item) => ({
          "@type": "Question",
          name: item.title,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.content,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qnaSchema) }}
      />
      <QnA />
    </>
  );
}

