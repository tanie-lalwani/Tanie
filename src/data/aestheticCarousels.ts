export const AESTHETIC_CAROUSEL_MAP: Record<string, string[]> = {
  "liquid-glassmorphism": [
    "/aesthetics/glassmorphism_vibe.jpg",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
  ],
  "3d-spatial-architecture": [
    "/aesthetics/spatial_3d.jpg",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  ],
  "minimalist-swiss-editorial": [
    "/aesthetics/swiss_minimalism.jpg",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
    "/aesthetics/portfolio_studio.jpg",
  ],
  "bento-grid-modern-ui": [
    "/aesthetics/bento_grid.jpg",
    "/aesthetics/saas_bento.jpg",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
  ],
  "neo-brutalist-pop": [
    "/aesthetics/neobrutalism_vibe.jpg",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80",
  ],
  "cyberpunk-obsidian-glow": [
    "/aesthetics/cyberpunk_vibe.jpg",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
  ],
  "dark-mode-luxury": [
    "/aesthetics/dark_luxury.jpg",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
  ],
  "organic-pastel-serene": [
    "/aesthetics/organic_warm_vibe.jpg",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80",
  ],
  "y2k-retro-chromecore": [
    "/aesthetics/y2k_chromecore.jpg",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
  ],
  "kinetic-typography-story": [
    "/aesthetics/kinetic_type.jpg",
    "/aesthetics/scroll_narrative.jpg",
    "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=80",
  ],
  "ethereal-ambient-mist": [
    "/aesthetics/ethereal_mist.jpg",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
  ],
  "claymorphism-soft-3d": [
    "/aesthetics/claymorphism.jpg",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80",
  ],
};

// Fallback images map by Style Name (in case lookup is done by full display name)
export const NAME_TO_ID_MAP: Record<string, string> = {
  "Liquid Glassmorphism & AI Glow": "liquid-glassmorphism",
  "Interactive 3D Spatial & Architecture": "3d-spatial-architecture",
  "Minimalist Swiss Design (International Style)": "minimalist-swiss-editorial",
  "Bento Grid System & Modern SaaS": "bento-grid-modern-ui",
  "Neo-Brutalist & High-Energy Pop": "neo-brutalist-pop",
  "Cyberpunk & Neon HUD Matrix": "cyberpunk-obsidian-glow",
  "Dark Mode Luxury & Obsidian Glow": "dark-mode-luxury",
  "Wabi-Sabi & Organic Warmth": "organic-pastel-serene",
  "Y2K Aesthetic & Chromecore": "y2k-retro-chromecore",
  "Kinetic Typography & Storytelling": "kinetic-typography-story",
  "Ethereal & Ambient Mist": "ethereal-ambient-mist",
  "Claymorphism (Soft Tactile 3D)": "claymorphism-soft-3d",
};

export function getAestheticImages(styleIdOrName: string): string[] {
  if (AESTHETIC_CAROUSEL_MAP[styleIdOrName]) {
    return AESTHETIC_CAROUSEL_MAP[styleIdOrName];
  }
  const idFromName = NAME_TO_ID_MAP[styleIdOrName];
  if (idFromName && AESTHETIC_CAROUSEL_MAP[idFromName]) {
    return AESTHETIC_CAROUSEL_MAP[idFromName];
  }
  // Generic fallback if none found
  return ["/aesthetics/glassmorphism_vibe.jpg"];
}
