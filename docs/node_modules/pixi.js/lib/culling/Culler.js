'use strict';

var Bounds = require('../scene/container/bounds/Bounds.js');
var getGlobalBounds = require('../scene/container/bounds/getGlobalBounds.js');

"use strict";
const tempBounds = new Bounds.Bounds();
const _Culler = class _Culler {
  /**
   * Culls the children of a specific container based on the given view. This will also cull items that are not
   * being explicitly managed by the culler.
   * @param container - The container to cull.
   * @param view - The view rectangle.
   * @param skipUpdateTransform - Whether to skip updating the transform.
   */
  cull(container, view, skipUpdateTransform = true) {
    this._cullRecursive(container, view, skipUpdateTransform);
  }
  _cullRecursive(container, view, skipUpdateTransform = true) {
    if (container.cullable && container.measurable && container.includeInBuild) {
      const bounds = container.cullArea ?? getGlobalBounds.getGlobalBounds(container, skipUpdateTransform, tempBounds);
      container.culled = bounds.x >= view.x + view.width || bounds.y >= view.y + view.height || bounds.x + bounds.width <= view.x || bounds.y + bounds.height <= view.y;
    } else {
      container.culled = false;
    }
    if (!container.cullableChildren || container.culled || !container.renderable || !container.measurable || !container.includeInBuild)
      return;
    for (let i = 0; i < container.children.length; i++) {
      this._cullRecursive(container.children[i], view, skipUpdateTransform);
    }
  }
};
/** A shared instance of the Culler class. */
_Culler.shared = new _Culler();
let Culler = _Culler;

exports.Culler = Culler;
//# sourceMappingURL=Culler.js.map
