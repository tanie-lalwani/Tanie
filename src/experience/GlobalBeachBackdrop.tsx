import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { useIsMobile } from "../hooks/useIsMobile"
import type { TimePhase } from "./timePhase"
import { MOOD_PRESETS, type BeachMoodPreset } from "./moods"

function buildNormalMap(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const u = (x / size) * Math.PI * 2
      const v = (y / size) * Math.PI * 2

      const nx =
        0.27 * Math.sin(u * 2) +
        0.12 * Math.sin(u * 6 + v * 3) +
        0.08 * Math.sin(u * 9 + v * 1.8)
      const ny =
        0.27 * Math.cos(v * 2) +
        0.12 * Math.cos(u * 3 + v * 5) +
        0.08 * Math.cos(v * 8 + u * 1.4)
      const nz = Math.sqrt(Math.max(1 - nx * nx - ny * ny, 0))

      data[idx] = Math.round((nx + 1) * 127.5)
      data[idx + 1] = Math.round((ny + 1) * 127.5)
      data[idx + 2] = Math.round(nz * 255)
      data[idx + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function buildSandTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 3)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3
      const grain = 0.8 + Math.random() * 0.2
      const wave =
        0.5 +
        0.5 * Math.sin((x / size) * Math.PI * 10 + (y / size) * Math.PI * 3)

      const r = Math.min(255, Math.round((212 + wave * 18) * grain))
      const g = Math.min(255, Math.round((188 + wave * 14) * grain))
      const b = Math.min(255, Math.round((142 + wave * 10) * grain))

      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function addSand(scene: THREE.Scene, preset: BeachMoodPreset) {
  const geometry = new THREE.PlaneGeometry(1200, 84, 48, 22)
  const pos = geometry.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.085)
  }

  geometry.computeVertexNormals()

  const sandTexture = buildSandTexture(256)
  sandTexture.repeat.set(18, 6)

  const material = new THREE.MeshStandardMaterial({
    color: preset.sandColor,
    map: sandTexture,
    roughness: preset.sandRoughness,
    metalness: 0,
    emissive: preset.sandEmissive,
    emissiveIntensity: preset.sandEmissiveIntensity,
  })

  const sand = new THREE.Mesh(geometry, material)
  sand.rotation.x = -Math.PI / 2
  sand.position.set(0, 0.1, 112)
  sand.receiveShadow = true
  scene.add(sand)
}

function createShell(preset: BeachMoodPreset): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(0.22, 0.55, 16, 1, true)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.08, 0.38, 0.75),
    roughness: 0.74,
    metalness: 0.02,
    emissive: 0x2b4257,
    emissiveIntensity: preset.shellEmissiveIntensity,
  })
  const shell = new THREE.Mesh(geometry, material)
  shell.scale.set(1, 0.48, 1)
  shell.rotation.x = Math.PI / 2
  return shell
}

function createStarfish(preset: BeachMoodPreset): THREE.Mesh {
  const shape = new THREE.Shape()
  const points = 5
  const outerRadius = 0.45
  const innerRadius = 0.18

  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 1,
  })

  geometry.center()

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.055, 0.66, 0.6),
    roughness: 0.8,
    metalness: 0.02,
    emissive: 0x21303f,
    emissiveIntensity: preset.starfishEmissiveIntensity,
  })

  const star = new THREE.Mesh(geometry, material)
  star.rotation.x = -Math.PI / 2
  return star
}

function scatterBeachDecor(scene: THREE.Scene, isMobile: boolean, preset: BeachMoodPreset) {
  const decorCount = isMobile ? 16 : 34

  for (let i = 0; i < decorCount; i++) {
    const isStar = i % 3 === 0
    const mesh = isStar ? createStarfish(preset) : createShell(preset)
    const lane = Math.random() > 0.5 ? 1 : -1

    mesh.position.set(
      lane * (7 + Math.random() * 24),
      0.18 + Math.random() * 0.04,
      72 + Math.random() * 72,
    )

    mesh.rotation.y = Math.random() * Math.PI * 2
    mesh.rotation.z += (Math.random() - 0.5) * 0.22

    const scale = isStar ? 0.66 + Math.random() * 0.6 : 0.5 + Math.random() * 0.42
    mesh.scale.multiplyScalar(scale)

    scene.add(mesh)
  }
}

