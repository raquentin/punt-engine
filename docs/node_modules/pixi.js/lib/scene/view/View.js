'use strict';

var Bounds = require('../container/bounds/Bounds.js');
var Container = require('../container/Container.js');

"use strict";
class ViewContainer extends Container.Container {
  constructor() {
    super(...arguments);
    /** @private */
    this.canBundle = true;
    /** @private */
    this.allowChildren = false;
    /** @private */
    this._roundPixels = 0;
    /** @private */
    this._lastUsed = 0;
    /** @private */
    this._lastInstructionTick = -1;
    this._bounds = new Bounds.Bounds(0, 1, 0, 0);
    this._boundsDirty = true;
  }
  /** @private */
  _updateBounds() {
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(value) {
    this._roundPixels = value ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const bounds = this.bounds;
    const { x, y } = point;
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
  }
  destroy(options) {
    super.destroy(options);
    this._bounds = null;
  }
}

exports.ViewContainer = ViewContainer;
//# sourceMappingURL=View.js.map
