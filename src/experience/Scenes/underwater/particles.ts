import * as THREE from "three";
import type { TimePhase } from "../../timePhase";

export function addUnderwaterParticles(
  _scene?: THREE.Scene,
  _phase?: TimePhase,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _bubbleTexture?: THREE.Texture
) {
  return {
    particles: { visible: true },
    update: () => {},
  };
}

export function addUnderwaterSilt(
  _scene?: THREE.Scene,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _siltParticleTexture?: THREE.Texture
) {
  return {
    update: () => {},
  };
}

export function addUnderwaterSurfaceWindow(
  _scene?: THREE.Scene,
  _phase?: TimePhase,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _textureA?: THREE.Texture,
  _textureB?: THREE.Texture
) {
  return {
    group: { visible: true },
    update: () => {},
  };
}
