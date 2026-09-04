export interface ColorSwatch {
  name: string;
  hex: string;
  bgHex?: string;
  accentHex?: string;
  textHex?: string;
}

export interface FunctionalFlow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  idealFor: string;
  steps: {
    order: number;
    title: string;
    description: string;
    keyComponents: string[];
  }[];
  keyIntegrations: string[];
  typicalTimelineWeeks: string;
  investmentTier: string;
}

export interface AestheticStyle {
  id: string;
  name: string;
  tagline: string;
  category: "3D & Spatial" | "Modern SaaS" | "Editorial & Minimal" | "Bold & Pop" | "Cyber & Glow" | "Organic & Warm";
  badge: string;
  description: string;
  visualDna: string[];
  bestIndustries: string[];
  recommendedFlowId: string;
  defaultPalette: ColorSwatch[];
  palettes: {
    name: string;
    description: string;
    swatches: ColorSwatch[];
  }[];
  techStack: string[];
  features: string[];
  mockWireframe: {
    heroHeading: string;
    heroSubheading: string;
    ctaText: string;
    accentColor: string;
    bgColor: string;
    cardBg: string;
    textColor: string;
    badgeText: string;
  };
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  iconSvg?: string;
  tags?: string[];
}

export interface WizardQuestion {
  id: "industry" | "vibe" | "flow" | "scope" | "lead";
  title: string;
  subtitle: string;
  options?: QuestionOption[];
}

