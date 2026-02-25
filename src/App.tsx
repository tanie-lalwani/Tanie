import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.title = "Tanie";

    // tab icon (favicon)
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "/pfp.png";
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 p-8">
      <h1 className="text-3xl font-bold">Tanie</h1>
    </main>
  );
}