function addDawnBirds(scene: THREE.Scene, isMobile: boolean) {
  const flock = new THREE.Group()
  const birds: Array<{ mesh: THREE.LineSegments; speed: number; flapOffset: number; baseY: number }> = []
  const birdCount = isMobile ? 7 : 13

  for (let i = 0; i < birdCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const points = new Float32Array([
      -0.62, 0.0, 0,
      0.0, 0.24, 0,
      0.0, 0.24, 0,
      0.62, 0.0, 0,
    ])
    geometry.setAttribute("position", new THREE.BufferAttribute(points, 3))

    const material = new THREE.LineBasicMaterial({
      color: 0x1f2d3a,
      transparent: true,
      opacity: 0.72,
    })

    const bird = new THREE.LineSegments(geometry, material)
    bird.scale.setScalar(1.6 + Math.random() * 1.8)
    bird.position.set(-220 - Math.random() * 480, 38 + Math.random() * 38, -300 - Math.random() * 320)
    bird.rotation.y = -0.26
    flock.add(bird)

    birds.push({
      mesh: bird,
      speed: 12 + Math.random() * 8,
      flapOffset: Math.random() * Math.PI * 2,
      baseY: bird.position.y,
    })
  }

  scene.add(flock)

  const update = (time: number) => {
    for (const bird of birds) {
      const travel = ((time * bird.speed + bird.flapOffset * 25) % 520) - 260
      bird.mesh.position.x = travel
      bird.mesh.position.y = bird.baseY + Math.sin(time * 0.55 + bird.flapOffset) * 1.8
      bird.mesh.scale.y = 0.7 + Math.abs(Math.sin(time * 5 + bird.flapOffset)) * 0.85
      bird.mesh.rotation.z = Math.sin(time * 2 + bird.flapOffset) * 0.08
    }
  }

  return { update }
}

function addNightBeachAccents(scene: THREE.Scene, isMobile: boolean) {
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(22, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xd7e9ff }),
  )
  moon.position.set(180, 140, -380)
  scene.add(moon)

  const shorelineGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(980, 18),
    new THREE.MeshBasicMaterial({
      color: 0x8be8ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  shorelineGlow.rotation.x = -Math.PI / 2
  shorelineGlow.position.set(0, 0.2, 9)
  scene.add(shorelineGlow)

  const starCount = isMobile ? 120 : 240
  const positions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1800
    positions[i * 3 + 1] = 120 + Math.random() * 520
    positions[i * 3 + 2] = -700 - Math.random() * 900
  }

  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xb8d7ff,
      size: isMobile ? 2.1 : 2.6,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    }),
  )
  scene.add(stars)
}

export default function GlobalBeachBackdrop({ phase }: { phase: TimePhase }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isMobile = useIsMobile()
  const preset = MOOD_PRESETS[phase]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.8))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = preset.exposure

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(preset.fogColor, preset.fogDensity)

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      20000,
    )
    camera.position.set(0, 11.5, 88)
    camera.lookAt(0, 1.8, -140)

    const sky = new Sky()
    sky.scale.setScalar(10000)
    scene.add(sky)

    const skyUniforms = sky.material.uniforms
    skyUniforms["turbidity"].value = preset.turbidity
    skyUniforms["rayleigh"].value = preset.rayleigh
    skyUniforms["mieCoefficient"].value = preset.mieCoefficient
    skyUniforms["mieDirectionalG"].value = preset.mieDirectionalG

    const sun = new THREE.Vector3()
    const phi = THREE.MathUtils.degToRad(90 - preset.sunElevation)
    const theta = THREE.MathUtils.degToRad(preset.sunAzimuth)
    sun.setFromSphericalCoords(1, phi, theta)
    skyUniforms["sunPosition"].value.copy(sun)

    const water = new Water(new THREE.PlaneGeometry(12000, 12000), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: buildNormalMap(),
      sunDirection: new THREE.Vector3().copy(sun).normalize(),
      sunColor: preset.sunColor,
      waterColor: preset.waterColor,
      distortionScale: isMobile ? Math.max(2.2, preset.waterDistortion - 0.9) : preset.waterDistortion,
      fog: false,
    })
    water.rotation.x = -Math.PI / 2
    water.position.y = -0.05
    scene.add(water)

    addSand(scene, preset)
    scatterBeachDecor(scene, isMobile, preset)
    const dawnBirdFlock = phase === "dawn" ? addDawnBirds(scene, isMobile) : null

    if (phase === "night") {
      addNightBeachAccents(scene, isMobile)
    }

    scene.add(new THREE.AmbientLight(preset.ambientColor, preset.ambientIntensity))
    const sunLight = new THREE.DirectionalLight(preset.sunlightColor, preset.sunlightIntensity)
    sunLight.position.copy(sun).multiplyScalar(460)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(preset.fillColor, preset.fillIntensity)
    fillLight.position.set(-180, 80, 120)
    scene.add(fillLight)

    let raf = 0
    const clock = new THREE.Clock()

    const render = () => {
      raf = requestAnimationFrame(render)
      const elapsed = clock.getElapsedTime()
      water.material.uniforms["time"].value = elapsed * 0.45
      dawnBirdFlock?.update(elapsed)
      renderer.render(scene, camera)
    }
    render()

    const onResize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas.parentElement ?? canvas)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      renderer.dispose()
    }
  }, [isMobile, preset, phase])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0" style={{ background: preset.overlayGradient }} />
    </div>
  )
}
