"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Lenis, { type VirtualScrollData } from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "./Navbar";
import AppLoadingVeil from "./AppLoadingVeil";
import { type TimePhase } from "../experience/timePhase";
import { useCursorTrail } from "../hooks/useCursorTrail";
import { useClickRipple } from "../hooks/useClickRipple";
import { useInspectProtection } from "../hooks/useInspectProtection";
import { useLoading } from "../context/LoadingContext";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/contact";
  const { isOceanReady } = useLoading();
  const timePhase: TimePhase = "default";

  useEffect(() => {
    if (!isHome) return;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: isMobileViewport ? 0.08 : 0.1,
      syncTouch: isMobileViewport,
      syncTouchLerp: 0.06,
      touchMultiplier: isMobileViewport ? 0.55 : 0.85,
      wheelMultiplier: isMobileViewport ? 0.55 : 0.8,
      overscroll: false,
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      virtualScroll: (data: VirtualScrollData) => {
        if ((data.event.target as Element | null)?.closest("[data-lenis-prevent]")) return false;
        const aboutTop = document.getElementById("about")?.offsetTop ?? window.innerHeight;
        if (window.scrollY < aboutTop + window.innerHeight * 0.25) {
          const maxDelta = isMobileViewport ? 46 : 90;
          data.deltaY = Math.sign(data.deltaY) * Math.min(Math.abs(data.deltaY), maxDelta);
        }
        return true;
      },
    });

    return () => {
      lenis.destroy();
    };
  }, [isHome]);

  // Animation & security hooks
  useCursorTrail();
  useClickRipple();
  useInspectProtection();

  const showNavbar = isHome;
  const isWaitingForOceanScene = isHome && !isOceanReady;

  return (
    <div
      data-phase="default"
      className={`relative flex min-h-screen w-full flex-col overflow-x-hidden text-sky-950 ${
        showNavbar ? "pt-9" : ""
      }`}
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

        <motion.div
          key={pathname}
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>

      <AnimatePresence>
        {isWaitingForOceanScene ? <AppLoadingVeil key="app-loading-veil" /> : null}
      </AnimatePresence>
    </div>
  );
}
export default AppShell;
