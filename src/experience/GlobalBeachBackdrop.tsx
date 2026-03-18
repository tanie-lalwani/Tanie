import { useEffect, useMemo, useRef } from "react"
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

  // Blur the normal field slightly to soften hard seam-like bands.
  const blurred = new Uint8Array(data.length)
  const weights = [1, 2, 1, 2, 4, 2, 1, 2, 1]
  const offsets = [-1, -1, 0, -1, 1, -1, -1, 0, 0, 0, 1, 0, -1, 1, 0, 1, 1, 1]

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sx = 0
      let sy = 0
      let sz = 0
      let sw = 0

      for (let i = 0; i < 9; i++) {
        const ox = offsets[i * 2]
        const oy = offsets[i * 2 + 1]
        const xx = (x + ox + size) % size
        const yy = (y + oy + size) % size
        const sIdx = (yy * size + xx) * 4
        const w = weights[i]

        sx += (data[sIdx] / 127.5 - 1) * w
        sy += (data[sIdx + 1] / 127.5 - 1) * w
        sz += (data[sIdx + 2] / 255) * w
        sw += w
      }

      const nx = sx / sw
      const ny = sy / sw
      const nz = sz / sw
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1

      const idx = (y * size + x) * 4
      blurred[idx] = Math.round(((nx / len) + 1) * 127.5)
      blurred[idx + 1] = Math.round(((ny / len) + 1) * 127.5)
      blurred[idx + 2] = Math.round((nz / len) * 255)
      blurred[idx + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(blurred, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}

function buildSandTexture(size = 256, variant: "default" | "noon" = "default"): THREE.DataTexture {
  const data = new Uint8Array(size * size * 3)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3
      const grain = variant === "noon" ? 0.84 + Math.random() * 0.28 : 0.8 + Math.random() * 0.2
      const waveFrequency = variant === "noon" ? 14 : 10
      const secondaryFrequency = variant === "noon" ? 5 : 3
      const wave =
        0.5 +
        0.5 * Math.sin((x / size) * Math.PI * waveFrequency + (y / size) * Math.PI * secondaryFrequency)

      const rBase = variant === "noon" ? 224 : 212
      const gBase = variant === "noon" ? 199 : 188
      const bBase = variant === "noon" ? 149 : 142
      const r = Math.min(255, Math.round((rBase + wave * 16) * grain))
      const g = Math.min(255, Math.round((gBase + wave * 13) * grain))
      const b = Math.min(255, Math.round((bBase + wave * 8) * grain))

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

function addSand(scene: THREE.Scene, preset: BeachMoodPreset, phase: TimePhase) {
  const geometry = new THREE.PlaneGeometry(1200, 84, 48, 22)
  const pos = geometry.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.085)
  }

  geometry.computeVertexNormals()

  const sandTexture = buildSandTexture(256, phase === "noon" ? "noon" : "default")
  sandTexture.repeat.set(phase === "noon" ? 24 : 18, phase === "noon" ? 8 : 6)

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

function buildCloudTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  const gradient = ctx.createRadialGradient(size * 0.5, size * 0.52, size * 0.08, size * 0.5, size * 0.5, size * 0.5)
  gradient.addColorStop(0, "rgba(255,255,255,0.95)")
  gradient.addColorStop(0.45, "rgba(255,255,255,0.72)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function addNoonClouds(scene: THREE.Scene, isMobile: boolean) {
  const group = new THREE.Group()
  const texture = buildCloudTexture(128)
  const cloudCount = isMobile ? 10 : 20

  for (let i = 0; i < cloudCount; i++) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: 0.36 + Math.random() * 0.24,
        depthWrite: false,
      }),
    )

    sprite.position.set(
      -340 + Math.random() * 680,
      58 + Math.random() * 50,
      -420 - Math.random() * 360,
    )
    const size = 64 + Math.random() * 120
    sprite.scale.set(size, size * (0.35 + Math.random() * 0.25), 1)
    group.add(sprite)
  }

  scene.add(group)

  const update = (time: number) => {
    group.children.forEach((child, index) => {
      child.position.x += 0.02 + (index % 3) * 0.005
      if (child.position.x > 380) child.position.x = -380
      child.position.y += Math.sin(time * 0.16 + index * 0.7) * 0.004
    })
  }

  return { update }
}

