import { useEffect, useRef, useState, useMemo, type FormEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { getBotReply } from "../lib/botAssistant"
import SEOHead from "../components/SEOHead"
import { loadCustomProjects, getVimeoEmbedUrl } from "../lib/projectStorage"
import type { Project as CarouselProject } from "../components/ProjectsCarousel"

type BotMessage = {
  id: number
  role: "bot" | "user"
  text: string
}

function getCenteredCardIndex() {
  const cards = Array.from(document.querySelectorAll('article.project-reel-card'))
  if (!cards.length) return 0

  const viewportCenter = window.innerHeight / 2
  let minDist = Infinity
  let idx = 0

  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect()
    const cardCenter = rect.top + rect.height / 2
    const dist = Math.abs(cardCenter - viewportCenter)

    if (dist < minDist) {
      minDist = dist
      idx = i
    }
  })

  return idx
}

function getProjectCards() {
  return Array.from(document.querySelectorAll('article.project-reel-card')) as HTMLElement[]
}

export default function Projects() {
  const { copy, locale } = useLanguage()
  const location = useLocation()
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  const [isBotOpen, setIsBotOpen] = useState(false)
  const [openDetailIndex, setOpenDetailIndex] = useState<number | null>(null)
  const [botNotificationVisible, setBotNotificationVisible] = useState(true)
  const [botInput, setBotInput] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    { id: 1, role: "bot", text: "hi! exploring my projects? feel free to ask me anything about them!" },
  ])

  // Projects state
  const [dbProjects, setDbProjects] = useState<CarouselProject[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Track centered card
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    document.title = "Projects & Works | Tanie Lalwani"

    // Fetch projects from Supabase or fallback
    loadCustomProjects()
      .then((loaded) => {
        setDbProjects(loaded)
      })
      .finally(() => setIsLoadingProjects(false))
  }, [])

