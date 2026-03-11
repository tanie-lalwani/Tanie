import { useEffect, type RefObject } from "react"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { createSky } from "./createSky"
import { createWater } from "./createWater"
import { createSand } from "./createSand"

/**
 * Initialises and drives the Three.js beach scene on the supplied canvas ref.
 * Runs once on mount; cleans up renderer + ResizeObserver on unmount.
 */
export function useThreeScene(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.5

    // ── Scene ────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xadd8f7, 0.0005)

    // ── Camera ───────────────────────────────────────────────────────────────
    // Eye-level perspective: standing on the beach looking toward the horizon
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      20000,
    )
    camera.position.set(0, 3, 58)
    camera.lookAt(0, 1.5, 0)

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
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(canvas.parentElement ?? canvas)

    // ── Animation loop ────────────────────────────────────────────────────────
    let raf: number
    const clock = new THREE.Clock()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      // Advance the water shader's internal time uniform
      water.material.uniforms["time"].value = clock.getElapsedTime() * 0.5
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
    }
  }, [canvasRef])
}
