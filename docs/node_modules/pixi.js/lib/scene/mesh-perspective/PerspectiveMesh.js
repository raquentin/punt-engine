'use strict';

var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var definedProps = require('../container/utils/definedProps.js');
var Mesh = require('../mesh/shared/Mesh.js');
var PerspectivePlaneGeometry = require('./PerspectivePlaneGeometry.js');

"use strict";
const _PerspectiveMesh = class _PerspectiveMesh extends Mesh.Mesh {
  /**
   * @param options - Options to be applied to PerspectiveMesh
   */
  constructor(options) {
    options = { ..._PerspectiveMesh.defaultOptions, ...options };
    const { texture, verticesX, verticesY, ...rest } = options;
    const planeGeometry = new PerspectivePlaneGeometry.PerspectivePlaneGeometry(definedProps.definedProps({
      width: texture.width,
      height: texture.height,
      verticesX,
      verticesY
    }));
    super(definedProps.definedProps({ ...rest, geometry: planeGeometry }));
    this._texture = texture;
    this.geometry.setCorners(
      options.x0,
      options.y0,
      options.x1,
      options.y1,
      options.x2,
      options.y2,
      options.x3,
      options.y3
    );
  }
  /** Update the geometry when the texture is updated */
  textureUpdated() {
    const geometry = this.geometry;
    if (!geometry)
      return;
    const { width, height } = this.texture;
    if (geometry.width !== width || geometry.height !== height) {
      geometry.width = width;
      geometry.height = height;
      geometry.updateProjection();
    }
  }
  set texture(value) {
    if (this._texture === value)
      return;
    super.texture = value;
    this.textureUpdated();
  }
  /** The texture that the mesh uses */
  get texture() {
    return this._texture;
  }
  /**
   * Set the corners of the quad to the given coordinates
   * The mesh will then calculate the perspective so it looks correct!
   * @param x0 - x coordinate of the first corner
   * @param y0 - y coordinate of the first corner
   * @param x1 - x coordinate of the second corner
   * @param y1 - y coordinate of the second corner
   * @param x2 - x coordinate of the third corner
   * @param y2 - y coordinate of the third corner
   * @param x3 - x coordinate of the fourth corner
   * @param y3 - y coordinate of the fourth corner
   */
  setCorners(x0, y0, x1, y1, x2, y2, x3, y3) {
    this.geometry.setCorners(x0, y0, x1, y1, x2, y2, x3, y3);
  }
};
/** default options for the mesh */
_PerspectiveMesh.defaultOptions = {
  texture: Texture.Texture.WHITE,
  verticesX: 10,
  verticesY: 10,
  x0: 0,
  y0: 0,
  x1: 100,
  y1: 0,
  x2: 100,
  y2: 100,
  x3: 0,
  y3: 100
};
let PerspectiveMesh = _PerspectiveMesh;

exports.PerspectiveMesh = PerspectiveMesh;
//# sourceMappingURL=PerspectiveMesh.js.map
