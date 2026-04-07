/**
 * File summary: Exposes shared experience texture loaders and procedural texture builders.
 * Scope: Re-exports asset loading types plus generated caustic, cloud, normal, sand, sun-haze, and water-veil textures.
 */
export { loadExperienceTextures } from "./assets"
export type { ExperienceTextures } from "./assets"
export {
  buildCausticTexture,
  buildCloudTexture,
  buildNormalMap,
  buildSandTexture,
  buildSunHazeTexture,
  buildWaterVeilTexture,
} from "./procedural"