interface ResolvedProject {
  id: string
  title: string
  description: string
  techStack: string[]
  site: string
  code?: string
  previewVideo?: string
  detailVideo?: string
  previewFit?: "cover" | "contain"
  previewOpacity?: string
  details: string[]
  videoAlt?: string
}

  // Resolve Multilingual Projects (either db or static fallback from LanguageContext)
  const resolvedProjects: ResolvedProject[] = useMemo(() => {
    if (dbProjects.length > 0) {
      return dbProjects.map((p, idx) => {
        const getField = (baseKey: string): string => {
          if (locale === "en") return (p as any)[baseKey] || ""
          const key = `${baseKey}_${locale}`
          return (p as any)[key] || (p as any)[baseKey] || ""
        }
        const getDetails = (): string[] => {
          if (locale === "en") return p.details || []
          const key = `details_${locale}`
          return (p as any)[key] || p.details || []
        }

        const detailsList = getDetails()

        return {
          id: p.id || `project-${idx}`,
          title: getField("title") || p.title,
          description: getField("description") || p.description,
          techStack: p.techStack || [],
          site: p.site || "",
          code: p.code || "",
          previewVideo: p.previewVideo || "",
          detailVideo: p.detailVideo || "",
          previewFit: p.previewFit || "cover",
          previewOpacity: p.previewOpacity,
          details: detailsList.length > 0 ? detailsList : (p.details ?? copy.projectCard.defaultProjectDetails),
          videoAlt: p.videoAlt || p.title,
        }
      })
    }

    // Static fallback using copy.home.projects
    return copy.home.projects.map((project, idx) => ({
      id: project.id || `fallback-proj-${idx}`,
      title: project.title,
      description: project.description,
      techStack: project.techStack || [],
      site: project.site,
      code: project.code,
      previewVideo: project.previewVideo,
      detailVideo: project.detailVideo,
      previewFit: project.previewFit || "cover",
      previewOpacity: project.previewOpacity,
      details: project.details ?? copy.projectCard.defaultProjectDetails,
      videoAlt: project.title,
    }))
  }, [dbProjects, copy.home.projects, copy.projectCard.defaultProjectDetails, locale])

  const scrollToProject = (index: number) => {
    const cards = getProjectCards()
    const nextIndex = Math.min(Math.max(index, 0), cards.length - 1)
    cards[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
    setActiveIndex(nextIndex)
  }

  // Keyboard and scroll listeners
  useEffect(() => {
    const onScroll = () => setActiveIndex(getCenteredCardIndex())
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", onScroll, { passive: true })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault()
        if (event.key === "ArrowDown" || event.key === "PageDown") {
          if (activeIndex < resolvedProjects.length - 1) {
            scrollToProject(activeIndex + 1)
            setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400)
          }
        } else if (event.key === "ArrowUp" || event.key === "PageUp") {
          if (activeIndex > 0) {
            scrollToProject(activeIndex - 1)
            setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400)
          }
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      if (container) container.removeEventListener("scroll", onScroll)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeIndex, resolvedProjects.length])

  // Share handler
  const handleShare = async (project: typeof resolvedProjects[0]) => {
    const shareUrl = project.site || window.location.href
    const shareText = `Check out ${project.title}: ${project.description}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.warn("Share failed:", err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopiedId(project.id)
        setTimeout(() => setCopiedId(null), 2000)
      } catch (err) {
        console.error("Failed to copy URL:", err)
      }
    }
  }

  const toggleLike = (id: string) => {
    setLikedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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

  const projectsSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: resolvedProjects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          url: project.site,
        },
      })),
    }),
    [resolvedProjects],
  )

  return (
    <main className="site-shell bg-[#dff4ff] text-black">
      <SEOHead
        title="Projects & Works | Tanie Lalwani"
        description="Explore interactive frontend, full-stack web applications, and creative developer projects by Tanie Lalwani featuring React, TypeScript, Three.js, and modern UI engineering."
        canonicalUrl="https://tanie.me/projects"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <h1 className="sr-only">Web & Full Stack Projects — Tanie Lalwani</h1>

      {/* Left Navigation Bar */}
      <nav
        aria-label="Side navigation"
        className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-between border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex"
      >
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              location.pathname === "/" ? "bg-[#c8ecff] !text-black" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title={copy.qna.homeLabel}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[11px] font-semibold">{copy.qna.homeLabel}</span>
          </Link>

          <Link
            to="/projects"
            className="flex w-14 flex-col items-center rounded-[1.35rem] bg-[#c8ecff] px-2 py-3 !text-black !no-underline shadow-xs transition-all"
            title="Projects"
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[11px] font-semibold">Projects</span>
          </Link>

          <Link
            to="/qna"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !text-black !no-underline transition-all hover:bg-white/55 hover:!text-black"
            title={copy.nav.qna}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-semibold">{copy.nav.qna}</span>
          </Link>

          <Link
            to="/contact"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !text-black !no-underline transition-all hover:bg-white/55 hover:!text-black"
            title={copy.qna.contactLabel}
          >
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-[11px] font-semibold">{copy.qna.contactLabel}</span>
          </Link>
        </div>

        <div className="mb-2 flex flex-col items-center gap-3.5">
          <a
            href="https://github.com/tanie-lalwani"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://instagram.com/tanie.mp3"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/tanie-lalwani/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://me.developers.google.com/u/tanielalwani"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-black/10 bg-white/45 !text-black transition-colors duration-150 hover:bg-white/70 hover:!text-black"
            title="Google Developers"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.41 0-6.173-2.763-6.173-6.173 0-3.41 2.763-6.173 6.173-6.173 1.485 0 2.842.525 3.9 1.4l3.017-3.017C17.848 1.54 15.22.75 12.24.75 5.866.75.7 5.916.7 12.29s5.166 11.54 11.54 11.54c6.643 0 11.055-4.665 11.055-11.26 0-.756-.067-1.485-.195-2.285H12.24z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/88 px-4 backdrop-blur-xl md:hidden">
        <Link to="/" className="flex items-center gap-2 !no-underline !text-black font-semibold text-sm">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{copy.qna.homeLabel}</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-black/70">
          {copy.home.projectsTitle || "Projects"}
        </span>
        <Link to="/qna" className="!no-underline !text-black text-xs font-semibold px-2.5 py-1 rounded-full bg-white/50 border border-black/10">
          {copy.nav.qna}
        </Link>
      </header>

      {/* Floating Prev/Next Buttons on the right */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex md:right-8">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => {
            if (activeIndex > 0) {
              scrollToProject(activeIndex - 1)
              setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400)
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/55 text-black shadow-sm backdrop-blur transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
          tabIndex={0}
          disabled={activeIndex === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 15 12 9 18 15" />
          </svg>
        </button>
        <div className="text-center text-[10px] font-bold text-black/40 select-none">
          {activeIndex + 1} / {resolvedProjects.length}
        </div>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => {
            if (activeIndex < resolvedProjects.length - 1) {
              scrollToProject(activeIndex + 1)
              setTimeout(() => setActiveIndex(getCenteredCardIndex()), 400)
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-black/12 bg-white/55 text-black shadow-sm backdrop-blur transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
          tabIndex={0}
          disabled={activeIndex === resolvedProjects.length - 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {isLoadingProjects ? (
        <div className="flex h-screen w-full items-center justify-center bg-[#dff4ff]">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-500/20 border-t-sky-500 mx-auto" />
            <p className="text-xs text-sky-950/50 uppercase tracking-widest">Loading Projects...</p>
          </div>
        </div>
      ) : (
        <section
          ref={scrollContainerRef}
          aria-label="Projects showcase"
          className="h-screen overflow-y-auto overscroll-y-contain bg-[#dff4ff] touch-pan-y [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory pt-14 md:pt-0"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            scrollSnapType: "y mandatory",
            scrollPaddingTop: "8vh",
            scrollPaddingBottom: "8vh",
          }}
        >
          <div className="site-container mx-auto flex min-h-full items-stretch justify-center px-2 py-0 md:px-6 md:py-8 md:pl-24 md:pr-24">
            <div className="w-full max-w-5xl flex flex-col items-center">
              {resolvedProjects.map((project, index) => {
                const videoSource = project.detailVideo || project.previewVideo
                const isVimeo = Boolean(videoSource && videoSource.includes("vimeo.com"))
                const embedUrl = isVimeo && videoSource ? getVimeoEmbedUrl(videoSource) : null
                const isLiked = Boolean(likedProjects[project.id])
                const isCopied = copiedId === project.id

                return (
                  <article
                    key={project.id}
                    aria-labelledby={`project-title-${index}`}
                    className="project-reel-card flex min-h-[92vh] w-full items-center justify-center py-3 md:py-6 snap-center transition-all duration-300"
                    style={{
                      scrollSnapAlign: "center",
                      scrollSnapStop: "always",
                      scrollMarginTop: "8vh",
                      scrollMarginBottom: "8vh",
                    }}
                  >
                    <div className="flex w-full items-end justify-center gap-3 md:gap-5">
                      {/* 16:9 Ratio Card Container */}
                      <div
                        className="surface-panel relative w-[94vw] max-w-[48rem] md:w-[min(64vw,54rem)] lg:w-[min(58vw,58rem)] overflow-hidden rounded-[1.4rem] md:rounded-3xl border border-black/12 bg-[#020617] shadow-[0_24px_70px_rgba(15,23,42,0.22)] group"
                        style={{
                          aspectRatio: "16 / 9",
                          maxHeight: "85vh",
                          transition: "box-shadow 0.3s, transform 0.3s",
                        }}
                      >
                        {/* Video Layer */}
                        <div className="absolute inset-0 bg-[#020617]" />
                        {videoSource ? (
                          isVimeo && embedUrl ? (
                            <iframe
                              src={embedUrl}
                              className="absolute inset-0 h-full w-full object-cover border-0 opacity-85 group-hover:opacity-95 transition-opacity"
                              allow="autoplay; fullscreen; picture-in-picture"
                              title={project.videoAlt || project.title}
                              style={{ pointerEvents: "none" }}
                            />
                          ) : (
                            <video
                              src={videoSource}
                              className={`absolute inset-0 h-full w-full ${
                                project.previewFit === "contain" ? "object-contain p-2" : "object-cover"
                              } opacity-85 group-hover:opacity-95 transition-opacity`}
                              autoPlay
                              loop
                              muted
                              playsInline
                              aria-label={project.videoAlt || project.title}
                            />
                          )
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.18),transparent_40%),linear-gradient(160deg,#0f172a_0%,#020617_100%)]" />
                            <div className="absolute inset-0 grid place-items-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-3xl sm:text-5xl font-serif text-sky-200/40">✦</span>
                                <div className="rounded-full border border-white/14 bg-white/8 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-sky-100 backdrop-blur">
                                  {copy.projectCard.demoLabel || "Project Preview"}
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Top Overlay: Tech Stack Pills & Mobile Details Button */}
                        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4.5 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none">
                          <div className="flex flex-wrap gap-1.5 pointer-events-auto max-w-[80%]">
                            {project.techStack?.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center rounded-full border border-white/14 bg-black/40 px-2.5 py-0.5 text-[9px] sm:text-[11px] font-medium tracking-wide text-sky-100/90 backdrop-blur-md"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack && project.techStack.length > 4 ? (
                              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] sm:text-[11px] font-medium text-white/60 backdrop-blur-md">
                                +{project.techStack.length - 4}
                              </span>
                            ) : null}
                          </div>

                          {/* Mobile trigger for details modal */}
                          <button
                            type="button"
                            className="pointer-events-auto grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full border border-white/16 bg-black/40 text-white/90 backdrop-blur hover:bg-black/60 md:hidden cursor-pointer"
                            onClick={() => setOpenDetailIndex(index)}
                            aria-label={`Open details for ${project.title}`}
                          >
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Bottom Overlay: Title, Description, Quick Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 md:p-6 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 sm:gap-3">
                            <div className="max-w-[85%] sm:max-w-xl">
                              <h2
                                id={`project-title-${index}`}
                                className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1"
                              >
                                {project.title}
                              </h2>
                              <p className="mt-1 text-xs sm:text-sm text-slate-200/85 line-clamp-2 leading-relaxed font-normal">
                                {project.description}
                              </p>
                            </div>

                            {/* Quick Action Buttons on Desktop/Tablet inside the card */}
                            <div className="flex items-center gap-2 pt-1 md:pt-0 shrink-0">
                              {project.site ? (
                                <a
                                  href={project.site}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-sky-500/85 hover:bg-sky-400 text-slate-950 px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-sm transition !no-underline"
                                >
                                  <span>{copy.projectCard.view || "Live Demo"}</span>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                </a>
                              ) : null}

                              {project.code ? (
                                <a
                                  href={project.code}
                                  target="_blank"
                                  rel="me noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 text-xs font-semibold tracking-wide backdrop-blur transition !no-underline"
                                  title="Source Code"
                                >
                                  <span>{copy.projectCard.code || "Code"}</span>
                                </a>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => setOpenDetailIndex(index)}
                                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 hover:bg-white/15 text-white/90 px-3 py-1.5 text-xs font-medium backdrop-blur transition cursor-pointer"
                              >
                                <span>{copy.projectCard.projectDetails || "Info"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Icons on Desktop (like QnA style) */}
                      <div className="mb-2 hidden flex-col items-center gap-3.5 text-black md:flex shrink-0">
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={() => toggleLike(project.id)}
                          className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 backdrop-blur transition-all duration-200 hover:bg-white/90 hover:scale-105 cursor-pointer ${
                            isLiked ? "text-rose-500 bg-white" : "text-black/75 hover:text-black"
                          }`}
                          title={isLiked ? "Liked" : copy.qna.like}
                          aria-label={copy.qna.like}
                        >
                          <svg
                            width="22"
                            height="22"
                            fill={isLiked ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                          </svg>
                        </button>

                        {/* Details Modal Trigger */}
                        <button
                          type="button"
                          onClick={() => setOpenDetailIndex(index)}
                          className="comment-pulse flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 text-black/75 backdrop-blur transition-all hover:bg-white/90 hover:text-black hover:scale-105 cursor-pointer"
                          title={copy.projectCard.projectDetails}
                          aria-label={`Open details for ${project.title}`}
                          aria-haspopup="dialog"
                        >
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={() => handleShare(project)}
                          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 text-black/75 backdrop-blur transition-all hover:bg-white/90 hover:text-black hover:scale-105 cursor-pointer"
                          title={copy.qna.share}
                          aria-label={copy.qna.share}
                        >
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 6l-4-4-4 4M12 2v14" />
                          </svg>
                          {isCopied ? (
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-black px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                              Copied!
                            </span>
                          ) : null}
                        </button>

                        {/* Direct Site Link Button */}
                        {project.site ? (
                          <a
                            href={project.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 text-black/75 backdrop-blur transition-all hover:bg-white/90 hover:text-black hover:scale-105 !no-underline"
                            title={copy.projectCard.view}
                            aria-label={copy.projectCard.view}
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : null}

                        {/* GitHub Code Link Button */}
                        {project.code ? (
                          <a
                            href={project.code}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 text-black/75 backdrop-blur transition-all hover:bg-white/90 hover:text-black hover:scale-105 !no-underline"
                            title={copy.projectCard.code}
                            aria-label={copy.projectCard.code}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                            </svg>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Project Details Modal / Drawer */}
      {openDetailIndex !== null && resolvedProjects[openDetailIndex] ? (
        <aside
          className="fixed inset-x-4 bottom-4 z-50 max-h-[78vh] overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/95 shadow-[0_26px_75px_rgba(15,23,42,0.25)] backdrop-blur-xl md:inset-x-auto md:bottom-auto md:right-[6.5rem] md:top-1/2 md:w-[26rem] md:-translate-y-1/2"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
        >
          <header className="flex items-center justify-between border-b border-black/8 px-5 py-3.5 bg-slate-50/60">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
                {copy.projectCard.projectDetails || "Project Overview"}
              </p>
              <p id="project-detail-title" className="text-sm font-bold text-black line-clamp-1">
                {resolvedProjects[openDetailIndex].title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenDetailIndex(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-black/60 transition hover:bg-black/10 hover:text-black cursor-pointer"
              aria-label={copy.projectCard.closeDetails}
            >
              ×
            </button>
          </header>

          <article className="max-h-[calc(78vh-7.5rem)] overflow-y-auto px-5 py-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-1.5">Description</h3>
              <p className="text-sm leading-relaxed text-black/80 font-normal">
                {resolvedProjects[openDetailIndex].description}
              </p>
            </div>

            {resolvedProjects[openDetailIndex].techStack && resolvedProjects[openDetailIndex].techStack.length > 0 ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {resolvedProjects[openDetailIndex].techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-black/8 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-950"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {resolvedProjects[openDetailIndex].details && resolvedProjects[openDetailIndex].details.length > 0 ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-black/50 mb-2">Highlights & Features</h3>
                <ul className="space-y-2 text-sm text-black/75">
                  {resolvedProjects[openDetailIndex].details.map((detail: string, dIdx: number) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="text-sky-600 mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="pt-3 border-t border-black/8 flex flex-wrap gap-2">
              {resolvedProjects[openDetailIndex].site ? (
                <a
                  href={resolvedProjects[openDetailIndex].site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition hover:bg-slate-800 !no-underline shadow-sm"
                >
                  <span>{copy.projectCard.view || "Live Demo"}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : null}

              {resolvedProjects[openDetailIndex].code ? (
                <a
                  href={resolvedProjects[openDetailIndex].code}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-black/12 bg-white px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-black transition hover:bg-black/5 !no-underline shadow-xs"
                >
                  <span>{copy.projectCard.code || "Code"}</span>
                </a>
              ) : null}
            </div>
          </article>
        </aside>
      ) : null}

      {/* Screen-reader accessible list for SEO & Accessibility */}
      <section className="sr-only" aria-label="Readable projects summary">
        {resolvedProjects.map((project) => (
          <article key={`${project.id}-accessible`}>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.details?.map((detail: string, idx: number) => (
              <p key={idx}>{detail}</p>
            ))}
            <a href={project.site}>{copy.projectCard.view}</a>
            {project.code ? <a href={project.code}>{copy.projectCard.code}</a> : null}
          </article>
        ))}
      </section>

      {/* Floating Tanie Bot in bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
        {botNotificationVisible ? (
          <button
            type="button"
            onClick={openBot}
            className="max-w-56 rounded-[1.35rem] border border-black/10 bg-white/86 px-4 py-2 text-left text-xs sm:text-[11px] font-semibold tracking-[0.14em] text-black shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white cursor-pointer"
            aria-label="Open bot message"
          >
            ask about these projects
          </button>
        ) : null}

        <button
          type="button"
          onClick={isBotOpen ? closeBot : openBot}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xs sm:text-[10px] font-semibold tracking-[0.12em] text-black/58 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/90 cursor-pointer"
          aria-expanded={isBotOpen}
          aria-controls="projects-bot-panel"
          aria-label={isBotOpen ? "Close bot panel" : "Open bot panel"}
        >
          <span className="absolute inset-[0.45rem] rounded-full border border-black/8 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0.55)_48%,rgba(208,244,255,0.9)_100%)]" />
          <span className="relative z-10 text-xs sm:text-[9px] uppercase tracking-[0.22em] text-black/55">bot</span>
          {botNotificationVisible ? (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#dff4ff] bg-[#ff6b6b] shadow-[0_0_0_6px_rgba(255,107,107,0.14)]" aria-hidden="true" />
          ) : null}
        </button>

        {isBotOpen ? (
          <section
            id="projects-bot-panel"
            className="w-[min(92vw,22rem)] overflow-hidden rounded-[1.6rem] border border-black/10 bg-white/92 shadow-[0_26px_75px_rgba(15,23,42,0.22)] backdrop-blur-xl"
            aria-label="Projects assistant bot panel"
          >
            <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
              <div>
                <p className="text-xs sm:text-[10px] font-semibold uppercase tracking-[0.22em] text-black/38">Assistant</p>
                <p className="text-sm font-semibold text-black">Tanie bot</p>
              </div>
              <button
                type="button"
                onClick={closeBot}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-black/55 transition hover:bg-black/8 hover:text-black cursor-pointer"
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
              <label className="sr-only" htmlFor="projects-bot-input">Type a message</label>
              <div className="flex items-end gap-2 rounded-[1.2rem] border border-black/10 bg-[#f7fbff] px-3 py-2">
                <textarea
                  id="projects-bot-input"
                  value={botInput}
                  onChange={(event) => setBotInput(event.target.value)}
                  rows={1}
                  placeholder="Ask about these projects..."
                  className="min-h-10 max-h-28 flex-1 resize-none bg-transparent text-sm leading-6 text-black outline-none placeholder:text-black/34"
                />
                <button
                  type="submit"
                  disabled={isReplying}
                  className="rounded-full bg-[#0f172a] px-3.5 py-2 text-xs sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
