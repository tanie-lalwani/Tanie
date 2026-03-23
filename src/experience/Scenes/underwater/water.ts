import * as THREE from "three";
import { MOOD_PRESETS } from "../../moods";
import type { TimePhase } from "../../timePhase";
import { buildSandTexture } from "../surface/textures";
import { smoothstep } from "../math";
export { addUnderwaterBed, addUnderwaterVolumeTexture, addMutedTopSunlight, addUnderwaterReflections };
function addUnderwaterBed(
  scene: THREE.Scene,
  phase: TimePhase,
  depthStage: "mid" | "deep",
  isMobile: boolean,
) {
  const bedTexture = buildSandTexture(256, "default")
  bedTexture.repeat.set(depthStage === "deep" ? 18 : 16, depthStage === "deep" ? 16 : 13)

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

export function buildRippleRefractionTexture(
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

