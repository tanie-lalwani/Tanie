export function addUnderwaterParticles(
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

export function addUnderwaterSilt( //section 4 particle layer start
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
