import { Suspense, lazy, useEffect, useRef } from "react";
import React from "react";
import WavySparkleRingLoader from "./components/WavySparkleRingLoader";

// DelayedLoader: shows the loader for at least minDelay ms
// This fallback always shows the loader for at least minDelay ms, even if Suspense resolves sooner
function DelayedLoader({ minDelay = 3500 }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), minDelay);
    return () => clearTimeout(t);
  }, [minDelay]);
  if (!ready) {
    return <div className="flex items-center justify-center py-16"><WavySparkleRingLoader size={64} /></div>;
  }
  // Once ready, render nothing so Suspense can show the loaded content
  return null;
}
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const timePhase: TimePhase = "noon"
  const lenisRef = useRef<Lenis | null>(null)
  // Handle GitHub Pages SPA redirect (?redirect=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && window.location.pathname === '/index.html') {
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

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
      <div className="relative z-10 flex-1">
        {showNavbar ? <Navbar phase={timePhase} /> : null}
        <Suspense fallback={<DelayedLoader minDelay={3500} />}> 
          <Routes>
            <Route path="/" element={<><Home phase={timePhase} /><SiteFooter /></>} />
            <Route path="/qna" element={<QnA />} />
          </Routes>
        </Suspense>
      </div>
    </main>
  );
}
