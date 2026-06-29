import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { getBotReply } from "../lib/botAssistant"
import SEOHead from "../components/SEOHead"

// Removed unused: totalQuestions, smoothEase, ScrollDirection

type BotMessage = {
  id: number
  role: "bot" | "user"
  text: string
}

const transcriptReplies = [
  "I am Tanie Lalwani, a creative developer focused on React, TypeScript, UI design, full-stack experiments, and interactive web experiences. I got into tech through curiosity: building, redesigning, fixing details, and learning how interfaces can feel memorable instead of just functional.",
  "A project I am proud of is Viziona, because it reflects how I think about product work: responsive layouts, clear interaction, visual hierarchy, and practical execution. I care about making the interface feel polished, readable, and easy to move through.",
  "When I handle bugs in production, I start by reproducing the issue, checking the user impact, reading logs or browser errors, and narrowing the cause before changing code. I prefer small fixes, clear testing, and documenting what broke so the same issue is less likely to return.",
  "When I disagree with a teammate, I try to move the conversation toward the user, the constraints, and the evidence. I explain my reasoning, listen for what I missed, and look for the option that protects the product instead of trying to win the argument.",
  "For frontend performance, I look at bundle size, unnecessary renders, image weight, layout shifts, and slow interactions. I use lazy loading, memoization where it actually helps, cleaner component boundaries, and practical measurement instead of guessing.",
  "I want roles where I can combine engineering, design sensitivity, communication, and product thinking. I like work that lets me build useful things, explain technology clearly, collaborate with people, and create digital experiences that feel intentional.",
]

function getCenteredCardIndex() {
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
}

function getQuestionCards() {
  return Array.from(document.querySelectorAll('article.qna-card')) as HTMLElement[];
}


