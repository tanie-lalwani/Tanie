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

function buildBirdSpriteTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  const wingGradient = ctx.createLinearGradient(0, size * 0.34, size, size * 0.58)
  wingGradient.addColorStop(0, "rgba(255,255,255,0.98)")
  wingGradient.addColorStop(0.5, "rgba(212,228,245,0.95)")
  wingGradient.addColorStop(1, "rgba(160,184,205,0.88)")

  ctx.fillStyle = wingGradient
  ctx.beginPath()
  ctx.moveTo(size * 0.08, size * 0.56)
  ctx.quadraticCurveTo(size * 0.28, size * 0.26, size * 0.5, size * 0.5)
  ctx.quadraticCurveTo(size * 0.72, size * 0.26, size * 0.92, size * 0.56)
  ctx.quadraticCurveTo(size * 0.7, size * 0.47, size * 0.5, size * 0.56)
  ctx.quadraticCurveTo(size * 0.3, size * 0.47, size * 0.08, size * 0.56)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = "rgba(116,145,170,0.58)"
  ctx.lineWidth = size * 0.02
  ctx.beginPath()
  ctx.moveTo(size * 0.2, size * 0.54)
  ctx.quadraticCurveTo(size * 0.5, size * 0.43, size * 0.8, size * 0.54)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

function buildFishTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  ctx.clearRect(0, 0, size, size)
  const bodyGradient = ctx.createLinearGradient(size * 0.1, size * 0.2, size * 0.92, size * 0.82)
  bodyGradient.addColorStop(0, "rgba(214,241,255,0.98)")
  bodyGradient.addColorStop(0.45, "rgba(132,184,216,0.95)")
  bodyGradient.addColorStop(1, "rgba(54,102,136,0.9)")

  ctx.fillStyle = bodyGradient
  ctx.beginPath()
  ctx.moveTo(size * 0.08, size * 0.5)
  ctx.quadraticCurveTo(size * 0.22, size * 0.18, size * 0.68, size * 0.35)
  ctx.quadraticCurveTo(size * 0.92, size * 0.42, size * 0.96, size * 0.5)
  ctx.quadraticCurveTo(size * 0.92, size * 0.58, size * 0.68, size * 0.65)
  ctx.quadraticCurveTo(size * 0.22, size * 0.82, size * 0.08, size * 0.5)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = "rgba(38,81,115,0.88)"
  ctx.beginPath()
  ctx.moveTo(size * 0.02, size * 0.5)
  ctx.lineTo(size * 0.16, size * 0.34)
  ctx.lineTo(size * 0.16, size * 0.66)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = "rgba(255,255,255,0.2)"
  ctx.lineWidth = size * 0.018
  for (let i = 0; i < 5; i++) {
    const x = size * (0.24 + i * 0.12)
    ctx.beginPath()
    ctx.moveTo(x, size * 0.38)
    ctx.quadraticCurveTo(x + size * 0.03, size * 0.5, x, size * 0.62)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
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

function addDawnBirds(scene: THREE.Scene, isMobile: boolean, preset: BeachMoodPreset, birdTexture?: THREE.Texture) {
  const flock = new THREE.Group()
  const birds: Array<{ mesh: THREE.Sprite; material: THREE.SpriteMaterial; speed: number; flapOffset: number; baseY: number; baseOpacity: number }> = []
  const birdCount = isMobile ? 7 : 13

  for (let i = 0; i < birdCount; i++) {
    const baseOpacity = 0.68 + Math.random() * 0.18
    const material = new THREE.SpriteMaterial({
      map: birdTexture,
      alphaMap: birdTexture,
      color: preset.birdColor,
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
    })

    const bird = new THREE.Sprite(material)
    const size = 8 + Math.random() * 7
    bird.scale.set(size * 1.55, size, 1)
    bird.position.set(-220 - Math.random() * 480, 38 + Math.random() * 38, -300 - Math.random() * 320)
    bird.rotation.y = -0.26
    flock.add(bird)

    birds.push({
      mesh: bird,
      speed: 12 + Math.random() * 8,
      flapOffset: Math.random() * Math.PI * 2,
      baseY: bird.position.y,
      material,
      baseOpacity,
    })
  }

  scene.add(flock)

  const update = (time: number, depthBlend = 0) => {
    const fade = 1 - smoothstep(0.16, 0.42, depthBlend)
    flock.visible = fade > 0.01
    for (const bird of birds) {
      const travel = ((time * bird.speed + bird.flapOffset * 25) % 520) - 260
      bird.mesh.position.x = travel
      bird.mesh.position.y = bird.baseY + Math.sin(time * 0.55 + bird.flapOffset) * 1.8
      bird.mesh.material.opacity = bird.baseOpacity * fade
      bird.mesh.scale.y = (0.72 + Math.abs(Math.sin(time * 5 + bird.flapOffset)) * 0.8) * fade
      bird.mesh.rotation.z = Math.sin(time * 2 + bird.flapOffset) * 0.08
    }
  }

  return { update }
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

  const tint = new THREE.Color(
    phase === "noon" ? 0x6fc4f3 : phase === "dawn" ? 0x78a6c9 : 0x6b8fb0,
  )
  const deepTint = new THREE.Color(0x0a1c2e)

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

  return { update }
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

  const color = phase === "noon" ? 0x9edaff : phase === "dawn" ? 0x86b9de : 0x7da9ca
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
  scene.add(planeA)
  scene.add(planeB)

  return {
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

function addMidDepthFish(scene: THREE.Scene, isMobile: boolean, phase: TimePhase, fishTexture?: THREE.Texture) {
  const fishCount = isMobile ? 10 : 18
  const fishGroup = new THREE.Group()
  const fish: Array<{
    mesh: THREE.Group
    materials: THREE.MeshStandardMaterial[]
    baseOpacity: number
    speed: number
    offset: number
    amplitude: number
    baseY: number
    baseZ: number
    lane: number
  }> = []

  for (let i = 0; i < fishCount; i++) {
    const fishMesh = new THREE.Group()

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 10, 8),
      new THREE.MeshStandardMaterial({
        color: phase === "noon" ? 0x8ec8e6 : 0x7ea9c8,
        roughness: 0.7,
        metalness: 0.04,
        map: fishTexture,
        alphaMap: fishTexture,
        transparent: !!fishTexture,
        alphaTest: fishTexture ? 0.08 : 0,
      }),
    )
    body.scale.set(1.8, 0.8, 0.8)
    fishMesh.add(body)

    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.48, 0.9, 3),
      new THREE.MeshStandardMaterial({
        color: phase === "noon" ? 0x77b5d8 : 0x6f97b4,
        roughness: 0.75,
        metalness: 0.03,
        map: fishTexture,
        alphaMap: fishTexture,
        transparent: !!fishTexture,
        alphaTest: fishTexture ? 0.08 : 0,
      }),
    )
    tail.rotation.z = Math.PI / 2
    tail.position.x = -1.35
    fishMesh.add(tail)

    const fin = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.5, 3),
      new THREE.MeshStandardMaterial({
        color: phase === "noon" ? 0xaad6ee : 0x8ab4d0,
        roughness: 0.8,
        map: fishTexture,
        alphaMap: fishTexture,
        transparent: !!fishTexture,
        alphaTest: fishTexture ? 0.08 : 0,
      }),
    )
    fin.rotation.x = Math.PI / 2
    fin.position.set(0, 0.42, 0)
    fishMesh.add(fin)

    const lane = i % 2 === 0 ? 1 : -1
    const baseY = -10 + Math.random() * 28
    const baseZ = -165 - Math.random() * 95

    fishMesh.position.set(lane * (70 + Math.random() * 180), baseY, baseZ)
    fishMesh.scale.setScalar(0.65 + Math.random() * 0.65)
    fishMesh.rotation.y = lane === 1 ? Math.PI : 0
    fishGroup.add(fishMesh)

    fish.push({
      mesh: fishMesh,
      materials: [body.material, tail.material, fin.material] as THREE.MeshStandardMaterial[],
      baseOpacity: 0.9,
      speed: 8 + Math.random() * 6,
      offset: Math.random() * Math.PI * 2,
      amplitude: 0.6 + Math.random() * 1.6,
      baseY,
      baseZ,
      lane,
    })
  }

  scene.add(fishGroup)

  return {
    update: (time: number, depthBlend = 1) => {
      const fade = smoothstep(0.26, 0.58, depthBlend)
      fishGroup.visible = fade > 0.01
      for (const item of fish) {
        const travel = ((time * item.speed + item.offset * 15) % 460) - 230
        item.mesh.position.x = item.lane * travel
        item.mesh.position.y = item.baseY + Math.sin(time * 1.1 + item.offset) * item.amplitude
        item.mesh.position.z = item.baseZ + Math.cos(time * 0.65 + item.offset) * 14
        item.mesh.rotation.y = item.lane === 1 ? Math.PI + Math.sin(time * 2.2 + item.offset) * 0.18 : Math.sin(time * 2.2 + item.offset) * 0.18
        for (const material of item.materials) {
          material.opacity = item.baseOpacity * fade
        }
      }
    },
  }
}

