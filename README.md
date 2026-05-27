# Portfolio Website

https://tanie.me

An immersive, interactive portfolio website featuring a submarine-inspired scroll experience with Three.js rendering and advanced shader effects.

## Features

- **Submarine Scroll Effect** — Immersive depth-based scroll transitions with synchronized underwater ambient environment
- **Three.js Water Simulation** — Procedurally generated water shader with dynamic normals and real-time wave simulation
- **Depth-Based Color Grading** — Three-phase underwater gradient system (light → medium → dark) that transitions based on scroll position
- **Responsive Design** — Mobile-first approach with full viewport responsiveness across all device sizes
- **Modern UI System** — Standardized design system with consistent spacing, focus states, and animations
- **Smooth Animations** — Framer Motion for elegant page transitions and interactive elements
- **Particle Effects** — Underwater particles, surface ripples, and dynamic lighting synchronized with scroll depth
- **Client Testimonials** — Interactive carousel showcasing project experiences
- **Contact Form** — Fully functional contact form with form validation
- **Performance Optimized** — Mobile device detection to scale Three.js complexity; efficient particle systems
- **SEO Optimized** — Full search engine optimization for "Tanie Lalwani" and related developer queries

## Tech Stack

### Frontend

- **React 18** — UI component framework
- **TypeScript** — Type-safe JavaScript development
- **Tailwind CSS** — Utility-first CSS framework
- **Framer Motion** — Animation library
- **Three.js** — 3D graphics library

### Build & Development

- **Vite** — Next-generation frontend build tool
- **ESLint** — Code quality and standards enforcement
- **npm** — Package management

## Getting Started

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tanie-lalwani/portfolio.git
cd Portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Create your local environment file from the example:

```bash
copy .env.example .env.local
```

4. Add your server-only Gemini key to `.env.local` as `GEMINI_API_KEY=...`. Keep it out of `VITE_` vars so it stays off the frontend bundle.

5. Start the development server and Gemini proxy together:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── App.tsx                          # Root application component
├── main.tsx                         # Entry point
├── index.css                        # Global styles
├── pages/
│   ├── Home.tsx                     # Landing page with hero, projects, testimonials, contact
│   ├── Projects.tsx                 # (Routable page structure)
│   ├── InterviewMe.tsx              # (Routable page structure)
│   └── Contact.tsx                  # (Routable page structure)
├── components/
│   ├── Navbar.tsx                   # Sticky navigation header
│   ├── Hero.tsx                     # Hero section with headline
│   ├── PageHeader.tsx               # Reusable section header component
│   ├── SiteFooter.tsx               # Full-width footer
│   ├── BackdropSettingsBar.tsx      # Phase selector & debug controls
│   ├── FloatingOrbs.tsx             # Decorative animated orbs
│   ├── SubmitSuccessEffect.tsx      # Post-form submission animation
├── experience/
│   ├── ExperienceWorld.tsx          # Three.js scene container
│   ├── GlobalBeachBackdrop.tsx      # Main Three.js scene setup & rendering
│   ├── timePhase.ts                 # Time phase type definitions
│   ├── moods/
│   │   ├── types.ts                 # Mood preset type definitions
│   │   ├── index.ts                 # All mood presets
│   │   └── noonMood.ts              # Noon/midday mood colors & settings
│   ├── scene/
│   │   ├── useThreeScene.ts         # Three.js scene initialization hook
│   │   ├── createSky.ts             # Sky/atmosphere setup
│   │   ├── createWater.ts           # Water shader generation
│   │   └── createSand.ts            # Sand/beach terrain
│   └── ui/
│       ├── BackButton.tsx           # Navigation back button
│       ├── LeafReveal.tsx           # Leaf animation component
│       └── LoadingLeaves.tsx        # Loading animation
├── hooks/
│   ├── useClickRipple.ts            # Click ripple effect hook
│   ├── useCursorTrail.ts            # Cursor trail animation hook
│   └── useIsMobile.ts               # Mobile device detection hook
├── assets/                          # Static images & resources
├── App.tsx                          # Main app layout wrapper
├── index.css                        # Global Tailwind styles
└── main.tsx                         # React root

public/
├── CNAME                            # Custom domain configuration
├── robots.txt                       # Search engine crawling directives
├── sitemap.xml                      # XML sitemap for search engines
└── textures/                        # Three.js texture assets

Config Files
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TypeScript rules
├── tsconfig.node.json               # Node-specific TypeScript rules
├── eslint.config.js                 # ESLint rules & standards
├── package.json                     # Dependencies & scripts
├── index.html                       # HTML entry point
└── SEO.md                           # Search engine optimization guide
```

## Development

### Available Scripts

**Start Development Server**

```bash
npm run dev
```

Runs Vite in development mode on `http://localhost:5173`

