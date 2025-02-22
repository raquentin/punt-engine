'use strict';

var Matrix = require('../../../maths/matrix/Matrix.js');
var Point = require('../../../maths/point/Point.js');
var getGlobalBounds = require('../bounds/getGlobalBounds.js');

"use strict";
const toLocalGlobalMixin = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(point = new Point.Point(), skipUpdate = false) {
    if (this.parent) {
      this.parent.toGlobal(this._position, point, skipUpdate);
    } else {
      point.x = this._position.x;
      point.y = this._position.y;
    }
    return point;
  },
  /**
   * Calculates the global position of the container.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   * @memberof scene.Container#
   */
  toGlobal(position, point, skipUpdate = false) {
    if (!skipUpdate) {
      this.updateLocalTransform();
      const globalMatrix = getGlobalBounds.updateTransformBackwards(this, new Matrix.Matrix());
      globalMatrix.append(this.localTransform);
      return globalMatrix.apply(position, point);
    }
    return this.worldTransform.apply(position, point);
  },
  /**
   * Calculates the local position of the container relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The Container to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   * @memberof scene.Container#
   */
  toLocal(position, from, point, skipUpdate) {
    if (from) {
      position = from.toGlobal(position, point, skipUpdate);
    }
    if (!skipUpdate) {
      this.updateLocalTransform();
      const globalMatrix = getGlobalBounds.updateTransformBackwards(this, new Matrix.Matrix());
      globalMatrix.append(this.localTransform);
      return globalMatrix.applyInverse(position, point);
    }
    return this.worldTransform.applyInverse(position, point);
  }
};

exports.toLocalGlobalMixin = toLocalGlobalMixin;
//# sourceMappingURL=toLocalGlobalMixin.js.map