export default function QnA() {
  const { copy } = useLanguage()
  const location = useLocation()
  // Removed unused isMobile
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [isBotOpen, setIsBotOpen] = useState(false)
  const [openTranscriptIndex, setOpenTranscriptIndex] = useState<number | null>(null)
  const [botNotificationVisible, setBotNotificationVisible] = useState(true)
  const [botInput, setBotInput] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    { id: 1, role: "bot", text: "hi im tanie" },
  ])

  // Track which card is centered in the viewport
  const [activeIndex, setActiveIndex] = useState(0);
  const questions = copy.qna.questions

  useEffect(() => {
    document.title = "About Tanie Lalwani | Interview QnA"
  }, [])

  const scrollToQuestion = (index: number) => {
    const cards = getQuestionCards();
    const nextIndex = Math.min(Math.max(index, 0), cards.length - 1);
    cards[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setActiveIndex(nextIndex);
  };

  // Listen for scroll to update activeIndex and enable keyboard navigation
  useEffect(() => {
    const onScroll = () => setActiveIndex(getCenteredCardIndex());
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', onScroll, { passive: true });
    }
    // Keyboard navigation
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          if (activeIndex < questions.length - 1) {
            scrollToQuestion(activeIndex + 1);
            setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400);
          }
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
          if (activeIndex > 0) {
            scrollToQuestion(activeIndex - 1);
            setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      if (container) container.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, questions.length]);





  const handleBotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = botInput.trim()
    if (!trimmed || isReplying) return

    const userMessageId = Date.now()
    setBotMessages((currentMessages) => [
      ...currentMessages,
      {
        id: userMessageId,
        role: "user",
        text: trimmed,
      },
      {
        id: userMessageId + 1,
        role: "bot",
        text: "Thinking...",
      },
    ])
    setBotInput("")
    setBotNotificationVisible(false)

    setIsReplying(true)

    const reply = await getBotReply(trimmed)

    setBotMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === userMessageId + 1
          ? {
              ...message,
              text: reply,
            }
          : message,
      ),
    )

    setIsReplying(false)
  }

  const openBot = () => {
    setIsBotOpen(true)
    setBotNotificationVisible(false)
  }

  const closeBot = () => {
    setIsBotOpen(false)
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q, idx) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": transcriptReplies[idx] || ""
      }
    }))
  };

  return (
    <main className="site-shell bg-[#dff4ff] text-black">
      <SEOHead
        title="Frontend Interview Questions & Answers | Tanie Lalwani"
        description="Interview questions by Tanie Lalwani covering React.js, TypeScript, Next.js, Three.js, interactive web development, full-stack engineering, and more about her experience and background."
        canonicalUrl="https://tanie.me/qna"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="sr-only">Frontend & React Interview Questions & Answers — Tanie Lalwani</h1>
      <nav className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-between border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex">
        <div className="flex flex-col items-center gap-8">
          <Link
            to="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 transition-all ${
              location.pathname === "/" ? "bg-[#c8ecff] !text-black" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title={copy.qna.homeLabel}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-xs font-semibold">{copy.qna.homeLabel}</span>
          </Link>
          <Link to="/#contact" className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !text-black transition-all hover:bg-white/55 hover:!text-black" title={copy.qna.contactLabel}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-xs font-semibold">{copy.qna.contactLabel}</span>
          </Link>
        </div>
        <div className="mb-2 flex flex-col items-center gap-4">
          <a href="https://github.com/tanie-lalwani" target="_blank" rel="me noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a href="https://instagram.com/tanie.mp3" target="_blank" rel="me noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black" title="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/tanie-lalwani/" target="_blank" rel="noopener" className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black" title="LinkedIn">
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
            if (activeIndex > 0) {
              scrollToQuestion(activeIndex - 1);
              setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400); // force update after scroll
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/55 text-black shadow-sm backdrop-blur transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-35"
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
            if (activeIndex < questions.length - 1) {
              scrollToQuestion(activeIndex + 1);
              setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400); // force update after scroll
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/55 text-black shadow-sm backdrop-blur transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-35"
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
        aria-label="Interview reel questions"
        className={
          // Always apply scroll snap and smooth scrolling for both mobile and desktop
          "h-screen overflow-y-auto overscroll-y-contain bg-[#dff4ff] touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
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
            {questions.map((question, index) => (
              <article
                key={question}
                aria-labelledby={`qna-question-${index}`}
                className="qna-card flex min-h-[90vh] items-center justify-center py-0 md:py-6 snap-center transition-all duration-300"
                style={{
                  scrollSnapAlign: "center",
                  scrollSnapStop: "always",
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
                        {copy.qna.videoPlaceholder}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h2
                        id={`qna-question-${index}`}
                        className="text-center text-base font-bold text-white md:text-lg"
                      >
                        {question}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-black/30 text-white/82 backdrop-blur transition hover:bg-black/42 md:hidden"
                      onClick={() => setOpenTranscriptIndex(index)}
                      aria-label={`Open transcript for ${question}`}
                      aria-haspopup="dialog"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-3 hidden flex-col items-center gap-4 text-black md:flex">
                      <button className="transition hover:text-black/62" title={copy.qna.like} aria-label={copy.qna.like}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                      </svg>
                    </button>
                      <button
                        type="button"
                        className="comment-pulse transition hover:text-black/62"
                        title={copy.qna.comment}
                        aria-label={`Open transcript for ${question}`}
                        aria-haspopup="dialog"
                        onClick={() => setOpenTranscriptIndex(index)}
                      >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </button>
                      <button className="transition hover:text-black/62" title={copy.qna.share} aria-label={copy.qna.share}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 6l-4-4-4 4M12 2v14" />
                      </svg>
                    </button>
                      <button className="transition hover:text-black/62" title={copy.qna.save} aria-label={copy.qna.save}>
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

      {openTranscriptIndex !== null ? (
        <aside
          className="fixed inset-x-4 bottom-4 z-50 max-h-[70vh] overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/94 shadow-[0_26px_75px_rgba(15,23,42,0.22)] backdrop-blur-xl md:inset-x-auto md:bottom-auto md:right-[7rem] md:top-1/2 md:w-[24rem] md:-translate-y-1/2"
          role="dialog"
          aria-modal="false"
          aria-labelledby="qna-transcript-title"
        >
          <header className="flex items-center justify-between border-b border-black/6 px-4 py-3">
            <p id="qna-transcript-title" className="text-sm font-semibold text-black">Transcript</p>
            <button
              type="button"
              onClick={() => setOpenTranscriptIndex(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-black/55 transition hover:bg-black/8 hover:text-black"
              aria-label="Close transcript"
            >
              ×
            </button>
          </header>
          <article className="max-h-[calc(70vh-3.5rem)] overflow-y-auto px-4 py-4">
            <h2 className="text-sm font-semibold leading-6 text-black">{questions[openTranscriptIndex]}</h2>
            <p className="mt-3 text-sm leading-7 tracking-normal text-black/68">{transcriptReplies[openTranscriptIndex]}</p>
          </article>
        </aside>
      ) : null}

      <section className="sr-only" aria-label="Readable interview transcripts">
        {questions.map((question, index) => (
          <article key={`${question}-transcript`}>
            <h2>{question}</h2>
            <p>{transcriptReplies[index]}</p>
          </article>
        ))}
      </section>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
        {botNotificationVisible ? (
          <button
            type="button"
            onClick={openBot}
            className="max-w-56 rounded-[1.35rem] border border-black/10 bg-white/86 px-4 py-2 text-left text-[11px] font-semibold tracking-[0.14em] text-black shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
            aria-label="Open bot message"
          >
            hi im tanie
          </button>
        ) : null}

        <button
          type="button"
          onClick={isBotOpen ? closeBot : openBot}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[10px] font-semibold tracking-[0.12em] text-black/58 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/90"
          aria-expanded={isBotOpen}
          aria-controls="qna-bot-panel"
          aria-label={isBotOpen ? "Close bot panel" : "Open bot panel"}
        >
          <span className="absolute inset-[0.45rem] rounded-full border border-black/8 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.55)_48%,rgba(208,244,255,0.9)_100%)]" />
          <span className="relative z-10 text-[9px] uppercase tracking-[0.22em] text-black/55">bot</span>
          {botNotificationVisible ? (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#dff4ff] bg-[#ff6b6b] shadow-[0_0_0_6px_rgba(255,107,107,0.14)]" aria-hidden="true" />
          ) : null}
        </button>

        {isBotOpen ? (
          <section
            id="qna-bot-panel"
            className="w-[min(92vw,22rem)] overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/92 shadow-[0_26px_75px_rgba(15,23,42,0.22)] backdrop-blur-xl"
            aria-label="QnA bot panel"
          >
            <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/38">Assistant</p>
                <p className="text-sm font-semibold text-black">Tanie bot</p>
              </div>
              <button
                type="button"
                onClick={closeBot}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-black/55 transition hover:bg-black/8 hover:text-black"
                aria-label="Close bot panel"
              >
                ×
              </button>
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-4">
              {botMessages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "bot"
                      ? "flex justify-start"
                      : "flex justify-end"
                  }
                >
                  <div
                    className={
                      message.role === "bot"
                        ? "max-w-[82%] rounded-[1.2rem] rounded-bl-md bg-[#dff4ff] px-3 py-2 text-sm leading-6 tracking-normal text-black"
                        : "max-w-[82%] rounded-[1.2rem] rounded-br-md bg-[#0f172a] px-3 py-2 text-sm leading-6 tracking-normal text-white"
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleBotSubmit} className="border-t border-black/6 p-3">
              <label className="sr-only" htmlFor="qna-bot-input">Type a message</label>
              <div className="flex items-end gap-2 rounded-[1.2rem] border border-black/10 bg-[#f7fbff] px-3 py-2">
                <textarea
                  id="qna-bot-input"
                  value={botInput}
                  onChange={(event) => setBotInput(event.target.value)}
                  rows={1}
                  placeholder="Say something..."
                  className="min-h-10 max-h-28 flex-1 resize-none bg-transparent text-sm leading-6 text-black outline-none placeholder:text-black/34"
                />
                <button
                  type="submit"
                  disabled={isReplying}
                  className="rounded-full bg-[#0f172a] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isReplying ? "..." : "Send"}
                </button>
              </div>
              
            </form>
          </section>
        ) : null}
      </div>
    </main>
  )
}
