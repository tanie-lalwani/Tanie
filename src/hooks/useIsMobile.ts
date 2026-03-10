import { useEffect, useState } from "react"

const MOBILE_QUERY = "(max-width: 640px)"

export function useIsMobile() {
  const getMatches = () => {
    if (typeof window === "undefined") return false
    return window.matchMedia(MOBILE_QUERY).matches
  }

  const [isMobile, setIsMobile] = useState(getMatches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return isMobile
}
