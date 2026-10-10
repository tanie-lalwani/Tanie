import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tanie.me";

  const aiAgents = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Applebot",
    "Applebot-Extended",
    "cohere-ai",
    "Bytespider",
    "Diffbot",
    "CCBot",
    "OAI-SearchBot",
    "DuckAssistBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/client/",
          "/auth/",
          "/_next/",
        ],
      },
      ...aiAgents.map((agent) => ({
        userAgent: agent,
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/client/",
          "/auth/",
          "/_next/",
        ],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
