export type BotKnowledgeEntry = {
  title: string
  content: string
  keywords: string[]
}

export const botKnowledge: BotKnowledgeEntry[] = [
  {
    title: "Introduction",
    content:
      "Tanie Lalwani is a creative frontend developer who builds interactive websites, 3D web experiences, and modern responsive web applications with React, TypeScript, and thoughtful frontend engineering.",
    keywords: ["about", "who are you", "intro", "introduce", "tanie", "developer"],
  },
  {
    title: "Core stack",
    content:
      "The portfolio emphasizes React, TypeScript, Tailwind CSS, motion design, accessibility, performance, component systems, and creative development.",
    keywords: ["stack", "skills", "react", "typescript", "tailwind", "motion", "accessibility", "performance"],
  },
  {
    title: "Work sample: Viziona",
    content:
      "Viziona is a responsive web application centered on clear interaction, UI/UX design, and practical product execution.",
    keywords: ["viziona", "project", "work", "sample", "portfolio project"],
  },
  {
    title: "Work sample: FinchPay",
    content:
      "Checkout Performance Overhaul - FinchPay is a frontend performance optimization pass focused on faster checkout flows, clearer states, and smoother feedback.",
    keywords: ["finchpay", "performance", "checkout", "optimization", "speed"],
  },
  {
    title: "Work sample: Leafline",
    content:
      "Marketing Site Rebuild - Leafline is a modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system.",
    keywords: ["leafline", "marketing site", "rebuild", "landing page"],
  },
  {
    title: "About section",
    content:
      "The about section says Tanie is a frontend and React developer who likes clean TypeScript workflows, polished interactions, UI/UX design details, and useful web development with personality.",
    keywords: ["about me", "experience", "frontend", "react developer", "ui/ux", "personality"],
  },
  {
    title: "Contact",
    content:
      "The contact section invites project inquiries, portfolio work, interactive experiences, modern frontend builds, and landing pages with intention.",
    keywords: ["contact", "hire", "email", "reach out", "project inquiry"],
  },
]
