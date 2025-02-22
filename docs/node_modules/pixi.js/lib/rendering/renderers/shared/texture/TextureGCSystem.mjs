import { ExtensionType } from '../../../../extensions/Extensions.mjs';

"use strict";
const _TextureGCSystem = class _TextureGCSystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this._renderer = renderer;
    this.count = 0;
    this.checkCount = 0;
  }
  init(options) {
    options = { ..._TextureGCSystem.defaultOptions, ...options };
    this.checkCountMax = options.textureGCCheckCountMax;
    this.maxIdle = options.textureGCAMaxIdle ?? options.textureGCMaxIdle;
    this.active = options.textureGCActive;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    if (!this._renderer.renderingToScreen) {
      return;
    }
    this.count++;
    if (!this.active)
      return;
    this.checkCount++;
    if (this.checkCount > this.checkCountMax) {
      this.checkCount = 0;
      this.run();
    }
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const managedTextures = this._renderer.texture.managedTextures;
    for (let i = 0; i < managedTextures.length; i++) {
      const texture = managedTextures[i];
      if (texture.autoGarbageCollect && texture.resource && texture._touched > -1 && this.count - texture._touched > this.maxIdle) {
        texture._touched = -1;
        texture.unload();
      }
    }
  }
  destroy() {
    this._renderer = null;
  }
};
/** @ignore */
_TextureGCSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem
  ],
  name: "textureGC"
};
/** default options for the TextureGCSystem */
_TextureGCSystem.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  textureGCActive: true,
  /**
   * @deprecated since 8.3.0
   * @see {@link TextureGCSystem.textureGCMaxIdle}
   */
  textureGCAMaxIdle: null,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  textureGCMaxIdle: 60 * 60,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  textureGCCheckCountMax: 600
};
let TextureGCSystem = _TextureGCSystem;

export { TextureGCSystem };
//# sourceMappingURL=TextureGCSystem.mjs.map
