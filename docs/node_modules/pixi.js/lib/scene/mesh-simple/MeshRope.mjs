import { definedProps } from '../container/utils/definedProps.mjs';
import { Mesh } from '../mesh/shared/Mesh.mjs';
import { RopeGeometry } from './RopeGeometry.mjs';

"use strict";
const _MeshRope = class _MeshRope extends Mesh {
  /**
   * Note: The wrap mode of the texture is set to REPEAT if `textureScale` is positive.
   * @param options
   * @param options.texture - The texture to use on the rope.
   * @param options.points - An array of {@link math.Point} objects to construct this rope.
   * @param {number} options.textureScale - Optional. Positive values scale rope texture
   * keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
   * and downsampling here. If set to zero, texture will be stretched instead.
   */
  constructor(options) {
    const { texture, points, textureScale, ...rest } = { ..._MeshRope.defaultOptions, ...options };
    const ropeGeometry = new RopeGeometry(definedProps({ width: texture.height, points, textureScale }));
    if (textureScale > 0) {
      texture.source.style.addressMode = "repeat";
    }
    super(definedProps({
      ...rest,
      texture,
      geometry: ropeGeometry
    }));
    this.autoUpdate = true;
    this.onRender = this._render;
  }
  _render() {
    const geometry = this.geometry;
    if (this.autoUpdate || geometry._width !== this.texture.height) {
      geometry._width = this.texture.height;
      geometry.update();
    }
  }
};
_MeshRope.defaultOptions = {
  textureScale: 0
};
let MeshRope = _MeshRope;

export { MeshRope };
//# sourceMappingURL=MeshRope.mjs.map
