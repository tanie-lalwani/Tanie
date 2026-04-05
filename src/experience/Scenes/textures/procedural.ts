import * as THREE from "three"

export function buildNormalMap(size = 256): THREE.DataTexture {
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
        const sourceIndex = (yy * size + xx) * 4
        const weight = weights[i]

        sx += (data[sourceIndex] / 127.5 - 1) * weight
        sy += (data[sourceIndex + 1] / 127.5 - 1) * weight
        sz += (data[sourceIndex + 2] / 255) * weight
        sw += weight
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

export function buildSandTexture(size = 256, variant: "default" | "noon" = "default"): THREE.DataTexture {
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

      data[idx] = Math.min(255, Math.round((rBase + wave * 16) * grain))
      data[idx + 1] = Math.min(255, Math.round((gBase + wave * 13) * grain))
      data[idx + 2] = Math.min(255, Math.round((bBase + wave * 8) * grain))
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

export function buildCloudTexture(size = 128): THREE.CanvasTexture {
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

export function buildSunHazeTexture(size = 256): THREE.CanvasTexture {
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

export function buildCausticTexture(size = 256): THREE.CanvasTexture {
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

export function buildWaterVeilTexture(size = 512, variant: "soft" | "streaks" = "soft"): THREE.CanvasTexture {
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
