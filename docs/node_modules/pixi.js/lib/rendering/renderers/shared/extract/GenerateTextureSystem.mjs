import { Color } from '../../../../color/Color.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Rectangle } from '../../../../maths/shapes/Rectangle.mjs';
import { Bounds } from '../../../../scene/container/bounds/Bounds.mjs';
import { getLocalBounds } from '../../../../scene/container/bounds/getLocalBounds.mjs';
import { Container } from '../../../../scene/container/Container.mjs';
import { RenderTexture } from '../texture/RenderTexture.mjs';

"use strict";
const tempRect = new Rectangle();
const tempBounds = new Bounds();
const noColor = [0, 0, 0, 0];
class GenerateTextureSystem {
  constructor(renderer) {
    this._renderer = renderer;
  }
  /**
   * A Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your container is complicated and needs to be reused multiple times.
   * @param {GenerateTextureOptions | Container} options - Generate texture options.
   * @param {Container} [options.container] - If not given, the renderer's resolution is used.
   * @param {Rectangle} options.region - The region of the container, that shall be rendered,
   * @param {number} [options.resolution] - The resolution of the texture being generated.
   *        if no region is specified, defaults to the local bounds of the container.
   * @param {GenerateTextureSourceOptions} [options.textureSourceOptions] - Texture options for GPU.
   * @returns a shiny new texture of the container passed in
   */
  generateTexture(options) {
    if (options instanceof Container) {
      options = {
        target: options,
        frame: void 0,
        textureSourceOptions: {},
        resolution: void 0
      };
    }
    const resolution = options.resolution || this._renderer.resolution;
    const antialias = options.antialias || this._renderer.view.antialias;
    const container = options.target;
    let clearColor = options.clearColor;
    if (clearColor) {
      const isRGBAArray = Array.isArray(clearColor) && clearColor.length === 4;
      clearColor = isRGBAArray ? clearColor : Color.shared.setValue(clearColor).toArray();
    } else {
      clearColor = noColor;
    }
    const region = options.frame?.copyTo(tempRect) || getLocalBounds(container, tempBounds).rectangle;
    region.width = Math.max(region.width, 1 / resolution) | 0;
    region.height = Math.max(region.height, 1 / resolution) | 0;
    const target = RenderTexture.create({
      ...options.textureSourceOptions,
      width: region.width,
      height: region.height,
      resolution,
      antialias
    });
    const transform = Matrix.shared.translate(-region.x, -region.y);
    this._renderer.render({
      container,
      transform,
      target,
      clearColor
    });
    target.source.updateMipmaps();
    return target;
  }
  destroy() {
    this._renderer = null;
  }
}
/** @ignore */
GenerateTextureSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem
  ],
  name: "textureGenerator"
};

export { GenerateTextureSystem };
//# sourceMappingURL=GenerateTextureSystem.mjs.map
