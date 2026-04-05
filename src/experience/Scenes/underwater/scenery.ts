import * as THREE from "three"
import { MOOD_PRESETS } from "../../moods"
import type { TimePhase } from "../../timePhase"
import { smoothstep } from "../math"
import {
  buildCausticTexture,
  buildSandTexture,
  buildSunHazeTexture,
  buildWaterVeilTexture,
} from "../textures"

export function addSeabedTerrain(
  scene: THREE.Scene,
  phase: TimePhase,
  isMobile: boolean,
) {
  const bedTexture = buildSandTexture(256, "default")
  bedTexture.repeat.set(isMobile ? 12 : 16, isMobile ? 18 : 24)

  const bedGeometry = new THREE.PlaneGeometry(
    isMobile ? 320 : 520,
    isMobile ? 840 : 1180,
    isMobile ? 28 : 46,
    isMobile ? 78 : 106,
  )
  const positions = bedGeometry.attributes.position as THREE.BufferAttribute

  const bedLength = isMobile ? 840 : 1180
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    const shoreDistance = (y + bedLength * 0.5) / bedLength
    const shelfSlope = THREE.MathUtils.lerp(8, -24, shoreDistance)
    const continentalShelf = Math.cos(shoreDistance * Math.PI * 0.9) * 2.6
    const dune =
      Math.sin(x * 0.055) * 1.6 +
      Math.cos(y * 0.032) * 2.1 +
      Math.sin((x + y) * 0.02) * 1.1
    const ripple = Math.sin(x * 0.24 + y * 0.08) * (0.62 - shoreDistance * 0.18)
    positions.setZ(i, shelfSlope + continentalShelf + dune + ripple)
  }

  bedGeometry.computeVertexNormals()

  const baseOpacity = 0.72
  const baseEmissive = 0.065
  const bedMaterial = new THREE.MeshStandardMaterial({
    color: phase === "noon" ? 0x9b7a58 : 0x86654a,
    map: bedTexture,
    transparent: true,
    opacity: baseOpacity,
    roughness: 1,
    metalness: 0.02,
    emissive: phase === "noon" ? 0x5c4632 : 0x493829,
    emissiveIntensity: baseEmissive,
  })

  const bed = new THREE.Mesh(bedGeometry, bedMaterial)
  bed.rotation.x = -Math.PI / 2
  bed.position.set(0, -8, -148)
  bed.receiveShadow = true

  const ridgeMaterial = new THREE.MeshStandardMaterial({
    color: phase === "noon" ? 0x7e6144 : 0x694f39,
    roughness: 1,
    metalness: 0.01,
    transparent: true,
    opacity: 0.22,
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
      bed.position.z + 80 - Math.random() * 360,
    )
    ridge.rotation.y = Math.random() * Math.PI
    group.add(ridge)
  }

  scene.add(group)

  return {
    group,
    update: (time: number, stageDepth: number) => {
      const reveal = smoothstep(0.06, 0.62, stageDepth)
      const settle = 1 - smoothstep(0.94, 1, stageDepth) * 0.08
      const visibility = reveal * settle

      group.visible = visibility > 0.02
      group.position.y = THREE.MathUtils.lerp(14, 0, reveal) + Math.sin(time * 0.14) * 0.35
      group.position.x = Math.sin(time * 0.1) * 1.6
      group.position.z = THREE.MathUtils.lerp(64, 0, reveal)

      bedMaterial.opacity = baseOpacity * visibility
      bedMaterial.emissiveIntensity = baseEmissive + Math.sin(time * 0.32) * 0.008
      bedTexture.offset.x = Math.sin(time * 0.018) * 0.02
      bedTexture.offset.y = -time * 0.006
    },
    dispose: () => {
      bedTexture.dispose()
    },
  }
}

export function addSubsurfaceSunlight(scene: THREE.Scene, phase: TimePhase) {
  const baseIntensity = phase === "noon" ? 0.18 : 0.135
  const baseOpacity = phase === "noon" ? 0.095 : 0.072
  const lightColor = phase === "noon" ? 0xb8dcff : 0xa8c9ea

  const topLight = new THREE.DirectionalLight(lightColor, baseIntensity)
  topLight.position.set(0, 112, 38)
  topLight.target.position.set(0, 6, -138)
  scene.add(topLight)
  scene.add(topLight.target)

  const hazeTexture = buildSunHazeTexture(256)
  const hazeMaterial = new THREE.MeshBasicMaterial({
    map: hazeTexture,
    transparent: true,
    opacity: baseOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 340),
    hazeMaterial,
  )

  haze.position.set(0, 28, -158)
  haze.rotation.x = -0.14
  scene.add(haze)

  return {
    update: (time: number, stageDepth: number) => {
      const visibility = smoothstep(0.02, 0.24, stageDepth) * (1 - smoothstep(0.8, 1, stageDepth))
      topLight.intensity = baseIntensity * visibility
      haze.visible = visibility > 0.02
      haze.position.x = Math.sin(time * 0.12) * 16
      haze.position.y = 28 + Math.sin(time * 0.2) * 1.8
      hazeMaterial.opacity = (baseOpacity + Math.sin(time * 0.55) * 0.009) * visibility
    },
    dispose: () => {
      hazeTexture.dispose()
    },
  }
}

