import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Bodoni_Moda } from "next/font/google";
import "../index.css";
import AppProviders from "@/components/AppProviders";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark light",
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
    "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
  applicationName: "Tanie",
  authors: [{ name: "Tanie Lalwani", url: "https://tanie.me" }],
  creator: "Tanie Lalwani",
  publisher: "Tanie Lalwani",
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
    siteName: "Tanie",
    title: "Tanie Lalwani | Creative and Full Stack Developer",
    description:
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
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
      "Tanie Lalwani is a creative full-stack developer specializing in React.js, TypeScript, Three.js, and Next.js. Explore her portfolio, projects, experience, and interactive web development.",
    images: ["https://tanie.me/og.webp"],
  },
  other: {
    "msvalidate.01": "EDD728E9B87B2E690DC2EB9CB968C1B0",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://tanie.me/#person",
      name: "Tanie Lalwani",
      alternateName: ["Tanie"],
      url: "https://tanie.me/",
      image: "https://tanie.me/og.webp",
      mainEntityOfPage: "https://tanie.me/",
      jobTitle: "Creative & Full-Stack Developer",
      description:
        "Tanie Lalwani is a creative full-stack developer based in India specializing in React, TypeScript, Three.js, and Next.js, building interactive 3D web experiences, landing pages, and frontend applications.",
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "Frontend Development",
        "Creative Development",
        "Interactive Web Experiences",
        "WebGL",
        "Performance Optimization"
      ],
      sameAs: [
        "https://github.com/tanie-lalwani",
        "https://instagram.com/tanie.mp3",
        "https://linkedin.com/in/tanie-lalwani/",
        "https://x.com/tanielalwani",
        "https://me.developers.google.com/u/tanielalwani",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://tanie.me/#website",
      url: "https://tanie.me/",
      name: "Tanie Lalwani Portfolio",
      alternateName: "Tanie",
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
    {
      "@type": "CreativeWork",
      "@id": "https://tanie.me/#project-viziona-webapp-1",
      name: "Viziona",
      description: "A web project built by Tanie Lalwani.",
      url: "https://viziona.com",
      codeRepository: "https://github.com/tanie-lalwani/viziona",
      author: {
        "@id": "https://tanie.me/#person",
      },
      about: {
        "@id": "https://tanie.me/#person",
      },
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
