import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/tanie-lalwani",
        permanent: false,
      },
      {
        source: "/instagram",
        destination: "https://instagram.com/tanie.mp3",
        permanent: false,
      },
      {
        source: "/linkedin",
        destination: "https://www.linkedin.com/in/tanie-lalwani/",
        permanent: false,
      },
      {
        source: "/x",
        destination: "https://x.com/tanielalwani",
        permanent: false,
      },
      {
        source: "/gdev",
        destination: "https://me.developers.google.com/u/tanielalwani",
        permanent: false,
      },
      {
        source: "/google",
        destination: "https://me.developers.google.com/u/tanielalwani",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/terms#privacy",
        permanent: true,
      },
      {
        source: "/refund-policy",
        destination: "/terms#refunds",
        permanent: true,
      },
      {
        source: "/shipping-policy",
        destination: "/terms#delivery",
        permanent: true,
      },
      {
        source: "/client-portal",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/admin-portal",
        destination: "/admin",
        permanent: true,
      },
      // Auth & Login aliases
      {
        source: "/login",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/signin",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth",
        permanent: true,
      },
      // Client Portal typos & aliases
      {
        source: "/clients",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/clientportal",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/client_portal",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/portal",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/workspace",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/client",
        permanent: true,
      },
      // Admin typos & aliases
      {
        source: "/adminportal",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin_portal",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/studio-admin",
        destination: "/admin",
        permanent: true,
      },
      // Pricing typos & aliases
      {
        source: "/prcing",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/price",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/prices",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/plans",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/rates",
        destination: "/pricing",
        permanent: true,
      },
      // Contact typos & aliases
      {
        source: "/conatct",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/contct",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/reach",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/get-in-touch",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/hire",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/book",
        destination: "/contact",
        permanent: true,
      },
      // Projects & Works typos & aliases
      {
        source: "/project",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projcts",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/works",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/projects",
        permanent: true,
      },
      // Packages & Services typos & aliases
      {
        source: "/package",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/pakages",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/service",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/packages",
        permanent: true,
      },
      // FAQ typos & aliases
      {
        source: "/faqs",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/faq",
        permanent: true,
      },
      {
        source: "/questions",
        destination: "/faq",
        permanent: true,
      },
      // Legal & Terms typos & aliases
      {
        source: "/tos",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/legal",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/policy",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/policies",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      // QnA typos & aliases
      {
        source: "/qa",
        destination: "/qna",
        permanent: true,
      },
      {
        source: "/bot",
        destination: "/qna",
        permanent: true,
      },
      {
        source: "/interview",
        destination: "/qna",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
