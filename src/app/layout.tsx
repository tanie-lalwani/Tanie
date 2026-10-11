import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Bodoni_Moda } from "next/font/google";
import "../index.css";
import AppProviders from "@/components/AppProviders";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tanie.me"),
  title: {
    default: "Tanie Lalwani | Creative and Full Stack Developer",
    template: "%s | Tanie Lalwani",
  },
  description:
    "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Building interactive 3D WebGL experiences and modern web applications.",
  applicationName: "Tanie",
  authors: [{ name: "Tanie Lalwani", url: "https://tanie.me" }],
  creator: "Tanie Lalwani",
  publisher: "Tanie Lalwani",
  keywords: [
    "Tanie Lalwani",
    "Creative Developer",
    "Full Stack Developer",
    "React Developer",
    "Three.js Developer",
    "Next.js Developer",
    "WebGL 3D Websites",
    "Creative Technologist",
    "Frontend Engineer",
    "Interactive Web Applications",
    "Luxury Websites & WebGL",
  ],
  alternates: {
    canonical: "https://tanie.me/",
    types: {
      "text/markdown": "/llms.txt",
    },
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
  icons: {
    icon: "/circular_favicon.png?v=icon1",
    shortcut: "/circular_favicon.png?v=icon1",
    apple: "/circular_favicon.png?v=icon1",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tanie.me/",
    siteName: "Tanie Lalwani",
    title: "Tanie Lalwani | Creative and Full Stack Developer",
    description:
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Building interactive 3D WebGL experiences and high-converting web applications.",
    images: [
      {
        url: "https://tanie.me/og.webp",
        width: 1672,
        height: 941,
        alt: "Tanie Lalwani | Creative and Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tanielalwani",
    creator: "@tanielalwani",
    title: "Tanie Lalwani | Creative and Full Stack Developer",
    description:
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js.",
    images: ["https://tanie.me/og.webp"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-id",
    other: {
      "msvalidate.01": "EDD728E9B87B2E690DC2EB9CB968C1B0",
    },
  },
  other: {
    "msvalidate.01": "EDD728E9B87B2E690DC2EB9CB968C1B0",
    abstract:
      "Tanie Lalwani is a creative full-stack developer building interactive WebGL/Three.js web experiences, Next.js apps, and luxury landing pages.",
    summary:
      "Creative & full-stack developer specializing in React, Next.js, TypeScript, Three.js, and interactive 3D web experiences.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Person", "ProfessionalService"],
      "@id": "https://tanie.me/#person",
      name: "Tanie Lalwani",
      givenName: "Tanie",
      familyName: "Lalwani",
      alternateName: ["Tanie", "Tanie Lalwani", "tanielalwani"],
      url: "https://tanie.me/",
      image: "https://tanie.me/og.webp",
      mainEntityOfPage: "https://tanie.me/",
      jobTitle: "Creative & Full-Stack Developer",
      description:
        "Tanie Lalwani is a creative full-stack developer specializing in React, Next.js, TypeScript, Three.js, and interactive 3D WebGL web applications.",
      email: "tanielalwani@gmail.com",
      priceRange: "$$",
      currenciesAccepted: "USD, INR, AED, GBP, EUR, CAD, AUD",
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "WebGL",
        "Creative Development",
        "Frontend Engineering",
        "Full-Stack Web Development",
        "Interactive 3D Web Experiences",
        "Performance Optimization & Core Web Vitals",
        "UI/UX Design Systems",
      ],
      sameAs: [
        "https://github.com/tanie-lalwani",
        "https://linkedin.com/in/tanie-lalwani/",
        "https://x.com/tanielalwani",
        "https://instagram.com/tanie.mp3",
        "https://me.developers.google.com/u/tanielalwani",
      ],
      offers: {
        "@type": "Offer",
        category: "Web Development, 3D WebGL Experiences, and Creative Web Engineering",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://tanie.me/pricing",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://tanie.me/#website",
      url: "https://tanie.me/",
      name: "Tanie Lalwani Portfolio & Web Studio",
      alternateName: "Tanie Lalwani",
      description:
        "Official portfolio and creative web engineering showcase of Tanie Lalwani.",
      publisher: {
        "@id": "https://tanie.me/#person",
      },
      about: {
        "@id": "https://tanie.me/#person",
      },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://tanie.me/#profile-page",
      url: "https://tanie.me/",
      name: "Tanie Lalwani | Creative and Full Stack Developer",
      isPartOf: {
        "@id": "https://tanie.me/#website",
      },
      mainEntity: {
        "@id": "https://tanie.me/#person",
      },
      about: {
        "@id": "https://tanie.me/#person",
      },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${bodoniModa.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="help"
          href="/llms.txt"
          type="text/markdown"
          title="LLM Agent Manifest"
        />
        <link
          rel="alternate"
          href="/llms-full.txt"
          type="text/markdown"
          title="Full Agent Knowledge Base"
        />
        <script
          id="schema-org-jsonld"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
