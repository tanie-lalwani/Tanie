import { Suspense, lazy, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero, { type Mode } from "./components/Hero";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";

const InterviewMe = lazy(() => import("./pages/InterviewMe.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));

export default function App() {
  const location = useLocation();
  // Plain React state — persists across in-app navigation (App never unmounts)
  // but resets to null on a fresh page load, showing the selection screen.
  const [heroMode, setHeroMode] = useState<Mode | null>(null)

  // Show navbar on all pages except /interview-me,
  // and on / only when the user has chosen Practical mode.
  const showNavbar =
    location.pathname !== "/interview-me" &&
    !(location.pathname === "/" && heroMode !== "practical")

  const showFooter =
    location.pathname !== "/interview-me" &&
    !(location.pathname === "/" && heroMode !== "practical")

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {showNavbar ? <Navbar /> : null}
      <Suspense fallback={<div className="px-4 py-10 text-center text-sm text-slate-400">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Hero mode={heroMode} onModeChange={setHeroMode} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/interview-me" element={<InterviewMe />} />
        </Routes>
      </Suspense>
      {showFooter ? <SiteFooter /> : null}
    </main>
  );
}