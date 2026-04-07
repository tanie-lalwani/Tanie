/**
 * File summary: Defines the shape of ocean scene preset data.
 * Scope: Documents all atmospheric, lighting, seafloor, water, and decorative tuning values consumed by scene builders.
 */
export type OceanScenePreset = {
  // Exposure and atmosphere.
  exposure: number
  fogColor: number
  fogDensity: number
  turbidity: number
  rayleigh: number
  mieCoefficient: number
  mieDirectionalG: number
  sunElevation: number
  sunAzimuth: number
  sunColor: number
  waterColor: number
  // Lighting rig.
  ambientColor: number
  ambientIntensity: number
  hemisphereSkyColor: number
  hemisphereGroundColor: number
  hemisphereIntensity: number
  sunlightColor: number
  sunlightIntensity: number
  sunlightDistance: number
  fillColor: number
  fillIntensity: number
  fillPosition: [number, number, number]
  rimColor: number
  rimIntensity: number
  rimPosition: [number, number, number]
  // Seafloor look.
  seafloorColor: number
  seafloorRoughness: number
  seafloorEmissive: number
  seafloorEmissiveIntensity: number
  // Surface wave distortion and micro-detail brightness.
  waterDistortion: number
  seashellEmissiveIntensity: number
  starfishEmissiveIntensity: number
  birdColor: number
}