function addNoonSun(scene: THREE.Scene) {
  // Overhead directional light creating sharp white-to-lavender illusion
  const noonOverheadLight = new THREE.DirectionalLight(0xf5f2ff, 0.8)
  noonOverheadLight.position.set(0, 300, 200)
  scene.add(noonOverheadLight)

  return {
    update: () => {
      // Static overhead light, no animation needed
    },
  }
}

function addNoonShipIllusion(scene: THREE.Scene, isMobile: boolean) {
  const ship = new THREE.Group()

  const hull = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1.3, 2.5),
    new THREE.MeshStandardMaterial({ color: 0x402f27, roughness: 0.86 }),
  )
  hull.position.y = 0.15
  ship.add(hull)

  const bow = new THREE.Mesh(
    new THREE.ConeGeometry(1.25, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x3a2b23, roughness: 0.86 }),
  )
  bow.rotation.z = -Math.PI / 2
  bow.position.set(5.1, 0.12, 0)
  ship.add(bow)

  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 3.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x5f4836, roughness: 0.8 }),
  )
  mast.position.set(-0.3, 2.1, 0)
  ship.add(mast)

  const sailShape = new THREE.Shape()
  sailShape.moveTo(0, 0)
  sailShape.lineTo(2.25, 1.05)
  sailShape.lineTo(0, 2.05)
  sailShape.closePath()

  const sail = new THREE.Mesh(
    new THREE.ShapeGeometry(sailShape),
    new THREE.MeshStandardMaterial({
      color: 0xf6f3e7,
      roughness: 0.92,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    }),
  )
  sail.position.set(-0.2, 1.1, 0)
  sail.rotation.y = -0.06
  ship.add(sail)

  const wakePieces: THREE.Mesh[] = []
  for (let i = 0; i < 4; i++) {
    const wake = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1 + i * 1.05, 0.42 + i * 0.14),
      new THREE.MeshBasicMaterial({
        color: 0xbdeeff,
        transparent: true,
        opacity: 0.18 - i * 0.03,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    wake.rotation.x = -Math.PI / 2
    wake.position.set(-5.8 - i * 1.8, 0.02, 0)
    ship.add(wake)
    wakePieces.push(wake)
  }

  ship.position.set(isMobile ? 120 : 150, 0.12, -320)
  ship.rotation.y = -0.25
  ship.scale.setScalar(isMobile ? 1.1 : 1.35)
  scene.add(ship)

  return {
    update: (time: number) => {
      ship.position.y = 0.1 + Math.sin(time * 0.95) * 0.12
      ship.rotation.z = Math.sin(time * 0.65) * 0.028

      wakePieces.forEach((wake, index) => {
        const pulse = 0.82 + Math.sin(time * 2.4 - index * 0.7) * 0.25
        wake.scale.x = pulse
        const material = wake.material as THREE.MeshBasicMaterial
        material.opacity = 0.11 + pulse * (0.08 - index * 0.012)
      })
    },
  }
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

function addNightBeachAccents(scene: THREE.Scene, isMobile: boolean) {
  // Create a group for stars on layer 1 (non-reflective layer)
  const starField = new THREE.Group()
  starField.layers.set(1)

  const starCount = isMobile ? 120 : 240
  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)
  const twinkleOffsets = new Float32Array(starCount)

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1000
    positions[i * 3 + 1] = 100 + Math.random() * 700
    positions[i * 3 + 2] = -400 - Math.random() * 600

    const brightness = 0.85 + Math.random() * 0.15
    colors[i * 3] = brightness
    colors[i * 3 + 1] = brightness
    colors[i * 3 + 2] = brightness
    twinkleOffsets[i] = Math.random() * Math.PI * 2
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    vertexColors: true,
  })

  const stars = new THREE.Points(geometry, material)
  stars.layers.set(1)
  starField.add(stars)
  scene.add(starField)

  return {
    update: (time: number) => {
      // Per-star twinkling effect
      const colorAttr = geometry.getAttribute("color") as THREE.BufferAttribute
      const colors = colorAttr.array as Float32Array
      
      for (let i = 0; i < starCount; i++) {
        const baseBrightness = 0.85 + ((i % 100) / 100) * 0.15
        const twinkle = 0.6 + Math.sin(time * 1.2 + twinkleOffsets[i]) * 0.4
        const finalBrightness = baseBrightness * twinkle
        
        colors[i * 3] = finalBrightness
        colors[i * 3 + 1] = finalBrightness
        colors[i * 3 + 2] = finalBrightness
      }
      colorAttr.needsUpdate = true
    },
  }
}

