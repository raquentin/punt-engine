'use strict';

var Extensions = require('../../../../extensions/Extensions.js');

"use strict";
const _RenderableGCSystem = class _RenderableGCSystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this._managedRenderables = [];
    this._renderer = renderer;
  }
  init(options) {
    options = { ..._RenderableGCSystem.defaultOptions, ...options };
    this.maxUnusedTime = options.renderableGCMaxUnusedTime;
    this._frequency = options.renderableGCFrequency;
    this.enabled = options.renderableGCActive;
  }
  get enabled() {
    return !!this._handler;
  }
  set enabled(value) {
    if (this.enabled === value)
      return;
    if (value) {
      this._handler = this._renderer.scheduler.repeat(
        () => this.run(),
        this._frequency
      );
    } else {
      this._renderer.scheduler.cancel(this._handler);
    }
  }
  prerender() {
    this._now = performance.now();
  }
  addRenderable(renderable, instructionSet) {
    if (!this.enabled)
      return;
    renderable._lastUsed = this._now;
    if (renderable._lastInstructionTick === -1) {
      this._managedRenderables.push(renderable);
      renderable.once("destroyed", this._removeRenderable, this);
    }
    renderable._lastInstructionTick = instructionSet.tick;
  }
  /** Runs the scheduled garbage collection */
  run() {
    const now = performance.now();
    const managedRenderables = this._managedRenderables;
    const renderPipes = this._renderer.renderPipes;
    let offset = 0;
    for (let i = 0; i < managedRenderables.length; i++) {
      const renderable = managedRenderables[i];
      if (renderable === null) {
        offset++;
        continue;
      }
      const renderGroup = renderable.renderGroup ?? renderable.parentRenderGroup;
      const currentIndex = renderGroup?.instructionSet?.tick ?? -1;
      if (renderable._lastInstructionTick !== currentIndex && now - renderable._lastUsed > this.maxUnusedTime) {
        if (!renderable.destroyed) {
          const rp = renderPipes;
          rp[renderable.renderPipeId].destroyRenderable(renderable);
        }
        renderable._lastInstructionTick = -1;
        offset++;
        renderable.off("destroyed", this._removeRenderable, this);
      } else {
        managedRenderables[i - offset] = renderable;
      }
    }
    managedRenderables.length = managedRenderables.length - offset;
  }
  destroy() {
    this.enabled = false;
    this._renderer = null;
    this._managedRenderables.length = 0;
  }
  _removeRenderable(renderable) {
    const index = this._managedRenderables.indexOf(renderable);
    if (index >= 0) {
      renderable.off("destroyed", this._removeRenderable, this);
      this._managedRenderables[index] = null;
    }
  }
};
/** @ignore */
_RenderableGCSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem
  ],
  name: "renderableGC"
};
/** default options for the renderableGCSystem */
_RenderableGCSystem.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  renderableGCActive: true,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  renderableGCMaxUnusedTime: 6e4,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  renderableGCFrequency: 3e4
};
let RenderableGCSystem = _RenderableGCSystem;

exports.RenderableGCSystem = RenderableGCSystem;
//# sourceMappingURL=RenderableGCSystem.js.map