// ==============================================================================
// 1. SIGNATURE FUNCTIONAL FLOWS & ARCHITECTURES
// ==============================================================================
export const FUNCTIONAL_FLOWS: FunctionalFlow[] = [
  {
    id: "saas-growth-funnel",
    name: "SaaS Product & Growth Engine",
    tagline: "High-converting product storytelling with live feature simulations",
    description: "Designed for SaaS, Developer Tools, and AI platforms looking to maximize trial signups, enterprise demo bookings, and feature education.",
    idealFor: "B2B SaaS, AI Apps, Developer Tools, FinTech Startups",
    steps: [
      {
        order: 1,
        title: "Dynamic Value Hero",
        description: "Punchy headline with live product simulation, interactive toggle, and primary CTA.",
        keyComponents: ["Interactive UI Preview", "Social Proof Badges", "Email Capture Bar"]
      },
      {
        order: 2,
        title: "Interactive Bento Grid Features",
        description: "Staggered feature matrix with micro-interactions, live code snippets, and animated cards.",
        keyComponents: ["Interactive Feature Playground", "Animated Metrics", "Tabbed Workflows"]
      },
      {
        order: 3,
        title: "Enterprise Social Proof & Metrics",
        description: "Client testimonial carousel, security compliance badges (SOC2, GDPR), and growth stats.",
        keyComponents: ["Client Logo Marquee", "Video Testimonials", "Live Stats Ticker"]
      },
      {
        order: 4,
        title: "Tiered Pricing & ROI Calculator",
        description: "Monthly/Annual billing toggle, feature comparison matrix, and custom enterprise tier.",
        keyComponents: ["Pricing Switcher", "ROI Slider Calculator", "FAQ Accordion"]
      }
    ],
    keyIntegrations: ["Stripe / LemonSqueezy", "Supabase Auth", "PostHog Analytics", "Formspree / Hubspot"],
    typicalTimelineWeeks: "3 - 5 Weeks",
    investmentTier: "$3,200 - $5,500"
  },
  {
    id: "spatial-3d-walkthrough",
    name: "Interactive 3D Spatial Experience",
    tagline: "Immersive WebGL canvas with camera navigation & luxury spatial storytelling",
    description: "Engineered for luxury real estate developments, high-end architecture firms, and physical hardware launches needing cinematic 3D interaction.",
    idealFor: "Luxury Real Estate, Architecture Firms, Spatial Computing, Industrial Hardware",
    steps: [
      {
        order: 1,
        title: "Cinematic 3D Hero Canvas",
        description: "Full-viewport Three.js scene with orbit controls, camera fly-ins, and ambient soundscape.",
        keyComponents: ["Three.js WebGL Scene", "Camera Keyframe Triggers", "Audio Ambience Toggle"]
      },
      {
        order: 2,
        title: "Interactive Floorplan & Unit Explorer",
        description: "Interactive architectural floorplans with 360-degree hotspot inspection and daylight simulation.",
        keyComponents: ["3D Model Hotspots", "Day/Night Lighting Toggle", "Unit Filter Matrix"]
      },
      {
        order: 3,
        title: "Neighborhood & Lifestyle Map",
        description: "Interactive spatial map showcasing nearby amenities, dining, and transit times.",
        keyComponents: ["Mapbox Custom Layer", "Point-of-Interest Carousel", "Lifestyle Photography"]
      },
      {
        order: 4,
        title: "VIP Private Tour Reservation",
        description: "Private booking gateway with calendar integration and high-touch lead capture.",
        keyComponents: ["Cal.com / Calendly Sync", "VIP Inquiry Form", "Digital Brochure Download"]
      }
    ],
    keyIntegrations: ["Three.js / React Three Fiber", "GLTF/GLB Optimizers", "Cal.com Scheduler", "Supabase CRM"],
    typicalTimelineWeeks: "4 - 7 Weeks",
    investmentTier: "$4,500 - $8,500"
  },
  {
    id: "editorial-luxury-showcase",
    name: "Bespoke Editorial & Haute Portfolio",
    tagline: "Typographic mastery, asymmetric grids, and cinematic motion chapters",
    description: "Tailored for creative directors, fashion houses, high-end studios, and executive consultancies prioritizing prestige, authority, and curation.",
    idealFor: "Creative Directors, Fashion Houses, Architecture Studios, Boutique Consultancies",
    steps: [
      {
        order: 1,
        title: "Editorial Masthead & Typography Reveal",
        description: "Oversized typography pairs, scroll-linked headline expansion, and atmospheric video textures.",
        keyComponents: ["ScrollTrigger Text Scaling", "Fullscreen Ambient Video", "Index Table Navigation"]
      },
      {
        order: 2,
        title: "Curated Works & Project Chapters",
        description: "Asymmetrical masonry grid with cursor-following previews and project taxonomy filtering.",
        keyComponents: ["Magnetic Project Hover", "Custom Cursor Physics", "Detail Drawer System"]
      },
      {
        order: 3,
        title: "Philosophy, Press & Recognition",
        description: "Monochrome accolades index, published monographs, and client testimonial excerpts.",
        keyComponents: ["Accordion Manifesto", "Press Feature Logos", "Bespoke Audio Atmosphere"]
      },
      {
        order: 4,
        title: "Direct Commission & Studio Intake",
        description: "Private engagement inquiry with scope selector, budget gating, and direct calendar sync.",
        keyComponents: ["Custom Intake Flow", "Confidentiality NDA Checkbox", "Direct Email Dispatch"]
      }
    ],
    keyIntegrations: ["GSAP ScrollTrigger", "Lenis Smooth Scroll", "Vimeo API", "Formspree"],
    typicalTimelineWeeks: "3 - 5 Weeks",
    investmentTier: "$2,800 - $4,800"
  },
  {
    id: "client-portal-booking-engine",
    name: "Interactive Client Hub & Sprint Machine",
    tagline: "Full-stack client onboarding, milestone tracker, and e-contract execution",
    description: "For agencies and service businesses wanting an integrated client portal where clients can track project sprints, drop brand assets, and sign contracts.",
    idealFor: "Design Agencies, Development Studios, Freelance Collectives, High-Ticket Consultants",
    steps: [
      {
        order: 1,
        title: "Public Rate Card & Package Discovery",
        description: "Transparent package tiers with instant currency switcher (USD/INR) and feature breakdown.",
        keyComponents: ["Package Comparison Matrix", "Addon Selection Engine", "1-Click Lead Unlock"]
      },
      {
        order: 2,
        title: "Authenticated Client Workspace",
        description: "Secure login gateway with real-time sprint milestone stepper and status tracker.",
        keyComponents: ["Supabase Auth & Session", "Sprint Milestone Stepper", "Progress Bar Matrix"]
      },
      {
        order: 3,
        title: "Cloud Brand Asset Vault",
        description: "Secure drag-and-drop storage for logos, Figma links, media files, and project deliverables.",
        keyComponents: ["Cloud Storage Dropzone", "Category Tagging", "Direct Previewers"]
      },
      {
        order: 4,
        title: "Digital E-Contracts & Invoicing",
        description: "In-browser HTML5 canvas signature pad with IP/timestamp tracking and invoice triggers.",
        keyComponents: ["Canvas Signature Pad", "PDF Contract Vault", "Milestone Payment Links"]
      }
    ],
    keyIntegrations: ["Supabase Auth & Database", "Supabase Storage", "HTML5 Signature Canvas", "Stripe Checkout"],
    typicalTimelineWeeks: "4 - 6 Weeks",
    investmentTier: "$3,800 - $6,500"
  }
];

