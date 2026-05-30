import { Suspense, lazy, useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis, { type VirtualScrollData } from "lenis";
import "lenis/dist/lenis.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import { type TimePhase } from "./experience/timePhase";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useClickRipple } from "./hooks/useClickRipple";
import { useLanguage } from "./context/LanguageContext";

const loadHome = () => import("./pages/Home");
const loadQnA = () => import("./pages/InterviewMe.tsx");

const Home = lazy(loadHome);
const QnA = lazy(loadQnA);

function AppLoadingVeil() {
  const { copy } = useLanguage()

  return (
    <motion.div
      className="fixed inset-0 z-[10000] grid place-items-center overflow-hidden px-6 backdrop-blur-[12px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(13, 35, 52, 0.64) 0%, rgba(8, 31, 49, 0.72) 52%, rgba(2, 8, 23, 0.86) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 18%, rgba(125, 211, 252, 0.14), transparent 32%), linear-gradient(90deg, transparent, rgba(226, 242, 255, 0.06), transparent)",
        }}
        aria-hidden="true"
      />
      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mb-4 h-8 w-8 rounded-full border border-sky-50/16 border-t-sky-100/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
          aria-hidden="true"
        />
        <div
          className="flex text-base font-medium leading-none tracking-normal text-white/70 sm:text-lg"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {copy.loading.welcome}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NotFoundPage() {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute("content", "noindex");
  }, []);

  return (
    <iframe
      title="Page not found"
      src="/404.html"
      className="block h-screen w-full border-0"
    />
  );
}

export default function App() {
  const location = useLocation();
  const [readyOceanLocationKey, setReadyOceanLocationKey] = useState<string | null>(null);
  const timePhase: TimePhase = "default"

  useEffect(() => {
    void loadHome();
    void loadQnA();
  }, []);

  useEffect(() => {
    if (location.pathname !== "/" || !window.matchMedia("(max-width: 767px)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      syncTouch: true,
      syncTouchLerp: 0.06,
      touchMultiplier: 0.55,
      wheelMultiplier: 0.55,
      overscroll: false,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      virtualScroll: (data: VirtualScrollData) => {
        if ((data.event.target as Element | null)?.closest("[data-lenis-prevent]")) return false;
        const aboutTop = document.getElementById("about")?.offsetTop ?? window.innerHeight;
        if (window.scrollY < aboutTop + window.innerHeight * 0.25) {
          data.deltaY = Math.sign(data.deltaY) * Math.min(Math.abs(data.deltaY), 46);
        }
        return true;
      },
    });

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]);

  const handleOceanSceneReady = useCallback(() => {
    setReadyOceanLocationKey(location.key);
  }, [location.key]);

  // Animation hooks
  useCursorTrail()
  useClickRipple()


  const showNavbar = location.pathname === "/"
  const isWaitingForOceanScene = location.pathname === "/" && readyOceanLocationKey !== location.key;

  return (
  <div
    data-phase="default"
    className={`relative flex min-h-screen w-full flex-col overflow-x-hidden text-sky-950 ${showNavbar ? "pt-9" : ""}`}
    >
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {showNavbar ? (
            <motion.div
            key="navbar"
            className="fixed left-0 top-0 z-50 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Navbar phase={timePhase} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Suspense fallback={<AppLoadingVeil />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageShell>
                    <Home phase={timePhase} onSceneReady={handleOceanSceneReady} />
                    <SiteFooter />
                  </PageShell>
                }
              />
              <Route
                path="/qna"
                element={
                  <PageShell>
                    <QnA />
                  </PageShell>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
      <AnimatePresence>
        {isWaitingForOceanScene ? <AppLoadingVeil key="app-loading-veil" /> : null}
      </AnimatePresence>
    </div>
  );
}
