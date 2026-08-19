"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface LoadingContextType {
  isOceanReady: boolean;
  markOceanReady: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isOceanReady: false,
  markOceanReady: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/contact";
  const [isOceanReady, setIsOceanReady] = useState(!isHome);

  const markOceanReady = useCallback(() => {
    setIsOceanReady(true);
  }, []);

  // Reset when landing on home if not yet ready, and setup safety fallback timeout
  useEffect(() => {
    if (!isHome) {
      setIsOceanReady(true);
      return;
    }

    // Safety fallback timeout to prevent getting stuck if Three.js/WebGL fails or takes too long
    const timeout = setTimeout(() => {
      setIsOceanReady(true);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [isHome]);

  return (
    <LoadingContext.Provider value={{ isOceanReady, markOceanReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
