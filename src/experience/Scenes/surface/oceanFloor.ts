/**
 * File summary: Builds the surface-level seafloor terrain and decorative objects.
 * Scope: Creates sand geometry, seashell meshes, starfish meshes, and decor scattering for the Three.js ocean scene.
 */
import * as THREE from "three"
import type { OceanScenePreset } from "../../moods"
import { buildSandTexture } from "./textures"
import { LAYERS, setLayer } from "../layers"

// Purpose: Add the main seafloor mesh to the scene and assign it to the seafloor layer.
export function addSeafloorTerrain(scene: THREE.Scene, _preset: OceanScenePreset) {
  // Brighter, more vibrant seafloor for reference look
  const seafloorGeometry = new THREE.PlaneGeometry(1200, 84, 48, 22)
  const seafloorVertices = seafloorGeometry.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < seafloorVertices.count; i++) {
    seafloorVertices.setZ(i, seafloorVertices.getZ(i) + (Math.random() - 0.5) * 0.085)
  }

  seafloorGeometry.computeVertexNormals()

  // Tune these 2 values to change seabed grain scale and tiling density.
  const seafloorTexture = buildSandTexture(256)
  seafloorTexture.repeat.set(24, 8)

  const seafloorMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.56, 0.22, 0.68), // light blue sand
    map: seafloorTexture,
    roughness: 0.82,
    metalness: 0.01,
    emissive: 0x7ecfff, // blue emissive
    emissiveIntensity: 0.13,
  })

  const seafloorMesh = new THREE.Mesh(seafloorGeometry, seafloorMaterial)
  seafloorMesh.rotation.x = -Math.PI / 2
  seafloorMesh.position.set(0, 0.1, 112)
  seafloorMesh.receiveShadow = true
  setLayer(seafloorMesh, LAYERS.SEAFLOOR)
  scene.add(seafloorMesh)
}


// Purpose: Create a reusable seashell mesh for seafloor decoration.
function createSeashellMesh(preset: OceanScenePreset): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(0.22, 0.55, 16, 1, true)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.08, 0.38, 0.75),
    roughness: 0.74,
    metalness: 0.02,
    emissive: 0x2b4257,
    emissiveIntensity: preset.seashellEmissiveIntensity,
  })
  const seashellMesh = new THREE.Mesh(geometry, material)
  seashellMesh.scale.set(1, 0.48, 1)
  seashellMesh.rotation.x = Math.PI / 2
  setLayer(seashellMesh, LAYERS.DECOR)
  return seashellMesh
}

// Purpose: Create a reusable starfish mesh for seafloor decoration.
function createStarfishMesh(preset: OceanScenePreset): THREE.Mesh {
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

  const starfishMesh = new THREE.Mesh(geometry, material)
  starfishMesh.rotation.x = -Math.PI / 2
  setLayer(starfishMesh, LAYERS.DECOR)
  return starfishMesh
}

// Purpose: Scatter seashell and starfish meshes across the seafloor for visual detail.
export function scatterSeafloorDecor(scene: THREE.Scene, isMobile: boolean, preset: OceanScenePreset) {
  const decorCount = isMobile ? 16 : 34

  for (let i = 0; i < decorCount; i++) {
    const isStar = i % 3 === 0
    const mesh = isStar ? createStarfishMesh(preset) : createSeashellMesh(preset)
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