function addDeepFish(scene: THREE.Scene, isMobile: boolean, phase: TimePhase, fishTexture?: THREE.Texture) {
  const fishCount = isMobile ? 6 : 10
  const fishGroup = new THREE.Group()
  const fish: Array<{
    mesh: THREE.Group
    materials: THREE.MeshStandardMaterial[]
    baseOpacity: number
    speed: number
    offset: number
    amplitude: number
    baseY: number
    baseZ: number
    lane: number
  }> = []

  for (let i = 0; i < fishCount; i++) {
    const fishMesh = new THREE.Group()

    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.78, 10, 8),
      new THREE.MeshStandardMaterial({
        color: phase === "noon" ? 0x6fa9ca : 0x6288a8,
        roughness: 0.78,
        metalness: 0.03,
        map: fishTexture,
        alphaMap: fishTexture,
        transparent: !!fishTexture,
        alphaTest: fishTexture ? 0.08 : 0,
      }),
    )
    body.scale.set(1.55, 0.76, 0.76)
    fishMesh.add(body)

    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.38, 0.72, 3),
      new THREE.MeshStandardMaterial({ color: phase === "noon" ? 0x5e97bb : 0x4e7492, roughness: 0.8 }),
    )
    tail.rotation.z = Math.PI / 2
    tail.position.x = -1.1
    fishMesh.add(tail)

    const bodyMaterial = body.material as THREE.MeshStandardMaterial
    const tailMaterial = tail.material as THREE.MeshStandardMaterial
    bodyMaterial.map = fishTexture ?? null
    bodyMaterial.alphaMap = fishTexture ?? null
    bodyMaterial.transparent = !!fishTexture
    bodyMaterial.alphaTest = fishTexture ? 0.08 : 0
    tailMaterial.map = fishTexture ?? null
    tailMaterial.alphaMap = fishTexture ?? null
    tailMaterial.transparent = !!fishTexture
    tailMaterial.alphaTest = fishTexture ? 0.08 : 0

    const lane = i % 2 === 0 ? 1 : -1
    const baseY = -14 + Math.random() * 30
    const baseZ = -195 - Math.random() * 120

    fishMesh.position.set(lane * (90 + Math.random() * 190), baseY, baseZ)
    fishMesh.scale.setScalar(0.58 + Math.random() * 0.5)
    fishMesh.rotation.y = lane === 1 ? Math.PI : 0
    fishGroup.add(fishMesh)

    fish.push({
      mesh: fishMesh,
      materials: [bodyMaterial, tailMaterial],
      baseOpacity: 0.82,
      speed: 6.8 + Math.random() * 4.2,
      offset: Math.random() * Math.PI * 2,
      amplitude: 0.45 + Math.random() * 1.1,
      baseY,
      baseZ,
      lane,
    })
  }

  scene.add(fishGroup)

  return {
    update: (time: number, depthBlend = 1) => {
      const fade = smoothstep(0.5, 0.84, depthBlend)
      fishGroup.visible = fade > 0.01
      for (const item of fish) {
        const travel = ((time * item.speed + item.offset * 14) % 500) - 250
        item.mesh.position.x = item.lane * travel
        item.mesh.position.y = item.baseY + Math.sin(time * 0.95 + item.offset) * item.amplitude
        item.mesh.position.z = item.baseZ + Math.cos(time * 0.55 + item.offset) * 12
        item.mesh.rotation.y = item.lane === 1 ? Math.PI + Math.sin(time * 1.8 + item.offset) * 0.16 : Math.sin(time * 1.8 + item.offset) * 0.16
        for (const material of item.materials) {
          material.opacity = item.baseOpacity * fade
        }
      }
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
      phase === "dawn"
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
    const color = waterColor.clone().lerp(fogColor, 0.48)
    if (phase === "dawn") {
      color.offsetHSL(0.006, 0.012, -0.11)
    } else if (phase === "noon") {
      color.offsetHSL(-0.004, 0.028, -0.08)
    } else {
      color.offsetHSL(0.01, -0.008, -0.12)
    }
    return color
  }, [fogColor, waterColor, phase])

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
    const birdSpriteTexture = buildBirdSpriteTexture(256)
    const fishTexture = buildFishTexture(256)

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

    if (isSurfaceStage) {
      const sky = new Sky()
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
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormalsTexture ?? proceduralWaterNormals,
        sunDirection: new THREE.Vector3().copy(sun).normalize(),
        sunColor,
        waterColor,
        distortionScale: isMobile
          ? Math.max(1.5, (preset.waterDistortion - 0.9) * depthProfile.distortionMultiplier)
          : preset.waterDistortion * depthProfile.distortionMultiplier,
        fog: false,
      })
      water.rotation.x = -Math.PI / 2
      water.position.y = -0.05
      scene.add(water)
    }

    if (isSurfaceStage) {
      addSand(scene, preset, phase)
      scatterBeachDecor(scene, isMobile, preset)
    }
    const dawnBirdFlock = phase === "dawn" && isSurfaceStage ? addDawnBirds(scene, isMobile, preset, birdSpriteTexture) : null
    const noonCloudLayer = phase === "noon" && isSurfaceStage ? addNoonClouds(scene, isMobile) : null
    const noonSunLayer = phase === "noon" && isSurfaceStage ? addNoonSun(scene) : null
    const noonShipLayer = phase === "noon" && isSurfaceStage ? addNoonShipIllusion(scene, isMobile) : null
    const underwaterDepthStage: "mid" | "deep" = depthStage === "deep" ? "deep" : "mid"
    const underwaterLayer = supportsUnderwaterSystems
      ? addUnderwaterParticles(scene, phase, underwaterDepthStage, isMobile, bubbleSpriteTexture)
      : null
    const mutedSunlightLayer = supportsUnderwaterSystems ? addMutedTopSunlight(scene, phase, underwaterDepthStage) : null
    const reflectionLayer = supportsUnderwaterSystems ? addUnderwaterReflections(scene, phase, underwaterDepthStage) : null
    const fishLayer = depthStage === "mid" || usesContinuousDive ? addMidDepthFish(scene, isMobile, phase, fishTexture) : null
    const deepFishLayer = depthStage === "deep" || usesContinuousDive ? addDeepFish(scene, isMobile, phase, fishTexture) : null

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
    const stageFogColor = fogColor.clone()
    const stageClearColor = submergedClearColor.clone()
    const deepFog = fogColor.clone().offsetHSL(phase === "noon" ? -0.01 : 0.006, -0.08, -0.2)
    const deepClear = submergedClearColor.clone().offsetHSL(phase === "noon" ? -0.006 : 0.01, -0.1, -0.25)
    const dynamicFogColor = stageFogColor.clone()
    const dynamicClearColor = stageClearColor.clone()

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
      smoothedDepthBlend = THREE.MathUtils.lerp(smoothedDepthBlend, targetDepthBlend, usesContinuousDive ? 0.2 : 0.065)
      const stageDepth = usesContinuousDive || !isSurfaceStage ? clamp01(smoothedDepthBlend) : smoothedDepthBlend

      const exposureMultiplier = THREE.MathUtils.lerp(1, depthProfile.exposureMultiplier, stageDepth)
      renderer.toneMappingExposure = Math.max(0.2, preset.exposure * exposureMultiplier)

      if (!isSurfaceStage || usesContinuousDive) {
        dynamicFogColor.copy(stageFogColor).lerp(deepFog, smoothstep(0.25, 1, stageDepth))
        dynamicClearColor.copy(stageClearColor).lerp(deepClear, smoothstep(0.2, 1, stageDepth))
        fog.color.copy(dynamicFogColor)
        const startFogDensity = usesContinuousDive ? 1 : 1.8
        fog.density = preset.fogDensity * THREE.MathUtils.lerp(startFogDensity, depthProfile.fogDensityMultiplier, stageDepth)
        renderer.setClearColor(dynamicClearColor, 1)
      }

      const diveCurve = usesContinuousDive ? smoothstep(0.02, 0.84, stageDepth) : stageDepth
      camera.position.y = THREE.MathUtils.lerp(11.5, depthProfile.cameraY, diveCurve)
      camera.position.z = THREE.MathUtils.lerp(88, depthProfile.cameraZ, diveCurve)
      cameraLookAt.y = THREE.MathUtils.lerp(1.8, depthProfile.lookAtY, diveCurve)
      cameraLookAt.z = THREE.MathUtils.lerp(-140, depthProfile.lookAtZ, diveCurve)
      camera.lookAt(cameraLookAt)

      const lightMultiplier = THREE.MathUtils.lerp(1, depthProfile.lightMultiplier, stageDepth)
      ambientLight.intensity = preset.ambientIntensity * lightMultiplier
      hemisphereLight.intensity = preset.hemisphereIntensity * lightMultiplier
      if (sunLight) sunLight.intensity = preset.sunlightIntensity * lightMultiplier
      if (fillLight) fillLight.intensity = preset.fillIntensity * lightMultiplier
      if (rimLight) rimLight.intensity = preset.rimIntensity * lightMultiplier

      if (water) {
        water.material.uniforms["time"].value = elapsed * 0.45
        water.position.y = -0.05 - smoothstep(0.1, 0.92, stageDepth) * 4.9
      }
      dawnBirdFlock?.update(elapsed, stageDepth)
      noonCloudLayer?.update(elapsed)
      noonSunLayer?.update()
      noonShipLayer?.update(elapsed)
      underwaterLayer?.update(elapsed, delta)
      mutedSunlightLayer?.update(elapsed)
      reflectionLayer?.update(elapsed)
      fishLayer?.update(elapsed, stageDepth)
      deepFishLayer?.update(elapsed, stageDepth)
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
      birdSpriteTexture.dispose()
      fishTexture.dispose()
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
