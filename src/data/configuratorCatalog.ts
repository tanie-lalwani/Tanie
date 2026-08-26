export interface FormatOption {
  id: string;
  name: string;
  tagline: string;
  basePriceUsd: number;
  basePriceInr: number;
  turnaround: string;
  badge?: string;
  icon: string;
  description: string;
  keyDeliverables: string[];
}

export interface ExperienceLayer {
  id: string;
  name: string;
  tagline: string;
  priceUsd: number;
  icon: string;
  description: string;
}

export interface VisualStyleOption {
  id: string;
  name: string;
  category: "Modern & Clean" | "Artistic & Avant-Garde" | "Retro & Cyber" | "Luxury & Editorial" | "Tactile & Experimental";
  mood: string;
  palette: string[];
  typography: string;
  description: string;
  exemplarKeywords: string[];
  previewGradient: string;
  exemplarPrompt: string;
}

export interface FeatureAddon {
  id: string;
  name: string;
  priceUsd: number;
  description: string;
  icon: string;
}

export const WEBSITE_FORMATS: FormatOption[] = [
  {
    id: "3d-immersive",
    name: "3D Immersive / WebGL",
    tagline: "Real-time Three.js viewport, volumetric lighting & spatial navigation.",
    basePriceUsd: 3499,
    basePriceInr: 289000,
    turnaround: "3-5 weeks",
    badge: "Signature",
    icon: "🪐",
    description: "Bespoke 3D worlds running at 60fps with customized shaders, particle systems, dynamic camera panning, and mobile-optimized fallbacks.",
    keyDeliverables: [
      "Custom WebGL Canvas (Three.js / React Three Fiber)",
      "Optimized 3D GLTF/GLB models & texture compression",
      "Dynamic lighting, bloom, and post-processing passes",
      "Fluid 60fps responsiveness across mobile & desktop"
    ]
  },
  {
    id: "scroll-driven",
    name: "Scroll-Driven Narrative",
    tagline: "Scrubbed timeline animations that unfold as the user scrolls.",
    basePriceUsd: 2699,
    basePriceInr: 220000,
    turnaround: "2-3 weeks",
    badge: "Popular",
    icon: "📜",
    description: "Captivating storytelling where scroll velocity drives typography transforms, clip-path reveals, video scrubbing, and synchronized element choreography.",
    keyDeliverables: [
      "Lenis smooth scrolling engine with pinned sections",
      "Framer Motion scrubbed triggers & scale morphs",
      "Dynamic progress telemetry & chapter transitions",
      "Full mobile touch velocity tuning"
    ]
  },
  {
    id: "cinematic",
    name: "Cinematic Experience",
    tagline: "Full-bleed sound design, atmospheric depth & filmic art direction.",
    basePriceUsd: 3199,
    basePriceInr: 265000,
    turnaround: "3-4 weeks",
    badge: "High-Impact",
    icon: "🎬",
    description: "Designed like an interactive movie trailer with widescreen aspect ratio lockups, video loop overlays, audio reactivity, and ambient soundscapes.",
    keyDeliverables: [
      "Compressed 4K/WebM video background choreographies",
      "Ambient WebAudio spatial soundscapes & sfx",
      "Editorial title sequences & letterbox framing",
      "Performance-tuned instant playback"
    ]
  },
  {
    id: "interactive-game",
    name: "Game-like & Playful",
    tagline: "Mini-games, Easter eggs, interactive cursor physics & collectible states.",
    basePriceUsd: 3699,
    basePriceInr: 305000,
    turnaround: "3-5 weeks",
    icon: "🕹️",
    description: "Delightful web experience featuring keyboard/touch controls, canvas particle mechanics, interactive physics simulation, and rewarding user milestones.",
    keyDeliverables: [
      "Interactive 2D/3D physics engine integration",
      "Gamified reward loops, scores, or secret unlock codes",
      "Custom cursor interactions & sound feedback",
      "High-engagement brand loyalty hooks"
    ]
  },
  {
    id: "product-configurator",
    name: "3D Product Configurator",
    tagline: "Interactive 360° material, color, and modular customizer.",
    basePriceUsd: 3899,
    basePriceInr: 320000,
    turnaround: "4-5 weeks",
    badge: "E-Commerce",
    icon: "👟",
    description: "Empower your buyers to customize products in real time with photorealistic materials, dynamic lighting presets, dimension annotations, and instant checkout sync.",
    keyDeliverables: [
      "Real-time 3D model orbit & material switcher",
      "Custom color, texture, and part configurator UI",
      "Live price computation & PDF specification generator",
      "Shopify / Stripe cart integration"
    ]
  },
  {
    id: "fullstack-webapp",
    name: "Full-Stack Web App / SaaS",
    tagline: "Production-ready web application with Supabase DB, Auth & Dashboards.",
    basePriceUsd: 4299,
    basePriceInr: 349000,
    turnaround: "4-6 weeks",
    badge: "Full-Stack",
    icon: "⚡",
    description: "Engineered with Next.js App Router, Supabase PostgreSQL, user auth roles, subscription billing, client portals, and an executive administration suite.",
    keyDeliverables: [
      "Next.js App Router + TypeScript architecture",
      "Supabase DB with Row Level Security (RLS)",
      "Secure Auth (Google, GitHub, Magic Link, Password)",
      "Stripe / LemonSqueezy subscription integration"
    ]
  },
  {
    id: "ai-powered",
    name: "AI-Powered / Agentic",
    tagline: "Custom Gemini / OpenAI copilot with streaming conversational UI.",
    basePriceUsd: 4499,
    basePriceInr: 365000,
    turnaround: "4-6 weeks",
    badge: "AI Native",
    icon: "🧠",
    description: "Infuse your web platform with intelligent context-aware chat agents, real-time embeddings, automated generative workflows, and multi-modal assistants.",
    keyDeliverables: [
      "Streaming Gemini / OpenAI API integration",
      "Vector search & knowledge base context injection",
      "Bespoke chat terminal & voice synthesis support",
      "Rate-limiting & safety moderation guardrails"
    ]
  },
  {
    id: "static-editorial",
    name: "Luxury Editorial / Showcase",
    tagline: "Typographic mastery, ultra-fast Lighthouse 99+ speed & pristine layout.",
    basePriceUsd: 1999,
    basePriceInr: 165000,
    turnaround: "1-2 weeks",
    badge: "Fast Sprint",
    icon: "📰",
    description: "Razor-sharp, haute-couture digital presence for architects, boutique fashion labels, agencies, and executives who value precision typography and speed.",
    keyDeliverables: [
      "Handcrafted serif & modern sans typography system",
      "Instant 0.2s page load & Lighthouse 99+ score",
      "Comprehensive SEO, Open Graph & schema metadata",
      "Domain DNS & Vercel Edge CDN setup"
    ]
  },
  {
    id: "experimental-hybrid",
    name: "Experimental / Hybrid Lab",
    tagline: "Unconventional UX, creative coding, custom shaders & WebGPU.",
    basePriceUsd: 4899,
    basePriceInr: 395000,
    turnaround: "4-6 weeks",
    badge: "Avant-Garde",
    icon: "🧪",
    description: "For visionary artists, NFT galleries, and creative studios that want to push the boundaries of what the web can do with generative art and raw compute.",
    keyDeliverables: [
      "Custom GLSL fragment/vertex shaders",
      "Generative art algorithms & math simulations",
      "WebGPU experimental render pipeline",
      "Awwwards Site of the Day candidate architecture"
    ]
  }
];

