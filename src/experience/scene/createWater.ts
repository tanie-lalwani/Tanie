import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"

/**
 * Builds a procedural normal-map texture so we don't need an external .jpg file.
 * Multiple overlapping sine waves produce convincing water-surface normals.
 */
function buildNormalMap(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = (row * size + col) * 4
      const u = (col / size) * Math.PI * 2
      const v = (row / size) * Math.PI * 2

      // Layered sine waves → surface tangents → normal
      const nx =
        0.30 * Math.sin(u * 2) +
        0.16 * Math.sin(u * 5 + v * 3) +
        0.08 * Math.sin(u * 10 + v * 1.5)
      const ny =
        0.30 * Math.cos(v * 2) +
        0.16 * Math.cos(u * 3 + v * 5) +
        0.08 * Math.cos(v * 10 + u * 1.5)
      const nz = Math.sqrt(Math.max(1 - nx * nx - ny * ny, 0))

      data[idx]     = Math.round((nx + 1) * 127.5)
      data[idx + 1] = Math.round((ny + 1) * 127.5)
      data[idx + 2] = Math.round(nz * 255)
      data[idx + 3] = 255
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

/** Adds an animated ocean plane to the scene and returns the Water object. */
export function createWater(scene: THREE.Scene, sun: THREE.Vector3): Water {
  const geometry = new THREE.PlaneGeometry(10000, 10000)

  const water = new Water(geometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: buildNormalMap(),
    sunDirection: new THREE.Vector3().copy(sun).normalize(),
    sunColor: 0xfff3cc,
    waterColor: 0x005f8e,
    distortionScale: 3.7,
    fog: false,
  })

  water.rotation.x = -Math.PI / 2
  scene.add(water)
  return water
}
