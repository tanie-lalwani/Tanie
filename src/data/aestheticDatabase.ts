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
  imageUrl?: string;
  badge?: string;
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
  category: "3D & Spatial" | "Modern SaaS & Bento" | "Editorial & Luxury" | "Retro, Cyber & Y2K" | "Pop & Brutalist" | "Tactile & Organic" | "Artistic & Avant-Garde";
  badge: string;
  imageUrl?: string;
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
  imageUrl?: string;
  badge?: string;
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
    imageUrl: "/aesthetics/saas_bento.jpg",
    badge: "Growth Engine",
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
    imageUrl: "/aesthetics/spatial_3d.jpg",
    badge: "Spatial Journey",
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
    imageUrl: "/aesthetics/portfolio_studio.jpg",
    badge: "Curated Showcase",
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
    imageUrl: "/aesthetics/client_portal.jpg",
    badge: "Client Hub Engine",
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
  },
  {
    id: "product-configurator-flow",
    name: "3D Product Configurator & Commerce Flow",
    tagline: "Real-time 3D customizer, tactile materials, and instant checkout",
    description: "Designed for premium DTC products, furniture, luxury hardware, and custom merchandise needing interactive 3D customization.",
    idealFor: "Luxury Hardware, High-End Furniture, Custom Apparel, Automotive Gear",
    imageUrl: "/aesthetics/product_configurator.jpg",
    badge: "Interactive Commerce",
    steps: [
      {
        order: 1,
        title: "360° Interactive Canvas",
        description: "Real-time 3D model viewport with turntable rotation, part explode view, and lighting changes.",
        keyComponents: ["Three.js PBR Shaders", "Material Swatch Switcher", "Exploded Part Animation"]
      },
      {
        order: 2,
        title: "Tactile Spec Sheet & Live Pricing",
        description: "Dynamic pricing calculator updating immediately as options, colors, and materials change.",
        keyComponents: ["Live Price Calculator", "Dimensions Blueprint", "Weight/Material Specs"]
      },
      {
        order: 3,
        title: "High-Resolution Media Gallery",
        description: "Lookbook photography showcasing the selected configuration in real lifestyle environments.",
        keyComponents: ["Filtered Lookbook", "Zoom Lens Inspector", "Video Showcases"]
      },
      {
        order: 4,
        title: "One-Click Checkout & Pre-Order",
        description: "Seamless cart drawer with Stripe/Shopify checkout and instant order confirmation.",
        keyComponents: ["Stripe Cart Drawer", "Order Spec Summary", "Digital Receipt Vault"]
      }
    ],
    keyIntegrations: ["Three.js / R3F", "Shopify Buy SDK / Stripe", "Cloudflare Images", "PostHog"],
    typicalTimelineWeeks: "4 - 6 Weeks",
    investmentTier: "$3,600 - $6,200"
  },
  {
    id: "scroll-narrative-flow",
    name: "Scroll-Driven Narrative & Brand Story",
    tagline: "Horizontal timeline chapters, video mask reveals, and editorial immersion",
    description: "Built for visionary companies, documentary releases, creative studios, and product launches with a profound narrative to tell.",
    idealFor: "Brand Manifestos, Film & Production Houses, Sustainable Startups, Executive Memoirs",
    imageUrl: "/aesthetics/scroll_narrative.jpg",
    badge: "Cinematic Narrative",
    steps: [
      {
        order: 1,
        title: "Scroll-Pinned Video Masthead",
        description: "Oversized typography that smoothly shrinks and pins as background video fades into scene.",
        keyComponents: ["GSAP ScrollTrigger Pin", "Autoplay Video Texture", "Ambient Audio Ambience"]
      },
      {
        order: 2,
        title: "Horizontal Chapter Milestones",
        description: "Smooth horizontal scroll section traversing historical timeline, achievements, and visions.",
        keyComponents: ["Virtual Horizontal Scroll", "Interactive Year Ticker", "Milestone Drawers"]
      },
      {
        order: 3,
        title: "Impact Metrics & Global Data",
        description: "Live animated counter metrics, interactive global map, and customer quotes.",
        keyComponents: ["Animated Numbers", "Interactive SVG Map", "Testimonial Audio Player"]
      },
      {
        order: 4,
        title: "Direct Commission & Media Kit",
        description: "VIP partnership intake form and one-click press kit download.",
        keyComponents: ["VIP Contact Form", "Press Kit PDF Download", "Social Presence Marquee"]
      }
    ],
    keyIntegrations: ["GSAP ScrollTrigger", "Lenis Smooth Scroll", "Vimeo Player API", "Supabase CRM"],
    typicalTimelineWeeks: "3 - 5 Weeks",
    investmentTier: "$3,000 - $5,200"
  }
];

