// ...existing code...
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"


const questions = [
  "Tell me about yourself.",
  "Walk me through a project you are proud of.",
  "How do you handle bugs in production?",
  "Describe a time you disagreed with a teammate.",
  "How do you optimize frontend performance?",
  "Why do you want this role?",
]

// Removed unused: totalQuestions, smoothEase, ScrollDirection


export default function QnA() {
  const location = useLocation()
  // Removed unused isMobile
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  // Removed unused bot-related state


  // Track which card is centered in the viewport
  const [scrolling, setScrolling] = useState(false);
  const activeIndex = useMemo(() => {
    const cards = Array.from(document.querySelectorAll('article.qna-card'));
    if (!cards.length) return 0;
    const viewportCenter = window.innerHeight / 2;
    let minDist = Infinity;
    let idx = 0;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    });
    return idx;
  }, [scrolling]);

  // Listen for scroll to update activeIndex and enable keyboard navigation
  useEffect(() => {
    const onScroll = () => setScrolling(s => !s);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll, { passive: true });
    }
    // Keyboard navigation
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        const cards = Array.from(document.querySelectorAll('article.qna-card'));
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          if (activeIndex < questions.length - 1) {
            (cards[activeIndex + 1] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setScrolling(s => !s), 400);
          }
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
          if (activeIndex > 0) {
            (cards[activeIndex - 1] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => setScrolling(s => !s), 400);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      if (container) container.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex]);





  // Removed unused handleBotSubmit

  return (
    <div className="site-shell">
      <nav className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-between border-r border-sky-200/20 bg-[#dff2ff]/12 py-8 backdrop-blur-xl md:flex">
        <div className="flex flex-col items-center gap-8">
          <Link
            to="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 transition-all ${
              location.pathname === "/" ? "bg-[#bfe4ff] text-blue-950" : "text-sky-100/80 hover:bg-white/12 hover:text-white"
            }`}
            title="Home"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </Link>
          <Link to="/#contact" className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 text-sky-100/80 transition-all hover:bg-white/12 hover:text-white" title="Contact">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-xs font-semibold">Contact</span>
          </Link>
        </div>
        <div className="mb-2 flex flex-col items-center gap-4">
          <a href="https://github.com/taniehq" target="_blank" rel="noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-sky-200/20 bg-white/8 text-sky-100/80 transition-colors duration-150 hover:bg-white/14 hover:text-white" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a href="https://instagram.com/tanie.mp3" target="_blank" rel="noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-sky-200/20 bg-white/8 text-sky-100/80 transition-colors duration-150 hover:bg-white/14 hover:text-white" title="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/tanisha-lalwani/" target="_blank" rel="noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-sky-200/20 bg-white/8 text-sky-100/80 transition-colors duration-150 hover:bg-white/14 hover:text-white" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </nav>

      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex md:right-8">
        <button
          type="button"
          aria-label="Previous question"
          onClick={() => {
            const cards = Array.from(document.querySelectorAll('article[style*="scrollSnapAlign"]'));
            if (activeIndex > 0) {
              (cards[activeIndex - 1] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => setScrolling(s => !s), 400); // force update after scroll
            }
          }}
          className="ui-icon-button h-12 w-12"
          tabIndex={0}
          disabled={activeIndex === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next question"
          onClick={() => {
            const cards = Array.from(document.querySelectorAll('article[style*="scrollSnapAlign"]'));
            if (activeIndex < questions.length - 1) {
              (cards[activeIndex + 1] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => setScrolling(s => !s), 400); // force update after scroll
            }
          }}
          className="ui-icon-button h-12 w-12"
          tabIndex={0}
          disabled={activeIndex === questions.length - 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <section
        ref={scrollContainerRef}
        className={
          // Always apply scroll snap and smooth scrolling for both mobile and desktop
          "h-screen overflow-y-auto overscroll-y-contain touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
        }
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          scrollSnapType: "y mandatory",
          scrollPaddingTop: "10vh",
          scrollPaddingBottom: "10vh"
        }}
      >
        <div className="site-container mx-auto flex min-h-full items-stretch justify-center px-0 py-0 md:px-6 md:py-8 md:pl-24 md:pr-24">
          <div className="w-full max-w-3xl">
            {questions.map((question) => (
              <article
                key={question}
                className="qna-card flex min-h-[90vh] items-center justify-center py-0 md:py-6 snap-center transition-all duration-300"
                style={{
                  scrollSnapAlign: "center",
                  scrollMarginTop: "10vh",
                  scrollMarginBottom: "10vh"
                }}
              >
                <div className="flex w-full items-end justify-center gap-3 md:gap-5">
                  <div
                    className="surface-panel relative w-[82vw] max-w-[18rem] overflow-hidden rounded-[1.4rem] md:w-[min(34vw,24rem)] md:max-w-none md:rounded-4xl"
                    style={{ aspectRatio: "9 / 16", maxHeight: "92vh", transition: 'box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)' }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(160deg,#1e293b_0%,#0f172a_42%,#020617_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_54%,rgba(0,0,0,0.84)_100%)]" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div
                        className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-50 backdrop-blur"
                      >
                        Video Placeholder
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p
                        className="text-center text-base font-bold text-white md:text-lg"
                      >
                        {question}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3 hidden flex-col items-center gap-4 text-white/80 md:flex">
                    <button className="transition hover:text-white" title="Like" aria-label="Like">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                      </svg>
                    </button>
                    <button className="transition hover:text-white" title="Comment" aria-label="Comment">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </button>
                    <button className="transition hover:text-white" title="Share" aria-label="Share">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 6l-4-4-4 4M12 2v14" />
                      </svg>
                    </button>
                    <button className="transition hover:text-white" title="Save" aria-label="Save">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bot UI removed */}
    </div>
  )
}
