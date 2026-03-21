import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  id: number
  life: number
}

export function useCursorTrail() {
  const particlesRef = useRef<Particle[]>([])
  const lastTimeRef = useRef(0)
  const particleIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    lastTimeRef.current = Date.now()
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

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const now = Date.now()
      
      // Throttle particle creation to every 40ms
      if (now - lastTimeRef.current < 40) return
      lastTimeRef.current = now

      const particle: Particle = {
        x: e.clientX,
        y: e.clientY,
        id: particleIdRef.current++,
        life: 1,
      }

      particlesRef.current.push(particle)

      // Create visual element
      const el = document.createElement("div")
      el.style.position = "fixed"
      el.style.left = particle.x + "px"
      el.style.top = particle.y + "px"
      el.style.width = "10px"
      el.style.height = "10px"
      el.style.borderRadius = "50%"
      el.style.pointerEvents = "none"
      el.style.background = "radial-gradient(circle, rgba(232,248,255,0.95) 0%, rgba(158,223,255,0.82) 42%, rgba(82,189,243,0.2) 100%)"
      el.style.boxShadow = "0 0 18px rgba(82,189,243,0.75)"
      el.style.transform = "translate(-50%, -50%)"
      el.id = `particle-${particle.id}`
      container.appendChild(el)

      // Animate particle
      let life = 1
      const animate = () => {
        life -= 0.08
        if (life <= 0) {
          el.remove()
          return
        }

        el.style.opacity = String(life * 0.7)
        el.style.transform = `translate(-50%, -50%) scale(${1 - life * 0.3})`

        requestAnimationFrame(animate)
      }

      animate()
    }

    window.addEventListener("pointermove", handlePointerMove)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      if (containerRef.current?.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current)
      }
    }
  }, [])
}
