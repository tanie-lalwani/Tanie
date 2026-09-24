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
1. **Direction-Aware Menu Positioning ([`src/components/Navbar.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/Navbar.tsx))**:
   - In RTL mode (`locale === 'ur'`), the navbar controls sit on the top-left of the screen. We dynamically set `isRtl ? 'left-0' : 'right-0'` and `max-w-[calc(100vw-1.5rem)]` on the popover container.
   - This ensures that in RTL, the popover anchors to the left edge and expands rightward into the screen, completely preventing it from clipping off-screen into negative coordinates.
2. **Normalized Horizontal Drag Context ([`src/components/ProjectsCarousel.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/ProjectsCarousel.tsx))**:
   - Enforced `dir="ltr"` on the carousel track container to maintain consistent positive delta math across all touch and pointer interactions.
3. **Localized CTAs & Pricing Fallbacks ([`src/views/Home.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/Home.tsx), [`src/context/LanguageContext.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/context/LanguageContext.tsx))**:
   - Bound CTA buttons to `copy.home.ctaWork` and `copy.home.ctaPricing` across all supported locales (English, Urdu, Arabic, Spanish, French, Japanese, Hindi, German).

---

## 📌 Incident: Dead `/gallery` Link Generating 404s in Google Search Console

### 1. Symptoms & Report
- Google Search Console flagged `https://www.tanie.me/gallery` as a 404 (Not Found) crawl error under Page Indexing.

### 2. Root Cause Analysis
- The profile photo figure in the About section on [`src/views/Home.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/Home.tsx) had an overlaid circular arrow button linking to `href="/gallery"`.
- Since no `/gallery` route exists in the application, search engine bots followed the link and encountered a 404.

### 3. Resolution & Architectural Safeguards
- Removed the dead `<a>` link element from the profile image figure in [`src/views/Home.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/Home.tsx) without introducing unnecessary redirects.

---

## 📌 Incident: Horizontal Card Scrolling Mirroring & Faulty Scroll Controls in RTL
### 1. Symptoms & Report
- In Urdu/RTL mode (`locale === "ur"`), the project cards carousel on the Home page was mirrored right-to-left: the first project appeared at the far right edge instead of the start.
- The scroll buttons and swipe gestures inverted or became erratic and jumped around awkwardly.
### 2. Root Cause Analysis
- `LanguageContext.tsx` applies `document.documentElement.dir = "rtl"` when `locale === "ur"`.
- The flex scroller `.project-scroll` inherited `dir="rtl"`.
- Browser implementations handle RTL `scrollLeft` inconsistently (some negative, some reversed), causing `onTouchMove`, mouse wheel, and `scrollBy` controls to conflict.
- Additionally, `scroller.querySelector("article")` returned `null` because `ProjectCard` renders as a `motion.div`, causing `cardWidth` calculation to fall back to `scroller.clientWidth * 0.8`.
### 3. Resolution & Architectural Safeguards
1. **Explicit LTR on Scroller Container**: Wrapped the scroller in `<div className="relative" dir="ltr">` in [`src/components/ProjectsCarousel.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/ProjectsCarousel.tsx) so project cards always flow naturally from left to right across all languages.
2. **Normalized Scroll Coordinates**: Simplified `updateScrollControls` and `scrollProjects` to standard non-negative LTR coordinates.
3. **Accurate Card Sizing**: Used `scroller.firstElementChild as HTMLElement | null` to get exact card width and gap dimensions.
4. **Bidirectional Card Content**: Added `dir="auto" text-start` to [`src/components/ProjectCard.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/ProjectCard.tsx) so Urdu text descriptions flow RTL within the card while the horizontal card track flows LTR.

---

## 📌 Incident: Fragmented Terms/Policy Pages & Untranslated Pseudo-RTL Formatting
### 1. Symptoms & Report
- Policy content was fragmented across 4 separate pages: `/terms`, `/privacy`, `/refund-policy`, and `/shipping-policy`.
- In RTL mode, English policy text was displayed inside `dir="rtl"` containers, causing punctuation, numbering (e.g. `Information We Collect .1`), and bullet points to render in reverse.
- Navigation drawer menu labels were partly hardcoded in English.
### 2. Root Cause Analysis
- Separate policy pages duplicated layout wrappers and lacked search/filtering.
- Global `dir="rtl"` without explicit `dir="ltr"` container boundaries caused the browser BiDi engine to treat English sentences and numbers with inverted right-to-left punctuation.
### 3. Resolution & Architectural Safeguards
1. **Unified Terms & Policies Page ([`src/views/TermsView.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/TermsView.tsx), [`src/app/terms/page.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/app/terms/page.tsx))**:
   - Consolidated Terms of Service, Privacy Policy, Milestone Refunds, Service Delivery, and Razorpay Security into a single unified `/terms` page.
   - Built a dynamic **Search by Topics & Clauses** hero section with instant live search and topic filter chips (`All Policies`, `Terms of Service`, `Privacy Policy`, `Refunds & Cancellations`, `Service Delivery`, `Payment Security`, `Intellectual Property`).
   - Added deep anchor link support (`#terms`, `#privacy`, `#refunds`, `#delivery`, `#payments`, `#ip`).
2. **Legacy Route Redirects ([`next.config.ts`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/next.config.ts))**:
   - Redirected `/privacy`, `/refund-policy`, and `/shipping-policy` to their corresponding anchors on `/terms`.
3. **Interactive FAQ Page ([`src/views/FaqView.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/views/FaqView.tsx), [`src/app/faq/page.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/app/faq/page.tsx))**:
   - Created a `/faq` page featuring the same live search by topic, expandable accordions, and comprehensive answers covering pricing, custom scopes, turnaround, 3D WebGL, and client portal access.
4. **Typographic Integrity & Multilingual Drawer ([`src/components/Navbar.tsx`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/components/Navbar.tsx))**:
   - Wrapped English legal and documentation text in `dir="ltr" text-left` to preserve punctuation and numbering in all locales.
   - Added localized drawer labels across all 7 supported languages (English, Urdu, Spanish, French, Hindi, Japanese, Chinese).
5. **Full Native Multi-Language Translations ([`src/data/termsTranslations.ts`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/data/termsTranslations.ts), [`src/data/faqTranslations.ts`](file:///c:/Users/words/Desktop/Websites/Completed/Portfolio/src/data/faqTranslations.ts))**:
   - Translated the entirety of the unified Terms & Policies (all 7 sections, 25 legal clauses, badges, search placeholders, topic chips, and buttons) into all 7 supported languages (English, Spanish, French, Hindi, Japanese, Urdu, and Chinese).
   - Translated the entirety of the FAQ page (questions, answers, key takeaways, categories, and action prompts) across all 7 supported languages with native RTL support for Urdu.

---

## 📐 General Prevention Guidelines
1. **Never use `history.replaceState` or `pushState` inside scroll/intersection listeners in Next.js App Router apps** unless you explicitly intend to trigger Next.js router listeners and `usePathname()`.
2. **Never key root animation wrappers (`<motion.div key={...}>`) by raw `pathname` if multiple routes render the same view** (e.g. `/` and `/contact`). Group them using a stable key.
3. **Keep swipe/carousel gesture containers in `dir="ltr"`** to avoid touch/drag axis inversion bugs in RTL languages.
4. **Wrap English legal and documentation text in `dir="ltr" text-left`** when global `dir="rtl"` is active to prevent reversed punctuation and distorted numbers.
5. **Audit in-page anchor and icon links** to ensure every `href` maps to a registered `page.tsx` route or anchor ID.

