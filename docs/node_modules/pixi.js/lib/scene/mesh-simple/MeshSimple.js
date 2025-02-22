'use strict';

var definedProps = require('../container/utils/definedProps.js');
var Mesh = require('../mesh/shared/Mesh.js');
var MeshGeometry = require('../mesh/shared/MeshGeometry.js');

"use strict";
class MeshSimple extends Mesh.Mesh {
  /**
   * @param options - Options to be used for construction
   */
  constructor(options) {
    const { texture, vertices, uvs, indices, topology, ...rest } = options;
    const geometry = new MeshGeometry.MeshGeometry(definedProps.definedProps({
      positions: vertices,
      uvs,
      indices,
      topology
    }));
    super(definedProps.definedProps({
      ...rest,
      texture,
      geometry
    }));
    this.autoUpdate = true;
    this.onRender = this._render;
  }
  /**
   * Collection of vertices data.
   * @type {Float32Array}
   */
  get vertices() {
    return this.geometry.getBuffer("aPosition").data;
  }
  set vertices(value) {
    this.geometry.getBuffer("aPosition").data = value;
  }
  _render() {
    if (this.autoUpdate) {
      this.geometry.getBuffer("aPosition").update();
    }
  }
}

exports.MeshSimple = MeshSimple;
//# sourceMappingURL=MeshSimple.js.map
