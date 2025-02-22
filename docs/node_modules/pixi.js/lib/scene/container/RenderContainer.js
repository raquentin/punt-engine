'use strict';

var Bounds = require('./bounds/Bounds.js');
var Container = require('./Container.js');

"use strict";
class RenderContainer extends Container.Container {
  /**
   * @param options - The options for the container.
   */
  constructor(options) {
    if (typeof options === "function") {
      options = { render: options };
    }
    const { render, ...rest } = options;
    super({
      label: "RenderContainer",
      ...rest
    });
    this.batched = false;
    this._lastUsed = 0;
    this._lastInstructionTick = -1;
    /**
     * The local bounds of the sprite.
     * @type {rendering.Bounds}
     */
    this.bounds = new Bounds.Bounds();
    this.canBundle = false;
    this.renderPipeId = "customRender";
    if (render)
      this.render = render;
    this.containsPoint = options.containsPoint ?? (() => false);
    this.addBounds = options.addBounds ?? (() => false);
  }
  /**
   * An overridable function that can be used to render the object using the current renderer.
   * @param _renderer - The current renderer
   */
  render(_renderer) {
  }
}

exports.RenderContainer = RenderContainer;
//# sourceMappingURL=RenderContainer.js.map
