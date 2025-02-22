'use strict';

var Color = require('../../../../color/Color.js');
var Extensions = require('../../../../extensions/Extensions.js');
var Matrix = require('../../../../maths/matrix/Matrix.js');
var Rectangle = require('../../../../maths/shapes/Rectangle.js');
var Bounds = require('../../../../scene/container/bounds/Bounds.js');
var getLocalBounds = require('../../../../scene/container/bounds/getLocalBounds.js');
var Container = require('../../../../scene/container/Container.js');
var RenderTexture = require('../texture/RenderTexture.js');

"use strict";
const tempRect = new Rectangle.Rectangle();
const tempBounds = new Bounds.Bounds();
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
    if (options instanceof Container.Container) {
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
      clearColor = isRGBAArray ? clearColor : Color.Color.shared.setValue(clearColor).toArray();
    } else {
      clearColor = noColor;
    }
    const region = options.frame?.copyTo(tempRect) || getLocalBounds.getLocalBounds(container, tempBounds).rectangle;
    region.width = Math.max(region.width, 1 / resolution) | 0;
    region.height = Math.max(region.height, 1 / resolution) | 0;
    const target = RenderTexture.RenderTexture.create({
      ...options.textureSourceOptions,
      width: region.width,
      height: region.height,
      resolution,
      antialias
    });
    const transform = Matrix.Matrix.shared.translate(-region.x, -region.y);
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
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "textureGenerator"
};

exports.GenerateTextureSystem = GenerateTextureSystem;
//# sourceMappingURL=GenerateTextureSystem.js.map
