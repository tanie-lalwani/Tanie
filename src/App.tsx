import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import InterviewMe from "./pages/InterviewMe";

export default function App() {
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/interview-me" element={<InterviewMe />} />
      </Routes>
    </main>
  );
}