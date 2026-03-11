import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero, { type Mode } from "./components/Hero";
import Navbar from "./components/Navbar";
import InterviewMe from "./pages/InterviewMe";
import Projects from "./pages/Projects.tsx";
import Contact from "./pages/Contact.tsx";

const SESSION_KEY = "portfolioMode"

function readStoredMode(): Mode | null {
  try {
    const v = sessionStorage.getItem(SESSION_KEY)
    return v === "practical" || v === "experience" ? v : null
  } catch { return null }
}

export default function App() {
  const location = useLocation();
  const [heroMode, setHeroMode] = useState<Mode | null>(readStoredMode)

  function handleModeChange(m: Mode | null) {
    try {
      if (m === null) sessionStorage.removeItem(SESSION_KEY)
      else sessionStorage.setItem(SESSION_KEY, m)
    } catch { /* blocked storage — degrade gracefully */ }
    setHeroMode(m)
  }

  // Show navbar on all pages except /interview-me,
  // and on / only when the user has chosen Practical mode.
  const showNavbar =
    location.pathname !== "/interview-me" &&
    !(location.pathname === "/" && heroMode !== "practical")

  useEffect(() => {
    document.title = "Tanie";

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/favicon.png";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {showNavbar ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Hero mode={heroMode} onModeChange={handleModeChange} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/interview-me" element={<InterviewMe />} />
      </Routes>
    </main>
  );
}