export const EXPERIENCE_LAYERS: ExperienceLayer[] = [
  {
    id: "webgl-physics",
    name: "WebGL Shader & Particle Physics",
    tagline: "Interactive water ripples, fluid smoke, or mouse-reactive particle fields.",
    priceUsd: 499,
    icon: "✨",
    description: "Custom GPU shaders reacting directly to cursor movement, scroll velocity, and device gyro."
  },
  {
    id: "spatial-audio",
    name: "Spatial Audio & Ambient Reactive Sound",
    tagline: "Procedural soundscapes, hover UI clicks & immersive ocean ambience.",
    priceUsd: 349,
    icon: "🎧",
    description: "WebAudio API synthesis with binaural panning and volume ducks across sections."
  },
  {
    id: "cinematic-camera",
    name: "Choreographed 3D Camera Fly-through",
    tagline: "Dramatic dolly zooms, focus shifts, and seamless scene transitions.",
    priceUsd: 449,
    icon: "🎥",
    description: "Spline-based camera paths synchronized to the user's narrative journey."
  },
  {
    id: "cursor-physics",
    name: "Kinetic Cursor & Fluid Micro-Interactions",
    tagline: "Magnetic button snaps, liquid hover trails & tactile haptics.",
    priceUsd: 249,
    icon: "🧲",
    description: "High-frequency spring physics that make every interaction feel responsive and alive."
  }
];