**Build for Production**

```bash
npm run build
```

Generates optimized production build in `dist/` directory

**Preview Production Build**

```bash
npm run preview
```

Locally preview the production build

**Lint Code**

```bash
npm run lint
```

Check code quality and TypeScript type safety with ESLint

## Key Features Explained

### Submarine Scroll Effect

The core interaction is scroll-depth based. As users scroll down the page:

1. **Scroll Position** → **Stage Depth** conversion (0.0 to 1.0)
2. **Depth Triggers** color gradient transitions across three zones
3. **Camera Position** adjusts accordingly in the Three.js scene
4. **Underwater Elements** (particles, lighting) scale based on depth

### Three-Zone Depth System

- **Light Zone** (0.0-0.65): Surface water, light blues, visible sun rays
- **Medium Zone** (0.65-0.80): Transition area, graduated colors, testimonials
- **Dark Zone** (0.80-1.0): Deep water, darker blues, contact form

### Water Shader

- Procedurally generated normal maps
- Dynamic wave simulation with scroll synchronization
- Opacity and color transitions based on depth
- Refraction effects for underwater distortion

### Responsive Design

- Mobile scaling for Three.js complexity (fewer particles, lower quality)
- Tailwind breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons and form inputs
- Viewport unit sizing (svh/svw) for full-height sections

## Deployment

The site is deployed at `tanie.me`

### Gemini Bot Setup

The QnA bot calls a local `/api/gemini` proxy during development. `npm run dev` starts both Vite and the proxy, and the proxy reads `GEMINI_API_KEY` from `.env.local`, so the key never ships in the browser bundle.

If you deploy the site somewhere serverless or on a Node host, point the frontend at the same `/api/gemini` route there and keep the API key in the server environment only.

```bash
# Build and deploy
npm run build
# Push to GitHub repository on main branch
git push origin main
```

The CNAME file points to a custom domain if configured.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

Note: Three.js and WebGL required for full experience

## Performance Considerations

- Three.js scene optimizations for mobile devices
- Lazy loading for heavy components
- Debounced scroll event handlers
- Efficient particle pool management
- Material reuse to minimize memory
- Responsive texture sizes based on device

## Design System

### Colors

- Primary: Sky tones with HSL-based underwater gradients
- Text: Dark sky (sky-950) with white accents for visibility
- Backgrounds: Light sky (sky-50/95) with white cards
- Borders: Subtle sky-based borders (sky-700/20-30)

### Typography

- Display: Cambria (`--font-display`) for headings
- Body: Aptos (`--font-body`) for content
- Sizing: Responsive scales from mobile to desktop

### Spacing

- Consistent padding/margins using Tailwind spacing scale
- Container max-width: 6xl (1152px)
- Section gaps: standardized for visual rhythm

### Components

- Buttons: Rounded-lg with ring focus states
- Forms: Light backgrounds with subtle borders
- Cards: White/translucent with shadows
- Interactive: Smooth transitions (duration-200)

## Search Engine Optimization (SEO)

This portfolio is fully optimized for search visibility under the query **"Tanie Lalwani"** and related developer searches.

### Key Optimizations

- **Meta Tags** — Optimized title, description, and keywords
- **Structured Data** — JSON-LD schema for Google rich snippets
- **Social Media Tags** — Open Graph and Twitter Card configuration
- **Semantic HTML** — Proper heading hierarchy and semantic elements
- **Sitemap** — XML sitemap at `/sitemap.xml` for search engine crawling
- **Robots Configuration** — `robots.txt` configured for optimal indexing
- **Mobile-First** — Responsive design for mobile search ranking
- **Performance** — Core Web Vitals optimization for better SERP ranking

### Monitoring Search Performance

See [SEO.md](SEO.md) for complete search engine optimization documentation, including:

- Google Search Console setup
- Keyword strategy
- Backlink building
- Analytics monitoring

## Timeline & Phases

The site was developed with focus on:

1. Core submarine scroll mechanic with Three.js
2. Water shader and lighting effects
3. Responsive UI component system
4. Form validation and interactivity
5. Performance optimization for mobile
6. Final visual polish and accessibility

## License

[Specify your license here, e.g., MIT, All Rights Reserved, etc.]

## Author

**Tanie** — Design & Development

- GitHub: [@tanie-lalwani](https://github.com/tanie-lalwani)
- Portfolio: [tanie.me](https://tanie.me)

## Contact

For inquiries, use the contact form on the portfolio website or reach out via email through the site.

---

**Last Updated:** March 2025
