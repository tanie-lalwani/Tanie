import { useEffect, type RefObject } from "react"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { createSky } from "./createSky"
import { createWater } from "./createWater"
import { createSand } from "./createSand"
import { useIsMobile } from "../../hooks/useIsMobile"

/**
 * Initialises and drives the Three.js beach scene on the supplied canvas ref.
 * Runs once on mount; cleans up renderer + ResizeObserver on unmount.
 * Calls onReady() after the first frame finishes rendering.
 */
export function useThreeScene(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onReady?: () => void,
) {
  const isMobile = useIsMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let readyFired = false

    const getViewportSize = () => {
      const host = canvas.parentElement ?? canvas
      const { width, height } = host.getBoundingClientRect()
      return {
        width: Math.max(1, Math.floor(width)),
        height: Math.max(1, Math.floor(height)),
      }
    }

    const initialSize = getViewportSize()

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setSize(initialSize.width, initialSize.height, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5

    // ── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xadd8f7, 0.0005)

    // ── Camera ───────────────────────────────────────────────────────────────
    // Eye-level perspective: standing on the beach looking toward the horizon
    const camera = new THREE.PerspectiveCamera(
      55,
      initialSize.width / initialSize.height,
      0.1,
      20000,
    )

    const updateCameraForViewport = (aspect: number) => {
      const narrowViewport = aspect < 1

      if (isMobile || narrowViewport) {
        camera.fov = 66
        camera.position.set(0, 4.2, 72)
        camera.lookAt(0, 2.1, 6)
      } else {
        camera.fov = 55
        camera.position.set(0, 3, 58)
        camera.lookAt(0, 1.5, 0)
      }

      camera.updateProjectionMatrix()
    }

    updateCameraForViewport(camera.aspect)

    // ── Scene elements ────────────────────────────────────────────────────────
    const { sun } = createSky(scene)
    const water: Water = createWater(scene, sun)
    createSand(scene)

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffeedd, 0.55))
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 1.8)
    sunLight.position.copy(sun).multiplyScalar(500)
    scene.add(sunLight)

    // ── Responsive resize ─────────────────────────────────────────────────────
    const handleResize = () => {
      const { width: w, height: h } = getViewportSize()
      camera.aspect = w / h
      updateCameraForViewport(camera.aspect)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(canvas.parentElement ?? canvas)
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    // ── Animation loop ────────────────────────────────────────────────────────
    let raf: number
    const clock = new THREE.Clock()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      // Advance the water shader's internal time uniform
      water.material.uniforms["time"].value = clock.getElapsedTime() * 0.5
      renderer.render(scene, camera)

      // Fire the ready callback after first frame
      if (!readyFired) {
        readyFired = true
        onReady?.()
      }
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      renderer.dispose()
    }
  }, [canvasRef, isMobile, onReady])
}
