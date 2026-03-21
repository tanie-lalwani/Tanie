import { motion, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"

const questions = [
  "Tell me about yourself.",
  "Walk me through a project you are proud of.",
  "How do you handle bugs in production?",
  "Describe a time you disagreed with a teammate.",
  "How do you optimize frontend performance?",
  "Why do you want this role?",
]

const totalQuestions = questions.length
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

type ScrollDirection = "up" | "down"

export default function QnA() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || shouldReduceMotion

  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const scrollStopTimeoutRef = useRef<number | null>(null)
  const wheelGestureRef = useRef({ delta: 0, lastEventTime: 0 })
  const lastSnapTimeRef = useRef(0)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showBotToast, setShowBotToast] = useState(false)
  const [isBotOpen, setIsBotOpen] = useState(false)
  const [botInput, setBotInput] = useState("")
  const [botMessages, setBotMessages] = useState([
    {
      id: 1,
      sender: "bot" as const,
      text: "Hey, I’m Tani-bot. Ask me about projects, skills, or experience.",
    },
  ])

  const activeIndex = useMemo(
    () => Math.min(Math.max(activeQuestion, 0), totalQuestions - 1),
    [activeQuestion],
  )

  const clearScrollStopTimeout = useCallback(() => {
    if (scrollStopTimeoutRef.current !== null) {
      window.clearTimeout(scrollStopTimeoutRef.current)
      scrollStopTimeoutRef.current = null
    }
  }, [])

  const getNearestIndex = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return 0

    const containerCenter = container.scrollTop + container.clientHeight / 2
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const cardCenter = card.offsetTop + card.offsetHeight / 2
      const distance = Math.abs(cardCenter - containerCenter)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    return nearestIndex
  }, [])

  const scrollToIndex = useCallback(
    (targetIndex: number, behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current
      const targetCard = cardRefs.current[targetIndex]
      if (!container || !targetCard) return

      const boundedIndex = Math.min(Math.max(targetIndex, 0), totalQuestions - 1)
      setActiveQuestion(boundedIndex)
      setIsAnimating(true)
      lastSnapTimeRef.current = Date.now()
      wheelGestureRef.current.delta = 0

      container.scrollTo({
        top:
          targetCard.offsetTop -
          (container.clientHeight - targetCard.offsetHeight) / 2,
        behavior,
      })

      window.setTimeout(() => setIsAnimating(false), behavior === "smooth" ? 420 : 0)
    },
    [],
  )

  const moveToNeighbor = useCallback(
    (direction: ScrollDirection) => {
      const nextIndex =
        direction === "down"
          ? Math.min(activeIndex + 1, totalQuestions - 1)
          : Math.max(activeIndex - 1, 0)

      if (nextIndex !== activeIndex) {
        scrollToIndex(nextIndex)
      } else {
        scrollToIndex(activeIndex)
      }
    },
    [activeIndex, scrollToIndex],
  )

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const onScroll = () => {
      const nearest = getNearestIndex()
      if (nearest !== activeIndex) {
        setActiveQuestion(nearest)
      }

      clearScrollStopTimeout()
      scrollStopTimeoutRef.current = window.setTimeout(() => {
        scrollToIndex(getNearestIndex())
      }, 120)
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      container.removeEventListener("scroll", onScroll)
      clearScrollStopTimeout()
    }
  }, [activeIndex, clearScrollStopTimeout, getNearestIndex, scrollToIndex])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const onWheel = (event: WheelEvent) => {
      const isTrackpadLike = Math.abs(event.deltaY) < 24 || event.deltaMode === 0
      const now = Date.now()
      const timeSinceLastSnap = now - lastSnapTimeRef.current

      if (now - wheelGestureRef.current.lastEventTime > 220) {
        wheelGestureRef.current.delta = 0
      }

      wheelGestureRef.current.lastEventTime = now

      if (isAnimating || timeSinceLastSnap < 460) {
        event.preventDefault()
        return
      }

      wheelGestureRef.current.delta += event.deltaY

      if (!isTrackpadLike && Math.abs(event.deltaY) >= 40) {
        event.preventDefault()
        moveToNeighbor(event.deltaY > 0 ? "down" : "up")
        wheelGestureRef.current.delta = 0
        return
      }

      if (Math.abs(wheelGestureRef.current.delta) >= 120) {
        event.preventDefault()
        moveToNeighbor(wheelGestureRef.current.delta > 0 ? "down" : "up")
        wheelGestureRef.current.delta = 0
      }
    }

    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [isAnimating, moveToNeighbor])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      if (isTyping) return

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
          event.preventDefault()
          moveToNeighbor("down")
          break
        case "ArrowUp":
        case "PageUp":
          event.preventDefault()
          moveToNeighbor("up")
          break
        case " ":
          event.preventDefault()
          moveToNeighbor(event.shiftKey ? "up" : "down")
          break
        case "Home":
          event.preventDefault()
          scrollToIndex(0)
          break
        case "End":
          event.preventDefault()
          scrollToIndex(totalQuestions - 1)
          break
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [moveToNeighbor, scrollToIndex])

  useEffect(() => {
    const behavior = lowPowerMode ? "auto" : "smooth"
    scrollToIndex(0, behavior)
  }, [lowPowerMode, scrollToIndex])

  useEffect(() => {
    if (isMobile) return

    setShowBotToast(true)
    const timeoutId = window.setTimeout(() => {
      setShowBotToast(false)
    }, 3200)

    return () => window.clearTimeout(timeoutId)
  }, [isMobile])

  const handleBotSubmit = useCallback(() => {
    const trimmedInput = botInput.trim()
    if (!trimmedInput) return

    setBotMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: "user", text: trimmedInput },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: "I’m still a lightweight demo bot, but I can be wired to answer questions about Tanisha’s work, stack, and projects.",
      },
    ])
    setBotInput("")
    setIsBotOpen(true)
    setShowBotToast(false)
  }, [botInput])

  return (
    <div className="relative min-h-screen bg-blue-950 text-white">
      <nav className="fixed left-0 top-0 z-40 hidden h-full w-16 flex-col items-center justify-between border-r border-sand-200/10 bg-blue-950/80 py-8 backdrop-blur-lg md:flex">
        <div className="flex flex-col items-center gap-8">
          <Link
            to="/"
            className={`flex flex-col items-center group ${
              location.pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
            }`}
            title="Home"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </Link>
          <Link to="/#contact" className="flex flex-col items-center group text-white/70 hover:text-white" title="Contact">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-xs font-semibold">Contact</span>
          </Link>
        </div>
        <div className="mb-2 flex flex-col items-center gap-6">
          <a href="https://github.com/taniehq" target="_blank" rel="noopener" className="text-white/70 transition-colors duration-150 hover:text-white" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a href="https://instagram.com/tanie.mp3" target="_blank" rel="noopener" className="text-white/70 transition-colors duration-150 hover:text-white" title="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/tanisha-lalwani/" target="_blank" rel="noopener" className="text-white/70 transition-colors duration-150 hover:text-white" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </nav>

      <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex md:right-8">
        <button
          type="button"
          aria-label="Previous question"
          onClick={() => moveToNeighbor("up")}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur transition hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={activeIndex === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next question"
          onClick={() => moveToNeighbor("down")}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur transition hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={activeIndex === totalQuestions - 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <section
        ref={scrollContainerRef}
        className="h-screen snap-y snap-mandatory overflow-y-auto overscroll-y-contain touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
      >
        <div className="mx-auto flex min-h-full max-w-7xl items-stretch justify-center px-0 py-0 md:px-6 md:py-8 md:pl-24 md:pr-24">
          <div className="w-full max-w-3xl">
            {questions.map((question, index) => (
              <article
                key={question}
                ref={(node) => {
                  cardRefs.current[index] = node
                }}
                className="flex min-h-screen snap-center items-center justify-center py-0 md:py-6"
              >
                <div className="flex w-full items-end justify-center gap-3 md:gap-5">
                  <motion.div
                    className="relative w-full overflow-hidden border border-sky-100/15 bg-blue-950 shadow-[0_24px_80px_rgba(2,6,23,0.72)] md:w-[min(34vw,24rem)] md:rounded-[2rem]"
                    style={{ aspectRatio: "9 / 16", maxHeight: "100dvh" }}
                    initial={{ opacity: 0.55, scale: lowPowerMode ? 0.995 : 0.98, filter: lowPowerMode ? "blur(0px)" : "blur(2px)" }}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0.72,
                      scale: activeIndex === index ? 1 : lowPowerMode ? 0.995 : 0.985,
                      filter: activeIndex === index || lowPowerMode ? "blur(0px)" : "blur(1.5px)",
                    }}
                    transition={
                      lowPowerMode
                        ? { duration: 0.18, ease: "linear" }
                        : { type: "spring", stiffness: 160, damping: 24, mass: 0.9 }
                    }
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(160deg,#1f2937_0%,#111827_38%,#020617_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_54%,rgba(0,0,0,0.84)_100%)]" />
                    <div className="absolute inset-0 grid place-items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: lowPowerMode ? 0.15 : 0.35, ease: lowPowerMode ? "linear" : smoothEase }}
                        className="rounded-full border border-sand-200/30 bg-sand-100/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
                      >
                        Video Placeholder
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <motion.p
                        className="text-center text-base font-bold text-white drop-shadow-[0_3px_14px_rgba(2,6,23,0.8)] md:text-lg"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{
                          opacity: activeIndex === index ? 1 : 0.82,
                          y: activeIndex === index ? 0 : 8,
                        }}
                        transition={{
                          duration: lowPowerMode ? 0.16 : 0.32,
                          ease: lowPowerMode ? "linear" : smoothEase,
                        }}
                      >
                        {question}
                      </motion.p>
                    </div>
                  </motion.div>

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

      <div className="fixed bottom-24 right-6 z-40 hidden flex-col items-end sm:right-8 md:flex">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{
            opacity: showBotToast && !isBotOpen ? 1 : 0,
            y: showBotToast && !isBotOpen ? 0 : 6,
            scale: showBotToast && !isBotOpen ? 1 : 0.98,
          }}
          transition={{ duration: 0.25, ease: smoothEase }}
          className="pointer-events-none absolute bottom-2 right-16 w-[16.5rem] origin-bottom-right"
        >
          <div
            className="relative rounded-[1.75rem] border border-sky-100/20 bg-white/92 px-5 py-4 text-blue-950 shadow-2xl backdrop-blur-md"
            style={{ boxShadow: "0 10px 32px rgba(15, 23, 42, 0.24)" }}
          >
            <div className="absolute bottom-5 -right-3 h-6 w-6 rotate-45 rounded-[0.45rem] border-r border-t border-sky-100/20 bg-white/92" />
            <div className="relative">
              <div className="text-sm font-bold">Tani-bot</div>
              <div className="mt-1 text-[13px] leading-relaxed opacity-90">
                Hey, ask me anything about Tanisha.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            opacity: isBotOpen ? 1 : 0,
            y: isBotOpen ? 0 : 16,
            scale: isBotOpen ? 1 : 0.98,
            pointerEvents: isBotOpen ? "auto" : "none",
          }}
          transition={{ duration: 0.25, ease: smoothEase }}
          className="mb-3 w-[22rem] origin-bottom-right"
        >
          <div className="overflow-hidden rounded-[1.6rem] border border-sky-100/15 bg-slate-950/90 shadow-[0_16px_60px_rgba(2,6,23,0.5)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-white">Tani-bot</div>
                <div className="text-xs text-sky-100/70">Instant portfolio assistant</div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                className="rounded-full border border-white/10 p-2 text-white/70 transition hover:text-white"
                onClick={() => setIsBotOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex h-72 flex-col gap-3 overflow-y-auto px-4 py-4">
              {botMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.sender === "bot"
                      ? "self-start bg-white/10 text-sky-50"
                      : "self-end bg-sky-200 text-slate-950"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2">
                <input
                  value={botInput}
                  onChange={(event) => setBotInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      handleBotSubmit()
                    }
                  }}
                  placeholder="Message Tani-bot..."
                  className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/45"
                />
                <button
                  type="button"
                  onClick={handleBotSubmit}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-300 text-slate-950 transition hover:bg-sky-200"
                  aria-label="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22l-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <button
          type="button"
          aria-label="Open Tani-bot"
          onClick={() => {
            setIsBotOpen((currentValue) => !currentValue)
            setShowBotToast(false)
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-sand-200 shadow-lg transition-transform hover:scale-105"
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#020617" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 15s1.5 2 4 2 4-2 4-2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h.01M15 9h.01" />
          </svg>
        </button>
      </div>
    </div>
  )
}
