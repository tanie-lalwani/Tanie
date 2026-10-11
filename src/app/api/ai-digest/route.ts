import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const acceptHeader = req.headers.get("accept") || "";
  const wantsMarkdown =
    acceptHeader.includes("text/markdown") || url.searchParams.get("format") === "markdown";

  const manifest = {
    developer: {
      name: "Tanie Lalwani",
      brand: "tanie.me",
      title: "Creative & Full-Stack Developer",
      tagline: "Building interactive, responsive, personality-filled web experiences.",
      email: "tanielalwani@gmail.com",
      website: "https://tanie.me",
      workModel: "Global / Remote",
      socials: {
        github: "https://github.com/tanie-lalwani",
        linkedin: "https://linkedin.com/in/tanie-lalwani/",
        x: "https://x.com/tanielalwani",
        instagram: "https://instagram.com/tanie.mp3",
        googleDevelopers: "https://me.developers.google.com/u/tanielalwani",
      },
    },
    skills: [
      "React",
      "Next.js (App Router)",
      "TypeScript",
      "Three.js",
      "WebGL",
      "Tailwind CSS",
      "Framer Motion",
      "Supabase",
      "Core Web Vitals Optimization",
      "UI/UX Design Systems",
    ],
    featuredProjects: [
      {
        name: "UAE ATS Resume Generator AI",
        description: "AI-powered resume generator engineered for ATS compliance.",
        url: "https://emiratescv.in",
        stack: ["React", "TypeScript", "AI / LLM", "Tailwind CSS"],
      },
      {
        name: "Viziona",
        description: "Responsive web application shaped around clear interaction and practical execution.",
        url: "https://viziona.com",
        github: "https://github.com/tanie-lalwani/viziona",
        stack: ["React", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "FinchPay",
        description: "Frontend checkout performance overhaul focused on fast flows and low friction.",
        url: "https://tanie.me/projects",
        stack: ["React", "TypeScript", "Performance Auditing"],
      },
      {
        name: "Leafline",
        description: "Modern marketing site rebuild with clear typography and responsive layout.",
        url: "https://tanie.me/projects",
        stack: ["React", "Next.js", "Tailwind CSS"],
      },
      {
        name: "Interactive 3D Portfolio",
        description: "Creative WebGL ocean experience with custom shaders, 3D physics, and sound design.",
        url: "https://tanie.me",
        stack: ["Three.js", "WebGL", "Next.js", "Framer Motion"],
      },
    ],
    packages: [
      { id: "luxury-landing-sprint", name: "Luxury Landing Sprint", usd: 99, inr: 4999, aed: 370 },
      { id: "sales-website-engine", name: "Sales Website Engine", usd: 999, inr: 49999, aed: 3650 },
      { id: "interactive-3d-experience", name: "Interactive 3D Experience", usd: 899, inr: 39999, aed: 3270 },
      { id: "portals-dashboards-suite", name: "Portals & Dashboards Suite", usd: 499, inr: 24999, aed: 1820 },
      { id: "fullstack-saas-app", name: "Full-Stack SaaS App", usd: 999, inr: 49999, aed: 3650 },
      { id: "custom-bespoke-build", name: "Custom Bespoke Build", usd: 1199, inr: 59999, aed: 4390 },
    ],
    llmsTxt: "https://tanie.me/llms.txt",
    llmsFullTxt: "https://tanie.me/llms-full.txt",
  };

  if (wantsMarkdown) {
    const md = `# Tanie Lalwani – Developer Manifest (tanie.me)
**Name**: Tanie Lalwani
**Role**: Creative & Full-Stack Developer
**Work Model**: Global / Remote
**Email**: tanielalwani@gmail.com
**Website**: https://tanie.me

## Core Skills
${manifest.skills.map((s) => `- ${s}`).join("\n")}

## Featured Projects
${manifest.featuredProjects.map((p) => `- **${p.name}** (${p.url}): ${p.description}`).join("\n")}

## Service Packages & Starting Rates
${manifest.packages.map((pkg) => `- **${pkg.name}**: $${pkg.usd} / ₹${pkg.inr.toLocaleString()} / ${pkg.aed} AED`).join("\n")}

Full Knowledge Base: https://tanie.me/llms-full.txt
`;
    return new NextResponse(md, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