export function addCausticReflections(
  scene: THREE.Scene,
  phase: TimePhase,
  causticTextureA?: THREE.Texture | null,
  causticTextureB?: THREE.Texture | null,
) {
  const ownsTextureA = !causticTextureA
  const ownsTextureB = !causticTextureB
  const textureA = causticTextureA ?? buildCausticTexture(256)
  const textureB = causticTextureB ?? buildCausticTexture(256)

  textureB.repeat.set(3.6, 2.8)

  const baseWaterColor = new THREE.Color(MOOD_PRESETS[phase].waterColor)
  const color = baseWaterColor.clone()
  const baseStrength = 0.11

  const materialA = new THREE.MeshBasicMaterial({
    map: textureA,
    color,
    transparent: true,
    opacity: baseStrength,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const materialB = new THREE.MeshBasicMaterial({
    map: textureB,
    color,
    transparent: true,
    opacity: baseStrength * 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })

  const planeA = new THREE.Mesh(new THREE.PlaneGeometry(1500, 980), materialA)
  const planeB = new THREE.Mesh(new THREE.PlaneGeometry(1450, 940), materialB)
  planeA.position.set(0, 2, -142)
  planeB.position.set(0, -4, -182)

  const group = new THREE.Group()
  group.add(planeA)
  group.add(planeB)
  scene.add(group)

  return {
    group,
    update: (time: number, stageDepth: number) => {
      const visibility = smoothstep(0.03, 0.28, stageDepth) * (1 - smoothstep(0.9, 1, stageDepth))

      textureA.offset.x = time * 0.033
      textureA.offset.y = -time * 0.018
      textureB.offset.x = -time * 0.027
      textureB.offset.y = time * 0.015

      group.visible = visibility > 0.02
      planeA.position.x = Math.sin(time * 0.22) * 10
      planeB.position.x = Math.cos(time * 0.18) * 8
      materialA.opacity = (baseStrength + Math.sin(time * 0.7) * 0.02) * visibility
      materialB.opacity = (baseStrength * 0.6 + Math.cos(time * 0.56) * 0.015) * visibility
    },
    dispose: () => {
      if (ownsTextureA) textureA.dispose()
      if (ownsTextureB) textureB.dispose()
    },
  }
}

export function addUnderwaterVolumeVeil(
  scene: THREE.Scene,
  phase: TimePhase,
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

  const frontMaterial = new THREE.MeshBasicMaterial({
    map: veilTextureA,
    alphaMap: veilTextureA,
    color: 0xb8e8ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    alphaTest: 0.02,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const midMaterial = new THREE.MeshBasicMaterial({
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
  })
  const sedimentMaterial = sedimentTexture
    ? new THREE.MeshBasicMaterial({
      map: sedimentTexture,
      color: 0x8f7558,
      transparent: true,
      opacity: 0,
      blending: THREE.MultiplyBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    : null

  const frontVeil = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 720 : 980, isMobile ? 520 : 700),
    frontMaterial,
  )
  const midVeil = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 760 : 1060, isMobile ? 580 : 760),
    midMaterial,
  )
  const sedimentVeil = sedimentMaterial
    ? new THREE.Mesh(
      new THREE.PlaneGeometry(isMobile ? 700 : 940, isMobile ? 500 : 660),
      sedimentMaterial,
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
      const enterBlend = smoothstep(0.08, 0.48, stageDepth)
      const settleBlend = 1 - smoothstep(0.9, 1, stageDepth)
      const visibility = enterBlend * settleBlend
      const depthFactor = smoothstep(0.5, 0.98, stageDepth)

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
      group.visible = visibility > 0.02

      frontMaterial.opacity = THREE.MathUtils.lerp(0.26, 0.16, depthFactor) * visibility
      midMaterial.opacity = THREE.MathUtils.lerp(0.18, 0.11, depthFactor) * visibility
      if (sedimentMaterial) {
        sedimentMaterial.opacity = THREE.MathUtils.lerp(0.16, 0.1, depthFactor) * visibility
      }
    },
    dispose: () => {
      veilTextureA.dispose()
      veilTextureB.dispose()
    },
  }
}
