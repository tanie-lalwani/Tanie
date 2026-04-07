/**
 * File summary: Provides the default visual tuning preset for the ocean scene.
 * Scope: Collects atmosphere, lighting, material, and decorative color values used by the experience.
 */
import type { OceanScenePreset } from "./types"

export const defaultOceanMood: OceanScenePreset = {
  // TUNE: Global scene brightness and atmospheric haze depth.
  exposure: 0.44,
  fogColor: 0xb7def3,
  fogDensity: 0.00066,

  // TUNE: Sky scattering. Higher turbidity = hazier sky.
  turbidity: 3.2,
  rayleigh: 2.65,
  mieCoefficient: 0.0064,
  mieDirectionalG: 0.72,

  // TUNE: Sun placement and core ocean tint.
  sunElevation: 23,
  sunAzimuth: 20,
  sunColor: 0xffdd99,
  waterColor: 0x3d5f7f,

  // TUNE: Base lighting rig (ambient + hemisphere + directional stack).
  ambientColor: 0xffe8c4,
  ambientIntensity: 0.44,
  hemisphereSkyColor: 0x8fd8ff,
  hemisphereGroundColor: 0xffc99a,
  hemisphereIntensity: 0.26,
  sunlightColor: 0xffdd99,
  sunlightIntensity: 0.72,
  sunlightDistance: 500,
  fillColor: 0x7fc6ff,
  fillIntensity: 0.28,
  fillPosition: [-170, 98, 116],
  rimColor: 0xffb08a,
  rimIntensity: 0.22,
  rimPosition: [210, 40, -230],

  // TUNE: Seafloor material look.
  seafloorColor: 0xf0d7a3,
  seafloorRoughness: 0.96,
  seafloorEmissive: 0x000000,
  seafloorEmissiveIntensity: 0,

  // TUNE: Water wave distortion and small prop glow accents.
  waterDistortion: 4.2,
  seashellEmissiveIntensity: 0,
  starfishEmissiveIntensity: 0,

  // TUNE: Decorative actor tint (birds and small moving details).
  birdColor: 0x1f2d3a,
}
