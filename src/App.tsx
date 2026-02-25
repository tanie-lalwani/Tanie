import { useEffect } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

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
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
    </main>
  );
}