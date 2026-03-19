import { useEffect, useRef } from "react"

export function useClickRipple() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rippleIdRef = useRef(0)

  useEffect(() => {
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.top = "0"
    container.style.left = "0"
    container.style.pointerEvents = "none"
    container.style.zIndex = "5"
    document.body.appendChild(container)
    containerRef.current = container

    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement("div")
      const size = 40
      const x = e.clientX - size / 2
      const y = e.clientY - size / 2
      const id = rippleIdRef.current++

      ripple.id = `ripple-${id}`
      ripple.style.position = "fixed"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.style.width = size + "px"
      ripple.style.height = size + "px"
      ripple.style.borderRadius = "50%"
      ripple.style.border = "2px solid rgba(34, 211, 238, 0.5)"
      ripple.style.pointerEvents = "none"

      container.appendChild(ripple)

      // Animate ripple
      let scale = 1
      const maxScale = 6
      const animate = () => {
        scale += 0.15
        const opacity = Math.max(0, 1 - (scale - 1) / (maxScale - 1))

        ripple.style.transform = `scale(${scale})`
        ripple.style.opacity = String(opacity)

        if (scale < maxScale) {
          requestAnimationFrame(animate)
        } else {
          ripple.remove()
        }
      }

      animate()
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
      if (containerRef.current?.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current)
      }
    }
  }, [])
}
