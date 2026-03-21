import { useEffect, useRef } from "react"

export function useClickRipple() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rippleIdRef = useRef(0)

  useEffect(() => {
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.inset = "0"
    container.style.width = "100vw"
    container.style.height = "100vh"
    container.style.overflow = "visible"
    container.style.pointerEvents = "none"
    container.style.zIndex = "9999"
    document.body.appendChild(container)
    containerRef.current = container

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const ripple = document.createElement("div")
      const size = 30
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
      ripple.style.border = "2px solid rgba(158, 223, 255, 0.9)"
      ripple.style.boxShadow = "0 0 20px rgba(82,189,243,0.45)"
      ripple.style.pointerEvents = "none"

      container.appendChild(ripple)

      // Animate ripple
      let scale = 1
      const maxScale = 4.6
      const animate = () => {
        scale += 0.14
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

    window.addEventListener("pointerdown", handlePointerDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      if (containerRef.current?.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current)
      }
    }
  }, [])
}
