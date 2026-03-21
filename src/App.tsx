import { Suspense, lazy, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import { type TimePhase } from "./experience/timePhase";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useClickRipple } from "./hooks/useClickRipple";

const Home = lazy(() => import("./pages/Home"));
const QnA = lazy(() => import("./pages/InterviewMe.tsx"));

export default function App() {
  const location = useLocation();
  const timePhase: TimePhase = "noon"
  const lenisRef = useRef<Lenis | null>(null)

  // Animation hooks
  useCursorTrail()
  useClickRipple()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (location.pathname === "/qna") {
      lenisRef.current?.destroy()
      lenisRef.current = null
      return
    }

    lenisRef.current?.destroy()

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      if (lenisRef.current === lenis) {
        lenisRef.current.destroy()
        lenisRef.current = null
      } else {
        lenis.destroy()
      }
    }
  }, [location.pathname])

  const showNavbar = location.pathname !== "/qna"

  return (
    <main
      data-phase="noon"
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-sky-950"
    >
      <div className="relative z-10 flex-1 readability-text-shadow">
        {showNavbar ? <Navbar phase={timePhase} /> : null}
        <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-slate-400">Loading...</div>}>
          <Routes>
            <Route path="/" element={<><Home phase={timePhase} /><SiteFooter /></>} />
            <Route path="/qna" element={<QnA />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  );
}
