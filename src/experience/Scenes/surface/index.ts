/**
 * File summary: Groups public surface-scene helpers behind a single import path.
 * Scope: Re-exports seafloor terrain, seafloor decor, cloud, and sun-light builders for surface scenes.
 */
export { addSeafloorTerrain, scatterSeafloorDecor } from "./oceanFloor"
export { addSurfaceCloudLayer, addSurfaceSunLight } from "./sky"
