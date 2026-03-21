import { useSyncExternalStore } from "react"

const MOBILE_QUERY = "(max-width: 640px)"

export function useIsMobile() {
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {}

    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    mediaQuery.addEventListener("change", callback)
    return () => mediaQuery.removeEventListener("change", callback)
  }

  const getSnapshot = () => {
    if (typeof window === "undefined") return false
    return window.matchMedia(MOBILE_QUERY).matches
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
