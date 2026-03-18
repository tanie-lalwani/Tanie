import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import BackdropSettingsBar from "./components/BackdropSettingsBar";
import { getLocalTimePhase, type TimePhase } from "./experience/timePhase";
import Home from "./pages/Home";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useClickRipple } from "./hooks/useClickRipple";

const InterviewMe = lazy(() => import("./pages/InterviewMe.tsx"));

export default function App() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTimeSyncEnabled, setIsTimeSyncEnabled] = useState(false)
  const [manualPhase, setManualPhase] = useState<TimePhase>("dawn")
  const [autoTimePhase, setAutoTimePhase] = useState<TimePhase>("dawn")

  // Animation hooks
  useCursorTrail()
  useClickRipple()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (location.pathname === "/interview-me") return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [location.pathname])

  useEffect(() => {
    if (!isTimeSyncEnabled) return

    const syncPhase = () => {
      const nextPhase = getLocalTimePhase()
      setAutoTimePhase((prev) => (prev === nextPhase ? prev : nextPhase))
    }

    syncPhase()
    const timer = window.setInterval(syncPhase, 60000)
    return () => window.clearInterval(timer)
  }, [isTimeSyncEnabled])

  const timePhase: TimePhase = isTimeSyncEnabled ? autoTimePhase : manualPhase

  const showNavbar = location.pathname !== "/interview-me"
  const showFooter = location.pathname !== "/interview-me"

  return (
    <main
      data-phase={timePhase}
      className="relative min-h-screen overflow-x-hidden bg-slate-950/10 text-slate-100 transition-colors duration-500 data-[phase=dawn]:bg-sky-950/10 data-[phase=noon]:bg-sky-100/85 data-[phase=noon]:text-sky-950 data-[phase=night]:bg-slate-950/30"
    >
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(circle_at_50%_44%,rgba(2,6,23,0)_0%,rgba(2,6,23,0.08)_70%,rgba(2,6,23,0.22)_100%)] data-[phase=noon]:bg-[radial-gradient(circle_at_50%_44%,rgba(2,30,58,0)_0%,rgba(2,30,58,0.08)_72%,rgba(2,6,23,0.24)_100%)]" />
      <div className="relative z-10 readability-text-shadow">
        {showNavbar ? <Navbar isSettingsOpen={isSettingsOpen} onSettingsToggle={setIsSettingsOpen} /> : null}
        <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-slate-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home phase={timePhase} />} />
            <Route path="/interview-me" element={<InterviewMe />} />
          </Routes>
        </Suspense>
        {showFooter ? <SiteFooter /> : null}
      </div>
      <BackdropSettingsBar
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        isTimeSyncEnabled={isTimeSyncEnabled}
        phase={timePhase}
        onToggleTimeSync={setIsTimeSyncEnabled}
        onSelectPhase={setManualPhase}
      />
    </main>
  );
}

