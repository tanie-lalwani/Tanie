export function addSand(scene: THREE.Scene, preset: BeachMoodPreset, phase: TimePhase) {
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

export function scatterBeachDecor(scene: THREE.Scene, isMobile: boolean, preset: BeachMoodPreset) {
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
