# Landing Page & Hero Aesthetics Feature Module (Boilerplate)

High-end, cinematic hero presentation with interactive audio, 3D ambient orbs, and hardware-accelerated carousel.

## Included Capabilities
1. **Interactive Ambient Ocean Audio**: Web Audio API synth soundscapes with toggle controls.
2. **Projects Carousel**: Touch and drag fluid showcase with smooth spring physics.
3. **Wavy Sparkle Ring Loader**: Visual canvas loader for premium transitions.
4. **Floating Ambient Orbs**: Glassmorphic floating gradient spheres for atmospheric depth.

## Copy-Paste Usage in Any Project
```tsx
import { HomeView, AmbientOceanAudio, FloatingOrbs } from "@/features/landing-page";

export default function HomePage() {
  return <HomeView />;
}
```

## Routing & In-Page Navigation Architecture
- **No `replaceState` on Scroll**: Do not use `window.history.replaceState` or `pushState` inside scroll or `IntersectionObserver` listeners. Next.js App Router hooks into browser history changes, which will alter `usePathname()` and trigger page container remounts.
- **Shared `/` and `/contact` View**: The `/contact` route renders `HomeView` with an initial scroll into the `#contact` section. The top-level layout container (`AppShell`) uses a unified page key (`isHome ? "home" : pathname`) to prevent unmounting and opacity flicker during transitions between `/` and `/contact`.

