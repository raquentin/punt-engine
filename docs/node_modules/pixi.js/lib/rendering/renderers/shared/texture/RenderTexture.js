'use strict';

var TextureSource = require('./sources/TextureSource.js');
var Texture = require('./Texture.js');

"use strict";
class RenderTexture extends Texture.Texture {
  static create(options) {
    return new RenderTexture({
      source: new TextureSource.TextureSource(options)
    });
  }
  /**
   * Resizes the render texture.
   * @param width - The new width of the render texture.
   * @param height - The new height of the render texture.
   * @param resolution - The new resolution of the render texture.
   * @returns This texture.
   */
  resize(width, height, resolution) {
    this.source.resize(width, height, resolution);
    return this;
  }
}

exports.RenderTexture = RenderTexture;
//# sourceMappingURL=RenderTexture.js.map
