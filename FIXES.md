# 🛠️ Bug Fixes & Architecture Post-Mortems

This document records non-trivial technical issues, race conditions, architecture bottlenecks, root causes, and solutions implemented in this codebase. Refer to this log before refactoring navigation, routing, animations, or layout containers.

---

## 📌 Incident: White Light Flicker, Section Reloads & Scroll Jump Loop on Home Page

### 1. Symptoms & Report
- **Symptoms**:
  - A sudden white light flash / opacity flicker across sections 2 (About), 3 (Projects), and 4 (Contact) on the Home page.
  - All sections appeared to reload/re-render from scratch as the user scrolled down.
  - When scrolling to the Contact section, the viewport jumped back and forth violently between sections 2/3 and the Contact section in an infinite loop.
- **Trigger**: Scrolling past the Projects section or reaching the `#contact` section of the Home page.

### 2. Root Cause Analysis
Under the hood, three interacting mechanisms formed a destructive feedback loop:

```
User scrolls to #contact
  │
  ├──> 1. IntersectionObserver in Home.tsx detects contact section (threshold: 0.2)
  │      └──> Executes: window.history.replaceState(null, "", "/contact")
  │
  ├──> 2. Next.js App Router hooks into browser history API
  │      └──> Detects URL change -> usePathname() updates from "/" to "/contact"
  │
  ├──> 3. AppShell.tsx had <motion.div key={pathname}>
  │      └──> Changing key from "/" to "/contact" forces React & Framer Motion
  │           to completely UNMOUNT the old page DOM and MOUNT a new one.
  │      └──> Framer Motion triggers entry animation (initial={{ opacity: 0 }} -> animate={{ opacity: 1 }})
  │           Result: The entire screen flashes white/light opacity for 0.32s!
  │      └──> All components, canvas scenes, and state in sections 1-4 re-initialize from 0.
  │
  ├──> 4. Remount destroys scroll position
  │      └──> The page jumps back up; the Contact section is no longer intersecting.
  │
  └──> 5. Newly mounted observer triggers the reverse:
         └──> Executes: window.history.replaceState(null, "", "/")
         └──> usePathname() changes back to "/"
         └──> key={pathname} in AppShell changes back to "/"
         └──> FULL UNMOUNT & REMOUNT AGAIN ♻️ (Infinite loop)
```

### 3. Resolution & Architectural Safeguards
1. **Eliminated `replaceState` on Scroll ([`src/views/Home.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/Home.tsx))**:
   - Removed the `IntersectionObserver` that called `replaceState("/contact")` and `replaceState("/")`.
   - Never mutate the browser route pathname during natural scroll movements in a single-page layout.
   - Preserved a mount-only URL check (`window.location.pathname === "/contact" || window.location.hash === "#contact"`) so direct deep-links from external sites or search engines still smoothly scroll down to Contact.
2. **Stable Container Key in [`src/components/AppShell.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/AppShell.tsx))**:
   - Changed:
     ```tsx
     // Before (causes unmount whenever pathname toggles between / and /contact):
     <motion.div key={pathname} ...>

     // After (groups home-like routes under a stable key):
     <motion.div key={isHome ? "home" : pathname} ...>
     ```
   - Both `/` and `/contact` render the same base experience; grouping their key prevents Framer Motion from unmounting the DOM tree or flashing opacity.
3. **In-Page Smooth Navigation in [`src/components/Navbar.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/Navbar.tsx))**:
   - When a user is already on the Home view (`/` or `/contact`) and clicks "Contact" or "Home" in the navbar, default route navigation is prevented, and smooth in-page scrolling (`scrollIntoView` or `scrollTo(0)`) is used instead.

---

## 📌 Incident: RTL Language (Arabic/Urdu) Hamburger Menu Clipping & Carousel Scroll Lock

### 1. Symptoms & Report
- In RTL languages (Urdu, Arabic), switching the site direction caused the hamburger navigation menu popover to cut in half on mobile screens.
- Project showcase cards in the carousel were locked and would not scroll horizontally.
- Hero action text ("Work →", "Pricing →") remained in English instead of translating into the selected language.

### 2. Root Cause Analysis
- **Menu Clipping**: The mobile menu popover had directional coordinate classes (`left-0`, `right-0`) that conflicted with the global document `dir="rtl"` layout grid, causing the popover to overflow outside the viewport margin.
- **Carousel Lock**: Native and Framer Motion drag gestures on touch devices calculate `scrollLeft` and delta coordinates assuming LTR horizontal progression. Under RTL layout mode, browsers invert horizontal scroll deltas (or represent them as negative offsets), freezing the drag/swipe mechanics.
- **Language Strings**: Translation dictionaries (`copy.home`) lacked localized keys for CTAs, and `Home.tsx` had hardcoded strings `"Work →"` and `"Pricing →"`.

### 3. Resolution & Architectural Safeguards
1. **Isolated Menu Directionality ([`src/components/Navbar.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/Navbar.tsx))**:
   - Added `dir="ltr"` and `end-0` to the mobile navigation popover element so it always remains safely anchored within viewport bounds regardless of site-wide RTL mirroring.
2. **Normalized Horizontal Drag Context ([`src/components/ProjectsCarousel.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/ProjectsCarousel.tsx))**:
   - Enforced `dir="ltr"` on the carousel track container to maintain consistent positive delta math across all touch and pointer interactions.
3. **Localized CTAs & Pricing Fallbacks ([`src/views/Home.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/Home.tsx), [`src/context/LanguageContext.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/context/LanguageContext.tsx))**:
   - Bound CTA buttons to `copy.home.ctaWork` and `copy.home.ctaPricing` across all supported locales (English, Urdu, Arabic, Spanish, French, Japanese, Hindi, German).

---

## 📐 General Prevention Guidelines
1. **Never use `history.replaceState` or `pushState` inside scroll/intersection listeners in Next.js App Router apps** unless you explicitly intend to trigger Next.js router listeners and `usePathname()`.
2. **Never key root animation wrappers (`<motion.div key={...}>`) by raw `pathname` if multiple routes render the same view** (e.g. `/` and `/contact`). Group them using a stable key.
3. **Keep swipe/carousel gesture containers in `dir="ltr"`** to avoid touch/drag axis inversion bugs in RTL languages.
