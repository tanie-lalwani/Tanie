import type { Metadata } from "next";
import QnA from "@/views/QnA";

export const metadata: Metadata = {
  title: "Frontend Interview Q&A | Tanie Lalwani",
  description:
    "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
  alternates: {
    canonical: "https://tanie.me/qna",
  },
  openGraph: {
    title: "Frontend Interview Q&A | Tanie Lalwani",
    description:
      "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
    url: "https://tanie.me/qna",
    type: "website",
    images: ["https://tanie.me/og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frontend Interview Q&A | Tanie Lalwani",
    description:
      "Interactive frontend developer interview questions and answers by Tanie Lalwani covering React, TypeScript, Next.js, Three.js, performance optimization, and engineering philosophy.",
    images: ["https://tanie.me/og.webp"],
  },
};

export default function QnAPage() {
  return <QnA />;
}
