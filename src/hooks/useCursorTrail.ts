import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  id: number
  life: number
}

export function useCursorTrail() {
  const particlesRef = useRef<Particle[]>([])
  const lastTimeRef = useRef(Date.now())
  const particleIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.top = "0"
    container.style.left = "0"
    container.style.pointerEvents = "none"
    container.style.zIndex = "5"
    document.body.appendChild(container)
    containerRef.current = container

    const handleMouseMove = (e: MouseEvent) => {
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
      el.style.width = "6px"
      el.style.height = "6px"
      el.style.borderRadius = "50%"
      el.style.pointerEvents = "none"
      el.style.background = `radial-gradient(circle, rgba(34,211,238,0.6), rgba(34,211,238,0.1))`
      el.style.boxShadow = "0 0 8px rgba(34,211,238,0.4)"
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

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (containerRef.current?.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current)
      }
    }
  }, [])
}
