import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar.tsx";
import SiteFooter from "./components/SiteFooter";
import GlobalBeachBackdrop from "./experience/GlobalBeachBackdrop";

const InterviewMe = lazy(() => import("./pages/InterviewMe.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/interview-me"

  const showFooter = location.pathname !== "/interview-me"

  return (
    <main className="relative min-h-screen overflow-x-hidden text-slate-100">
      <GlobalBeachBackdrop />
      <div className="relative z-10">
        {showNavbar ? <Navbar /> : null}
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
    </main>
  );
}