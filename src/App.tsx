import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import InterviewMe from "./pages/InterviewMe";
import Projects from "./pages/Projects.tsx";

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/interview-me";

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
        <Route path="/" element={<Hero />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/interview-me" element={<InterviewMe />} />
      </Routes>
    </main>
  );
}