
// ...removed duplicate import...

import * as THREE from "three";

export function buildNormalMap(size = 256): THREE.Texture {
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