export const VISUAL_STYLES: VisualStyleOption[] = [
  {
    id: "minimalism",
    name: "Minimalism",
    category: "Modern & Clean",
    mood: "Restrained, Pure, Purposeful",
    palette: ["#ffffff", "#0f172a", "#64748b", "#f8fafc"],
    typography: "Inter / Helvetica Neue (Ultra-clean grotesque)",
    description: "Generous whitespace, hyper-focused content hierarchy, monochromatic clarity, and silent elegance.",
    exemplarKeywords: ["Clean Whitespace", "Monochrome", "Asymmetry", "Precision Grid"],
    previewGradient: "from-slate-900 to-slate-950",
    exemplarPrompt: "Sleek architectural design portfolio with generous negative space and pristine typography."
  },
  {
    id: "maximalism",
    name: "Maximalism",
    category: "Artistic & Avant-Garde",
    mood: "Vibrant, Eclectic, Sensory Overload",
    palette: ["#ff007f", "#ffe600", "#00f0ff", "#7000ff"],
    typography: "Clarendon + Syne + Bold Display mix",
    description: "Rich layered textures, vivid high-saturation color clashes, energetic typography, and bold micro-animations.",
    exemplarKeywords: ["Vivid Colors", "Dense Layers", "Contrasting Type", "Energetic"],
    previewGradient: "from-fuchsia-950 via-purple-950 to-pink-950",
    exemplarPrompt: "High-voltage creative studio website with animated stickers, layered collages, and rainbow gradients."
  },
  {
    id: "swiss-design",
    name: "Swiss Design (International Style)",
    category: "Modern & Clean",
    mood: "Mathematical, Objective, Structured",
    palette: ["#ff3300", "#111111", "#e5e5e5", "#ffffff"],
    typography: "Akzidenz-Grotesk / Neue Haas Grotesk",
    description: "Strict mathematical column grids, bold red accent accents, asymmetric balance, and universal clarity.",
    exemplarKeywords: ["Mathematical Grid", "Red Accent", "Structured Columns", "Universal Clarity"],
    previewGradient: "from-zinc-900 to-stone-950",
    exemplarPrompt: "Poster-style modernist layout with rigid 12-column grid and iconic Swiss poster aesthetic."
  },
  {
    id: "brutalism",
    name: "Brutalism",
    category: "Tactile & Experimental",
    mood: "Raw, Unfiltered, High-Contrast",
    palette: ["#000000", "#ffffff", "#ffff00", "#0000ff"],
    typography: "Courier New / Space Mono (Raw Monospace)",
    description: "Exposed HTML structures, raw monospace fonts, stark black/white outlines, and anti-design attitude.",
    exemplarKeywords: ["Raw Borders", "Monospace", "Unvarnished", "High-Contrast"],
    previewGradient: "from-black via-zinc-950 to-neutral-950",
    exemplarPrompt: "Raw technical website with thick 2px borders, visible grid coordinates, and utilitarian styling."
  },
  {
    id: "surrealism",
    name: "Surrealism",
    category: "Artistic & Avant-Garde",
    mood: "Dreamlike, Metaphysical, Hypnotic",
    palette: ["#0a192f", "#f43f5e", "#38bdf8", "#fbbf24"],
    typography: "Bodoni Moda Italic + Playfair Display",
    description: "Floating metaphysical objects, impossible physics, melted liquid geometry, and ethereal lighting.",
    exemplarKeywords: ["Floating 3D Orbs", "Liquid Distortion", "Dreamscape", "Deep Indigo"],
    previewGradient: "from-indigo-950 via-purple-950 to-slate-950",
    exemplarPrompt: "Dreamlike 3D landscape with floating chrome spheres and metaphysical glowing sky transitions."
  },
  {
    id: "neo-brutalism",
    name: "Neo-Brutalism",
    category: "Tactile & Experimental",
    mood: "Playful, Punchy, High-Energy",
    palette: ["#ffe135", "#ff6b6b", "#4ecdc4", "#1a1a1a"],
    typography: "Plus Jakarta Sans Bold + Clash Display",
    description: "Heavy solid drop shadows, thick black borders, vibrant pastel block fills, and tactile sticker badges.",
    exemplarKeywords: ["Hard Drop Shadows", "Bold Outlines", "Pastel Pop", "Sticker Badges"],
    previewGradient: "from-amber-950 via-yellow-950 to-slate-950",
    exemplarPrompt: "Punchy SaaS landing page with hard offset shadows, rounded pill tags, and vibrant card blocks."
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    category: "Modern & Clean",
    mood: "Frosted, Airy, Multi-Layered",
    palette: ["#38bdf8", "#818cf8", "#c084fc", "#04111b"],
    typography: "Manrope / Outfit (Modern geometric)",
    description: "Deep multi-layer frosted blur panels, translucent specular reflections, and glowing ambient gradients.",
    exemplarKeywords: ["Frosted Blur", "Specular Glow", "Translucent Cards", "Deep Space"],
    previewGradient: "from-sky-950 via-slate-950 to-cyan-950",
    exemplarPrompt: "Deep oceanic dark-mode UI with layered frosted glass cards and glowing cyan edge reflections."
  },
  {
    id: "bento-grid",
    name: "Bento Grid",
    category: "Modern & Clean",
    mood: "Modular, Organized, Feature-Dense",
    palette: ["#090d16", "#1e293b", "#38bdf8", "#e2e8f0"],
    typography: "Geist Sans / Inter Display",
    description: "Apple-style modular grid container with interactive mini-widgets, micro-visualizations, and varied aspect ratios.",
    exemplarKeywords: ["Modular Tiles", "Apple Style", "Feature Highlights", "Card Asymmetry"],
    previewGradient: "from-slate-950 to-slate-900",
    exemplarPrompt: "Apple-keynote inspired product dashboard with rounded bento cards, live graphs, and glowing badges."
  },
  {
    id: "luxury-typography",
    name: "Luxury Typography & Serif",
    category: "Luxury & Editorial",
    mood: "High-Fashion, Prestigious, Refined",
    palette: ["#0b0e14", "#d4af37", "#f5f5f7", "#1e2430"],
    typography: "Bodoni Moda / Didot / Canela",
    description: "Dramatic high-contrast serif headlines, gold foil specular glows, generous line heights, and haute-couture grace.",
    exemplarKeywords: ["Bodoni Headlines", "Gold Foil Accents", "Haute Couture", "Silky Transitions"],
    previewGradient: "from-stone-950 via-zinc-950 to-slate-950",
    exemplarPrompt: "Vogue-inspired luxury brand portal with elegant serif headers, silky smooth fades, and gold glow lines."
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk & Neon HUD",
    category: "Retro & Cyber",
    mood: "Futuristic, Gritty, High-Octane",
    palette: ["#00ffff", "#ff007f", "#ffe600", "#050510"],
    typography: "Orbitron / Share Tech Mono",
    description: "Glowing neon wireframes, holographic HUD crosshairs, glitch shaders, scanlines, and high-tech telemetry.",
    exemplarKeywords: ["Cyan & Magenta Glow", "Holographic HUD", "Scanlines", "Glitch Shaders"],
    previewGradient: "from-cyan-950 via-fuchsia-950 to-black",
    exemplarPrompt: "Sci-fi interface with glowing neon grid, sci-fi crosshair targeting, and particle beam transitions."
  },
  {
    id: "wabi-sabi",
    name: "Wabi-Sabi & Natural Zen",
    category: "Artistic & Avant-Garde",
    mood: "Organic, Earthy, Contemplative",
    palette: ["#2d2c29", "#8a817c", "#bcb8b1", "#e0afa0"],
    typography: "Cormorant Garamond + Noto Sans",
    description: "Appreciation of imperfection, earthy ceramic textures, organic fluid motions, and zen Japanese tranquility.",
    exemplarKeywords: ["Earthy Stone", "Ceramic Textures", "Organic Geometry", "Zen Atmosphere"],
    previewGradient: "from-stone-900 to-amber-950",
    exemplarPrompt: "Zen architectural studio with rough stone textures, organic asymmetric curves, and calm typography."
  },
  {
    id: "y2k-retro",
    name: "Y2K Aesthetic & Chromecore",
    category: "Retro & Cyber",
    mood: "Nostalgic, Glossy, Futuristic Early 2000s",
    palette: ["#c0c0c0", "#38bdf8", "#ff69b4", "#0f0c29"],
    typography: "Microgramma / Eurostyle / Compacta",
    description: "Liquid chrome typography, metallic bubble 3D pills, translucent aqua jelly buttons, and millennium optimism.",
    exemplarKeywords: ["Liquid Chrome", "Bubble 3D Type", "Glossy Jelly", "Early Web Nostalgia"],
    previewGradient: "from-blue-950 via-purple-950 to-pink-950",
    exemplarPrompt: "Early 2000s chrome metallic interface with 3D liquid chrome emblems and glossy jelly pill buttons."
  },
  {
    id: "pixel-art",
    name: "Pixel Art & 16-Bit Retro",
    category: "Retro & Cyber",
    mood: "Charming, Nostalgic, Arcade",
    palette: ["#181425", "#3a4466", "#8a96b7", "#ff0044"],
    typography: "Press Start 2P / Silkscreen",
    description: "Crisp pixelated sprites, retro gaming dialogue boxes, 8-bit sound effects, and vibrant nostalgic palette.",
    exemplarKeywords: ["Pixelated Canvas", "8-Bit Sound FX", "Arcade Dialogue", "Retro Nostalgia"],
    previewGradient: "from-indigo-950 to-slate-950",
    exemplarPrompt: "Playful indie developer website with pixel art town exploration, retro dialogue popups, and chiptune sound."
  },
  {
    id: "ethereal",
    name: "Ethereal & Ambient Mist",
    category: "Artistic & Avant-Garde",
    mood: "Celestial, Luminous, Floating",
    palette: ["#020617", "#38bdf8", "#a855f7", "#ec4899"],
    typography: "Bodoni Moda + Inter Light",
    description: "Bioluminescent glows, floating celestial clouds, shimmering iridescent materials, and soothing ocean depth.",
    exemplarKeywords: ["Bioluminescent Glow", "Celestial Mist", "Iridescent Colors", "Ambient Depth"],
    previewGradient: "from-sky-950 via-slate-950 to-purple-950",
    exemplarPrompt: "Celestial brand portal with glowing stardust particles, soft ambient mist, and iridescent sphere shaders."
  },
  {
    id: "claymorphism",
    name: "Claymorphism (Soft 3D)",
    category: "Tactile & Experimental",
    mood: "Soft, Fluffy, Tactile",
    palette: ["#f1f5f9", "#cbd5e1", "#38bdf8", "#f472b6"],
    typography: "Nunito / Plus Jakarta Sans",
    description: "Chubby rounded 3D clay cards with dual inner shadows, soft ambient occlusion, and marshmallow softness.",
    exemplarKeywords: ["Chubby 3D Cards", "Inner Clay Shadows", "Marshmallow Feel", "Tactile Buttons"],
    previewGradient: "from-slate-900 to-indigo-950",
    exemplarPrompt: "Playful 3D app interface with soft clay buttons, pillowy shadows, and smooth bouncy spring physics."
  },
  {
    id: "dark-mode-luxury",
    name: "Dark Mode Luxury",
    category: "Luxury & Editorial",
    mood: "Moody, Sovereign, Elite",
    palette: ["#04111b", "#0a2233", "#38bdf8", "#ffffff"],
    typography: "Bodoni Moda + Inter",
    description: "Deep obsidian backdrop, subtle cyan atmospheric glowing orbs, precision hairline borders, and commanding luxury.",
    exemplarKeywords: ["Obsidian Navy", "Cyan Ambient Orbs", "Hairline Precision", "Elite Feel"],
    previewGradient: "from-[#04111b] via-[#082236] to-slate-950",
    exemplarPrompt: "Deep oceanic obsidian portfolio with glowing cyan light rings, buttery smooth scroll, and refined serif titles."
  },
  {
    id: "synthwave",
    name: "Synthwave & 80s Sunset",
    category: "Retro & Cyber",
    mood: "Electric, Retro-Futuristic, Sunset",
    palette: ["#ff71ce", "#01cdfe", "#05ffa1", "#241734"],
    typography: "Outrun / Streamster + Montserrat",
    description: "Wireframe perspective grid extending to infinity, neon magenta sunset gradients, and retro sports car aesthetic.",
    exemplarKeywords: ["Wireframe Grid", "Neon Sunset", "Chrome Horizon", "80s Synth"],
    previewGradient: "from-purple-950 via-fuchsia-950 to-rose-950",
    exemplarPrompt: "Endless scrolling wireframe terrain towards a neon glowing sun with retro synthwave music audio."
  },
  {
    id: "gothic-noir",
    name: "Gothic Noir & Dark Victorian",
    category: "Tactile & Experimental",
    mood: "Mysterious, Dramatic, Ornate",
    palette: ["#090a0f", "#8b0000", "#d4af37", "#1c1d24"],
    typography: "UnifrakturCook / Cinzel Decorative",
    description: "Ornate archways, dramatic chiaroscuro shadow contrasts, deep crimson accents, and dark romantic gravitas.",
    exemplarKeywords: ["Chiaroscuro Light", "Deep Crimson", "Ornate Filigree", "Dark Romanticism"],
    previewGradient: "from-red-950 via-zinc-950 to-black",
    exemplarPrompt: "Dark romantic luxury experience with ornate Victorian filigree, flickering candlelight glow, and rich noir styling."
  }
];

