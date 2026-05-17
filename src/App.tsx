import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import WavySparkleRingLoader from "./components/WavySparkleRingLoader";
import { type TimePhase } from "./experience/timePhase";
import { useCursorTrail } from "./hooks/useCursorTrail";
import { useClickRipple } from "./hooks/useClickRipple";

const loadHome = () => import("./pages/Home");
const loadQnA = () => import("./pages/InterviewMe.tsx");

const Home = lazy(loadHome);
const QnA = lazy(loadQnA);

function RouteLoadingVeil() {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] grid place-items-center bg-[#143b61]/35 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <WavySparkleRingLoader size={64} />
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

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const timePhase: TimePhase = "default"
  // Handle GitHub Pages SPA redirect (?redirect=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && window.location.pathname === '/index.html') {
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    void loadHome();
    void loadQnA();
  }, []);

  // Animation hooks
  useCursorTrail()
  useClickRipple()


  const showNavbar = location.pathname !== "/qna"

  return (
    <main
      data-phase="default"
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-sky-950"
    >
      <div className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {showNavbar ? (
            <motion.div
              key="navbar"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Navbar phase={timePhase} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Suspense fallback={<RouteLoadingVeil />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageShell>
                    <Home phase={timePhase} />
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
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </main>
  );
}