// ==============================================================================
// 2. SIGNATURE VISUAL AESTHETICS DATABASE (18 REAL-WORLD DESIGN STYLES)
// ==============================================================================
export const AESTHETIC_STYLES: AestheticStyle[] = [
  {
    id: "3d-spatial-architecture",
    name: "Interactive 3D Spatial & Architecture",
    tagline: "WebGL spatial canvas with Three.js camera flythroughs and luxury tactile lighting",
    category: "3D & Spatial",
    badge: "Spatial & WebGL",
    imageUrl: "/aesthetics/spatial_3d.jpg",
    description: "Transforms the browser into a navigable 3D world. Ideal for real estate developments, spatial products, and architectural firms where spatial immersion drives prestige and sales.",
    visualDna: [
      "Three.js / WebGL hardware-accelerated canvas",
      "Camera fly-in transitions triggered on scroll",
      "Dynamic lighting with shadow maps and metallic shaders",
      "Interactive 360-degree hotspot inspections"
    ],
    bestIndustries: ["Real Estate", "Architecture", "Luxury Hardware", "Automotive", "Spatial Computing"],
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
          { name: "Void", hex: "#060a12" },
          { name: "Cyan", hex: "#38bdf8" },
          { name: "Slate", hex: "#1e293b" },
          { name: "White", hex: "#ffffff" }
        ]
      },
      {
        name: "Emerald Monolith",
        description: "Architectural dark forest green with bright mint specular highlights.",
        swatches: [
          { name: "Monolith", hex: "#051311" },
          { name: "Mint Glow", hex: "#34d399" },
          { name: "Olive Tint", hex: "#132e27" },
          { name: "Bone White", hex: "#f0fdf4" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Three.js / React Three Fiber", "Tailwind CSS", "GSAP"],
    features: ["Hardware Accelerated 3D", "Camera Orbit Controls", "Floorplan Hotspots", "Day/Night Simulation"],
    mockWireframe: {
      heroHeading: "Spatial Architecture Built for the Future",
      heroSubheading: "Navigate luxury residential towers and architectural masterworks with interactive WebGL camera flythroughs.",
      ctaText: "Explore 3D Units",
      accentColor: "#38bdf8",
      bgColor: "#060a12",
      cardBg: "#0f172a",
      textColor: "#ffffff",
      badgeText: "Real-Time 3D Rendering"
    }
  },
  {
    id: "liquid-glassmorphism",
    name: "Liquid Glassmorphism & AI Glow",
    tagline: "Frosted translucent surfaces, chromatic specular borders, and ethereal lighting",
    category: "Modern SaaS & Bento",
    badge: "Frosted Glass & AI",
    imageUrl: "/aesthetics/glassmorphism_vibe.jpg",
    description: "Multi-layered frosted glass panels with dynamic background blur, glowing pastel gradients, and refractive border highlights. Perfect for modern AI applications, SaaS platforms, and next-gen tools.",
    visualDna: [
      "Frosted glass `backdrop-blur-xl` containers",
      "Dynamic multi-stop animated gradient borders",
      "Soft radial ambient glow orbs moving beneath content",
      "Subtle 1px specular lighting outlines"
    ],
    bestIndustries: ["AI Products", "Modern Web Apps", "FinTech", "Creative Cloud Tools", "DevTools"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Deep Nebula", hex: "#080b18", bgHex: "#080b18", textHex: "#ffffff" },
      { name: "Violet Ray", hex: "#818cf8", accentHex: "#818cf8" },
      { name: "Cyan Mist", hex: "#38bdf8" },
      { name: "Frosted White", hex: "rgba(255,255,255,0.85)" }
    ],
    palettes: [
      {
        name: "Electric Violet",
        description: "Luminescent violet and cyan highlights on deep space velvet canvas.",
        swatches: [
          { name: "Space Canvas", hex: "#080b18" },
          { name: "Violet", hex: "#818cf8" },
          { name: "Cyan", hex: "#38bdf8" },
          { name: "Highlight", hex: "#ffffff" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Tailwind CSS v4", "Framer Motion", "Supabase Auth"],
    features: ["Interactive Glass Card Physics", "Floating Ambient Orbs", "Live Metric Sparklines", "Dynamic Dark/Light Refraction"],
    mockWireframe: {
      heroHeading: "Next-Gen AI Intelligence Platform",
      heroSubheading: "Automate complex engineering workflows with real-time generative agents and frosted glass dashboards.",
      ctaText: "Start Free 14-Day Trial",
      accentColor: "#818cf8",
      bgColor: "#080b18",
      cardBg: "rgba(255, 255, 255, 0.06)",
      textColor: "#ffffff",
      badgeText: "AI Powered v4.2"
    }
  },
  {
    id: "minimalist-swiss-editorial",
    name: "Minimalist Swiss Design (International Style)",
    tagline: "Disciplined mathematical grids, stark typography, asymmetric whitespace, and pure focus",
    category: "Editorial & Luxury",
    badge: "Swiss Precision",
    imageUrl: "/aesthetics/swiss_minimalism.jpg",
    description: "Rooted in the prestigious International Typographic Style. High-contrast black and white, strict column grids, oversized sans-serif titles, and unapologetic whitespace.",
    visualDna: [
      "Rigid 12-column mathematical grid layouts",
      "Oversized sans-serif headlines paired with micro metadata captions",
      "Zero decorative fluff: content is the visual hero",
      "Stark black & white contrast with optional singular highlight hue"
    ],
    bestIndustries: ["Architecture Studios", "Industrial Design", "Contemporary Art", "High-End Consultancies", "Publishing"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Pure Chalk", hex: "#fcfcfd", bgHex: "#fcfcfd", textHex: "#09090b" },
      { name: "Obsidian Ink", hex: "#09090b", accentHex: "#09090b" },
      { name: "International Orange", hex: "#ea580c" },
      { name: "Slate Neutral", hex: "#71717a" }
    ],
    palettes: [
      {
        name: "Zurich Monochrome",
        description: "High-contrast stark ink black on chalk white with vivid Swiss orange accents.",
        swatches: [
          { name: "Chalk", hex: "#fcfcfd" },
          { name: "Ink Black", hex: "#09090b" },
          { name: "Swiss Orange", hex: "#ea580c" },
          { name: "Neutral Slate", hex: "#71717a" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Lenis Smooth Scroll", "Tailwind CSS", "Inter / Helvetica Neue"],
    features: ["Mathematical Grid Lines", "Cursor Hover Project Drawers", "Index-Style Taxonomy Filter", "Responsive Micro-Type"],
    mockWireframe: {
      heroHeading: "Form Follows Function & Rigorous Precision",
      heroSubheading: "A studio dedicated to architectural monographs, industrial product design, and timeless digital identities.",
      ctaText: "View Monograph Index",
      accentColor: "#ea580c",
      bgColor: "#fcfcfd",
      cardBg: "#ffffff",
      textColor: "#09090b",
      badgeText: "International Style 2026"
    }
  },
  {
    id: "bento-grid-modern-ui",
    name: "Bento Grid System & Modern SaaS",
    tagline: "Apple-inspired modular segmented cards, live telemetry widgets, and maximum data clarity",
    category: "Modern SaaS & Bento",
    badge: "Modular Bento",
    imageUrl: "/aesthetics/bento_grid.jpg",
    description: "Organizes diverse capabilities into dense, structured, rounded Bento modules. Visitors instantly grasp product depth through micro-interactive cards, live charts, and animated toggles.",
    visualDna: [
      "Modular rounded cards in variable aspect ratios (1x1, 2x1, 2x2)",
      "High information density with intuitive hierarchy",
      "Interactive widgets inside cards (toggles, sliders, live charts)",
      "Polished dark slate canvas with subtle inner card lighting"
    ],
    bestIndustries: ["Developer Tools", "Analytics Platforms", "Project Management", "FinTech Apps", "Cloud Infrastructure"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Midnight Slate", hex: "#0b0f19", bgHex: "#0b0f19", textHex: "#f8fafc" },
      { name: "Electric Azure", hex: "#3b82f6", accentHex: "#3b82f6" },
      { name: "Emerald Signal", hex: "#10b981" },
      { name: "Muted Steel", hex: "#64748b" }
    ],
    palettes: [
      {
        name: "Hyper Slate",
        description: "Midnight slate background with electric blue interactive toggles and emerald status lights.",
        swatches: [
          { name: "Canvas", hex: "#0b0f19" },
          { name: "Azure", hex: "#3b82f6" },
          { name: "Emerald", hex: "#10b981" },
          { name: "Text", hex: "#f8fafc" }
        ]
      }
    ],
    techStack: ["Next.js 16", "React 19", "Tremor / Recharts", "Tailwind CSS"],
    features: ["Interactive Bento Matrix", "Real-time Telemetry Graphs", "Feature Toggle Playgrounds", "Multi-seat ROI Calculator"],
    mockWireframe: {
      heroHeading: "Unified Command Center for Modern Teams",
      heroSubheading: "Deploy apps, monitor infrastructure health, and collaborate in real-time within a modular Bento workspace.",
      ctaText: "Explore Bento Matrix",
      accentColor: "#3b82f6",
      bgColor: "#0b0f19",
      cardBg: "#131b2e",
      textColor: "#f8fafc",
      badgeText: "SOC2 & GDPR Ready"
    }
  },
  {
    id: "neo-brutalist-pop",
    name: "Neo-Brutalist & High-Energy Pop",
    tagline: "Thick black 3px borders, saturated candy pastels, retro drop shadows, and playful stickers",
    category: "Pop & Brutalist",
    badge: "Bold & Viral Pop",
    imageUrl: "/aesthetics/neobrutalism_vibe.jpg",
    description: "High-voltage design style loved by Gen-Z brands, creator tools, and viral startups. Features unapologetic black outlines, offset box-shadows, playful stickers, and vibrant candy colors.",
    visualDna: [
      "Thick solid black borders (`border-3 border-black`)",
      "Hard non-blurred drop shadows (`shadow-[4px_4px_0px_#000]`)",
      "Playful rotated badge stickers and retro icons",
      "Vivid high-saturation pastel color blocks"
    ],
    bestIndustries: ["Creator Tools", "Web3 / Gaming", "DTC Youth Brands", "Music Festivals", "Viral Consumer Apps"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Pop Yellow", hex: "#fde047", bgHex: "#fef9c3", textHex: "#000000" },
      { name: "Bubble Pink", hex: "#f472b6", accentHex: "#f472b6" },
      { name: "Sky Aqua", hex: "#38bdf8" },
      { name: "Pitch Black", hex: "#000000" }
    ],
    palettes: [
      {
        name: "Electric Arcade",
        description: "Saturated pastel yellow, candy pink, and cyan with stark black outlines.",
        swatches: [
          { name: "Pastel Yellow", hex: "#fef08a" },
          { name: "Candy Pink", hex: "#f472b6" },
          { name: "Cyan Pop", hex: "#38bdf8" },
          { name: "Black Line", hex: "#000000" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Tailwind CSS", "Framer Motion Springs", "Google Fonts Outfit"],
    features: ["Tactile Hard-Shadow Buttons", "Spring Physics Micro-Interactions", "Marquee Sticker Banners", "Interactive Sound Bites"],
    mockWireframe: {
      heroHeading: "Turn Followers Into Customers Effortlessly",
      heroSubheading: "The creator monetization platform built for high velocity drops, digital memberships, and viral growth.",
      ctaText: "Claim Your Handle",
      accentColor: "#f472b6",
      bgColor: "#fef08a",
      cardBg: "#ffffff",
      textColor: "#000000",
      badgeText: "🚀 Over $10M Paid to Creators"
    }
  },
  {
    id: "cyberpunk-obsidian-glow",
    name: "Cyberpunk & Neon HUD Matrix",
    tagline: "Dark obsidian canvas, matrix scanlines, neon teal/magenta gridlines, and HUD telemetry",
    category: "Retro, Cyber & Y2K",
    badge: "Obsidian & Hologram",
    imageUrl: "/aesthetics/cyberpunk_vibe.jpg",
    description: "High-octane sci-fi aesthetic with glowing neon gridlines, matrix terminal logs, holographic crosshair targeting, and futuristic telemetry widgets.",
    visualDna: [
      "Pure obsidian pitch-black backdrop (`#02040a`)",
      "Glowing neon cyan (`#00ffff`) and hot magenta (`#ff007f`) accents",
      "Subtle CRT monitor scanline textures and glitch shaders",
      "HUD telemetry data feeds and monospaced terminal logs"
    ],
    bestIndustries: ["Cybersecurity", "Blockchain & Crypto", "Gaming Studios", "DeepTech Hardware", "AI Labs"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Obsidian Core", hex: "#02040a", bgHex: "#02040a", textHex: "#ffffff" },
      { name: "Neon Cyan", hex: "#00ffff", accentHex: "#00ffff" },
      { name: "Cyber Magenta", hex: "#ff007f" },
      { name: "Terminal Green", hex: "#00ff66" }
    ],
    palettes: [
      {
        name: "Matrix Neon",
        description: "Pure black canvas with glowing electric cyan, hot magenta, and terminal green accents.",
        swatches: [
          { name: "Black Void", hex: "#02040a" },
          { name: "Neon Cyan", hex: "#00ffff" },
          { name: "Cyber Magenta", hex: "#ff007f" },
          { name: "Terminal Green", hex: "#00ff66" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Three.js Glitch Shaders", "Tailwind CSS", "Google Fonts Orbitron"],
    features: ["Interactive HUD Crosshair Cursor", "Live Terminal Typing Simulator", "Matrix Telemetry Feed", "Audio Glitch Ambience"],
    mockWireframe: {
      heroHeading: "Zero-Trust Autonomous Security Shield",
      heroSubheading: "Neutralize complex vector threats before execution with real-time neural network telemetry and quantum isolation.",
      ctaText: "Deploy Terminal Node",
      accentColor: "#00ffff",
      bgColor: "#02040a",
      cardBg: "#0b0f19",
      textColor: "#ffffff",
      badgeText: "SYSTEM PROTOCOL ACTIVE"
    }
  },
  {
    id: "dark-mode-luxury",
    name: "Dark Mode Luxury & Obsidian Glow",
    tagline: "Deep obsidian navy canvas, ambient glowing rings, precision hairline borders, and commanding Didot serif",
    category: "Editorial & Luxury",
    badge: "Luxury & Didot",
    imageUrl: "/aesthetics/dark_luxury.jpg",
    description: "The gold standard for ultra-luxury brands, hypercar studios, haute horlogerie, and elite executive services. Deep oceanic navy with subtle cyan ambient glow rings and elegant serif typography.",
    visualDna: [
      "Deep oceanic obsidian navy canvas (`#04111b`)",
      "Subtle glowing ambient light rings and specular halos",
      "Hairline borders with delicate 10% opacity white lines",
      "Commanding Didot / Bodoni Moda serif typography paired with micro sans"
    ],
    bestIndustries: ["Haute Horlogerie (Watches)", "Luxury Automotive", "Private Wealth", "High-End Real Estate", "Bespoke Jewelry"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Obsidian Navy", hex: "#04111b", bgHex: "#04111b", textHex: "#f3f6fa" },
      { name: "Ambient Cyan", hex: "#38bdf8", accentHex: "#38bdf8" },
      { name: "Deep Cobalt", hex: "#0a2233" },
      { name: "Platinum White", hex: "#ffffff" }
    ],
    palettes: [
      {
        name: "Oceanic Sovereign",
        description: "Deep obsidian navy with cyan ambient lighting rings and crisp platinum white serif headlines.",
        swatches: [
          { name: "Navy Void", hex: "#04111b" },
          { name: "Cyan Halo", hex: "#38bdf8" },
          { name: "Cobalt Depth", hex: "#0a2233" },
          { name: "Platinum", hex: "#ffffff" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Lenis Smooth Scroll", "Bodoni Moda", "Framer Motion"],
    features: ["Hairline Precision Layouts", "Ambient Light Halo Cursor", "Curated Collection Chapters", "Private Commission Gateway"],
    mockWireframe: {
      heroHeading: "The Pure Art of Motion & Mastery",
      heroSubheading: "Curated bespoke hypercars, fine horological pieces, and masterwork engineering for sovereign collectors.",
      ctaText: "Discover the Atelier",
      accentColor: "#38bdf8",
      bgColor: "#04111b",
      cardBg: "#0a2233",
      textColor: "#ffffff",
      badgeText: "Bespoke Commission Only"
    }
  },
  {
    id: "organic-pastel-serene",
    name: "Wabi-Sabi & Organic Warmth",
    tagline: "Linen sand, terracotta clay, ceramic textures, earthy tones, and mindful breathing motion",
    category: "Tactile & Organic",
    badge: "Earthy & Serene",
    imageUrl: "/aesthetics/organic_warm_vibe.jpg",
    description: "Embraces organic beauty, natural textures, and Japanese zen tranquility. Earthy terracotta, warm sand, and sage eucalyptus tones create an oasis of stillness.",
    visualDna: [
      "Natural linen sand backdrop (`#fbf8f3`) with terracotta clay accents",
      "Soft breathing animations with gentle easing curves",
      "Imperfect organic ceramic curves and tactile photography",
      "Elegant serif headings paired with airy warm neutral body copy"
    ],
    bestIndustries: ["Wellness & Meditation", "Sustainable Architecture", "Organic Skincare", "Ceramic Studios", "Boutique Hospitality"],
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
          { name: "Linen Sand", hex: "#fbf8f3" },
          { name: "Terracotta", hex: "#c26d53" },
          { name: "Sage Leaf", hex: "#879883" },
          { name: "Charcoal Ink", hex: "#292524" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Framer Motion", "Tailwind CSS", "Outfit / Cormorant"],
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
    id: "y2k-retro-chromecore",
    name: "Y2K Aesthetic & Chromecore",
    tagline: "Liquid metallic chrome 3D typography, glossy jelly pill buttons, and early 2000s cyber optimism",
    category: "Retro, Cyber & Y2K",
    badge: "Liquid Chrome 3D",
    imageUrl: "/aesthetics/y2k_chromecore.jpg",
    description: "Nostalgic, glossy, and futuristic millennium design. Liquid chrome metallic emblems, aqua jelly pill buttons, holographic badges, and bold early 2000s cyber aesthetics.",
    visualDna: [
      "Liquid chrome 3D text textures with specular glints",
      "Glossy translucent jelly pill buttons with inner highlights",
      "Holographic holographic badges and iridescent stickers",
      "Futuristic early 2000s UI window containers"
    ],
    bestIndustries: ["Fashion Drops", "Music Artists & DJs", "Gen-Z DTC Brands", "Creative Collectives", "Event Production"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Chrome Silver", hex: "#c0c0c0", bgHex: "#0f0c29", textHex: "#ffffff" },
      { name: "Aqua Jelly", hex: "#38bdf8", accentHex: "#38bdf8" },
      { name: "Bubblegum Pink", hex: "#ff69b4" },
      { name: "Deep Cyber Void", hex: "#0f0c29" }
    ],
    palettes: [
      {
        name: "Millennium Chrome",
        description: "Liquid chrome silver with aqua jelly and hot bubblegum pink glows.",
        swatches: [
          { name: "Cyber Void", hex: "#0f0c29" },
          { name: "Chrome Silver", hex: "#c0c0c0" },
          { name: "Aqua Jelly", hex: "#38bdf8" },
          { name: "Bubblegum", hex: "#ff69b4" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Three.js Chrome Shaders", "Tailwind CSS", "Framer Motion"],
    features: ["Liquid Chrome Emblem Shaders", "Glossy Jelly Pill Hover Physics", "Holographic Stamp Physics", "Retro Sound Effects"],
    mockWireframe: {
      heroHeading: "Enter the Cyber Millennium Frontier",
      heroSubheading: "Limited streetwear drops, liquid chrome audio plugins, and interactive virtual world experiences.",
      ctaText: "Access the Drop",
      accentColor: "#ff69b4",
      bgColor: "#0f0c29",
      cardBg: "#1b143f",
      textColor: "#ffffff",
      badgeText: "CHROMECORE APPROVED 2000"
    }
  },
  {
    id: "kinetic-typography-story",
    name: "Kinetic Typography & Storytelling",
    tagline: "Massive scroll-pinned text reveals, video masks, split-word physics, and magnetic cursor flow",
    category: "Artistic & Avant-Garde",
    badge: "Motion & Split-Text",
    imageUrl: "/aesthetics/kinetic_type.jpg",
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
    id: "ethereal-ambient-mist",
    name: "Ethereal & Ambient Mist",
    tagline: "Bioluminescent glows, floating celestial clouds, shimmering iridescent materials, and soothing depth",
    category: "Artistic & Avant-Garde",
    badge: "Celestial Glow",
    imageUrl: "/aesthetics/ethereal_mist.jpg",
    description: "Celestial, luminous, and floating. Transports visitors into an ambient dreamscape with shimmering iridescent materials, soft particle mist, and bioluminescent typography.",
    visualDna: [
      "Floating celestial ambient clouds with soft radial blur",
      "Iridescent glass materials shifting hue based on mouse angle",
      "Bioluminescent glowing text with gentle pulsating animations",
      "Deep celestial navy canvas with stardust particle fields"
    ],
    bestIndustries: ["Luxury Perfumery", "Meditation & Sound Healing", "Contemporary Jewelry", "Artistic Perfume Houses"],
    recommendedFlowId: "editorial-luxury-showcase",
    defaultPalette: [
      { name: "Celestial Void", hex: "#020617", bgHex: "#020617", textHex: "#ffffff" },
      { name: "Bioluminescent Cyan", hex: "#38bdf8", accentHex: "#38bdf8" },
      { name: "Stardust Violet", hex: "#a855f7" },
      { name: "Iridescent Pink", hex: "#ec4899" }
    ],
    palettes: [
      {
        name: "Nebula Shimmer",
        description: "Celestial midnight canvas with bioluminescent cyan, violet stardust, and iridescent pink accents.",
        swatches: [
          { name: "Celestial Void", hex: "#020617" },
          { name: "Cyan Mist", hex: "#38bdf8" },
          { name: "Violet Ray", hex: "#a855f7" },
          { name: "Iridescent Pink", hex: "#ec4899" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Three.js Particle Systems", "Tailwind CSS", "Framer Motion"],
    features: ["Floating Celestial Cloud Shaders", "Iridescent Glass Distortion", "Soundscape Player", "Micro Stardust Particles"],
    mockWireframe: {
      heroHeading: "Awaken Sensory Wonder & Celestial Stillness",
      heroSubheading: "Haute botanical perfumery, bespoke vibrational soundscapes, and transcendent spatial aromas.",
      ctaText: "Explore the Ritual",
      accentColor: "#a855f7",
      bgColor: "#020617",
      cardBg: "#0c1329",
      textColor: "#ffffff",
      badgeText: "Celestial Alchemy"
    }
  },
  {
    id: "claymorphism-soft-3d",
    name: "Claymorphism (Soft Tactile 3D)",
    tagline: "Chubby rounded 3D clay cards, dual inner shadows, marshmallow softness, and tactile bounce",
    category: "Tactile & Organic",
    badge: "Soft Tactile 3D",
    imageUrl: "/aesthetics/claymorphism.jpg",
    description: "Soft, fluffy, and tactile. Chubby pillowy 3D clay cards with dual inner shadows, soft ambient occlusion, marshmallow softness, and joyful spring physics.",
    visualDna: [
      "Chubby rounded cards (`rounded-3xl`) with dual inner shadows",
      "Soft ambient occlusion drop shadows creating floating tactile depth",
      "Marshmallow bouncy spring micro-interactions on click/hover",
      "Playful pastel palettes with soothing tactile button physics"
    ],
    bestIndustries: ["EdTech & Learning Apps", "Children & Family Products", "Creative Productivity Apps", "Playful SaaS"],
    recommendedFlowId: "saas-growth-funnel",
    defaultPalette: [
      { name: "Marshmallow Canvas", hex: "#f8fafc", bgHex: "#f8fafc", textHex: "#1e293b" },
      { name: "Clay Sky Blue", hex: "#38bdf8", accentHex: "#38bdf8" },
      { name: "Bubblegum Clay", hex: "#f472b6" },
      { name: "Slate Shadow", hex: "#cbd5e1" }
    ],
    palettes: [
      {
        name: "Playful Marshmallow",
        description: "Soft marshmallow canvas with pillowy clay blue and bubblegum pink tactile buttons.",
        swatches: [
          { name: "Marshmallow", hex: "#f8fafc" },
          { name: "Clay Blue", hex: "#38bdf8" },
          { name: "Clay Pink", hex: "#f472b6" },
          { name: "Shadow Tint", hex: "#94a3b8" }
        ]
      }
    ],
    techStack: ["Next.js 16", "Tailwind CSS", "Framer Motion Spring Physics", "Google Fonts Nunito"],
    features: ["Dual Inner Shadow Physics", "Marshmallow Press Physics", "Interactive Clay Switchers", "Playful Audio Cues"],
    mockWireframe: {
      heroHeading: "Learning Made Delightfully Tactile & Fun",
      heroSubheading: "Interactive problem-solving, playful badges, and collaborative spaces designed for modern minds.",
      ctaText: "Start Playing Free",
      accentColor: "#38bdf8",
      bgColor: "#f8fafc",
      cardBg: "#ffffff",
      textColor: "#1e293b",
      badgeText: "⭐ 4.9/5 Rating (50K+ Families)"
    }
  }
];

// ==============================================================================
// 3. WIZARD QUESTIONNAIRE DATA (EXPANDED & COMPREHENSIVE)
// ==============================================================================
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: "industry",
    title: "What type of website or digital experience are you building?",
    subtitle: "Select the primary format so we can tailor the layout structure, information density, and conversion flow.",
    options: [
      {
        id: "landing-launchpad",
        label: "High-Converting Landing Page & Launchpad",
        description: "Focused single-page conversion for new products, drops, apps, or prioritized campaigns",
        imageUrl: "/aesthetics/landing_launchpad.jpg",
        badge: "Single Page Launch"
      },
      {
        id: "interactive-3d",
        label: "Interactive 3D / Spatial Experience",
        description: "Immersive Three.js WebGL canvas, 3D model exploration, camera flythroughs, tactile depth",
        imageUrl: "/aesthetics/spatial_3d.jpg",
        badge: "WebGL / Three.js"
      },
      {
        id: "saas-webapp",
        label: "Modern SaaS Platform & Web Application",
        description: "Feature-dense Bento grids, live product simulations, telemetry dashboards, user onboarding",
        imageUrl: "/aesthetics/saas_bento.jpg",
        badge: "SaaS & Dashboard"
      },
      {
        id: "portfolio-studio",
        label: "Bespoke Studio Portfolio & Showreel",
        description: "Editorial typography, asymmetric grids, award-winning case studies, showreels",
        imageUrl: "/aesthetics/portfolio_studio.jpg",
        badge: "Editorial & Agency"
      },
      {
        id: "ecommerce-flagship",
        label: "Flagship E-Commerce & Product Drop",
        description: "Interactive product configurators, rich media lookbooks, tactile specs, high-conversion checkout",
        imageUrl: "/aesthetics/ecommerce_flagship.jpg",
        badge: "E-Commerce Flagship"
      },
      {
        id: "client-portal",
        label: "Interactive Client Portal & Service Hub",
        description: "Authenticated client dashboard, sprint milestone stepper, digital contracts, and asset vault",
        imageUrl: "/aesthetics/client_portal.jpg",
        badge: "Portal & Workflows"
      },
      {
        id: "scroll-narrative",
        label: "Scroll-Driven Cinematic Narrative",
        description: "Horizontal timeline chapters, video mask reveals, and editorial storytelling immersion",
        imageUrl: "/aesthetics/scroll_narrative.jpg",
        badge: "Storytelling & Chapters"
      },
      {
        id: "product-configurator",
        label: "3D Product Configurator & Customizer",
        description: "Real-time 3D model customization, live color/material switcher, and 360° rotation",
        imageUrl: "/aesthetics/product_configurator.jpg",
        badge: "3D Customizer"
      }
    ]
  },
  {
    id: "vibe",
    title: "What visual vibe and aesthetic appeals to you most?",
    subtitle: "Every aesthetic creates a distinct emotional impression and sets your brand apart in the market.",
    options: [
      {
        id: "glassmorphism",
        label: "Liquid Glassmorphism & AI Glow",
        description: "Translucent frosted cards, glowing gradient borders, modern tech feel",
        imageUrl: "/aesthetics/glassmorphism_vibe.jpg",
        badge: "Frosted Glass & AI"
      },
      {
        id: "3d-interactive",
        label: "Interactive 3D & WebGL Canvas",
        description: "Hardware-accelerated 3D models, spatial flythroughs, luxury depth",
        imageUrl: "/aesthetics/spatial_3d.jpg",
        badge: "3D Spatial Canvas"
      },
      {
        id: "swiss-editorial",
        label: "Minimalist Swiss Design",
        description: "Stark typography, disciplined mathematical grids, black & white mastery",
        imageUrl: "/aesthetics/swiss_minimalism.jpg",
        badge: "Swiss Precision"
      },
      {
        id: "bento-grid",
        label: "Bento Grid System",
        description: "Apple-style modular rounded cards, high data density, micro-interactions",
        imageUrl: "/aesthetics/bento_grid.jpg",
        badge: "Modular Bento"
      },
      {
        id: "neo-brutalist",
        label: "Neo-Brutalist & High-Energy Pop",
        description: "Bold 3px black borders, saturated pastel cards, playful retro stickers",
        imageUrl: "/aesthetics/neobrutalism_vibe.jpg",
        badge: "Bold & Viral Pop"
      },
      {
        id: "cyberpunk",
        label: "Cyberpunk & Neon HUD Matrix",
        description: "Pitch-black canvas, neon teal/magenta gridlines, terminal telemetry",
        imageUrl: "/aesthetics/cyberpunk_vibe.jpg",
        badge: "Obsidian & Hologram"
      },
      {
        id: "dark-mode-luxury",
        label: "Dark Mode Luxury & Obsidian Glow",
        description: "Deep obsidian navy canvas, ambient lighting rings, refined Didot serif",
        imageUrl: "/aesthetics/dark_luxury.jpg",
        badge: "Luxury & Didot"
      },
      {
        id: "organic-warm",
        label: "Wabi-Sabi & Organic Warmth",
        description: "Earthy terracotta, warm sand, ceramic textures, soothing calm motion",
        imageUrl: "/aesthetics/organic_warm_vibe.jpg",
        badge: "Earthy & Serene"
      },
      {
        id: "y2k-retro",
        label: "Y2K Aesthetic & Chromecore",
        description: "Liquid chrome 3D typography, glossy jelly buttons, 2000s cyber optimism",
        imageUrl: "/aesthetics/y2k_chromecore.jpg",
        badge: "Liquid Chrome 3D"
      },
      {
        id: "kinetic-typography",
        label: "Kinetic Typography & Storytelling",
        description: "Massive scroll-pinned text reveals, video masks, split-word physics",
        imageUrl: "/aesthetics/kinetic_type.jpg",
        badge: "Motion & Split-Text"
      },
      {
        id: "ethereal",
        label: "Ethereal & Ambient Mist",
        description: "Bioluminescent glows, celestial clouds, shimmering iridescent glass",
        imageUrl: "/aesthetics/ethereal_mist.jpg",
        badge: "Celestial Glow"
      },
      {
        id: "claymorphism",
        label: "Claymorphism (Soft Tactile 3D)",
        description: "Chubby rounded 3D clay cards, dual inner shadows, marshmallow softness",
        imageUrl: "/aesthetics/claymorphism.jpg",
        badge: "Soft Tactile 3D"
      }
    ]
  },
  {
    id: "flow",
    title: "What is the primary functional flow for your website?",
    subtitle: "The flow defines how visitors navigate from initial awareness to taking high-value actions.",
    options: [
      {
        id: "saas-growth-funnel",
        label: "SaaS Product & Growth Funnel",
        description: "Hero product demo -> Bento grid features -> ROI calculator -> Pricing matrix",
        imageUrl: "/aesthetics/saas_bento.jpg",
        badge: "Growth Engine"
      },
      {
        id: "spatial-3d-walkthrough",
        label: "3D Spatial Walkthrough & Hotspot Explorer",
        description: "3D canvas model -> Unit/product inspection -> Spatial map -> Private VIP booking",
        imageUrl: "/aesthetics/spatial_3d.jpg",
        badge: "Spatial Journey"
      },
      {
        id: "editorial-luxury-showcase",
        label: "Curated Works, Case Studies & Showreels",
        description: "Fullscreen video reveal -> Project chapters -> Accordion manifesto -> Commission intake",
        imageUrl: "/aesthetics/portfolio_studio.jpg",
        badge: "Curated Showcase"
      },
      {
        id: "client-portal-booking-engine",
        label: "Client Hub, E-Contracts & File Vault",
        description: "Package discovery -> Authenticated dashboard -> Sprint milestones -> E-signatures",
        imageUrl: "/aesthetics/client_portal.jpg",
        badge: "Client Hub Engine"
      },
      {
        id: "product-configurator-flow",
        label: "3D Configurator & Direct Checkout",
        description: "360° interactive canvas -> Live material switcher -> Spec sheet -> Instant checkout",
        imageUrl: "/aesthetics/product_configurator.jpg",
        badge: "Interactive Commerce"
      },
      {
        id: "scroll-narrative-flow",
        label: "Scroll-Linked Narrative Chapters",
        description: "Scroll-pinned video masthead -> Horizontal milestone chapters -> Impact metrics -> Inquiry",
        imageUrl: "/aesthetics/scroll_narrative.jpg",
        badge: "Cinematic Narrative"
      }
    ]
  },
  {
    id: "scope",
    title: "What is your target launch timeline & sprint scope?",
    subtitle: "Helps us recommend the best milestone structure and technical deliverables for your build.",
    options: [
      {
        id: "mvp-sprint",
        label: "Fast MVP Sprint (2 - 3 Weeks)",
        description: "High-impact landing page + key functional flow ready for immediate launch",
        imageUrl: "/aesthetics/landing_launchpad.jpg",
        badge: "⚡ 2-3 Weeks MVP"
      },
      {
        id: "custom-flagship",
        label: "Custom Flagship Build (4 - 6 Weeks)",
        description: "Full multi-page architecture, bespoke animations, and integrated client tools",
        imageUrl: "/aesthetics/glassmorphism_vibe.jpg",
        badge: "🚀 4-6 Weeks Flagship"
      },
      {
        id: "enterprise-bespoke",
        label: "Enterprise Custom Architecture (6 - 8+ Weeks)",
        description: "Complete custom WebGL 3D, client portal, database integrations, and tailored CMS",
        imageUrl: "/aesthetics/spatial_3d.jpg",
        badge: "👑 6-8+ Weeks Bespoke"
      }
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
  } else if (answers.vibe === "bento-grid") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "bento-grid-modern-ui") || AESTHETIC_STYLES[3];
  } else if (answers.vibe === "neo-brutalist" || answers.industry === "landing-launchpad") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "neo-brutalist-pop") || AESTHETIC_STYLES[4];
  } else if (answers.vibe === "cyberpunk") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "cyberpunk-obsidian-glow") || AESTHETIC_STYLES[5];
  } else if (answers.vibe === "dark-mode-luxury") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "dark-mode-luxury") || AESTHETIC_STYLES[6];
  } else if (answers.vibe === "organic-warm" || answers.industry === "ecommerce-flagship") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "organic-pastel-serene") || AESTHETIC_STYLES[7];
  } else if (answers.vibe === "y2k-retro") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "y2k-retro-chromecore") || AESTHETIC_STYLES[8];
  } else if (answers.vibe === "kinetic-typography" || answers.industry === "scroll-narrative") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "kinetic-typography-story") || AESTHETIC_STYLES[9];
  } else if (answers.vibe === "ethereal") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "ethereal-ambient-mist") || AESTHETIC_STYLES[10];
  } else if (answers.vibe === "claymorphism") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "claymorphism-soft-3d") || AESTHETIC_STYLES[11];
  } else if (answers.industry === "client-portal") {
    primaryStyle = AESTHETIC_STYLES.find((s) => s.id === "bento-grid-modern-ui") || AESTHETIC_STYLES[3];
  }

  // Determine Matched Flow
  const targetFlowId = answers.flow || primaryStyle.recommendedFlowId;
  const matchedFlow = FUNCTIONAL_FLOWS.find((f) => f.id === targetFlowId) || FUNCTIONAL_FLOWS[0];

  // Alternative Styles
  const alternativeStyles = AESTHETIC_STYLES.filter((s) => s.id !== primaryStyle.id).slice(0, 3);

  // Match score calculation
  let score = 94;
  if (answers.industry && answers.vibe && answers.flow) score = 99;
  else if (answers.industry && answers.vibe) score = 96;

  return {
    primaryStyle,
    matchedFlow,
    alternativeStyles,
    matchScore: score
  };
}
