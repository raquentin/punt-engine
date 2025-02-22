import { definedProps } from '../container/utils/definedProps.mjs';
import { Mesh } from '../mesh/shared/Mesh.mjs';
import { MeshGeometry } from '../mesh/shared/MeshGeometry.mjs';

"use strict";
class MeshSimple extends Mesh {
  /**
   * @param options - Options to be used for construction
   */
  constructor(options) {
    const { texture, vertices, uvs, indices, topology, ...rest } = options;
    const geometry = new MeshGeometry(definedProps({
      positions: vertices,
      uvs,
      indices,
      topology
    }));
    super(definedProps({
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

export { MeshSimple };
//# sourceMappingURL=MeshSimple.mjs.map
