import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import GlobalBeachBackdrop from "./experience/GlobalBeachBackdrop";
import BackdropSettingsBar from "./components/BackdropSettingsBar";
import { getLocalTimePhase, type TimePhase } from "./experience/timePhase";
import Home from "./pages/Home";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useClickRipple } from "./hooks/useClickRipple";

const InterviewMe = lazy(() => import("./pages/InterviewMe.tsx"));

const LOCAL_STORAGE_TIME_SYNC_KEY = "beach-time-sync-enabled"
const LOCAL_STORAGE_MANUAL_PHASE_KEY = "beach-manual-phase"

export default function App() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTimeSyncEnabled, setIsTimeSyncEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem(LOCAL_STORAGE_TIME_SYNC_KEY) === "true"
  })
  const [manualPhase, setManualPhase] = useState<TimePhase>(() => {
    if (typeof window === "undefined") return "dawn"
    const savedPhase = window.localStorage.getItem(LOCAL_STORAGE_MANUAL_PHASE_KEY)
    return savedPhase === "dawn" || savedPhase === "noon" || savedPhase === "sunset" || savedPhase === "night"
      ? savedPhase
      : "dawn"
  })
  const [autoTimePhase, setAutoTimePhase] = useState<TimePhase>(() => getLocalTimePhase())

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
    window.localStorage.setItem(LOCAL_STORAGE_TIME_SYNC_KEY, String(isTimeSyncEnabled))
  }, [isTimeSyncEnabled])

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_MANUAL_PHASE_KEY, manualPhase)
  }, [manualPhase])

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
    <main className="relative min-h-screen overflow-x-hidden text-slate-100">
      <GlobalBeachBackdrop phase={timePhase} />
      <div className="relative z-10 readability-text-shadow">
        {showNavbar ? <Navbar isSettingsOpen={isSettingsOpen} onSettingsToggle={setIsSettingsOpen} /> : null}
        <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-slate-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
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