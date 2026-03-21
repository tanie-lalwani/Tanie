import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { MotionValue } from "framer-motion"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { useIsMobile } from "../hooks/useIsMobile"
import type { TimePhase } from "./timePhase"
import { MOOD_PRESETS, type BeachMoodPreset } from "./moods"

const GLOBAL_OCEAN_START = performance.now() * 0.001

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
    const baseOpacity = 0.36 + Math.random() * 0.24
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: baseOpacity,
        depthWrite: false,
      }),
    )
    sprite.userData.baseOpacity = baseOpacity

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

  const update = (time: number, fade = 1) => {
    group.children.forEach((child, index) => {
      child.position.x += 0.02 + (index % 3) * 0.005
      if (child.position.x > 380) child.position.x = -380
      child.position.y += Math.sin(time * 0.16 + index * 0.7) * 0.004

      const material = (child as THREE.Sprite).material as THREE.SpriteMaterial
      material.opacity = (child.userData.baseOpacity ?? 0.45) * fade
    })

    group.visible = fade > 0.01
  }

  return { group, update }
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

function addUnderwaterParticles(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  isMobile: boolean,
  bubbleTexture?: THREE.Texture,
) {
  const count = isMobile ? (depthStage === "deep" ? 280 : 220) : depthStage === "deep" ? 520 : 380
  const spread = depthStage === "deep" ? 520 : 460
  const depthSpan = depthStage === "deep" ? 520 : 420
  const floatSpeed = depthStage === "deep" ? 0.52 : 0.68

  const baseWaterColor = new THREE.Color(MOOD_PRESETS[phase].waterColor)
  const tint = baseWaterColor.clone()
  const deepTint = baseWaterColor.clone()

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const offsets = new Float32Array(count)
  const driftX = new Float32Array(count)
  const driftZ = new Float32Array(count)
  const wobble = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spread
    const y = -22 + (Math.random() - 0.5) * depthSpan
    const z = -120 - Math.random() * spread

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const blend = 0.32 + Math.random() * 0.44
    const c = tint.clone().lerp(deepTint, blend)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    sizes[i] = 0.5 + Math.random() * (depthStage === "deep" ? 1.25 : 1)
    offsets[i] = Math.random() * Math.PI * 2
    driftX[i] = (Math.random() - 0.5) * (depthStage === "deep" ? 0.35 : 0.42)
    driftZ[i] = (Math.random() - 0.5) * (depthStage === "deep" ? 0.22 : 0.28)
    wobble[i] = 0.5 + Math.random() * 0.8
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: depthStage === "deep" ? 1.05 : 0.9,
    sizeAttenuation: true,
    transparent: true,
    opacity: depthStage === "deep" ? 0.22 : 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
    map: bubbleTexture,
    alphaMap: bubbleTexture,
    alphaTest: bubbleTexture ? 0.08 : 0,
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  const update = (time: number, delta: number) => {
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const frameScale = delta * 60

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      arr[idx] += (driftX[i] + Math.sin(time * wobble[i] + offsets[i]) * 0.11) * 0.01 * frameScale
      arr[idx + 1] += floatSpeed * 0.014 * frameScale
      arr[idx + 2] += (driftZ[i] + Math.cos(time * wobble[i] * 0.7 + offsets[i]) * 0.08) * 0.01 * frameScale

      if (arr[idx + 1] > 28) {
        arr[idx + 1] = -26 - Math.random() * (depthSpan * 0.75)
      }
    }

    pos.needsUpdate = true
  }

  return { particles, update }
}

function addUnderwaterBed(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  isMobile: boolean,
) {
  const bedTexture = buildSandTexture(256, "default")
  bedTexture.repeat.set(depthStage === "deep" ? 18 : 16, depthStage === "deep" ? 16 : 13)
  bedTexture.colorSpace = THREE.SRGBColorSpace

  const bedGeometry = new THREE.PlaneGeometry(
    isMobile ? 340 : 520,
    depthStage === "deep" ? 540 : 460,
    isMobile ? 34 : 52,
    depthStage === "deep" ? 66 : 54,
  )
  const positions = bedGeometry.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const dune =
      Math.sin(x * 0.055) * 1.6 +
      Math.cos(y * 0.032) * 2.1 +
      Math.sin((x + y) * 0.02) * 1.1
    const ripple = Math.sin(x * 0.24 + y * 0.08) * 0.45
    positions.setZ(i, dune + ripple)
  }

  bedGeometry.computeVertexNormals()

  const bedMaterial = new THREE.MeshStandardMaterial({
    color: phase === "noon" ? 0x9b7a58 : 0x86654a,
    map: bedTexture,
    transparent: true,
    opacity: depthStage === "deep" ? 0.74 : 0.82,
    roughness: 1,
    metalness: 0.02,
    emissive: phase === "noon" ? 0x5c4632 : 0x493829,
    emissiveIntensity: depthStage === "deep" ? 0.05 : 0.08,
  })

  const bed = new THREE.Mesh(bedGeometry, bedMaterial)
  bed.rotation.x = -Math.PI / 2
  bed.position.set(0, depthStage === "deep" ? -24 : -18, depthStage === "deep" ? -210 : -178)
  bed.receiveShadow = true

  const ridgeMaterial = new THREE.MeshStandardMaterial({
    color: phase === "noon" ? 0x7e6144 : 0x694f39,
    roughness: 1,
    metalness: 0.01,
    transparent: true,
    opacity: depthStage === "deep" ? 0.22 : 0.3,
  })

  const group = new THREE.Group()
  group.add(bed)

  const ridgeCount = isMobile ? 4 : 7
  for (let i = 0; i < ridgeCount; i++) {
    const ridge = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 12),
      ridgeMaterial.clone(),
    )
    ridge.scale.set(
      10 + Math.random() * 12,
      1.2 + Math.random() * 1.2,
      4 + Math.random() * 6,
    )
    ridge.position.set(
      (Math.random() - 0.5) * (isMobile ? 130 : 210),
      bed.position.y + 0.8 + Math.random() * 1.4,
      bed.position.z - 40 - Math.random() * 180,
    )
    ridge.rotation.y = Math.random() * Math.PI
    group.add(ridge)
  }

  scene.add(group)

  return {
    group,
    update: (time: number, stageDepth: number) => {
      const reveal = smoothstep(0.22, 0.5, stageDepth)
      const deepen = THREE.MathUtils.lerp(1, depthStage === "deep" ? 0.82 : 0.9, smoothstep(0.55, 0.92, stageDepth))
      const visibility = reveal * deepen
      group.visible = visibility > 0.02
      bedMaterial.opacity = (depthStage === "deep" ? 0.74 : 0.82) * visibility
      bedMaterial.emissiveIntensity =
        (depthStage === "deep" ? 0.05 : 0.08) + Math.sin(time * 0.32) * 0.008
      bedTexture.offset.x = Math.sin(time * 0.018) * 0.02
      bedTexture.offset.y = -time * 0.006

      group.position.y = Math.sin(time * 0.14) * 0.35
      group.position.x = Math.sin(time * 0.1) * 1.6
    },
    dispose: () => {
      bedTexture.dispose()
    },
  }
}

function buildSunHazeTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  const gradient = ctx.createLinearGradient(0, 0, 0, size)
  gradient.addColorStop(0, "rgba(190,230,255,0.85)")
  gradient.addColorStop(0.35, "rgba(170,220,255,0.35)")
  gradient.addColorStop(1, "rgba(150,210,255,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function buildCausticTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 24; i++) {
    const y = (i / 24) * size + (Math.random() - 0.5) * 12
    const width = 1 + Math.random() * 2.8
    const alpha = 0.05 + Math.random() * 0.08

    const gradient = ctx.createLinearGradient(0, y, size, y + Math.random() * 16 - 8)
    gradient.addColorStop(0, `rgba(255,255,255,${alpha * 0.2})`)
    gradient.addColorStop(0.5, `rgba(255,255,255,${alpha})`)
    gradient.addColorStop(1, `rgba(255,255,255,${alpha * 0.2})`)

    ctx.strokeStyle = gradient
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.quadraticCurveTo(size * 0.38, y + (Math.random() - 0.5) * 20, size, y + (Math.random() - 0.5) * 14)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.8, 2.4)
  texture.needsUpdate = true
  return texture
}

function buildRippleRefractionTexture(
  size = 512,
  variant: "rings" | "shear" = "rings",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = "rgba(0,0,0,1)"
  ctx.fillRect(0, 0, size, size)

  if (variant === "rings") {
    const cx = size * 0.5
    const cy = size * 0.44
    for (let i = 0; i < 24; i++) {
      const radius = (i + 1) * (size * 0.025 + Math.random() * 1.8)
      const alpha = Math.max(0.035, 0.24 - i * 0.008)
      const width = 1.2 + Math.random() * 2.4

      ctx.strokeStyle = `rgba(210,245,255,${alpha})`
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.ellipse(
        cx + (Math.random() - 0.5) * 14,
        cy + (Math.random() - 0.5) * 10,
        radius,
        radius * (0.42 + Math.random() * 0.16),
        (Math.random() - 0.5) * 0.45,
        0,
        Math.PI * 2,
      )
      ctx.stroke()
    }
  } else {
    for (let i = 0; i < 42; i++) {
      const y = (i / 34) * size + (Math.random() - 0.5) * 10
      const alpha = 0.06 + Math.random() * 0.13
      const lineWidth = 1 + Math.random() * 2.9

      const gradient = ctx.createLinearGradient(0, y, size, y + (Math.random() - 0.5) * 24)
      gradient.addColorStop(0, `rgba(205,245,255,${alpha * 0.4})`)
      gradient.addColorStop(0.5, `rgba(230,250,255,${alpha})`)
      gradient.addColorStop(1, `rgba(205,245,255,${alpha * 0.4})`)

      ctx.strokeStyle = gradient
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(
        size * 0.2,
        y + (Math.random() - 0.5) * 30,
        size * 0.75,
        y + (Math.random() - 0.5) * 22,
        size,
        y + (Math.random() - 0.5) * 18,
      )
      ctx.stroke()
    }
  }

  const vignette = ctx.createRadialGradient(size * 0.5, size * 0.45, size * 0.08, size * 0.5, size * 0.45, size * 0.72)
  vignette.addColorStop(0, "rgba(255,255,255,0.12)")
  vignette.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function buildWaterVeilTexture(size = 512, variant: "soft" | "streaks" = "soft"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)

  for (let i = 0; i < (variant === "soft" ? 16 : 26); i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = variant === "soft" ? 60 + Math.random() * 120 : 32 + Math.random() * 74
    const gradient = ctx.createRadialGradient(x, y, radius * 0.05, x, y, radius)
    const alpha = variant === "soft" ? 0.08 + Math.random() * 0.08 : 0.04 + Math.random() * 0.06
    gradient.addColorStop(0, `rgba(220,245,255,${alpha})`)
    gradient.addColorStop(0.55, `rgba(140,210,240,${alpha * 0.45})`)
    gradient.addColorStop(1, "rgba(20,45,60,0)")
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < (variant === "soft" ? 18 : 34); i++) {
    const y = (i / 20) * size + (Math.random() - 0.5) * 30
    const alpha = variant === "soft" ? 0.035 + Math.random() * 0.04 : 0.04 + Math.random() * 0.07
    const lineWidth = variant === "soft" ? 12 + Math.random() * 18 : 6 + Math.random() * 12
    const gradient = ctx.createLinearGradient(0, y, size, y + (Math.random() - 0.5) * 45)
    gradient.addColorStop(0, `rgba(170,220,245,${alpha * 0.25})`)
    gradient.addColorStop(0.5, `rgba(215,245,255,${alpha})`)
    gradient.addColorStop(1, `rgba(120,190,220,${alpha * 0.2})`)
    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(
      size * 0.22,
      y + (Math.random() - 0.5) * 40,
      size * 0.72,
      y + (Math.random() - 0.5) * 36,
      size,
      y + (Math.random() - 0.5) * 28,
    )
    ctx.stroke()
  }

  for (let i = 0; i < (variant === "soft" ? 140 : 220); i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = variant === "soft" ? 0.8 + Math.random() * 2.2 : 0.6 + Math.random() * 1.8
    const alpha = variant === "soft" ? 0.12 + Math.random() * 0.18 : 0.08 + Math.random() * 0.14

    ctx.fillStyle = `rgba(232,248,255,${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.4, 2.1)
  texture.needsUpdate = true
  return texture
}

function addMutedTopSunlight(scene: THREE.Scene, phase: TimePhase, depthStage: "mid" | "deep") {
  const isMid = depthStage === "mid"
  const lightColor = phase === "noon" ? 0xb8dcff : 0xa8c9ea
  const topLight = new THREE.DirectionalLight(lightColor, phase === "noon" ? (isMid ? 0.19 : 0.13) : isMid ? 0.15 : 0.1)
  topLight.position.set(0, 112, 38)
  topLight.target.position.set(0, 6, -138)
  scene.add(topLight)
  scene.add(topLight.target)

  const hazeTexture = buildSunHazeTexture(256)
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 340),
    new THREE.MeshBasicMaterial({
      map: hazeTexture,
      transparent: true,
      opacity: phase === "noon" ? (isMid ? 0.1 : 0.07) : isMid ? 0.08 : 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  haze.position.set(0, 28, -158)
  haze.rotation.x = -0.14
  scene.add(haze)

  return {
    update: (time: number) => {
      haze.position.x = Math.sin(time * 0.12) * 16
      haze.position.y = 28 + Math.sin(time * 0.2) * 1.8
      const material = haze.material as THREE.MeshBasicMaterial
      material.opacity = (phase === "noon" ? (isMid ? 0.1 : 0.07) : isMid ? 0.082 : 0.055) + Math.sin(time * 0.55) * 0.009
    },
  }
}

function addUnderwaterReflections(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  causticTextureA?: THREE.Texture,
  causticTextureB?: THREE.Texture,
) {
  const textureA = causticTextureA ?? buildCausticTexture(256)
  const textureB = causticTextureB ?? buildCausticTexture(256)
  textureB.repeat.set(3.6, 2.8)

  const baseWaterColor = new THREE.Color(MOOD_PRESETS[phase].waterColor)
  const color = baseWaterColor.clone()
  const strength = depthStage === "mid" ? 0.11 : 0.075

  const planeA = new THREE.Mesh(
    new THREE.PlaneGeometry(1500, 980),
    new THREE.MeshBasicMaterial({
      map: textureA,
      color,
      transparent: true,
      opacity: strength,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const planeB = new THREE.Mesh(
    new THREE.PlaneGeometry(1450, 940),
    new THREE.MeshBasicMaterial({
      map: textureB,
      color,
      transparent: true,
      opacity: strength * 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  planeA.position.set(0, -3, -168)
  planeB.position.set(0, -8, -186)
  
  const group = new THREE.Group()
  group.add(planeA)
  group.add(planeB)
  scene.add(group)

  return {
    group,
    update: (time: number) => {
      textureA.offset.x = time * 0.033
      textureA.offset.y = -time * 0.018
      textureB.offset.x = -time * 0.027
      textureB.offset.y = time * 0.015

      planeA.position.x = Math.sin(time * 0.22) * 10
      planeB.position.x = Math.cos(time * 0.18) * 8
      ;(planeA.material as THREE.MeshBasicMaterial).opacity = strength + Math.sin(time * 0.7) * 0.02
      ;(planeB.material as THREE.MeshBasicMaterial).opacity = strength * 0.6 + Math.cos(time * 0.56) * 0.015
    },
  }
}

function addUnderwaterVolumeTexture(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  isMobile: boolean,
  sedimentTexture?: THREE.Texture,
) {
  const veilTextureA = buildWaterVeilTexture(512, "soft")
  const veilTextureB = buildWaterVeilTexture(512, "streaks")
  veilTextureA.repeat.set(2.6, 2.2)
  veilTextureB.repeat.set(3.3, 2.8)
  if (sedimentTexture) {
    sedimentTexture.wrapS = THREE.RepeatWrapping
    sedimentTexture.wrapT = THREE.RepeatWrapping
    sedimentTexture.repeat.set(1.6, 1.25)
    sedimentTexture.colorSpace = THREE.SRGBColorSpace
    sedimentTexture.needsUpdate = true
  }

  const baseWaterColor = new THREE.Color(MOOD_PRESETS[phase].waterColor)
  const shadowColor = baseWaterColor.clone().lerp(new THREE.Color(0x0e2438), 0.38)

  const frontVeil = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 720 : 980, isMobile ? 520 : 700),
    new THREE.MeshBasicMaterial({
      map: veilTextureA,
      alphaMap: veilTextureA,
      color: 0xb8e8ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.02,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const midVeil = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 760 : 1060, isMobile ? 580 : 760),
    new THREE.MeshBasicMaterial({
      map: veilTextureB,
      alphaMap: veilTextureB,
      color: shadowColor,
      transparent: true,
      opacity: 0,
      blending: THREE.MultiplyBlending,
      premultipliedAlpha: true,
      alphaTest: 0.02,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const sedimentVeil = sedimentTexture
    ? new THREE.Mesh(
      new THREE.PlaneGeometry(isMobile ? 700 : 940, isMobile ? 500 : 660),
      new THREE.MeshBasicMaterial({
        map: sedimentTexture,
        color: 0x8f7558,
        transparent: true,
        opacity: 0,
        blending: THREE.MultiplyBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    )
    : null

  frontVeil.position.set(0, isMobile ? 2.5 : 3.5, -78)
  midVeil.position.set(0, isMobile ? 0.5 : 1.2, -112)
  sedimentVeil?.position.set(0, isMobile ? 1.5 : 2.1, -92)
  frontVeil.rotation.x = -0.04
  midVeil.rotation.x = 0.03
  if (sedimentVeil) sedimentVeil.rotation.x = -0.02

  const group = new THREE.Group()
  group.add(frontVeil)
  group.add(midVeil)
  if (sedimentVeil) group.add(sedimentVeil)
  scene.add(group)

  return {
    group,
    update: (time: number, stageDepth: number) => {
      // The veil textures should start appearing around 28% depth, be fully visible by 47%, and then start settling down after 88%, becoming mostly settled by 100%.
      
      const enterBlend = smoothstep(0.28, 0.47, stageDepth)
      const settleBlend = 1 - smoothstep(0.88, 1, stageDepth)
      const visibility = enterBlend * settleBlend

      veilTextureA.offset.x = time * 0.012
      veilTextureA.offset.y = -time * 0.008
      veilTextureB.offset.x = -time * 0.018
      veilTextureB.offset.y = time * 0.011
      if (sedimentTexture) {
        sedimentTexture.offset.x = Math.sin(time * 0.028) * 0.03
        sedimentTexture.offset.y = -time * 0.01
      }

      frontVeil.position.x = Math.sin(time * 0.16) * 3.4
      frontVeil.position.y = (isMobile ? 2.5 : 3.5) + Math.sin(time * 0.22) * 0.8
      midVeil.position.x = Math.cos(time * 0.11) * 4.2
      midVeil.position.y = (isMobile ? 0.5 : 1.2) + Math.cos(time * 0.19) * 0.9
      if (sedimentVeil) {
        sedimentVeil.position.x = Math.sin(time * 0.13) * 2.8
        sedimentVeil.position.y = (isMobile ? 1.5 : 2.1) + Math.cos(time * 0.17) * 0.55
        sedimentVeil.rotation.z = Math.sin(time * 0.05) * 0.016
      }
      frontVeil.rotation.z = Math.sin(time * 0.08) * 0.02
      midVeil.rotation.z = Math.cos(time * 0.07) * 0.018

      ;(frontVeil.material as THREE.MeshBasicMaterial).opacity =
        (depthStage === "deep" ? 0.18 : 0.26) * visibility
      ;(midVeil.material as THREE.MeshBasicMaterial).opacity =
        (depthStage === "deep" ? 0.12 : 0.18) * visibility
      if (sedimentVeil) {
        ;(sedimentVeil.material as THREE.MeshBasicMaterial).opacity =
          (depthStage === "deep" ? 0.1 : 0.16) * visibility
      }
      group.visible = visibility > 0.02
    },
    dispose: () => {
      veilTextureA.dispose()
      veilTextureB.dispose()
    },
  }
}

function addUnderwaterSilt(
  scene: THREE.Scene,
  depthStage: "mid" | "deep",
  isMobile: boolean,
  particleTexture?: THREE.Texture,
) {
  const count = isMobile ? (depthStage === "deep" ? 120 : 150) : depthStage === "deep" ? 220 : 280
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const offsets = new Float32Array(count)
  const driftX = new Float32Array(count)
  const driftY = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const idx = i * 3
    positions[idx] = (Math.random() - 0.5) * (isMobile ? 120 : 170)
    positions[idx + 1] = -18 + Math.random() * 42
    positions[idx + 2] = -36 - Math.random() * 95
    sizes[i] = 0.25 + Math.random() * (depthStage === "deep" ? 0.55 : 0.8)
    offsets[i] = Math.random() * Math.PI * 2
    driftX[i] = (Math.random() - 0.5) * 0.18
    driftY[i] = 0.025 + Math.random() * 0.04
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    color: 0xd9c6a7,
    size: depthStage === "deep" ? 0.8 : 1.05,
    sizeAttenuation: true,
    transparent: true,
    opacity: depthStage === "deep" ? 0.16 : 0.24,
    depthWrite: false,
    map: particleTexture,
    alphaMap: particleTexture,
    alphaTest: particleTexture ? 0.03 : 0,
    blending: THREE.NormalBlending,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  return {
    points,
    update: (time: number, delta: number, stageDepth: number) => {
      const visibleStrength = smoothstep(0.15, 0.46, stageDepth)
      points.visible = visibleStrength > 0.02
      material.opacity = (depthStage === "deep" ? 0.16 : 0.24) * visibleStrength

      const pos = geometry.getAttribute("position") as THREE.BufferAttribute
      const arr = pos.array as Float32Array
      const frameScale = delta * 60

      for (let i = 0; i < count; i++) {
        const idx = i * 3
        arr[idx] += (driftX[i] + Math.sin(time * 0.45 + offsets[i]) * 0.03) * frameScale
        arr[idx + 1] += (driftY[i] + Math.cos(time * 0.35 + offsets[i]) * 0.015) * frameScale
        arr[idx + 2] += Math.sin(time * 0.25 + offsets[i]) * 0.01 * frameScale

        if (arr[idx] > (isMobile ? 70 : 95)) arr[idx] = -(isMobile ? 70 : 95)
        if (arr[idx] < -(isMobile ? 70 : 95)) arr[idx] = isMobile ? 70 : 95
        if (arr[idx + 1] > 26) {
          arr[idx + 1] = -18 - Math.random() * 8
          arr[idx + 2] = -36 - Math.random() * 95
        }
      }

      pos.needsUpdate = true
    },
  }
}

function addUnderwaterSurfaceWindow(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  isMobile: boolean,
  textureA?: THREE.Texture,
  textureB?: THREE.Texture,
) {
  const rippleA = textureA ?? buildRippleRefractionTexture(512, "rings")
  const rippleB = textureB ?? buildRippleRefractionTexture(512, "shear")
  // Higher repeat = smaller ripples in view.
  rippleA.repeat.set(4.8, 3.2)
  rippleB.repeat.set(5.2, 3.6)

  const baseWaterColor = new THREE.Color(MOOD_PRESETS[phase].waterColor)
  const tint = baseWaterColor.clone()
  const shadowTint = baseWaterColor.clone()
  const baseOpacity = depthStage === "mid" ? 0.24 : 0.2
  const baseSurfaceY = isMobile ? 6.8 : 8.3
  const baseShimmerY = isMobile ? 7.15 : 8.65
  const baseShadowY = isMobile ? 6.55 : 8
  const baseReflectionY = isMobile ? 7.35 : 8.95

  const surfaceSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 760 : 1100, isMobile ? 620 : 820),
    new THREE.MeshBasicMaterial({
      map: rippleA,
      color: tint,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      alphaMap: rippleA,
      alphaTest: 0.04,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const shimmerSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 740 : 1080, isMobile ? 580 : 760),
    new THREE.MeshBasicMaterial({
      map: rippleB,
      color: 0xe7fbff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      alphaMap: rippleB,
      alphaTest: 0.04,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const shadowSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 760 : 1120, isMobile ? 620 : 820),
    new THREE.MeshBasicMaterial({
      map: rippleB,
      color: shadowTint,
      transparent: true,
      opacity: 0,
      blending: THREE.MultiplyBlending,
      premultipliedAlpha: true,
      alphaMap: rippleB,
      alphaTest: 0.04,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  const reflectionSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 710 : 1040, isMobile ? 560 : 730),
    new THREE.MeshBasicMaterial({
      map: rippleA,
      color: 0xf0fdff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      alphaMap: rippleA,
      alphaTest: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )

  surfaceSheet.position.set(0, baseSurfaceY, -124)
  shimmerSheet.position.set(0, baseShimmerY, -126)
  shadowSheet.position.set(0, baseShadowY, -123)
  reflectionSheet.position.set(0, baseReflectionY, -127)
  surfaceSheet.rotation.x = -Math.PI / 2 - 0.1
  shimmerSheet.rotation.x = -Math.PI / 2 - 0.14
  shadowSheet.rotation.x = -Math.PI / 2 - 0.06
  reflectionSheet.rotation.x = -Math.PI / 2 - 0.18
  
  const group = new THREE.Group()
  group.add(surfaceSheet)
  group.add(shimmerSheet)
  group.add(shadowSheet)
  group.add(reflectionSheet)
  scene.add(group)

  return {
    group,
    update: (_time: number, stageDepth: number, surfaceWaveTime: number) => {
      // The surface window should start appearing around 20% depth, be fully visible by 46%, and then start losing intensity after 50%, becoming mostly faded by 93%. This is to allow the surface ripples to sync up with the underwater volume textures and silt, which are more effective at conveying depth and movement in the mid and deep stages.
      const enterBlend = smoothstep(0.2, 0.46, stageDepth)
      const lingerBlend = 1 - smoothstep(0.5, 0.93, stageDepth)
      const visibility = enterBlend * lingerBlend

      // Sync below-surface refraction flow with the same wave clock as the top water surface.
      const primaryWave = surfaceWaveTime
      const secondaryWave = surfaceWaveTime * 0.72
      rippleA.offset.x = primaryWave * 0.035
      rippleA.offset.y = -primaryWave * 0.019
      rippleB.offset.x = -secondaryWave * 0.041
      rippleB.offset.y = secondaryWave * 0.024

      const shimmerDrift = Math.sin(primaryWave * 1.35) * 3.2
      const secondaryDrift = Math.sin(primaryWave * 2.55) * 1.4
      surfaceSheet.position.x = shimmerDrift + secondaryDrift
      shimmerSheet.position.x = -shimmerDrift * 0.7 + secondaryDrift * 0.8
      shadowSheet.position.x = shimmerDrift * 0.5 - secondaryDrift * 0.45
      reflectionSheet.position.x = -shimmerDrift * 0.85 + secondaryDrift
      surfaceSheet.position.y = baseSurfaceY + Math.sin(primaryWave * 1.1) * 0.28
      shimmerSheet.position.y = baseShimmerY + Math.cos(primaryWave * 1.22) * 0.24
      shadowSheet.position.y = baseShadowY + Math.sin(primaryWave * 0.96) * 0.2
      reflectionSheet.position.y = baseReflectionY + Math.cos(primaryWave * 1.48) * 0.2
      surfaceSheet.rotation.z = Math.sin(secondaryWave * 0.6) * 0.01
      shimmerSheet.rotation.z = Math.cos(secondaryWave * 0.75) * 0.012
      shadowSheet.rotation.z = Math.sin(secondaryWave * 0.5) * 0.008
      reflectionSheet.rotation.z = Math.cos(secondaryWave * 0.84) * 0.015

      const pulse = 0.9 + Math.sin(primaryWave * 2.1) * 0.1
      const visibilityStrength = Math.pow(visibility, 0.86) * pulse

      ;(surfaceSheet.material as THREE.MeshBasicMaterial).opacity = baseOpacity * visibilityStrength
      ;(shimmerSheet.material as THREE.MeshBasicMaterial).opacity = (baseOpacity * 0.82) * visibilityStrength
      ;(shadowSheet.material as THREE.MeshBasicMaterial).opacity = (baseOpacity * 0.42) * visibilityStrength
      ;(reflectionSheet.material as THREE.MeshBasicMaterial).opacity = (baseOpacity * 0.55) * visibilityStrength
    },
  }
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

function getSectionScrollProgress(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const vh = window.innerHeight || 1
  const total = rect.height + vh
  const travelled = vh - rect.top
  return clamp01(travelled / Math.max(total, 1))
}

function getDepthBlend(depthStage: "surface" | "mid" | "deep", sectionProgress: number) {
  if (depthStage === "surface") {
    return smoothstep(0.08, 0.95, sectionProgress)
  }

  if (depthStage === "mid") {
    return 0.34 + smoothstep(0.06, 0.96, sectionProgress) * 0.36
  }

  return 0.7 + smoothstep(0.04, 0.94, sectionProgress) * 0.3
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }

    const material = (mesh as { material?: THREE.Material | THREE.Material[] }).material
    if (Array.isArray(material)) {
      for (const entry of material) {
        entry.dispose()
      }
    } else if (material) {
      material.dispose()
    }
  })
}

type GlobalBeachBackdropProps = {
  phase: TimePhase
  position?: "fixed" | "absolute"
  depthStage?: "surface" | "mid" | "deep"
  enableContinuousDive?: boolean
  diveProgressValue?: MotionValue<number>
}

export default function GlobalBeachBackdrop({
  phase,
  position = "fixed",
  depthStage = "surface",
  enableContinuousDive = false,
  diveProgressValue,
}: GlobalBeachBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const externalDiveProgressRef = useRef<number | null>(null)
  const isMobile = useIsMobile()
  const preset = useMemo(() => MOOD_PRESETS[phase], [phase])
  const isSurfaceStage = depthStage === "surface"
  const usesContinuousDive = enableContinuousDive
  const supportsUnderwaterSystems = !isSurfaceStage || usesContinuousDive

  useEffect(() => {
    if (!diveProgressValue) {
      externalDiveProgressRef.current = null
      return
    }

    externalDiveProgressRef.current = clamp01(diveProgressValue.get())
    const unsubscribe = diveProgressValue.on("change", (value) => {
      externalDiveProgressRef.current = clamp01(value)
    })

    return () => {
      unsubscribe()
    }
  }, [diveProgressValue])

  const depthProfile = useMemo(() => {
    if (usesContinuousDive) {
      return {
        exposureMultiplier: 0.26,
        fogDensityMultiplier: 6,
        waterLightnessDrop: 0.5,
        waterSaturationBoost: 0.16,
        fogLightnessDrop: 0.6,
        cameraY: -5.4,
        cameraZ: 54,
        lookAtY: -7.4,
        lookAtZ: -138,
        lightMultiplier: 0.12,
        distortionMultiplier: 0.92,
      }
    }

    if (depthStage === "mid") {
      return {
        exposureMultiplier: 0.46,
        fogDensityMultiplier: 3.7,
        waterLightnessDrop: 0.31,
        waterSaturationBoost: 0.1,
        fogLightnessDrop: 0.4,
        cameraY: 2.8,
        cameraZ: 84,
        lookAtY: 1.2,
        lookAtZ: -152,
        lightMultiplier: 0.29,
        distortionMultiplier: 0.9,
      }
    }

    if (depthStage === "deep") {
      return {
        exposureMultiplier: 0.34,
        fogDensityMultiplier: 5.2,
        waterLightnessDrop: 0.42,
        waterSaturationBoost: 0.12,
        fogLightnessDrop: 0.56,
        cameraY: 0.6,
        cameraZ: 80,
        lookAtY: -0.5,
        lookAtZ: -168,
        lightMultiplier: 0.16,
        distortionMultiplier: 0.82,
      }
    }

    return {
      exposureMultiplier: 0.78,
      fogDensityMultiplier: 1,
      waterLightnessDrop: 0,
      waterSaturationBoost: 0,
      fogLightnessDrop: 0,
      cameraY: 2,
      cameraZ: 70,
      lookAtY: -1.2,
      lookAtZ: -162,
      lightMultiplier: 0.72,
      distortionMultiplier: 1,
    }
  }, [depthStage, usesContinuousDive])

  const waterColor = useMemo(() => {
    const color = new THREE.Color(preset.waterColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    const phaseShift =
      phase === "noon"
        ? { h: 0.012, s: 0.05, l: 0.01 }
        : phase === "noon"
          ? { h: -0.008, s: 0.12, l: 0.015 }
          : { h: 0.02, s: -0.04, l: -0.02 }
    const phaseExtraDrop = phase === "noon" ? 0.04 : 0.03
    const shiftedHue = (hsl.h + phaseShift.h + 1) % 1
    color.setHSL(
      shiftedHue,
      Math.min(1, hsl.s + depthProfile.waterSaturationBoost + phaseShift.s),
      Math.max(0.02, hsl.l + phaseShift.l - depthProfile.waterLightnessDrop - phaseExtraDrop),
    )
    return color
  }, [preset.waterColor, depthProfile, phase])

  const fogColor = useMemo(() => {
    const color = new THREE.Color(preset.fogColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    color.setHSL(hsl.h, Math.min(1, hsl.s + 0.03), Math.max(0.02, hsl.l - depthProfile.fogLightnessDrop))
    return color
  }, [preset.fogColor, depthProfile])

  const sunColor = useMemo(() => {
    const color = new THREE.Color(preset.sunColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    color.setHSL(hsl.h, Math.max(0, hsl.s - 0.06), Math.max(0.04, hsl.l * depthProfile.lightMultiplier))
    return color
  }, [preset.sunColor, depthProfile.lightMultiplier])

  const submergedClearColor = useMemo(() => {
    // Use adjusted water color for underwater background - matches water surface shader for continuity
    return waterColor.clone()
  }, [waterColor])

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
    renderer.toneMappingExposure = Math.max(0.28, preset.exposure * depthProfile.exposureMultiplier)
    if (isSurfaceStage && !usesContinuousDive) {
      renderer.setClearAlpha(0)
    } else {
      renderer.setClearColor(submergedClearColor, 1)
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(fogColor, preset.fogDensity * depthProfile.fogDensityMultiplier)

    const textureLoader = new THREE.TextureLoader()
    const proceduralWaterNormals = buildNormalMap()
    const waterNormalsTexture = textureLoader.load("/textures/waternormals.jpg")
    waterNormalsTexture.wrapS = THREE.RepeatWrapping
    waterNormalsTexture.wrapT = THREE.RepeatWrapping

    const bubbleSpriteTexture = textureLoader.load("/textures/bubble-circle.png")
    bubbleSpriteTexture.wrapS = THREE.ClampToEdgeWrapping
    bubbleSpriteTexture.wrapT = THREE.ClampToEdgeWrapping
    const siltParticleTexture = textureLoader.load("/textures/micro-particle.png")
    siltParticleTexture.wrapS = THREE.ClampToEdgeWrapping
    siltParticleTexture.wrapT = THREE.ClampToEdgeWrapping
    const sedimentOverlayTexture = textureLoader.load("/textures/coast-sand-01-diff-1k.jpg")
    const surfaceRippleTextureA = supportsUnderwaterSystems ? waterNormalsTexture.clone() : null
    const surfaceRippleTextureB = supportsUnderwaterSystems ? waterNormalsTexture.clone() : null
    if (surfaceRippleTextureA) {
      surfaceRippleTextureA.repeat.set(3.1, 2.1)
      surfaceRippleTextureA.offset.set(0, 0)
      surfaceRippleTextureA.needsUpdate = true
    }
    if (surfaceRippleTextureB) {
      surfaceRippleTextureB.repeat.set(2.5, 1.85)
      surfaceRippleTextureB.offset.set(0.18, 0.12)
      surfaceRippleTextureB.needsUpdate = true
    }

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      20000,
    )
    camera.position.set(0, depthProfile.cameraY, 88)
    camera.lookAt(0, depthProfile.lookAtY, depthProfile.lookAtZ)
    const cameraLookAt = new THREE.Vector3(0, depthProfile.lookAtY, depthProfile.lookAtZ)

    const sun = new THREE.Vector3()
    const phi = THREE.MathUtils.degToRad(90 - preset.sunElevation)
    const theta = THREE.MathUtils.degToRad(preset.sunAzimuth)
    sun.setFromSphericalCoords(1, phi, theta)

    let sky: Sky | null = null
    if (isSurfaceStage) {
      sky = new Sky()
      sky.scale.setScalar(10000)
      scene.add(sky)

      const skyUniforms = sky.material.uniforms
      skyUniforms["turbidity"].value = preset.turbidity
      skyUniforms["rayleigh"].value = preset.rayleigh
      skyUniforms["mieCoefficient"].value = preset.mieCoefficient
      skyUniforms["mieDirectionalG"].value = preset.mieDirectionalG
      skyUniforms["sunPosition"].value.copy(sun)
    }

    const waterGeometry = new THREE.PlaneGeometry(
      12000,
      12000,
      isMobile ? 96 : 192,
      isMobile ? 96 : 192,
    )

    let water: Water | null = null
    if (isSurfaceStage) {
      water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: waterNormalsTexture ?? proceduralWaterNormals,
        sunDirection: new THREE.Vector3().copy(sun).normalize(),
        sunColor,
        waterColor,
        alpha: 0.95,
        distortionScale: isMobile
          ? Math.max(2.5, (preset.waterDistortion + 0.5) * depthProfile.distortionMultiplier)
          : (preset.waterDistortion + 0.8) * depthProfile.distortionMultiplier,
        fog: false,
      })
      water.rotation.x = -Math.PI / 2
      water.position.y = -0.05
      
      // Enhanced water material with transition effects
      if (water.material && water.material.uniforms) {
        water.material.uniforms.size.value = 1.2
        
        // Add custom uniforms for transition effects
        water.material.uniforms.uProgress = { value: 0 }
        water.material.uniforms.uTime = { value: 0 }
        
        // Enhance shader with better wave dynamics
        const originalFragmentShader = water.material.fragmentShader
        
        // Add more wave layers to fragment shader for richer transitions
        water.material.fragmentShader = originalFragmentShader.replace(
          'gl_FragColor = vec4( mix( waterColor, sunColor, pow( sunFade, 3.0 ) ), 1.0 );',
          `
          // Enhanced wave layers for transition
          float waveLayer = sin(vUv.x * 12.0 + uTime * 2.0) * 0.05;
          waveLayer += cos(vUv.y * 8.0 + uTime * 1.5) * 0.05;
          vec3 enhancedColor = mix(waterColor, sunColor, pow(sunFade, 3.0));
          enhancedColor += waveLayer * sunColor * 0.3;
          gl_FragColor = vec4(enhancedColor, 1.0);
          `
        )
      }
      
      scene.add(water)
    }

    if (isSurfaceStage && !usesContinuousDive) {
      addSand(scene, preset, phase)
      scatterBeachDecor(scene, isMobile, preset)
    }
    const noonCloudLayer = phase === "noon" && isSurfaceStage ? addNoonClouds(scene, isMobile) : null
    const noonSunLayer = phase === "noon" && isSurfaceStage ? addNoonSun(scene) : null
    const underwaterDepthStage: "mid" | "deep" = depthStage === "deep" ? "deep" : "mid"
    const underwaterLayer = supportsUnderwaterSystems
      ? addUnderwaterParticles(scene, phase, underwaterDepthStage, isMobile, bubbleSpriteTexture)
      : null
    const underwaterBedLayer = supportsUnderwaterSystems
      ? addUnderwaterBed(scene, phase, underwaterDepthStage, isMobile)
      : null
    const underwaterVolumeLayer = supportsUnderwaterSystems
      ? addUnderwaterVolumeTexture(scene, phase, underwaterDepthStage, isMobile, sedimentOverlayTexture)
      : null
    const underwaterSiltLayer = supportsUnderwaterSystems
      ? addUnderwaterSilt(scene, underwaterDepthStage, isMobile, siltParticleTexture)
      : null
    const mutedSunlightLayer = supportsUnderwaterSystems ? addMutedTopSunlight(scene, phase, underwaterDepthStage) : null
    const reflectionLayer = supportsUnderwaterSystems ? addUnderwaterReflections(scene, phase, underwaterDepthStage) : null
    const surfaceWindowLayer = supportsUnderwaterSystems
      ? addUnderwaterSurfaceWindow(
        scene,
        phase,
        underwaterDepthStage,
        isMobile,
        surfaceRippleTextureA ?? undefined,
        surfaceRippleTextureB ?? undefined,
      )
      : null

    // Configure camera layers: layer 0 (default) + layer 1 (stars for night)
    camera.layers.enable(1)

    const ambientLight = new THREE.AmbientLight(preset.ambientColor, preset.ambientIntensity * depthProfile.lightMultiplier)
    const hemisphereLight = new THREE.HemisphereLight(
      preset.hemisphereSkyColor,
      preset.hemisphereGroundColor,
      preset.hemisphereIntensity * depthProfile.lightMultiplier,
    )
    scene.add(ambientLight)
    scene.add(hemisphereLight)

    let sunLight: THREE.DirectionalLight | null = null
    let fillLight: THREE.DirectionalLight | null = null
    let rimLight: THREE.DirectionalLight | null = null

    if (isSurfaceStage) {
      sunLight = new THREE.DirectionalLight(
        preset.sunlightColor,
        preset.sunlightIntensity * depthProfile.lightMultiplier,
      )
      sunLight.position.copy(sun).multiplyScalar(preset.sunlightDistance)
      scene.add(sunLight)

      fillLight = new THREE.DirectionalLight(preset.fillColor, preset.fillIntensity * depthProfile.lightMultiplier)
      fillLight.position.set(...preset.fillPosition)
      scene.add(fillLight)

      rimLight = new THREE.DirectionalLight(preset.rimColor, preset.rimIntensity * depthProfile.lightMultiplier)
      rimLight.position.set(...preset.rimPosition)
      scene.add(rimLight)
    }

    let raf = 0
    let lastElapsed = performance.now() * 0.001 - GLOBAL_OCEAN_START
    let smoothedDepthBlend = getDepthBlend(depthStage, 0.2)
    let isSceneVisible = true

    const parent = canvas.parentElement ?? canvas
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isSceneVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(parent)

    const fog = scene.fog as THREE.FogExp2
    // Use the adjusted water color (same as water surface shader) for underwater background - ensures continuity
    const baseUnderwaterColor = waterColor.clone()
    const dynamicFogColor = baseUnderwaterColor.clone()
    const dynamicClearColor = baseUnderwaterColor.clone()

    const render = () => {
      raf = requestAnimationFrame(render)
      const elapsed = performance.now() * 0.001 - GLOBAL_OCEAN_START
      const delta = Math.min(0.05, Math.max(0.001, elapsed - lastElapsed))
      lastElapsed = elapsed

      if (!isSceneVisible) {
        return
      }

      const sectionProgress = getSectionScrollProgress(parent)
      const controlledProgress =
        typeof externalDiveProgressRef.current === "number" ? externalDiveProgressRef.current : sectionProgress
      const targetDepthBlend = usesContinuousDive ? controlledProgress : getDepthBlend(depthStage, controlledProgress)
      smoothedDepthBlend = THREE.MathUtils.lerp(smoothedDepthBlend, targetDepthBlend, usesContinuousDive ? 0.2 : 0.5)
      const stageDepth = usesContinuousDive || !isSurfaceStage ? clamp01(smoothedDepthBlend) : smoothedDepthBlend
      const surfaceWaveTime = elapsed * 0.45

      const exposureMultiplier = THREE.MathUtils.lerp(1, depthProfile.exposureMultiplier, stageDepth)
      // Keep exposure brighter longer so the descent remains airy and not abruptly dark.
      const depthExposureFactor = stageDepth < 0.6 ? THREE.MathUtils.lerp(1, 0.82, stageDepth / 0.6) : 1
      const textureOnsetDimmer = THREE.MathUtils.lerp(1, 0.72, smoothstep(0.1, 0.5, stageDepth))
      renderer.toneMappingExposure = Math.max(
        0.2,
        preset.exposure * exposureMultiplier * depthExposureFactor * textureOnsetDimmer,
      )

      if (!isSurfaceStage || usesContinuousDive) {
        const skyTransitionColor = new THREE.Color(0xb8def2)
        const underwaterPhase = smoothstep(0.1, 0.5, stageDepth)

        const baseHsl = { h: 0, s: 0, l: 0 }
        baseUnderwaterColor.getHSL(baseHsl)

        const lightWaterColor = new THREE.Color()
        lightWaterColor.setHSL(baseHsl.h, baseHsl.s, Math.min(1, baseHsl.l + 0.17))

        const mediumWaterColor = new THREE.Color()
        mediumWaterColor.setHSL(baseHsl.h, baseHsl.s, Math.min(1, baseHsl.l + 0.08))

        const darkWaterColor = baseUnderwaterColor.clone()

        if (stageDepth < 0.65) {
          dynamicClearColor.copy(lightWaterColor)
        } else if (stageDepth < 0.80) {
          const mediumProgress = (stageDepth - 0.65) / 0.15
          dynamicClearColor.copy(lightWaterColor)
          dynamicClearColor.lerp(mediumWaterColor, mediumProgress)
        } else {
          const darkProgress = Math.min(1, (stageDepth - 0.80) / 0.25)
          dynamicClearColor.copy(mediumWaterColor)
          dynamicClearColor.lerp(darkWaterColor, darkProgress)
        }

        dynamicClearColor.lerpColors(skyTransitionColor, dynamicClearColor.clone(), underwaterPhase)
        
        dynamicFogColor.copy(baseUnderwaterColor)

        fog.color.copy(dynamicFogColor)

        // Fog density: lighter near surface, increases with depth for layered effect
        const startFogDensity = usesContinuousDive ? 0.48 : 1.8
        const baseDensity = THREE.MathUtils.lerp(startFogDensity, depthProfile.fogDensityMultiplier, stageDepth)
        fog.density = preset.fogDensity * baseDensity

        renderer.setClearColor(dynamicClearColor, 1)
      }

      // Smooth dive curve: aggressive zoom during water phase (0-0.4), then deep dive (0.4+)
      const diveCurve = usesContinuousDive ? smoothstep(0.02, 0.5, stageDepth) : stageDepth
      const sideViewBlend = usesContinuousDive ? smoothstep(0.4, 0.95, stageDepth) : 0
      // Camera Y: passes through water surface (0) smoothly for immersive submersion effect
      const baseY = THREE.MathUtils.lerp(11.5, depthProfile.cameraY - 3.2, diveCurve)
      const baseZ = THREE.MathUtils.lerp(88, depthProfile.cameraZ - 12, diveCurve)

      camera.position.x = THREE.MathUtils.lerp(0, isMobile ? -9 : -13.5, sideViewBlend)
      camera.position.y = THREE.MathUtils.lerp(baseY, baseY - (isMobile ? 0.6 : 1.1), sideViewBlend)
      camera.position.z = THREE.MathUtils.lerp(baseZ, isMobile ? 6 : 2.5, sideViewBlend)

      cameraLookAt.x = THREE.MathUtils.lerp(0, isMobile ? 7.5 : 11.5, sideViewBlend)
      // Look-at point descends with camera for natural dive orientation through waterline
      cameraLookAt.y = THREE.MathUtils.lerp(1.8, depthProfile.lookAtY - 2.8, diveCurve)
      cameraLookAt.z = THREE.MathUtils.lerp(-140, depthProfile.lookAtZ + 18, diveCurve)
      camera.lookAt(cameraLookAt)

      const targetFov = THREE.MathUtils.lerp(50, isMobile ? 76 : 68, sideViewBlend)
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov = targetFov
        camera.updateProjectionMatrix()
      }

      const lightMultiplier = THREE.MathUtils.lerp(1, depthProfile.lightMultiplier, stageDepth)
      ambientLight.intensity = preset.ambientIntensity * lightMultiplier
      hemisphereLight.intensity = preset.hemisphereIntensity * lightMultiplier
      if (sunLight) sunLight.intensity = preset.sunlightIntensity * lightMultiplier
      if (fillLight) fillLight.intensity = preset.fillIntensity * lightMultiplier
      if (rimLight) rimLight.intensity = preset.rimIntensity * lightMultiplier

      // Target and cancel out orange and pink tones only during scroll transition
      const transitionMuteAmount = Math.max(0, 1 - Math.abs(controlledProgress - 0.5) * 2.5)
      
      // Always show blue colors normally
      ambientLight.color.setHex(preset.ambientColor)
      hemisphereLight.color.setHex(preset.hemisphereSkyColor)
      if (fillLight) fillLight.color.setHex(preset.fillColor)
      
      // Mute only warm/orange/pink colors during transition
      if (transitionMuteAmount > 0.01) {
        const tempColor = new THREE.Color()
        
        // Cancel out sun light (which is orange/yellow in noon mood)
        if (sunLight) {
          tempColor.setHex(preset.sunlightColor)
          tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)  // Nearly cancel it out
          sunLight.color.copy(tempColor)
        }
        // Cancel out rim light (which is orange/peachy/pink)
        if (rimLight) {
          tempColor.setHex(preset.rimColor)
          tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)  // Nearly cancel it out
          rimLight.color.copy(tempColor)
        }
        // Cancel out hemisphere ground color (which is pinkish)
        tempColor.setHex(preset.hemisphereGroundColor)
        tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)
        hemisphereLight.groundColor.copy(tempColor)
      } else {
        // When not in transition zone, show full colors
        if (sunLight) sunLight.color.setHex(preset.sunlightColor)
        if (rimLight) rimLight.color.setHex(preset.rimColor)
        hemisphereLight.groundColor.setHex(preset.hemisphereGroundColor)
      }

      if (water) {
        water.material.uniforms["time"].value = surfaceWaveTime
        // Update enhanced transition uniforms
        if (water.material.uniforms.uTime) {
          water.material.uniforms.uTime.value = elapsed
        }
        if (water.material.uniforms.uProgress) {
          water.material.uniforms.uProgress.value = stageDepth
        }
        water.position.y = -0.05 - smoothstep(0.1, 0.92, stageDepth) * 4.9
        // Water stays fully visible during zoom phase (0-0.4), then fades as you go deeper
        if (usesContinuousDive) {
          water.visible = smoothstep(0.55, 0.35, stageDepth) > 0.05
        }
      }
      // Control sky visibility during continuous dive - long smooth fade
      if (sky && usesContinuousDive) {
        sky.visible = smoothstep(0.45, 0.3, stageDepth) > 0.05
      }
      // Fade clouds out before the darker transition window kicks in.
      if (noonCloudLayer && usesContinuousDive) {
        const cloudFade = 1 - smoothstep(0.2, 0.34, stageDepth)
        noonCloudLayer.update(elapsed, cloudFade)
      } else {
        noonCloudLayer?.update(elapsed)
      }
      // dawnBirdFlock?.update(elapsed, stageDepth) // Removed: dawn phase no longer exists
      noonSunLayer?.update()
      
      // Only show underwater effects after water zoom completes (stageDepth > 0.2)
      if (underwaterLayer) {
        underwaterLayer.particles.visible = stageDepth > 0.2
        underwaterLayer.update(elapsed, delta)
      }
      underwaterBedLayer?.update(elapsed, stageDepth)
      underwaterVolumeLayer?.update(elapsed, stageDepth)
      underwaterSiltLayer?.update(elapsed, delta, stageDepth)
      if (mutedSunlightLayer) {
        mutedSunlightLayer.update(elapsed)
      }
      if (reflectionLayer) {
        reflectionLayer.group.visible = stageDepth > 0.1
        reflectionLayer.update(elapsed)
      }
      if (surfaceWindowLayer) {
        surfaceWindowLayer.group.visible = stageDepth > 0.1
        surfaceWindowLayer.update(elapsed, stageDepth, surfaceWaveTime)
      }
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
    resizeObserver.observe(parent)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      proceduralWaterNormals.dispose()
      waterNormalsTexture.dispose()
      bubbleSpriteTexture.dispose()
      siltParticleTexture.dispose()
      sedimentOverlayTexture.dispose()
      surfaceRippleTextureA?.dispose()
      surfaceRippleTextureB?.dispose()
      underwaterBedLayer?.dispose()
      underwaterVolumeLayer?.dispose()
      water?.geometry.dispose()
      water?.material.dispose()
      disposeScene(scene)
      renderer.dispose()
    }
  }, [depthProfile, fogColor, isMobile, isSurfaceStage, phase, preset, submergedClearColor, sunColor, waterColor, depthStage, usesContinuousDive, supportsUnderwaterSystems])

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
