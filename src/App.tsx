import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import GlobalBeachBackdrop from "./experience/GlobalBeachBackdrop";
import BackdropSettingsBar from "./components/BackdropSettingsBar";
import { getLocalTimePhase, type TimePhase } from "./experience/timePhase";

const InterviewMe = lazy(() => import("./pages/InterviewMe.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
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
      <div className="relative z-10">
        {showNavbar ? <Navbar isSettingsOpen={isSettingsOpen} onSettingsToggle={setIsSettingsOpen} /> : null}
        <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-slate-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
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