// ==============================================================================
// 2. SIGNATURE VISUAL AESTHETICS DATABASE
// ==============================================================================
export const AESTHETIC_STYLES: AestheticStyle[] = [
  {
    id: "3d-spatial-architecture",
    name: "Interactive 3D Spatial & Architecture",
    tagline: "WebGL spatial canvas with Three.js camera flythroughs and luxury tactile lighting",
    category: "3D & Spatial",
    badge: "Spatial & WebGL",
    description: "Transforms the browser into a navigable 3D world. Ideal for real estate developments, high-ticket spatial products, and architectural showcases where spatial immersion drives high conversions.",
    visualDna: [
      "Three.js / WebGL hardware-accelerated canvas",
      "Camera fly-in transitions triggered on scroll",
      "Dynamic lighting with shadow maps and metallic shaders",
      "Interactive 360-degree hotspot inspections"
    ],
    bestIndustries: ["Real Estate", "Architecture", "Luxury Hardware", "Metaverse / Gaming", "Automotive"],
    recommendedFlowId: "spatial-3d-walkthrough",
    defaultPalette: [
      { name: "Obsidian Void", hex: "#060a12", bgHex: "#060a12", textHex: "#ffffff" },
      { name: "Neon Cyan", hex: "#38bdf8", accentHex: "#38bdf8" },
      { name: "Cobalt Slate", hex: "#1e293b" },
      { name: "Pure White", hex: "#ffffff" }
    ],
    palettes: [
      {
        name: "Midnight Azure",
        description: "Deep obsidian backdrop with glowing cyan and metallic chrome accents.",
        swatches: [
          { name: "Canvas", hex: "#040814" },
          { name: "Primary", hex: "#0ea5e9" },
          { name: "Glow", hex: "#38bdf8" },
          { name: "Text", hex: "#f8fafc" }
        ]
      },
      {
        name: "Architectural Bronze",
        description: "Monochrome slate with warm champagne bronze and brushed titanium.",
        swatches: [
          { name: "Canvas", hex: "#0f1117" },
          { name: "Bronze", hex: "#d4af37" },
          { name: "Sand", hex: "#f5e6c8" },
          { name: "Text", hex: "#ffffff" }
        ]
      }
    ],
    techStack: ["Next.js 16 (Turbopack)", "Three.js", "React Three Fiber", "GSAP ScrollTrigger", "Tailwind CSS"],
    features: ["Interactive 3D Model Explorer", "Orbital Camera Controls", "Ambient Soundscape Engine", "Mobile Fallback Canvas"],
    mockWireframe: {
      heroHeading: "Sanctuary: Modern Architectural Living",
      heroSubheading: "Explore 42 ultra-luxury residential spaces with interactive 3D spatial tours and sunlight simulation.",
      ctaText: "Explore 3D Walkthrough",
      accentColor: "#0ea5e9",
      bgColor: "#090d16",
      cardBg: "rgba(15, 23, 42, 0.8)",
      textColor: "#ffffff",
      badgeText: "3D WebGL Experience"
    }
  },
  {
    id: "liquid-glassmorphism",
    name: "Liquid Glassmorphism & AI Glow",
    tagline: "Frosted translucent glass layers, glowing gradient borders, and reactive micro-interactions",
    category: "Modern SaaS",
    badge: "Most Popular for SaaS & AI",
    description: "The gold standard for modern tech platforms, SaaS applications, and AI products. Combines layered glass panels (`backdrop-blur-2xl`) with iridescent edge glows for an ultra-premium feel.",
    visualDna: [
      "Translucent frosted glass cards (backdrop-filter: blur)",
      "Animated gradient borders with subtle hover illumination",
      "Floating badges and interactive live metrics widgets",
      "Seamless dark mode and ocean light mode adaptability"
    ],
    bestIndustries: ["B2B SaaS", "AI Applications", "FinTech", "Developer Tools", "Crypto / Web3"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Deep Space", hex: "#030712", bgHex: "#030712", textHex: "#ffffff" },
      { name: "Electric Violet", hex: "#8b5cf6", accentHex: "#8b5cf6" },
      { name: "Neon Emerald", hex: "#10b981" },
      { name: "Frosted Mist", hex: "rgba(255,255,255,0.12)" }
    ],
    palettes: [
      {
        name: "Electric Prism",
        description: "Deep obsidian backdrop with purple-to-blue iridescent glowing borders.",
        swatches: [
          { name: "Canvas", hex: "#030712" },
          { name: "Neon Violet", hex: "#a855f7" },
          { name: "Cyan Spark", hex: "#06b6d4" },
          { name: "Text", hex: "#f9fafb" }
        ]
      },
      {
        name: "Ocean Frost",
        description: "Crisp light ocean backdrop with translucent white glass tiles and navy accents.",
        swatches: [
          { name: "Canvas", hex: "#dff4ff" },
          { name: "Sky Azure", hex: "#0284c7" },
          { name: "Glass Layer", hex: "rgba(255,255,255,0.75)" },
          { name: "Text", hex: "#082f49" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Tailwind CSS v4", "Framer Motion", "Lucide React", "Radix UI"],
    features: ["Interactive Bento Grid", "Live Code Runner / Demo", "Multi-Tier Pricing Table", "Real-time Metrics Dashboard"],
    mockWireframe: {
      heroHeading: "Autonomous AI Workflows for Modern Teams",
      heroSubheading: "Automate complex infrastructure and client pipelines with zero code and enterprise-grade security.",
      ctaText: "Start 14-Day Free Sprint",
      accentColor: "#6366f1",
      bgColor: "#080c1b",
      cardBg: "rgba(30, 41, 59, 0.7)",
      textColor: "#f8fafc",
      badgeText: "AI Engine v3.2 Active"
    }
  },
  {
    id: "minimalist-swiss-editorial",
    name: "Minimalist Swiss Editorial",
    tagline: "Striking typographic hierarchy, asymmetrical grid systems, and disciplined negative space",
    category: "Editorial & Minimal",
    badge: "Prestige & High Fashion",
    description: "Designed for discerning brands that command authority through restraint. Prioritizes editorial typesetting, monochrome discipline, and buttery smooth inertial scrolling.",
    visualDna: [
      "Strict asymmetric column grids with generous whitespace",
      "High-contrast editorial serif and geometric sans pairings",
      "Monochrome black and white base with a single signature accent",
      "Scroll-driven typography scaling and video clip masks"
    ],
    bestIndustries: ["Architecture", "High Fashion & Apparel", "Law & Executive Advisory", "Design Studios", "Boutique Hospitality"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Paper Bone", hex: "#fcfbf9", bgHex: "#fcfbf9", textHex: "#111111" },
      { name: "Rich Ink", hex: "#111111", accentHex: "#111111" },
      { name: "Vermilion Red", hex: "#e11d48" },
      { name: "Stone Slate", hex: "#71717a" }
    ],
    palettes: [
      {
        name: "Swiss Monochrome",
        description: "Pure crisp paper white with jet black ink and vermilion accents.",
        swatches: [
          { name: "Canvas", hex: "#ffffff" },
          { name: "Ink Black", hex: "#09090b" },
          { name: "Accent Red", hex: "#e11d48" },
          { name: "Border", hex: "#e4e4e7" }
        ]
      },
      {
        name: "Editorial Noir",
        description: "Matte carbon black with ivory cream text and champagne borders.",
        swatches: [
          { name: "Canvas", hex: "#0c0d0e" },
          { name: "Cream Text", hex: "#f4f4f0" },
          { name: "Champagne", hex: "#e2d4b7" },
          { name: "Muted Gray", hex: "#52525b" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Lenis Smooth Scroll", "SplitType", "GSAP", "Tailwind CSS"],
    features: ["Curated Case Studies Masonry", "Fullscreen Ambient Video Player", "Index Table Navigation", "Bespoke Typography Scale"],
    mockWireframe: {
      heroHeading: "Form, Function & Architectural Purity",
      heroSubheading: "Monographs, bespoke physical spaces, and curated objects designed with timeless spatial intent.",
      ctaText: "View Commissioned Works",
      accentColor: "#09090b",
      bgColor: "#fcfbf9",
      cardBg: "#ffffff",
      textColor: "#18181b",
      badgeText: "Edition 2026 Archive"
    }
  },
  {
    id: "neo-brutalist-pop",
    name: "Neo-Brutalist & High-Energy Pop",
    tagline: "Bold black borders, playful hard shadows, vibrant color blocking, and kinetic motion",
    category: "Bold & Pop",
    badge: "Viral & High Energy",
    description: "A rebellious, charismatic visual direction designed to stand out instantly. Features stark thick borders, saturated pastel cards, playful retro badges, and energetic spring physics.",
    visualDna: [
      "Stark black borders (2px - 3px) with zero blur drop shadows (box-shadow: 4px 4px 0 #000)",
      "Vibrant saturated candy pastels (bubblegum, lime, electric yellow)",
      "Playful stickers, marquee tickers, and spring physics micro-interactions",
      "Bold oversized display fonts with quirky geometric badges"
    ],
    bestIndustries: ["Gen-Z Consumer Apps", "Creative Agencies", "Web3 / NFT", "Events & Festivals", "E-Commerce Apparel"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Electric Lemon", hex: "#facc15", accentHex: "#facc15" },
      { name: "Neon Bubblegum", hex: "#f472b6" },
      { name: "Cyber Lime", hex: "#4ade80" },
      { name: "Ink Black", hex: "#000000", bgHex: "#fffbeb", textHex: "#000000" }
    ],
    palettes: [
      {
        name: "Tokyo Pop",
        description: "Warm cream canvas with lemon yellow, cyber lime, and jet black borders.",
        swatches: [
          { name: "Canvas", hex: "#fffdf0" },
          { name: "Lemon", hex: "#facc15" },
          { name: "Pink", hex: "#f472b6" },
          { name: "Ink", hex: "#000000" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Framer Motion (Spring Physics)", "Tailwind CSS v4", "Lucide React"],
    features: ["Interactive Drag & Drop Cards", "Marquee Review Stream", "Hard-Shadow Badge Components", "Playful Sound FX"],
    mockWireframe: {
      heroHeading: "Build Fast. Launch Loud. Get Noticed.",
      heroSubheading: "The all-in-one viral launchpad for modern creators, internet brands, and high-growth drops.",
      ctaText: "Claim Your Early Access",
      accentColor: "#facc15",
      bgColor: "#fefce8",
      cardBg: "#ffffff",
      textColor: "#000000",
      badgeText: "🔥 10k+ Creators Joined"
    }
  },
  {
    id: "cyberpunk-obsidian-glow",
    name: "Cyberpunk Obsidian & Holographic Glow",
    tagline: "Pitch-black canvas with animated neon grid scanlines, particle fields, and holographic sheen",
    category: "Cyber & Glow",
    badge: "Deep Tech & Crypto",
    description: "Engineered for bleeding-edge technology brands, decentralized protocols, and futuristic hardware. Features deep space canvas, responsive cursor particle fields, and holographic edge effects.",
    visualDna: [
      "Pure obsidian background with dynamic animated grid scanlines",
      "Holographic teal and magenta lighting gradients",
      "Canvas-driven interactive particle fields and matrix ripples",
      "Monospaced data indicators and terminal-inspired UI components"
    ],
    bestIndustries: ["Cybersecurity", "Crypto & DeFi Protocols", "Deep Tech / Robotics", "Gaming Platforms"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Obsidian Core", hex: "#02040a", bgHex: "#02040a", textHex: "#f0fdf4" },
      { name: "Holo Teal", hex: "#14b8a6", accentHex: "#14b8a6" },
      { name: "Plasma Violet", hex: "#a855f7" },
      { name: "Matrix Green", hex: "#22c55e" }
    ],
    palettes: [
      {
        name: "Holographic Matrix",
        description: "Dark carbon canvas with neon teal and plasma magenta glowing circuits.",
        swatches: [
          { name: "Canvas", hex: "#02040a" },
          { name: "Teal Glow", hex: "#14b8a6" },
          { name: "Magenta", hex: "#ec4899" },
          { name: "Text", hex: "#ecfeff" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Canvas 2D / WebGL Particles", "Tailwind CSS", "Framer Motion"],
    features: ["Interactive Particle Mesh", "Live Protocol Health Indicator", "Terminal Sandbox CLI", "Holographic Card Shaders"],
    mockWireframe: {
      heroHeading: "Next-Gen Cryptographic Security Engine",
      heroSubheading: "Zero-knowledge proofs and decentralized trust infrastructure built for planet-scale computation.",
      ctaText: "Initialize Node",
      accentColor: "#14b8a6",
      bgColor: "#02040a",
      cardBg: "rgba(10, 16, 28, 0.8)",
      textColor: "#ecfeff",
      badgeText: "Mainnet 3.0 Live"
    }
  },
  {
    id: "organic-pastel-serene",
    name: "Organic Pastel & Serene Motion",
    tagline: "Earthy terracotta, warm sage hues, soft pill geometry, and calming breathing animations",
    category: "Organic & Warm",
    badge: "Wellness & Lifestyle",
    description: "Designed for wellness, conscious lifestyle brands, interior studios, and organic luxury. Replaces cold digital harshness with soft tactile warmth, natural textures, and gentle micro-animations.",
    visualDna: [
      "Earthy warm color harmony (terracotta, sage, warm linen, sand)",
      "Soft pill containers, rounded media tiles, and natural drop shadows",
      "Gentle breathing animations and tranquil inertia scrolling",
      "Warm modern typography with elegant italicized emphasis words"
    ],
    bestIndustries: ["Wellness & Mental Health", "Boutique Hospitality", "Sustainable Goods", "Interior Architecture", "Organic Lifestyle"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Linen Sand", hex: "#fbf8f3", bgHex: "#fbf8f3", textHex: "#292524" },
      { name: "Terracotta Clay", hex: "#c26d53", accentHex: "#c26d53" },
      { name: "Sage Eucalyptus", hex: "#879883" },
      { name: "Warm Charcoal", hex: "#292524" }
    ],
    palettes: [
      {
        name: "Warm Earth",
        description: "Soothing linen canvas with rich terracotta and sage botanical accents.",
        swatches: [
          { name: "Canvas", hex: "#fbf8f3" },
          { name: "Terracotta", hex: "#c26d53" },
          { name: "Sage", hex: "#879883" },
          { name: "Charcoal", hex: "#292524" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Framer Motion", "Tailwind CSS", "Google Fonts Outfit"],
    features: ["Smooth Inertia Carousel", "Tactile Audio Ambience", "Lookbook Grid", "Curated Rituals Flow"],
    mockWireframe: {
      heroHeading: "Sanctuary for the Mind, Body & Living Space",
      heroSubheading: "Crafted organic living essentials designed to foster stillness, connection, and mindful everyday rituals.",
      ctaText: "Explore the Collection",
      accentColor: "#c26d53",
      bgColor: "#fbf8f3",
      cardBg: "#ffffff",
      textColor: "#292524",
      badgeText: "100% Sustainable & Handcrafted"
    }
  },
  {
    id: "kinetic-typography-story",
    name: "Kinetic Typography & Storytelling",
    tagline: "Massive scroll-pinned text reveals, video masks, split-word physics, and magnetic cursor flow",
    category: "Editorial & Minimal",
    badge: "Creative Studios & Film",
    description: "Turn your website into a cinematic scrollable film. Perfect for directors, creative agencies, and bold portfolios that prioritize narrative impact and artistic distinction.",
    visualDna: [
      "Massive scroll-pinned text that expands into full-screen video windows",
      "Kinetic split-text animations responding dynamically to scroll velocity",
      "Magnetic custom cursor that warps around interactive hotspots",
      "Seamless audio visualizers and embedded video chapter transitions"
    ],
    bestIndustries: ["Creative Production", "Film & Commercial Directors", "Music Studios & Artists", "Bespoke Design Agencies"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Matte Black", hex: "#0a0a0c", bgHex: "#0a0a0c", textHex: "#ffffff" },
      { name: "Solar Gold", hex: "#fbbf24", accentHex: "#fbbf24" },
      { name: "Ghost White", hex: "#fafafa" },
      { name: "Steel Gray", hex: "#4b5563" }
    ],
    palettes: [
      {
        name: "Cinema Noir",
        description: "Matte cinema black with solar gold accents and crisp silver typography.",
        swatches: [
          { name: "Canvas", hex: "#0a0a0c" },
          { name: "Solar Gold", hex: "#fbbf24" },
          { name: "Silver", hex: "#e5e7eb" },
          { name: "Charcoal", hex: "#1f2937" }
        ]
      }
    ],
    techStack: ["Next.js 16", "GSAP ScrollTrigger", "SplitType", "Lenis", "Tailwind CSS"],
    features: ["Scroll-driven Video Masking", "Magnetic Cursor Physics", "Split-word Typography Physics", "Soundtrack Player"],
    mockWireframe: {
      heroHeading: "We Craft Visual Stories That Refuse To Be Ignored",
      heroSubheading: "Award-winning commercial direction, interactive brand experiences, and cinematic creative campaigns.",
      ctaText: "Watch Showreel 2026",
      accentColor: "#fbbf24",
      bgColor: "#0a0a0c",
      cardBg: "#16181d",
      textColor: "#ffffff",
      badgeText: "Cannes Lion & Awwwards Studio"
    }
  },
  {
    id: "b2b-saas-conversion-engine",
    name: "B2B SaaS High-Conversion Engine",
    tagline: "Data-dense Bento grids, live ROI calculators, interactive feature demos, and sticky conversion funnels",
    category: "Modern SaaS",
    badge: "Maximum Conversion Focus",
    description: "Built strictly to turn visitors into paying enterprise accounts and qualified pipeline. Engineered with high-density Bento grids, interactive ROI calculators, and sticky conversion mechanics.",
    visualDna: [
      "High-density Bento grid modules with live interactive widgets",
      "Interactive ROI calculator with dynamic sliders and payback period graphs",
      "Sticky navigation with live sign-up trigger and floating testimonial proof",
      "Multi-tab feature matrix comparing old workflows vs. modern automated workflows"
    ],
    bestIndustries: ["B2B Software", "Analytics & Data Warehousing", "Enterprise HR & Ops", "FinTech & Payments"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Slate Canvas", hex: "#0f172a", bgHex: "#0f172a", textHex: "#ffffff" },
      { name: "Electric Blue", hex: "#2563eb", accentHex: "#2563eb" },
      { name: "Mint Emerald", hex: "#34d399" },
      { name: "Pure White", hex: "#ffffff" }
    ],
    palettes: [
      {
        name: "Enterprise Navy",
        description: "Polished deep navy with vibrant royal blue and emerald growth green.",
        swatches: [
          { name: "Canvas", hex: "#0b1120" },
          { name: "Primary Blue", hex: "#2563eb" },
          { name: "Metric Green", hex: "#10b981" },
          { name: "Text", hex: "#f8fafc" }
        ]
      }
    ],
    techStack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Recharts / Tremor", "Supabase Auth"],
    features: ["Interactive ROI Payback Calculator", "Bento Grid Feature System", "Multi-Seat Tier Configurator", "Customer Case Study Carousels"],
    mockWireframe: {
      heroHeading: "Scale Enterprise Revenue With Automated Intelligence",
      heroSubheading: "Close 3x more deals, automate onboarding, and unify multi-channel data into a single source of truth.",
      ctaText: "Book Enterprise Demo",
      accentColor: "#3b82f6",
      bgColor: "#0b1120",
      cardBg: "rgba(15, 23, 42, 0.9)",
      textColor: "#ffffff",
      badgeText: "Trusted by 500+ High-Growth Teams"
    }
  }
];

// ==============================================================================
// 3. WIZARD QUESTIONNAIRE DATA (GLOBAL & SITE-FOCUSED)
// ==============================================================================
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "industry",
    title: "What type of website or digital experience are you building?",
    subtitle: "Select the primary format so we can tailor the layout structure and conversion flow.",
    options: [
      { id: "landing-launchpad", label: "High-Converting Landing Page & Launchpad", description: "Focused single-page conversion for new products, drops, or campaigns" },
      { id: "interactive-3d", label: "Interactive 3D / Spatial Experience", description: "Immersive Three.js WebGL canvas, 3D model exploration, tactile depth" },
      { id: "saas-webapp", label: "Modern Web Application & SaaS Platform", description: "Feature-dense Bento grids, live product simulations, user onboarding" },
      { id: "portfolio-studio", label: "Bespoke Portfolio & Studio Showcase", description: "Editorial typography, asymmetric grids, case studies, showreels" },
      { id: "ecommerce-flagship", label: "Flagship E-Commerce & Product Spotlight", description: "Interactive product configurators, rich media galleries, brand storytelling" },
      { id: "client-portal", label: "Interactive Client Portal & Service Hub", description: "Client dashboard, milestone tracker, digital contracts, and asset vault" }
    ]
  },
  {
    id: "vibe",
    title: "What visual vibe and aesthetic appeals to you most?",
    subtitle: "Every aesthetic creates a distinct emotional impression and sets you apart from competitors.",
    options: [
      { id: "glassmorphism", label: "Liquid Glassmorphism & AI Glow", description: "Translucent frosted cards, glowing gradient borders, modern tech feel" },
      { id: "3d-interactive", label: "Interactive 3D & WebGL Canvas", description: "Hardware-accelerated 3D models, spatial flythroughs, luxury depth" },
      { id: "swiss-editorial", label: "Minimalist Swiss Editorial", description: "Stark typography, asymmetric grids, black & white mastery" },
      { id: "neo-brutalist", label: "Neo-Brutalist & High-Energy Pop", description: "Bold black borders, saturated pastel cards, playful viral energy" },
      { id: "cyberpunk", label: "Cyberpunk Obsidian & Holographic Glow", description: "Pitch-black canvas, neon teal/magenta gridlines, particle fields" },
      { id: "organic-warm", label: "Organic Pastel & Serene Motion", description: "Earthy terracotta, warm sand, soothing breathing animations" }
    ]
  },
  {
    id: "flow",
    title: "What is the primary functional flow for your website?",
    subtitle: "The flow defines how visitors navigate from initial awareness to taking high-value actions.",
    options: [
      { id: "saas-growth-funnel", label: "SaaS Product & Growth Funnel", description: "Hero product demo -> Bento grid features -> ROI calculator -> Pricing matrix" },
      { id: "spatial-3d-walkthrough", label: "3D Spatial Walkthrough & Hotspot Explorer", description: "3D canvas model -> Unit/product inspection -> Spatial map -> Private VIP booking" },
      { id: "editorial-luxury-showcase", label: "Curated Works, Case Studies & Showreels", description: "Fullscreen video reveal -> Project chapters -> Accordion manifesto -> Commission intake" },
      { id: "client-portal-booking-engine", label: "Client Hub, E-Contracts & File Vault", description: "Package discovery -> Authenticated dashboard -> Sprint milestones -> E-signatures" }
    ]
  },
  {
    id: "scope",
    title: "What is your target launch timeline & sprint scope?",
    subtitle: "Helps us recommend the best milestone structure and technical deliverables for your build.",
    options: [
      { id: "mvp-sprint", label: "Fast MVP Sprint (2 - 3 Weeks)", description: "High-impact landing page + key functional flow ready for immediate launch" },
      { id: "custom-flagship", label: "Custom Flagship Build (4 - 6 Weeks)", description: "Full multi-page architecture, bespoke animations, and integrated client tools" },
      { id: "enterprise-bespoke", label: "Enterprise Custom Architecture (6 - 8+ Weeks)", description: "Complete custom WebGL 3D, client portal, database integrations, and tailored CMS" }
    ]
  }
];

// ==============================================================================
// 4. RECOMMENDATION MATCHING ENGINE
// ==============================================================================
export interface WizardAnswers {
  industry: string;
  vibe: string;
  flow: string;
  scope: string;
  client_name?: string;
  client_email?: string;
  company_name?: string;
}

export function calculateAestheticRecommendation(answers: Partial<WizardAnswers>): {
  primaryStyle: AestheticStyle;
  matchedFlow: FunctionalFlow;
  alternativeStyles: AestheticStyle[];
  matchScore: number;
} {
  // Determine Primary Style
  let primaryStyle = AESTHETIC_STYLES[0]; // fallback
  if (answers.vibe === "3d-interactive" || answers.industry === "interactive-3d") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "3d-spatial-architecture") || AESTHETIC_STYLES[0];
  } else if (answers.vibe === "glassmorphism" || answers.industry === "saas-webapp") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "liquid-glassmorphism") || AESTHETIC_STYLES[1];
  } else if (answers.vibe === "swiss-editorial" || answers.industry === "portfolio-studio") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "minimalist-swiss-editorial") || AESTHETIC_STYLES[2];
  } else if (answers.vibe === "neo-brutalist" || answers.industry === "landing-launchpad") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "neo-brutalist-pop") || AESTHETIC_STYLES[3];
  } else if (answers.vibe === "cyberpunk") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "cyberpunk-obsidian-glow") || AESTHETIC_STYLES[4];
  } else if (answers.vibe === "organic-warm" || answers.industry === "ecommerce-flagship") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "organic-pastel-serene") || AESTHETIC_STYLES[5];
  } else if (answers.industry === "client-portal") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "b2b-saas-conversion-engine") || AESTHETIC_STYLES[7];
  }

  // Determine Matched Flow
  const targetFlowId = answers.flow || primaryStyle.recommendedFlowId;
  const matchedFlow = FUNCTIONAL_FLOWS.find((f) => f.id === targetFlowId) || FUNCTIONAL_FLOWS[0];

  // Alternative Styles
  const alternativeStyles = AESTHETIC_STYLES.filter((s) => s.id !== primaryStyle.id).slice(0, 3);

  // Match score calculation
  let score = 92;
  if (answers.industry && answers.vibe && answers.flow) score = 98;
  else if (answers.industry && answers.vibe) score = 95;

  return {
    primaryStyle,
    matchedFlow,
    alternativeStyles,
    matchScore: score
  };
}