export const CONFIGURATOR_ADDONS: FeatureAddon[] = [
  {
    id: "headless-cms",
    name: "Headless CMS (Sanity / Contentful)",
    priceUsd: 499,
    description: "Self-serve content management studio to update case studies, copy, blog posts, and media without code.",
    icon: "📝"
  },
  {
    id: "multi-language",
    name: "Multi-Language Localization (i18n)",
    priceUsd: 399,
    description: "Seamless multi-language translation engine with locale selector and dynamic translation dictionary.",
    icon: "🌐"
  },
  {
    id: "ai-copilot",
    name: "Gemini / OpenAI AI Assistant Integration",
    priceUsd: 599,
    description: "Embedded streaming AI conversational assistant customized with your portfolio/brand knowledge.",
    icon: "🤖"
  },
  {
    id: "blender-3d-assets",
    name: "Custom 3D Blender Modeling & Texturing",
    priceUsd: 699,
    description: "Bespoke 3D models sculpted in Blender, baked with metallic/roughness PBR textures, and optimized for WebGL.",
    icon: "🎨"
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway & Webhook Checkout",
    priceUsd: 449,
    description: "Stripe, LemonSqueezy, or Razorpay checkout with webhook receipts, subscription tiers, and client billing.",
    icon: "💳"
  },
  {
    id: "express-sprint",
    name: "Priority Express Sprint (2 Weeks)",
    priceUsd: 799,
    description: "Fast-tracked prioritized sprint with dedicated daily staging build updates and accelerated delivery.",
    icon: "⚡"
  },
  {
    id: "extended-warranty",
    name: "60-Day Extended Hypercare Warranty",
    priceUsd: 399,
    description: "Double the post-launch support window with continuous performance tuning, browser patches, and minor tweaks.",
    icon: "🛡️"
  }
];