function addDawnBirds(scene: THREE.Scene, isMobile: boolean, preset: BeachMoodPreset) {
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
      color: preset.birdColor,
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

type GlobalBeachBackdropProps = {
  phase: TimePhase
  position?: "fixed" | "absolute"
}

export default function GlobalBeachBackdrop({ phase, position = "fixed" }: GlobalBeachBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isMobile = useIsMobile()
  const preset = useMemo(() => MOOD_PRESETS[phase], [phase])

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

    const waterGeometry = new THREE.PlaneGeometry(
      12000,
      12000,
      isMobile ? 96 : 192,
      isMobile ? 96 : 192,
    )

    const water = new Water(waterGeometry, {
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

    if (phase !== "night") {
      addSand(scene, preset, phase)
      scatterBeachDecor(scene, isMobile, preset)
    }
    const dawnBirdFlock = phase === "dawn" ? addDawnBirds(scene, isMobile, preset) : null
    const noonCloudLayer = phase === "noon" ? addNoonClouds(scene, isMobile) : null
    const noonSunLayer = phase === "noon" ? addNoonSun(scene) : null
    const noonShipLayer = phase === "noon" ? addNoonShipIllusion(scene, isMobile) : null
    const nightLayer = phase === "night" ? addNightBeachAccents(scene, isMobile) : null

    // Configure camera layers: layer 0 (default) + layer 1 (stars for night)
    camera.layers.enable(1)

    scene.add(new THREE.AmbientLight(preset.ambientColor, preset.ambientIntensity))
    scene.add(
      new THREE.HemisphereLight(
        preset.hemisphereSkyColor,
        preset.hemisphereGroundColor,
        preset.hemisphereIntensity,
      ),
    )

    const sunLight = new THREE.DirectionalLight(preset.sunlightColor, preset.sunlightIntensity)
    sunLight.position.copy(sun).multiplyScalar(preset.sunlightDistance)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(preset.fillColor, preset.fillIntensity)
    fillLight.position.set(...preset.fillPosition)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(preset.rimColor, preset.rimIntensity)
    rimLight.position.set(...preset.rimPosition)
    scene.add(rimLight)

    let raf = 0
    const clock = new THREE.Clock()

    const render = () => {
      raf = requestAnimationFrame(render)
      const elapsed = clock.getElapsedTime()
      water.material.uniforms["time"].value = elapsed * 0.45
      dawnBirdFlock?.update(elapsed)
      noonCloudLayer?.update(elapsed)
      noonSunLayer?.update()
      noonShipLayer?.update(elapsed)
      nightLayer?.update(elapsed)
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

  const positionClass = position === "absolute" ? "absolute" : "fixed"

  return (
    <div className={`pointer-events-none ${positionClass} inset-0 z-0`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />
    </div>
  )
}
